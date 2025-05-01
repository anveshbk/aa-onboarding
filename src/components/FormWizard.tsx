import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import StepIndicator from "@/components/StepIndicator";
import TspDetailsForm from "@/components/form-steps/TspDetailsForm";
import FiuDetailsForm from "@/components/form-steps/FiuDetailsForm";
import SpocDetailsForm from "@/components/form-steps/SpocDetailsForm";
import IntegrationDetailsForm from "@/components/form-steps/IntegrationDetailsForm";
import UserJourneySettingsForm from "@/components/form-steps/UserJourneySettingsForm";
import ConsentParametersForm from "@/components/form-steps/ConsentParametersForm";
import CocreatedDevelopmentForm from "@/components/form-steps/CocreatedDevelopmentForm";
import formFields from "@/data/formFields.json";
import { TspDetailsSchema } from "@/validation/tspDetailsSchema";
import { FiuDetailsSchema } from "@/validation/fiuDetailsSchema";
import { SpocDetailsSchema } from "@/validation/spocDetailsSchema";
import { IntegrationDetailsSchema } from "@/validation/integrationDetailsSchema";
import { UserJourneySettingsSchema } from "@/validation/userJourneySettingsSchema";
import { ConsentParametersSchema } from "@/validation/consentParametersSchema";
import { CocreatedDevelopmentSchema } from "@/validation/cocreatedDevelopmentSchema";
import Logo from "@/components/Logo";
import appConfig from "@/config/appConfig.json";

type StepConfig = {
  title: string;
  description?: string;
  component: React.ReactNode;
  validationSchema: any;
};

const FormWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [showCocreatedDevelopment, setShowCocreatedDevelopment] = useState(false);
  
  // All schema fields are already optional in their respective schema files
  const makeSchemaOptional = (schema: any) => {
    // Return the schema as is, since fields are already optional
    return schema;
  };
  
  // Create steps dynamically, excluding conditional steps initially
  const baseSteps: StepConfig[] = [
    {
      title: "TSP Details",
      component: <TspDetailsForm />,
      validationSchema: makeSchemaOptional(TspDetailsSchema),
    },
    {
      title: "FIU Details",
      component: <FiuDetailsForm />,
      validationSchema: makeSchemaOptional(FiuDetailsSchema),
    },
    {
      title: "FIU SPOC Details",
      component: <SpocDetailsForm />,
      validationSchema: makeSchemaOptional(SpocDetailsSchema),
    },
    {
      title: "Integration to Onemoney",
      component: <IntegrationDetailsForm setShowCocreatedDevelopment={setShowCocreatedDevelopment} />,
      validationSchema: makeSchemaOptional(IntegrationDetailsSchema),
    },
    {
      title: "User Journey",
      component: <UserJourneySettingsForm />,
      validationSchema: makeSchemaOptional(UserJourneySettingsSchema),
    },
    {
      title: "Consent Parameters",
      component: <ConsentParametersForm />,
      validationSchema: makeSchemaOptional(ConsentParametersSchema),
    }
  ];
  
  // Add conditional step if needed
  useEffect(() => {
    if (formData.integrationMode === "Cocreated FIU" || formData.integrationMode === "Cocreated TSP") {
      setShowCocreatedDevelopment(true);
    } else {
      setShowCocreatedDevelopment(false);
    }
  }, [formData.integrationMode]);
  
  // Get the final steps array based on conditions
  const steps = showCocreatedDevelopment 
    ? [
        ...baseSteps, 
        {
          title: "Cocreated Development",
          description: "Applicable only for cocoreated development",
          component: <CocreatedDevelopmentForm />,
          validationSchema: makeSchemaOptional(CocreatedDevelopmentSchema),
        }
      ]
    : baseSteps;

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

  const handleStepClick = async (stepIndex: number) => {
    // Save current form data before navigation
    const currentData = methods.getValues();
    setFormData({ ...formData, ...currentData });
    
    // Navigate to the selected step
    setCurrentStep(stepIndex);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    const completeFormData = { ...formData, ...methods.getValues() };
    console.log("Form Submitted:", completeFormData);
    
    // Download the form data as a JSON file
    const dataStr = JSON.stringify(completeFormData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "onboarding_form_data.json";
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert("Onboarding form submitted successfully! The data has been downloaded as a JSON file.");
  };

  return (
    <div className="container mx-auto py-8 px-4 onemoney-form">
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Logo />
              <div>
                <h1>{appConfig.onboarding.title}</h1>
                <p className="text-muted-foreground">{appConfig.onboarding.subtitle}</p>
              </div>
            </div>
          </div>
          
          <StepIndicator 
            steps={steps.map(step => step.title)} 
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </div>
      </Card>

      <Card className="mb-8">
        <div className="p-6">
          <div className="mb-6">
            {steps[currentStep].description && (
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
            )}
          </div>
          
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
