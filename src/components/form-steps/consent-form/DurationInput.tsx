
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

export interface DurationInputProps {
  value: { number: string; unit: string } | undefined;
  onChange: (value: { number: string; unit: string }) => void;
  units: string[];
  placeholder?: string;
  maxValue: { number: string; unit: string } | null;
  error?: string;
  targetUnit?: string;
  required?: boolean;
}

const DurationInput: React.FC<DurationInputProps> = ({ 
  value, 
  onChange, 
  units, 
  placeholder,
  maxValue,
  error,
  required = false
}) => {
  const handleNumberChange = (numValue: string) => {
    onChange({ number: numValue, unit: value?.unit || units[0] });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          type="number"
          min="1"
          value={value?.number || ""}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={placeholder || "Enter number"}
          className="w-24"
          required={required}
        />
        <Select
          value={value?.unit || units[0]}
          onValueChange={(unit) => onChange({ number: value?.number || "", unit })}
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

export default DurationInput;
