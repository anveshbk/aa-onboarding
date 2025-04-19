
import { z } from "zod";

const ConsentParamItemSchema = z.object({
  usecaseDetails: z.string().optional(),
  purposeCode: z.string().optional(),
  purposeText: z.string().optional(),
  consentValidityPeriod: z.string().optional(),
  fetchType: z.string().optional(),
  consentType: z.array(z.string()).optional(),
  dataFetchFrequency: z.string().optional(),
  fiDataRange: z.string().optional(),
  dataLife: z.string().optional(),
});

export const ConsentParametersSchema = z.object({
  consentParams: z.array(ConsentParamItemSchema).optional(),
});
