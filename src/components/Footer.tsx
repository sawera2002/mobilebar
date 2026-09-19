import React from 'react';
import { AppPage } from '../types';
import { Wine, Sparkles, Instagram, Mail, Phone, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: AppPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0c0c0f] border-t border-[#27272a] text-zinc-400">
      {/* Top Banner CTA */}
      <div className="border-b border-[#27272a]/60 bg-gradient-to-r from-[#18181b] via-[#271b22] to-[#18181b] py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-xs uppercase font-sans tracking-widest text-[#f472b6] font-semibold flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
              Event Planners & Private Hosts
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold mt-1">
              Ready to elevate your celebration with craft cocktails?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              From intimate bridal showers to 300+ guest wedding galas, our custom mobile bars bring effortless luxury.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="footer-fleet-btn"
              onClick={() => {
                onNavigate('bars');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-xl border border-[#f472b6]/40 text-xs font-semibold uppercase tracking-wider text-[#fbcfe8] hover:bg-[#f472b6]/10 transition-colors"
            >
              Explore Bars
            </button>
            <button
              id="footer-book-btn"
              onClick={() => {
                onNavigate('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#f472b6]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Instant Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center">
                <Wine className="w-5 h-5 text-[#f472b6]" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wider">
                COSMO
              </span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              Premier mobile bar trailer & bespoke cocktail catering service. Pairing obsidian black elegance with soft blush pink romance for weddings, galas, and celebrations.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-[#f472b6]" />
              <span>$2M Commercial & Liquor Liability Insured</span>
            </div>
          </div>

          {/* Navigation Links (The 5 Pages) */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#fbcfe8] font-semibold">
              Explore Pages
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#f472b6] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#f472b6] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('bars');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#f472b6] transition-colors"
                >
                  Mobile Bars & Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#f472b6] transition-colors"
                >
                  Menu & Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#f472b6] transition-colors"
                >
                  Book Now
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Services */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#fbcfe8] font-semibold">
              Hospitality Standards
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>TIPS-Certified Mixologists</li>
              <li>Verified 24hr COI Delivery</li>
              <li>House-Crafted Botanical Syrups</li>
              <li>Fresh-Pressed Organic Citrus</li>
              <li>Crystal Coupe & Tumbler Glassware</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#fbcfe8] font-semibold">
              Concierge & Inquiries
            </p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f472b6]" />
                <span className="text-zinc-300 font-mono">(800) 555-COSMO</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f472b6]" />
                <span className="text-zinc-300 font-mono">hello@cosmobar.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f472b6]" />
                <span className="text-zinc-300">Southern California & Beyond</span>
              </p>
              <p className="flex items-center gap-2 pt-2 text-[#f472b6]">
                <Instagram className="w-4 h-4" />
                <span className="text-zinc-300">@cosmo.mobilebar</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} Cosmo Mobile Bar Co. All rights reserved.</p>
            <span className="text-zinc-700">•</span>
            <button
              id="footer-admin-link"
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-zinc-500 hover:text-[#f472b6] transition-colors"
            >
              Admin Portal (/admin)
            </button>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Obsidian Black & Baby Pink Luxury Mobile Bar</span>
            <Heart className="w-3.5 h-3.5 text-[#f472b6] fill-[#f472b6]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
