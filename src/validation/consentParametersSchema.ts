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

export const toDays = (value: number, unit: string): number => {
  switch (unit.toLowerCase()) {
    case 'day': return value;
    case 'month': return value * 30;
    case 'year': return value * 365;
    default: return value;
  }
};

export const fromDays = (days: number, targetUnit: string): number => {
  switch (targetUnit.toLowerCase()) {
    case 'day': return days;
    case 'month': return days / 30;
    case 'year': return days / 365;
    default: return days;
  }
};

export const parseFrequencyString = (frequencyStr: string): Duration | null => {
  if (!frequencyStr || frequencyStr === "NA") return null;

  const regex = /([\d.]+)\s+times?\s+per\s+(\w+)/i;
  const match = frequencyStr.match(regex);

  if (match) {
    return {
      number: match[1],
      unit: match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
    };
  }

  return null;
};

export const parsePeriodString = (periodStr: string): Duration | null => {
  if (!periodStr || periodStr === "NA") return null;

  if (periodStr.toLowerCase().includes("coterminous")) {
    return {
      number: "0",
      unit: "tenure"
    };
  }

  const regex = /([\d.]+)\s+(\w+)/i;
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

export const durationToString = (duration: Duration | null): string => {
  if (!duration) return "";

  if (duration.unit === "tenure") {
    return "Coterminous with loan tenure";
  }

  return `${duration.number} ${duration.unit}${Number(duration.number) !== 1 ? 's' : ''}`;
};

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

export const validateDuration = (
  input: Duration | undefined,
  maxValue: Duration | null
): string | undefined => {
  if (!input || !maxValue) return undefined;
  if (maxValue.unit === "tenure") return undefined;
  if (!input.number || input.number.trim() === "" || isNaN(Number(input.number))) return undefined;
  if (!maxValue.number || maxValue.number.trim() === "" || isNaN(Number(maxValue.number))) return undefined;

  const inputDays = toDays(Number(input.number), input.unit);
  const maxDays = toDays(Number(maxValue.number), maxValue.unit);

  if (inputDays > maxDays) {
    const convertedMax = Math.floor(fromDays(maxDays, input.unit));
    return `Maximum allowed is ${convertedMax} ${input.unit}${convertedMax !== 1 ? 's' : ''}`;
  }

  return undefined;
};

export const validateFrequencyAgainstTemplate = (
  userInput: Duration | undefined,
  templateMaxFrequency: string | undefined
): string | undefined => {
  if (!userInput || !userInput.number || !templateMaxFrequency) return undefined;

  const parsedTemplate = parseFrequencyString(templateMaxFrequency);
  if (!parsedTemplate) return undefined;

  const inputTimesPerInputUnit = 1; // 1 fetch per input duration
  const totalFetchesPerMonth = inputTimesPerInputUnit * toDays(Number(userInput.number), userInput.unit) / 1;

  const allowedFetchesPerMonth = Number(parsedTemplate.number) * (30 / toDays(1, parsedTemplate.unit));

  if (totalFetchesPerMonth > allowedFetchesPerMonth) {
    const maxTimesPerInputUnit = allowedFetchesPerMonth / (toDays(Number(userInput.number), userInput.unit) / 1);
    return `Maximum allowed is ${maxTimesPerInputUnit.toFixed(2)} times per ${userInput.unit.toLowerCase()}`;
  }

  return undefined;
};
