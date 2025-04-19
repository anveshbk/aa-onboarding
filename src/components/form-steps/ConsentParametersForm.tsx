
import { useState } from "react";
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
import formFields from "@/data/formFields.json";

const ConsentParamItem = ({ 
  index,
  control,
  onRemove,
  watch,
  setValue,
}: { 
  index: number;
  control: any;
  onRemove: () => void;
  watch: any;
  setValue: any;
}) => {
  const paramFields = formFields.consentParameters.consentParamFields;
  const consentTypes = watch(`consentParams.${index}.consentType`) || [];
  
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
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Usecase {index + 1}</CardTitle>
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
        {paramFields.map((field) => (
          <div key={field.id}>
            {field.type === 'text' && (
              <FormField
                control={control}
                name={`consentParams.${index}.${field.id}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <FormControl>
                      <Input {...formField} placeholder={field.description} />
                    </FormControl>
                    <FormDescription>{field.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {field.type === 'dropdown' && (
              <FormField
                control={control}
                name={`consentParams.${index}.${field.id}`}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.name}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>{field.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {field.type === 'multiSelect' && (
              <FormItem>
                <FormLabel>{field.name}</FormLabel>
                <div className="mt-2">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`${field.id}-${option}-${index}`}
                        checked={consentTypes.includes(option)}
                        onCheckedChange={() => handleConsentTypeChange(option)}
                      />
                      <label
                        htmlFor={`${field.id}-${option}-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <FormDescription>{field.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ConsentParametersForm = () => {
  const { control, watch, setValue } = useFormContext();
  const consentParams = watch("consentParams") || [];
  
  const addConsentParam = () => {
    const newParam = {
      usecaseDetails: "",
      purposeCode: "",
      purposeText: "",
      consentValidityPeriod: "",
      fetchType: "Onetime",
      consentType: ["Profile"],
      dataFetchFrequency: "",
      fiDataRange: "",
      dataLife: "",
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
      <FormDescription>
        {formFields.consentParameters.fields[0].description}
      </FormDescription>
      
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
                        {param.usecaseDetails || `Usecase ${index + 1}`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ConsentParamItem
                          index={index}
                          control={control}
                          onRemove={() => removeConsentParam(index)}
                          watch={watch}
                          setValue={setValue}
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
                <Plus className="h-4 w-4 mr-2" /> Add Consent Parameter
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
