
import { z } from "zod";

const durationSchema = z.object({
  number: z.string().optional(),
  unit: z.string().optional(),
}).optional();

export const UserJourneySettingsSchema = z.object({
  userJourneyVideo: z.any().optional(),
  userJourneyVideoPassword: z.string().optional(),
  whitelistedUrls: z.array(z.string()).optional(),
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
