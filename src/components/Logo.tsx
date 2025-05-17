
import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true, size = "medium" }) => {
  const getSizeClass = () => {
    switch (size) {
      case "small": 
        return "w-10 h-10";
      case "large": 
        return "w-16 h-16";
      default: 
        return "w-12 h-12";
    }
  };

  const getLogoSize = () => {
    switch (size) {
      case "small": 
        return "w-6 h-6";
      case "large": 
        return "w-10 h-10";
      default: 
        return "w-8 h-8";
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${getSizeClass()} rounded-md flex items-center justify-center mx-auto`}>
        <img 
          src="/lovable-uploads/2b4bfe1f-f702-4082-81fd-f84a95ab1bb8.png" 
          alt="Logo" 
          className={`${getLogoSize()}`}
        />
      </div>
      {showText && (
        <div className="font-bold text-xl">Account Aggregator</div>
      )}
    </div>
  );
};

export default Logo;
