import { z } from "zod";

const DurationSchema = z.object({
  number: z.string().optional(),
  unit: z.string().optional()
});

const ConsentParamItemSchema = z.object({
  usecaseCategory: z.string().optional(),
  purposeCode: z.string().optional(),
  purposeText: z.string().optional(),
  consentValidityPeriod: DurationSchema.optional(),
  fetchType: z.string().optional(),
  consentType: z.array(z.string()).optional(),
  fiTypes: z.array(z.string()).optional(),
  dataFetchFrequency: DurationSchema.optional(),
  fiDataRange: DurationSchema.optional(),
  dataLife: DurationSchema.optional(),
});

export const ConsentParametersSchema = z.object({
  consentParams: z.array(ConsentParamItemSchema).optional(),
});

// Define TypeScript interfaces for consent templates
export interface Duration {
  number: string;
  unit: string;
}

export interface ConsentTemplate {
  usecaseCategory?: string;
  purposeText?: string;
  maxConsentValidity?: string;
  maxFiDataRange?: string;
  maxDataLife?: string;
  fetchType?: string;
  maxFrequency?: string;
  fiTypes?: string[];
  consentType?: string[];
}

// Export TypeScript interfaces for type checking
export type ConsentTemplateMap = {
  [key: string]: ConsentTemplate | ConsentTemplate[];
};

export type ConsentTemplatesMap = {
  [regulator: string]: ConsentTemplateMap;
};

// Helper functions for duration validation
export const toDays = (value: number, unit: string): number => {
  switch (unit.toLowerCase()) {
    case 'day': return value;
    case 'month': return value * 30; // Approximation
    case 'year': return value * 365; // Approximation
    default: return value;
  }
};

export const fromDays = (days: number, targetUnit: string): number => {
  switch (targetUnit.toLowerCase()) {
    case 'day': return days;
    case 'month': return days / 30; // Approximation
    case 'year': return days / 365; // Approximation
    default: return days;
  }
};

// Parse template strings like "31 times per month" to extract value and unit
export const parseFrequencyString = (frequencyStr: string): Duration | null => {
  if (!frequencyStr || frequencyStr === "NA") return null;
  
  const regex = /(\d+)\s+times?\s+per\s+(\w+)/i;
  const match = frequencyStr.match(regex);
  
  if (match) {
    return {
      number: match[1],
      unit: match[2].toLowerCase()
    };
  }
  
  return null;
};

// Parse period strings like "1 Month", "6 months", "20 years"
export const parsePeriodString = (periodStr: string): Duration | null => {
  if (!periodStr || periodStr === "NA") return null;
  
  // Handle special cases
  if (periodStr.toLowerCase().includes("coterminous")) {
    return {
      number: "999", // Special value for coterminous
      unit: "tenure"
    };
  }
  
  const regex = /(\d+)\s+(\w+)/i;
  const match = periodStr.match(regex);
  
  if (match) {
    let unit = match[2].toLowerCase();
    // Convert to singular form if needed
    if (unit.endsWith('s')) unit = unit.slice(0, -1);
    
    return {
      number: match[1],
      unit: unit
    };
  }
  
  return null;
};

// Convert a duration to a readable string
export const durationToString = (duration: Duration | null): string => {
  if (!duration) return "";
  
  if (duration.unit === "tenure") {
    return "Coterminous with loan tenure";
  }
  
  return `${duration.number} ${duration.unit}${Number(duration.number) !== 1 ? 's' : ''}`;
};

// Convert a duration to another unit
export const convertDuration = (duration: Duration, targetUnit: string): Duration => {
  if (!duration.number || isNaN(Number(duration.number))) {
    return { number: "", unit: targetUnit };
  }
  
  // Convert to days first
  const valueInDays = toDays(Number(duration.number), duration.unit);
  
  // Then convert to target unit
  const convertedValue = fromDays(valueInDays, targetUnit);
  
  return {
    number: String(Math.floor(convertedValue)),
    unit: targetUnit
  };
};

// Validate duration against maximum value with improved error clearing
export const validateDuration = (
  input: Duration | undefined,
  maxValue: Duration | null
): string | undefined => {
  // If no input or maxValue, no validation needed
  if (!input || !maxValue) return undefined;
  
  // Special case for coterminous
  if (maxValue.unit === "tenure") {
    return undefined; // Always valid
  }
  
  // If input number is empty or not a valid number, no validation needed
  if (!input.number || input.number.trim() === "" || isNaN(Number(input.number))) {
    return undefined;
  }
  
  // If maxValue number is empty or not a valid number, no validation needed
  if (!maxValue.number || maxValue.number.trim() === "" || isNaN(Number(maxValue.number))) {
    return undefined;
  }
  
  // Convert both to days for comparison
  const inputDays = toDays(Number(input.number), input.unit);
  const maxDays = toDays(Number(maxValue.number), maxValue.unit);
  
  // Only show error if input is greater than max
  if (inputDays > maxDays) {
    // Convert max days to the input unit for display
    const convertedMax = Math.floor(fromDays(maxDays, input.unit));
    return `Maximum allowed is ${convertedMax} ${input.unit}${convertedMax !== 1 ? 's' : ''}`;
  }
  
  // If input is valid (less than or equal to max), return undefined to clear error
  return undefined;
};

// Helper function to convert frequency between different units
export const convertFrequencyToTemplateUnit = (
  value: number, 
  fromUnit: string, 
  toUnit: string
): number => {
  // Convert from current unit to days first
  let valueInDays = value;
  if (fromUnit.toLowerCase() === "month") {
    valueInDays = value * 30; // Approximate conversion
  } else if (fromUnit.toLowerCase() === "year") {
    valueInDays = value * 365; // Approximate conversion
  }
  
  // Then convert from days to the target unit
  if (toUnit.toLowerCase() === "month") {
    return Math.ceil(valueInDays / 30); // Convert days to months
  } else if (toUnit.toLowerCase() === "year") {
    return Math.ceil(valueInDays / 365); // Convert days to years
  }
  
  return valueInDays; // Return in days if target unit is also days
};
