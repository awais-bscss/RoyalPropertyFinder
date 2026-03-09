"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { featuredProjectsData as mockData } from "@/data/mock/featuredProjects";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import bgImage from "@/assets/bg-new-projects-sm.webp";
import { FilterSelect } from "@/components/features/new-projects/FilterSelect";
import { BrowseCategories } from "@/components/features/new-projects/BrowseCategories";
import { DiscoverProjects } from "@/components/features/new-projects/DiscoverProjects";
import { BrowseByCity } from "@/components/features/new-projects/BrowseByCity";
import { FeaturedListings } from "@/components/features/new-projects/FeaturedListings";
import { FeaturedDevelopers } from "@/components/features/new-projects/FeaturedDevelopers";
import { PropertyTypeDropdown } from "@/components/features/home/hero/components/PropertyTypeDropdown";
import { PriceDropdown } from "@/components/features/home/hero/components/PriceDropdown";
import { AreaDropdown } from "@/components/features/home/hero/components/AreaDropdown";
import apiClient from "@/lib/axios";

function formatPKR(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString();
}

export default function NewProjectsPage() {
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("any");
  const [propType, setPropType] = useState("any");
  const [budget, setBudget] = useState("any");
  const [area, setArea] = useState("any");
  const [projectTitle, setProjectTitle] = useState("");
  const [developerTitle, setDeveloperTitle] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        const response: any = await apiClient.get(
          "/listings?isRoyalProject=true",
        );
        const realProjects = (response?.data || []).map((p: any) => ({
          id: p._id,
          title: p.title,
          priceRange: `${p.currency} ${formatPKR(p.price)}`,
          location: `${p.city}, ${p.location}`,
          types: [p.subtype],
          areaRange: `${p.areaSize} ${p.areaUnit}`,
          isHot: true,
          image:
            p.images?.[0] ||
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        }));

        const combined = [...realProjects];
        mockData.forEach((m) => {
          if (!combined.find((p) => p.title === m.title)) {
            combined.push({ ...m, id: `mock-${m.id}` });
          }
        });
        setProjectsData(combined);
      } catch (error) {
        setProjectsData(mockData.map((m) => ({ ...m, id: `mock-${m.id}` })));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const ALL_CITIES = useMemo(
    () =>
      Array.from(
        new Set(projectsData.map((p) => p.location.split(",")[0].trim())),
      ).sort(),
    [projectsData],
  );

  const ALL_TYPES = useMemo(
    () => Array.from(new Set(projectsData.flatMap((p) => p.types))).sort(),
    [projectsData],
  );

  const BUDGET_OPTIONS = [
    { label: "0 – Any", value: "any" },
    { label: "Up to 1 Crore", value: "1cr" },
    { label: "1 – 5 Crore", value: "1-5cr" },
    { label: "5 – 20 Crore", value: "5-20cr" },
    { label: "20+ Crore", value: "20cr+" },
  ];

  const AREA_OPTIONS = [
    { label: "0 – Any", value: "any" },
    { label: "Up to 500 sqft", value: "500" },
    { label: "500 – 2000 sqft", value: "500-2000" },
    { label: "2000 – 5000 sqft", value: "2000-5000" },
    { label: "5000+ sqft", value: "5000+" },
  ];

  const cityOptions = [
    { label: "All Cities", value: "any" },
    ...ALL_CITIES.map((c) => ({ label: c, value: c })),
  ];
  const typeOptions = [
    { label: "All", value: "any" },
    ...ALL_TYPES.map((t) => ({ label: t, value: t })),
  ];

  const filteredProjects = useMemo(() => {
    if (!searched && !activeCategory) return projectsData;
    return projectsData.filter((project) => {
      const matchCity =
        city === "any" ||
        project.location.toLowerCase().startsWith(city.toLowerCase());
      const matchType = propType === "any" || project.types.includes(propType);
      const matchTitle =
        !projectTitle ||
        project.title.toLowerCase().includes(projectTitle.toLowerCase());
      const matchCategory =
        !activeCategory || project.types.includes(activeCategory);
      return matchCity && matchType && matchTitle && matchCategory;
    });
  }, [searched, city, propType, projectTitle, activeCategory, projectsData]);

  function handleSearch() {
    setSearched(true);
  }

  function clearFilters() {
    setCity("any");
    setPropType("any");
    setBudget("any");
    setArea("any");
    setProjectTitle("");
    setDeveloperTitle("");
    setActiveCategory(null);
    setSearched(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden">
        {/* BG Image */}
        <img
          src={bgImage.src}
          alt="Pakistan Skyline"
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
            <span className="text-white font-medium">New Projects</span>
          </nav>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-20 text-center px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Find New Projects in Pakistan
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl">
            Find exciting new real estate projects and investment opportunities
          </p>
        </div>
      </div>

      {/* ── Floating Filter Card ───────────────────────────────────────── */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-5">
          {/* Row 1: City | Type | Budget | Area | Search */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 items-end">
            <FilterSelect
              label="City"
              value={city}
              onChange={setCity}
              options={cityOptions}
              placeholder="All Cities"
            />
            <div className="hidden md:block w-px h-10 bg-slate-200 self-end" />
            <div className="relative flex-1 min-w-[140px]">
              <PropertyTypeDropdown
                initialType={propType}
                onTypeChange={(type) => setPropType(type)}
                className="w-full flex-none"
                variant="filter"
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200 self-end" />
            <div className="relative flex-1 min-w-[140px]">
              <PriceDropdown
                onPriceChange={(min, max) => setBudget(`${min}-${max}`)}
                className="w-full flex-none"
                variant="filter"
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200 self-end" />
            <div className="relative flex-1 min-w-[140px]">
              <AreaDropdown
                onAreaChange={(min, max) => setArea(`${min}-${max}`)}
                className="w-full flex-none"
                variant="filter"
              />
            </div>

            {/* Search button + See More/Less — stacked right */}
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
                    <ChevronUp className="w-3.5 h-3.5" /> See Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" /> See More
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Expanded filters - Animated */}
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              showMore ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-5 items-end">
                {/* Project Title */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold mb-1">
                    Project Title
                  </p>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Select Projects"
                    className="w-full border-b-2 border-slate-200 focus:border-royal-700 focus:outline-none py-1 text-[14px] text-slate-700 placeholder:text-slate-400 bg-transparent"
                  />
                </div>
                {/* Developer Title */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold mb-1">
                    Developer Title
                  </p>
                  <input
                    type="text"
                    value={developerTitle}
                    onChange={(e) => setDeveloperTitle(e.target.value)}
                    placeholder="Select Developers"
                    className="w-full border-b-2 border-slate-200 focus:border-royal-700 focus:outline-none py-1 text-[14px] text-slate-700 placeholder:text-slate-400 bg-transparent"
                  />
                </div>
                {/* Marketed By toggle */}
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold">
                        Marketed By
                      </p>
                      <p className="text-[14px] font-bold text-royal-800 dark:text-royal-400 flex items-center gap-1 mt-0.5">
                        🏠 Royal Property Finder
                      </p>
                    </div>
                    <div className="w-10 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 pb-16 mt-16">
        {/* ── Browse by Category ─────────────────────────────────────────── */}
        <BrowseCategories
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* ── Discover New Projects ──────────────────────────────────────── */}
        <DiscoverProjects />

        {/* ── Browse by City ─────────────────────────────────────────────── */}
        <BrowseByCity />

        {/* ── Featured Listings ──────────────────────────────────────────── */}
        <FeaturedListings />

        {/* ── Featured Developers ────────────────────────────────────────── */}
        <FeaturedDevelopers />

        {/* ── Projects Grid ──────────────────────────────────────────────── */}
      </main>

      <Footer />
    </div>
  );
}
