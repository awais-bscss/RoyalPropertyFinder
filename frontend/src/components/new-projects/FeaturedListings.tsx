"use client";
import { useRef, useState, useEffect } from "react";
import { Share2, Home, Maximize2, Zap } from "lucide-react";
import { featuredProjectsData } from "@/data/mock/featuredProjects";
import Link from "next/link";
import { CarouselArrow } from "@/components/common/CarouselArrow";

export function FeaturedListings() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

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
  }, []);

  return (
    <section className="mb-16 pt-10">
      {/* Same gradient wrapper as FeaturedProjects on homepage */}
      <div className="bg-linear-to-b from-[#023E8A]/5 via-[#023E8A]/2 to-transparent rounded-3xl p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white">
              Projects by Royal Property Finder
            </h2>
          </div>
        </div>

        {/* Scrollable carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeft && (
            <CarouselArrow
              direction="left"
              onClick={() =>
                scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
              }
              className="absolute -left-[26px] top-[100px] md:top-[108px] -translate-y-1/2 z-10 hidden xl:flex"
            />
          )}

          {/* Cards Row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-6 pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featuredProjectsData.map((project) => (
              <div
                key={project.id}
                className="bg-transparent rounded-xl overflow-hidden transition-all cursor-pointer group flex flex-col h-full min-w-[300px] sm:min-w-[350px] snap-start"
              >
                {/* Image Section — same as FeaturedProjects with share button added */}
                <div className="px-3 pt-3">
                  <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-xl">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Share button — always visible, icon turns blue on hover */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-[#023E8A] hover:bg-white shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Content Section — identical to FeaturedProjects */}
                <div className="py-4 px-3 flex-1 flex flex-col">
                  {/* Price */}
                  <p className="text-[15px] font-bold text-slate-800 dark:text-white leading-tight mb-1">
                    {project.priceRange}
                  </p>

                  {/* Title */}
                  <h3 className="text-[17px] font-bold text-slate-900 dark:text-white group-hover:text-[#023E8A] transition-colors line-clamp-1 mb-1">
                    {project.title}
                  </h3>

                  {/* Location */}
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 mb-4 line-clamp-1">
                    {project.location}
                  </p>

                  {/* Detail Icons */}
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
              </div>
            ))}
          </div>

          {/* Right Arrow */}
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
