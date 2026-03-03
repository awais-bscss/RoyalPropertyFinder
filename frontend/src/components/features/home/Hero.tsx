"use client";

import {
  Search,
  MapPin,
  Home,
  Building,
  LandPlot,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import backgroundImage from "@/assets/imageBackgroundLarge.webp";

export function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "rent" ? "rent" : "buy";

  const handleTabChange = (value: string) => {
    if (value === "projects") {
      router.push("/new-projects");
      return;
    }
    router.push(`/?tab=${value}`);
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-19 md:py-24 overflow-hidden min-h-[550px] isolate">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Luxury Real Estate Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="container relative z-10 px-4 flex flex-col items-center justify-center">
        {/* Title from Image */}
        <h2 className="text-white text-2xl md:text-3xl font-medium mb-8 text-center drop-shadow-md">
          Search properties for sale in Pakistan
        </h2>

        {/* Search Box Container */}
        <div className="w-full max-w-2xl">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            {/* Tabs (Centered above the box) */}
            <TabsList className="bg-transparent h-auto p-0 flex justify-center gap-4 mb-0 relative z-20 mx-auto w-fit">
              <TabsTrigger
                value="buy"
                className="w-32 py-[20px] text-sm font-bold uppercase border-0 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=inactive]:bg-[#626B67]/70 data-[state=inactive]:text-white data-[state=inactive]:border data-[state=inactive]:border-white rounded-[2px] transition-all relative cursor-pointer"
              >
                BUY
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white opacity-0 data-[state=active]:opacity-100 transition-opacity" />
              </TabsTrigger>
              <TabsTrigger
                value="rent"
                className="w-32 py-[20px] text-sm font-bold uppercase border-0 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=inactive]:bg-[#626B67]/70 data-[state=inactive]:text-white data-[state=inactive]:border data-[state=inactive]:border-white rounded-[2px] transition-all relative cursor-pointer"
              >
                RENT
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white opacity-0 data-[state=active]:opacity-100 transition-opacity" />
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                onClick={() => router.push("/new-projects")}
                className="w-32 py-[20px] text-sm font-bold uppercase border-0 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=inactive]:bg-[#626B67]/70 data-[state=inactive]:text-white data-[state=inactive]:border data-[state=inactive]:border-white rounded-[2px] transition-all relative cursor-pointer"
              >
                PROJECTS
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white opacity-0 data-[state=active]:opacity-100 transition-opacity" />
              </TabsTrigger>
            </TabsList>

            {/* Main Search Area (Dark Background) */}
            <div className="w-full bg-[#1A1A1A]/80 p-5 shadow-2xl mt-1 relative z-10 rounded-[2px]">
              <TabsContent value="buy" className="mt-0 outline-none">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    {/* City Select Box */}
                    <div className="flex-1 md:flex-[0.4] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0">
                      <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                        City
                      </label>
                      <Select defaultValue="karachi">
                        <SelectTrigger className="h-6 w-full border-none text-slate-900 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold px-1 shadow-none flex items-center justify-between [&_svg]:opacity-100 [&_svg]:text-slate-900 -mt-0.5">
                          <SelectValue placeholder="City" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={4}>
                          <SelectItem value="karachi">Karachi</SelectItem>
                          <SelectItem value="lahore">Lahore</SelectItem>
                          <SelectItem value="islamabad">Islamabad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location Input Box */}
                    <div className="flex-1 md:flex-[1.2] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0">
                      <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                        Location
                      </label>
                      <Input className="h-6 border-none text-slate-900 focus-visible:ring-0 font-semibold px-1 shadow-none placeholder:text-slate-300 -mt-0.5" />
                    </div>

                    {/* Green Find Button */}
                    <Button className="px-10 py-0 bg-[#023E8A] !hover:bg-[#03045E] text-white text-sm font-medium transition-all border-none rounded-[2px] h-[50px] cursor-pointer">
                      FIND
                    </Button>
                  </div>

                  {/* More Options Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white px-1">
                    <span className="flex items-center cursor-pointer transition-all">
                      <ChevronDown className="mr-1 size-3" />
                      More Options
                    </span>
                    <span className="mx-1 opacity-40">|</span>
                    <Link href="#" className="text-[#48CAE4]">
                      Change Currency
                    </Link>
                    <span className="mx-1 opacity-40">|</span>
                    <Link href="#" className="text-[#48CAE4]">
                      Change Area Unit
                    </Link>
                    <span className="mx-1 opacity-40">|</span>
                    <Link href="#" className="text-[#48CAE4]">
                      Reset Search
                    </Link>
                  </div>
                </div>
              </TabsContent>

              {/* Duplicate contents for Rent/Projects with same styling */}
              <TabsContent value="rent" className="mt-0 outline-none">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 md:flex-[0.4] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0">
                    <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                      City
                    </label>
                    <Select defaultValue="karachi">
                      <SelectTrigger className="h-6 w-full border-none text-slate-900 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold px-1 shadow-none flex items-center justify-between [&_svg]:opacity-100 [&_svg]:text-slate-900 -mt-0.5">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="karachi">Karachi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 md:flex-[1.2] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0">
                    <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                      Location
                    </label>
                    <Input className="h-6 border-none text-slate-900 focus-visible:ring-0 font-medium px-1 shadow-none -mt-0.5" />
                  </div>
                  <Button className="px-10 py-0 bg-[#023E8A] !hover:bg-[#03045E] text-white  text-sm font-medium rounded-[2px] h-[50px] cursor-pointer">
                    FIND
                  </Button>
                </div>

                {/* More Options Strip */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white px-1 mt-2">
                  <span className="flex items-center cursor-pointer transition-all">
                    <ChevronDown className="mr-1 size-3" />
                    More Options
                  </span>
                  <span className="mx-1 opacity-40">|</span>
                  <Link href="#" className="text-[#48CAE4]">
                    Change Currency
                  </Link>
                  <span className="mx-1 opacity-40">|</span>
                  <Link href="#" className="text-[#48CAE4]">
                    Change Area Unit
                  </Link>
                  <span className="mx-1 opacity-40">|</span>
                  <Link href="#" className="text-[#48CAE4]">
                    Reset Search
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="projects" className="mt-0 outline-none">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 md:flex-[0.4] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0">
                    <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                      City
                    </label>
                    <Select defaultValue="karachi">
                      <SelectTrigger className="h-6 w-full border-none text-slate-900 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold px-1 shadow-none flex items-center justify-between [&_svg]:opacity-100 [&_svg]:text-slate-900 -mt-0.5">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4}>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="islamabad">Islamabad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 md:flex-[1.2] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0">
                    <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                      Location
                    </label>
                    <Input className="h-6 border-none text-slate-900 focus-visible:ring-0 font-medium px-1 shadow-none -mt-0.5" />
                  </div>
                  <Button
                    onClick={() => router.push("/new-projects")}
                    className="px-10 py-0 bg-[#023E8A] !hover:bg-[#03045E] text-white text-sm font-medium rounded-[2px] h-[50px] cursor-pointer"
                  >
                    FIND
                  </Button>
                </div>

                {/* More Options Strip */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white px-1 mt-2">
                  <span className="flex items-center cursor-pointer transition-all">
                    <ChevronDown className="mr-1 size-3" />
                    More Options
                  </span>
                  <span className="mx-1 opacity-40">|</span>
                  <Link href="#" className="text-[#48CAE4]">
                    Change Currency
                  </Link>
                  <span className="mx-1 opacity-40">|</span>
                  <Link href="#" className="text-[#48CAE4]">
                    Change Area Unit
                  </Link>
                  <span className="mx-1 opacity-40">|</span>
                  <Link href="#" className="text-[#48CAE4]">
                    Reset Search
                  </Link>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
