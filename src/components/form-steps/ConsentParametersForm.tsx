
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
  parsePeriodString,
  durationToString,
  convertDuration
} from "@/validation/consentParametersSchema";
import { useToast } from "@/hooks/use-toast";

const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;

// Define the DurationInputProps interface that was missing
interface DurationInputProps {
  value: Duration | undefined;
  onChange: (value: Duration) => void;
  units: string[];
  placeholder?: string;
  maxValue: Duration | null;
  error?: string;
  targetUnit?: string;
  required?: boolean;
}

const getUsecaseCategories = (regulator: string) => {
  const categories = new Set<string>();
  
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

const getPurposeCodes = (regulator: string, usecaseCategory: string) => {
  if (!regulator || !usecaseCategory) return [];
  
  const templates = consentTemplates;
  let codes: string[] = [];
  
  const extractPurposeCodes = (regulatorTemplates: ConsentTemplateMap) => {
    Object.entries(regulatorTemplates).forEach(([code, templateData]) => {
      if (Array.isArray(templateData)) {
        if (templateData.some(t => t.usecaseCategory === usecaseCategory)) {
          codes.push(code);
        }
      } else if (templateData.usecaseCategory === usecaseCategory) {
        codes.push(code);
      }
    });
  };
  
  if (templates[regulator]) {
    extractPurposeCodes(templates[regulator]);
  }
  
  if (templates["All"]) {
    extractPurposeCodes(templates["All"]);
  }
  
  return [...new Set(codes)];
};

const DurationInput = ({ 
  value, 
  onChange, 
  units, 
  placeholder,
  maxValue,
  error,
  targetUnit,
  required = false
}: DurationInputProps) => {
  const handleNumberChange = (numValue: string) => {
    onChange({ number: numValue, unit: value?.unit || units[0] });
  };

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
          required={required}
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

const FrequencyInput = ({ 
  value, 
  onChange, 
  units,
  maxValue,
  error,
  required = false
}: Omit<DurationInputProps, 'placeholder' | 'targetUnit'>) => {
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
          required={required}
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

const getFilteredTemplate = (
  regulator: string, 
  purposeCode: string, 
  usecaseCategory: string,
  fiType?: string
): ConsentTemplate | null => {
  // Try to find a template specific to the FI type first
  const findMatchingTemplate = (templates: ConsentTemplate | ConsentTemplate[]): ConsentTemplate | null => {
    if (Array.isArray(templates)) {
      // If fiType is provided, first look for a template specific to that FI type
      if (fiType) {
        const fiTypeSpecificTemplate = templates.find(
          t => t.usecaseCategory === usecaseCategory && 
               t.fiTypes?.includes(fiType)
        );
        
        if (fiTypeSpecificTemplate) return fiTypeSpecificTemplate;
      }
      
      // If no FI type specific template was found or no FI type was provided,
      // return the first template matching the usecase category
      const fallbackTemplate = templates.find(
        t => t.usecaseCategory === usecaseCategory
      );
      
      return fallbackTemplate || null;
    } 
    else if (templates.usecaseCategory === usecaseCategory) {
      return templates;
    }
    
    return null;
  };
  
  // First check regulator-specific templates
  if (consentTemplates[regulator] && consentTemplates[regulator][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates[regulator][purposeCode]);
    if (template) return template;
  }
  
  // If not found, check "All" templates
  if (consentTemplates["All"] && consentTemplates["All"][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates["All"][purposeCode]);
    if (template) return template;
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
  
  const [validationErrors, setValidationErrors] = useState<{
    consentValidity?: string;
    frequency?: string;
    fiDataRange?: string;
    dataLife?: string;
    consentType?: string;
    fiTypes?: string;
  }>({});
  
  const usecaseCategories = getUsecaseCategories(regulator);
  const purposeCodes = getPurposeCodes(regulator, usecaseCategory);
  
  // Get the current template based on the selected FI type (if any)
  const selectedFiType = fiTypes.length > 0 ? fiTypes[0] : undefined;
  const currentTemplate = usecaseCategory && purposeCode 
    ? getFilteredTemplate(regulator, purposeCode, usecaseCategory, selectedFiType) 
    : null;
  
  const allowedFiTypes = currentTemplate?.fiTypes || [];
  const requiredFetchType = currentTemplate?.fetchType || null;
  const allowedConsentTypes = currentTemplate?.consentType || [];
  
  const maxFrequency = currentTemplate?.maxFrequency ? parseFrequencyString(currentTemplate.maxFrequency) : null;
  const maxFiDataRange = currentTemplate?.maxFiDataRange ? parsePeriodString(currentTemplate.maxFiDataRange) : null;
  const maxConsentValidity = currentTemplate?.maxConsentValidity ? parsePeriodString(currentTemplate.maxConsentValidity) : null;
  const maxDataLife = currentTemplate?.maxDataLife ? parsePeriodString(currentTemplate.maxDataLife) : null;
  
  // Get whether fields are required by checking the consentParamFields in formFields.json
  const isFieldRequired = (fieldName: string): boolean => {
    const field = formFields.consentParameters?.consentParamFields?.find(f => f.id === fieldName);
    return field?.required === true;
  };
  
  useEffect(() => {
    setValidationErrors({});
  }, [currentTemplate]);
  
  // Update template values when FI type changes
  useEffect(() => {
    if (usecaseCategory && purposeCode && fiTypes.length > 0) {
      const newTemplate = getFilteredTemplate(regulator, purposeCode, usecaseCategory, fiTypes[0]);
      
      // Reset validation errors
      setValidationErrors({});
      
      // Update fetch type if required
      if (newTemplate?.fetchType) {
        setValue(`consentParams.${index}.fetchType`, 
          newTemplate.fetchType === "ONE-TIME" ? "Onetime" : "Periodic"
        );
      }
      
      // Convert and update duration fields based on template units
      const updateDurationField = (fieldName: string, maxValue: Duration | null) => {
        if (!maxValue) return;
        
        const currentValue = watch(`consentParams.${index}.${fieldName}`);
        if (currentValue && currentValue.number && maxValue.unit && currentValue.unit !== maxValue.unit) {
          // Convert to template unit
          const convertedValue = convertDuration(currentValue, maxValue.unit);
          setValue(`consentParams.${index}.${fieldName}`, convertedValue);
        }
      };
      
      updateDurationField('consentValidityPeriod', maxConsentValidity);
      updateDurationField('dataFetchFrequency', maxFrequency);
      updateDurationField('fiDataRange', maxFiDataRange);
      updateDurationField('dataLife', maxDataLife);
    }
  }, [fiTypes, usecaseCategory, purposeCode, regulator, setValue, index, watch]);
  
  useEffect(() => {
    if (currentTemplate?.fetchType) {
      setValue(`consentParams.${index}.fetchType`, 
        currentTemplate.fetchType === "ONE-TIME" ? "Onetime" : "Periodic"
      );
    }
  }, [currentTemplate, setValue, index]);
  
  useEffect(() => {
    if (allowedConsentTypes.length > 0) {
      const currentConsentTypes = watch(`consentParams.${index}.consentType`) || [];
      
      const invalidTypes = currentConsentTypes.filter(
        (type: string) => !allowedConsentTypes.includes(type)
      );
      
      if (invalidTypes.length > 0) {
        const validTypes = currentConsentTypes.filter(
          (type: string) => allowedConsentTypes.includes(type)
        );
        
        setValue(`consentParams.${index}.consentType`, validTypes);
        
        toast({
          title: "Consent Types Updated",
          description: `Some consent types were removed because they are not allowed for the selected template.`,
          variant: "destructive",
        });
      }
    }
  }, [allowedConsentTypes, index, setValue, watch, toast]);
  
  const validateField = (field: string, value: Duration | undefined, maxValue: Duration | null) => {
    if (!value || !maxValue) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof typeof prev];
        return newErrors;
      });
      return;
    }
    
    const error = validateDuration(value, maxValue);
    
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field as keyof typeof prev] = error;
      } else {
        delete newErrors[field as keyof typeof prev];
      }
      return newErrors;
    });
  };
  
  useEffect(() => {
    const consentValidity = watch(`consentParams.${index}.consentValidityPeriod`);
    validateField('consentValidity', consentValidity, maxConsentValidity);
  }, [watch(`consentParams.${index}.consentValidityPeriod`), maxConsentValidity]);
  
  useEffect(() => {
    const frequency = watch(`consentParams.${index}.dataFetchFrequency`);
    if (fetchType === "Periodic") {
      validateField('frequency', frequency, maxFrequency);
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.frequency;
        return newErrors;
      });
    }
  }, [watch(`consentParams.${index}.dataFetchFrequency`), maxFrequency, fetchType]);
  
  useEffect(() => {
    const fiDataRange = watch(`consentParams.${index}.fiDataRange`);
    validateField('fiDataRange', fiDataRange, maxFiDataRange);
  }, [watch(`consentParams.${index}.fiDataRange`), maxFiDataRange]);
  
  useEffect(() => {
    const dataLife = watch(`consentParams.${index}.dataLife`);
    validateField('dataLife', dataLife, maxDataLife);
  }, [watch(`consentParams.${index}.dataLife`), maxDataLife]);
  
  useEffect(() => {
    const currentConsentTypes = watch(`consentParams.${index}.consentType`) || [];
    
    if (currentConsentTypes.length > 0 && allowedConsentTypes.length > 0) {
      const invalidTypes = currentConsentTypes.filter(
        (type: string) => !allowedConsentTypes.includes(type)
      );
      
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (invalidTypes.length > 0) {
          newErrors.consentType = `Only ${allowedConsentTypes.join(', ')} are allowed for this template`;
        } else {
          delete newErrors.consentType;
        }
        return newErrors;
      });
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.consentType;
        return newErrors;
      });
    }
  }, [watch(`consentParams.${index}.consentType`), allowedConsentTypes]);
  
  useEffect(() => {
    const currentFiTypes = watch(`consentParams.${index}.fiTypes`) || [];
    
    if (currentFiTypes.length > 0 && allowedFiTypes.length > 0) {
      const invalidTypes = currentFiTypes.filter(
        (type: string) => !allowedFiTypes.includes(type)
      );
      
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        if (invalidTypes.length > 0) {
          newErrors.fiTypes = `Only specific FI types are allowed for this template`;
        } else {
          delete newErrors.fiTypes;
        }
        return newErrors;
      });
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.fiTypes;
        return newErrors;
      });
    }
  }, [watch(`consentParams.${index}.fiTypes`), allowedFiTypes]);
  
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
                        setValue(`consentParams.${index}.purposeCode`, "");
                        setValue(`consentParams.${index}.fiTypes`, []);
                        setValue(`consentParams.${index}.consentType`, []);
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
                        setValue(`consentParams.${index}.fiTypes`, []);
                        setValue(`consentParams.${index}.consentType`, []);
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
                    <Input {...field} placeholder="Enter purpose text" required={isFieldRequired('purposeText')} />
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
                        validateField('consentValidity', value, maxConsentValidity);
                      }}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxConsentValidity}
                      error={validationErrors.consentValidity}
                      targetUnit={maxConsentValidity?.unit}
                      required={isFieldRequired('consentValidityPeriod')}
                    />
                  </FormControl>
                )}
              />
              {maxConsentValidity && (
                <p className="text-sm text-muted-foreground mt-1">
                  {maxConsentValidity.unit === "tenure"
                    ? "Coterminous with loan tenure"
                    : `Maximum allowed: ${maxConsentValidity.number} ${maxConsentValidity.unit}${Number(maxConsentValidity.number) !== 1 ? 's' : ''}`
                  }
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
                        value={field.value || ""}
                        onChange={(value) => {
                          field.onChange(value || "Onetime");
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
                                  
                                  const currentConsentTypes = watch(`consentParams.${index}.consentType`) || [];
                                  
                                  if (allowedConsentTypes.length > 0 && currentConsentTypes.length > 0) {
                                    const invalidTypes = currentConsentTypes.filter(
                                      (cType: string) => !allowedConsentTypes.includes(cType)
                                    );
                                    
                                    if (invalidTypes.length > 0) {
                                      const validTypes = currentConsentTypes.filter(
                                        (cType: string) => allowedConsentTypes.includes(cType)
                                      );
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
                          const selectedValues = Array.isArray(value) ? value : [];
                          if (allowedConsentTypes.length === 0 || 
                              selectedValues.every(v => allowedConsentTypes.includes(v))) {
                            field.onChange(selectedValues);
                          } else {
                            const validValues = selectedValues.filter(
                              v => allowedConsentTypes.includes(v)
                            );
                            field.onChange(validValues);
                            
                            if (validValues.length !== selectedValues.length) {
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
                          validateField('frequency', value, maxFrequency);
                        }}
                        units={["Day", "Month", "Year"]}
                        maxValue={maxFrequency}
                        error={validationErrors.frequency}
                        required={isFieldRequired('dataFetchFrequency')}
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
                        validateField('fiDataRange', value, maxFiDataRange);
                      }}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxFiDataRange}
                      error={validationErrors.fiDataRange}
                      targetUnit={maxFiDataRange?.unit}
                      required={isFieldRequired('fiDataRange')}
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
                        validateField('dataLife', value, maxDataLife);
                      }}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxDataLife}
                      error={validationErrors.dataLife}
                      targetUnit={maxDataLife?.unit}
                      required={isFieldRequired('dataLife')}
                    />
                  </FormControl>
                )}
              />
              {maxDataLife && (
                <p className="text-sm text-muted-foreground mt-1">
                  {maxDataLife.unit === "tenure"
                    ? "Coterminous with loan tenure"
                    : `Maximum allowed: ${maxDataLife.number} ${maxDataLife.unit}${Number(maxDataLife.number) !== 1 ? 's' : ''}`
                  }
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
