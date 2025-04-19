
import { z } from "zod";

export const LicenseDetailsSchema = z.object({
  regulator: z.string().optional(),
  licenseType: z.string().optional(),
  licenseCopy: z.any().optional(),
  licenseNo: z.string().optional(),
});
