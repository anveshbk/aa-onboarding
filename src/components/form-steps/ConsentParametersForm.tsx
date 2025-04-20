
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
import { Plus, Trash } from "lucide-react";
import { 
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import formFields from "@/data/formFields.json";

// Interface for duration inputs
interface DurationInputProps {
  value: {number: string; unit: string;} | undefined;
  onChange: (value: {number: string; unit: string;}) => void;
  units: string[];
  placeholder?: string;
}

const DurationInput = ({ value, onChange, units, placeholder }: DurationInputProps) => {
  return (
    <div className="flex gap-2">
      <Input 
        type="number"
        min="1"
        value={value?.number || ""}
        onChange={(e) => onChange({ number: e.target.value, unit: value?.unit || units[0] })}
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
  );
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
  const paramFields = formFields.consentParameters.consentParamFields;
  const consentTypes = watch(`consentParams.${index}.consentType`) || [];
  const fiTypes = watch(`consentParams.${index}.fiTypes`) || [];
  const fetchType = watch(`consentParams.${index}.fetchType`);
  const purposeCode = watch(`consentParams.${index}.purposeCode`);
  
  // Filter purpose codes based on regulator
  const getPurposeCodes = () => {
    if (!regulator) return paramFields.find(f => f.id === 'purposeCode')?.options || [];
    
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
  
  // Get FI Types based on regulator and purpose code
  const getFiTypes = () => {
    if (!regulator || !purposeCode) return paramFields.find(f => f.id === 'fiTypes')?.options || [];
    
    const templates = formFields.consentTemplates;
    let types: string[] = [];
    
    // Check if the purpose code exists for the regulator
    if (templates[regulator] && templates[regulator][purposeCode]) {
      const template = templates[regulator][purposeCode];
      
      // Handle both array and single item formats
      if (Array.isArray(template)) {
        // Combine fiTypes from all templates with this purpose code
        template.forEach(t => {
          types = [...types, ...t.fiTypes];
        });
      } else {
        types = template.fiTypes;
      }
    }
    
    // Check if the purpose code exists for "All" regulators
    if (templates["All"] && templates["All"][purposeCode]) {
      const allTemplate = templates["All"][purposeCode];
      
      if (Array.isArray(allTemplate)) {
        allTemplate.forEach(t => {
          types = [...types, ...t.fiTypes];
        });
      } else {
        types = [...types, ...allTemplate.fiTypes];
      }
    }
    
    // Remove duplicates
    return [...new Set(types)];
  };
  
  const handleConsentTypeChange = (type: string) => {
    const currentTypes = [...consentTypes];
    const typeIndex = currentTypes.indexOf(type);
    
    if (typeIndex > -1) {
      currentTypes.splice(typeIndex, 1);
    } else {
      currentTypes.push(type);
    }
    
    setValue(`consentParams.${index}.consentType`, currentTypes);
  };
  
  const handleFiTypeChange = (type: string) => {
    const currentTypes = [...fiTypes];
    const typeIndex = currentTypes.indexOf(type);
    
    if (typeIndex > -1) {
      currentTypes.splice(typeIndex, 1);
    } else {
      currentTypes.push(type);
    }
    
    setValue(`consentParams.${index}.fiTypes`, currentTypes);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Consent Template</CardTitle>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Usecase details */}
        <FormField
          control={control}
          name={`consentParams.${index}.usecaseDetails`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usecase details</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Details of the usecase where AA is integrated" />
              </FormControl>
              <FormDescription>Details of the usecase where AA is integrated</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Purpose Code - dependent on regulator */}
        <FormField
          control={control}
          name={`consentParams.${index}.purposeCode`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose Code</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Reset dependent fields
                  setValue(`consentParams.${index}.purposeText`, value);
                  setValue(`consentParams.${index}.fiTypes`, []);
                }}
                defaultValue={field.value}
                disabled={!regulator}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={regulator ? "Select Purpose Code" : "Select Regulator first"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getPurposeCodes().map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>As per ReBIT</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Purpose Text - should match purpose code */}
        <FormField
          control={control}
          name={`consentParams.${index}.purposeText`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose Text</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Purpose Text" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paramFields.find(f => f.id === 'purposeText')?.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Displayed on consent screen</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Consent Validity Period - with duration input */}
        <FormField
          control={control}
          name={`consentParams.${index}.consentValidityPeriod`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consent Validity Period</FormLabel>
              <FormControl>
                <DurationInput
                  value={field.value}
                  onChange={field.onChange}
                  units={paramFields.find(f => f.id === 'consentValidityPeriod')?.units || ["Day", "Month", "Year"]}
                  placeholder="Duration"
                />
              </FormControl>
              <FormDescription>Duration of consent validity</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Fetch Type - as toggle */}
        <FormField
          control={control}
          name={`consentParams.${index}.fetchType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fetch Type</FormLabel>
              <div className="flex items-center space-x-4">
                <FormControl>
                  <ToggleGroup
                    type="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <ToggleGroupItem value="Onetime">Onetime</ToggleGroupItem>
                    <ToggleGroupItem value="Periodic">Periodic</ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                {field.value && (
                  <span className="text-sm text-muted-foreground">Selected: {field.value}</span>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* FI Types - multiselect */}
        <FormItem>
          <FormLabel>FI Types</FormLabel>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {getFiTypes().map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`fiTypes-${type}-${index}`}
                  checked={fiTypes.includes(type)}
                  onCheckedChange={() => handleFiTypeChange(type)}
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
          <FormDescription>Financial Information Types</FormDescription>
          <FormMessage />
        </FormItem>
        
        {/* Consent Type - multiselect */}
        <FormItem>
          <FormLabel>Consent Type</FormLabel>
          <div className="mt-2">
            {paramFields.find(f => f.id === 'consentType')?.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`consentType-${option}-${index}`}
                  checked={consentTypes.includes(option)}
                  onCheckedChange={() => handleConsentTypeChange(option)}
                />
                <label
                  htmlFor={`consentType-${option}-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
        
        {/* Data Fetch Frequency - conditional display based on fetch type */}
        {fetchType === "Periodic" && (
          <FormField
            control={control}
            name={`consentParams.${index}.dataFetchFrequency`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Fetch Frequency</FormLabel>
                <FormControl>
                  <DurationInput
                    value={field.value}
                    onChange={field.onChange}
                    units={paramFields.find(f => f.id === 'dataFetchFrequency')?.units || ["Hour", "Day", "Month", "Year"]}
                    placeholder="Frequency"
                  />
                </FormControl>
                <FormDescription>Frequency of data fetch</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* FI Data Range */}
        <FormField
          control={control}
          name={`consentParams.${index}.fiDataRange`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>FI Data Range</FormLabel>
              <FormControl>
                <DurationInput
                  value={field.value}
                  onChange={field.onChange}
                  units={paramFields.find(f => f.id === 'fiDataRange')?.units || ["Day", "Month", "Year"]}
                  placeholder="Range"
                />
              </FormControl>
              <FormDescription>Duration of data to fetch</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Data Life */}
        <FormField
          control={control}
          name={`consentParams.${index}.dataLife`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Life</FormLabel>
              <FormControl>
                <DurationInput
                  value={field.value}
                  onChange={field.onChange}
                  units={paramFields.find(f => f.id === 'dataLife')?.units || ["Day", "Month", "Year"]}
                  placeholder="Life"
                />
              </FormControl>
              <FormDescription>Duration data will be available</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const ConsentParametersForm = () => {
  const { control, watch, setValue } = useFormContext();
  const consentParams = watch("consentParams") || [];
  const regulator = watch("regulator");
  
  const addConsentParam = () => {
    const newParam = {
      usecaseDetails: "",
      purposeCode: "",
      purposeText: "",
      consentValidityPeriod: { number: "", unit: "Day" },
      fetchType: "Onetime",
      consentType: ["Profile"],
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
      <FormField
        control={control}
        name="consentParams"
        render={() => (
          <FormItem>
            <div className="space-y-4">
              {consentParams.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No consent parameters defined yet</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {consentParams.map((param, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        {param.usecaseDetails || `Consent Template ${index + 1}`}
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
