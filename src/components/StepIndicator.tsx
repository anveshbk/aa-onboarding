
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
                className={`step-indicator ${
                  index < currentStep
                    ? "completed"
                    : index === currentStep
                    ? "active"
                    : "pending"
                }`}
              >
                {index < currentStep ? (
                  <Check size={16} />
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
                className={`step-connector ${
                  index < currentStep ? "active" : ""
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
