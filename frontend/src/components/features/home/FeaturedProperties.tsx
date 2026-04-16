"use client";

import { Bed, Bath, Move, Heart, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { formatPrice } from "@/lib/utils";

export function FeaturedProperties() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response: any = await apiClient.get("/listings");
        setListings(response?.data || []);
      } catch (error) {
        setListings([]);
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const displayProperties = listings.slice(0, 3);

  if (!loading && displayProperties.length === 0) return null;

  return (
    <section className="py-12 relative z-0">
      <div className="container px-4 mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-[26px] font-bold text-slate-800 dark:text-white">
              Featured Properties
            </h2>
            <p className="text-slate-500 mt-2">
              Hand-picked luxury listings just for you
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden md:flex items-center text-[#023E8A] font-bold text-[15px] hover:text-[#023E8A]/80 cursor-pointer transition-colors"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((prop: any) => {
            const isRealListing = !!prop._id;
            const id = isRealListing ? prop._id : prop.id;
            const title = prop.title;
            const price = isRealListing
              ? formatPrice(prop.currency, prop.price)
              : prop.price;
            const location = isRealListing
              ? `${prop.location}, ${prop.city}`
              : prop.location;
            const beds = isRealListing
              ? parseInt(prop.bedrooms) || 0
              : prop.beds;
            const baths = isRealListing
              ? parseInt(prop.bathrooms) || 0
              : prop.baths;
            const area = isRealListing
              ? `${prop.areaSize} ${prop.areaUnit}`
              : prop.area;
            const type = isRealListing ? prop.subtype : prop.type;
            const status = isRealListing ? `For ${prop.purpose}` : prop.status;
            const image =
              isRealListing && prop.images?.length > 0
                ? prop.images[0]
                : // Fallback placeholder for newly created posts without images
                  prop.image ||
                  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80";

            return (
              <Link
                key={id}
                href={`/properties/${id}`}
                className="bg-transparent rounded-xl overflow-hidden transition-all cursor-pointer group flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="px-3 pt-3">
                  <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-xl">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#023E8A] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm uppercase tracking-wide">
                      {status}
                    </div>
                    <button className="absolute top-3 right-3 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm p-1.5 rounded-full transition-colors cursor-pointer">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="py-4 px-4 flex-1 flex flex-col">
                  {/* Price */}
                  <p className="text-[18px] md:text-[20px] font-extrabold text-slate-800 dark:text-white leading-tight mb-1">
                    {price}
                  </p>

                  {/* Title */}
                  <h3 className="text-[16px] font-bold text-slate-900 dark:text-white group-hover:text-[#023E8A] transition-colors line-clamp-1 mb-1">
                    {title}
                  </h3>

                  {/* Location */}
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 line-clamp-1 mb-4">
                    {location}
                  </p>

                  {/* Detail Icons */}
                  <div className="mt-auto flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    {beds > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Bed size={15} className="mt-0.5" />
                        <span className="text-[13px] font-medium leading-[18px]">
                          {beds}
                        </span>
                      </div>
                    )}
                    {baths > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Bath size={15} className="mt-0.5" />
                        <span className="text-[13px] font-medium leading-[18px]">
                          {baths}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap text-ellipsis ml-auto">
                      <Move size={15} className="shrink-0" />
                      <span className="text-[13px] font-medium truncate">
                        {area}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link href="/properties">
            <Button variant="outline" className="w-full">
              View All <ChevronRight className="w-4 h-4 ml-1 inline" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
