
import { ConsentTemplate, ConsentTemplatesMap, Duration, parsePeriodString, toDays } from "@/validation/consentParametersSchema";
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

// Helper function to safely check if an object has usecaseCategory property
const hasUsecaseCategory = (obj: any): obj is { usecaseCategory: string } => {
  return obj && typeof obj === 'object' && 'usecaseCategory' in obj;
};

// Get all usecase categories based on regulator
export const getUsecaseCategories = (regulator: string) => {
  if (!regulator) return [];
  
  const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;
  const categories = new Set<string>();
  
  // Process regulator-specific templates
  if (consentTemplates[regulator]) {
    Object.values(consentTemplates[regulator]).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          if (hasUsecaseCategory(t) && t.usecaseCategory) {
            categories.add(t.usecaseCategory);
          }
        });
      } else if (hasUsecaseCategory(template) && template.usecaseCategory) {
        categories.add(template.usecaseCategory);
      }
    });
  }
  
  // Also process templates marked for "All" regulators
  if (consentTemplates["All"]) {
    Object.values(consentTemplates["All"]).forEach(template => {
      if (Array.isArray(template)) {
        template.forEach(t => {
          if (hasUsecaseCategory(t) && t.usecaseCategory) {
            categories.add(t.usecaseCategory);
          }
        });
      } else if (hasUsecaseCategory(template) && template.usecaseCategory) {
        categories.add(template.usecaseCategory);
      }
    });
  }
  
  return Array.from(categories).sort();
};

// Get purpose codes based on regulator and usecase category
export const getPurposeCodes = (regulator: string, usecaseCategory: string) => {
  if (!regulator || !usecaseCategory) return [];
  
  const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;
  const purposeCodes = new Set<string>();
  
  const checkTemplates = (templates: any) => {
    Object.entries(templates).forEach(([code, template]) => {
      if (Array.isArray(template)) {
        if (template.some(t => hasUsecaseCategory(t) && t.usecaseCategory === usecaseCategory)) {
          purposeCodes.add(code);
        }
      } else if (hasUsecaseCategory(template) && template.usecaseCategory === usecaseCategory) {
        purposeCodes.add(code);
      }
    });
  };
  
  // Check regulator-specific templates
  if (consentTemplates[regulator]) {
    checkTemplates(consentTemplates[regulator]);
  }
  
  // Check templates for "All" regulators
  if (consentTemplates["All"]) {
    checkTemplates(consentTemplates["All"]);
  }
  
  return Array.from(purposeCodes).sort();
};

// Find all templates matching the criteria
export const findMatchingTemplates = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string
): ConsentTemplate[] => {
  if (!regulator || !purposeCode || !usecaseCategory) return [];
  
  const consentTemplates = formFields.consentTemplates as ConsentTemplatesMap;
  const matchingTemplates: ConsentTemplate[] = [];
  
  const checkAndAddTemplates = (templates: any) => {
    if (!templates[purposeCode]) return;
    
    const template = templates[purposeCode];
    if (Array.isArray(template)) {
      template.forEach(t => {
        if (hasUsecaseCategory(t) && t.usecaseCategory === usecaseCategory) {
          matchingTemplates.push(t as ConsentTemplate);
        }
      });
    } else if (hasUsecaseCategory(template) && template.usecaseCategory === usecaseCategory) {
      matchingTemplates.push(template as ConsentTemplate);
    }
  };
  
  // Check regulator-specific templates
  if (consentTemplates[regulator]) {
    checkAndAddTemplates(consentTemplates[regulator]);
  }
  
  // Check templates for "All" regulators
  if (consentTemplates["All"]) {
    checkAndAddTemplates(consentTemplates["All"]);
  }
  
  return matchingTemplates;
};

// Get all allowed FI types based on regulator, purpose code and usecase category
export const getAllowedFiTypes = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string
): string[] => {
  if (!regulator || !purposeCode || !usecaseCategory) return [];
  
  const matchingTemplates = findMatchingTemplates(regulator, purposeCode, usecaseCategory);
  
  // Collect all unique FI types from matching templates
  const fiTypes = new Set<string>();
  matchingTemplates.forEach(template => {
    if (template.fiTypes) {
      template.fiTypes.forEach(type => fiTypes.add(type));
    }
  });
  
  return Array.from(fiTypes).sort();
};

// Get required fetch type based on template
export const getRequiredFetchType = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string
): string | null => {
  if (!regulator || !purposeCode || !usecaseCategory) return null;
  
  const matchingTemplates = findMatchingTemplates(regulator, purposeCode, usecaseCategory);
  if (matchingTemplates.length === 0) return null;
  
  // Check if all templates have the same fetch type
  const fetchType = matchingTemplates[0].fetchType;
  const allSame = matchingTemplates.every(t => t.fetchType === fetchType);
  
  return allSame ? fetchType : null;
};

// Get allowed consent types based on selected criteria
export const getAllowedConsentTypes = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string,
  selectedFiTypes: string[] = []
): string[] => {
  if (!regulator || !purposeCode || !usecaseCategory) return [];
  
  const matchingTemplates = findMatchingTemplates(regulator, purposeCode, usecaseCategory);
  
  // Filter templates that match selected FI types
  let filteredTemplates = matchingTemplates;
  if (selectedFiTypes.length > 0) {
    filteredTemplates = matchingTemplates.filter(template => {
      if (!template.fiTypes) return false;
      return selectedFiTypes.some(fiType => template.fiTypes?.includes(fiType));
    });
    
    // If no templates match the selected FI types, fall back to all matching templates
    if (filteredTemplates.length === 0) {
      filteredTemplates = matchingTemplates;
    }
  }
  
  // Collect all unique consent types from filtered templates
  const consentTypes = new Set<string>();
  filteredTemplates.forEach(template => {
    if (template.consentType) {
      template.consentType.forEach(type => consentTypes.add(type));
    }
  });
  
  return Array.from(consentTypes).sort();
};

// Find best matching template based on all criteria
export const getBestMatchingTemplate = (
  regulator: string,
  purposeCode: string,
  usecaseCategory: string,
  selectedFiTypes: string[] = [],
  selectedConsentTypes: string[] = []
): ConsentTemplate | null => {
  if (!regulator || !purposeCode || !usecaseCategory) return null;
  
  const matchingTemplates = findMatchingTemplates(regulator, purposeCode, usecaseCategory);
  if (matchingTemplates.length === 0) return null;
  
  // Score templates based on how well they match the selected criteria
  const scoredTemplates = matchingTemplates.map(template => {
    let score = 0;
    
    // Score based on FI type matches
    if (selectedFiTypes.length > 0 && template.fiTypes) {
      const fiTypeMatches = selectedFiTypes.filter(fiType => 
        template.fiTypes?.includes(fiType)
      ).length;
      score += fiTypeMatches * 10; // Weight FI type matches higher
    }
    
    // Score based on consent type matches
    if (selectedConsentTypes.length > 0 && template.consentType) {
      const consentTypeMatches = selectedConsentTypes.filter(consentType => 
        template.consentType?.includes(consentType)
      ).length;
      score += consentTypeMatches * 5;
    }
    
    return { template, score };
  });
  
  // Sort by score (descending)
  scoredTemplates.sort((a, b) => b.score - a.score);
  
  // Return the template with the highest score
  return scoredTemplates[0]?.template || matchingTemplates[0];
};

// Parse string durations like "1 Month" or "13 Months"
export const parseDuration = (durationStr: string | undefined): Duration | null => {
  if (!durationStr) return null;
  
  // Handle special cases
  if (durationStr.toLowerCase().includes("coterminous")) {
    return {
      number: "0", // Special value for coterminous
      unit: "tenure"
    };
  }
  
  const regex = /(\d+)\s+(\w+)/i;
  const match = durationStr.match(regex);
  
  if (match) {
    let unit = match[2].toLowerCase();
    // Convert to singular form if needed
    if (unit.endsWith('s')) unit = unit.slice(0, -1);
    
    // Capitalize first letter
    unit = unit.charAt(0).toUpperCase() + unit.slice(1);
    
    return {
      number: match[1],
      unit: unit
    };
  }
  
  return null;
};

// Parse frequency strings like "31 times per month"
export const parseFrequency = (frequencyStr: string | undefined): Duration | null => {
  if (!frequencyStr || frequencyStr === "NA") return null;
  
  const regex = /(\d+)\s+times?\s+per\s+(\w+)/i;
  const match = frequencyStr.match(regex);
  
  if (match) {
    let unit = match[2].toLowerCase();
    // Capitalize first letter
    unit = unit.charAt(0).toUpperCase() + unit.slice(1);
    
    return {
      number: match[1],
      unit: unit
    };
  }
  
  return null;
};

// Convert between different duration units
export const convertDuration = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to days first
  let valueInDays = value;
  switch (fromUnit.toLowerCase()) {
    case 'month':
      valueInDays = value * 30; // Approximate
      break;
    case 'year':
      valueInDays = value * 365; // Approximate
      break;
    default: // 'day'
      break;
  }
  
  // Convert from days to target unit
  switch (toUnit.toLowerCase()) {
    case 'month':
      return Math.ceil(valueInDays / 30);
    case 'year':
      return Math.ceil(valueInDays / 365);
    default: // 'day'
      return valueInDays;
  }
};

// Validate if a duration is within the maximum allowed
export const isValidDuration = (
  input: Duration | undefined,
  maxValue: Duration | null
): { isValid: boolean; message?: string } => {
  // If no maxValue or input is undefined, consider it valid
  if (!maxValue || !input || !input.number || input.number.trim() === "") {
    return { isValid: true };
  }
  
  // Special case for coterminous
  if (maxValue.unit === "tenure") {
    return { isValid: true };
  }
  
  const inputValue = Number(input.number);
  if (isNaN(inputValue) || inputValue <= 0) {
    return { isValid: false, message: "Please enter a valid positive number" };
  }
  
  // Convert both to days for comparison
  const inputInDays = convertDuration(inputValue, input.unit, "Day");
  const maxInDays = convertDuration(Number(maxValue.number), maxValue.unit, "Day");
  
  if (inputInDays > maxInDays) {
    // Convert max to input's unit for message
    const maxInInputUnit = convertDuration(Number(maxValue.number), maxValue.unit, input.unit);
    return {
      isValid: false,
      message: `Maximum allowed is ${maxInInputUnit} ${input.unit}${maxInInputUnit !== 1 ? 's' : ''}`
    };
  }
  
  return { isValid: true };
};

// Format duration for display
export const formatDuration = (duration: Duration | null): string => {
  if (!duration) return "";
  
  if (duration.unit === "tenure") {
    return "Coterminous with loan tenure";
  }
  
  return `${duration.number} ${duration.unit}${Number(duration.number) !== 1 ? 's' : ''}`;
};

// Get maximum values based on template
export const getMaxValues = (
  regulator: string,
  purposeCode: string, 
  usecaseCategory: string,
  selectedFiTypes: string[] = [],
  selectedConsentTypes: string[] = []
) => {
  const template = getBestMatchingTemplate(
    regulator, 
    purposeCode, 
    usecaseCategory,
    selectedFiTypes,
    selectedConsentTypes
  );
  
  return {
    maxConsentValidity: template?.maxConsentValidity ? parseDuration(template.maxConsentValidity) : null,
    maxFrequency: template?.maxFrequency ? parseFrequency(template.maxFrequency) : null,
    maxFiDataRange: template?.maxFiDataRange ? parseDuration(template.maxFiDataRange) : null,
    maxDataLife: template?.maxDataLife ? parseDuration(template.maxDataLife) : null
  };
};

// Check if a field is required
export const isFieldRequired = (fieldName: string): boolean => {
  const field = formFields.consentParameters?.consentParamFields?.find(f => f.id === fieldName);
  return field?.required === true;
};

export const validateFrequencyAgainstTemplate = (
  userInput: Duration | undefined,
  templateMaxFrequency: Duration | string | undefined
): string | undefined => {
  if (!userInput || !userInput.number || !userInput.unit) return undefined;
  
  // Handle case where templateMaxFrequency is already a Duration object
  let parsedTemplate: Duration | null = null;
  if (typeof templateMaxFrequency === 'string') {
    parsedTemplate = parsePeriodString(templateMaxFrequency);
  } else {
    parsedTemplate = templateMaxFrequency;
  }
  
  if (!parsedTemplate || !parsedTemplate.number || !parsedTemplate.unit) return undefined;

  // Convert both to days for comparison
  const userInputDays = toDays(1, userInput.unit) / Number(userInput.number);
  const templateMinDays = toDays(1, parsedTemplate.unit) / Number(parsedTemplate.number);

  if (userInputDays >= templateMinDays) return undefined;  // Valid input

  return `Maximum allowed frequency is ${parsedTemplate.number} times per ${parsedTemplate.unit.toLowerCase()}`;
};
