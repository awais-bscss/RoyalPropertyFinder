"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Search, User, Menu, Plus, Home, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Logo } from "@/components/common/Logo";
import { LoginModal, SignUpModal } from "@/components/auth";
import { ManageAlertsModal } from "@/components/user/ManageAlertsModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logoutAuth } from "@/store/slices/authSlice";
import { AuthService } from "@/services/auth.service";
import apiClient from "@/lib/axios";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBuyExpanded, setIsBuyExpanded] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isManageAlertsOpen, setIsManageAlertsOpen] = useState(false);

  // Redux Hook Setup
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Successfully logged out");
    } catch (e) {
      console.warn(
        "Logout failed slightly, continuing to clear local state",
        e,
      );
      toast.error("Logout completed with warnings");
    } finally {
      dispatch(logoutAuth());
    }
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab");


  const handleAddProperty = () => {
    if (isAuthenticated) {
      router.push("/dashboard/post-listing");
    } else {
      setIsLoginOpen(true);
    }
  };

  const navItems = [
    { name: "BUY", href: "/?tab=buy", closable: false },
    { name: "HOMES", href: "/", closable: true },
    { name: "PLOTS", href: "/", closable: true },
    { name: "COMMERCIAL", href: "/", closable: true },
    { name: "RENT", href: "/?tab=rent", closable: false, separator: true },
    { name: "AGENTS", closable: false, separator: true },
    {
      name: "NEW PROJECTS",
      href: "/new-projects",
      closable: false,
      separator: true,
    },
  ];

  const [propertySearchId, setPropertySearchId] = useState("");

  const handlePropertyIdSearch = async (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;

    // Clean input: remove #, "ID:", "ID " and trim
    const cleanId = propertySearchId
      .trim()
      .replace(/^(ID[:\s]*|#)/i, "")
      .trim();
      
    if (!cleanId) return;

    try {
      const resp: any = await apiClient.get(`/listings/search/${cleanId}`);
      // Based on axios interceptor, resp is already response.data
      if (resp?.success && resp?.data?._id) {
        router.push(`/properties/${resp.data._id}`);
        setPropertySearchId("");
      } else {
        toast.error("Property found but ID is missing.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Property not found");
    }
  };

  return (
    <header className="w-full flex flex-col z-100">
      {/* Top Bar (Royal Blue) */}
      <div className="bg-royal-800 text-white h-11 text-xs">
        <div className="container mx-auto flex h-full items-center justify-between px-5">
          {/* Left Links */}
          <div className="hidden md:flex items-center gap-6 text-[13px]">
            <Link
              href="/"
              className="hover:text-royal-100 font-bold flex items-center gap-1.5 transition-colors uppercase tracking-tight"
            >
              <Home className="w-3.5 h-3.5" /> Properties
            </Link>
            <Link
              href="/plot-finder"
              className="hover:text-royal-100 font-bold transition-colors uppercase tracking-tight"
            >
              Plot Finder
            </Link>
            <Link
              href="#"
              className="hover:text-royal-100 font-bold transition-colors uppercase tracking-tight"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="hover:text-royal-100 font-bold transition-colors uppercase tracking-tight"
            >
              Tools
            </Link>
            <Link
              href="/contact"
              className="hover:text-royal-100 font-bold transition-colors uppercase tracking-tight"
            >
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden lg:flex items-center bg-white/10 hover:bg-white/15 rounded px-3 py-1 border border-white/20 transition-colors group">
              <input
                type="text"
                placeholder="Property ID"
                value={propertySearchId}
                onChange={(e) => setPropertySearchId(e.target.value)}
                onKeyDown={handlePropertyIdSearch}
                className="bg-transparent border-none text-white text-xs w-20 placeholder:text-white/60 focus:outline-none font-medium"
              />
              <Search 
                className="w-3.5 h-3.5 text-white/80 cursor-pointer group-hover:text-white transition-colors" 
                onClick={() => handlePropertyIdSearch()} 
              />
            </div>

            <Button
              size="sm"
              onClick={handleAddProperty}
              className="h-6.5 bg-white text-royal-900 hover:bg-royal-50 font-bold border-none rounded pointer-events-auto px-4 cursor-pointer text-[12px] shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3 h-3 mr-1.5" /> Add Property
            </Button>

            <div className={`flex items-center ${isAuthenticated ? "space-x-8 border-l border-slate-200 pl-1 pr-2" : "pl-6"}`}>
              {isAuthenticated && <NotificationDropdown />}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="User menu"
                      className="cursor-pointer transition-colors -ml-1 focus:outline-none"
                    >
                      <User className="w-5 h-5 text-[#F8F8F8]" fill="currentColor" strokeWidth={2.5} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[180px] p-2.5 rounded-sm shadow-xl border border-slate-200 bg-white dark:bg-slate-900 mt-2"
                  >
                    <div className="text-center font-bold text-slate-800 dark:text-white text-[14px] mb-2 px-2 truncate">
                      {user?.name || "User"}
                    </div>
                    <div className="space-y-1">
                      <DropdownMenuItem
                        asChild
                        className="w-full flex items-center justify-start py-2 px-3 rounded-xl text-slate-700 dark:text-slate-200 focus:bg-royal-50 focus:text-royal-800 dark:focus:bg-royal-950 dark:focus:text-royal-400 hover:bg-royal-50 hover:text-royal-800 dark:hover:bg-royal-950 dark:hover:text-royal-400 transition-colors cursor-pointer text-[13px] font-medium"
                      >
                        <Link href="/dashboard">My Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setIsManageAlertsOpen(true)}
                        className="w-full flex items-center justify-start py-2 px-3 rounded-xl text-slate-700 dark:text-slate-200 focus:bg-royal-50 focus:text-royal-800 dark:focus:bg-royal-950 dark:focus:text-royal-400 hover:bg-royal-50 hover:text-royal-800 dark:hover:bg-royal-950 dark:hover:text-royal-400 transition-colors cursor-pointer text-[13px] font-medium"
                      >
                        Manage Alerts
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleLogout}
                        className="w-full flex items-center justify-start py-2 px-3 rounded-xl text-slate-700 dark:text-slate-200 focus:bg-royal-50 focus:text-royal-800 dark:focus:bg-royal-950 dark:focus:text-royal-400 hover:bg-royal-50 hover:text-royal-800 dark:hover:bg-royal-950 dark:hover:text-royal-400 transition-colors cursor-pointer text-[13px] font-medium"
                      >
                        Logout
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 text-[13px] font-bold text-white hover:text-royal-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <User className="w-4 h-4" />
                  <span>LOGIN / SIGNUP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Navbar (White Top) */}
      <nav className="bg-[#F3F9FE] border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800 sticky top-0">
        <div className="container mx-auto flex h-12 items-center px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 mr-8 -ml-1.5">
            <Logo className="w-9 h-9 mt-0.5 mr-1" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-royal-900 dark:text-white -mb-0.5">
                Royal<span className="text-royal-800">Property</span>
              </span>
              <span className="text-[0.5rem] text-slate-700 tracking-widest uppercase font-medium">
                Har Pata, Humain Pata Hai
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center h-full">
            {/* BUY Toggle Trigger */}
            <div className="flex items-center h-full">
              <button
                onClick={() => setIsBuyExpanded(!isBuyExpanded)}
                className="h-full flex items-center px-4 gap-1.5 text-[13px] font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-royal-800 focus:outline-none cursor-pointer group"
              >
                BUY
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-royal-800 transition-colors" />
              </button>
            </div>

            {/* Smooth Animated Container for Closable Items */}
            <div
              className={`flex items-center h-full overflow-hidden transition-all duration-500 ease-in-out ${
                isBuyExpanded
                  ? "max-w-[500px] opacity-100 invisible-none"
                  : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              {navItems
                .filter((i) => i.closable)
                .map((item) => {
                  const href = item.href || `/${item.name.toLowerCase()}`;
                  const isActive =
                    (item.name === "RENT" && currentTab === "rent") ||
                    (item.name === "BUY" &&
                      (currentTab === "buy" ||
                        (pathname === "/" && !currentTab))) ||
                    (pathname === href && href !== "/");

                  return (
                    <Link
                      key={item.name}
                      href={href}
                      className={`h-full flex items-center px-4 text-[13px] font-medium whitespace-nowrap transition-colors hover:text-royal-800 ${
                        isActive
                          ? "text-royal-800"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
            </div>

            {/* Static Navigation Items */}
            {navItems
              .filter((i) => !i.closable && i.name !== "BUY")
              .map((item) => {
                const href = item.href || `/${item.name.toLowerCase()}`;
                const isActive =
                  (item.name === "RENT" && currentTab === "rent") ||
                  (item.name === "BUY" &&
                    (currentTab === "buy" ||
                      (pathname === "/" && !currentTab))) ||
                  (pathname === href && href !== "/");

                return (
                  <div key={item.name} className="flex items-center h-full">
                    {item.separator && (
                      <span className="text-slate-500 dark:text-slate-700 font-extralight">
                        |
                      </span>
                    )}
                    <Link
                      href={href}
                      className={`h-full flex items-center px-4 text-[13px] font-medium transition-colors hover:text-royal-800 ${
                        isActive
                          ? "text-royal-800"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </div>
                );
              })}
          </div>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t bg-white dark:bg-slate-950 p-4 lg:hidden">
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              {[
                { name: "BUY", href: "/?tab=buy" },
                { name: "HOMES", href: "/" },
                { name: "PLOTS", href: "/" },
                { name: "COMMERCIAL", href: "/" },
                { name: "RENT", href: "/?tab=rent" },
                { name: "AGENTS", href: "/agents" },
                { name: "NEW PROJECTS", href: "/new-projects" },
                { name: "CONTACT", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="py-2 border-b border-slate-100 dark:border-slate-800"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      {/* Modals placed here centrally for App Layer access */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignUp={() => setIsSignUpOpen(true)}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />
      <ManageAlertsModal
        isOpen={isManageAlertsOpen}
        onClose={() => setIsManageAlertsOpen(false)}
      />
    </header>
  );
}
