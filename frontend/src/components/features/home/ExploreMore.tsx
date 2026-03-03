"use client";

import React from "react";
import { exploreMoreData } from "@/data/mock/exploreMore";
import Link from "next/link";

export function ExploreMore() {
  return (
    <section className="py-12 bg-white dark:bg-slate-950">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white mb-10">
          Explore more on Royal Property Finder
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {exploreMoreData.map((item, idx) => {
            const content = (
              <div
                className="flex items-start gap-5 group cursor-pointer"
                style={{ "--hover-color": item.color } as React.CSSProperties}
              >
                {/* Icon Container */}
                <div
                  className="flex-none w-23 h-23 rounded-lg flex items-center justify-center transition-all group-hover:scale-105 border border-transparent group-hover:border-[var(--hover-color)]"
                  style={{
                    backgroundColor: item.bg,
                  }}
                >
                  <item.icon
                    size={44}
                    strokeWidth={1.5}
                    style={{ color: item.color }}
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col pt-0.5">
                  <h3 className="text-[17px] font-bold text-slate-800 dark:text-white leading-tight transition-colors group-hover:text-[var(--hover-color)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );

            if (item.title === "New Projects") {
              return (
                <Link key={idx} href="/new-projects">
                  {content}
                </Link>
              );
            }

            return <div key={idx}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
