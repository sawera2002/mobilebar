import React from 'react';
import { AppPage } from '../types';
import { Wine, Sparkles, ShieldCheck, Award, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: AppPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 text-[#f472b6] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Craft</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Obsidian Luxury. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] via-[#fbcfe8] to-[#f472b6]">
            Blush Pink Romance.
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
          Founded on the philosophy that a mobile bar should not just serve drinks—it should be the breathtaking centerpiece of your celebration.
        </p>
      </div>

      {/* Brand Vision Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold block">
            The Cosmo Origin
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Redefining Mobile Beverage Hospitality
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Cosmo Mobile Bar was born out of a desire to break away from rustic, wooden beer-tap horse trailers and introduce high-fashion cocktail culture to luxury outdoor weddings, private estates, and branded galas.
            </p>
            <p>
              By pairing deep satin obsidian black with delicate baby pink fluted millwork, polished warm brass draft towers, and crystal glassware, we create an immediate visual atmosphere reminiscent of a glamorous boutique Manhattan or Paris cocktail lounge.
            </p>
            <p>
              Every syrup is simmered in-house from fresh botanicals, fruits, and organic cane sugar. We squeeze real citrus on-site, torch rosemary branches tableside, and carve crystal-clear craft ice so every cocktail served is memorable.
            </p>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272a]">
              <span className="font-serif text-3xl font-bold text-[#fbcfe8]">120+</span>
              <p className="text-xs text-zinc-400 mt-1">Luxury Weddings & Galas</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#121216] border border-[#27272a]">
              <span className="font-serif text-3xl font-bold text-white">100%</span>
              <p className="text-xs text-zinc-400 mt-1">5-Star Client Rating</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden border border-[#27272a] shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80"
              alt="Cosmo Mobile Bar trailer at golden hour"
              className="w-full h-[440px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#09090b]/85 backdrop-blur-md border border-zinc-800">
              <p className="text-xs font-semibold text-white">The Onyx & Rose Mobile Salon</p>
              <p className="text-[11px] text-[#f472b6] mt-0.5">Handcrafted Matte Black with Warm Ambient Neon</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="space-y-8 pt-8 border-t border-[#27272a]">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold">
            Our Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            The Cosmo Standard of Hospitality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center">
              <Wine className="w-5 h-5 text-[#f472b6]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Scratch Mixology</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zero artificial mixes or bottled cordials. Fresh key limes, hibiscus reductions, cold-brew infusions, and edible flowers.
            </p>
          </div>

          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center">
              <Award className="w-5 h-5 text-[#f472b6]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">TIPS-Certified Bartenders</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Impeccably dressed in onyx aprons with blush accents. Warm, attentive, fast-paced service with zero bar congestion.
            </p>
          </div>

          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#f472b6]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">$2M Venue Insurance</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full commercial and liquor liability coverage. Verified Certificates of Insurance (COI) delivered to venues within 24 hours.
            </p>
          </div>

          <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#f472b6]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Bespoke Curation</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Signature drinks named after the couple, pets, or brand themes, matched to your event color palette with custom acrylic menus.
            </p>
          </div>
        </div>
      </div>

      {/* Event Planner Partnership */}
      <div className="bg-gradient-to-r from-[#18181b] via-[#20151c] to-[#18181b] border border-[#f472b6]/30 rounded-3xl p-8 sm:p-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold">
            Partner with Us
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Designed to Make Event Planners Look Extraordinary
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            We understand the immense pressure of wedding timelines and corporate galas. We arrive 2 hours prior to start time, operate independently with our own silent power options, and leave the venue spotless.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f472b6]" />
              <span>Complimentary Alcohol Shopping Guide</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f472b6]" />
              <span>Direct Venue Coordination</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#f472b6]" />
              <span>Fast Online Invoicing</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              id="about-cta-btn"
              onClick={() => {
                onNavigate('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#f472b6]/25 hover:brightness-110 transition-all inline-flex items-center gap-2"
            >
              <span>Book Cosmo for Your Next Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
