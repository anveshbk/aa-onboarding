import { ConsentTemplate, ConsentTemplatesMap } from "@/validation/consentParametersSchema";
import formFields from "@/data/formFields.json";

// Define proper types for the template structures
interface TemplateData {
  usecaseCategory?: string;
  purposeText?: string;
  maxConsentValidity?: string;
  maxFiDataRange?: string;
  maxDataLife?: string;
  fetchType?: string;
  maxFrequency?: string;
  fiTypes?: string[];
  consentType?: string[];
}

export const getUsecaseCategories = (regulator: string) => {
  const categories = new Set<string>();
  
  if (formFields.consentTemplates[regulator]) {
    Object.values(formFields.consentTemplates[regulator]).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          const typedTemplate = t as TemplateData;
          if (typedTemplate.usecaseCategory) categories.add(typedTemplate.usecaseCategory);
        });
      } else {
        const typedTemplate = template as TemplateData;
        if (typedTemplate.usecaseCategory) categories.add(typedTemplate.usecaseCategory);
      }
    });
  }
  
  if (formFields.consentTemplates["All"]) {
    Object.values(formFields.consentTemplates["All"]).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          const typedTemplate = t as TemplateData;
          if (typedTemplate.usecaseCategory) categories.add(typedTemplate.usecaseCategory);
        });
      } else {
        const typedTemplate = template as TemplateData;
        if (typedTemplate.usecaseCategory) categories.add(typedTemplate.usecaseCategory);
      }
    });
  }
  
  return Array.from(categories);
};

export const getPurposeCodes = (regulator: string, usecaseCategory: string) => {
  if (!regulator || !usecaseCategory) return [];
  
  const templates = formFields.consentTemplates;
  let codes: string[] = [];
  
  const extractPurposeCodes = (regulatorTemplates: any) => {
    Object.entries(regulatorTemplates).forEach(([code, templateData]) => {
      if (Array.isArray(templateData)) {
        if (templateData.some(t => (t as TemplateData).usecaseCategory === usecaseCategory)) {
          codes.push(code);
        }
      } else if ((templateData as TemplateData).usecaseCategory === usecaseCategory) {
        codes.push(code);
      }
    });
  };
  
  if (templates[regulator]) {
    extractPurposeCodes(templates[regulator]);
  }
  
  if (templates["All"]) {
    extractPurposeCodes(templates["All"]);
  }
  
  return [...new Set(codes)];
};

export const getFilteredTemplate = (
  regulator: string, 
  purposeCode: string, 
  usecaseCategory: string,
  fiType?: string,
  fetchType?: string,
  consentType?: string[]
): ConsentTemplate | null => {
  const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;
  
  const findMatchingTemplate = (templates: ConsentTemplate | ConsentTemplate[]): ConsentTemplate | null => {
    if (Array.isArray(templates)) {
      // First try to find a template that matches all criteria
      if (fiType && fetchType && consentType) {
        const exactMatch = templates.find(
          t => t.usecaseCategory === usecaseCategory && 
               t.fiTypes?.includes(fiType) &&
               t.fetchType === fetchType &&
               t.consentType?.some(type => consentType.includes(type))
        );
        
        if (exactMatch) return exactMatch;
      }
      
      // Then try to find a template that matches FI type
      if (fiType) {
        const fiTypeMatch = templates.find(
          t => t.usecaseCategory === usecaseCategory && 
               t.fiTypes?.includes(fiType)
        );
        
        if (fiTypeMatch) return fiTypeMatch;
      }
      
      // Finally, fall back to usecase category match
      const fallbackTemplate = templates.find(
        t => t.usecaseCategory === usecaseCategory
      );
      
      return fallbackTemplate || null;
    } 
    else if (templates.usecaseCategory === usecaseCategory) {
      return templates;
    }
    
    return null;
  };
  
  // First try to find a template in the regulator-specific templates
  if (consentTemplates[regulator] && consentTemplates[regulator][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates[regulator][purposeCode]);
    if (template) return template;
  }
  
  // Then try to find a template in the "All" templates
  if (consentTemplates["All"] && consentTemplates["All"][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates["All"][purposeCode]);
    if (template) return template;
  }
  
  return null;
};

export const isFieldRequired = (fieldName: string): boolean => {
  const field = formFields.consentParameters?.consentParamFields?.find(f => f.id === fieldName);
  return field?.required === true;
};

// Helper function to format the max validity period for display
export const formatMaxValidity = (maxConsentValidity: string | undefined): string => {
  if (!maxConsentValidity) return "";
  
  // Special handling for "Coterminous with loan tenure"
  if (maxConsentValidity.toLowerCase().includes("coterminous")) {
    return "Coterminous with loan tenure";
  }
  
  return maxConsentValidity;
};

// Helper function to convert frequency between different units
export const convertFrequencyToTemplateUnit = (
  value: number, 
  fromUnit: string, 
  toUnit: string
): number => {
  // Convert from current unit to days first
  let valueInDays = value;
  if (fromUnit.toLowerCase() === "month") {
    valueInDays = value * 30; // Approximate conversion
  } else if (fromUnit.toLowerCase() === "year") {
    valueInDays = value * 365; // Approximate conversion
  }
  
  // Then convert from days to the target unit
  if (toUnit.toLowerCase() === "month") {
    return Math.ceil(valueInDays / 30); // Convert days to months
  } else if (toUnit.toLowerCase() === "year") {
    return Math.ceil(valueInDays / 365); // Convert days to years
  }
  
  return valueInDays; // Return in days if target unit is also days
};
