"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1.5 text-[#F8F8F8] hover:bg-white/10 rounded-md transition-all focus:outline-none flex items-center justify-center bg-transparent border-none appearance-none cursor-pointer"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[130px] rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-1.5 bg-[#F8F8F8] dark:bg-slate-950"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors focus:bg-royal-800 focus:text-white dark:focus:bg-royal-700 rounded-lg outline-none group"
        >
          <Sun className="h-4 w-4 text-orange-500 group-focus:text-white transition-colors" />
          <span className="font-bold text-xs">Light Mode</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors focus:bg-royal-800 focus:text-white dark:focus:bg-royal-700 rounded-lg outline-none group"
        >
          <Moon className="h-4 w-4 text-royal-600 group-focus:text-white transition-colors" />
          <span className="font-bold text-xs">Dark Mode</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors focus:bg-royal-800 focus:text-white dark:focus:bg-royal-700 rounded-lg outline-none group"
        >
          <Monitor className="h-4 w-4 text-slate-500 group-focus:text-white transition-colors" />
          <span className="font-bold text-xs">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
