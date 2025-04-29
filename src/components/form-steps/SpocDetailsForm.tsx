
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const spocTypes = [
  {
    spocType: "FIU SPOC",
    description: "Will be in to for all FIU conversation and must be senior enough as sensitive info like keys etc will be shared",
    fieldPrefix: "fiuSpoc" // Adding unique field prefix
  },
  {
    spocType: "FIU Escalation SPOC",
    description: "Incase if there is any escalation",
    fieldPrefix: "fiuEscalationSpoc" // Adding unique field prefix
  },
  {
    spocType: "RBI SPOC",
    description: "Incase RBI anytime requested to share SPOC details then this will be shared",
    fieldPrefix: "rbiSpoc" // Adding unique field prefix
  },
  {
    spocType: "Grievance SPOC",
    description: "Incase any grievances received from end customer to AA then we will be reaching out to this SPOC",
    fieldPrefix: "grievanceSpoc" // Adding unique field prefix
  }
];

const SpocContact = ({ 
  control, 
  namePrefix, 
  title, 
  description 
}: { 
  control: any; 
  namePrefix: string; 
  title: string; 
  description: string 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`${namePrefix}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}.designation`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}.email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}.mobileNumber`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

const SpocDetailsForm = () => {
  const { control } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">FIU SPOC Details</h2>
      <p className="text-muted-foreground mb-6">Please provide contact details for each type of SPOC (Single Point of Contact).</p>
      
      {spocTypes.map((spoc) => (
        <SpocContact
          key={spoc.spocType}
          control={control}
          namePrefix={spoc.fieldPrefix} // Use the dedicated field prefix
          title={spoc.spocType}
          description={spoc.description}
        />
      ))}
    </div>
  );
};

export default SpocDetailsForm;
