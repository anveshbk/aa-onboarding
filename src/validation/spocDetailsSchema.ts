
import { z } from "zod";
import formFields from "@/data/formFields.json";
import { createFieldSchema } from "./schemaUtils";

// Build the schema for each SPOC type
export const SpocDetailsSchema = z.object({
  // FIU SPOC (required)
  fiuSpoc: createFieldSchema(formFields.spocDetails.fields.find(f => f.id === "fiuSpoc")),
  
  // FIU Escalation SPOC (required)
  fiuEscalationSpoc: createFieldSchema(formFields.spocDetails.fields.find(f => f.id === "fiuEscalationSpoc")),
  
  // RBI SPOC (optional)
  rbiSpoc: createFieldSchema(formFields.spocDetails.fields.find(f => f.id === "rbiSpoc")),
  
  // Grievance SPOC (optional)
  grievanceSpoc: createFieldSchema(formFields.spocDetails.fields.find(f => f.id === "grievanceSpoc")),
});
