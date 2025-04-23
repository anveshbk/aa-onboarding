
import { ConsentTemplate, ConsentTemplatesMap, Duration } from "@/validation/consentParametersSchema";
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

// Get all usecase categories based on regulator
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
  
  // Also consider templates marked for "All" regulators
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
  
  return Array.from(categories).sort();
};

// Get purpose codes based on regulator and usecase category
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
  
  // Check regulator-specific templates
  if (templates[regulator]) {
    extractPurposeCodes(templates[regulator]);
  }
  
  // Also check templates for "All" regulators
  if (templates["All"]) {
    extractPurposeCodes(templates["All"]);
  }
  
  return [...new Set(codes)].sort();
};

// Find the best matching template based on multiple criteria
export const getFilteredTemplate = (
  regulator: string, 
  purposeCode: string, 
  usecaseCategory: string,
  selectedFiTypes: string[] = [],
  selectedConsentTypes: string[] = []
): ConsentTemplate | null => {
  const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;
  
  const findMatchingTemplate = (templates: ConsentTemplate | ConsentTemplate[]): ConsentTemplate | null => {
    if (Array.isArray(templates)) {
      // Try to find a template that matches all criteria including FI types and consent types
      if (selectedFiTypes.length > 0) {
        const fiTypeMatches = templates.filter(t => {
          if (t.usecaseCategory !== usecaseCategory) return false;
          if (!t.fiTypes) return false;
          
          // Check if any selected FI type is in the template's allowed FI types
          return selectedFiTypes.some(selectedType => t.fiTypes?.includes(selectedType));
        });

        if (fiTypeMatches.length > 0) {
          // If we have FI type matches, try to further filter by consent types if possible
          if (selectedConsentTypes.length > 0) {
            const consentTypeMatches = fiTypeMatches.filter(t => {
              if (!t.consentType) return false;
              return selectedConsentTypes.some(selectedType => t.consentType?.includes(selectedType));
            });
            
            if (consentTypeMatches.length > 0) {
              return consentTypeMatches[0]; // Return the first matching template
            }
          }
          
          return fiTypeMatches[0]; // Return the first FI type matching template
        }
      }
      
      // If no specific matches, return the first template for this usecase category
      return templates.find(t => t.usecaseCategory === usecaseCategory) || null;
    } 
    else if (templates.usecaseCategory === usecaseCategory) {
      return templates;
    }
    
    return null;
  };
  
  // First check regulator-specific templates
  if (consentTemplates[regulator] && consentTemplates[regulator][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates[regulator][purposeCode]);
    if (template) return template;
  }
  
  // Then check templates for "All" regulators
  if (consentTemplates["All"] && consentTemplates["All"][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates["All"][purposeCode]);
    if (template) return template;
  }
  
  return null;
};

// Get allowed FI types based on selected regulator, purpose code, and usecase category
export const getAllowedFiTypes = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string
): string[] => {
  if (!regulator || !purposeCode || !usecaseCategory) return [];
  
  const template = getFilteredTemplate(regulator, purposeCode, usecaseCategory);
  return template?.fiTypes || [];
};

// Get allowed consent types based on selected criteria
export const getAllowedConsentTypes = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string,
  selectedFiTypes: string[] = []
): string[] => {
  if (!regulator || !purposeCode || !usecaseCategory) return [];
  
  const template = getFilteredTemplate(regulator, purposeCode, usecaseCategory, selectedFiTypes);
  return template?.consentType || [];
};

// Get required fetch type based on selected criteria
export const getRequiredFetchType = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string,
  selectedFiTypes: string[] = []
): string | null => {
  if (!regulator || !purposeCode || !usecaseCategory) return null;
  
  const template = getFilteredTemplate(regulator, purposeCode, usecaseCategory, selectedFiTypes);
  return template?.fetchType || null;
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
