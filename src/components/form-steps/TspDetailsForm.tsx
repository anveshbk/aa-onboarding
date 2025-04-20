
import { useEffect } from "react";
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
import formFields from "@/data/formFields.json";
import { format } from "date-fns";

const TspDetailsForm = () => {
  const { control, setValue } = useFormContext();
  const fields = formFields.tspDetails.fields;
  
  // Auto-fill request date with current date
  useEffect(() => {
    const currentDate = format(new Date(), 'dd-MMM-yyyy');
    setValue('requestDate', currentDate);
  }, [setValue]);
  
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
                <Input 
                  {...formField} 
                  disabled={field.disabled}
                />
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

export default TspDetailsForm;
