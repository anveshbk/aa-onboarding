
import { z } from "zod";
import formFields from "@/data/formFields.json";
import { createFieldSchema } from "./schemaUtils";

// Build the schema dynamically from the JSON config
const fieldsSchema = formFields.fiuDetails.fields.reduce((acc: Record<string, any>, field) => {
  acc[field.id] = createFieldSchema(field);
  return acc;
}, {});

// Add conditional validation for agreement file
export const FiuDetailsSchema = z.object(fieldsSchema)
  .refine(data => {
    // If agreement is executed, agreement file is required
    if (data.agreementExecuted && !data.agreementFile?.file && !data.agreementFile?.url) {
      return false;
    }
    return true;
  }, {
    message: "Agreement document is required when agreement is executed",
    path: ["agreementFile"]
  });
