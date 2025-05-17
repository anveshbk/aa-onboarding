
import React from "react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-6">
      <div className="w-full max-w-4xl mx-auto relative">
        {/* Progress Bar Lines */}
        <div className="absolute top-[18px] left-0 w-full h-[1px]">
          {steps.map((_, index) => (
            <React.Fragment key={`line-${index}`}>
              {index < steps.length - 1 && (
                <div 
                  className={`absolute h-[1px] ${
                    index < currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                  style={{
                    left: `${(index * 100) / (steps.length - 1)}%`,
                    width: `${100 / (steps.length - 1)}%`,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step Circles and Labels */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div 
              key={`step-${index}`} 
              className="flex flex-col items-center"
              onClick={() => onStepClick && onStepClick(index)}
            >
              <div 
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center mb-2 cursor-pointer ${
                  index <= currentStep 
                    ? index === currentStep
                      ? "bg-primary border-primary" 
                      : "bg-white border-primary"
                    : "bg-white border-gray-200"
                }`}
              >
                {index < currentStep && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {index === currentStep && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span 
                className={`text-sm ${
                  index <= currentStep ? "text-primary font-medium" : "text-gray-400"
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
