
import { z } from "zod";
import formFields from "@/data/formFields.json";
import { createFieldSchema } from "./schemaUtils";

// Find the whitelisted URLs field from the form fields config
const whitelistedUrlsField = formFields.userJourneySettings.fields.find(f => f.id === "whitelistedUrls");

export const UrlWhitelistingSchema = z.object({
  whitelistedUrls: whitelistedUrlsField ? 
    createFieldSchema(whitelistedUrlsField) : 
    z.array(z.string().url("Invalid URL format")).optional(),
});
