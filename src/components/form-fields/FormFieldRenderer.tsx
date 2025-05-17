
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

  // Ensure field type is treated as text for rendering standard text inputs
  const renderInput = () => {
    switch (field.type) {
      case 'dropdown':
        if (!field.options || field.options.length === 0) {
          // If dropdown has no options, render as text input
          return (
            <Input 
              placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`}
              disabled={disabled}
            />
          );
        }
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
      case 'multiSelect':
        if (!field.options || field.options.length === 0) {
          return <Input placeholder={field.placeholder || `Enter ${field.name.toLowerCase()}`} disabled={disabled} />;
        }
        return (
          <ToggleButtonGroup
            options={field.options}
            multiple={field.type === 'multiSelect'}
            disabled={disabled}
          />
        );
      
      default:
        // Default to text input for any unhandled types or when type is 'text'
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
