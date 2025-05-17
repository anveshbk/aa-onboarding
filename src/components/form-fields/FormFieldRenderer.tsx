
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleButtonGroup } from '@/components/ui/toggle-button-group';

interface FormFieldRendererProps {
  field: {
    id: string;
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    options?: string[];
    placeholder?: string;
  };
  fieldPath: string;
  disabled?: boolean;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field, fieldPath, disabled = false }) => {
  const { control } = useFormContext();

  // Helper function to determine if options are valid
  const hasValidOptions = (options?: string[]) => {
    return Array.isArray(options) && options.length > 0;
  };

  // Dynamically render the input component based on field type
  const renderInput = () => {
    // Safeguard for fields that require options
    const optionBasedTypes = ['dropdown', 'multipleOptions', 'multiSelect'];
    const needsOptions = optionBasedTypes.includes(field.type);
    const hasOptions = hasValidOptions(field.options);
    
    // If field type requires options but doesn't have any, fall back to text input
    if (needsOptions && !hasOptions) {
      return (
        <Input 
          type="text" 
          placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
          disabled={disabled}
        />
      );
    }
    
    // Based on specific field type, render appropriate component
    switch (field.type) {
      case 'dropdown':
        return (
          <Select disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return <Textarea placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`} disabled={disabled} />;
      
      case 'toggle':
        return <Checkbox disabled={disabled} />;
      
      case 'multipleOptions':
        return (
          <ToggleButtonGroup
            options={field.options || []}
            multiple={false}
            disabled={disabled}
          />
        );
        
      case 'multiSelect':
        return (
          <ToggleButtonGroup
            options={field.options || []}
            multiple={true}
            disabled={disabled}
          />
        );
      
      case 'date':
        return (
          <Input 
            type="date" 
            placeholder={field.placeholder || `Select date`}
            disabled={disabled}
          />
        );
        
      case 'number':
        return (
          <Input 
            type="number" 
            placeholder={field.placeholder || `Enter number`}
            disabled={disabled}
          />
        );
        
      case 'email':
        return (
          <Input 
            type="email" 
            placeholder={field.placeholder || `Enter email`}
            disabled={disabled}
          />
        );
        
      case 'color':
        return (
          <Input 
            type="color" 
            className="h-10 w-full cursor-pointer"
            disabled={disabled}
          />
        );
      
      default:
        // Default to text input for any unhandled types
        return (
          <Input 
            type="text" 
            placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={fieldPath}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.name}{field.required ? ' *' : ''}</FormLabel>
          <FormControl>
            {renderInput()}
          </FormControl>
          {field.description && <FormDescription>{field.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldRenderer;
