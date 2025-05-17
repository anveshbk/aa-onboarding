
import React from "react";
import { cn } from "@/lib/utils";

interface ToggleButtonGroupProps {
  options: string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  multiple = false,
  value = multiple ? [] : "",
  onChange = () => {},
  className,
  disabled = false,
}) => {
  // Safeguard to ensure we're always working with an array for multiple mode
  const safeOptions = Array.isArray(options) ? options : [];
  
  const handleClick = (option: string) => {
    if (disabled) return;
    
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

  // If no options are available, don't render anything
  if (safeOptions.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {safeOptions.map((option) => (
        <button
          key={option}
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border rounded-md transition-colors",
            isSelected(option)
              ? "bg-primary/10 border-primary text-primary"
              : "bg-background border-input text-foreground hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => handleClick(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
