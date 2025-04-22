
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { DurationInputProps } from "./DurationInput";

type FrequencyInputProps = Omit<DurationInputProps, 'placeholder' | 'targetUnit'>;

const FrequencyInput: React.FC<FrequencyInputProps> = ({ 
  value, 
  onChange, 
  units,
  error,
  required = false
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <Input 
          type="number"
          min="1"
          value={value?.number || ""}
          onChange={(e) => onChange({ 
            number: e.target.value, 
            unit: value?.unit || units[0] 
          })}
          className="w-24"
          required={required}
        />
        <span className="text-sm font-medium">times</span>
        <Select
          value={value?.unit || units[0]}
          onValueChange={(unit) => onChange({ 
            number: value?.number || "", 
            unit 
          })}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <p className="text-destructive text-sm flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> {error}
        </p>
      )}
    </div>
  );
};

export default FrequencyInput;
