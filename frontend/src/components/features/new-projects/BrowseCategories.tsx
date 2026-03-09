"use client";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/data/mock/categories";
import { CarouselArrow } from "@/components/common/CarouselArrow";

interface BrowseCategoriesProps {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export function BrowseCategories({
  activeCategory,
  setActiveCategory,
}: BrowseCategoriesProps) {
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
      setShowLeftArrow(scrollLeft > 0);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
        Browse Projects by Category
      </h2>

      <div className="relative">
        {/* Left scroll arrow */}
        {showLeftArrow && (
          <CarouselArrow
            direction="left"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
              }
            }}
            className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-10"
          />
        )}

        {/* Scrollable row */}
        <div
          id="cat-scroll"
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-hidden pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(isActive ? null : cat.label)}
                style={
                  {
                    "--cat-color": cat.color,
                    "--cat-bg": cat.bg,
                  } as React.CSSProperties
                }
                className={`flex items-center gap-4 px-6 py-5 min-w-[250px] rounded-md border transition-all duration-200 shrink-0 group cursor-pointer ${
                  isActive
                    ? "border-(--cat-color) bg-(--cat-bg)"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-(--cat-color) hover:shadow-md"
                }`}
              >
                {/* Colored icon box */}
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 border-2 border-transparent ${
                    isActive
                      ? "bg-white dark:bg-slate-800"
                      : "group-hover:border-(--cat-color)"
                  }`}
                  style={{ backgroundColor: isActive ? "#ffffff" : cat.bg }}
                >
                  <Icon
                    className="w-7 h-7 transition-colors duration-200"
                    style={{ color: cat.color }}
                  />
                </div>
                {/* Title + count */}
                <div className="text-left">
                  <p
                    className={`text-lg font-bold whitespace-nowrap ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {cat.label}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5 font-medium">
                    {cat.count.toLocaleString()} Projects
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right scroll arrow */}
        {showRightArrow && (
          <CarouselArrow
            direction="right"
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
              }
            }}
            className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-10"
          />
        )}
      </div>
    </section>
  );
}
