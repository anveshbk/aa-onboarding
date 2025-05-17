
import { z } from "zod";

export const companyDetailsSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyWebsite: z.string().url("Please enter a valid URL").optional(),
  companyEmail: z.string().email("Please enter a valid email"),
  companyPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  companySize: z.string().min(1, "Please select a company size"),
});
