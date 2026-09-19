import React, { useState, useEffect } from 'react';
import { 
  BookingOrder, 
  EventType, 
  AppPage 
} from '../types';
import { 
  PACKAGES, 
  BAR_SETUPS, 
  SIGNATURE_COCKTAILS, 
  ADD_ONS 
} from '../data/barData';
import { 
  CalendarCheck, 
  Check, 
  Wine, 
  Sparkles, 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Plus, 
  Minus,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingPageProps {
  initialGuestCount?: number;
  initialDurationHours?: number;
  initialPackageId?: string;
  onBookingSubmitted: (newBooking: BookingOrder) => void;
  onNavigate: (page: AppPage) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  initialGuestCount = 100,
  initialDurationHours = 4,
  initialPackageId = 'pkg-pink-velvet',
  onBookingSubmitted,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isPlanner, setIsPlanner] = useState(false);
  const [plannerCompany, setPlannerCompany] = useState('');

  const [eventType, setEventType] = useState<EventType>('Wedding Reception');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('16:00');
  const [durationHours, setDurationHours] = useState(initialDurationHours);
  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [venueName, setVenueName] = useState('');
  const [venueCity, setVenueCity] = useState('');
  const [isOutdoor, setIsOutdoor] = useState(true);

  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
  const [selectedBarSetupId, setSelectedBarSetupId] = useState('setup-vintage-trailer');
  const [selectedCocktailIds, setSelectedCocktailIds] = useState<string[]>([
    'cocktail-cosmo-2',
    'cocktail-blush-spritz',
    'cocktail-smoked-paloma'
  ]);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(['addon-champagne-tower']);
  const [specialRequests, setSpecialRequests] = useState('');

  // Confirmation state
  const [submittedOrder, setSubmittedOrder] = useState<BookingOrder | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialPackageId) setSelectedPackageId(initialPackageId);
    if (initialGuestCount) setGuestCount(initialGuestCount);
    if (initialDurationHours) setDurationHours(initialDurationHours);
  }, [initialPackageId, initialGuestCount, initialDurationHours]);

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[0];
  const selectedBarSetup = BAR_SETUPS.find((b) => b.id === selectedBarSetupId) || BAR_SETUPS[0];

  // Pricing Calculation
  const calculatePricing = () => {
    const base = selectedPackage.priceStartingAt;
    
    // Scale guest adjustment if above standard package threshold
    let guestAdjustment = 0;
    if (selectedPackage.id === 'pkg-pink-velvet' && guestCount > 100) {
      guestAdjustment = (guestCount - 100) * 12;
    } else if (selectedPackage.id === 'pkg-cosmo-luxe' && guestCount > 180) {
      guestAdjustment = (guestCount - 180) * 14;
    } else if (selectedPackage.id === 'pkg-petite-sip' && guestCount > 50) {
      guestAdjustment = (guestCount - 50) * 12;
    }

    // Addons price
    let addonsTotal = 0;
    selectedAddOnIds.forEach((addonId) => {
      const addon = ADD_ONS.find((a) => a.id === addonId);
      if (addon) {
        addonsTotal += addon.price;
      }
    });

    const travelFee = 80;
    const subtotal = base + guestAdjustment + addonsTotal + travelFee;
    const tax = Math.round(subtotal * 0.0825 * 10) / 10;
    const total = subtotal + tax;
    const deposit = Math.round(total * 0.4); // 40% retainer

    return {
      base: base + guestAdjustment,
      addonsTotal,
      travelFee,
      tax,
      total,
      deposit
    };
  };

  const pricing = calculatePricing();

  const handleToggleCocktail = (cocktailId: string) => {
    if (selectedCocktailIds.includes(cocktailId)) {
      if (selectedCocktailIds.length <= 1) return; // keep at least 1
      setSelectedCocktailIds(selectedCocktailIds.filter((id) => id !== cocktailId));
    } else {
      if (selectedCocktailIds.length >= selectedPackage.cocktailsIncluded + 1) {
        // limit to package allowances + 1 extra max
        return;
      }
      setSelectedCocktailIds([...selectedCocktailIds, cocktailId]);
    }
  };

  const handleToggleAddOn = (addonId: string) => {
    if (selectedAddOnIds.includes(addonId)) {
      setSelectedAddOnIds(selectedAddOnIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddOnIds([...selectedAddOnIds, addonId]);
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!eventDate) errors.eventDate = 'Please select your celebration date';
      if (!venueCity) errors.venueCity = 'Please enter city or location';
      if (guestCount < 10) errors.guestCount = 'Guest count must be at least 10';
    }

    if (currentStep === 5) {
      if (!clientName.trim()) errors.clientName = 'Full Name is required';
      if (!clientEmail.trim() || !clientEmail.includes('@')) errors.clientEmail = 'Valid email is required';
      if (!clientPhone.trim()) errors.clientPhone = 'Phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `CMB-${randomNum}`;

    const newOrder: BookingOrder = {
      id: `bk-${Date.now()}`,
      referenceCode,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      clientName,
      clientEmail,
      clientPhone,
      isPlanner,
      plannerCompany: isPlanner ? plannerCompany : undefined,
      eventType,
      eventDate: eventDate || '2026-11-14',
      eventTime,
      eventDurationHours: durationHours,
      guestCount,
      venueName: venueName || 'Private Venue',
      venueCity: venueCity || 'Los Angeles, CA',
      isOutdoor,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      barSetupId: selectedBarSetup.id,
      barSetupName: selectedBarSetup.name,
      selectedCocktailIds,
      selectedAddOnIds,
      basePrice: pricing.base,
      addOnsPrice: pricing.addonsTotal,
      travelFee: pricing.travelFee,
      taxAmount: pricing.tax,
      totalAmount: pricing.total,
      depositPaid: 0,
      depositStatus: 'Unpaid',
      specialRequests: specialRequests.trim() || undefined,
      adminNotes: isPlanner ? `Booked via Event Planner: ${plannerCompany || clientName}. Review bar footprint.` : undefined
    };

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fbcfe8', '#ffffff', '#db2777']
    });

    onBookingSubmitted(newOrder);
    setSubmittedOrder(newOrder);
  };

  // If order was successfully submitted, display confirmation view
  if (submittedOrder) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
        <div className="bg-[#121216] border border-[#f472b6]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
          <div className="w-16 h-16 rounded-full bg-[#f472b6]/20 border border-[#f472b6] flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#f472b6]" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold">
            Booking Inquiry Received
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            Cheers, {submittedOrder.clientName}!
          </h1>
          <p className="text-sm text-zinc-300 max-w-lg mx-auto mt-2">
            Your custom mobile bar reservation has been submitted. Our concierge team is reviewing your date and will confirm your date within 24 hours.
          </p>

          {/* Reference Badge & Cloud Sync Status */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46]">
              <span className="text-xs text-zinc-400">Booking Reference:</span>
              <span className="font-mono text-sm font-bold text-[#fbcfe8] tracking-wider">
                {submittedOrder.referenceCode}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Saved to Database & Cloud Queue</span>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="mt-8 bg-[#09090b] border border-[#27272a] rounded-2xl p-6 text-left max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Selected Package</p>
                <p className="text-sm font-bold text-white mt-0.5">{submittedOrder.packageName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400 uppercase tracking-wider">Estimated Total</p>
                <p className="text-base font-bold text-[#fbcfe8]">${submittedOrder.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block">Date</span>
                <span className="text-zinc-200 font-medium">{submittedOrder.eventDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Guests</span>
                <span className="text-zinc-200 font-medium">{submittedOrder.guestCount} Guests</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Duration</span>
                <span className="text-zinc-200 font-medium">{submittedOrder.eventDurationHours} Hours</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Mobile Setup</span>
                <span className="text-zinc-200 font-medium truncate block">{submittedOrder.barSetupName}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272a]">
              <span className="text-zinc-500 text-xs block mb-1">Curated Signature Cocktails:</span>
              <div className="flex flex-wrap gap-1.5">
                {submittedOrder.selectedCocktailIds.map((cid) => {
                  const cocktail = SIGNATURE_COCKTAILS.find((c) => c.id === cid);
                  return (
                    <span key={cid} className="px-2.5 py-1 rounded-full bg-[#18181b] border border-[#3f3f46] text-[11px] text-[#fbcfe8]">
                      {cocktail?.name || cid}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="return-home-btn"
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#f472b6]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>Back to Home</span>
            </button>
            <button
              id="explore-bars-btn"
              onClick={() => onNavigate('bars')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors"
            >
              Explore Mobile Bars
            </button>
            <button
              id="view-menu-btn"
              onClick={() => onNavigate('menu')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors"
            >
              View Menu & Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Steps Progress */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 text-[#f472b6] text-xs font-semibold uppercase tracking-widest mb-3">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Seamless Event Booking Wizard</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Book Cosmo Mobile Bar
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Craft your bespoke mobile bar experience in 5 simple steps. Real-time pricing, no hidden fees, certified bartenders.
        </p>

        {/* Step Indicator Bar */}
        <div className="mt-8">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            {/* Background line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-zinc-800 -z-0" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#f472b6] transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />

            {[
              { num: 1, label: 'Details' },
              { num: 2, label: 'Bar Setup' },
              { num: 3, label: 'Cocktails' },
              { num: 4, label: 'Add-Ons' },
              { num: 5, label: 'Planner / Contact' }
            ].map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  id={`step-indicator-${step.num}`}
                  onClick={() => {
                    if (step.num < currentStep) setCurrentStep(step.num);
                  }}
                  className="flex flex-col items-center gap-1.5 focus:outline-none z-10"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#f472b6] text-[#09090b]'
                        : isCurrent
                        ? 'bg-[#09090b] text-[#f472b6] border-2 border-[#f472b6] shadow-md shadow-[#f472b6]/30'
                        : 'bg-[#18181b] text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${isCurrent ? 'text-[#f472b6]' : 'text-zinc-400'}`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form Layout with Sticky Pricing Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wizard Form Steps (Left 8 cols) */}
        <div className="lg:col-span-8 bg-[#121216] border border-[#27272a] rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmitBooking}>
            {/* STEP 1: EVENT DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#27272a] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#f472b6]" />
                    Step 1: Event Details & Location
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Tell us when and where your celebration will take place.
                  </p>
                </div>

                {/* Event Type Grid */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-300 font-medium">Event Type / Occasion</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Wedding Reception',
                      'Corporate Gala & Launch',
                      'Birthday Soirée',
                      'Bridal Shower / Bachelorette',
                      'Anniversary Celebration',
                      'Fashion & Pop-Up Event'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEventType(type as EventType)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          eventType === type
                            ? 'bg-[#18181b] border-[#f472b6] text-[#fbcfe8] shadow-sm shadow-[#f472b6]/20'
                            : 'bg-[#18181b]/50 border-[#27272a] text-zinc-400 hover:border-[#3f3f46] hover:text-zinc-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Event Date *</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border text-white text-xs focus:outline-none focus:border-[#f472b6] ${
                        formErrors.eventDate ? 'border-rose-500' : 'border-[#27272a]'
                      }`}
                    />
                    {formErrors.eventDate && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.eventDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Start Time</label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-white text-xs focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Service Duration</label>
                    <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-xl px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setDurationHours(Math.max(2, durationHours - 0.5))}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center font-bold text-xs text-white">
                        {durationHours} Hours
                      </span>
                      <button
                        type="button"
                        onClick={() => setDurationHours(Math.min(8, durationHours + 0.5))}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Guest Count & Venue Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-zinc-300 font-medium">Estimated Guest Count</label>
                      <span className="text-[#f472b6] font-bold">{guestCount} Guests</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={350}
                      step={5}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full h-2 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-[#f472b6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Venue Setting</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsOutdoor(true)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                          isOutdoor
                            ? 'bg-[#18181b] border-[#f472b6] text-[#fbcfe8]'
                            : 'bg-[#18181b]/50 border-[#27272a] text-zinc-400'
                        }`}
                      >
                        Outdoor / Lawn / Tent
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOutdoor(false)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                          !isOutdoor
                            ? 'bg-[#18181b] border-[#f472b6] text-[#fbcfe8]'
                            : 'bg-[#18181b]/50 border-[#27272a] text-zinc-400'
                        }`}
                      >
                        Indoor / Ballroom
                      </button>
                    </div>
                  </div>
                </div>

                {/* Venue Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Venue Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. The Glasshouse Estate, Private Lawn"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-white text-xs focus:outline-none focus:border-[#f472b6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">City / Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Malibu, Beverly Hills, CA"
                      value={venueCity}
                      onChange={(e) => setVenueCity(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border text-white text-xs focus:outline-none focus:border-[#f472b6] ${
                        formErrors.venueCity ? 'border-rose-500' : 'border-[#27272a]'
                      }`}
                    />
                    {formErrors.venueCity && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.venueCity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: BAR SETUP & PACKAGE SELECTION */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#27272a] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Wine className="w-5 h-5 text-[#f472b6]" />
                    Step 2: Choose Mobile Bar & Package
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Select your physical mobile bar station and service package.
                  </p>
                </div>

                {/* Mobile Bar Setups */}
                <div className="space-y-3">
                  <span className="text-xs text-zinc-300 font-medium">1. Choose Bar Setup Station</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {BAR_SETUPS.map((setup) => {
                      const isSelected = selectedBarSetupId === setup.id;
                      return (
                        <div
                          key={setup.id}
                          onClick={() => setSelectedBarSetupId(setup.id)}
                          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#18181b] border-[#f472b6] shadow-lg shadow-[#f472b6]/15 ring-1 ring-[#f472b6]'
                              : 'bg-[#18181b]/50 border-[#27272a] hover:border-[#3f3f46]'
                          }`}
                        >
                          <div>
                            <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                              <img
                                src={setup.imageUrl}
                                alt={setup.name}
                                className="w-full h-full object-cover"
                              />
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#f472b6] text-[#09090b] flex items-center justify-center font-bold">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-serif font-bold text-white">{setup.name}</h3>
                            <p className="text-[11px] text-[#fbcfe8] mt-0.5">{setup.tagline}</p>
                            <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2">{setup.description}</p>
                          </div>
                          <div className="mt-3 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                            {setup.dimensions}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Packages */}
                <div className="space-y-3 pt-4 border-t border-[#27272a]">
                  <span className="text-xs text-zinc-300 font-medium">2. Choose Bar Service Tier</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PACKAGES.map((pkg) => {
                      const isSelected = selectedPackageId === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#18181b] border-[#f472b6] shadow-lg shadow-[#f472b6]/15 ring-1 ring-[#f472b6]'
                              : 'bg-[#18181b]/50 border-[#27272a] hover:border-[#3f3f46]'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <div>
                                {pkg.badge && (
                                  <span className="text-[10px] uppercase tracking-widest bg-[#f472b6]/20 text-[#f472b6] font-bold px-2 py-0.5 rounded">
                                    {pkg.badge}
                                  </span>
                                )}
                                <h3 className="font-serif text-lg font-bold text-white mt-1">
                                  {pkg.name}
                                </h3>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-zinc-400 block">From</span>
                                <span className="font-serif text-xl font-bold text-[#fbcfe8]">
                                  ${pkg.priceStartingAt.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">{pkg.subtitle}</p>
                            
                            <ul className="mt-4 space-y-1.5 text-xs text-zinc-300">
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
                                <span>{pkg.cocktailsIncluded} Signature Cocktails included</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
                                <span>{pkg.bartendersCount} Certified Mixologists for {pkg.durationHours} hours</span>
                              </li>
                              <li className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
                                <span>Full crystal glassware, syrups & fresh citrus</span>
                              </li>
                            </ul>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                            <span className="text-zinc-500">{pkg.guestRange}</span>
                            <span className={`font-semibold ${isSelected ? 'text-[#f472b6]' : 'text-zinc-400'}`}>
                              {isSelected ? '✓ Selected Tier' : 'Click to Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: COCKTAIL MENU SELECTION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#27272a] pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#f472b6]" />
                        Step 3: Signature Cocktail Curation
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        Select {selectedPackage.cocktailsIncluded} craft drinks for your custom bar menu.
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 text-[#fbcfe8] font-semibold">
                      {selectedCocktailIds.length} Selected
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SIGNATURE_COCKTAILS.map((cocktail) => {
                    const isSelected = selectedCocktailIds.includes(cocktail.id);
                    return (
                      <div
                        key={cocktail.id}
                        onClick={() => handleToggleCocktail(cocktail.id)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex gap-4 ${
                          isSelected
                            ? 'bg-[#18181b] border-[#f472b6] shadow-md shadow-[#f472b6]/10 ring-1 ring-[#f472b6]'
                            : 'bg-[#18181b]/50 border-[#27272a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={cocktail.imageUrl}
                            alt={cocktail.name}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#f472b6] text-[#09090b] flex items-center justify-center font-bold">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="text-sm font-serif font-bold text-white">{cocktail.name}</h3>
                              <span className="text-[10px] text-[#f472b6] uppercase font-mono">
                                {cocktail.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{cocktail.tagline}</p>
                            <p className="text-[10px] text-[#fbcfe8] mt-1 font-mono">
                              Base: {cocktail.alcoholBase}
                            </p>
                          </div>

                          <div className="mt-2 text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800">
                            <span>Garnish: {cocktail.garnish.split('&')[0]}</span>
                            <span className={isSelected ? 'text-[#f472b6] font-bold' : 'text-zinc-500'}>
                              {isSelected ? 'Selected' : '+ Add'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] text-xs text-zinc-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#f472b6] shrink-0" />
                  <span>
                    Want a custom drink named after the host, couple, or brand? We formulate bespoke recipes during your 30-day pre-event tasting consultation!
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: LUXE ADD-ONS */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#27272a] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#f472b6]" />
                    Step 4: Luxe Upgrades & Add-Ons
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add high-impact visual showstoppers to wow your guests.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ADD_ONS.map((addon) => {
                    const isSelected = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddOn(addon.id)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#18181b] border-[#f472b6] shadow-md shadow-[#f472b6]/10 ring-1 ring-[#f472b6]'
                            : 'bg-[#18181b]/50 border-[#27272a] hover:border-[#3f3f46]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-[#f472b6] font-mono">
                              {addon.category}
                            </span>
                            <span className="font-serif text-base font-bold text-[#fbcfe8]">
                              +${addon.price}
                            </span>
                          </div>
                          <h3 className="text-sm font-serif font-bold text-white mt-1">{addon.name}</h3>
                          <p className="text-xs text-zinc-400 mt-1">{addon.description}</p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-zinc-500">Flat event fee</span>
                          <span className={`font-semibold ${isSelected ? 'text-[#f472b6]' : 'text-zinc-400'}`}>
                            {isSelected ? '✓ Added' : '+ Include'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT DETAILS & PLANNER INFO */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#27272a] pb-4">
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#f472b6]" />
                    Step 5: Contact & Event Planner Details
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Where should we send your formal quote, COI, and booking contract?
                  </p>
                </div>

                {/* Event Planner Toggle */}
                <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#f472b6]" />
                      <div>
                        <p className="text-xs text-white font-semibold">I am an Event Planner or Venue Coordinator</p>
                        <p className="text-[11px] text-zinc-400">Enables planner invoicing and custom COI processing</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPlanner}
                      onChange={(e) => setIsPlanner(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 text-[#f472b6] focus:ring-[#f472b6] accent-[#f472b6]"
                    />
                  </label>

                  {isPlanner && (
                    <div className="mt-3 pt-3 border-t border-zinc-800 animate-in fade-in">
                      <label className="text-xs text-zinc-300 font-medium block mb-1">
                        Event Planning Agency / Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Vance Luxury Events, Apex Planning"
                        value={plannerCompany}
                        onChange={(e) => setPlannerCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-[#3f3f46] text-white text-xs focus:outline-none focus:border-[#f472b6]"
                      />
                    </div>
                  )}
                </div>

                {/* Client Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Camilla Vance"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border text-white text-xs focus:outline-none focus:border-[#f472b6] ${
                        formErrors.clientName ? 'border-rose-500' : 'border-[#27272a]'
                      }`}
                    />
                    {formErrors.clientName && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.clientName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. camilla@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border text-white text-xs focus:outline-none focus:border-[#f472b6] ${
                        formErrors.clientEmail ? 'border-rose-500' : 'border-[#27272a]'
                      }`}
                    />
                    {formErrors.clientEmail && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.clientEmail}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-300 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. (555) 234-8910"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border text-white text-xs focus:outline-none focus:border-[#f472b6] ${
                        formErrors.clientPhone ? 'border-rose-500' : 'border-[#27272a]'
                      }`}
                    />
                    {formErrors.clientPhone && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.clientPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Requests / Vision */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-300 font-medium">
                    Special Requests, Custom Cocktail Vision, or Load-In Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Couple wants signature drink named 'The Pink Velvet'. Load-in is via the garden service gate."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-white text-xs focus:outline-none focus:border-[#f472b6]"
                  />
                </div>
              </div>
            )}

            {/* Navigation & Submit Buttons */}
            <div className="mt-8 pt-6 border-t border-[#27272a] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  id="wizard-prev-btn"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl bg-[#18181b] border border-[#27272a] text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  id="wizard-next-btn"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-[#f472b6] hover:bg-[#fbcfe8] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-md shadow-[#f472b6]/20 transition-all flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  id="wizard-submit-btn"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#f472b6] via-[#fbcfe8] to-[#f472b6] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-xl shadow-[#f472b6]/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Submit Event Reservation</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Live Order & Price Breakdown Sidebar (Right 4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-[#121216] border border-[#f472b6]/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-widest text-[#f472b6] font-bold block mb-1">
              Live Event Estimate
            </span>
            <h3 className="font-serif text-xl font-bold text-white">
              {selectedPackage.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {guestCount} Guests • {durationHours} Hours Service
            </p>

            {/* Selected Spec Pills */}
            <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Bar Setup:</span>
                <span className="text-white font-medium truncate max-w-[170px] text-right">
                  {selectedBarSetup.name}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Bartenders:</span>
                <span className="text-white font-medium">
                  {selectedPackage.bartendersCount} Certified Mixologists
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Signatures:</span>
                <span className="text-[#fbcfe8] font-medium">
                  {selectedCocktailIds.length} Cocktails
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Add-Ons:</span>
                <span className="text-white font-medium">
                  {selectedAddOnIds.length} Selected
                </span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Base Package & Guests:</span>
                <span>${pricing.base.toLocaleString()}</span>
              </div>
              {pricing.addonsTotal > 0 && (
                <div className="flex justify-between text-zinc-300">
                  <span>Selected Add-Ons:</span>
                  <span className="text-[#fbcfe8]">+${pricing.addonsTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Logistics & Travel:</span>
                <span>${pricing.travelFee}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>State Tax (Est.):</span>
                <span>${pricing.tax}</span>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                    Estimated Total
                  </span>
                  <span className="text-[10px] text-zinc-500">Includes complete setup & bar kit</span>
                </div>
                <span className="font-serif text-2xl font-bold text-white">
                  ${pricing.total.toLocaleString()}
                </span>
              </div>

              <div className="mt-2 p-2.5 rounded-xl bg-[#f472b6]/10 border border-[#f472b6]/20 flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">40% Retainer to Lock Date:</span>
                <span className="text-[#fbcfe8] font-bold">${pricing.deposit.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>Full $2M Liquor & General Liability COI Provided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
