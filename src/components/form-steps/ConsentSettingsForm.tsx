
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
import { 
  FileUploadArea 
} from "@/components/ui/file-upload-area";
import formFields from "@/data/formFields.json";

const ConsentSettingsForm = () => {
  const { control, watch, setValue } = useFormContext();
  const fields = formFields.consentSettings.fields;
  
  const accountTypeFilter = watch("accountTypeFilter");
  const fipSelectionInHostApp = watch("fipSelectionInHostApp");
  const targetedAutoDiscovery = watch("targetedAutoDiscovery");
  const mobileVerified = watch("mobileVerified");
  const fiuLogoVisible = watch("fiuLogoVisible");
  
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fields[0].name}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="consentRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fields[1].name}</FormLabel>
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
                {fields[1].options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              {fields[1].description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="accountTypeFilter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{fields[2].name}</FormLabel>
              <FormDescription>
                {fields[2].description}
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{fields[3].name}</FormLabel>
              <FormDescription>
                {fields[3].description}
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
      
      <FormField
        control={control}
        name="singleFipMultiFip"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fields[4].name}</FormLabel>
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
                {fields[4].options?.map((option) => (
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
        name="accountSelectionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fields[5].name}</FormLabel>
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
                {fields[5].options?.map((option) => (
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
        name="targetedAutoDiscovery"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{fields[6].name}</FormLabel>
              <FormDescription>
                {fields[6].description}
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
      
      {/* Remaining select fields */}
      {[7, 8, 9, 10].map((index) => (
        <FormField
          key={fields[index].id}
          control={control}
          name={fields[index].id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{fields[index].name}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${fields[index].name}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fields[index].options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {fields[index].description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      
      <FormField
        control={control}
        name="mobileVerified"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{fields[11].name}</FormLabel>
              <FormDescription>
                {fields[11].description}
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
              <FormLabel>Verification Procedure</FormLabel>
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{fields[12].name}</FormLabel>
              <FormDescription>
                {fields[12].description}
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
              <FormControl>
                <FileUploadArea
                  onChange={(file) => setValue("fiuLogo", file)}
                  maxSize={2}
                  acceptedFileTypes={["image/png", "image/jpeg", "image/svg+xml"]}
                />
              </FormControl>
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

export default ConsentSettingsForm;
