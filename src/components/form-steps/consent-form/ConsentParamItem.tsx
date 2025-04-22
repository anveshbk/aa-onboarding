import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Trash } from "lucide-react";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import DurationInput from "./DurationInput";
import FrequencyInput from "./FrequencyInput";
import { 
  getUsecaseCategories, 
  getPurposeCodes, 
  getFilteredTemplate, 
  isFieldRequired,
  formatMaxValidity 
} from "./consentHelpers";
import { 
  parseFrequencyString, 
  parsePeriodString, 
  validateDuration, 
  convertDuration, 
  durationToString 
} from "@/validation/consentParametersSchema";

interface ConsentParamItemProps {
  index: number;
  onRemove: () => void;
  regulator: string;
}

const ConsentParamItem: React.FC<ConsentParamItemProps> = ({ 
  index,
  onRemove,
  regulator,
}) => {
  const { toast } = useToast();
  const { control, watch, setValue } = useFormContext();
  
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
  
  // Get the current template based on all selected values
  const selectedFiType = fiTypes.length > 0 ? fiTypes[0] : undefined;
  const currentTemplate = usecaseCategory && purposeCode 
    ? getFilteredTemplate(
        regulator, 
        purposeCode, 
        usecaseCategory, 
        selectedFiType,
        fetchType,
        consentTypes
      ) 
    : null;
  
  const allowedFiTypes = currentTemplate?.fiTypes || [];
  const requiredFetchType = currentTemplate?.fetchType || null;
  const allowedConsentTypes = currentTemplate?.consentType || [];
  
  const maxFrequency = currentTemplate?.maxFrequency ? parseFrequencyString(currentTemplate.maxFrequency) : null;
  const maxFiDataRange = currentTemplate?.maxFiDataRange ? parsePeriodString(currentTemplate.maxFiDataRange) : null;
  const maxConsentValidity = currentTemplate?.maxConsentValidity ? parsePeriodString(currentTemplate.maxConsentValidity) : null;
  const maxDataLife = currentTemplate?.maxDataLife ? parsePeriodString(currentTemplate.maxDataLife) : null;
  
  const isCoterminous = currentTemplate?.maxConsentValidity?.toLowerCase().includes("coterminous") || false;
  
  useEffect(() => {
    setValidationErrors({});
  }, [currentTemplate]);
  
  // Update template values when any relevant field changes
  useEffect(() => {
    if (usecaseCategory && purposeCode) {
      const newTemplate = getFilteredTemplate(
        regulator, 
        purposeCode, 
        usecaseCategory, 
        selectedFiType,
        fetchType,
        consentTypes
      );
      
      // Reset validation errors
      setValidationErrors({});
      
      // Update fetch type if required
      if (newTemplate?.fetchType) {
        setValue(`consentParams.${index}.fetchType`, 
          newTemplate.fetchType === "ONE-TIME" ? "Onetime" : "Periodic"
        );
      }
      
      // Convert and update duration fields based on template units
      const updateDurationField = (fieldName: string, maxValue: { number: string; unit: string } | null) => {
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
  }, [fiTypes, usecaseCategory, purposeCode, regulator, setValue, index, watch, fetchType, consentTypes]);
  
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
  
  const validateField = (field: string, value: { number: string; unit: string } | undefined, maxValue: { number: string; unit: string } | null) => {
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
                      required={isFieldRequired('consentValidityPeriod')}
                      disabled={isCoterminous}
                    />
                  </FormControl>
                )}
              />
              {isCoterminous ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Coterminous with loan tenure
                </p>
              ) : maxConsentValidity ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {maxConsentValidity.number} {maxConsentValidity.unit}
                </p>
              ) : null}
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
                      required={isFieldRequired('fiDataRange')}
                    />
                  </FormControl>
                )}
              />
              {maxFiDataRange && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {maxFiDataRange.number} {maxFiDataRange.unit}
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
                      required={isFieldRequired('dataLife')}
                    />
                  </FormControl>
                )}
              />
              {maxDataLife && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {maxDataLife.number} {maxDataLife.unit}
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

export default ConsentParamItem;
