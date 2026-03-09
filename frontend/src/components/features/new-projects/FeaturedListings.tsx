import React, { useRef, useState, useEffect } from "react";
import { Share2, Home, Maximize2, Zap, Loader2 } from "lucide-react";
import { featuredProjectsData as mockData } from "@/data/mock/featuredProjects";
import Link from "next/link";
import { CarouselArrow } from "@/components/common/CarouselArrow";
import apiClient from "@/lib/axios";

function formatPKR(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString();
}

export function FeaturedListings() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
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

        setProjects(combined);
      } catch (error) {
        setProjects(mockData.map((m) => ({ ...m, id: `mock-${m.id}` })));
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [projects]);

  return (
    <section className="mb-16 pt-10">
      <div className="bg-linear-to-b from-[#023E8A]/5 via-[#023E8A]/2 to-transparent rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white">
              Projects by Royal Property Finder
            </h2>
            {loading && (
              <Loader2 size={18} className="animate-spin text-royal-600" />
            )}
          </div>
        </div>

        <div className="relative">
          {showLeft && (
            <CarouselArrow
              direction="left"
              onClick={() =>
                scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
              }
              className="absolute -left-[26px] top-[100px] md:top-[108px] -translate-y-1/2 z-10 hidden xl:flex"
            />
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-6 pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-transparent rounded-xl overflow-hidden transition-all cursor-pointer group flex flex-col h-full min-w-[300px] sm:min-w-[350px] snap-start"
              >
                <div className="px-3 pt-3">
                  <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-[#023E8A] hover:bg-white shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="py-4 px-3 flex-1 flex flex-col">
                  <p className="text-[15px] font-bold text-royal-700 dark:text-royal-400 leading-tight mb-1">
                    {project.priceRange}
                  </p>
                  <h3 className="text-[17px] font-bold text-slate-900 dark:text-white group-hover:text-[#023E8A] transition-colors line-clamp-1 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 mb-4 line-clamp-1">
                    {project.location}
                  </p>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
                      <Home size={16} className="mt-0.5 flex-none" />
                      <span className="text-[12px] font-medium leading-[18px] capitalize">
                        {project.types.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Maximize2 size={16} className="flex-none" />
                      <span className="text-[12px] font-medium">
                        {project.areaRange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showRight && (
            <CarouselArrow
              direction="right"
              onClick={() =>
                scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })
              }
              className="absolute -right-[26px] top-[100px] md:top-[108px] -translate-y-1/2 z-10 hidden xl:flex"
            />
          )}
        </div>
      </div>
    </section>
  );
}
