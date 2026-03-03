"use client";

import { Bed, Bath, Move, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";

const PROPERTIES = [
  {
    id: 1,
    title: "Royal Residency Luxury Apartment",
    price: "PKR 4.5 Crore",
    location: "DHA Phase 6, Karachi",
    beds: 3,
    baths: 4,
    area: "2400 Sq. Ft",
    type: "Apartment",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Crystal Heights Villa",
    price: "PKR 12.5 Crore",
    location: "Bahria Town, Islamabad",
    beds: 5,
    baths: 6,
    area: "500 Sq. Yd",
    type: "House",
    status: "Featured",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "Golden Gate Commercial Plaza",
    price: "PKR 25 Crore",
    location: "Gulberg III, Lahore",
    beds: 0,
    baths: 2,
    area: "10 Marla",
    type: "Commercial",
    status: "Hot Deal",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
  },
];

export function FeaturedProperties() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response: any = await apiClient.get("/listings");
        setListings(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Use real listings if we have them, otherwise use the placeholders
  const displayProperties =
    listings.length > 0 ? listings.slice(0, 3) : PROPERTIES;

  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Featured Properties
            </h2>
            <p className="text-slate-500 mt-2">
              Hand-picked luxury listings just for you
            </p>
          </div>
          <Button
            variant="link"
            className="text-royal-800 font-bold hidden md:block"
          >
            View All Properties →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((prop: any) => {
            const isRealListing = !!prop._id;
            const id = isRealListing ? prop._id : prop.id;
            const title = prop.title;
            const price = isRealListing
              ? `${prop.currency || "PKR"} ${prop.price}`
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
              <Card
                key={id}
                className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-slate-50 dark:bg-slate-900"
              >
                <CardHeader className="p-0 relative h-64 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-4 left-4 bg-royal-800">
                    {status}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white hover:text-red-500"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl group-hover:text-royal-800 transition-colors line-clamp-1">
                      {title}
                    </h3>
                  </div>
                  <p className="text-royal-900 dark:text-royal-400 font-extrabold text-2xl mb-4">
                    {price}
                  </p>
                  <p className="text-slate-500 text-sm mb-6 flex items-center line-clamp-1">
                    <span className="inline-block w-4 h-4 mr-2 bg-royal-400 rounded-full shrink-0" />{" "}
                    {location}
                  </p>

                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-200 dark:border-slate-800">
                    {beds > 0 && (
                      <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                        <Bed className="h-4 w-4 mr-2 text-royal-700" /> {beds}
                      </div>
                    )}
                    {baths > 0 && (
                      <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                        <Bath className="h-4 w-4 mr-2 text-royal-700" /> {baths}
                      </div>
                    )}
                    <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm col-span-1 overflow-hidden whitespace-nowrap text-ellipsis">
                      <Move className="h-4 w-4 mr-2 shrink-0 text-royal-700" />{" "}
                      <span className="truncate">{area}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-slate-900 dark:bg-royal-800 hover:bg-royal-700">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" className="w-full">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
}
