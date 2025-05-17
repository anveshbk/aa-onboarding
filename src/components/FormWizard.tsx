import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { personalDetailsSchema } from "@/validation/personalDetailsSchema";
import { companyDetailsSchema } from "@/validation/companyDetailsSchema";
import { IntegrationDetailsSchema } from "@/validation/integrationDetailsSchema";
import { legalDetailsSchema } from "@/validation/legalDetailsSchema";
import Logo from "@/components/Logo";
import appConfig from "@/config/appConfig.json";
import { ArrowRight } from "lucide-react";

// Import the downloadJson utility
import { downloadJson } from "@/utils/downloadUtils";

const FormWizard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    companyDetails: {
      companyName: "",
      companyWebsite: "",
      companyEmail: "",
      companyPhone: "",
      industry: "",
      companySize: "",
    },
    integrationDetails: {
      integrationType: {
        webRedirection: false,
        webRedirectionUrl: "",
        sdk: false,
        sdkVersion: "",
        assisted: false,
        detached: false,
      },
      integrationMode: "",
      figmaUrl: "",
    },
    legalDetails: {
      termsAndConditions: false,
      privacyPolicy: false,
      dataSecurity: false,
    },
  });

  const updateFormData = (step: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step as keyof typeof prev], ...data },
    }));
  };

  const personalDetailsMethods = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: formData.personalDetails,
    mode: "onChange",
  });

  const companyDetailsMethods = useForm({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: formData.companyDetails,
    mode: "onChange",
  });

  const integrationDetailsMethods = useForm({
    resolver: zodResolver(IntegrationDetailsSchema),
    defaultValues: formData.integrationDetails,
    mode: "onChange",
  });

  const legalDetailsMethods = useForm({
    resolver: zodResolver(legalDetailsSchema),
    defaultValues: formData.legalDetails,
    mode: "onChange",
  });
  
  // Define onSubmitAllSteps function before it's used in the steps array
  const onSubmitAllSteps = async () => {
    try {
      setIsSubmitting(true);
      
      // Gather all form data
      const allData = {
        ...formData,
        environment: "PROD", // Add environment identifier
        submissionTimestamp: new Date().toISOString() // Add submission timestamp
      };
      
      console.log("Final submission data:", allData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Download the submission data as JSON
      downloadJson(allData, `prod-onboarding-${new Date().toISOString().split('T')[0]}.json`);
      
      toast.success("Your onboarding request has been submitted successfully.");
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const steps = [
    {
      label: "Personal Details",
      component: (
        <PersonalDetailsForm 
          onSubmit={(data: any) => {
            updateFormData("personalDetails", data);
            setCurrentStep(currentStep + 1);
            return true;
          }}
          methods={personalDetailsMethods}
        />
      )
    },
    {
      label: "Company Details",
      component: (
        <CompanyDetailsForm 
          onSubmit={(data: any) => {
            updateFormData("companyDetails", data);
            setCurrentStep(currentStep + 1);
            return true;
          }}
          methods={companyDetailsMethods}
        />
      )
    },
    {
      label: "Integration Details",
      component: (
        <IntegrationDetailsForm 
          onSubmit={(data: any) => {
            updateFormData("integrationDetails", data);
            setCurrentStep(currentStep + 1);
            return true;
          }}
          methods={integrationDetailsMethods}
        />
      )
    },
    {
      label: "Legal Details",
      component: (
        <LegalDetailsForm 
          onSubmit={(data: any) => {
            updateFormData("legalDetails", data);
            setCurrentStep(currentStep + 1);
            return true;
          }}
          methods={legalDetailsMethods}
        />
      )
    },
    {
      label: "Review & Submit",
      component: (
        <ReviewSubmitForm 
          formData={formData} 
          onSubmit={onSubmitAllSteps}
          isSubmitting={isSubmitting}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-primary hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="container mx-auto px-4">
        <Card className="p-6 mb-8">
          <div className="mb-6 flex items-center">
            <Logo showText={false} />
            <h1 className="text-2xl font-bold ml-2">
              {appConfig.onboarding.title}
            </h1>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center ${index <= currentStep ? "text-primary" : "text-gray-400"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                    ${index <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                    {index + 1}
                  </div>
                  <span className="hidden md:inline">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {steps[currentStep].component}
          
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                type="button"
                onClick={() => {
                  // This will be handled by each form's onSubmit
                }}
                className="ml-auto"
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Create simple form component implementations
const PersonalDetailsForm = ({ onSubmit, methods }: any) => {
  const handleSubmit = methods.handleSubmit(onSubmit);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Personal Details</h2>
        <p>Personal details form placeholder</p>
        <div className="flex justify-end">
          <Button type="submit">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </form>
    </FormProvider>
  );
};

const CompanyDetailsForm = ({ onSubmit, methods }: any) => {
  const handleSubmit = methods.handleSubmit(onSubmit);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Company Details</h2>
        <p>Company details form placeholder</p>
        <div className="flex justify-end">
          <Button type="submit">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </form>
    </FormProvider>
  );
};

const IntegrationDetailsForm = ({ onSubmit, methods }: any) => {
  const handleSubmit = methods.handleSubmit(onSubmit);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Integration Details</h2>
        <p>Integration details form placeholder</p>
        <div className="flex justify-end">
          <Button type="submit">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </form>
    </FormProvider>
  );
};

const LegalDetailsForm = ({ onSubmit, methods }: any) => {
  const handleSubmit = methods.handleSubmit(onSubmit);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Legal Details</h2>
        <p>Legal details form placeholder</p>
        <div className="flex justify-end">
          <Button type="submit">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </form>
    </FormProvider>
  );
};

const ReviewSubmitForm = ({ formData, onSubmit, isSubmitting }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review & Submit</h2>
      <p>Please review your information before submitting:</p>
      
      <div className="border rounded-md p-4">
        <pre className="whitespace-pre-wrap text-xs">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gap-2"
        >
          Submit
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FormWizard;
