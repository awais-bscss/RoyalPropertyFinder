import React, { useRef, useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { ChevronRight, Home, Maximize2, Zap, Loader2 } from "lucide-react";
import { featuredProjectsData as mockData } from "@/data/mock/featuredProjects";
import Link from "next/link";
import { CarouselArrow } from "@/components/common/CarouselArrow";
import apiClient from "@/lib/axios";


export function FeaturedProjects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
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
          priceRange: formatPrice(p.currency, p.price),
          location: `${p.city}, ${p.location}`,
          types: [p.subtype],
          areaRange: `${p.areaSize} ${p.areaUnit}`,
          isHot: true,
          image:
            p.images?.[0] ||
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        }));

        // Merge real projects with mock data (mock at end, unique by title)
        const combined = [...realProjects];
        mockData.forEach((m) => {
          if (!combined.find((p) => p.title === m.title)) {
            combined.push({ ...m, id: `mock-${m.id}` });
          }
        });

        setProjects(combined);
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
        // Fallback strictly to mock data
        setProjects(mockData.map((m) => ({ ...m, id: `mock-${m.id}` })));
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [projects]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-950">
      <div className="container px-4 mx-auto">
        <div className="bg-linear-to-b from-[#023E8A]/5 via-[#023E8A]/2 to-transparent rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white">
                Royal Projects
              </h2>
              <div className="flex items-center gap-1.5 bg-[#Ef4444] text-white px-3 py-1 rounded-full text-[13px] font-bold">
                <Zap size={14} fill="currentColor" />
                Trending
              </div>
              {loading && (
                <Loader2 size={16} className="animate-spin text-royal-600" />
              )}
            </div>

            <Link
              href="/new-projects"
              className="flex items-center text-[#023E8A] font-bold text-[15px]"
            >
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="relative">
            {showLeftArrow && (
              <CarouselArrow
                direction="left"
                onClick={scrollLeft}
                className="absolute -left-[26px] top-[100px] md:top-[108px] -translate-y-1/2 z-10 hidden xl:flex"
              />
            )}

            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex overflow-x-auto gap-6 pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/properties/${project.id.startsWith('mock-') ? project.id.split('mock-')[1] : project.id}`}
                  className="bg-transparent rounded-xl overflow-hidden transition-all cursor-pointer group flex flex-col h-full min-w-[300px] sm:min-w-[350px] snap-start"
                >
                  <div className="px-3 pt-3">
                    <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {project.isHot && (
                        <div className="absolute top-3 left-3 bg-[#Ef4444] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-lg">
                          HOT
                        </div>
                      )}
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
                        <span className="text-[12px] font-medium leading-[18px]">
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
                </Link>
              ))}
            </div>

            {showRightArrow && (
              <CarouselArrow
                direction="right"
                onClick={scrollRight}
                className="absolute -right-[26px] top-[100px] md:top-[108px] -translate-y-1/2 z-10 hidden xl:flex"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
