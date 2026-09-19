export type AppPage = 'home' | 'about' | 'bars' | 'menu' | 'booking' | 'admin';

export type EventType = 
  | 'Wedding Reception' 
  | 'Corporate Gala & Launch' 
  | 'Birthday Soirée' 
  | 'Bridal Shower / Bachelorette' 
  | 'Anniversary Celebration' 
  | 'Fashion & Pop-Up Event'
  | 'Private Dinner Party';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface BarSetup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  dimensions: string;
  idealFor: string;
  features: string[];
  imageUrl: string;
}

export interface CocktailItem {
  id: string;
  name: string;
  category: 'Signature' | 'Classic' | 'Zero-Proof' | 'Seasonal';
  tagline: string;
  alcoholBase: string;
  flavorNotes: string[];
  ingredients: string[];
  garnish: string;
  glassware: 'Coupe Glass' | 'Flute' | 'Highball' | 'Rocks Glass' | 'Martini Glass';
  isPopular?: boolean;
  colorTone: 'pink' | 'noir' | 'champagne' | 'rose';
  imageUrl: string;
}

export interface BarPackage {
  id: string;
  name: string;
  subtitle: string;
  priceStartingAt: number;
  guestRange: string;
  durationHours: number;
  bartendersCount: number;
  cocktailsIncluded: number;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  priceType: 'flat' | 'per_guest';
  description: string;
  category: 'Experience' | 'Presentation' | 'Staffing' | 'Beverage';
  iconName: string;
}

export interface DrinkCalculatorInputs {
  guestCount: number;
  durationHours: number;
  eventVibe: 'light' | 'moderate' | 'lively';
  cocktailRatio: number; // 0-100
  wineRatio: number; // 0-100
  beerRatio: number; // 0-100
  mocktailRatio: number; // 0-100
  includeChampagneToast: boolean;
}

export interface DrinkCalculatorResults {
  totalDrinksNeeded: number;
  cocktailsCount: number;
  spiritBottlesNeeded: number;
  wineBottlesNeeded: number;
  beerCasesNeeded: number;
  mocktailsCount: number;
  champagneBottlesNeeded: number;
  iceLbsNeeded: number;
  recommendedBartenders: number;
  recommendedBarSetups: number;
  estimatedPackageCost: number;
}

export interface BookingOrder {
  id: string;
  referenceCode: string;
  createdAt: string;
  status: BookingStatus;
  
  // Client & Planner Info
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  isPlanner: boolean;
  plannerCompany?: string;

  // Event Details
  eventType: EventType;
  eventDate: string;
  eventTime: string;
  eventDurationHours: number;
  guestCount: number;
  venueName: string;
  venueCity: string;
  isOutdoor: boolean;

  // Service Selections
  packageId: string;
  packageName: string;
  barSetupId: string;
  barSetupName: string;
  selectedCocktailIds: string[];
  selectedAddOnIds: string[];
  
  // Pricing Breakdown
  basePrice: number;
  addOnsPrice: number;
  travelFee: number;
  taxAmount: number;
  totalAmount: number;
  depositPaid: number;
  depositStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid';

  // Notes
  specialRequests?: string;
  adminNotes?: string;
  synced_to_supabase?: boolean;
}
