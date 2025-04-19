
import { useFormContext } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import formFields from "@/data/formFields.json";

const CocreatedDevelopmentForm = () => {
  const { control } = useFormContext();
  const fields = formFields.cocreatedDevelopment.fields;
  
  return (
    <div className="space-y-6">
      <Alert className="bg-muted/50">
        <Info className="h-4 w-4" />
        <AlertTitle>Optional Section</AlertTitle>
        <AlertDescription>
          This section is applicable only for cocreated development. If this does not apply to you, you can leave it blank.
        </AlertDescription>
      </Alert>
      
      {fields.map((field) => (
        <FormField
          key={field.id}
          control={control}
          name={field.id}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Textarea 
                  {...formField} 
                  placeholder={field.description || `Enter ${field.name}`}
                  rows={5}
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

export default CocreatedDevelopmentForm;
