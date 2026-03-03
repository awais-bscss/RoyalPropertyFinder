import Link from "next/link";
import { Mail, Phone, MapPin, ChevronUp } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#BCBCBC] pt-16 pb-8 text-sm font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Company */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg mb-2">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Advertise On Royal Property
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms Of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg mb-2">Connect</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Expo
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Real Estate Agents
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Add Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Head Office */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg mb-2">Head Office</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white flex-none mt-0.5" />
                <span>
                  Pearl One, 94-B/I, MM Alam Road,
                  <br />
                  Gulberg III, Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white flex-none" />
                <span className="font-semibold text-white">
                  0800-ROYAL (76925)
                </span>
              </li>
              <li className="flex items-start gap-3 pl-8">
                <span>Monday To Sunday 9AM To 6PM</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white flex-none" />
                <Link href="#" className="hover:text-white transition-colors">
                  Email Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Brand & Social */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Royal Property Finder
              </h3>
              <div className="flex items-center gap-3">
                <Logo className="w-12 h-12" />
                <div className="flex flex-col">
                  <span className="text-white font-bold leading-tight">
                    ROYAL
                  </span>
                  <span className="text-xs tracking-wider">
                    PROPERTY FINDER
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                Get Connected
              </h3>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                >
                  <FaFacebook size={18} />
                </Link>

                {/* Instagram */}
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <FaInstagram size={18} />
                </Link>

                {/* YouTube */}
                <Link
                  href="#"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                >
                  <FaYoutube size={18} />
                </Link>

                {/* X / Twitter */}
                <Link
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                >
                  <FaXTwitter size={17} />
                </Link>

                {/* LinkedIn */}
                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                >
                  <FaLinkedinIn size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-end md:items-center">
          <p className="text-xs">
            © Copyright 2007 - 2026 RoyalProperty.com. All Rights Reserved
          </p>
          <div className="mt-4 md:mt-0">
            <button
              className="flex items-center gap-2 text-xs font-bold text-white uppercase hover:text-royal-400 transition-colors cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Top
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-black">
                <ChevronUp size={14} strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
