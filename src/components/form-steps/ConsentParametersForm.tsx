
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

// Get unique usecase categories from consent templates
const getUsecaseCategories = () => {
  const categories = new Set<string>();
  
  Object.values(formFields.consentTemplates).forEach(regulatorTemplates => {
    Object.values(regulatorTemplates).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          if (t.usecaseCategory) categories.add(t.usecaseCategory);
        });
      } else if (template.usecaseCategory) {
        categories.add(template.usecaseCategory);
      }
    });
  });
  
  return Array.from(categories);
};

// Interface for duration inputs
interface DurationInputProps {
  value: {number: string; unit: string;} | undefined;
  onChange: (value: {number: string; unit: string;}) => void;
  units: string[];
  placeholder?: string;
  maxValue?: number;
  error?: string;
}

const DurationInput = ({ 
  value, 
  onChange, 
  units, 
  placeholder,
  maxValue,
  error
}: DurationInputProps) => {
  const handleNumberChange = (numValue: string) => {
    // If number exceeds max value, cap it
    if (maxValue && parseInt(numValue) > maxValue) {
      numValue = maxValue.toString();
    }
    
    onChange({ number: numValue, unit: value?.unit || units[0] });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          type="number"
          min="1"
          max={maxValue}
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
          max={maxValue}
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

// Parse template strings like "31 times per month" to extract value and unit
const parseFrequencyString = (frequencyStr: string): { number: string, unit: string } | null => {
  if (!frequencyStr || frequencyStr === "NA") return null;
  
  const regex = /(\d+)\s+times?\s+per\s+(\w+)/i;
  const match = frequencyStr.match(regex);
  
  if (match) {
    return {
      number: match[1],
      unit: match[2].toLowerCase()
    };
  }
  
  return null;
};

// Parse period strings like "1 Month", "6 months", "20 years"
const parsePeriodString = (periodStr: string): { number: string, unit: string } | null => {
  if (!periodStr || periodStr === "NA") return null;
  
  // Handle special cases
  if (periodStr.toLowerCase().includes("coterminous")) {
    return {
      number: "999", // Special value for coterminous
      unit: "tenure"
    };
  }
  
  const regex = /(\d+)\s+(\w+)/i;
  const match = periodStr.match(regex);
  
  if (match) {
    let unit = match[2].toLowerCase();
    // Convert to singular form if needed
    if (unit.endsWith('s')) unit = unit.slice(0, -1);
    
    return {
      number: match[1],
      unit: unit
    };
  }
  
  return null;
};

// Function to get the appropriate template based on filters
const getFilteredTemplate = (
  regulator: string, 
  purposeCode: string, 
  usecaseCategory: string
) => {
  const templates = formFields.consentTemplates;
  
  // Check if there's a specific template for this regulator and purpose code
  if (templates[regulator] && templates[regulator][purposeCode]) {
    const regulatorTemplate = templates[regulator][purposeCode];
    
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
  if (templates["All"] && templates["All"][purposeCode]) {
    const allTemplate = templates["All"][purposeCode];
    
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

// Get purpose codes based on regulator
const getPurposeCodes = (regulator: string) => {
  if (!regulator) return [];
  
  const templates = formFields.consentTemplates;
  let codes: string[] = [];
  
  // Get purpose codes for the specific regulator
  if (templates[regulator]) {
    codes = Object.keys(templates[regulator]);
  }
  
  // Add "All" regulator codes
  if (templates["All"]) {
    codes = [...codes, ...Object.keys(templates["All"])];
  }
  
  // Remove duplicates
  return [...new Set(codes)];
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
  const usecaseCategory = watch(`consentParams.${index}.usecaseCategory`) || "";
  const purposeCode = watch(`consentParams.${index}.purposeCode`) || "";
  const fetchType = watch(`consentParams.${index}.fetchType`) || "Onetime";
  const consentTypes = watch(`consentParams.${index}.consentType`) || [];
  const fiTypes = watch(`consentParams.${index}.fiTypes`) || [];
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    consentValidity?: string;
    frequency?: string;
    fiDataRange?: string;
    dataLife?: string;
  }>({});
  
  // Get filtered values based on current selections
  const purposeCodes = getPurposeCodes(regulator);
  const usecaseCategories = getUsecaseCategories();
  
  // Get the template that matches current filters
  const currentTemplate = usecaseCategory && purposeCode 
    ? getFilteredTemplate(regulator, purposeCode, usecaseCategory) 
    : null;
  
  // Extract rules from the template
  const allowedFiTypes = currentTemplate?.fiTypes || [];
  const requiredFetchType = currentTemplate?.fetchType || null;
  const allowedConsentTypes = currentTemplate?.consentType?.join(', ') || null;
  
  // Max values with parsed object structure
  const maxFrequency = currentTemplate?.maxFrequency ? parseFrequencyString(currentTemplate.maxFrequency) : null;
  const maxFiDataRange = currentTemplate?.maxFiDataRange ? parsePeriodString(currentTemplate.maxFiDataRange) : null;
  const maxConsentValidity = currentTemplate?.maxConsentValidity ? parsePeriodString(currentTemplate.maxConsentValidity) : null;
  const maxDataLife = currentTemplate?.maxDataLife ? parsePeriodString(currentTemplate.maxDataLife) : null;
  
  // Validate values when template or key value changes
  useEffect(() => {
    if (!currentTemplate) return;
    
    const errors: any = {};
    
    // Validate consent validity
    const consentValidity = watch(`consentParams.${index}.consentValidityPeriod`);
    if (consentValidity && maxConsentValidity) {
      const currentUnit = consentValidity.unit.toLowerCase();
      const maxUnit = maxConsentValidity.unit.toLowerCase();
      
      // Simple validation - only works well for same units
      if (currentUnit === maxUnit && 
          parseInt(consentValidity.number) > parseInt(maxConsentValidity.number)) {
        errors.consentValidity = `Maximum allowed is ${maxConsentValidity.number} ${maxConsentValidity.unit}`;
      }
    }
    
    // Validate frequency
    if (fetchType === "Periodic") {
      const frequency = watch(`consentParams.${index}.dataFetchFrequency`);
      if (frequency && maxFrequency) {
        const currentUnit = frequency.unit.toLowerCase();
        const maxUnit = maxFrequency.unit.toLowerCase();
        
        if (currentUnit === maxUnit && 
            parseInt(frequency.number) > parseInt(maxFrequency.number)) {
          errors.frequency = `Maximum allowed is ${maxFrequency.number} times per ${maxFrequency.unit}`;
        }
      }
    }
    
    // Validate FI data range
    const fiDataRange = watch(`consentParams.${index}.fiDataRange`);
    if (fiDataRange && maxFiDataRange) {
      const currentUnit = fiDataRange.unit.toLowerCase();
      const maxUnit = maxFiDataRange.unit.toLowerCase();
      
      if (currentUnit === maxUnit && 
          parseInt(fiDataRange.number) > parseInt(maxFiDataRange.number)) {
        errors.fiDataRange = `Maximum allowed is ${maxFiDataRange.number} ${maxFiDataRange.unit}`;
      }
    }
    
    // Validate data life
    const dataLife = watch(`consentParams.${index}.dataLife`);
    if (dataLife && maxDataLife) {
      const currentUnit = dataLife.unit.toLowerCase();
      const maxUnit = maxDataLife.unit.toLowerCase();
      
      if (currentUnit === maxUnit && 
          parseInt(dataLife.number) > parseInt(maxDataLife.number)) {
        errors.dataLife = `Maximum allowed is ${maxDataLife.number} ${maxDataLife.unit}`;
      }
    }
    
    setValidationErrors(errors);
  }, [currentTemplate, usecaseCategory, purposeCode, fetchType, watch, index]);
  
  // Set fetch type from template when purpose code changes
  useEffect(() => {
    if (currentTemplate?.fetchType) {
      setValue(`consentParams.${index}.fetchType`, 
        currentTemplate.fetchType === "ONE-TIME" ? "Onetime" : "Periodic"
      );
    }
  }, [currentTemplate, setValue, index]);
  
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
                      onChange={field.onChange}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxConsentValidity?.number ? parseInt(maxConsentValidity.number) : undefined}
                      error={validationErrors.consentValidity}
                    />
                  </FormControl>
                )}
              />
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
                    <ToggleButtonGroup
                      options={["Onetime", "Periodic"]}
                      value={field.value || "Onetime"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
              
              {requiredFetchType && (
                <p className="text-sm text-amber-600 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> 
                  Required fetch type: {requiredFetchType === "ONE-TIME" ? "Onetime" : "Periodic"}
                </p>
              )}
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
                      <div className="grid grid-cols-2 gap-2">
                        {allowedFiTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`fiTypes-${type}-${index}`}
                              checked={field.value?.includes(type)}
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
                      
                      {allowedFiTypes.length === 0 && usecaseCategory && purposeCode && (
                        <p className="text-sm text-muted-foreground italic">
                          Select a valid combination of usecase category and purpose code to see allowed FI types
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
                    <ToggleButtonGroup
                      options={["Profile", "Summary", "Transactions"]}
                      value={field.value || []}
                      onChange={field.onChange}
                      multiple={true}
                    />
                  </FormControl>
                )}
              />
              
              {allowedConsentTypes && (
                <p className="text-sm text-muted-foreground mt-1">
                  Allowed: {allowedConsentTypes}
                </p>
              )}
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
                        onChange={field.onChange}
                        units={["Day", "Month", "Year"]}
                        maxValue={maxFrequency?.number ? parseInt(maxFrequency.number) : undefined}
                        error={validationErrors.frequency}
                      />
                    </FormControl>
                  )}
                />
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
                      onChange={field.onChange}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxFiDataRange?.number ? parseInt(maxFiDataRange.number) : undefined}
                      error={validationErrors.fiDataRange}
                    />
                  </FormControl>
                )}
              />
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
                      onChange={field.onChange}
                      units={["Day", "Month", "Year"]}
                      maxValue={maxDataLife?.number ? parseInt(maxDataLife.number) : undefined}
                      error={validationErrors.dataLife}
                    />
                  </FormControl>
                )}
              />
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
