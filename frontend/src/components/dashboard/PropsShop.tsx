"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  setCartOpen as setCartOpenAction,
  applyPromo as applyPromoAction,
} from "@/store/slices/cartSlice";
import {
  ShoppingBag,
  Zap,
  Camera,
  Box,
  PenLine,
  Share2,
  LayoutList,
  Star,
  TrendingUp,
  Package,
  PlusSquare,
  ShoppingCart,
  X,
  ChevronRight,
  BadgeCheck,
  Flame,
  Sparkles,
  Search,
  ArrowUpRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  icon: any;
  iconBg: string;
  iconColor: string;
  badge: "Popular" | "Hot" | "New" | "Best Value" | null;
  category: string;
  rating: number;
  reviews: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const products: Product[] = [
  {
    id: 1,
    name: "Featured Listing Boost",
    desc: "30-day premium placement on top of search results for maximum visibility.",
    price: 5500,
    icon: Zap,
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-500 dark:text-rose-400",
    badge: "Hot",
    category: "Visibility",
    rating: 4.9,
    reviews: 218,
  },
  {
    id: 2,
    name: "Professional Photography",
    desc: "High-quality DSLR photo shoot for your property — delivered in 48hrs.",
    price: 12000,
    icon: Camera,
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-500 dark:text-amber-400",
    badge: "Popular",
    category: "Media",
    rating: 4.8,
    reviews: 145,
  },
  {
    id: 3,
    name: "3D Virtual Tour",
    desc: "Immersive 3D walkthrough that lets buyers explore remotely from anywhere.",
    price: 25000,
    icon: Box,
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-500 dark:text-violet-400",
    badge: "New",
    category: "Media",
    rating: 4.7,
    reviews: 62,
  },
  {
    id: 4,
    name: "Floor Plan Design",
    desc: "Professional 2D/3D floor plan blueprints drawn by certified architects.",
    price: 8000,
    icon: PenLine,
    iconBg: "bg-sky-50 dark:bg-sky-500/10",
    iconColor: "text-sky-500 dark:text-sky-400",
    badge: null,
    category: "Design",
    rating: 4.6,
    reviews: 87,
  },
  {
    id: 5,
    name: "Social Media Promotion",
    desc: "7-day targeted social campaign across Instagram, Facebook & TikTok.",
    price: 18000,
    icon: Share2,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    badge: "Best Value",
    category: "Marketing",
    rating: 4.5,
    reviews: 110,
  },
  {
    id: 6,
    name: "SEO Listing Copywriting",
    desc: "Persuasive SEO-optimised listing description written by expert copywriters.",
    price: 3500,
    icon: LayoutList,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    badge: null,
    category: "Marketing",
    rating: 4.4,
    reviews: 73,
  },
];

const categories = ["All", "Visibility", "Media", "Design", "Marketing"];

const badgeConfig: Record<string, { cls: string; icon: any }> = {
  Hot: {
    cls: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    icon: Flame,
  },
  Popular: {
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    icon: TrendingUp,
  },
  New: {
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    icon: Sparkles,
  },
  "Best Value": {
    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    icon: BadgeCheck,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export function PropsShop() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const cart = useSelector((state: RootState) => state.cart.items);
  const cartOpen = useSelector((state: RootState) => state.cart.isOpen);
  const [bundleModalOpen, setBundleModalOpen] = useState(false);

  // Sync body scroll with cart state - more aggressive lock
  useEffect(() => {
    const elements = [document.body, document.documentElement];
    if (cartOpen || bundleModalOpen) {
      elements.forEach((el) => {
        el.style.overflow = "hidden";
        el.style.height = "100%";
      });
    } else {
      elements.forEach((el) => {
        el.style.overflow = "";
        el.style.height = "";
      });
    }
    return () => {
      elements.forEach((el) => {
        el.style.overflow = "";
        el.style.height = "";
      });
    };
  }, [cartOpen, bundleModalOpen]);

  const bundleItems = [
    products.find((p) => p.id === 1), // Featured Boost
    products.find((p) => p.id === 2), // Photography
    products.find((p) => p.id === 5), // Social Promotion
  ].filter(Boolean) as Product[];

  const addBundleToCart = () => {
    bundleItems.forEach((item) => addToCart(item));
    dispatch(applyPromoAction({ code: "ROYAL30", rate: 0.3 }));
    setBundleModalOpen(false);
    setCartOpen(true);
  };

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    dispatch(
      addToCartAction({
        id: product.id,
        name: product.name,
        desc: product.desc,
        price: product.price,
        category: product.category,
      }),
    );
  };

  const removeFromCart = (id: number) => {
    dispatch(removeFromCartAction(id));
  };

  const setCartOpen = (open: boolean) => {
    dispatch(setCartOpenAction(open));
  };

  const cartTotal = cart.reduce((s, p) => s + p.price, 0);
  const inCart = (id: number) => !!cart.find((c) => c.id === id);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const summaryCards = [
    {
      label: "Total Services",
      value: products.length,
      icon: ShoppingBag,
      iconBg: "bg-royal-600",
    },
    {
      label: "Media Services",
      value: products.filter((p) => p.category === "Media").length,
      icon: Camera,
      iconBg: "bg-amber-500",
    },
    {
      label: "Marketing Tools",
      value: products.filter((p) => p.category === "Marketing").length,
      icon: TrendingUp,
      iconBg: "bg-emerald-600",
    },
    {
      label: "In Cart",
      value: cart.length,
      icon: ShoppingCart,
      iconBg: "bg-violet-600",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Summary Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center text-white bg-linear-to-r ${c.iconBg} shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[22px] font-bold text-slate-800 dark:text-white leading-none">
                  {c.value}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Featured Banner ───────────────────────────────────────── */}
      <div className="rounded-sm border border-slate-200 dark:border-slate-700 bg-linear-to-r from-royal-700 via-royal-800 to-slate-800 p-5 text-white overflow-hidden relative">
        <div className="pointer-events-none absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-royal-200 text-[10px] font-bold uppercase tracking-widest mb-1">
              Limited Offer
            </p>
            <h2 className="text-lg font-bold tracking-tight">
              Bundle & Save Up to 30%
            </h2>
            <p className="text-royal-200/70 text-[12.5px] mt-1 max-w-sm">
              Combine Photography + Featured Boost + Social Promotion and get
              exclusive bundle pricing for your listings.
            </p>
          </div>
          <button
            onClick={() => setBundleModalOpen(true)}
            className="shrink-0 flex items-center gap-1.5 bg-white text-royal-800 font-bold text-[12.5px] px-4 py-2.5 rounded-sm hover:bg-royal-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            View Bundle <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
          {/* Title */}
          <div className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="w-4 h-4 text-royal-600 dark:text-royal-400" />
            <p className="font-semibold text-slate-800 dark:text-white text-sm">
              All Services
            </p>
            <span className="text-[10px] font-bold bg-royal-600 text-white px-1.5 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>

          {/* Right: search + cart */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-8 pr-3 py-2 text-[12.5px] border border-slate-200 dark:border-slate-700 rounded-sm bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-royal-400 transition-colors"
              />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[12px] font-semibold px-3 py-2 rounded-sm transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1 px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                category === cat
                  ? "bg-royal-600 text-white"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Products Grid ─────────────────────────────────────────── */}
        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package className="w-10 h-10 opacity-20 mb-3" />
              <p className="text-sm font-medium">No services found</p>
              <p className="text-[12px] mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((product) => {
                const Icon = product.icon;
                const added = inCart(product.id);
                const badge = product.badge ? badgeConfig[product.badge] : null;
                const BadgeIcon = badge?.icon;
                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col hover:border-royal-300 dark:hover:border-royal-500/40 transition-colors"
                  >
                    {/* Top row: icon + badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 ${product.iconBg}`}
                      >
                        <Icon className={`w-5 h-5 ${product.iconColor}`} />
                      </div>
                      {badge && BadgeIcon && (
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm border ${badge.cls}`}
                        >
                          <BadgeIcon className="w-2.5 h-2.5" />
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Name + desc */}
                    <p className="font-semibold text-slate-800 dark:text-white text-[13.5px] leading-snug mb-1">
                      {product.name}
                    </p>
                    <p className="text-[11.5px] text-slate-400 leading-relaxed flex-1 mb-3">
                      {product.desc}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {product.rating}
                      </span>
                      <span className="text-[10.5px] text-slate-400">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[15px] font-bold text-royal-700 dark:text-royal-400">
                        PKR {product.price.toLocaleString()}
                      </p>
                      <button
                        onClick={() =>
                          added ? setCartOpen(true) : addToCart(product)
                        }
                        className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
                          added
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                            : "bg-royal-600 hover:bg-royal-700 text-white"
                        }`}
                      >
                        {added ? (
                          <>
                            <ShoppingCart className="w-3 h-3" /> In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Bundle Offer Modal ────────────────────────────────────── */}
      {bundleModalOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden h-screen w-screen"
            style={{ height: "100dvh" }}
            onClick={() => setBundleModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-sm border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200 custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-linear-to-r from-royal-700 to-royal-900 p-6 text-white relative">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setBundleModalOpen(false)}
                    className="p-1.5 rounded-sm hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-royal-200 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
                  Limited Time Exclusive
                </p>
                <h3 className="text-xl font-black tracking-tight">
                  Premium Growth Bundle
                </h3>
                <p className="text-royal-100/70 text-[13px] mt-2 leading-relaxed">
                  The ultimate toolkit to get your property noticed by thousands
                  of potential buyers in hours.
                </p>
              </div>

              {/* Items List */}
              <div className="p-6 space-y-4">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  What's included:
                </p>
                {bundleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 group"
                    >
                      <div
                        className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${item.iconBg} border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold text-slate-800 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-[11.5px] text-slate-400 leading-tight">
                          {item.id === 1
                            ? "Premium search ranking"
                            : item.id === 2
                              ? "Professional HD shoot"
                              : "Multi-platform exposure"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                          PKR {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[14px] text-slate-500 font-medium">
                      Regular Price
                    </span>
                    <span className="text-[14px] text-slate-400 line-through">
                      PKR{" "}
                      {bundleItems
                        .reduce((s, i) => s + i.price, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[15px] font-bold text-slate-800 dark:text-white">
                        Bundle Price
                      </span>
                      <p className="text-[11px] text-emerald-600 font-bold uppercase">
                        You save 30%
                      </p>
                    </div>
                    <span className="text-[20px] font-black text-royal-700 dark:text-royal-400">
                      PKR{" "}
                      {Math.round(
                        bundleItems.reduce((s, i) => s + i.price, 0) * 0.7,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={addBundleToCart}
                  className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold py-3.5 rounded-sm transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-royal-500/20"
                >
                  <PlusSquare className="w-5 h-5" />
                  Claim Bundle Offer
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10.5px] text-slate-400 mt-3">
                  * Discount applied automatically at checkout with code{" "}
                  <span className="text-royal-600 font-bold">ROYAL30</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Cart Side Panel ───────────────────────────────────────── */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm transition-all h-screen w-screen"
            style={{ height: "100dvh" }}
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 inset-y-0 w-[360px] z-[101] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-royal-600 dark:text-royal-400" />
                <p className="font-semibold text-slate-800 dark:text-white text-sm">
                  Your Cart
                </p>
                {cart.length > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold bg-royal-600 text-white rounded-full leading-none">
                    {cart.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                  <ShoppingCart className="w-10 h-10 opacity-20 mb-3" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                  <p className="text-[12px] mt-1">
                    Add services to get started
                  </p>
                </div>
              ) : (
                cart.map((item) => {
                  const config =
                    badgeConfig[
                      item.id === 1
                        ? "Hot"
                        : item.id === 2
                          ? "Popular"
                          : item.id === 3
                            ? "New"
                            : "Best Value"
                    ];
                  // Simplified mapping for the side panel, or use the centralized itemUIConfigs if we want to be perfect
                  const productRef = products.find((p) => p.id === item.id);
                  const Icon = productRef?.icon || Package;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-sm border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30"
                    >
                      <div
                        className={`w-9 h-9 rounded-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 ${productRef?.iconBg || "bg-slate-100"}`}
                      >
                        <Icon
                          className={`w-4 h-4 ${productRef?.iconColor || "text-royal-600"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold text-slate-800 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-bold text-royal-700 dark:text-royal-400 mt-0.5">
                          PKR {item.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-3">
                <div className="flex items-center justify-between py-2.5 bg-royal-50 dark:bg-royal-500/10 rounded-sm px-3 border border-royal-100 dark:border-royal-500/20">
                  <span className="text-[12.5px] font-bold text-slate-700 dark:text-slate-200">
                    Total
                  </span>
                  <span className="text-[14px] font-bold text-royal-700 dark:text-royal-400">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    router.push("/dashboard/buy-product");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[13px] font-semibold py-2.5 rounded-sm transition-colors cursor-pointer"
                >
                  Proceed to Checkout <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
