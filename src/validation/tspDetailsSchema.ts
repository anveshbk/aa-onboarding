
import { z } from "zod";

export const TspDetailsSchema = z.object({
  tspName: z.string().optional(),
  requestDate: z.string().optional(),
  requestedBy: z.string().optional(),
  tspSpocEmail: z.string().optional(),
});
