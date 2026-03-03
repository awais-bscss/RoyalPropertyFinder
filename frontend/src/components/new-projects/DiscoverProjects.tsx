"use client";
import { useState, useRef, useEffect } from "react";
import { TrendingUp, MapPin } from "lucide-react";
import { featuredProjectsData } from "@/data/mock/featuredProjects";
import { CarouselArrow } from "@/components/common/CarouselArrow";

export function DiscoverProjects() {
  const [showProjectsRight, setShowProjectsRight] = useState(true);
  const [showProjectsLeft, setShowProjectsLeft] = useState(false);
  const projectsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkProjectsScroll();
    window.addEventListener("resize", checkProjectsScroll);
    return () => window.removeEventListener("resize", checkProjectsScroll);
  }, []);

  const checkProjectsScroll = () => {
    if (projectsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        projectsScrollRef.current;
      setShowProjectsRight(scrollLeft + clientWidth < scrollWidth - 5);
      setShowProjectsLeft(scrollLeft > 0);
    }
  };

  return (
    <section className="mb-16 pt-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
        Discover New Projects
      </h2>

      <div className="relative">
        {/* Left arrow */}
        {showProjectsLeft && (
          <CarouselArrow
            direction="left"
            onClick={() => {
              if (projectsScrollRef.current) {
                projectsScrollRef.current.scrollBy({
                  left: -350,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-10"
          />
        )}

        {/* Scrollable row */}
        <div
          ref={projectsScrollRef}
          onScroll={checkProjectsScroll}
          className="flex gap-5 overflow-hidden pb-4 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featuredProjectsData.map((project) => (
            <div
              key={project.id}
              className="relative shrink-0 min-w-[340px] h-[440px] rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Background image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* TRENDING badge */}
              {project.isHot && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-royal-800 text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  TRENDING
                </div>
              )}

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-[20px] leading-tight mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/90 text-[13px] mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{project.location}</span>
                </div>
                <p className="text-white/75 text-[13px] mb-4 font-medium">
                  {project.types.join(", ")}
                </p>
                <span className="inline-block bg-white text-royal-800 text-[13px] font-bold px-4 py-2 rounded-full shadow-sm">
                  {project.priceRange.split(" to ")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {showProjectsRight && (
          <CarouselArrow
            direction="right"
            onClick={() => {
              if (projectsScrollRef.current) {
                projectsScrollRef.current.scrollBy({
                  left: 350,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-10"
          />
        )}
      </div>
    </section>
  );
}
