
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
  getAllowedFiTypes,
  getAllowedConsentTypes,
  getRequiredFetchType,
  getMaxValues,
  isFieldRequired,
  isValidDuration,
  formatDuration
} from "./consentHelpers";

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
  
  // Form values
  const usecaseCategory = watch(`consentParams.${index}.usecaseCategory`) || "";
  const purposeCode = watch(`consentParams.${index}.purposeCode`) || "";
  const fetchType = watch(`consentParams.${index}.fetchType`) || "Onetime";
  const fiTypes = watch(`consentParams.${index}.fiTypes`) || [];
  const consentType = watch(`consentParams.${index}.consentType`) || [];
  const consentValidityPeriod = watch(`consentParams.${index}.consentValidityPeriod`);
  const dataFetchFrequency = watch(`consentParams.${index}.dataFetchFrequency`);
  const fiDataRange = watch(`consentParams.${index}.fiDataRange`);
  const dataLife = watch(`consentParams.${index}.dataLife`);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    consentValidityPeriod?: string;
    dataFetchFrequency?: string;
    fiDataRange?: string;
    dataLife?: string;
  }>({});
  
  // Available options based on current selections
  const usecaseCategories = getUsecaseCategories(regulator);
  const purposeCodes = getPurposeCodes(regulator, usecaseCategory);
  const allowedFiTypes = getAllowedFiTypes(regulator, purposeCode, usecaseCategory);
  const allowedConsentTypes = getAllowedConsentTypes(regulator, purposeCode, usecaseCategory, fiTypes);
  const requiredFetchType = getRequiredFetchType(regulator, purposeCode, usecaseCategory);
  
  // Maximum values from template
  const {
    maxConsentValidity,
    maxFrequency,
    maxFiDataRange,
    maxDataLife
  } = getMaxValues(regulator, purposeCode, usecaseCategory, fiTypes, consentType);
  
  // Check if the template specifies coterminous
  const isCoterminous = maxConsentValidity?.unit === "tenure";
  
  // Reset validations when template changes
  useEffect(() => {
    setValidationErrors({});
  }, [usecaseCategory, purposeCode, fiTypes, consentType]);
  
  // Apply required fetch type from template
  useEffect(() => {
    if (requiredFetchType) {
      const fetchTypeValue = requiredFetchType === "ONE-TIME" ? "Onetime" : "Periodic";
      setValue(`consentParams.${index}.fetchType`, fetchTypeValue);
    }
  }, [requiredFetchType, setValue, index]);
  
  // Validate FI Types against allowed values
  useEffect(() => {
    if (fiTypes.length > 0 && allowedFiTypes.length > 0) {
      const invalidTypes = fiTypes.filter(type => !allowedFiTypes.includes(type));
      
      if (invalidTypes.length > 0) {
        const validTypes = fiTypes.filter(type => allowedFiTypes.includes(type));
        setValue(`consentParams.${index}.fiTypes`, validTypes);
        
        toast({
          title: "FI Types Updated",
          description: "Some FI types were removed because they are not allowed for the selected template.",
          variant: "destructive",
        });
      }
    }
  }, [allowedFiTypes, fiTypes, setValue, index, toast]);
  
  // Validate Consent Types against allowed values
  useEffect(() => {
    if (consentType.length > 0 && allowedConsentTypes.length > 0) {
      const invalidTypes = consentType.filter(type => !allowedConsentTypes.includes(type));
      
      if (invalidTypes.length > 0) {
        const validTypes = consentType.filter(type => allowedConsentTypes.includes(type));
        setValue(`consentParams.${index}.consentType`, validTypes);
        
        toast({
          title: "Consent Types Updated",
          description: "Some consent types were removed because they are not allowed for the selected template.",
          variant: "destructive",
        });
      }
    }
  }, [allowedConsentTypes, consentType, setValue, index, toast]);
  
  // Validate consent validity period
  useEffect(() => {
    if (consentValidityPeriod && maxConsentValidity) {
      const validation = isValidDuration(consentValidityPeriod, maxConsentValidity);
      setValidationErrors(prev => ({
        ...prev,
        consentValidityPeriod: validation.isValid ? undefined : validation.message
      }));
    } else {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.consentValidityPeriod;
        return newErrors;
      });
    }
  }, [consentValidityPeriod, maxConsentValidity]);
  
  // Validate data fetch frequency (only for Periodic)
  useEffect(() => {
    if (fetchType === "Periodic" && dataFetchFrequency && maxFrequency) {
      const validation = isValidDuration(dataFetchFrequency, maxFrequency);
      setValidationErrors(prev => ({
        ...prev,
        dataFetchFrequency: validation.isValid ? undefined : validation.message
      }));
    } else {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.dataFetchFrequency;
        return newErrors;
      });
    }
  }, [dataFetchFrequency, maxFrequency, fetchType]);
  
  // Validate FI data range
  useEffect(() => {
    if (fiDataRange && maxFiDataRange) {
      const validation = isValidDuration(fiDataRange, maxFiDataRange);
      setValidationErrors(prev => ({
        ...prev,
        fiDataRange: validation.isValid ? undefined : validation.message
      }));
    } else {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.fiDataRange;
        return newErrors;
      });
    }
  }, [fiDataRange, maxFiDataRange]);
  
  // Validate data life
  useEffect(() => {
    if (dataLife && maxDataLife) {
      const validation = isValidDuration(dataLife, maxDataLife);
      setValidationErrors(prev => ({
        ...prev,
        dataLife: validation.isValid ? undefined : validation.message
      }));
    } else {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.dataLife;
        return newErrors;
      });
    }
  }, [dataLife, maxDataLife]);
  
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
                      multiple={false}
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
                      }}
                      units={["Day", "Month", "Year"]}
                      error={validationErrors.consentValidityPeriod}
                      required={isFieldRequired('consentValidityPeriod')}
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
                  Maximum allowed: {formatDuration(maxConsentValidity)}
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
                              delete newErrors.dataFetchFrequency;
                              return newErrors;
                            });
                          }
                        }}
                        multiple={false}
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
                                  setValue(`consentParams.${index}.consentType`, []);
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
                          const selectedValues = Array.isArray(value) ? value : [value].filter(Boolean);
                          field.onChange(selectedValues);
                        }}
                        multiple={true}
                      />
                    
                      {allowedConsentTypes.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Allowed: {allowedConsentTypes.join(', ')}
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
                        }}
                        units={["Day", "Month", "Year"]}
                        error={validationErrors.dataFetchFrequency}
                      />
                    </FormControl>
                  )}
                />
                {maxFrequency && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum allowed: {maxFrequency.number} times per {maxFrequency.unit.toLowerCase()}
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
                      }}
                      units={["Day", "Month", "Year"]}
                      error={validationErrors.fiDataRange}
                      required={isFieldRequired('fiDataRange')}
                    />
                  </FormControl>
                )}
              />
              {maxFiDataRange && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {formatDuration(maxFiDataRange)}
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
                      }}
                      units={["Day", "Month", "Year"]}
                      error={validationErrors.dataLife}
                      required={isFieldRequired('dataLife')}
                    />
                  </FormControl>
                )}
              />
              {maxDataLife && (
                <p className="text-sm text-muted-foreground mt-1">
                  Maximum allowed: {formatDuration(maxDataLife)}
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
