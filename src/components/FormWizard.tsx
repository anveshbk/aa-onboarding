import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { MultiStepForm, Step } from "react-hooks-multistep-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { personalDetailsSchema } from "@/validation/personalDetailsSchema";
import { companyDetailsSchema } from "@/validation/companyDetailsSchema";
import { integrationDetailsSchema } from "@/validation/integrationDetailsSchema";
import { LegalDetailsSchema } from "@/validation/LegalDetailsSchema";
import {
  PersonalDetailsForm,
  CompanyDetailsForm,
  IntegrationDetailsForm,
  LegalDetailsForm,
  ReviewSubmitForm,
} from "@/components/form-components";
import Logo from "@/components/Logo";
import appConfig from "@/config/appConfig.json";
import { ArrowRight } from "lucide-react";

// Import the downloadJson utility
import { downloadJson } from "@/utils/downloadUtils";

const FormWizard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    resolver: zodResolver(integrationDetailsSchema),
    defaultValues: formData.integrationDetails,
    mode: "onChange",
  });

  const legalDetailsMethods = useForm({
    resolver: zodResolver(LegalDetailsSchema),
    defaultValues: formData.legalDetails,
    mode: "onChange",
  });

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
      
      toast({
        title: "Success!",
        description: "Your onboarding request has been submitted successfully."
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your request. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {appConfig.general.onboardingTitle}
            </h1>
          </div>

          <MultiStepForm
            className="space-y-8"
            onSubmit={onSubmitAllSteps}
            loading={isSubmitting}
            testId="multistep-form"
          >
            <Step label="Personal Details" testId="personal-details-step">
              <FormProvider {...personalDetailsMethods}>
                <PersonalDetailsForm
                  onSubmit={(data) => {
                    updateFormData("personalDetails", data);
                    return true;
                  }}
                />
              </FormProvider>
            </Step>

            <Step label="Company Details" testId="company-details-step">
              <FormProvider {...companyDetailsMethods}>
                <CompanyDetailsForm
                  onSubmit={(data) => {
                    updateFormData("companyDetails", data);
                    return true;
                  }}
                />
              </FormProvider>
            </Step>

            <Step
              label="Integration Details"
              testId="integration-details-step"
            >
              <FormProvider {...integrationDetailsMethods}>
                <IntegrationDetailsForm
                  onSubmit={(data) => {
                    updateFormData("integrationDetails", data);
                    return true;
                  }}
                />
              </FormProvider>
            </Step>

            <Step label="Legal Details" testId="legal-details-step">
              <FormProvider {...legalDetailsMethods}>
                <LegalDetailsForm
                  onSubmit={(data) => {
                    updateFormData("legalDetails", data);
                    return true;
                  }}
                />
              </FormProvider>
            </Step>

            <Step label="Review & Submit" testId="review-submit-step">
              <ReviewSubmitForm formData={formData} />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  Submit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Step>
          </MultiStepForm>
        </Card>
      </div>
    </div>
  );
};

export default FormWizard;
