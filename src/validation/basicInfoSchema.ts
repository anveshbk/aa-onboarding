
import { z } from "zod";

export const BasicInfoSchema = z.object({
  tspName: z.string().min(1, "Name of TSP is required"),
  requestDate: z.string().min(1, "Request Date is required"),
  requestedBy: z.string().min(1, "Requested By is required"),
  fiuRegisteredName: z.string().min(1, "FIU registered name is required"),
});
