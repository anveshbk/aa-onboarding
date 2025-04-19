
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
import { Switch } from "@/components/ui/switch";
import formFields from "@/data/formFields.json";

const IntegrationDetailsForm = () => {
  const { control, watch, setValue } = useFormContext();
  const integrationType = formFields.integrationDetails.fields[0].options;
  const integrationMode = watch("integrationMode");
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <h3 className="text-md font-medium mb-2">Integration Type</h3>
        
        {integrationType.map((type) => (
          <FormField
            key={type.id}
            control={control}
            name={`integrationType.${type.id}`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{type.name}</FormLabel>
                  <FormDescription>
                    {type.description}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        
        {watch("integrationType.webRedirection") && (
          <FormField
            control={control}
            name="integrationType.webRedirectionUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webredirection URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://example.com/redirect" />
                </FormControl>
                <FormDescription>Add Onemoney url integrated. If more than one then use semicolon (;)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {watch("integrationType.sdk") && (
          <FormField
            control={control}
            name="integrationType.sdkVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SDK Type and Version</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Android v2.1.0; iOS v2.0.0" />
                </FormControl>
                <FormDescription>If more than one, use semicolon (;)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      
      <FormField
        control={control}
        name="integrationMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Integration Mode</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                // Clear Figma URL if not needed
                if (value !== "Custom" && value !== "Cocreated FIU" && value !== "Cocreated TSP") {
                  setValue("figmaUrl", "");
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Integration Mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {formFields.integrationDetails.fields[1].options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {formFields.integrationDetails.fields[1].description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {(integrationMode === "Custom" || integrationMode === "Cocreated FIU" || integrationMode === "Cocreated TSP") && (
        <FormField
          control={control}
          name="figmaUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Figma URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://figma.com/..." />
              </FormControl>
              <FormDescription>
                Please provide the Figma URL for your custom or co-created integration
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default IntegrationDetailsForm;
