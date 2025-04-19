
import { z } from "zod";

export const CocreatedDevelopmentSchema = z.object({
  dataPassedToOnemoney: z.string().optional(),
  dataSharedFromOnemoney: z.string().optional(),
  onemoneyApiReferenced: z.string().optional(),
});
