"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Bed,
  Bath,
  Move,
  Heart,
  Building2,
} from "lucide-react";
import { FilterSelect } from "@/components/features/new-projects/FilterSelect";
import bgImage from "@/assets/bg-new-projects-sm.webp";
import apiClient from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

const BUDGET_OPTIONS = [
  { label: "0 – Any", value: "any" },
  { label: "Up to 1 Crore", value: "1cr" },
  { label: "1 – 5 Crore", value: "1-5cr" },
  { label: "5 – 20 Crore", value: "5-20cr" },
  { label: "20+ Crore", value: "20cr+" },
];

const AREA_OPTIONS = [
  { label: "0 – Any", value: "any" },
  { label: "Up to 5 Marla", value: "5marla" },
  { label: "5 – 10 Marla", value: "5-10marla" },
  { label: "1 – 2 Kanal", value: "1-2kanal" },
  { label: "2+ Kanal", value: "2kanal+" },
];

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State - Initialized from URL
  const [city, setCity] = useState(searchParams.get("city") || "any");
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "any");
  const [subtype, setSubtype] = useState(searchParams.get("subtype") || "any");
  const [category, setCategory] = useState(searchParams.get("category") || "any");
  
  // Specific Ranges (UI Dropdowns)
  const [budget, setBudget] = useState(searchParams.get("budget") || "any");
  const [area, setArea] = useState(searchParams.get("area") || "any");
  
  // Detailed Filter Stats (from Hero or refined search)
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "any");
  
  const [keyword, setKeyword] = useState(searchParams.get("location") || searchParams.get("keyword") || "");
  const [showMore, setShowMore] = useState(false);
  const [searched, setSearched] = useState(
    !!searchParams.get("city") || 
    !!searchParams.get("location") || 
    !!searchParams.get("keyword") || 
    !!searchParams.get("purpose") || 
    !!searchParams.get("budget") ||
    !!searchParams.get("area")
  );

  const fetchListings = async (paramsObj?: any) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      const p = paramsObj || { 
        city, purpose, subtype, keyword, 
        minPrice, maxPrice, minArea, maxArea, 
        bedrooms, category, budget, area 
      };
      
      if (p.city && p.city !== "any") q.set("city", p.city);
      if (p.purpose && p.purpose !== "any") q.set("purpose", p.purpose);
      if (p.subtype && p.subtype !== "any") q.set("subtype", p.subtype);
      if (p.category && p.category !== "any") q.set("propertyTypeTab", p.category);
      if (p.keyword) q.set("keyword", p.keyword);
      
      // Handle Bedooms
      if (p.bedrooms && p.bedrooms !== "any" && p.bedrooms !== "All") q.set("bedrooms", p.bedrooms);

      // Handle Budget Range Dropdowns
      if (p.budget !== "any") {
        if (p.budget === "1cr") q.set("maxPrice", "10000000");
        else if (p.budget === "1-5cr") { q.set("minPrice", "10000000"); q.set("maxPrice", "50000000"); }
        else if (p.budget === "5-20cr") { q.set("minPrice", "50000000"); q.set("maxPrice", "200000000"); }
        else if (p.budget === "20cr+") q.set("minPrice", "200000000");
      } else {
        // Only use detailed if dropdown is not set
        if (p.minPrice) q.set("minPrice", p.minPrice);
        if (p.maxPrice && p.maxPrice !== "Any") q.set("maxPrice", p.maxPrice);
      }

      // Handle Area Range Dropdowns
      if (p.area !== "any") {
        // Backend handles numeric filtering, but area needs unit awareness usually. 
        // For simplicity we map marla/kanal to ranges if that's what's in DB
        if (p.area === "5marla") q.set("maxArea", "5");
        else if (p.area === "5-10marla") { q.set("minArea", "5"); q.set("maxArea", "10"); }
        else if (p.area === "1-2kanal") { q.set("minArea", "1"); q.set("maxArea", "2"); }
        else if (p.area === "2kanal+") q.set("minArea", "2");
      } else {
        if (p.minArea) q.set("minArea", p.minArea);
        if (p.maxArea && p.maxArea !== "Any") q.set("maxArea", p.maxArea);
      }

      const response: any = await apiClient.get(`/listings?${q.toString()}`);
      setListings(response?.data || []);
    } catch (error) {
      setListings([]);
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = {
      city: searchParams.get("city") || "any",
      purpose: searchParams.get("purpose") || "any",
      subtype: searchParams.get("subtype") || "any",
      category: searchParams.get("category") || "any",
      budget: searchParams.get("budget") || "any",
      area: searchParams.get("area") || "any",
      keyword: searchParams.get("location") || searchParams.get("keyword") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      minArea: searchParams.get("minArea") || "",
      maxArea: searchParams.get("maxArea") || "",
      bedrooms: searchParams.get("bedrooms") || "any"
    };

    setCity(currentParams.city);
    setPurpose(currentParams.purpose);
    setSubtype(currentParams.subtype);
    setCategory(currentParams.category);
    setBudget(currentParams.budget);
    setArea(currentParams.area);
    setKeyword(currentParams.keyword);
    setMinPrice(currentParams.minPrice);
    setMaxPrice(currentParams.maxPrice);
    setMinArea(currentParams.minArea);
    setMaxArea(currentParams.maxArea);
    setBedrooms(currentParams.bedrooms);

    fetchListings(currentParams);
  }, [searchParams]);

  const cityOptions = [
    { label: "All Cities", value: "any" },
    ...Array.from(new Set(listings.map((l: any) => l.city)))
      .filter((c) => c)
      .sort()
      .map((c) => ({ label: c, value: c })),
  ];

  const subtypeOptions = [
    { label: "All Types", value: "any" },
    ...Array.from(new Set(listings.map((l: any) => l.subtype)))
      .filter((s) => s)
      .sort()
      .map((s) => ({ label: s, value: s })),
  ];

  const filteredProperties = useMemo(() => {
    return listings;
  }, [listings]);

  function handleSearch() {
    setSearched(true);
    const params = new URLSearchParams();
    if (city !== "any") params.set("city", city);
    if (purpose !== "any") params.set("purpose", purpose);
    if (subtype !== "any") params.set("subtype", subtype);
    if (category !== "any") params.set("category", category);
    if (keyword) params.set("location", keyword);
    if (budget !== "any") params.set("budget", budget);
    if (area !== "any") params.set("area", area);
    if (bedrooms !== "any" && bedrooms !== "All") params.set("bedrooms", bedrooms);
    
    // We don't necessarily need to put minPrice/maxArea in URL if dropdown is set, 
    // but we can preserve them if they were already there
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice && maxPrice !== "Any") params.set("maxPrice", maxPrice);
    if (minArea) params.set("minArea", minArea);
    if (maxArea && maxArea !== "Any") params.set("maxArea", maxArea);

    router.push(`/properties?${params.toString()}`);
  }

  function clearFilters() {
    setCity("any");
    setPurpose("any");
    setSubtype("any");
    setCategory("any");
    setBudget("any");
    setArea("any");
    setKeyword("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setBedrooms("any");
    setSearched(false);
    router.push("/properties");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden">
        {/* BG Image */}
        <img
          src={bgImage.src}
          alt="Properties in Pakistan"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/45" />

        {/* Breadcrumb */}
        <div className="relative z-10 pt-5 px-4 md:px-8 container mx-auto">
          <nav className="flex items-center gap-1 text-[12px] text-white/70">
            <Link
              href="/"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Royal Property Finder
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">
              Properties for Sale & Rent
            </span>
          </nav>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-20 text-center px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Search Properties in Pakistan
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl">
            Find the best real estate matches for your dreams and budget
          </p>
        </div>
      </div>

      {/* ── Floating Filter Card ───────────────────────────────────────── */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-lg">
          {/* Row 1: City | Purpose | Subtype | Budget | Search */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 items-end">
            <FilterSelect
              label="City"
              value={city}
              onChange={setCity}
              options={cityOptions}
              placeholder="All Cities"
            />
            <div className="hidden md:block w-px h-10 bg-slate-200 self-end" />
            <FilterSelect
              label="Purpose"
              value={purpose}
              onChange={setPurpose}
              options={[
                { label: "Any", value: "any" },
                { label: "Buy", value: "Sell" },
                { label: "Rent", value: "Rent" },
              ]}
              placeholder="Any"
            />
            <div className="hidden md:block w-px h-10 bg-slate-200 self-end" />
            <FilterSelect
              label="Property Type"
              value={subtype}
              onChange={setSubtype}
              options={subtypeOptions}
              placeholder="All Types"
            />
            <div className="hidden md:block w-px h-10 bg-slate-200 self-end" />
            <FilterSelect
              label="Budget Range"
              value={budget}
              onChange={setBudget}
              options={BUDGET_OPTIONS}
              placeholder="0 – Any"
            />

            {/* Search button + See More/Less */}
            <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-royal-800 hover:bg-royal-700 text-white font-bold px-6 py-2.5 rounded-sm text-[14px] transition-all duration-200 cursor-pointer mt-1"
              >
                <Search className="w-4.5 h-4.5" />
                Search
              </button>
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-1 text-[14px] font-semibold text-royal-700 hover:text-royal-900 transition-colors cursor-pointer mt-1"
              >
                {showMore ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" /> Less Filters
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> More Filters
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Expanded filters - Animated */}
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${showMore ? "grid-rows-[1fr]" : "grid-rows-[0fr] overflow-hidden"}`}
          >
            <div className={`${showMore ? "overflow-visible" : "overflow-hidden"}`}>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-5 items-end border-t border-slate-100 dark:border-slate-800 pt-5">
                {/* Area */}
                <FilterSelect
                  label="Area Range"
                  value={area}
                  onChange={setArea}
                  options={AREA_OPTIONS}
                  placeholder="0 – Any"
                />

                {/* Keyword search */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold mb-1">
                    Keyword Search
                  </p>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter location, title, or society"
                    className="w-full border-b-2 border-slate-200 focus:border-royal-700 focus:outline-none py-1 text-[14px] text-slate-700 placeholder:text-slate-400 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active filters clear */}
          {(city !== "any" ||
            purpose !== "any" ||
            subtype !== "any" ||
            budget !== "any" ||
            area !== "any" ||
            keyword) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Active filters:</span>
              {city !== "any" && (
                <span className="bg-royal-50 text-royal-800 text-xs font-medium px-2.5 py-1 rounded-full border border-royal-200 flex items-center gap-1">
                  {city}{" "}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setCity("any")}
                  />
                </span>
              )}
              {purpose !== "any" && (
                <span className="bg-royal-50 text-royal-800 text-xs font-medium px-2.5 py-1 rounded-full border border-royal-200 flex items-center gap-1">
                  {purpose === "Sell" ? "Buy" : purpose}{" "}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setPurpose("any")}
                  />
                </span>
              )}
              {subtype !== "any" && (
                <span className="bg-royal-50 text-royal-800 text-xs font-medium px-2.5 py-1 rounded-full border border-royal-200 flex items-center gap-1">
                  {subtype}{" "}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setSubtype("any")}
                  />
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 font-semibold hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white">
            {searched && filteredProperties.length === 0
              ? "No Properties Found"
              : "All Properties"}
          </h2>
          {filteredProperties.length > 0 && (
            <p className="text-slate-500 text-sm font-medium">
              Showing {filteredProperties.length} results
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-royal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Building2 className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              We couldn't find any matches
            </h3>
            <p className="text-slate-500 max-w-md">
              Try adjusting your search criteria, removing some filters, or
              broadening your budget.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 bg-royal-100 text-royal-800 px-6 py-2 rounded-full font-bold text-sm hover:bg-royal-200 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop: any) => {
              const isRealListing = !!prop._id;
              const id = isRealListing ? prop._id : prop.id;
              const title = prop.title;
              const price = isRealListing
                ? `${prop.currency || "PKR"} ${prop.price}`
                : prop.price;
              const location = isRealListing
                ? `${prop.location}, ${prop.city}`
                : `${prop.location}, ${prop.city}`;
              const beds = isRealListing
                ? parseInt(prop.bedrooms) || 0
                : prop.beds;
              const baths = isRealListing
                ? parseInt(prop.bathrooms) || 0
                : prop.baths;
              const area = isRealListing
                ? `${prop.areaSize} ${prop.areaUnit}`
                : prop.area;
              const type = isRealListing ? prop.subtype : prop.subtype;
              const purpose = isRealListing
                ? `For ${prop.purpose}`
                : prop.type === "Sell"
                  ? "For Sell"
                  : `For ${prop.type}`;
              const image =
                isRealListing && prop.images?.length > 0
                  ? prop.images[0]
                  : prop.images?.[0] ||
                    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80";

              return (
                <Link
                  key={id}
                  href={`/properties/${id}`}
                  className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer group flex flex-col h-full border border-slate-200/60 dark:border-slate-800/80 hover:shadow-xl hover:border-transparent dark:hover:border-transparent"
                >
                  {/* Image Section */}
                  <div className="px-3 pt-3">
                    <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-xl">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#023E8A] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wide">
                        {purpose}
                      </div>
                      <button className="absolute top-3 right-3 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm p-1.5 rounded-full transition-colors cursor-pointer">
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="py-4 px-4 flex-1 flex flex-col">
                    <p className="text-[18px] md:text-[20px] font-extrabold text-slate-800 dark:text-white leading-tight mb-1">
                      {isRealListing ? formatPrice(prop.currency, prop.price) : price}
                    </p>
                    <h3 className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-[#023E8A] transition-colors line-clamp-1 mb-1">
                      {title}
                    </h3>
                    <p className="text-[13px] text-slate-400 dark:text-slate-500 line-clamp-1 mb-4">
                      {location}
                    </p>

                    <div className="mt-auto flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      {beds > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Bed size={15} className="mt-0.5" />
                          <span className="text-[13px] font-medium leading-[18px]">
                            {beds}
                          </span>
                        </div>
                      )}
                      {baths > 0 && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Bath size={15} className="mt-0.5" />
                          <span className="text-[13px] font-medium leading-[18px]">
                            {baths}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap text-ellipsis ml-auto">
                        <Move size={15} className="shrink-0" />
                        <span className="text-[13px] font-medium truncate">
                          {area}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
       <div className="flex items-center justify-center min-h-screen">
         <div className="w-10 h-10 border-4 border-royal-500 border-t-transparent rounded-full animate-spin"></div>
       </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
