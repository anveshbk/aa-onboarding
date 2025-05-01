
import { z } from "zod";
import formFields from "@/data/formFields.json";
import { createFieldSchema } from "./schemaUtils";

// Build the schema dynamically from the JSON config but make all fields optional
export const TspDetailsSchema = z.object(
  formFields.tspDetails.fields.reduce((acc: Record<string, any>, field) => {
    // Make all fields optional for testing
    acc[field.id] = createFieldSchema(field).optional();
    return acc;
  }, {})
);
