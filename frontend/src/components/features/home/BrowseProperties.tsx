"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { browsePropertiesData } from "@/data/mock/browseProperties";
import { useSearchParams } from "next/navigation";

export function BrowseProperties() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const filteredData = browsePropertiesData.filter((cat) => {
    if (currentTab === "rent") {
      return cat.title === "Homes" || cat.title === "Commercial";
    }
    return true;
  });

  return (
    <section className="py-12 bg-white dark:bg-slate-950">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white mb-8">
          Browse Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredData.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-3.5 flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                  }}
                >
                  <cat.icon size={22} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {cat.title}
                </h3>
              </div>

              <Tabs
                defaultValue="popular"
                className="w-full flex-1 flex flex-col"
              >
                <TabsList className="bg-transparent border-b border-slate-100 dark:border-slate-800 w-full justify-start rounded-none h-auto p-0 px-3.5 gap-4">
                  {cat.tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="rounded-none border-0 data-[state=active]:border-b data-[state=active]:border-[#023E8A] data-[state=active]:text-[#023E8A] bg-transparent! shadow-none! px-0 py-3 text-[16px] font-bold transition-all data-[state=active]:-mb-px z-10 flex-none cursor-pointer"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(cat.items).map(([key, items]) => (
                  <TabsContent
                    key={key}
                    value={key}
                    className="p-3.5 mt-0 flex-1 relative group"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {items.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-center p-1.5 text-center border border-slate-100 dark:border-slate-800 rounded-lg hover:border-[#023E8A]/30 hover:bg-[#023E8A]/5 dark:hover:bg-[#023E8A]/20 transition-all cursor-pointer group/item min-h-[60px]"
                        >
                          <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {item.label}
                          </span>
                          <span className="text-[12px] text-slate-400 mt-1 uppercase tracking-tight font-medium">
                            {item.sub}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrow (Right) */}
                    <button className="absolute -right-2 top-[45%] -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-[#023E8A] opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                      <ChevronRight size={18} />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-1.5 mt-5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#023E8A]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
