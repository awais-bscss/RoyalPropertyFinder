"use client";

import {
  Search,
  MapPin,
  Home,
  Building,
  LandPlot,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
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
import { PropertyTypeDropdown } from "./components/PropertyTypeDropdown";
import { PriceDropdown } from "./components/PriceDropdown";
import { CurrencyDropdown } from "./components/CurrencyDropdown";
import { AreaDropdown } from "./components/AreaDropdown";
import { AreaUnitDropdown } from "./components/AreaUnitDropdown";
import { BedsDropdown } from "./components/BedsDropdown";
import { CityDropdown } from "./components/CityDropdown";

export function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "rent" ? "rent" : "buy";
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "HOMES" | "PLOTS" | "COMMERCIAL"
  >("HOMES");
  
  // Search State
  const [city, setCity] = useState("karachi");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("any");
  const [minPrice, setMinPrice] = useState<number | string>(0);
  const [maxPrice, setMaxPrice] = useState<number | string>("Any");
  const [minArea, setMinArea] = useState<number | string>(0);
  const [maxArea, setMaxArea] = useState<number | string>("Any");
  const [beds, setBeds] = useState("All");

  const [resetKey, setResetKey] = useState(0);

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setCity("karachi");
    setLocation("");
    setPropertyType("any");
    setMinPrice(0);
    setMaxPrice("Any");
    setMinArea(0);
    setMaxArea("Any");
    setBeds("All");
    setSelectedCategory("HOMES");
    setShowMoreOptions(false);
    setResetKey((prev) => prev + 1);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("purpose", activeTab);
    params.set("city", city);
    if (location) params.set("location", location);
    if (propertyType && propertyType !== "any") params.set("subtype", propertyType);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice && minPrice !== 0) params.set("minPrice", minPrice.toString());
    if (maxPrice && maxPrice !== "Any") params.set("maxPrice", maxPrice.toString());
    if (minArea && minArea !== 0) params.set("minArea", minArea.toString());
    if (maxArea && maxArea !== "Any") params.set("maxArea", maxArea.toString());
    if (beds && beds !== "All") params.set("bedrooms", beds);
    
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "projects") {
      router.push("/new-projects");
      return;
    }
    router.push(`/?tab=${value}`);
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-19 md:py-24 overflow-visible min-h-[550px] z-50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={backgroundImage}
          alt="Luxury Real Estate Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="container relative z-20 px-4 flex flex-col items-center justify-center overflow-visible">
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
            <div className="w-full bg-[#1A1A1A]/80 p-5 shadow-2xl mt-1 relative z-30 rounded-[2px]">
              <TabsContent value="buy" className="mt-0 outline-none">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    {/* City Select Box */}
                    <CityDropdown value={city} onChange={setCity} />

                    {/* Location Input Box */}
                    <div className="flex-1 md:flex-[1.2] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0 border border-slate-200 hover:border-slate-300 transition-all">
                      <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                        Location
                      </label>
                      <Input
                        value={location || ""}
                        onChange={(e) => setLocation(e.target.value)}
                        onClick={() => setShowMoreOptions(true)}
                        onFocus={() => setShowMoreOptions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search Location"
                        className="h-6 border-none text-slate-900 focus-visible:ring-0 font-semibold px-1 shadow-none placeholder:text-slate-300 -mt-0.5"
                      />
                    </div>

                    {/* Green Find Button */}
                    <Button 
                      onClick={handleSearch}
                      className="px-10 py-0 bg-[#023E8A] !hover:bg-[#03045E] text-white text-sm font-medium transition-all border-none rounded-[2px] h-[50px] cursor-pointer"
                    >
                      FIND
                    </Button>
                  </div>

                  {/* ──────────────── MORE OPTIONS ROW ──────────────── */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out relative ${
                      showMoreOptions
                        ? "grid-rows-[1fr] opacity-100 mt-2 z-90"
                        : "grid-rows-[0fr] opacity-0 overflow-hidden z-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="flex flex-col md:flex-row gap-2 pb-1 text-slate-900">
                        {/* Property Type */}
                        <PropertyTypeDropdown
                          key={`prop-buy-${resetKey}`}
                          onCategoryChange={(cat) => setSelectedCategory(cat)}
                          onTypeChange={setPropertyType}
                        />

                        {/* Price (PKR) */}
                        <PriceDropdown 
                          key={`price-buy-${resetKey}`} 
                          onPriceChange={(min, max) => {
                            setMinPrice(min);
                            setMaxPrice(max);
                          }}
                        />

                        {/* Area (Marla) */}
                        <AreaDropdown 
                          key={`area-buy-${resetKey}`} 
                          onAreaChange={(min, max) => {
                            setMinArea(min);
                            setMaxArea(max);
                          }}
                        />

                        {/* Beds */}
                        {selectedCategory === "HOMES" && (
                          <BedsDropdown 
                            key={`beds-buy-${resetKey}`} 
                            onBedsChange={setBeds}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ──────────────── END MORE OPTIONS ROW ──────────────── */}

                  {/* More Options Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white px-1">
                    <span
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="flex items-center cursor-pointer transition-all hover:text-slate-200"
                    >
                      {showMoreOptions ? (
                        <>
                          <ChevronUp className="mr-1 size-3" />
                          Less Options
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 size-3" />
                          More Options
                        </>
                      )}
                    </span>
                    <span className="mx-1 opacity-40">|</span>
                    <CurrencyDropdown />
                    <span className="mx-1 opacity-40">|</span>
                    <AreaUnitDropdown />
                    <span className="mx-1 opacity-40">|</span>
                    <button
                      onClick={handleReset}
                      className="text-[#48CAE4] hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Reset Search
                    </button>
                  </div>
                </div>
              </TabsContent>

              {/* Duplicate contents for Rent/Projects with same styling */}
              <TabsContent value="rent" className="mt-0 outline-none">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    {/* City Select Box */}
                    <CityDropdown value={city} onChange={setCity} />

                    {/* Location Input Box */}
                    <div className="flex-1 md:flex-[1.2] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0 border border-slate-200 hover:border-slate-300 transition-all">
                      <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                        Location
                      </label>
                      <Input
                        value={location || ""}
                        onChange={(e) => setLocation(e.target.value)}
                        onClick={() => setShowMoreOptions(true)}
                        onFocus={() => setShowMoreOptions(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search Location"
                        className="h-6 border-none text-slate-900 focus-visible:ring-0 font-semibold px-1 shadow-none placeholder:text-slate-300 -mt-0.5"
                      />
                    </div>

                    {/* Green Find Button */}
                    <Button 
                      onClick={handleSearch}
                      className="px-10 py-0 bg-[#023E8A] !hover:bg-[#03045E] text-white text-sm font-medium transition-all border-none rounded-[2px] h-[50px] cursor-pointer"
                    >
                      FIND
                    </Button>
                  </div>

                  {/* ──────────────── MORE OPTIONS ROW ──────────────── */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out relative ${
                      showMoreOptions
                        ? "grid-rows-[1fr] opacity-100 mt-2 z-90"
                        : "grid-rows-[0fr] opacity-0 overflow-hidden z-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="flex flex-col md:flex-row gap-2 pb-1 text-slate-900">
                        {/* Property Type */}
                        <PropertyTypeDropdown
                          key={`prop-rent-${resetKey}`}
                          onCategoryChange={(cat) => setSelectedCategory(cat)}
                          onTypeChange={setPropertyType}
                        />

                        {/* Price (PKR) */}
                        <PriceDropdown 
                          key={`price-rent-${resetKey}`} 
                          onPriceChange={(min, max) => {
                            setMinPrice(min);
                            setMaxPrice(max);
                          }}
                        />

                        {/* Area (Marla) */}
                        <AreaDropdown 
                          key={`area-rent-${resetKey}`} 
                          onAreaChange={(min, max) => {
                            setMinArea(min);
                            setMaxArea(max);
                          }}
                        />

                        {/* Beds */}
                        {selectedCategory === "HOMES" && (
                          <BedsDropdown 
                            key={`beds-rent-${resetKey}`} 
                            onBedsChange={setBeds}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ──────────────── END MORE OPTIONS ROW ──────────────── */}

                  {/* More Options Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white px-1">
                    <span
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="flex items-center cursor-pointer transition-all hover:text-slate-200"
                    >
                      {showMoreOptions ? (
                        <>
                          <ChevronUp className="mr-1 size-3" />
                          Less Options
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 size-3" />
                          More Options
                        </>
                      )}
                    </span>
                    <span className="mx-1 opacity-40">|</span>
                    <CurrencyDropdown />
                    <span className="mx-1 opacity-40">|</span>
                    <AreaUnitDropdown />
                    <span className="mx-1 opacity-40">|</span>
                    <button
                      onClick={handleReset}
                      className="text-[#48CAE4] hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Reset Search
                    </button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="projects" className="mt-0 outline-none">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    <CityDropdown value={city} onChange={setCity} />
                    <div className="flex-1 md:flex-[1.2] bg-white px-2 flex flex-col justify-start py-1.5 h-[50px] rounded-[2px] gap-0 border border-slate-200 hover:border-slate-300 transition-all">
                      <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">
                        Location
                      </label>
                      <Input
                        value={location || ""}
                        onChange={(e) => setLocation(e.target.value)}
                        onClick={() => setShowMoreOptions(true)}
                        onFocus={() => setShowMoreOptions(true)}
                        className="h-6 border-none text-slate-900 focus-visible:ring-0 font-semibold px-1 shadow-none placeholder:text-slate-300 -mt-0.5"
                      />
                    </div>
                    <Button
                      onClick={() => router.push("/new-projects")}
                      className="px-10 py-0 bg-[#023E8A] !hover:bg-[#03045E] text-white text-sm font-medium transition-all border-none rounded-[2px] h-[50px] cursor-pointer"
                    >
                      FIND
                    </Button>
                  </div>

                  {/* ──────────────── MORE OPTIONS ROW ──────────────── */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out relative ${
                      showMoreOptions
                        ? "grid-rows-[1fr] opacity-100 mt-2 z-90"
                        : "grid-rows-[0fr] opacity-0 overflow-hidden z-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="flex flex-col md:flex-row gap-2 pb-1 text-slate-900">
                        {/* Property Type */}
                        <PropertyTypeDropdown
                          key={`prop-proj-${resetKey}`}
                          onCategoryChange={(cat) => setSelectedCategory(cat)}
                        />

                        {/* Price (PKR) */}
                        <PriceDropdown key={`price-proj-${resetKey}`} />

                        {/* Area (Marla) */}
                        <AreaDropdown key={`area-proj-${resetKey}`} />

                        {/* Beds */}
                        {selectedCategory === "HOMES" && (
                          <BedsDropdown key={`beds-proj-${resetKey}`} />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ──────────────── END MORE OPTIONS ROW ──────────────── */}

                  {/* More Options Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white px-1">
                    <span
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="flex items-center cursor-pointer transition-all hover:text-slate-200"
                    >
                      {showMoreOptions ? (
                        <>
                          <ChevronUp className="mr-1 size-3" />
                          Less Options
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 size-3" />
                          More Options
                        </>
                      )}
                    </span>
                    <span className="mx-1 opacity-40">|</span>
                    <CurrencyDropdown />
                    <span className="mx-1 opacity-40">|</span>
                    <AreaUnitDropdown />
                    <span className="mx-1 opacity-40">|</span>
                    <button
                      onClick={handleReset}
                      className="text-[#48CAE4] hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Reset Search
                    </button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
