
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import formFields from "@/data/formFields.json";

interface IntegrationDetailsFormProps {
  setShowCocreatedDevelopment: (show: boolean) => void;
}

const IntegrationDetailsForm = ({ setShowCocreatedDevelopment }: IntegrationDetailsFormProps) => {
  const { control, watch, setValue } = useFormContext();
  const integrationType = formFields.integrationDetails.fields[0].options;
  const integrationMode = watch("integrationMode");
  
  // URLs and SDK Versions state
  const [webRedirectionUrls, setWebRedirectionUrls] = useState<string[]>([""]);
  const [sdkVersions, setSdkVersions] = useState<string[]>([""]);
  
  // Add new URL or SDK Version
  const addWebRedirectionUrl = () => {
    setWebRedirectionUrls([...webRedirectionUrls, ""]);
  };
  
  const addSdkVersion = () => {
    setSdkVersions([...sdkVersions, ""]);
  };
  
  // Remove URL or SDK Version
  const removeWebRedirectionUrl = (index: number) => {
    const newUrls = [...webRedirectionUrls];
    newUrls.splice(index, 1);
    setWebRedirectionUrls(newUrls);
    setValue("webRedirectionUrls", newUrls);
  };
  
  const removeSdkVersion = (index: number) => {
    const newVersions = [...sdkVersions];
    newVersions.splice(index, 1);
    setSdkVersions(newVersions);
    setValue("sdkVersions", newVersions);
  };
  
  // Update URL or SDK Version
  const updateWebRedirectionUrl = (index: number, value: string) => {
    const newUrls = [...webRedirectionUrls];
    newUrls[index] = value;
    setWebRedirectionUrls(newUrls);
    setValue("webRedirectionUrls", newUrls);
  };
  
  const updateSdkVersion = (index: number, value: string) => {
    const newVersions = [...sdkVersions];
    newVersions[index] = value;
    setSdkVersions(newVersions);
    setValue("sdkVersions", newVersions);
  };
  
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
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Webredirection URLs</h4>
            {webRedirectionUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateWebRedirectionUrl(index, e.target.value)}
                  placeholder="https://example.com/redirect"
                  className="flex-1"
                />
                
                <div className="flex items-center">
                  {index === webRedirectionUrls.length - 1 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addWebRedirectionUrl}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add URL</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeWebRedirectionUrl(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {watch("integrationType.sdk") && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">SDK Versions</h4>
            {sdkVersions.map((version, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={version}
                  onChange={(e) => updateSdkVersion(index, e.target.value)}
                  placeholder="e.g., Android v2.1.0"
                  className="flex-1"
                />
                
                <div className="flex items-center">
                  {index === sdkVersions.length - 1 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addSdkVersion}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add SDK Version</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSdkVersion(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                setShowCocreatedDevelopment(value === "Cocreated FIU" || value === "Cocreated TSP");
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
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="consentRequestSMS"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Consent request SMS</FormLabel>
              <FormDescription>
                If Onemoney consent request SMS is to be enabled
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
    </div>
  );
};

export default IntegrationDetailsForm;
