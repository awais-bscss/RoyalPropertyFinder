import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
  iconSize?: number;
}

export function CarouselArrow({
  direction,
  iconSize = 20,
  className,
  ...props
}: CarouselArrowProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      {...props}
      className={cn(
        // Base consistent styling
        "w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center",
        "text-[#023E8A] border border-slate-100 cursor-pointer",
        "hover:bg-[#023E8A] hover:text-white transition-all duration-300",
        // Extendable styling
        className,
      )}
    >
      <Icon size={iconSize} />
    </button>
  );
}
