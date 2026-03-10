import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactSupport } from "@/components/features/contact/ContactSupport";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import bgImage from "@/assets/bg-new-projects-sm.webp";

export const metadata = {
  title: "Contact Support | Royal Property Finder",
  description:
    "Get in touch with the Royal Property Finder team for support, billing, or advertising inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* ── Contact Hero Section ──────────────────────────────────────── */}
      <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden">
        {/* Background Image */}
        <img
          src={bgImage.src}
          alt="Contact Support"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Deep, professional gradient overlay */}
        <div className="absolute inset-0 bg-slate-900/45" />

        {/* Breadcrumb Navigation */}
        <div className="relative z-10 pt-5 px-4 md:px-8 container mx-auto">
          <nav className="flex items-center gap-1 text-[12px] text-white/70">
            <Link
              href="/"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Royal Property Finder
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Contact Support</span>
          </nav>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-20 text-center px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            How can we help you?
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl">
            Reach out to our team for any inquiries or support
          </p>
        </div>
      </div>

      <main className="flex-1 -mt-16 relative z-20 mb-12">
        <ContactSupport />
      </main>

      <Footer />
    </div>
  );
}
