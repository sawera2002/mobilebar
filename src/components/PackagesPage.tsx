import React, { useState } from 'react';
import { AppPage } from '../types';
import { PACKAGES, BAR_SETUPS, SIGNATURE_COCKTAILS, ADD_ONS, FAQS } from '../data/barData';
import { 
  Wine, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Clock, 
  Users, 
  ShieldCheck, 
  Flame, 
  ChevronDown,
  Layers,
  GlassWater
} from 'lucide-react';

interface PackagesPageProps {
  onSelectPackage: (packageId: string) => void;
  onNavigate: (page: AppPage) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onSelectPackage, onNavigate }) => {
  const [cocktailFilter, setCocktailFilter] = useState<'All' | 'Signature' | 'Classic' | 'Zero-Proof'>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredCocktails = cocktailFilter === 'All' 
    ? SIGNATURE_COCKTAILS 
    : SIGNATURE_COCKTAILS.filter(c => c.category === cocktailFilter);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 text-[#f472b6] text-xs font-semibold uppercase tracking-widest mb-3">
          <Wine className="w-3.5 h-3.5" />
          <span>Curated Beverage Experiences</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Packages & Signature Libations
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400">
          Turnkey luxury mobile bar catering. Certified mixologists, house-made botanical syrups, organic citrus, crystal glassware, and our stunning matte black & blush pink setups.
        </p>
      </div>

      {/* 1. Bar Service Packages Grid */}
      <section id="packages-section" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
              Turnkey Hospitality
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Choose Your Bar Service Tier
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg) => {
            const isHighlighted = pkg.isPopular;
            return (
              <div
                key={pkg.id}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-[#18181b] to-[#241720] border-[#f472b6] shadow-xl shadow-[#f472b6]/15 ring-1 ring-[#f472b6]'
                    : 'bg-[#121216] border-[#27272a] hover:border-[#3f3f46]'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] shadow-md shadow-[#f472b6]/30">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="pt-2">
                    <h3 className="font-serif text-xl font-bold text-white">{pkg.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{pkg.subtitle}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mt-5 pb-5 border-b border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-zinc-400">Starting at</span>
                      <span className="font-serif text-3xl font-bold text-white">
                        ${pkg.priceStartingAt.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#fbcfe8] font-mono mt-0.5 block">
                      {pkg.guestRange} • {pkg.durationHours} hrs service
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="py-4 space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
                      <span>{pkg.cocktailsIncluded} Signature Craft Cocktails</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#f472b6]" />
                      <span>{pkg.bartendersCount} Certified Mixologists</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-zinc-400 pt-2">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#f472b6] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => onSelectPackage(pkg.id)}
                    className={`w-full py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] shadow-lg shadow-[#f472b6]/25 hover:brightness-110'
                        : 'bg-[#18181b] border border-[#3f3f46] text-zinc-200 hover:text-white hover:border-[#f472b6]/50'
                    }`}
                  >
                    <span>Select & Book Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Mobile Bar Trailer & Satellite Station Showcase */}
      <section className="space-y-8 pt-8 border-t border-[#27272a]">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
            The Physical Fleet
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Mobile Bars Designed to Impress
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Every station is a handcrafted statement piece blending matte black obsidian, warm brass hardware, and delicate blush pink fluting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {BAR_SETUPS.map((bar) => (
            <div
              key={bar.id}
              className="bg-[#121216] border border-[#27272a] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#f472b6]/40 transition-all duration-300"
            >
              <div>
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={bar.imageUrl}
                    alt={bar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#09090b]/80 backdrop-blur-md border border-zinc-700 text-[#fbcfe8]">
                      {bar.dimensions}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-white">{bar.name}</h3>
                  <p className="text-xs text-[#f472b6] font-medium mt-0.5">{bar.tagline}</p>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{bar.description}</p>

                  <div className="mt-5 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">
                      Station Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {bar.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#f472b6] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="p-3 rounded-xl bg-[#18181b] border border-zinc-800 text-xs text-zinc-400">
                  <span className="text-white font-semibold block mb-0.5">Ideal Venue Setting:</span>
                  {bar.idealFor}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Signature Cocktail Menu Library */}
      <section className="space-y-8 pt-8 border-t border-[#27272a]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
              Mixology Masterpieces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Signature Cocktails & Zero-Proof Elixirs
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select your cocktail tasting menu during booking. Every drink is made fresh with cold-pressed citrus and house-simmered cordials.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#18181b] p-1 rounded-xl border border-[#27272a] self-start sm:self-auto">
            {(['All', 'Signature', 'Classic', 'Zero-Proof'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCocktailFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  cocktailFilter === cat
                    ? 'bg-[#f472b6] text-[#09090b]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCocktails.map((cocktail) => (
            <div
              key={cocktail.id}
              className="bg-[#121216] border border-[#27272a] hover:border-[#f472b6]/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={cocktail.imageUrl}
                    alt={cocktail.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#09090b]/80 border border-zinc-700 text-[10px] font-mono text-[#fbcfe8]">
                    <span>{cocktail.glassware}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-white">{cocktail.name}</h3>
                    <span className="text-[10px] text-[#f472b6] font-mono uppercase">
                      {cocktail.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{cocktail.tagline}</p>

                  <div className="mt-4 p-3 rounded-xl bg-[#18181b] border border-zinc-800 space-y-1.5 text-xs">
                    <p className="text-zinc-300">
                      <strong className="text-[#fbcfe8]">Base Spirit:</strong> {cocktail.alcoholBase}
                    </p>
                    <p className="text-zinc-400">
                      <strong className="text-zinc-300">Ingredients:</strong> {cocktail.ingredients.join(', ')}
                    </p>
                    <p className="text-zinc-400">
                      <strong className="text-zinc-300">Garnish:</strong> {cocktail.garnish}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {cocktail.flavorNotes.map((note, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    onNavigate('booking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 rounded-xl bg-[#18181b] hover:bg-[#f472b6]/15 hover:border-[#f472b6]/50 border border-[#27272a] text-xs font-semibold text-[#fbcfe8] transition-colors flex items-center justify-center gap-1"
                >
                  <span>Request in Custom Bar Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Luxe Add-Ons & Experiences */}
      <section className="space-y-8 pt-8 border-t border-[#27272a]">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
            Elevate The Celebration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Luxe Bar Add-Ons & Visual Moments
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Create unforgettable photo moments for your guests with our champagne towers, custom laser ice stamps, and smoked cocktail domes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADD_ONS.map((addon) => (
            <div
              key={addon.id}
              className="bg-[#121216] border border-[#27272a] rounded-2xl p-6 flex flex-col justify-between hover:border-[#f472b6]/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#f472b6]">
                    {addon.category}
                  </span>
                  <span className="font-serif text-xl font-bold text-[#fbcfe8]">
                    +${addon.price}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-white mt-2">{addon.name}</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{addon.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Available in booking wizard</span>
                <button
                  onClick={() => onNavigate('booking')}
                  className="text-[#f472b6] hover:text-[#fbcfe8] font-semibold flex items-center gap-1"
                >
                  <span>Add to Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQs for Event Planners */}
      <section className="space-y-6 pt-8 border-t border-[#27272a] max-w-4xl mx-auto">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-widest text-[#f472b6] font-semibold">
            Common Inquiries
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            Event Planner FAQs
          </h2>
        </div>

        <div className="space-y-3 mt-6">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#121216] border border-[#27272a] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-[#fbcfe8] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#f472b6] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
