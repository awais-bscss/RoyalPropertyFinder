import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatPrice(currency: string, value: number) {
  if (!value) return "0";
  const curr = currency || "PKR";

  const formatShort = (val: number, unit: string) => {
    const formatted = val.toFixed(2).replace(/\.?0+$/, "");
    return `${curr} ${formatted} ${unit}`;
  };

  if (curr === "PKR") {
    if (value >= 1000000000) return formatShort(value / 1000000000, "Arab");
    if (value >= 10000000) return formatShort(value / 10000000, "Crore");
    if (value >= 100000) return formatShort(value / 100000, "Lac");
  } else {
    // International format
    if (value >= 1000000000) return formatShort(value / 1000000000, "B");
    if (value >= 1000000) return formatShort(value / 1000000, "M");
    if (value >= 1000) return formatShort(value / 1000, "K");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: curr,
    maximumFractionDigits: 0,
  }).format(value);
}
