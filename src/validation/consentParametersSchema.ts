
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

