
import React from "react";
import { getImagePath } from "@/utils/imagePath";

interface LogoProps {
  size?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 48, className = "" }) => (
  <img
    src={getImagePath("lovable-uploads/b083dd39-09b8-4618-8a61-c4cab30c678e.png")}
    alt="Logo Viva Esportes"
    style={{
      width: typeof size === "number" ? `${size}px` : size,
      height: "auto",
      display: "block",
    }}
    className={className}
    draggable={false}
  />
);

export default Logo;
