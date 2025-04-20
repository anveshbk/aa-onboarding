
import { useEffect, useState } from "react";
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
import { FileUploadArea } from "@/components/ui/file-upload-area";
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group";
import formFields from "@/data/formFields.json";

const FiuDetailsForm = () => {
  const { control, watch, setValue } = useFormContext();
  const fields = formFields.fiuDetails.fields;
  
  const regulator = watch("regulator");
  const agreementExecuted = watch("agreementExecuted");
  
  // Update license type options based on selected regulator
  const licenseTypeOptions = regulator 
    ? formFields.licenseTypeMap[regulator as keyof typeof formFields.licenseTypeMap] || []
    : [];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">FIU Details</h2>
      
      {/* FIU Registered Name */}
      <FormField
        control={control}
        name="fiuRegisteredName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FIU registered name (as per license)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Regulator Field - Use ToggleButtonGroup for small options */}
      <FormField
        control={control}
        name="regulator"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Regulator</FormLabel>
            <FormControl>
              <ToggleButtonGroup
                options={fields.find(f => f.id === "regulator")?.options || []}
                value={field.value || ""}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("licenseType", ""); // Reset license type when regulator changes
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* License Type Field - Depends on Regulator */}
      <FormField
        control={control}
        name="licenseType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License Type</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!regulator}
              >
                <SelectTrigger>
                  <SelectValue placeholder={regulator ? "Select License Type" : "Select Regulator first"} />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* License Copy Field - Using new FileUploadArea */}
      <FormField
        control={control}
        name="licenseCopy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License copy</FormLabel>
            <FormControl>
              <FileUploadArea
                onChange={field.onChange}
                defaultValue={field.value}
                maxSize={5}
                placeholder="Insert license copy Drive link"
              />
            </FormControl>
            <FormDescription>Max 5MB</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* License Number Field */}
      <FormField
        control={control}
        name="licenseNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License No. (As per certificate)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* FIU CR ID Fields */}
      <FormField
        control={control}
        name="fiuCrIdUat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FIU CR ID UAT</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>FIU ID as per Sahamati UAT CR</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="fiuCrIdProd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>FIU CR ID Prod</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>FIU ID as per Sahamati Prod CR</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Agreement Executed Field as toggle buttons */}
      <FormField
        control={control}
        name="agreementExecuted"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-0.5 mb-2">
              <FormLabel className="text-base">Agreement Executed</FormLabel>
              <FormDescription>
                If yes, please upload the agreement document (max 5MB)
              </FormDescription>
            </div>
            <FormControl>
              <ToggleButtonGroup
                options={["Yes", "No"]}
                value={field.value ? "Yes" : "No"}
                onChange={(value) => {
                  field.onChange(value === "Yes");
                  if (value !== "Yes") {
                    setValue("agreementFile", null);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {/* Agreement File Field - Shown only if Agreement Executed is true */}
      {agreementExecuted && (
        <FormField
          control={control}
          name="agreementFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agreement Document</FormLabel>
              <FormControl>
                <FileUploadArea
                  onChange={field.onChange}
                  defaultValue={field.value}
                  maxSize={5}
                  placeholder="Insert agreement document Drive link"
                />
              </FormControl>
              <FormDescription>Max 5MB</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default FiuDetailsForm;
