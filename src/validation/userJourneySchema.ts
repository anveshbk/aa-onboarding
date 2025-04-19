
import { z } from "zod";

export const UserJourneySchema = z.object({
  userJourneyVideo: z.any().optional(),
  userJourneyLink: z.string().optional(),
  userJourneyPassword: z.string().optional(),
  agreementExecuted: z.boolean().optional(),
  agreementFile: z.any().optional(),
  consentRequestSMS: z.boolean().optional(),
  fiuCrIdUat: z.string().optional(),
  fiuCrIdProd: z.string().optional(),
});
