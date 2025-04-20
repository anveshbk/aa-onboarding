
import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
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
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-center max-w-[100px] truncate" title={step}>
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  index < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
