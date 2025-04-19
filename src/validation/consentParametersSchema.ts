
import { z } from "zod";

const ConsentParamItemSchema = z.object({
  usecaseDetails: z.string().min(1, "Usecase details are required"),
  purposeCode: z.string().min(1, "Purpose Code is required"),
  purposeText: z.string().min(1, "Purpose Text is required"),
  consentValidityPeriod: z.string().min(1, "Consent Validity Period is required"),
  fetchType: z.string().min(1, "Fetch Type is required"),
  consentType: z.array(z.string()).min(1, "At least one Consent Type is required"),
  dataFetchFrequency: z.string().optional(),
  fiDataRange: z.string().min(1, "FI Data Range is required"),
  dataLife: z.string().min(1, "Data Life is required"),
});

export const ConsentParametersSchema = z.object({
  consentParams: z.array(ConsentParamItemSchema).min(1, "At least one consent parameter set is required"),
});
