
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OnboardingList from "@/components/OnboardingList";
import Logo from "@/components/Logo";
import appConfig from "@/config/appConfig.json";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleStartNewOnboarding = () => {
    navigate("/onboarding");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo showText={false} />
            <h1 className="text-xl font-bold ml-2">{appConfig.general.dashboardTitle}</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Welcome to Onemoney!</h2>
                <p className="text-muted-foreground">{appConfig.general.dashboardSubtitle}</p>
              </div>
              <Button onClick={handleStartNewOnboarding}>
                Onboard New FIU
              </Button>
            </div>
          </Card>
        </div>
        
        <OnboardingList />
      </main>
    </div>
  );
};

export default Dashboard;
