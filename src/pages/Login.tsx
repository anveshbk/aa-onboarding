
import { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";
import appConfig from "@/config/appConfig.json";

const Login = () => {
  // Add animation effect when component mounts
  useEffect(() => {
    const logo = document.querySelector(".logo-container");
    if (logo) {
      logo.classList.add("animate-fade-in");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 text-center logo-container transition-all duration-500">
          <Logo className="justify-center mb-6" showText={false} size="medium" />
          <h1 className="text-3xl font-bold text-gray-900">{appConfig.general.loginTitle}</h1>
          <p className="text-gray-500 mt-2">{appConfig.general.loginSubtitle}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
