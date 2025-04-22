
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
  fiType?: string
): ConsentTemplate | null => {
  const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;
  
  const findMatchingTemplate = (templates: ConsentTemplate | ConsentTemplate[]): ConsentTemplate | null => {
    if (Array.isArray(templates)) {
      if (fiType) {
        const fiTypeSpecificTemplate = templates.find(
          t => t.usecaseCategory === usecaseCategory && 
               t.fiTypes?.includes(fiType)
        );
        
        if (fiTypeSpecificTemplate) return fiTypeSpecificTemplate;
      }
      
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
  
  if (consentTemplates[regulator] && consentTemplates[regulator][purposeCode]) {
    const template = findMatchingTemplate(consentTemplates[regulator][purposeCode]);
    if (template) return template;
  }
  
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
