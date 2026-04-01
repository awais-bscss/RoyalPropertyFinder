"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Bed, 
  Bath, 
  Move, 
  MapPin, 
  Phone, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  X,
  Share2, 
  Heart,
  Image as ImageIcon,
  Video,
  Map as MapIcon,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Wifi,
  Shield,
  Car,
  Zap,
  Droplets,
  Wind,
  Trash2,
  Users,
  Trees,
  School,
  HeartPlus,
  PlayCircle,
  Building,
  Monitor,
  Camera
} from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PropertyDisplayMap = dynamic(() => import("@/components/features/properties/PropertyDisplayMap"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Map...</div>
});


export default function PropertyDetailsPage() {
  const params = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const openGallery = (index: number) => {
    setCurrentImgIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "auto";
  };



  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response: any = await apiClient.get(`/listings/${params.id}`);
        setListing(response?.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#023E8A] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Property Not Found</h1>
          <p className="text-slate-500 mb-8">The property you are looking for might have been removed or is no longer available.</p>
          <Link href="/properties">
            <Button className="bg-[#023E8A] hover:bg-[#03045E]">Back to Search</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      {/* Breadcrumb & Quick Actions */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-[13px] text-slate-500">
            <Link href="/" className="hover:text-[#023E8A]">Home</Link>
            <ChevronRight size={14} />
            <Link href="/properties" className="hover:text-[#023E8A]">Properties</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-[200px]">{listing.title}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 text-[13px] font-semibold border-slate-200">
              <Share2 size={16} /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-[13px] font-semibold border-slate-200">
              <Heart size={16} /> Save
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#023E8A] text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                For {listing.purpose}
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                {listing.subtype}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
              {listing.title}
            </h1>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <MapPin size={18} className="text-[#023E8A]" />
              <span className="text-[15px]">{listing.location}, {listing.city}</span>
            </div>
          </div>
          <div className="text-left md:text-right shrink-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Asking Price</p>
            <p className="text-3xl md:text-4xl font-black text-[#023E8A] dark:text-[#48CAE4]">
              {formatPrice(listing.currency, listing.price)}
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-3 h-[300px] md:h-[450px] mb-10 rounded-md overflow-hidden">
          <div 
            onClick={() => openGallery(0)}
            className="md:col-span-3 row-span-3 relative group cursor-pointer overflow-hidden rounded-l-md bg-slate-100"
          >
            <img 
              src={listing.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          
          <div 
            onClick={() => openGallery(1)}
            className="hidden md:block relative group cursor-pointer overflow-hidden rounded-tr-md"
          >
            <img 
              src={listing.images?.[1] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div 
            onClick={() => openGallery(2)}
            className="hidden md:block relative group cursor-pointer overflow-hidden"
          >
            <img 
              src={listing.images?.[2] || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div 
            onClick={() => openGallery(3)}
            className="hidden md:block relative group cursor-pointer overflow-hidden rounded-br-md"
          >
            <img 
              src={listing.images?.[3] || "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=600&q=80"}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-black/10" />
            
            {/* Gallery and Map badges horizontally on last small image */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); openGallery(0); }}
                  className="bg-white/95 backdrop-blur-sm border border-slate-200 px-2 py-1.5 rounded-md flex items-center gap-1.5 text-[10px] font-black text-slate-900 hover:bg-white transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                   <Camera size={13} className="text-[#03045E]" /> {listing.images?.length || 1}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); scrollToMap(); }}
                  className="bg-white/95 backdrop-blur-sm border border-slate-200 px-2 py-1.5 rounded-md flex items-center gap-1.5 text-[10px] font-black text-slate-900 hover:bg-white transition-all cursor-pointer shadow-sm"
                >
                  <MapPin size={13} className="text-[#03045E]" /> Map
                </button>
            </div>

            {listing.images?.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                <span className="text-white text-lg font-black">+{listing.images.length - 3} More</span>
              </div>
            )}
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Details Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-[#023E8A]">
                   <Bed size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Bedrooms</p>
                  <p className="text-[16px] font-black">{listing.bedrooms || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-[#023E8A]">
                   <Bath size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Bathrooms</p>
                  <p className="text-[16px] font-black">{listing.bathrooms || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-4">
                <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-[#023E8A]">
                   <Move size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Area Size</p>
                  <p className="text-[16px] font-black">{listing.areaSize} {listing.areaUnit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-4">
                <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center text-[#023E8A]">
                   <Calendar size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Added On</p>
                  <p className="text-[15px] font-bold">{new Date(listing.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

              {/* Description */}
              <div className="space-y-4">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   About this property
                 </h3>
                 <div className={`prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-lg leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-4' : ''}`}>
                   {listing.description}
                 </div>
                 {listing.description && listing.description.length > 300 && (
                   <button 
                     onClick={() => setIsExpanded(!isExpanded)}
                     className="flex items-center gap-1 text-[#023E8A] dark:text-[#48CAE4] font-bold text-sm uppercase tracking-wider hover:underline mt-2 transition-all"
                   >
                     {isExpanded ? (
                       <>Show Less <ChevronRight size={16} className="-rotate-90" /></>
                     ) : (
                       <>Show More <ChevronRight size={16} className="rotate-90" /></>
                     )}
                   </button>
                 )}

              </div>


            {/* Property Summary (Zameen Style Overview Table) */}
            <div className="space-y-6">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Property Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {[
                    { label: "Price", value: formatPrice(listing.currency, listing.price) },
                    { label: "Type", value: listing.subtype },
                    { label: "Location", value: listing.location },
                    { label: "Bath(s)", value: listing.bathrooms || "-" },
                    { label: "City", value: listing.city },
                    { label: "Bedroom(s)", value: listing.bedrooms || "-" },
                    { label: "Province", value: listing.province },
                    { label: "Area Size", value: `${listing.areaSize} ${listing.areaUnit}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-medium">{item.label}</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold">{item.value}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* Amenities & Features (Zameen Style) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Amenities</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    {(() => {
                        const allCategories = [
                            {
                                title: "Main Features",
                                items: [
                                    { label: "Electricity (WAPDA/KESC)", key: "Electricity (WAPDA / KESC)", icon: <Zap size={18} strokeWidth={1.5} /> },
                                    { label: "Gas (Sui Gas)", key: "Gas (Sui Gas)", icon: <Droplets size={18} strokeWidth={1.5} /> },
                                    { label: "Water Supply", key: "Water Supply", icon: <Droplets size={18} strokeWidth={1.5} /> },
                                    { label: "Central Air Conditioning", key: "Central Air Conditioning", icon: <Wind size={18} strokeWidth={1.5} /> },
                                    { label: "Generator", key: "Generator", icon: <Zap size={18} strokeWidth={1.5} /> },
                                    { label: "Solar Panels", key: "Solar Panels", icon: <Zap size={18} strokeWidth={1.5} /> },
                                    { label: "Waste Disposal", key: "Waste Disposal", icon: <Trash2 size={18} strokeWidth={1.5} /> },
                                    { label: "Elevator / Lift", key: "Elevator / Lift", icon: <Move size={18} strokeWidth={1.5} /> },
                                    { label: "Parking Space", key: "Parking Space", icon: <Car size={18} strokeWidth={1.5} /> },
                                ]
                            },
                            {
                                title: "Rooms",
                                items: [
                                    { label: `Bedrooms: ${listing.bedrooms || "-"}`, key: "bedrooms", icon: <Bed size={18} strokeWidth={1.5} />, isField: !!listing.bedrooms },
                                    { label: `Bathrooms: ${listing.bathrooms || "-"}`, key: "bathrooms", icon: <Bath size={18} strokeWidth={1.5} />, isField: !!listing.bathrooms },
                                    { label: "Servant Quarters", key: "Servant Quarters", icon: <Users size={18} strokeWidth={1.5} /> },
                                ]
                            },
                            {
                                title: "Business and Communication",
                                items: [
                                    { label: "Internet / Broadband", key: "Internet / Broadband", icon: <Wifi size={18} strokeWidth={1.5} /> },
                                    { label: "Intercom", key: "Intercom", icon: <Phone size={18} strokeWidth={1.5} /> },
                                ]
                            },
                            {
                                title: "Community Features",
                                items: [
                                    { label: "Swimming Pool", key: "Swimming Pool", icon: <Droplets size={18} strokeWidth={1.5} /> },
                                    { label: "Gymnasium", key: "Gymnasium", icon: <Move size={18} strokeWidth={1.5} /> },
                                    { label: "Mosque / Prayer Area", key: "Mosque / Prayer Area", icon: <Building size={18} strokeWidth={1.5} /> },
                                    { label: "Community Garden", key: "Community Garden", icon: <Trees size={18} strokeWidth={1.5} /> },
                                    { label: "Kids Play Area", key: "Kids Play Area", icon: <Users size={18} strokeWidth={1.5} /> },
                                ]
                            },
                            {
                                title: "Health Care & Maintenance",
                                items: [
                                    { label: "Maintenance Staff", key: "Maintenance Staff", icon: <Users size={18} strokeWidth={1.5} /> },
                                    { label: "Security Guard", key: "Security Guard", icon: <Shield size={18} strokeWidth={1.5} /> },
                                    { label: "CCTV", key: "CCTV", icon: <Video size={18} strokeWidth={1.5} /> },
                                ]
                            }
                        ];

                        const activeCategories = allCategories
                          .map(cat => ({
                            ...cat,
                            activeItems: cat.items.filter(item => 
                                item.isField || (listing.selectedAmenities && listing.selectedAmenities.some((a: any) => 
                                    typeof a === 'string' && a.toLowerCase().includes(item.key.toLowerCase())
                                ))
                            )
                          }))
                          .filter(cat => cat.activeItems.length > 0);

                        if (activeCategories.length === 0) {
                            return (
                                <div className="p-10 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No specific amenities listed for this property</p>
                                </div>
                            );
                        }

                        const displayedCategories = isAmenitiesExpanded ? activeCategories : activeCategories.slice(0, 3);

                        return (
                            <>
                                {displayedCategories.map((category, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row border-b last:border-b-0 border-slate-100 dark:border-slate-800">
                                        {/* Left Category Label */}
                                        <div className="w-full md:w-48 p-4 md:p-6 bg-slate-50/30 dark:bg-slate-800/20 md:border-r border-slate-100 dark:border-slate-800 flex items-center md:items-start shrink-0">
                                            <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-widest leading-tight md:mt-1">
                                                {category.title}
                                            </span>
                                        </div>
                                        {/* Right Items Grid */}
                                        <div className="flex-1 p-4 md:p-6 md:pl-10">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
                                                {category.activeItems.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 group">
                                                        <div className="text-slate-900 dark:text-white shrink-0">
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-[14px] text-slate-700 dark:text-slate-200 font-bold">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {activeCategories.length > 3 && (
                                    <div className="p-4 px-6 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex justify-start">
                                        <button 
                                            onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                                            className="flex items-center gap-2 text-[#023E8A] dark:text-[#48CAE4] font-black text-xs uppercase tracking-widest hover:underline transition-all"
                                        >
                                            {isAmenitiesExpanded ? (
                                                <>Show Less <ChevronRight size={16} className="-rotate-90" /></>
                                            ) : (
                                                <>Show All {activeCategories.length} Categories <ChevronRight size={16} className="rotate-90" /></>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>


            {/* Map Location */}
            <div ref={mapRef} className="space-y-6">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <MapPin className="text-[#023E8A]" /> Property Location
               </h3>
               <PropertyDisplayMap 
                 lat={listing.lat} 
                 lng={listing.lng} 
                 title={listing.title} 
                 location={listing.location} 
               />
               <p className="text-sm text-slate-500 font-medium bg-slate-50 dark:bg-slate-900/50 p-3 rounded border border-slate-100 dark:border-slate-800">
                 The property is located at <span className="font-bold text-slate-700 dark:text-slate-300">{listing.location}, {listing.city}</span>.
               </p>
            </div>

          </div>


          {/* Sidebar Inquiry Card (Right) */}
          <div className="lg:col-span-1">
             <div className="sticky top-10 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                   <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#023E8A]/10 flex items-center justify-center font-black text-[#023E8A] text-xl overflow-hidden shrink-0">
                         {listing.user?.profilePic ? (
                           <img src={listing.user.profilePic} alt="" className="w-full h-full object-cover" />
                         ) : (
                           listing.user?.name?.[0] || "A"
                         )}
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Listed By</p>
                         <h4 className="font-extrabold text-[#023E8A] dark:text-[#48CAE4] text-lg">{listing.user?.name || "Premium Agent"}</h4>
                         <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 w-fit mt-1 border border-emerald-100 uppercase tracking-tight">
                            <CheckCircle2 size={10} /> Verified User
                         </span>
                      </div>
                   </div>
                   
                   <div className="p-6 space-y-4">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 gap-2 text-[15px]">
                         <Phone size={18} /> CALL AGENT
                      </Button>
                      <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-black h-12 gap-2 text-[15px]">
                         WHATSAPP
                      </Button>
                      
                      <div className="relative py-4">
                         <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100 dark:border-slate-800"></span></div>
                         <div className="relative flex justify-center text-[11px] uppercase font-bold"><span className="bg-white dark:bg-slate-900 px-2 text-slate-400 tracking-widest">Or Inquiry Form</span></div>
                      </div>

                      <div className="space-y-3">
                         <Input placeholder="Your Name" className="h-11 bg-slate-50 border-transparent focus:bg-white transition-all shadow-none" />
                         <Input placeholder="Email Address" className="h-11 bg-slate-50 border-transparent focus:bg-white transition-all shadow-none" />
                         <Input placeholder="Phone Number" className="h-11 bg-slate-50 border-transparent focus:bg-white transition-all shadow-none" />
                         <Button className="w-full bg-[#023E8A] hover:bg-[#03045E] text-white font-black h-12 text-[15px] uppercase tracking-wide">
                            Request Call Back
                         </Button>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-4">
                        By submitting this form, you agree to our <Link href="/terms" className="text-[#023E8A] underline">Terms of Use</Link> and <Link href="/privacy" className="text-[#023E8A] underline">Privacy Policy</Link>.
                      </p>
                   </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-white overflow-hidden relative group cursor-pointer">
                   <div className="relative z-10">
                      <h4 className="font-black text-xl mb-2 flex items-center gap-2">
                        <Clock className="text-[#48CAE4]" /> Avoid Fraud
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">
                        Never pay advance for inspection. Report any suspicious agent immediately to our support team.
                      </p>
                      <button className="text-[#48CAE4] font-bold text-sm uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                        Safety Tips <ChevronRight size={16} />
                      </button>
                   </div>
                   <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#48CAE4]/10 rounded-full blur-2xl group-hover:bg-[#48CAE4]/20 transition-all"></div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Fullscreen Photo Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 md:p-6 text-white bg-black/50 backdrop-blur-md">
            <div className="flex flex-col">
              <h2 className="font-bold text-lg leading-tight">{listing.title}</h2>
              <p className="text-sm text-slate-400">{listing.location}, {listing.city}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold">
                {currentImgIndex + 1} / {listing.images?.length || 1}
              </span>
              <button 
                onClick={closeGallery}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative flex flex-col items-center justify-center p-4 md:p-8">
            <button 
              onClick={() => setCurrentImgIndex((prev) => (prev > 0 ? prev - 1 : (listing.images?.length || 1) - 1))}
              className="absolute left-4 md:left-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-all z-10 backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft size={32} />
            </button>
 
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img 
                src={listing.images?.[currentImgIndex] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"}
                alt=""
                className="max-w-full max-h-full object-contain transition-all duration-300 pointer-events-none"
              />
            </div>
 
            <button 
              onClick={() => setCurrentImgIndex((prev) => (prev < (listing.images?.length || 1) - 1 ? prev + 1 : 0))}
              className="absolute right-4 md:right-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-all z-10 backdrop-blur-sm border border-white/10"
            >
              <ChevronRight size={32} />
            </button>
          </div>


          <div className="p-2 md:p-3 bg-black/50 backdrop-blur-md overflow-x-auto">
            <div className="flex gap-4 items-center justify-center min-w-max px-4">
              {listing.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIndex(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    currentImgIndex === idx ? "border-[#48CAE4] scale-110" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
