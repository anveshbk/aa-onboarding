
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
      const values = Array.isArray(value) ? value : [value].filter(Boolean);
      if (values.includes(option)) {
        onChange(values.filter((v) => v !== option));
      } else {
        onChange([...values, option]);
      }
    } else {
      onChange(option);
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
