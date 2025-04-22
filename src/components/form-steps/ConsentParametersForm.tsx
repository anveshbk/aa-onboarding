
import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus } from "lucide-react";
import ConsentParamItem from "./consent-form/ConsentParamItem";

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
                          onRemove={() => removeConsentParam(index)}
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
