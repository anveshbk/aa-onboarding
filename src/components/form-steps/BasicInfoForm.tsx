
import { useState, useEffect } from "react";
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

const BasicInfoForm = () => {
  const { control, setValue } = useFormContext();
  const [currentDate, setCurrentDate] = useState("");
  
  useEffect(() => {
    // Format today's date as dd-mmm-yyyy
    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${months[today.getMonth()]}-${today.getFullYear()}`;
    
    setCurrentDate(formattedDate);
    setValue("requestDate", formattedDate);
  }, [setValue]);

  const fields = formFields.basicInfo.fields;
  
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
                {field.type === 'date' ? (
                  <Input
                    {...formField}
                    value={currentDate}
                    disabled={true}
                  />
                ) : (
                  <Input {...formField} />
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

export default BasicInfoForm;
