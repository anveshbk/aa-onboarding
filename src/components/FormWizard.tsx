
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
import { ArrowRight } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";

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
  
  const stepLabels = ["Personal Details", "Company Details", "Integration Details", "Legal Details", "Review & Submit"];
  
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
    <div className="container mx-auto px-4">
      <Card className="p-6 mb-8">
        <div className="mb-6 flex items-center">
          <Logo showText={false} className="h-12 w-12" />
          <h1 className="text-2xl font-bold ml-3">
            Account Aggregator Onboarding
          </h1>
        </div>
        
        <StepIndicator 
          steps={stepLabels}
          currentStep={currentStep}
          onStepClick={(index) => {
            // Only allow going back to previous steps
            if (index < currentStep) {
              setCurrentStep(index);
            }
          }}
        />
        
        <div className="mt-8">
          {steps[currentStep].component}
        </div>
      </Card>
    </div>
  );
};

// Create proper form component implementations
const PersonalDetailsForm = ({ onSubmit, methods }: any) => {
  const handleSubmit = methods.handleSubmit(onSubmit);
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Personal Details</h2>
        <p className="text-gray-500 mb-4">Please provide your personal information.</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input 
                {...methods.register("firstName")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your first name"
              />
              {methods.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.firstName.message as string}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input 
                {...methods.register("lastName")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your last name"
              />
              {methods.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.lastName.message as string}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email"
              {...methods.register("email")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your email"
            />
            {methods.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{methods.formState.errors.email.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              type="tel"
              {...methods.register("phone")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your phone number"
            />
            {methods.formState.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{methods.formState.errors.phone.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button type="submit" className="gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
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
        <p className="text-gray-500 mb-4">Please provide information about your company.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input 
              {...methods.register("companyName")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter company name"
            />
            {methods.formState.errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{methods.formState.errors.companyName.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Company Website</label>
            <input 
              {...methods.register("companyWebsite")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter company website"
            />
            {methods.formState.errors.companyWebsite && (
              <p className="text-red-500 text-sm mt-1">{methods.formState.errors.companyWebsite.message as string}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Email</label>
              <input 
                type="email"
                {...methods.register("companyEmail")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter company email"
              />
              {methods.formState.errors.companyEmail && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.companyEmail.message as string}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Company Phone</label>
              <input 
                type="tel"
                {...methods.register("companyPhone")}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter company phone"
              />
              {methods.formState.errors.companyPhone && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.companyPhone.message as string}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <select 
                {...methods.register("industry")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select industry</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
              {methods.formState.errors.industry && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.industry.message as string}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Company Size</label>
              <select 
                {...methods.register("companySize")}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </select>
              {methods.formState.errors.companySize && (
                <p className="text-red-500 text-sm mt-1">{methods.formState.errors.companySize.message as string}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button type="submit" className="gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

const IntegrationDetailsForm = ({ onSubmit, methods }: any) => {
  const handleSubmit = methods.handleSubmit(onSubmit);
  const { watch, register, formState } = methods;
  
  const integrationType = watch("integrationType", {});
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Integration Details</h2>
        <p className="text-gray-500 mb-4">Please specify how you want to integrate with our platform.</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-2">Integration Type</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="webRedirection"
                  {...register("integrationType.webRedirection")}
                  className="mr-2"
                />
                <label htmlFor="webRedirection">Web Redirection</label>
              </div>
              
              {integrationType.webRedirection && (
                <div className="ml-6 mt-2">
                  <label className="block text-sm font-medium mb-1">Redirection URL</label>
                  <input 
                    {...register("integrationType.webRedirectionUrl")}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter URL"
                  />
                </div>
              )}
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="sdk"
                  {...register("integrationType.sdk")}
                  className="mr-2"
                />
                <label htmlFor="sdk">SDK Integration</label>
              </div>
              
              {integrationType.sdk && (
                <div className="ml-6 mt-2">
                  <label className="block text-sm font-medium mb-1">SDK Version</label>
                  <select 
                    {...register("integrationType.sdkVersion")}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select version</option>
                    <option value="latest">Latest</option>
                    <option value="v1.0">v1.0</option>
                    <option value="v0.9">v0.9</option>
                  </select>
                </div>
              )}
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="assisted"
                  {...register("integrationType.assisted")}
                  className="mr-2"
                />
                <label htmlFor="assisted">Assisted Integration</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="detached"
                  {...register("integrationType.detached")}
                  className="mr-2"
                />
                <label htmlFor="detached">Detached Mode</label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Integration Mode</label>
            <select 
              {...register("integrationMode")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select integration mode</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
            {formState.errors.integrationMode && (
              <p className="text-red-500 text-sm mt-1">{formState.errors.integrationMode.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Figma URL (Optional)</label>
            <input 
              {...register("figmaUrl")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter Figma URL if available"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button type="submit" className="gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
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
        <p className="text-gray-500 mb-4">Please review and accept the terms to proceed.</p>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="termsAndConditions"
              {...methods.register("termsAndConditions")}
              className="mr-2"
            />
            <label htmlFor="termsAndConditions">
              I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
            </label>
          </div>
          {methods.formState.errors.termsAndConditions && (
            <p className="text-red-500 text-sm">{methods.formState.errors.termsAndConditions.message as string}</p>
          )}
          
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="privacyPolicy"
              {...methods.register("privacyPolicy")}
              className="mr-2"
            />
            <label htmlFor="privacyPolicy">
              I accept the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          {methods.formState.errors.privacyPolicy && (
            <p className="text-red-500 text-sm">{methods.formState.errors.privacyPolicy.message as string}</p>
          )}
          
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="dataSecurity"
              {...methods.register("dataSecurity")}
              className="mr-2"
            />
            <label htmlFor="dataSecurity">
              I accept the <a href="#" className="text-blue-600 hover:underline">Data Security Agreement</a>
            </label>
          </div>
          {methods.formState.errors.dataSecurity && (
            <p className="text-red-500 text-sm">{methods.formState.errors.dataSecurity.message as string}</p>
          )}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button type="submit" className="gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

const ReviewSubmitForm = ({ formData, onSubmit, isSubmitting }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review & Submit</h2>
      <p className="text-gray-500 mb-4">Please review your information before submitting:</p>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><span className="text-gray-500">Name:</span> {formData.personalDetails.firstName} {formData.personalDetails.lastName}</p>
            <p><span className="text-gray-500">Email:</span> {formData.personalDetails.email}</p>
            <p><span className="text-gray-500">Phone:</span> {formData.personalDetails.phone}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Company Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><span className="text-gray-500">Company:</span> {formData.companyDetails.companyName}</p>
            <p><span className="text-gray-500">Website:</span> {formData.companyDetails.companyWebsite}</p>
            <p><span className="text-gray-500">Email:</span> {formData.companyDetails.companyEmail}</p>
            <p><span className="text-gray-500">Phone:</span> {formData.companyDetails.companyPhone}</p>
            <p><span className="text-gray-500">Industry:</span> {formData.companyDetails.industry}</p>
            <p><span className="text-gray-500">Size:</span> {formData.companyDetails.companySize}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Integration Details</h3>
          <div>
            <p><span className="text-gray-500">Integration Mode:</span> {formData.integrationDetails.integrationMode}</p>
            <p className="mt-2"><span className="text-gray-500">Integration Types:</span></p>
            <ul className="list-disc ml-5 mt-1">
              {formData.integrationDetails.integrationType.webRedirection && (
                <li>Web Redirection {formData.integrationDetails.integrationType.webRedirectionUrl && `(URL: ${formData.integrationDetails.integrationType.webRedirectionUrl})`}</li>
              )}
              {formData.integrationDetails.integrationType.sdk && (
                <li>SDK {formData.integrationDetails.integrationType.sdkVersion && `(Version: ${formData.integrationDetails.integrationType.sdkVersion})`}</li>
              )}
              {formData.integrationDetails.integrationType.assisted && <li>Assisted Integration</li>}
              {formData.integrationDetails.integrationType.detached && <li>Detached Mode</li>}
            </ul>
            {formData.integrationDetails.figmaUrl && (
              <p className="mt-2"><span className="text-gray-500">Figma URL:</span> {formData.integrationDetails.figmaUrl}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-end">
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormWizard;
