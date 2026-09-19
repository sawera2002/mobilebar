import React, { useState } from 'react';
import { AppPage } from '../types';
import { Wine, CalendarCheck, Sparkles, Layers, Menu, X, PhoneCall, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Clean Navigation Links (booking is handled exclusively by the prominent "Book Your Event" CTA button)
  const navItems: { id: AppPage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <Wine className="w-4 h-4" /> },
    { id: 'bars', label: 'Mobile Bars', icon: <Layers className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu & Packages', icon: <Wine className="w-4 h-4" /> },
  ];

  const handleSelectPage = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a]/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity (Clean 'COSMO' without awkward badge) */}
          <button 
            id="nav-logo-btn"
            onClick={() => handleSelectPage('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#18181b] to-[#27272a] border border-[#f472b6]/40 p-2 flex items-center justify-center shadow-lg shadow-[#f472b6]/10 group-hover:border-[#f472b6] transition-all duration-300 shrink-0">
              <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-[#f472b6] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white group-hover:text-[#fbcfe8] transition-colors leading-none block">
                COSMO
              </span>
              <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-sans font-medium mt-0.5">
                Luxury Cocktail Catering
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => handleSelectPage(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wider uppercase font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#18181b] text-[#f472b6] border border-[#f472b6]/50 shadow-sm shadow-[#f472b6]/15 font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#f472b6] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area - Prominent "Book Your Event" CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+18005552676"
              className="hidden xl:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#fbcfe8] transition-colors px-2 py-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#f472b6]" />
              <span className="font-mono">(800) 555-COSMO</span>
            </a>

            <button
              id="nav-cta-booking-btn"
              onClick={() => handleSelectPage('booking')}
              className={`relative group overflow-hidden px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 ${
                currentPage === 'booking'
                  ? 'bg-[#fbcfe8] text-[#09090b] ring-2 ring-[#f472b6] shadow-[#f472b6]/40'
                  : 'bg-gradient-to-r from-[#f472b6] via-[#fbcfe8] to-[#f472b6] text-[#09090b] hover:brightness-110 shadow-[#f472b6]/25'
              }`}
            >
              <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Book Your Event</span>
            </button>

            <button
              id="nav-admin-link-btn"
              onClick={() => handleSelectPage('admin')}
              title="Admin Portal (/admin)"
              className={`p-2.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 focus:outline-none ${
                currentPage === 'admin'
                  ? 'bg-[#18181b] border-[#f472b6] text-[#f472b6]'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#f472b6]" />
              <span className="hidden xl:inline font-mono text-[11px]">Admin</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Direct Book CTA */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-quick-book-btn"
              onClick={() => handleSelectPage('booking')}
              className="px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold text-[#09090b] bg-gradient-to-r from-[#f472b6] to-[#ec4899] shadow-md shadow-[#f472b6]/20"
            >
              Book
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-zinc-300 hover:text-white hover:border-[#f472b6]/40 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#f472b6]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e12] border-b border-[#27272a] px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleSelectPage(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? 'bg-[#18181b] text-[#f472b6] border border-[#f472b6]/40'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#f472b6]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#f472b6]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 mt-2 border-t border-[#27272a] space-y-2">
            <button
              onClick={() => handleSelectPage('booking')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#f472b6]/20 flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Your Event</span>
            </button>
            <button
              onClick={() => handleSelectPage('admin')}
              className="w-full py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-[#f472b6] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#f472b6]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
