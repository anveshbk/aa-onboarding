
import { z } from "zod";

export const IntegrationDetailsSchema = z.object({
  integrationType: z.object({
    webRedirection: z.boolean().optional(),
    webRedirectionUrl: z.string().optional(),
    sdk: z.boolean().optional(),
    sdkVersion: z.string().optional(),
    assisted: z.boolean().optional(),
    detached: z.boolean().optional(),
  }).optional(),
  integrationMode: z.string().optional(),
  figmaUrl: z.string().optional(),
});
