
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StepIndicator from "@/components/StepIndicator";
import BasicInfoForm from "@/components/form-steps/BasicInfoForm";
import LicenseDetailsForm from "@/components/form-steps/LicenseDetailsForm";
import UserJourneyForm from "@/components/form-steps/UserJourneyForm";
import SpocDetailsForm from "@/components/form-steps/SpocDetailsForm";
import IntegrationDetailsForm from "@/components/form-steps/IntegrationDetailsForm";
import ConsentSettingsForm from "@/components/form-steps/ConsentSettingsForm";
import UrlWhitelistingForm from "@/components/form-steps/UrlWhitelistingForm";
import ConsentParametersForm from "@/components/form-steps/ConsentParametersForm";
import CocreatedDevelopmentForm from "@/components/form-steps/CocreatedDevelopmentForm";
import formFields from "@/data/formFields.json";
import { BasicInfoSchema } from "@/validation/basicInfoSchema";
import { LicenseDetailsSchema } from "@/validation/licenseDetailsSchema";
import { UserJourneySchema } from "@/validation/userJourneySchema";
import { SpocDetailsSchema } from "@/validation/spocDetailsSchema";
import { IntegrationDetailsSchema } from "@/validation/integrationDetailsSchema";
import { ConsentSettingsSchema } from "@/validation/consentSettingsSchema";
import { UrlWhitelistingSchema } from "@/validation/urlWhitelistingSchema";
import { ConsentParametersSchema } from "@/validation/consentParametersSchema";
import { CocreatedDevelopmentSchema } from "@/validation/cocreatedDevelopmentSchema";

type StepConfig = {
  title: string;
  description?: string;
  component: React.ReactNode;
  validationSchema: any;
};

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  
  const steps: StepConfig[] = [
    {
      title: formFields.basicInfo.title,
      component: <BasicInfoForm />,
      validationSchema: BasicInfoSchema,
    },
    {
      title: formFields.licenseDetails.title,
      component: <LicenseDetailsForm />,
      validationSchema: LicenseDetailsSchema,
    },
    {
      title: formFields.userJourney.title,
      component: <UserJourneyForm />,
      validationSchema: UserJourneySchema,
    },
    {
      title: formFields.spocDetails.title,
      description: formFields.spocDetails.description,
      component: <SpocDetailsForm />,
      validationSchema: SpocDetailsSchema,
    },
    {
      title: formFields.integrationDetails.title,
      component: <IntegrationDetailsForm />,
      validationSchema: IntegrationDetailsSchema,
    },
    {
      title: formFields.consentSettings.title,
      component: <ConsentSettingsForm />,
      validationSchema: ConsentSettingsSchema,
    },
    {
      title: formFields.urlWhitelisting.title,
      component: <UrlWhitelistingForm />,
      validationSchema: UrlWhitelistingSchema,
    },
    {
      title: formFields.consentParameters.title,
      component: <ConsentParametersForm />,
      validationSchema: ConsentParametersSchema,
    },
    {
      title: formFields.cocreatedDevelopment.title,
      description: formFields.cocreatedDevelopment.description,
      component: <CocreatedDevelopmentForm />,
      validationSchema: CocreatedDevelopmentSchema,
    },
  ];

  const currentValidationSchema = steps[currentStep].validationSchema;
  const methods = useForm({
    resolver: zodResolver(currentValidationSchema),
    mode: "onChange",
    defaultValues: formData,
  });

  useEffect(() => {
    methods.reset(formData);
  }, [currentStep, formData, methods]);

  const handleNext = async () => {
    const isValid = await methods.trigger();
    
    if (isValid) {
      const currentData = methods.getValues();
      setFormData({ ...formData, ...currentData });
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const currentData = methods.getValues();
      setFormData({ ...formData, ...currentData });
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    const completeFormData = { ...formData, ...methods.getValues() };
    console.log("Form Submitted:", completeFormData);
    
    // Here you would typically send the data to your API
    alert("Onboarding form submitted successfully!");
  };

  return (
    <div className="container mx-auto py-8 px-4 onemoney-form">
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4 rounded-md bg-primary/10 flex items-center justify-center">
                {/* Logo placeholder - replace with actual logo */}
                <div className="text-primary font-bold text-xl">AA</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Account Aggregator Onboarding</h1>
                <p className="text-muted-foreground">Complete the form to register your FIU</p>
              </div>
            </div>
          </div>
          
          <StepIndicator 
            steps={steps.map(step => step.title)} 
            currentStep={currentStep}
          />
        </div>
      </Card>

      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
          {steps[currentStep].description && (
            <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
          )}
          
          <FormProvider {...methods}>
            <form>
              {steps[currentStep].component}
              
              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </Card>
    </div>
  );
};

export default FormWizard;
