
import React from "react";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4">
      <Timeline defaultValue={currentStep} orientation="horizontal">
        {steps.map((step, index) => (
          <TimelineItem 
            key={index} 
            step={index + 1}
            onClick={() => onStepClick && onStepClick(index)}
          >
            <TimelineHeader>
              <TimelineIndicator>{index + 1}</TimelineIndicator>
              <TimelineTitle>{step}</TimelineTitle>
              <TimelineSeparator />
            </TimelineHeader>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default StepIndicator;
