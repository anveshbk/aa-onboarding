
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  email: z.string().email("Invalid email format"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
});

export const SpocDetailsSchema = z.object({
  tspSpoc: ContactSchema,
  fiuSpoc: ContactSchema,
  fiuEscalationSpoc: ContactSchema,
  rbiSpoc: ContactSchema,
  grievanceSpoc: ContactSchema,
});
