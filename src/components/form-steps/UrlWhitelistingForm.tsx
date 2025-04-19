
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
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import formFields from "@/data/formFields.json";

const UrlWhitelistingForm = () => {
  const { control, setValue, watch } = useFormContext();
  const [newUrl, setNewUrl] = useState("");
  const whitelistedUrls = watch("whitelistedUrls") || [];
  
  const addUrl = () => {
    if (newUrl && newUrl.trim() !== "") {
      const updatedUrls = [...whitelistedUrls, newUrl.trim()];
      setValue("whitelistedUrls", updatedUrls);
      setNewUrl("");
    }
  };
  
  const removeUrl = (index: number) => {
    const updatedUrls = whitelistedUrls.filter((_, i) => i !== index);
    setValue("whitelistedUrls", updatedUrls);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addUrl();
    }
  };
  
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="whitelistedUrls"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formFields.urlWhitelisting.fields[0].name}</FormLabel>
            <FormDescription>
              {formFields.urlWhitelisting.fields[0].description}
            </FormDescription>
            
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={addUrl} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            <div className="space-y-2 mt-4">
              {whitelistedUrls.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No URLs added yet</p>
              ) : (
                whitelistedUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
                    <span className="flex-1 text-sm truncate">{url}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default UrlWhitelistingForm;
