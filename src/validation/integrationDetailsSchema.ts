
import { z } from "zod";

export const IntegrationDetailsSchema = z.object({
  integrationType: z.object({
    webRedirection: z.boolean().optional(),
    webRedirectionUrl: z.string().optional(),
    sdk: z.boolean().optional(),
    sdkVersion: z.string().optional(),
    assisted: z.boolean().optional(),
    detached: z.boolean().optional(),
  }),
  integrationMode: z.string().min(1, "Integration Mode is required"),
  figmaUrl: z.string().optional(),
});
