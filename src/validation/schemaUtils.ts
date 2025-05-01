
import { z } from "zod";

// Function to create dynamic validation schema based on JSON config
export const createFieldSchema = (field: any) => {
  if (!field) {
    return z.any().optional();
  }

  if (field.type === "contact") {
    // Handle contact type fields (with nested fields)
    return createContactSchema(field);
  }
  
  if (field.type === "fileOrLink") {
    // Handle file or link type fields
    return createFileOrLinkSchema(field);
  }
  
  if (field.type === "multipleInputs" && field.inputType === "url") {
    // Handle arrays of URLs
    return createUrlArraySchema(field);
  }
  
  if (field.type === "multipleOptions") {
    // Handle multiple options type
    return createMultipleOptionsSchema(field);
  }
  
  if (field.type === "toggle") {
    // Handle toggle fields (boolean)
    return field.required 
      ? z.boolean({ required_error: `${field.name} is required` })
      : z.boolean().optional();
  }
  
  if (field.type === "dropdown") {
    // Handle dropdown fields
    return field.required 
      ? z.string({ required_error: `${field.name} is required` }).min(1, `${field.name} is required`)
      : z.string().optional();
  }
  
  if (field.type === "date") {
    // Handle date fields
    return field.required 
      ? z.string().min(1, { message: `${field.name} is required` })
      : z.string().optional();
  }
  
  // Default case for text fields
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

// Helper for contact type fields with nested validation
const createContactSchema = (field: any) => {
  const contactSchema: Record<string, any> = {};
  
  // Define default validations for contact fields
  const validationRules = field.validation || {
    name: { required: field.required },
    email: { required: field.required, type: "email" },
    mobileNumber: { required: field.required, type: "phone" },
    designation: { required: field.required }
  };
  
  // Name validation
  let nameSchema = z.string();
  if (validationRules.name?.required) {
    nameSchema = nameSchema.min(1, { message: "Name is required" });
  }
  if (validationRules.name?.minLength) {
    nameSchema = nameSchema.min(validationRules.name.minLength, {
      message: `Name must be at least ${validationRules.name.minLength} characters`
    });
  }
  contactSchema.name = validationRules.name?.required ? nameSchema : nameSchema.optional();
  
  // Email validation
  let emailSchema = z.string();
  if (validationRules.email?.required) {
    emailSchema = emailSchema.min(1, { message: "Email is required" });
  }
  if (validationRules.email?.type === "email") {
    emailSchema = emailSchema.email({ message: "Please enter a valid email address" });
  }
  contactSchema.email = validationRules.email?.required ? emailSchema : emailSchema.optional();
  
  // Mobile number validation
  let mobileSchema = z.string();
  if (validationRules.mobileNumber?.required) {
    mobileSchema = mobileSchema.min(1, { message: "Mobile number is required" });
  }
  if (validationRules.mobileNumber?.pattern) {
    mobileSchema = mobileSchema.regex(new RegExp(validationRules.mobileNumber.pattern), {
      message: validationRules.mobileNumber.message || "Please enter a valid mobile number"
    });
  }
  contactSchema.mobileNumber = validationRules.mobileNumber?.required ? mobileSchema : mobileSchema.optional();
  
  // Designation validation
  let designationSchema = z.string();
  if (validationRules.designation?.required) {
    designationSchema = designationSchema.min(1, { message: "Designation is required" });
  }
  contactSchema.designation = validationRules.designation?.required ? designationSchema : designationSchema.optional();
  
  return z.object(contactSchema);
};

// Helper for file or link type fields
const createFileOrLinkSchema = (field: any) => {
  return z.object({
    file: z.any().optional(),
    url: z.string().optional(),
    password: z.string().optional(),
  }).refine(data => {
    if (field.required) {
      return !!(data.file || data.url);
    }
    return true;
  }, {
    message: `${field.name} is required. Please provide a file or link.`,
    path: ["file"]
  });
};

// Helper for URL array fields
const createUrlArraySchema = (field: any) => {
  const urlSchema = field.required 
    ? z.array(z.string().url({ message: "Please enter a valid URL" })).min(1, { message: `At least one ${field.name} is required` })
    : z.array(z.string().url({ message: "Please enter a valid URL" })).optional();
  
  return urlSchema;
};

// Helper for multiple options fields
const createMultipleOptionsSchema = (field: any) => {
  const optionsSchema: Record<string, any> = {};
  
  field.options.forEach((option: any) => {
    optionsSchema[option.id] = z.boolean().optional();
  });
  
  return z.object(optionsSchema).refine(data => {
    if (field.required) {
      return Object.values(data).some(value => value === true);
    }
    return true;
  }, {
    message: `Please select at least one ${field.name} option`,
    path: [field.options[0].id]
  });
};
