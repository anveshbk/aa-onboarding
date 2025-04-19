
import { z } from "zod";

export const BasicInfoSchema = z.object({
  tspName: z.string().optional(),
  requestDate: z.string().optional(),
  requestedBy: z.string().optional(),
  fiuRegisteredName: z.string().optional(),
});
