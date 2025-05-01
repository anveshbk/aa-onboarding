
import React from "react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-6 space-y-4">
      <div className="flex items-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Circle Indicator */}
            <div 
              className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 cursor-pointer ${
                index <= currentStep 
                  ? "bg-primary border-primary" 
                  : "bg-white border-gray-300"
              }`}
              onClick={() => onStepClick && onStepClick(index)}
            >
              {index <= currentStep && (
                <div className="w-3 h-3 rounded-full bg-white"></div>
              )}
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2">
                <div 
                  className={`h-full ${
                    index < currentStep ? "bg-primary" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Step Labels */}
      <div className="flex w-full">
        {steps.map((step, index) => (
          <div 
            key={`label-${index}`}
            className={`text-sm cursor-pointer ${
              index <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
            }`}
            onClick={() => onStepClick && onStepClick(index)}
            style={{ 
              width: `${100/steps.length}%`,
              paddingLeft: index === 0 ? '0' : '',
              paddingRight: index === steps.length - 1 ? '0' : '',
              textAlign: index === 0 ? 'left' : index === steps.length - 1 ? 'right' : 'center'
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
