import { useState, useRef, useEffect } from "react";
import { TrendingUp, MapPin, Loader2 } from "lucide-react";
import { featuredProjectsData as mockData } from "@/data/mock/featuredProjects";
import { CarouselArrow } from "@/components/common/CarouselArrow";
import apiClient from "@/lib/axios";

function formatPKR(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `${(price / 100000).toFixed(2)} Lakh`;
  return price.toLocaleString();
}

export function DiscoverProjects() {
  const [showProjectsRight, setShowProjectsRight] = useState(true);
  const [showProjectsLeft, setShowProjectsLeft] = useState(false);
  const projectsScrollRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response: any = await apiClient.get(
          "/listings?isRoyalProject=true",
        );
        const realProjects = (response?.data || []).map((p: any) => ({
          id: p._id,
          title: p.title,
          priceRange: `${p.currency} ${formatPKR(p.price)}`,
          location: `${p.city}, ${p.location}`,
          types: [p.subtype],
          areaRange: `${p.areaSize} ${p.areaUnit}`,
          isHot: true,
          image:
            p.images?.[0] ||
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        }));

        const combined = [...realProjects];
        mockData.forEach((m) => {
          if (!combined.find((p) => p.title === m.title)) {
            combined.push({ ...m, id: `mock-${m.id}` });
          }
        });

        setProjects(combined);
      } catch (error) {
        setProjects(mockData.map((m) => ({ ...m, id: `mock-${m.id}` })));
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const checkProjectsScroll = () => {
    if (projectsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        projectsScrollRef.current;
      setShowProjectsRight(scrollLeft + clientWidth < scrollWidth - 5);
      setShowProjectsLeft(scrollLeft > 0);
    }
  };

  useEffect(() => {
    checkProjectsScroll();
    window.addEventListener("resize", checkProjectsScroll);
    return () => window.removeEventListener("resize", checkProjectsScroll);
  }, [projects]);

  return (
    <section className="mb-16 pt-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Discover New Projects
        </h2>
        {loading && (
          <Loader2 size={18} className="animate-spin text-royal-600" />
        )}
      </div>

      <div className="relative">
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

        <div
          ref={projectsScrollRef}
          onScroll={checkProjectsScroll}
          className="flex gap-5 overflow-hidden pb-4 px-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative shrink-0 min-w-[340px] h-[440px] rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {project.isHot && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-royal-800 text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5" />
                  TRENDING
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-[20px] leading-tight mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-white/90 text-[13px] mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{project.location}</span>
                </div>
                <p className="text-white/75 text-[13px] mb-4 font-medium capitalize">
                  {project.types.join(", ")}
                </p>
                <span className="inline-block bg-white text-royal-800 text-[13px] font-bold px-4 py-2 rounded-full shadow-sm">
                  {project.priceRange.split(" to ")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>

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
