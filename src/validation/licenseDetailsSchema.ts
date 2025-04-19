
import { z } from "zod";

export const LicenseDetailsSchema = z.object({
  regulator: z.string().min(1, "Regulator is required"),
  licenseType: z.string().min(1, "License Type is required"),
  licenseCopy: z.any().optional(),
  licenseNo: z.string().min(1, "License No. is required"),
});
