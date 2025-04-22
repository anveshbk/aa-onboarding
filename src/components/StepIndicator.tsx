
import React from "react";
import { Check } from "lucide-react";
import { format } from "date-fns";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium text-muted-foreground">Progress bar</div>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium ${
                    index < currentStep
                      ? "bg-primary text-white border-primary"
                      : index === currentStep
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-500"
                  } ${onStepClick ? "cursor-pointer hover:bg-primary/5" : ""}`}
                  onClick={() => onStepClick && onStepClick(index)}
                  title={`Go to ${step}`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`text-xs mt-2 text-center max-w-[100px] truncate ${onStepClick ? "cursor-pointer hover:text-primary" : ""}`} 
                  title={step}
                  onClick={() => onStepClick && onStepClick(index)}
                >
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`h-[1px] flex-1 mx-2 ${
                    index < currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
