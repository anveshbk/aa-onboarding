
import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center mr-3">
        <img 
          src="/lovable-uploads/ff89eb96-7d0b-4052-a941-936e528829ad.png" 
          alt="Logo" 
          className="w-8 h-8"
        />
      </div>
      {showText && (
        <div className="font-bold text-xl">Account Aggregator</div>
      )}
    </div>
  );
};

export default Logo;
