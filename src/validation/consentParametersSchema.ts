import { z } from "zod";

// Duration schema
const DurationSchema = z.object({
  number: z.string().optional(),
  unit: z.string().optional()
});

// Consent parameter schema
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

// TypeScript interfaces
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

// Convert units to days
export const toDays = (value: number, unit: string): number => {
  switch (unit.toLowerCase()) {
    case 'day': return value;
    case 'month': return value * 30;
    case 'year': return value * 365;
    default: return value;
  }
};

// Convert days to another unit
export const fromDays = (days: number, targetUnit: string): number => {
  switch (targetUnit.toLowerCase()) {
    case 'day': return days;
    case 'month': return days / 30;
    case 'year': return days / 365;
    default: return days;
  }
};

// Normalize unit string
export const standardizeUnit = (unit: string): string => {
  if (!unit) return "";
  let u = unit.toLowerCase();
  if (u.endsWith("s")) u = u.slice(0, -1); // remove plural
  return u.charAt(0).toUpperCase() + u.slice(1); // capitalize
};

// Parse frequency strings like "31 times per month"
export const parseFrequencyString = (frequencyStr: string): Duration | null => {
  if (!frequencyStr || frequencyStr === "NA") return null;

  const regex = /(\d+)\s+times?\s+per\s+(\w+)/i;
  const match = frequencyStr.match(regex);

  if (match) {
    return {
      number: match[1],
      unit: standardizeUnit(match[2])
    };
  }

  return null;
};

// Parse durations like "6 months", "1 year"
export const parsePeriodString = (periodStr: string): Duration | null => {
  if (!periodStr || periodStr === "NA") return null;

  if (periodStr.toLowerCase().includes("coterminous")) {
    return { number: "0", unit: "tenure" };
  }

  const regex = /(\d+)\s+(\w+)/i;
  const match = periodStr.match(regex);

  if (match) {
    let unit = match[2].toLowerCase();
    if (unit.endsWith('s')) unit = unit.slice(0, -1);
    unit = unit.charAt(0).toUpperCase() + unit.slice(1);
    return { number: match[1], unit };
  }

  return null;
};

// Human-readable duration
export const durationToString = (duration: Duration | null): string => {
  if (!duration) return "";
  if (duration.unit === "tenure") return "Coterminous with loan tenure";
  return `${duration.number} ${duration.unit}${Number(duration.number) !== 1 ? 's' : ''}`;
};

// Convert duration to another unit
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

// Validate general duration
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

// ✅ Validate dataFetchFrequency against maxFrequency
export const validateFrequency = (
  input: Duration | undefined,
  max: Duration | null
): string | undefined => {
  if (!input || !max) return undefined;
  if (!input.number || !max.number) return undefined;
  if (isNaN(Number(input.number)) || isNaN(Number(max.number))) return undefined;

  const inputUnit = standardizeUnit(input.unit);
  const maxUnit = standardizeUnit(max.unit);

  const inputPerDay = Number(input.number) / toDays(1, inputUnit);
  const maxPerDay = Number(max.number) / toDays(1, maxUnit);

  if (inputPerDay > maxPerDay) {
    return `Maximum allowed frequency is ${max.number} times per ${max.unit.toLowerCase()}`;
  }

  return undefined;
};
