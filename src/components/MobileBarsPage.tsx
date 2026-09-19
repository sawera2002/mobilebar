import React from 'react';
import { AppPage } from '../types';
import { BAR_SETUPS, GALLERY_ITEMS } from '../data/barData';
import { Wine, Check, ArrowRight, Sparkles, Layers, Image } from 'lucide-react';

interface MobileBarsPageProps {
  onSelectBarSetup: (setupId: string) => void;
  onNavigate: (page: AppPage) => void;
}

export const MobileBarsPage: React.FC<MobileBarsPageProps> = ({ onSelectBarSetup, onNavigate }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 text-[#f472b6] text-xs font-semibold uppercase tracking-widest mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>The Mobile Bar Fleet</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Handcrafted Mobile Stations
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-300">
          Whether you are hosting an open-air vineyard wedding or a high-rise penthouse gala, we have the perfect matte black and blush pink station for your venue.
        </p>
      </div>

      {/* Detailed Fleet List */}
      <div className="space-y-12">
        {BAR_SETUPS.map((bar, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <div
              key={bar.id}
              className={`bg-[#121216] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-6 overflow-hidden rounded-2xl relative ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="h-80 sm:h-96 w-full overflow-hidden rounded-2xl relative group">
                  <img
                    src={bar.imageUrl}
                    alt={bar.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#09090b]/80 backdrop-blur-md border border-zinc-700 text-xs font-mono text-[#fbcfe8]">
                    {bar.dimensions}
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-6 space-y-5 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold">
                    Station {index + 1}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                    {bar.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#fbcfe8] font-medium mt-1">{bar.tagline}</p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {bar.description}
                </p>

                <div className="p-4 rounded-xl bg-[#18181b] border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <strong className="text-white block">Ideal Venue Setting:</strong>
                  <p className="text-zinc-400">{bar.idealFor}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block">
                    Station Features:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    {bar.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#f472b6] shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => {
                      onSelectBarSetup(bar.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#f472b6]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Reserve {bar.name.split(' ')[1]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Bar Gallery */}
      <div className="space-y-8 pt-8 border-t border-[#27272a]">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold">
            In The Wild
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
            The Bars in Action
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real setups from recent private estates, winery lawns, and ballroom galas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="rounded-3xl overflow-hidden bg-[#121216] border border-[#27272a] shadow-xl group relative h-72"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#f472b6] block">
                  {item.location}
                </span>
                <p className="font-serif text-sm font-bold text-white mt-0.5">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
