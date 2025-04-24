
import { z } from "zod";

// ------------------ SCHEMAS ------------------

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

// ------------------ TYPES ------------------

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

export type ConsentTemplateMap = {
  [key: string]: ConsentTemplate | ConsentTemplate[];
};

export type ConsentTemplatesMap = {
  [regulator: string]: ConsentTemplateMap;
};

// ------------------ UTILS ------------------

// Convert common units to days (approximate)
export const toDays = (value: number, unit: string): number => {
  switch (unit.toLowerCase()) {
    case 'day': return value;
    case 'month': return value * 30;
    case 'year': return value * 365;
    default: return value;
  }
};

// Convert from days to a given unit
export const fromDays = (days: number, targetUnit: string): number => {
  switch (targetUnit.toLowerCase()) {
    case 'day': return days;
    case 'month': return days / 30;
    case 'year': return days / 365;
    default: return days;
  }
};

// Parse frequency strings like "31 times per month" or "31 Month"
export const parseFrequencyString = (frequencyStr: string): Duration | null => {
  if (!frequencyStr || frequencyStr === "NA") return null;

  // First try to parse "X times per unit" format
  const regexTimesPerUnit = /(\d+)\s+times?\s+per\s+(\w+)/i;
  const matchTimesPerUnit = frequencyStr.match(regexTimesPerUnit);

  if (matchTimesPerUnit) {
    return {
      number: matchTimesPerUnit[1],
      unit: matchTimesPerUnit[2].charAt(0).toUpperCase() + matchTimesPerUnit[2].slice(1).toLowerCase()
    };
  }

  // Then try standard duration format "X Unit"
  return parsePeriodString(frequencyStr);
};

// Parse period strings like "6 Months", "20 years", "coterminous"
export const parsePeriodString = (periodStr: string): Duration | null => {
  if (!periodStr || periodStr === "NA") return null;

  if (periodStr.toLowerCase().includes("coterminous")) {
    return {
      number: "0",
      unit: "tenure"
    };
  }

  const regex = /(\d+)\s+(\w+)/i;
  const match = periodStr.match(regex);

  if (match) {
    let unit = match[2].toLowerCase();
    if (unit.endsWith('s')) unit = unit.slice(0, -1);
    unit = unit.charAt(0).toUpperCase() + unit.slice(1);
    return {
      number: match[1],
      unit: unit
    };
  }

  return null;
};

// Convert duration to readable string
export const durationToString = (duration: Duration | null): string => {
  if (!duration) return "";

  if (duration.unit === "tenure") {
    return "Coterminous with loan tenure";
  }

  return `${duration.number} ${duration.unit}${Number(duration.number) !== 1 ? 's' : ''}`;
};

// Convert a duration into another unit
export const convertDuration = (duration: Duration, targetUnit: string): Duration => {
  if (!duration.number || isNaN(Number(duration.number))) {
    return { number: "", unit: targetUnit };
  }

  const valueInDays = toDays(Number(duration.number), duration.unit);
  const convertedValue = fromDays(valueInDays, targetUnit);

  return {
    number: String(Math.floor(convertedValue)),
    unit: targetUnit
  };
};

// ------------------ VALIDATIONS ------------------

// General duration validation
export const validateDuration = (
  input: Duration | undefined,
  maxValue: Duration | null
): string | undefined => {
  if (!input || !maxValue) return undefined;
  if (maxValue.unit === "tenure") return undefined;

  if (!input.number || isNaN(Number(input.number))) return undefined;
  if (!maxValue.number || isNaN(Number(maxValue.number))) return undefined;

  const inputDays = toDays(Number(input.number), input.unit);
  const maxDays = toDays(Number(maxValue.number), maxValue.unit);

  if (inputDays > maxDays) {
    const convertedMax = Math.floor(fromDays(maxDays, input.unit));
    return `Maximum allowed is ${convertedMax} ${input.unit}${convertedMax !== 1 ? 's' : ''}`;
  }

  return undefined;
};

// Frequency validation - treats frequency like a duration internally but formats error messages as "X times per unit"
export const validateFrequency = (
  input: Duration | undefined,
  max: Duration | null
): { isValid: boolean; message?: string } => {
  if (!input || !max) return { isValid: true };
  if (!input.number || !max.number) return { isValid: true };
  if (isNaN(Number(input.number)) || isNaN(Number(max.number))) return { isValid: true };

  // Convert both to "times per day" for comparison
  const inputPerDay = Number(input.number) / toDays(1, input.unit);
  const maxPerDay = Number(max.number) / toDays(1, max.unit);

  if (inputPerDay > maxPerDay) {
    // Format the error message to be user-friendly
    return {
      isValid: false,
      message: `Maximum allowed frequency is ${max.number} times per ${max.unit.toLowerCase()}`
    };
  }

  return { isValid: true };
};
