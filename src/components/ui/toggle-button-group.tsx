
import React from "react";
import { cn } from "@/lib/utils";

interface ToggleButtonGroupProps {
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  className,
}) => {
  const handleClick = (option: string) => {
    if (multiple) {
      // For multiple selection mode
      const currentValues = Array.isArray(value) ? value : [];
      
      if (currentValues.includes(option)) {
        // If already selected, remove it (deselect)
        onChange(currentValues.filter((v) => v !== option));
      } else {
        // If not selected, add it
        onChange([...currentValues, option]);
      }
    } else {
      // For single selection mode
      // Toggle selection - if clicking the already selected item, deselect it
      if (value === option) {
        onChange("");
      } else {
        onChange(option);
      }
    }
  };

  const isSelected = (option: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(option);
    }
    return value === option;
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border rounded-md transition-colors",
            isSelected(option)
              ? "bg-primary/10 border-primary text-primary"
              : "bg-background border-input text-foreground hover:bg-muted/50"
          )}
          onClick={() => handleClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
