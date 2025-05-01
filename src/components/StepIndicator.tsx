
import React from "react";
import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  // Calculate progress percentage
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full py-4 space-y-2">
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`text-xs cursor-pointer ${
              index <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => onStepClick && onStepClick(index)}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
