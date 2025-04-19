
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  FileUploadArea 
} from "@/components/ui/file-upload-area";
import { Switch } from "@/components/ui/switch";
import formFields from "@/data/formFields.json";

const UserJourneyForm = () => {
  const { control, setValue, watch } = useFormContext();
  const fields = formFields.userJourney.fields;
  
  const [fileOrLinkMode, setFileOrLinkMode] = useState<"file" | "link">("file");
  
  const agreementExecuted = watch("agreementExecuted");
  
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="userJourneyVideo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>User journey video (Drive link)</FormLabel>
            <FormControl>
              <Tabs defaultValue="file" onValueChange={(value) => setFileOrLinkMode(value as "file" | "link")}>
                <TabsList className="mb-2">
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                  <TabsTrigger value="link">Drive Link</TabsTrigger>
                </TabsList>
                <TabsContent value="file">
                  <FileUploadArea
                    onChange={(file) => {
                      setValue("userJourneyVideo", file);
                      setValue("userJourneyLink", "");
                      setValue("userJourneyPassword", "");
                    }}
                    maxSize={5}
                  />
                </TabsContent>
                <TabsContent value="link">
                  <div className="space-y-4">
                    <Input 
                      placeholder="https://drive.google.com/..." 
                      onChange={(e) => {
                        setValue("userJourneyLink", e.target.value);
                        setValue("userJourneyVideo", null);
                      }}
                    />
                    <FormItem>
                      <FormLabel>Password (if required)</FormLabel>
                      <Input 
                        placeholder="Password for the drive link"
                        onChange={(e) => setValue("userJourneyPassword", e.target.value)}
                      />
                    </FormItem>
                  </div>
                </TabsContent>
              </Tabs>
            </FormControl>
            <FormDescription>
              File upload max 5MB, if link then we should ask for password
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

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

      {agreementExecuted && (
        <FormField
          control={control}
          name="agreementFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agreement Document</FormLabel>
              <FormControl>
                <FileUploadArea
                  onChange={(file) => setValue("agreementFile", file)}
                  maxSize={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="consentRequestSMS"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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

      {fields.slice(-2).map((field) => (
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
    </div>
  );
};

export default UserJourneyForm;
