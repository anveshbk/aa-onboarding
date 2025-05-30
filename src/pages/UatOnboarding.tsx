
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UatFormWizard from "@/components/UatFormWizard";

const UatOnboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 mb-8">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-primary hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
      <UatFormWizard />
    </div>
  );
};

export default UatOnboarding;
