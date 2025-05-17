
import { useFormContext, Controller } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Mail, User, FileText, Settings, Image } from "lucide-react";
import formFields from "@/data/formFields.json";

const UatForm = () => {
  const { control, watch } = useFormContext();
  const [licenseOptions, setLicenseOptions] = useState<string[]>([]);
  
  const regulatorValue = watch("regulator");
  const integrationMode = watch("integrationMode");
  const fiuLogoVisible = watch("fiuLogoVisible");

  // Update license options when regulator changes
  useEffect(() => {
    if (regulatorValue && formFields.licenseTypeMap[regulatorValue as keyof typeof formFields.licenseTypeMap]) {
      setLicenseOptions(formFields.licenseTypeMap[regulatorValue as keyof typeof formFields.licenseTypeMap]);
    } else {
      setLicenseOptions([]);
    }
  }, [regulatorValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TSP Name */}
        <FormField
          control={control}
          name="tspName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of TSP</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    {...field}
                    className="pl-10"
                    placeholder="Enter TSP name"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requested By */}
        <FormField
          control={control}
          name="requestedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested By</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    {...field}
                    className="pl-10"
                    placeholder="Enter requester name"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TSP SPOC Email */}
        <FormField
          control={control}
          name="tspSpocEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TSP SPOC Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    {...field}
                    type="email"
                    className="pl-10"
                    placeholder="Enter TSP SPOC email"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Will be in cc in all FIU correspondence from Onemoney as required
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FIU Registered Email */}
        <FormField
          control={control}
          name="fiuRegisteredEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FIU Registered Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    {...field}
                    type="email"
                    className="pl-10"
                    placeholder="Enter FIU registered email"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Regulator */}
        <FormField
          control={control}
          name="regulator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regulator</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                  <FileText className="h-4 w-4" />
                </span>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select regulator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RBI">RBI</SelectItem>
                      <SelectItem value="PFRDA">PFRDA</SelectItem>
                      <SelectItem value="IRDAI">IRDAI</SelectItem>
                      <SelectItem value="SEBI">SEBI</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* License Type */}
        <FormField
          control={control}
          name="licenseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Type</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                  <FileText className="h-4 w-4" />
                </span>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!regulatorValue || licenseOptions.length === 0}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FIU CR ID */}
        <FormField
          control={control}
          name="fiuCrId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FIU CR ID UAT</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FileText className="h-4 w-4" />
                </span>
                <FormControl>
                  <Input
                    {...field}
                    className="pl-10"
                    placeholder="Enter FIU ID as per Sahamati UAT CR"
                  />
                </FormControl>
              </div>
              <FormDescription>
                FIU ID as per Sahamati UAT CR
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Integration Mode */}
        <FormField
          control={control}
          name="integrationMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Integration Mode</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                  <Settings className="h-4 w-4" />
                </span>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select integration mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                      <SelectItem value="Cocreated FIU">Cocreated FIU</SelectItem>
                      <SelectItem value="Cocreated TSP">Cocreated TSP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Conditional fields for Standard integration mode */}
      {integrationMode === "Standard" && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Branding Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Color */}
            <FormField
              control={control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      className="h-10 w-full cursor-pointer"
                    />
                  </FormControl>
                  <FormDescription>
                    Primary brand color for UI elements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Secondary Color */}
            <FormField
              control={control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      className="h-10 w-full cursor-pointer"
                    />
                  </FormControl>
                  <FormDescription>
                    Secondary brand color for UI elements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary Font */}
            <FormField
              control={control}
              name="primaryFont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Font</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter primary font name"
                    />
                  </FormControl>
                  <FormDescription>
                    Primary font for headers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Secondary Font */}
            <FormField
              control={control}
              name="secondaryFont"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Font</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter secondary font name"
                    />
                  </FormControl>
                  <FormDescription>
                    Secondary font for body text
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* FIU Logo Visible on Onemoney */}
          <FormField
            control={control}
            name="fiuLogoVisible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    FIU Logo Visible on Onemoney to Customer
                  </FormLabel>
                  <FormDescription>
                    Enable this to display the FIU logo on Onemoney
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

          {/* Logo Upload (Conditional) */}
          {fiuLogoVisible && (
            <FormField
              control={control}
              name="fiuLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FIU Logo</FormLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Image className="h-4 w-4" />
                    </span>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="pl-10"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Upload your FIU logo (max 2MB, PNG, JPEG or SVG)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UatForm;
