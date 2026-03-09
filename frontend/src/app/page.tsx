"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/features/home/hero/Hero";
import { BrowseProperties } from "@/components/features/home/BrowseProperties";
import { ExploreMore } from "@/components/features/home/ExploreMore";
import { FeaturedProperties } from "@/components/features/home/FeaturedProperties";
import { FeaturedProjects } from "@/components/features/home/FeaturedProjects";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-royal-800 selection:text-white text-slate-900 dark:text-slate-50">
      <Navbar />
      <main>
        <Hero />
        <FeaturedProperties />
        <BrowseProperties />
        <ExploreMore />
        <FeaturedProjects />
      </main>
      <Footer />
    </div>
  );
}
