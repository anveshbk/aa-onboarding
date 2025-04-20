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
import { FileUploadArea } from "@/components/ui/file-upload-area";
import { Plus, Trash } from "lucide-react";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import formFields from "@/data/formFields.json";

const UserJourneySettingsForm = () => {
  const { control, watch, setValue } = useFormContext();
  const fields = formFields.userJourneySettings.fields;
  
  const accountTypeFilter = watch("accountTypeFilter");
  const fipSelectionInHostApp = watch("fipSelectionInHostApp");
  const mobileVerified = watch("mobileVerified");
  const fiuLogoVisible = watch("fiuLogoVisible");
  const targetedAutoDiscovery = watch("targetedAutoDiscovery");
  
  // URLs state
  const [whitelistedUrls, setWhitelistedUrls] = useState<string[]>([""]);
  
  // Add new URL
  const addWhitelistedUrl = () => {
    setWhitelistedUrls([...whitelistedUrls, ""]);
  };
  
  // Remove URL
  const removeWhitelistedUrl = (index: number) => {
    const newUrls = [...whitelistedUrls];
    newUrls.splice(index, 1);
    setWhitelistedUrls(newUrls);
    setValue("whitelistedUrls", newUrls);
  };
  
  // Update URL
  const updateWhitelistedUrl = (index: number, value: string) => {
    const newUrls = [...whitelistedUrls];
    newUrls[index] = value;
    setWhitelistedUrls(newUrls);
    setValue("whitelistedUrls", newUrls);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Journey Configurations</h2>
      
      {/* User Journey Video */}
      <FormField
        control={control}
        name="userJourneyVideo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User journey video (Drive link)</FormLabel>
            <FormControl>
              <FileUploadArea
                onChange={field.onChange}
                defaultValue={field.value}
                maxSize={5}
                placeholder="Insert user journey video Drive link"
              />
            </FormControl>
            <FormDescription>Max 5MB</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Whitelisted URLs */}
      <div className="space-y-4">
        <FormLabel>URLs whitelisting</FormLabel>
        <FormDescription>
          FIU URL where Onemoney is redirected (if multiple urls then all must be added)
        </FormDescription>
        {whitelistedUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={url}
              onChange={(e) => updateWhitelistedUrl(index, e.target.value)}
              placeholder="https://example.com/redirect"
              className="flex-1"
            />
            
            <div className="flex items-center">
              {index === whitelistedUrls.length - 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addWhitelistedUrl}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeWhitelistedUrl(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Consent Required - Short options list -> use ToggleButtonGroup */}
      <FormField
        control={control}
        name="consentRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consent required</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={["Single", "Dual", "Multiple"]}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>If lending, monitoring, collections etc multiple are used</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Account Type Filter */}
      <FormField
        control={control}
        name="accountTypeFilter"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">Account type filter</FormLabel>
              <FormDescription>
                Only savings / current account required especially for CASA this is applicable
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
      
      {/* FIP Selection in Host App */}
      <FormField
        control={control}
        name="fipSelectionInHostApp"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">FIP selection in host app</FormLabel>
              <FormDescription>
                If FIP selection happens in hostapp then is there any max limit in the no. of FIPs that customer can choose on host app
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
      
      {/* Max FIPs Limit - Show only if FIP Selection is enabled */}
      {fipSelectionInHostApp && (
        <FormField
          control={control}
          name="maxFipLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max FIPs Limit</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" />
              </FormControl>
              <FormDescription>Maximum number of FIPs that customer can choose on host app</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Single/Multi FIP Toggle */}
      <FormField
        control={control}
        name="singleFipMultiFip"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Single FIP / Multi FIP</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={["Single", "Multi"]}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Account Selection Type */}
      <FormField
        control={control}
        name="accountSelectionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account selection type</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={["Single", "Multi", "Unique"]}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Targeted Auto Discovery */}
      <FormField
        control={control}
        name="targetedAutoDiscovery"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">Targeted auto discovery</FormLabel>
              <FormDescription>
                This is applicable only for PFM and Wealth Management usecase (101 and 102).
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
      
      {/* Targeted Discovery Details - Show only if Targeted Auto Discovery is enabled */}
      {targetedAutoDiscovery && (
        <FormField
          control={control}
          name="targetedDiscoveryDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Targeted Discovery Details</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>List of FIP IDs or top number of banks required</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Onemoney Consent Request Mode */}
      <FormField
        control={control}
        name="onemoneyConsentRequestMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Onemoney Consent request mode</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={[
                  "In redirection URL",
                  "Only if accounts available for consent"
                ]}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Consent Accounts Flow */}
      <FormField
        control={control}
        name="consentAccountsFlow"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consent accounts flow</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-2">
                {fields.find(f => f.id === "consentAccountsFlow")?.options?.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => field.onChange(option)}
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
      
      {/* Consent Account Mode */}
      <FormField
        control={control}
        name="consentAccountMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consent Account Mode</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={["Per Account", "Per FIP", "Per FI Type", "Per Journey"]}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Consent Approval Mode */}
      <FormField
        control={control}
        name="consentApprovalMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consent Approval Mode</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={["Approve all/Reject all", "Approve Mandatory+[Optional]"]}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Mobile Number Verification */}
      <FormField
        control={control}
        name="mobileVerified"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">Is mobile no. sent to Onemoney verified by host app</FormLabel>
              <FormDescription>
                Kindly confirm the verification procedure in details
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
      
      {/* Verification Procedure - Show only if Mobile is verified */}
      {mobileVerified && (
        <FormField
          control={control}
          name="verificationProcedure"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Describe the verification procedure in detail"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* FIU Logo Visibility */}
      <FormField
        control={control}
        name="fiuLogoVisible"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">FIU logo visible on Onemoney to customer</FormLabel>
              <FormDescription>
                Not applicable for LSP journeys
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
      
      {/* FIU Logo - Show only if Logo is visible */}
      {fiuLogoVisible && (
        <FormField
          control={control}
          name="fiuLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FIU Logo</FormLabel>
              <FormControl>
                <FileUploadArea
                  onChange={field.onChange}
                  defaultValue={field.value}
                  maxSize={2}
                  placeholder="Insert FIU logo Drive link"
                  acceptedFileTypes={["image/png", "image/jpeg", "image/svg+xml"]}
                />
              </FormControl>
              <FormDescription>Upload your FIU logo (max 2MB, PNG, JPEG or SVG)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default UserJourneySettingsForm;
