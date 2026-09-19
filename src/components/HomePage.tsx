import React from 'react';
import { AppPage } from '../types';
import { PACKAGES, BAR_SETUPS, SIGNATURE_COCKTAILS } from '../data/barData';
import { 
  Wine, 
  Sparkles, 
  ArrowRight, 
  CalendarCheck, 
  ShieldCheck, 
  Users, 
  Clock, 
  Award,
  ChevronRight,
  Star,
  Layers,
  Heart
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
  onSelectPackage: (packageId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectPackage }) => {
  return (
    <div className="space-y-24">
      {/* 1. LUXE HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#f472b6]/20 via-[#ec4899]/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#fbcfe8]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181b]/80 border border-[#f472b6]/40 shadow-lg shadow-[#f472b6]/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-ping" />
            <span className="text-xs uppercase tracking-widest font-sans font-semibold text-[#fbcfe8]">
              Obsidian Black & Blush Pink • Luxury Mobile Bar Catering
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            Chic Sips. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] via-[#fbcfe8] to-[#f472b6]">
              Unforgettable Nights.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            Elevating weddings, private estates, and luxury galas with custom vintage horse trailer bars, fluted blush stations, and bespoke craft cocktail mixology.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="hero-book-btn"
              onClick={() => {
                onNavigate('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#f472b6] via-[#fbcfe8] to-[#f472b6] text-[#09090b] text-xs uppercase tracking-widest font-bold shadow-xl shadow-[#f472b6]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Your Mobile Bar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-fleet-btn"
              onClick={() => {
                onNavigate('bars');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#121216] border border-[#3f3f46] hover:border-[#f472b6]/70 text-xs uppercase tracking-widest font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#f472b6]" />
              <span>Explore Mobile Bars</span>
            </button>
          </div>

          {/* Key Trust Badges */}
          <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-[#f472b6] fill-[#f472b6]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">5.0 Star Rating</p>
                <p className="text-[10px] text-zinc-500">120+ Weddings & Galas</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#f472b6]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">$2M Insured</p>
                <p className="text-[10px] text-zinc-500">Full Liquor & COI</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
                <Wine className="w-4 h-4 text-[#f472b6]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Certified Staff</p>
                <p className="text-[10px] text-zinc-500">TIPS Mixologists</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#f472b6]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Turnkey Bar Kit</p>
                <p className="text-[10px] text-zinc-500">Glassware & Syrups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLEET SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
              The Mobile Fleet
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Bespoke Bar Stations
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Handcrafted in matte black with fluted blush pink accents to elevate any venue aesthetic.
            </p>
          </div>
          <button
            onClick={() => {
              onNavigate('bars');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-wider text-[#fbcfe8] hover:text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>View All Fleet Specs</span>
            <ChevronRight className="w-4 h-4 text-[#f472b6]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BAR_SETUPS.map((bar) => (
            <div
              key={bar.id}
              className="bg-[#121216] border border-[#27272a] hover:border-[#f472b6]/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={bar.imageUrl}
                    alt={bar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#09090b]/80 backdrop-blur-md border border-zinc-700 text-[10px] font-mono text-[#fbcfe8]">
                    {bar.dimensions}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-white">{bar.name}</h3>
                  <p className="text-xs text-[#f472b6] font-medium mt-0.5">{bar.tagline}</p>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{bar.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    onNavigate('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#18181b] hover:bg-[#f472b6]/15 hover:border-[#f472b6]/40 border border-[#27272a] text-xs font-semibold text-[#fbcfe8] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Select in Booking Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE COSMO EXPERIENCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#18181b] via-[#20151c] to-[#18181b] border border-[#f472b6]/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-[#f472b6] font-bold">
              Pure Turnkey Luxury
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Every detail crafted for an effortless, glamorous celebration.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              From our crystal coupe glassware and organic cold-pressed garnishes to custom acrylic cocktail menus with your event crest, Cosmo provides an all-inclusive cocktail lounge experience wherever you host.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  onNavigate('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#f472b6] text-[#09090b] text-xs uppercase tracking-wider font-bold shadow-md shadow-[#f472b6]/20 hover:bg-[#fbcfe8] transition-colors flex items-center gap-2"
              >
                <span>Explore Menu & Packages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onNavigate('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#121216] border border-[#3f3f46] text-xs uppercase tracking-wider font-semibold text-zinc-300 hover:text-white hover:border-[#f472b6]/50 transition-colors"
              >
                Our Story & Philosophy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE COCKTAIL LINEUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
            The Beverage Collection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            Signature Cocktails
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Every cocktail is custom-balanced for your celebration. From our signature modern Pink Cosmopolitan to torched rosemary sours and zero-proof botanical elixirs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIGNATURE_COCKTAILS.slice(0, 3).map((cocktail) => (
            <div
              key={cocktail.id}
              className="bg-[#121216] border border-[#27272a] rounded-3xl overflow-hidden shadow-xl hover:border-[#f472b6]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={cocktail.imageUrl}
                    alt={cocktail.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#09090b]/80 border border-zinc-700 text-[10px] font-mono text-[#fbcfe8]">
                    {cocktail.glassware}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-bold text-white">{cocktail.name}</h3>
                    <span className="text-[10px] text-[#f472b6] font-mono">{cocktail.category}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{cocktail.tagline}</p>
                  <p className="text-xs text-[#fbcfe8] font-mono mt-3">Base: {cocktail.alcoholBase}</p>
                  <p className="text-xs text-zinc-400 mt-1">Garnish: {cocktail.garnish}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    onNavigate('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-[#f472b6]/50 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  View Tasting Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => {
              onNavigate('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#f472b6] hover:text-[#fbcfe8] transition-colors"
          >
            <span>Explore Complete Drink & Mocktail Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. POPULAR PACKAGES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
              Full Hospitality Solutions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              Curated Event Packages
            </h2>
          </div>
          <button
            onClick={() => {
              onNavigate('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-wider text-[#fbcfe8] hover:text-white flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>Compare All Packages</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#f472b6]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PACKAGES.slice(0, 2).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#121216] border border-[#27272a] hover:border-[#f472b6]/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    {pkg.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-[#f472b6]/20 text-[#f472b6] px-2.5 py-0.5 rounded">
                        {pkg.badge}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl font-bold text-white mt-1">{pkg.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">From</span>
                    <span className="font-serif text-2xl font-bold text-[#fbcfe8]">
                      ${pkg.priceStartingAt.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mt-2">{pkg.subtitle}</p>

                <div className="grid grid-cols-2 gap-3 my-5 py-4 border-y border-zinc-800 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="w-4 h-4 text-[#f472b6]" />
                    <span>{pkg.durationHours} Hours Service</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Users className="w-4 h-4 text-[#f472b6]" />
                    <span>{pkg.bartendersCount} Mixologists</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-zinc-400">
                  {pkg.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#f472b6]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => onSelectPackage(pkg.id)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs uppercase tracking-wider font-bold shadow-lg shadow-[#f472b6]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span>Select & Start Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EVENT PLANNER TRUST PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#121216] border border-[#27272a] rounded-3xl p-8 sm:p-12 text-center space-y-8">
          <div className="max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
              Planner & Venue Ready
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Why Premier Event Planners Partner with Cosmo
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-[#18181b] border border-zinc-800">
              <ShieldCheck className="w-6 h-6 text-[#f472b6] mb-3" />
              <h3 className="font-serif text-base font-bold text-white">Full Venue COI & Compliance</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                $2M general & liquor liability policy. We issue verified COIs naming your estate or commercial venue in under 24 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#18181b] border border-zinc-800">
              <Award className="w-6 h-6 text-[#f472b6] mb-3" />
              <h3 className="font-serif text-base font-bold text-white">TIPS-Certified Mixologists</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Punctual, impeccably groomed bar teams dressed in obsidian aprons with pink accents. Fast, flawless high-volume service.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#18181b] border border-zinc-800">
              <Heart className="w-6 h-6 text-[#f472b6] mb-3" />
              <h3 className="font-serif text-base font-bold text-white">Turnkey Experience</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Complete bar kit provided: crystal glassware, ice, house-made botanicals, garnishes, and custom acrylic signage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
