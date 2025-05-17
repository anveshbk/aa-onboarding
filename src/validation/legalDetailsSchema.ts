
import { z } from "zod";

export const legalDetailsSchema = z.object({
  termsAndConditions: z.boolean().refine(value => value === true, {
    message: "You must accept the Terms and Conditions",
  }),
  privacyPolicy: z.boolean().refine(value => value === true, {
    message: "You must accept the Privacy Policy",
  }),
  dataSecurity: z.boolean().refine(value => value === true, {
    message: "You must accept the Data Security Agreement",
  }),
});
