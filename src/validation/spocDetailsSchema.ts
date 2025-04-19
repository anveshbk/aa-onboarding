
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  email: z.string().optional(),
  mobileNumber: z.string().optional(),
});

export const SpocDetailsSchema = z.object({
  tspSpoc: ContactSchema.optional(),
  fiuSpoc: ContactSchema.optional(),
  fiuEscalationSpoc: ContactSchema.optional(),
  rbiSpoc: ContactSchema.optional(),
  grievanceSpoc: ContactSchema.optional(),
});
