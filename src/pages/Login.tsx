
import LoginForm from "@/components/LoginForm";
import { ClipboardIcon } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ClipboardIcon className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Onboarding Dashboard</h1>
          <p className="text-gray-600">Enter your credentials to access the dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
