
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash, AlertCircle } from "lucide-react";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import formFields from "@/data/formFields.json";
import { 
  ConsentTemplate, 
  ConsentTemplateMap, 
  ConsentTemplatesMap,
  Duration,
  validateDuration,
  parseFrequencyString,
  parsePeriodString
} from "@/validation/consentParametersSchema";
import { useToast } from "@/hooks/use-toast";

// Type-safe access to formFields.consentTemplates
const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;

// Get usecase categories based on regulator
const getUsecaseCategories = (regulator: string) => {
  const categories = new Set<string>();
  
  // Add categories for the specific regulator
  if (consentTemplates[regulator]) {
    Object.values(consentTemplates[regulator]).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          if (t.usecaseCategory) categories.add(t.usecaseCategory);
        });
      } else if (template.usecaseCategory) {
        categories.add(template.usecaseCategory);
      }
    });
  }
  
  // Add categories from the "All" regulator
  if (consentTemplates["All"]) {
    Object.values(consentTemplates["All"]).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          if (t.usecaseCategory) categories.add(t.usecaseCategory);
        });
      } else if (template.usecaseCategory) {
        categories.add(template.usecaseCategory);
      }
    });
  }
  
  return Array.from(categories);
};

// Get purpose codes based on regulator and usecase category
const getPurposeCodes = (regulator: string, usecaseCategory: string) => {
  if (!regulator || !usecaseCategory) return [];
  
  const templates = consentTemplates;
  let codes: string[] = [];
  
  // Function to extract purpose codes from templates
  const extractPurposeCodes = (regulatorTemplates: ConsentTemplateMap) => {
    Object.entries(regulatorTemplates).forEach(([code, templateData]) => {
      if (Array.isArray(templateData)) {
        // Check if any template in the array matches the usecase category
        if (templateData.some(t => t.usecaseCategory === usecaseCategory)) {
          codes.push(code);
        }
      } else if (templateData.usecaseCategory === usecaseCategory) {
        codes.push(code);
      }
    });
  };
  
  // Get purpose codes for the specific regulator
  if (templates[regulator]) {
    extractPurposeCodes(templates[regulator]);
  }
  
  // Add "All" regulator codes
  if (templates["All"]) {
    extractPurposeCodes(templates["All"]);
  }
  
  // Remove duplicates
  return [...new Set(codes)];
};

// Interface for duration inputs
interface DurationInputProps {
  value: Duration | undefined;
  onChange: (value: Duration) => void;
  units: string[];
  placeholder?: string;
  maxValue?: Duration | null;
  error?: string;
  targetUnit?: string;
}

const DurationInput = ({ 
  value, 
  onChange, 
  units, 
  placeholder,
  maxValue,
  error,
  targetUnit
}: DurationInputProps) => {
  const handleNumberChange = (numValue: string) => {
    // Store in the user-selected unit
    onChange({ number: numValue, unit: value?.unit || units[0] });
  };
  
  // Dynamic validation based on unit changes
  useEffect(() => {
    if (value?.number && value.unit && maxValue) {
      // This will trigger validation when unit changes
      handleNumberChange(value.number);
    }
  }, [value?.unit]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          type="number"
          min="1"
          value={value?.number || ""}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={placeholder || "Enter number"}
          className="w-24"
        />
        <Select
          value={value?.unit || units[0]}
          onValueChange={(unit) => onChange({ number: value?.number || "", unit })}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <p className="text-destructive text-sm flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Component for frequency input with static "times" label
const FrequencyInput = ({ 
  value, 
  onChange, 
  units,
  maxValue,
  error
}: Omit<DurationInputProps, 'placeholder'>) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <Input 
          type="number"
          min="1"
          value={value?.number || ""}
          onChange={(e) => onChange({ 
            number: e.target.value, 
            unit: value?.unit || units[0] 
          })}
          className="w-24"
        />
        <span className="text-sm font-medium">times</span>
        <Select
          value={value?.unit || units[0]}
          onValueChange={(unit) => onChange({ 
            number: value?.number || "", 
            unit 
          })}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <p className="text-destructive text-sm flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

// Function to get the appropriate template based on filters
const getFilteredTemplate = (
  regulator: string, 
  purposeCode: string, 
  usecaseCategory: string
): ConsentTemplate | null => {
  // Check if there's a specific template for this regulator and purpose code
  if (consentTemplates[regulator] && consentTemplates[regulator][purposeCode]) {
    const regulatorTemplate = consentTemplates[regulator][purposeCode];
    
    // If it's an array, find the one matching the usecase category
    if (Array.isArray(regulatorTemplate)) {
      const matchingTemplate = regulatorTemplate.find(
        t => t.usecaseCategory === usecaseCategory
      );
      if (matchingTemplate) return matchingTemplate;
    } 
    // If it's a single template and matches the usecase
    else if (regulatorTemplate.usecaseCategory === usecaseCategory) {
      return regulatorTemplate;
    }
  }
  
  // If not found, try the "All" regulator
  if (consentTemplates["All"] && consentTemplates["All"][purposeCode]) {
    const allTemplate = consentTemplates["All"][purposeCode];
    
    if (Array.isArray(allTemplate)) {
      const matchingTemplate = allTemplate.find(
        t => t.usecaseCategory === usecaseCategory
      );
      if (matchingTemplate) return matchingTemplate;
    } 
    else if (allTemplate.usecaseCategory === usecaseCategory) {
      return allTemplate;
    }
  }
  
  return null;
};

const ConsentParamItem = ({ 
  index,
  control,
  onRemove,
  watch,
  setValue,
  regulator,
}: { 
  index: number;
  control: any;
  onRemove: () => void;
  watch: any;
  setValue: any;
  regulator: string;
}) => {
  const { toast } = useToast();
  const usecaseCategory = watch(`consentParams.${index}.usecaseCategory`) || "";
  const purposeCode = watch(`consentParams.${index}.purposeCode`) || "";
  const fetchType = watch(`consentParams.${index}.fetchType`) || "Onetime";
  const consentTypes = watch(`consentParams.${index}.consentType`) || [];
  const fiTypes = watch(`consentParams.${index}.fiTypes`) || [];
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{
    consentValidity?: string;
    frequency?: string;
    fiDataRange?: string;
    dataLife?: string;
    consentType?: string;
    fiTypes?: string;
  }>({});
  
  // Get filtered values based on current selections
  const usecaseCategories = getUsecaseCategories(regulator);
  const purposeCodes = getPurposeCodes(regulator, usecaseCategory);
  
  // Get the template that matches current filters
  const currentTemplate = usecaseCategory && purposeCode 
    ? getFilteredTemplate(regulator, purposeCode, usecaseCategory) 
    : null;
  
  // Extract rules from the template
  const allowedFiTypes = currentTemplate?.fiTypes || [];
  const requiredFetchType = currentTemplate?.fetchType || null;
  const allowedConsentTypes = currentTemplate?.consentType || [];
  
  // Max values with parsed object structure
  const maxFrequency = currentTemplate?.maxFrequency ? parseFrequencyString(currentTemplate.maxFrequency) : null;
  const maxFiDataRange = currentTemplate?.maxFiDataRange ? parsePeriodString(currentTemplate.maxFiDataRange) : null;
  const maxConsentValidity = currentTemplate?.maxConsentValidity ? parsePeriodString(currentTemplate.maxConsentValidity) : null;
  const maxDataLife = currentTemplate?.maxDataLife ? parsePeriodString(currentTemplate.maxDataLife) : null;
  
  // Set fetch type from template when purpose code changes
  useEffect(() => {
    if (currentTemplate?.fetchType) {
      setValue(`consentParams.${index}.fetchType`, 
        currentTemplate.fetchType === "ONE-TIME" ? "Onetime" : "Periodic"
      );
    }
  }, [currentTemplate, setValue, index]);
  
  // Clear invalid consent types when FI Types change
  useEffect(() => {
    if (fiTypes.length > 0 && allowedConsentTypes.length > 0) {
      // Get the current invalid types
      const currentConsentTypes = watch(`consentParams.${index}.consentType`) || [];
      const invalidTypes = currentConsentTypes.filter(
        (type: string) => !allowedConsentTypes.includes(type)
      );
      
      // If there are invalid types, remove them and notify the user
      if (invalidTypes.length > 0) {
        const validTypes = currentConsentTypes.filter(
          (type: string) => allowedConsentTypes.includes(type)
        );
        
        setValue(`consentParams.${index}.consentType`, validTypes);
        
        if (invalidTypes.length > 0) {
          toast({
            title: "Consent Types Updated",
            description: `Some consent types were removed because they are not allowed for the selected template.`,
            variant: "destructive",
          });
        }
      }
    }
  }, [fiTypes, allowedConsentTypes, index, setValue, watch, toast]);
  
  // Validate values when template or key value changes
  useEffect(() => {
    if (!currentTemplate) {
      setValidationErrors({});
      return;
    }
    
    const errors: any = {};
    
    // Validate consent validity
    const consentValidity = watch(`consentParams.${index}.consentValidityPeriod`);
    if (consentValidity?.number && maxConsentValidity) {
      const validationError = validateDuration(consentValidity, maxConsentValidity);
      if (validationError) {
        errors.consentValidity = validationError;
      }
    } else {
      // Clear error if no input value or if the value is valid
      delete errors.consentValidity;
    }
    
    // Validate frequency
    if (fetchType === "Periodic") {
      const frequency = watch(`consentParams.${index}.dataFetchFrequency`);
      if (frequency?.number && maxFrequency) {
        const validationError = validateDuration(frequency, maxFrequency);
        if (validationError) {
          errors.frequency = validationError;
        }
      } else {
        // Clear error if no input value or if the value is valid
        delete errors.frequency;
      }
    } else {
      // Clear frequency error if fetch type is not Periodic
      delete errors.frequency;
    }
    
    // Validate FI data range
    const fiDataRange = watch(`consentParams.${index}.fiDataRange`);
    if (fiDataRange?.number && maxFiDataRange) {
      const validationError = validateDuration(fiDataRange, maxFiDataRange);
      if (validationError) {
        errors.fiDataRange = validationError;
      }
    } else {
      // Clear error if no input value or if the value is valid
      delete errors.fiDataRange;
    }
    
    // Validate data life
    const dataLife = watch(`consentParams.${index}.dataLife`);
    if (dataLife?.number && maxDataLife) {
      const validationError = validateDuration(dataLife, maxDataLife);
      if (validationError) {
        errors.dataLife = validationError;
      }
    } else {
      // Clear error if no input value or if the value is valid
      delete errors.dataLife;
    }
    
    // Validate consent types
    const currentConsentTypes = watch(`consentParams.${index}.consentType`) || [];
    if (currentConsentTypes.length > 0 && allowedConsentTypes.length > 0) {
      const invalidTypes = currentConsentTypes.filter(
        (type: string) => !allowedConsentTypes.includes(type)
      );
      
      if (invalidTypes.length > 0) {
        errors.consentType = `Only ${allowedConsentTypes.join(', ')} are allowed for this template`;
      }
    }
    
    // Validate FI types
    const currentFiTypes = watch(`consentParams.${index}.fiTypes`) || [];
    if (currentFiTypes.length > 0 && allowedFiTypes.length > 0) {
      const invalidTypes = currentFiTypes.filter(
        (type: string) => !allowedFiTypes.includes(type)
      );
      
      if (invalidTypes.length > 0) {
        errors.fiTypes = `Only specific FI types are allowed for this template`;
      }
    }
    
    // Update validation errors state
    setValidationErrors(errors);
  }, [
    currentTemplate, usecaseCategory, purposeCode, fetchType, 
    watch, index, allowedConsentTypes, allowedFiTypes,
    consentTypes, fiTypes
  ]);
  
  // Re-validate when user inputs new values
  useEffect(() => {
    const consentValidity = watch(`consentParams.${index}.consentValidityPeriod`);
    if (consentValidity) {
      // Re-validate to clear or set error
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (maxConsentValidity) {
          const error = validateDuration(consentValidity, maxConsentValidity);
          if (error) {
            newErrors.consentValidity = error;
          } else {
            delete newErrors.consentValidity;
          }
        }
        return newErrors;
      });
    }
    
    const fiDataRange = watch(`consentParams.${index}.fiDataRange`);
    if (fiDataRange) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (maxFiDataRange) {
          const error = validateDuration(fiDataRange, maxFiDataRange);
          if (error) {
            newErrors.fiDataRange = error;
          } else {
            delete newErrors.fiDataRange;
          }
        }
        return newErrors;
      });
    }
    
    const dataLife = watch(`consentParams.${index}.dataLife`);
    if (dataLife) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (maxDataLife) {
          const error = validateDuration(dataLife, maxDataLife);
          if (error) {
            newErrors.dataLife = error;
          } else {
            delete newErrors.dataLife;
          }
        }
        return newErrors;
      });
    }
    
    if (fetchType === "Periodic") {
      const frequency = watch(`consentParams.${index}.dataFetchFrequency`);
      if (frequency) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          if (maxFrequency) {
            const error = validateDuration(frequency, maxFrequency);
            if (error) {
              newErrors.frequency = error;
            } else {
              delete newErrors.frequency;
            }
          }
          return newErrors;
        });
      }
    }
  }, [
    watch(`consentParams.${index}.consentValidityPeriod`),
    watch(`consentParams.${index}.fiDataRange`),
    watch(`consentParams.${index}.dataLife`),
    watch(`consentParams.${index}.dataFetchFrequency`),
    fetchType,
    maxConsentValidity,
    maxFiDataRange,
    maxDataLife,
    maxFrequency,
    index,
    watch
  ]);
  
  return (
    <div className="border rounded-md">
      <table className="w-full">
        <tbody>
          <tr className="border-b">
            <td className="p-3 font-medium w-1/4 border-r bg-muted/30">Usecase category:</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.usecaseCategory`}
                render={({ field }) => (
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset dependent fields
                        setValue(`consentParams.${index}.purposeCode`, "");
                        setValue(`consentParams.${index}.fiTypes`, []);
                        setValue(`consentParams.${index}.consentType`, []);
                        // Clear validation errors when changing usecase
                        setValidationErrors({});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select usecase category" />
                      </SelectTrigger>
                      <SelectContent>
                        {usecaseCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
            </td>
          </tr>
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">Purpose code</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.purposeCode`}
                render={({ field }) => (
                  <FormControl>
                    <ToggleButtonGroup
                      options={purposeCodes}
                      value={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        // Reset dependent fields
                        setValue(`consentParams.${index}.fiTypes`, []);
                        setValue(`consentParams.${index}.consentType`, []);
                        // Clear validation errors when changing purpose code
                        setValidationErrors({});
                      }}
                    />
                  </FormControl>
                )}
              />
            </td>
          </tr>
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">Purpose text</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.purposeText`}
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Enter purpose text" />
                  </FormControl>
                )}
              />
            </td>
          </tr>
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">Consent validity period</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.consentValidityPeriod`}
                render={({ field }) => (
                  <FormControl>
                    <DurationInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // Directly validate and update error state
                        if (maxConsentValidity) {
                          const error = validateDuration(value, maxConsentValidity);
                          setValidationErrors(prev => ({
                            ...prev, 
                            consentValidity: error
                          }));
                        }
                      }}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxConsentValidity}
                      error={validationErrors.consentValidity}
                      targetUnit={maxConsentValidity?.unit}
                    />
                  </FormControl>
                )}
              />
              {maxConsentValidity && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {maxConsentValidity.number} {maxConsentValidity.unit}
                  {Number(maxConsentValidity.number) !== 1 ? 's' : ''}
                </p>
              )}
            </td>
          </tr>
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">Fetch type</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.fetchType`}
                render={({ field }) => (
                  <FormControl>
                    {requiredFetchType ? (
                      <div>
                        <p className="text-sm">
                          {requiredFetchType === "ONE-TIME" ? "Onetime" : "Periodic"}
                        </p>
                        <input
                          type="hidden"
                          value={requiredFetchType === "ONE-TIME" ? "Onetime" : "Periodic"}
                          onChange={() => {
                            field.onChange(requiredFetchType === "ONE-TIME" ? "Onetime" : "Periodic");
                          }}
                        />
                        <p className="text-sm text-amber-600 mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> 
                          Only {requiredFetchType === "ONE-TIME" ? "Onetime" : "Periodic"} is allowed for this template
                        </p>
                      </div>
                    ) : (
                      <ToggleButtonGroup
                        options={["Onetime", "Periodic"]}
                        value={field.value || "Onetime"}
                        onChange={(value) => {
                          field.onChange(value);
                          // Clear frequency validation errors if switching from Periodic
                          if (value !== "Periodic") {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.frequency;
                              return newErrors;
                            });
                          }
                        }}
                      />
                    )}
                  </FormControl>
                )}
              />
            </td>
          </tr>
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">FI type</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.fiTypes`}
                render={({ field }) => (
                  <FormControl>
                    <div className="space-y-2">
                      {allowedFiTypes && allowedFiTypes.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {allowedFiTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`fiTypes-${type}-${index}`}
                                checked={(field.value || []).includes(type)}
                                onCheckedChange={(checked) => {
                                  const newValues = [...(field.value || [])];
                                  
                                  if (checked) {
                                    if (!newValues.includes(type)) {
                                      newValues.push(type);
                                    }
                                  } else {
                                    const typeIndex = newValues.indexOf(type);
                                    if (typeIndex > -1) {
                                      newValues.splice(typeIndex, 1);
                                    }
                                  }
                                  
                                  field.onChange(newValues);
                                  
                                  // Clear consent types when changing FI types
                                  if (allowedConsentTypes.length > 0) {
                                    const currentConsentTypes = watch(`consentParams.${index}.consentType`) || [];
                                    const validTypes = currentConsentTypes.filter(
                                      (cType: string) => allowedConsentTypes.includes(cType)
                                    );
                                    
                                    if (validTypes.length !== currentConsentTypes.length) {
                                      setValue(`consentParams.${index}.consentType`, validTypes);
                                    }
                                  }
                                }}
                              />
                              <label
                                htmlFor={`fiTypes-${type}-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          {usecaseCategory && purposeCode 
                            ? "No FI types available for this template" 
                            : "Select a valid combination of usecase category and purpose code to see allowed FI types"}
                        </p>
                      )}
                      
                      {validationErrors.fiTypes && (
                        <p className="text-destructive text-sm flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> {validationErrors.fiTypes}
                        </p>
                      )}
                    </div>
                  </FormControl>
                )}
              />
            </td>
          </tr>
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">Consent type</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.consentType`}
                render={({ field }) => (
                  <FormControl>
                    <div className="space-y-2">
                      <ToggleButtonGroup
                        options={allowedConsentTypes.length > 0 ? allowedConsentTypes : ["Profile", "Summary", "Transactions"]}
                        value={field.value || []}
                        onChange={(value) => {
                          field.onChange(value);
                          // Validate consent types
                          if (allowedConsentTypes.length > 0) {
                            const invalidTypes = (Array.isArray(value) ? value : [value]).filter(
                              (type) => !allowedConsentTypes.includes(type)
                            );
                            
                            if (invalidTypes.length > 0) {
                              setValidationErrors(prev => ({
                                ...prev,
                                consentType: `Only ${allowedConsentTypes.join(', ')} are allowed for this template`
                              }));
                            } else {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.consentType;
                                return newErrors;
                              });
                            }
                          }
                        }}
                        multiple={true}
                      />
                    
                      {Array.isArray(allowedConsentTypes) && allowedConsentTypes.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Allowed: {allowedConsentTypes.join(', ')}
                        </p>
                      )}
                      
                      {validationErrors.consentType && (
                        <p className="text-destructive text-sm flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> {validationErrors.consentType}
                        </p>
                      )}
                    </div>
                  </FormControl>
                )}
              />
            </td>
          </tr>
          
          {fetchType === "Periodic" && (
            <tr className="border-b">
              <td className="p-3 font-medium border-r bg-muted/30">Frequency</td>
              <td className="p-3">
                <FormField
                  control={control}
                  name={`consentParams.${index}.dataFetchFrequency`}
                  render={({ field }) => (
                    <FormControl>
                      <FrequencyInput
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          // Direct validation for frequency
                          if (maxFrequency) {
                            const error = validateDuration(value, maxFrequency);
                            setValidationErrors(prev => ({
                              ...prev, 
                              frequency: error
                            }));
                          }
                        }}
                        units={["Day", "Month", "Year"]}
                        maxValue={maxFrequency}
                        error={validationErrors.frequency}
                      />
                    </FormControl>
                  )}
                />
                {maxFrequency && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum allowed: {maxFrequency.number} times per {maxFrequency.unit}
                  </p>
                )}
              </td>
            </tr>
          )}
          
          <tr className="border-b">
            <td className="p-3 font-medium border-r bg-muted/30">FI data range</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.fiDataRange`}
                render={({ field }) => (
                  <FormControl>
                    <DurationInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // Direct validation for fiDataRange
                        if (maxFiDataRange) {
                          const error = validateDuration(value, maxFiDataRange);
                          setValidationErrors(prev => ({
                            ...prev, 
                            fiDataRange: error
                          }));
                        }
                      }}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxFiDataRange}
                      error={validationErrors.fiDataRange}
                      targetUnit={maxFiDataRange?.unit}
                    />
                  </FormControl>
                )}
              />
              {maxFiDataRange && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {maxFiDataRange.number} {maxFiDataRange.unit}
                  {Number(maxFiDataRange.number) !== 1 ? 's' : ''}
                </p>
              )}
            </td>
          </tr>
          
          <tr>
            <td className="p-3 font-medium border-r bg-muted/30">Data life</td>
            <td className="p-3">
              <FormField
                control={control}
                name={`consentParams.${index}.dataLife`}
                render={({ field }) => (
                  <FormControl>
                    <DurationInput
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        // Direct validation for dataLife
                        if (maxDataLife) {
                          const error = validateDuration(value, maxDataLife);
                          setValidationErrors(prev => ({
                            ...prev, 
                            dataLife: error
                          }));
                        }
                      }}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxDataLife}
                      error={validationErrors.dataLife}
                      targetUnit={maxDataLife?.unit}
                    />
                  </FormControl>
                )}
              />
              {maxDataLife && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {maxDataLife.number} {maxDataLife.unit}
                  {Number(maxDataLife.number) !== 1 ? 's' : ''}
                </p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="p-3 border-t flex justify-end">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          <Trash className="h-4 w-4 mr-2" /> Remove template
        </Button>
      </div>
    </div>
  );
};

const ConsentParametersForm = () => {
  const { control, watch, setValue } = useFormContext();
  const consentParams = watch("consentParams") || [];
  const regulator = watch("regulator");
  
  const addConsentParam = () => {
    const newParam = {
      usecaseCategory: "",
      purposeCode: "",
      purposeText: "",
      consentValidityPeriod: { number: "", unit: "Day" },
      fetchType: "Onetime",
      consentType: [],
      fiTypes: [],
      dataFetchFrequency: { number: "", unit: "Day" },
      fiDataRange: { number: "", unit: "Day" },
      dataLife: { number: "", unit: "Day" },
    };
    
    const updatedParams = [...consentParams, newParam];
    setValue("consentParams", updatedParams);
  };
  
  const removeConsentParam = (index: number) => {
    const updatedParams = consentParams.filter((_, i) => i !== index);
    setValue("consentParams", updatedParams);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Consent Parameters</h2>
      
      <FormField
        control={control}
        name="consentParams"
        render={() => (
          <FormItem>
            <div className="space-y-4">
              {!regulator && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Please select a regulator in the FIU Details section before configuring consent parameters.
                  </AlertDescription>
                </Alert>
              )}
              
              {consentParams.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No consent templates defined yet</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {consentParams.map((param, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        {param.usecaseCategory ? 
                          `${param.usecaseCategory} - PC: ${param.purposeCode}` : 
                          `Consent Template ${index + 1}`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ConsentParamItem
                          index={index}
                          control={control}
                          onRemove={() => removeConsentParam(index)}
                          watch={watch}
                          setValue={setValue}
                          regulator={regulator}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={addConsentParam}
                className="mt-4 w-full"
                disabled={!regulator}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Consent Template
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ConsentParametersForm;
