"use client";
import { useRef, useState, useEffect } from "react";
import { MapPin, Phone, Smartphone } from "lucide-react";
import { CarouselArrow } from "@/components/common/CarouselArrow";

import { FEATURED_DEVELOPERS_DATA } from "@/data/mock/featuredDevelopers";

export function FeaturedDevelopers() {
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
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Featured Developers
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {showLeft && (
          <CarouselArrow
            direction="left"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
            }
            className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-10"
          />
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {FEATURED_DEVELOPERS_DATA.map((dev) => (
            <div
              key={dev.id}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#023E8A] dark:hover:border-[#023E8A] rounded-lg p-3 min-w-[280px] sm:min-w-[300px] h-[126px] shrink-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              {/* Logo Box */}
              <div className="w-[100px] h-[100px] bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden shrink-0">
                <img
                  src={dev.logo}
                  alt={dev.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Details */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <h3 className="font-bold text-[15px] text-slate-800 dark:text-white mb-1 truncate">
                  {dev.name}
                </h3>

                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <MapPin size={12} className="text-[#023E8A]" />
                  <span className="text-[12px]">{dev.location}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Phone size={12} className="text-[#023E8A]" />
                  <span className="text-[12px]">{dev.phone1}</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <Smartphone size={12} className="text-[#023E8A]" />
                  <span className="text-[12px]">{dev.phone2}</span>
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
              scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })
            }
            className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-10"
          />
        )}
      </div>
    </section>
  );
}
