"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-royal-800 selection:text-white text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
            Our Agents
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
            Find the best real estate agents to help you buy, sell, or rent your
            property.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for agent cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center p-6 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mb-4 animate-pulse" />
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              More customized agent listings coming soon!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
