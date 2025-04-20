
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
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileUploadArea 
} from "@/components/ui/file-upload-area";
import formFields from "@/data/formFields.json";

const FiuDetailsForm = () => {
  const { control, watch, setValue } = useFormContext();
  const fields = formFields.fiuDetails.fields;
  
  const regulator = watch("regulator");
  const agreementExecuted = watch("agreementExecuted");
  
  const [licenseMode, setLicenseMode] = useState<"link" | "file">("link");
  const [agreementMode, setAgreementMode] = useState<"link" | "file">("link");
  
  // Update license type options based on selected regulator
  const licenseTypeOptions = regulator 
    ? formFields.licenseTypeMap[regulator as keyof typeof formFields.licenseTypeMap] || []
    : [];
  
  return (
    <div className="space-y-6">
      {fields.slice(0, 2).map((field) => (
        <FormField
          key={field.id}
          control={control}
          name={field.id}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              {field.type === 'text' && (
                <FormControl>
                  <Input {...formField} />
                </FormControl>
              )}
              
              {field.type === 'dropdown' && (
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      formField.onChange(value);
                      setValue("licenseType", ""); // Reset license type when regulator changes
                    }}
                    defaultValue={formField.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              )}
              
              {field.description && (
                <FormDescription>{field.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      
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
                defaultValue={field.value}
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
      
      {/* License Copy Field - Support file or link */}
      <FormField
        control={control}
        name="licenseCopy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License copy</FormLabel>
            <Tabs 
              defaultValue="link" 
              onValueChange={(value) => setLicenseMode(value as "link" | "file")}
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
                        setValue("licenseCopyPassword", "");
                      }
                    }}
                    value={field.value?.url || ""}
                  />
                </FormControl>
                
                {field.value?.url && (
                  <FormField
                    control={control}
                    name="licenseCopyPassword"
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
                      setValue("licenseCopyPassword", "");
                    }}
                    maxSize={5}
                  />
                </FormControl>
              </TabsContent>
            </Tabs>
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
      {fields.slice(5, 7).map((field) => (
        <FormField
          key={field.id}
          control={control}
          name={field.id}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Input {...formField} />
              </FormControl>
              {field.description && (
                <FormDescription>{field.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      
      {/* Agreement Executed Field */}
      <FormField
        control={control}
        name="agreementExecuted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Agreement Executed</FormLabel>
              <FormDescription>
                If yes, please upload the agreement document (max 5MB)
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(value) => {
                  field.onChange(value);
                  if (!value) {
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
              <Tabs 
                defaultValue="link" 
                onValueChange={(value) => setAgreementMode(value as "link" | "file")}
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
                          setValue("agreementFilePassword", "");
                        }
                      }}
                      value={field.value?.url || ""}
                    />
                  </FormControl>
                  
                  {field.value?.url && (
                    <FormField
                      control={control}
                      name="agreementFilePassword"
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
                        setValue("agreementFilePassword", "");
                      }}
                      maxSize={5}
                    />
                  </FormControl>
                </TabsContent>
              </Tabs>
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
