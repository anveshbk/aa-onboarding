
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import { cn } from "@/lib/utils";
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
      <h2 className="text-xl font-semibold">Integration to Onemoney</h2>
      
      <div className="space-y-6">
        <h3 className="text-md font-medium mb-2">Integration Type</h3>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-10 text-center p-3 border-b border-r"></th>
                <th className="p-3 text-left border-b border-r w-1/3">Integration Type</th>
                <th className="p-3 text-left border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {integrationType.map((type) => (
                <FormField
                  key={type.id}
                  control={control}
                  name={`integrationType.${type.id}`}
                  render={({ field }) => (
                    <tr className={`border-b ${field.value ? "bg-primary/5" : ""}`}>
                      <td className="text-center p-3 border-r">
                        <div className="flex items-center justify-center">
                          <div 
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              field.value ? "bg-primary border-primary text-white" : "border-gray-300"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            {field.value && <Check className="h-3 w-3" />}
                          </div>
                        </div>
                      </td>
                      <td 
                        className="p-3 border-r font-medium cursor-pointer" 
                        onClick={() => field.onChange(!field.value)}
                      >
                        {type.name}
                      </td>
                      <td className="p-3">
                        {type.id === "webRedirection" && field.value && (
                          <div className="space-y-2">
                            {webRedirectionUrls.map((url, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={url}
                                  onChange={(e) => updateWebRedirectionUrl(index, e.target.value)}
                                  placeholder="Add Onemoney url integrated"
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
                        
                        {type.id === "sdk" && field.value && (
                          <div className="space-y-2">
                            {sdkVersions.map((version, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={version}
                                  onChange={(e) => updateSdkVersion(index, e.target.value)}
                                  placeholder="SDK type and version"
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
                        
                        {type.id === "assisted" && field.value && (
                          <p className="text-sm text-muted-foreground py-1">
                            {type.description}
                          </p>
                        )}
                        
                        {type.id === "detached" && field.value && (
                          <p className="text-sm text-muted-foreground py-1">
                            {type.description}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Integration Mode */}
      <FormField
        control={control}
        name="integrationMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Integration Mode</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-2">
                {formFields.integrationDetails.fields[1].options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      field.onChange(option);
                      setShowCocreatedDevelopment(option === "Cocreated FIU" || option === "Cocreated TSP");
                    }}
                    className={cn(
                      "px-4 py-2 text-sm border rounded-md transition-colors",
                      field.value === option
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-input text-foreground hover:bg-muted/50"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="consentRequestSMS"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">Consent request SMS</FormLabel>
              <FormDescription>
                If Onemoney consent request SMS is to be enabled
              </FormDescription>
            </div>
            <FormControl>
              <ToggleButtonGroup
                options={["Yes", "No"]}
                value={field.value ? "Yes" : "No"}
                onChange={(value) => field.onChange(value === "Yes")}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default IntegrationDetailsForm;
