
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 relative overflow-hidden">
      {/* Background pattern elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="mb-8 text-center logo-container transition-all duration-500 z-10">
        <Logo className="justify-center mb-6 transform hover:scale-105 transition-transform duration-300" showText={false} size="large" />
        <h1 className="text-2xl font-bold text-gray-800">{appConfig.general.loginTitle}</h1>
        <p className="text-muted-foreground">{appConfig.general.loginSubtitle}</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
