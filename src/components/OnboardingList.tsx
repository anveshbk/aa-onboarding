
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pencil } from "lucide-react";

interface OnboardingRequest {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

const dummyRequests: OnboardingRequest[] = [
  {
    id: "req-001",
    name: "HDFC Bank",
    type: "FIU",
    status: "approved",
    date: "2025-04-15",
  },
  {
    id: "req-002",
    name: "Aviva",
    type: "FIU",
    status: "approved",
    date: "2025-04-15",
  },
  {
    id: "req-003",
    name: "SBI Bank",
    type: "FIU",
    status: "pending",
    date: "2025-04-26",
  },
];

const OnboardingList = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Pending Onboarding Requests</h2>
      
      {dummyRequests.length === 0 ? (
        <p className="text-muted-foreground">No pending requests found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black text-lg">FIU ID</TableHead>
              <TableHead className="font-bold text-black text-lg">Date</TableHead>
              <TableHead className="font-bold text-black text-lg">Status</TableHead>
              <TableHead className="font-bold text-black text-lg">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyRequests.map((request) => (
              <TableRow key={request.id} className="border-t border-b">
                <TableCell className="py-4 text-base">{request.name}</TableCell>
                <TableCell className="py-4 text-base">{request.date}</TableCell>
                <TableCell className="py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default OnboardingList;
