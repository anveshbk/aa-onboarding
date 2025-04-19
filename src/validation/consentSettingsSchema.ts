
import { z } from "zod";

export const ConsentSettingsSchema = z.object({
  title: z.string().optional(),
  consentRequired: z.string().optional(),
  accountTypeFilter: z.boolean().optional(),
  fipSelectionInHostApp: z.boolean().optional(),
  maxFipLimit: z.string().optional(),
  singleFipMultiFip: z.string().optional(),
  accountSelectionType: z.string().optional(),
  targetedAutoDiscovery: z.boolean().optional(),
  targetedDiscoveryDetails: z.string().optional(),
  onemoneyConsentRequestMode: z.string().optional(),
  consentAccountsFlow: z.string().optional(),
  consentAccountMode: z.string().optional(),
  consentApprovalMode: z.string().optional(),
  mobileVerified: z.boolean().optional(),
  verificationProcedure: z.string().optional(),
  fiuLogoVisible: z.boolean().optional(),
  fiuLogo: z.any().optional(),
});
