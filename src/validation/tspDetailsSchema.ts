
import { z } from "zod";
import formFields from "@/data/formFields.json";
import { createFieldSchema } from "./schemaUtils";

// Build the schema dynamically from the JSON config
export const TspDetailsSchema = z.object(
  formFields.tspDetails.fields.reduce((acc: Record<string, any>, field) => {
    acc[field.id] = createFieldSchema(field);
    return acc;
  }, {})
);
