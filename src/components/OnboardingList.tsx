
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    status: "pending",
    date: "2025-04-28",
  },
  {
    id: "req-002",
    name: "ICICI Bank",
    type: "FIU",
    status: "pending",
    date: "2025-04-27",
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
        <div className="border rounded-md">
          <div className="grid grid-cols-5 font-medium bg-muted p-3 text-sm">
            <div>Organization</div>
            <div>Type</div>
            <div>Status</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
          
          {dummyRequests.map((request) => (
            <div key={request.id} className="grid grid-cols-5 p-3 border-t text-sm items-center">
              <div>{request.name}</div>
              <div>{request.type}</div>
              <div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {request.status}
                </span>
              </div>
              <div>{request.date}</div>
              <div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default OnboardingList;
