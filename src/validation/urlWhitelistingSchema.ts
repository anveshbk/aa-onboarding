
import { z } from "zod";

export const UrlWhitelistingSchema = z.object({
  whitelistedUrls: z.array(
    z.string().url("Invalid URL format")
  ).optional(),
});
