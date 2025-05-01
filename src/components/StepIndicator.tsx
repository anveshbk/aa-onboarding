
import React from "react";
import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-center w-full mb-2">
        <div className="w-full max-w-3xl">
          <Progress value={progressPercentage} className="h-1.5" />
        </div>
      </div>
      
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-3xl flex">
          {steps.map((step, index) => (
            <div 
              key={`step-${index}`} 
              className={`flex flex-col items-center cursor-pointer ${
                index === 0 ? 'justify-start' : 
                index === steps.length - 1 ? 'justify-end ml-auto' : 
                'justify-center flex-1'
              }`}
              onClick={() => onStepClick && onStepClick(index)}
            >
              <div 
                className={`flex items-center justify-center w-7 h-7 rounded-full border-2 mb-2 ${
                  index <= currentStep 
                    ? "bg-primary border-primary" 
                    : "bg-white border-gray-300"
                }`}
              >
                {index <= currentStep && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span 
                className={`text-sm ${
                  index <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
