
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
