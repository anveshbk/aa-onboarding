
import { z } from "zod";
import formFields from "@/data/formFields.json";

// Function to create dynamic validation schema based on JSON config
const createFieldSchema = (field: any) => {
  let schema = z.string();
  
  // Apply required validation if specified
  if (field.required) {
    schema = schema.min(1, { message: `${field.name} is required` });
  }
  
  // Apply additional validations if specified
  if (field.validation) {
    if (field.validation.minLength) {
      schema = schema.min(field.validation.minLength, {
        message: `${field.name} must be at least ${field.validation.minLength} characters`
      });
    }
    
    if (field.validation.maxLength) {
      schema = schema.max(field.validation.maxLength, {
        message: `${field.name} must not exceed ${field.validation.maxLength} characters`
      });
    }
    
    if (field.validation.pattern) {
      schema = schema.regex(new RegExp(field.validation.pattern), {
        message: field.validation.message || `Invalid format for ${field.name}`
      });
    }
    
    if (field.validation.type === "email") {
      schema = schema.email({ message: `Please enter a valid email address` });
    }
    
    if (field.validation.type === "url") {
      schema = schema.url({ message: `Please enter a valid URL` });
    }
    
    if (field.validation.type === "phone") {
      schema = schema.regex(new RegExp(field.validation.pattern || "^[0-9]{10}$"), {
        message: field.validation.message || "Please enter a valid phone number"
      });
    }
  }
  
  // Make field optional after applying all validations if not required
  return field.required ? schema : schema.optional();
};

// Build the schema dynamically from the JSON config
export const TspDetailsSchema = z.object(
  formFields.tspDetails.fields.reduce((acc: Record<string, any>, field) => {
    acc[field.id] = createFieldSchema(field);
    return acc;
  }, {})
);
