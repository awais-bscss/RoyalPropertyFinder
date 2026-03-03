import React from "react";
import Image from "next/image";
import logoImage from "@/assets/Logo3.png";

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div
      className={`relative ${className} flex items-center justify-center overflow-hidden`}
    >
      <Image
        src={logoImage}
        alt="Royal Property Finder Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};
