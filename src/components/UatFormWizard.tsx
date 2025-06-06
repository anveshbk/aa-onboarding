
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import UatForm from "@/components/UatForm";

const formSchema = z.object({
  tspName: z.string().min(2, "Name must be at least 2 characters"),
  requestedBy: z.string().min(2, "Requested By must be at least 2 characters"),
  tspSpocEmail: z.string().email("Please enter a valid email"),
  fiuRegisteredName: z.string().min(2, "FIU Registered Name must be at least 2 characters"),
  regulator: z.string().min(1, "Please select a regulator"),
  licenseType: z.string().min(1, "Please select a license type"),
  fiuCrId: z.string().min(1, "FIU CR ID is required"),
  integrationMode: z.string().min(1, "Please select an integration mode"),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  primaryFont: z.string().optional(),
  secondaryFont: z.string().optional(),
  fiuLogo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UatFormWizard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tspName: "",
      requestedBy: "",
      tspSpocEmail: "",
      fiuRegisteredName: "",
      regulator: "",
      licenseType: "",
      fiuCrId: "",
      integrationMode: "",
      primaryColor: "",
      secondaryColor: "",
      primaryFont: "",
      secondaryFont: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Add environment identifier and timestamp
      const submissionData = {
        ...data,
        environment: "UAT",
        submissionTimestamp: new Date().toISOString()
      };
      
      console.log("Form submitted:", submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Download the form data as a JSON file
      const dataStr = JSON.stringify(submissionData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "uat_onboarding_form_data.json";
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("UAT Onboarding request submitted successfully!");
      methods.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit onboarding request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="p-6 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">UAT Onboarding Form</h1>
          <p className="text-muted-foreground">Complete the form below to onboard a new FIU to the UAT environment</p>
        </div>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <UatForm />
            
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
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default UatFormWizard;
