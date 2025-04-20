
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
import { Trash, Plus } from "lucide-react";
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { 
  FileUploadArea 
} from "@/components/ui/file-upload-area";
import formFields from "@/data/formFields.json";

const UserJourneySettingsForm = () => {
  const { control, watch, setValue } = useFormContext();
  const fields = formFields.userJourneySettings.fields;
  
  const [journeyVideoMode, setJourneyVideoMode] = useState<"link" | "file">("link");
  const [fiuLogoMode, setFiuLogoMode] = useState<"link" | "file">("link");
  const [urls, setUrls] = useState<string[]>([""]);
  
  const accountTypeFilter = watch("accountTypeFilter");
  const fipSelectionInHostApp = watch("fipSelectionInHostApp");
  const targetedAutoDiscovery = watch("targetedAutoDiscovery");
  const mobileVerified = watch("mobileVerified");
  const fiuLogoVisible = watch("fiuLogoVisible");
  
  // Add/Remove URL functions
  const addUrl = () => {
    setUrls([...urls, ""]);
  };
  
  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
    setValue("whitelistedUrls", newUrls);
  };
  
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    setValue("whitelistedUrls", newUrls);
  };
  
  return (
    <div className="space-y-6">
      {/* User Journey Video */}
      <FormField
        control={control}
        name="userJourneyVideo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User journey video (Drive link)</FormLabel>
            <Tabs 
              defaultValue="link" 
              onValueChange={(value) => setJourneyVideoMode(value as "link" | "file")}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-2">
                <TabsList>
                  <TabsTrigger value="link">Link</TabsTrigger>
                  <TabsTrigger value="file">Upload</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="link" className="space-y-4">
                <FormControl>
                  <Input 
                    placeholder="https://drive.google.com/..." 
                    onChange={(e) => {
                      field.onChange({url: e.target.value});
                      if (e.target.value) {
                        setValue("userJourneyVideoPassword", "");
                      }
                    }}
                    value={field.value?.url || ""}
                  />
                </FormControl>
                
                {field.value?.url && (
                  <FormField
                    control={control}
                    name="userJourneyVideoPassword"
                    render={({ field: passwordField }) => (
                      <FormItem>
                        <FormLabel>Password (if required)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="If password protected then enter password or else leave it blank"
                            {...passwordField}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="file">
                <FormControl>
                  <FileUploadArea
                    onChange={(file) => {
                      field.onChange({file});
                      setValue("userJourneyVideoPassword", "");
                    }}
                    maxSize={5}
                  />
                </FormControl>
              </TabsContent>
            </Tabs>
            <FormDescription>File upload max 5MB, if link then we should ask for password</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* URLs Whitelisting */}
      <FormField
        control={control}
        name="whitelistedUrls"
        render={() => (
          <FormItem>
            <FormLabel>URLs Whitelisting</FormLabel>
            <div className="space-y-2">
              {urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  
                  <div className="flex items-center">
                    {index === urls.length - 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addUrl}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeUrl(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <FormDescription>
              FIU URL where Onemoney is redirected (if multiple urls then all must be added)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Consent Required Dropdown */}
      <FormField
        control={control}
        name="consentRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consent Required</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fields.find(f => f.id === 'consentRequired')?.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              If lending, monitoring, collections etc multiple are used
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Boolean Switch Options without Borders */}
      <FormField
        control={control}
        name="accountTypeFilter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Account type filter</FormLabel>
              <FormDescription>
                Only savings / current account required especially for CASA this is applicable
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
      
      <FormField
        control={control}
        name="fipSelectionInHostApp"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">FIP selection in host app</FormLabel>
              <FormDescription>
                If FIP selection happens in hostapp then is there any max limit in the no. of FIPs that customer can choose on host app
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
              <FormDescription>
                Maximum number of FIPs that customer can choose on host app
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Toggle Options */}
      <FormField
        control={control}
        name="singleFipMultiFip"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Single FIP / Multi FIP</FormLabel>
            <div className="flex items-center space-x-4">
              <FormControl>
                <ToggleGroup
                  type="single"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem value="Single">Single</ToggleGroupItem>
                  <ToggleGroupItem value="Multi">Multi</ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              {field.value && (
                <span className="text-sm text-muted-foreground">Selected: {field.value}</span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="accountSelectionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Selection Type</FormLabel>
            <div className="flex items-center space-x-4">
              <FormControl>
                <ToggleGroup
                  type="single"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem value="Single">Single</ToggleGroupItem>
                  <ToggleGroupItem value="Multi">Multi</ToggleGroupItem>
                  <ToggleGroupItem value="Unique">Unique</ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              {field.value && (
                <span className="text-sm text-muted-foreground">Selected: {field.value}</span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="targetedAutoDiscovery"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Targeted auto discovery</FormLabel>
              <FormDescription>
                This is applicable only for PFM and Wealth Management usecase (101 and 102).
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
      
      {targetedAutoDiscovery && (
        <FormField
          control={control}
          name="targetedDiscoveryDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Targeted Discovery Details</FormLabel>
              <FormControl>
                <Input {...field} placeholder="List of FIP IDs or top number of banks required" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={control}
        name="onemoneyConsentRequestMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Onemoney Consent Request Mode</FormLabel>
            <div className="flex items-center space-x-4">
              <FormControl>
                <ToggleGroup
                  type="single"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem value="In redirection URL">In redirection URL</ToggleGroupItem>
                  <ToggleGroupItem value="Only if accounts available for consent">Only if accounts available</ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              {field.value && (
                <span className="text-sm text-muted-foreground">
                  Selected: {field.value === "Only if accounts available for consent" ? "Only if accounts available" : field.value}
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Remaining dropdown fields */}
      {["consentAccountsFlow", "consentAccountMode"].map((fieldId) => {
        const fieldInfo = fields.find(f => f.id === fieldId);
        return (
          <FormField
            key={fieldId}
            control={control}
            name={fieldId}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldInfo?.name}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${fieldInfo?.name}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fieldInfo?.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {fieldInfo?.description}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
      
      <FormField
        control={control}
        name="consentApprovalMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consent Approval Mode</FormLabel>
            <div className="flex items-center space-x-4">
              <FormControl>
                <ToggleGroup
                  type="single"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem value="Approve all/Reject all">Approve/Reject All</ToggleGroupItem>
                  <ToggleGroupItem value="Approve Mandatory+[Optional]">Approve Mandatory+Optional</ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              {field.value && (
                <span className="text-sm text-muted-foreground">
                  Selected: {field.value}
                </span>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="mobileVerified"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Is mobile no. sent to Onemoney verified by host app</FormLabel>
              <FormDescription>
                Kindly confirm the verification procedure in details
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
      
      {mobileVerified && (
        <FormField
          control={control}
          name="verificationProcedure"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Describe the verification procedure in detail" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={control}
        name="fiuLogoVisible"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">FIU logo visible on Onemoney to customer</FormLabel>
              <FormDescription>
                Not applicable for LSP journeys
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
      
      {fiuLogoVisible && (
        <FormField
          control={control}
          name="fiuLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FIU Logo</FormLabel>
              <Tabs 
                defaultValue="link" 
                onValueChange={(value) => setFiuLogoMode(value as "link" | "file")}
                className="w-full"
              >
                <div className="flex justify-between items-center mb-2">
                  <TabsList>
                    <TabsTrigger value="link">Link</TabsTrigger>
                    <TabsTrigger value="file">Upload</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="link">
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/logo.png" 
                      onChange={(e) => field.onChange({url: e.target.value})}
                      value={field.value?.url || ""}
                    />
                  </FormControl>
                </TabsContent>
                
                <TabsContent value="file">
                  <FormControl>
                    <FileUploadArea
                      onChange={(file) => field.onChange({file})}
                      maxSize={2}
                      acceptedFileTypes={["image/png", "image/jpeg", "image/svg+xml"]}
                    />
                  </FormControl>
                </TabsContent>
              </Tabs>
              <FormDescription>
                Upload your FIU logo (max 2MB, PNG, JPEG or SVG)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default UserJourneySettingsForm;
