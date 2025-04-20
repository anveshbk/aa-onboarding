
import { z } from "zod";

export const FiuDetailsSchema = z.object({
  fiuRegisteredName: z.string().optional(),
  regulator: z.string().optional(),
  licenseType: z.string().optional(),
  licenseCopy: z.any().optional(),
  licenseCopyPassword: z.string().optional(),
  licenseNo: z.string().optional(),
  fiuCrIdUat: z.string().optional(),
  fiuCrIdProd: z.string().optional(),
  agreementExecuted: z.boolean().optional(),
  agreementFile: z.any().optional(),
  agreementFilePassword: z.string().optional(),
});
