
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileUploadArea 
} from "@/components/ui/file-upload-area";
import formFields from "@/data/formFields.json";

const LicenseDetailsForm = () => {
  const { control, setValue } = useFormContext();
  const fields = formFields.licenseDetails.fields;
  
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <FormField
          key={field.id}
          control={control}
          name={field.id}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                {field.type === 'text' && (
                  <Input {...formField} />
                )}
                
                {field.type === 'dropdown' && (
                  <Select
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === 'file' && (
                  <FileUploadArea
                    onChange={(file) => setValue(field.id, file)}
                    maxSize={field.validation?.maxSize}
                  />
                )}
              </FormControl>
              {field.description && (
                <FormDescription>{field.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default LicenseDetailsForm;
