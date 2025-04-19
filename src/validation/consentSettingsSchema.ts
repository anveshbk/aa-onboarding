
import { z } from "zod";

export const ConsentSettingsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  consentRequired: z.string().min(1, "Consent required is required"),
  accountTypeFilter: z.boolean(),
  fipSelectionInHostApp: z.boolean(),
  maxFipLimit: z.string().optional(),
  singleFipMultiFip: z.string().min(1, "Single FIP / Multi FIP is required"),
  accountSelectionType: z.string().min(1, "Account selection type is required"),
  targetedAutoDiscovery: z.boolean(),
  targetedDiscoveryDetails: z.string().optional(),
  onemoneyConsentRequestMode: z.string().min(1, "Consent request mode is required"),
  consentAccountsFlow: z.string().min(1, "Consent accounts flow is required"),
  consentAccountMode: z.string().min(1, "Consent Account Mode is required"),
  consentApprovalMode: z.string().min(1, "Consent Approval Mode is required"),
  mobileVerified: z.boolean(),
  verificationProcedure: z.string().optional(),
  fiuLogoVisible: z.boolean(),
  fiuLogo: z.any().optional(),
});
