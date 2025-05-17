
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
      <div className={`${getSizeClass()} bg-primary/10 rounded-md flex items-center justify-center mr-3 shadow-md transition-all duration-300 hover:shadow-lg`}>
        <img 
          src="/lovable-uploads/ff89eb96-7d0b-4052-a941-936e528829ad.png" 
          alt="Logo" 
          className={`${getLogoSize()} transition-transform duration-300`}
        />
      </div>
      {showText && (
        <div className="font-bold text-xl">Account Aggregator</div>
      )}
    </div>
  );
};

export default Logo;
