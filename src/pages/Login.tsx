
import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";
import appConfig from "@/config/appConfig.json";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 text-center">
        <Logo className="justify-center mb-4" />
        <h1 className="text-2xl font-bold">{appConfig.general.loginTitle}</h1>
        <p className="text-muted-foreground">{appConfig.general.loginSubtitle}</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
