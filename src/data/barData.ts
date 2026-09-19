import { BarPackage, BarSetup, CocktailItem, AddOnItem, BookingOrder } from '../types';

export const BAR_SETUPS: BarSetup[] = [
  {
    id: 'setup-vintage-trailer',
    name: 'The Onyx & Rose Vintage Horse Trailer',
    tagline: 'Our flagship mobile cocktail salon on wheels',
    description: 'A custom-restored vintage horse trailer finished in matte black satin with illuminated baby-pink awnings, polished brass draft taps, twin service windows, and an integrated ambient sound system.',
    dimensions: '14ft L x 7.5ft W x 8ft H',
    idealFor: 'Outdoor weddings, garden galas, estate lawns & festival VIP lounges (100–350+ guests)',
    features: [
      '4 refrigerated craft beer & prosecco draft taps',
      'Twin high-volume cocktail service wells',
      'Custom neon "Sip in Pink" marquee sign',
      'Integrated Edison warm glow string lighting',
      'Dual battery + quiet generator option included'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'setup-blush-marble',
    name: 'The Noir & Fluted Pink Satellite Bar',
    tagline: 'Modular indoor/outdoor modular luxury station',
    description: 'An ultra-chic 8-foot portable bar featuring ribbed baby pink acoustic fluting, a dark honed Nero Marquina marble top, gold trim, and a rear illuminated back-bar bottle riser.',
    dimensions: '8ft L x 3ft D x 42in H (Modular)',
    idealFor: 'Penthouses, ballroom receptions, art galleries & indoor venues (50–200 guests)',
    features: [
      'Fits standard passenger and freight elevators',
      'Full speed-rail & insulated craft ice well',
      'Rear brass arch for floral or neon monogram mount',
      'Wireless warm under-counter halo glow',
      'Rapid 30-minute discreet load-in and breakdown'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'setup-neon-cart',
    name: 'The Petite Blush & Champagne Cart',
    tagline: 'Intimate, whimsical & social-media ready',
    description: 'A bespoke compact rolling bar cart handcrafted in midnight black with blush velvet side panels, twin champagne bucket inserts, and a custom arch canopy.',
    dimensions: '5ft L x 2.5ft W x 6.5ft H',
    idealFor: 'Bridal showers, cocktail hours, intimate terrace parties & photo-ops (25–80 guests)',
    features: [
      'Holds up to 60 chilled champagne coupes',
      'Custom acrylic personalized cocktail menu stand',
      'Self-contained dry ice smoke demonstration station',
      'Effortless movement between cocktail hour and dinner'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80'
  }
];

export const SIGNATURE_COCKTAILS: CocktailItem[] = [
  {
    id: 'cocktail-cosmo-2',
    name: 'The Pink Cosmopolitan 2.0',
    category: 'Signature',
    tagline: 'Our modern reinterpretation of the iconic Manhattan classic',
    alcoholBase: 'Ketel One Vodka & Cointreau',
    flavorNotes: ['Crisp Cranberry-Hibiscus Cordial', 'Kaffir Lime', 'White Peach Essence'],
    ingredients: ['Citroen Vodka', 'Triple Sec', 'Artisanal White Cranberry Cordial', 'Hibiscus Foam', 'Fresh Key Lime'],
    garnish: 'Candied Hibiscus Flower & Rose Gold Flakes',
    glassware: 'Coupe Glass',
    isPopular: true,
    colorTone: 'pink',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cocktail-blush-spritz',
    name: 'Blush Botanical French Spritz',
    category: 'Signature',
    tagline: 'Effervescent, floral, and deeply refreshing for golden hour',
    alcoholBase: 'Empress 1908 Gin & Lillet Rosé',
    flavorNotes: ['Elderflower', 'Pink Grapefruit', 'Sparkling Brut Champagne'],
    ingredients: ['Empress Indigo Gin', 'Lillet Rosé Vermouth', 'St-Germain', 'Pink Grapefruit Cordial', 'Organic Brut Prosecco'],
    garnish: 'Dehydrated Blood Orange Wheel & Fresh Rosemary Sprig',
    glassware: 'Flute',
    isPopular: true,
    colorTone: 'rose',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cocktail-smoked-paloma',
    name: 'Velvet Smoked Rose Paloma',
    category: 'Signature',
    tagline: 'Earthy agave warmth meets bright ruby red citrus',
    alcoholBase: 'Casamigos Blanco & Mezcal Unión',
    flavorNotes: ['Smoky Agave', 'Fresh Pink Pomelo', 'Himalayan Pink Salt Rim'],
    ingredients: ['Tequila Blanco', 'Artisanal Mezcal Mist', 'Fresh Grapefruit Juice', 'Agave Nectar', 'Pink Peppercorn Soda'],
    garnish: 'Pink Himalayan Salt & Dried Grapefruit Crescent',
    glassware: 'Highball',
    isPopular: true,
    colorTone: 'pink',
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cocktail-onyx-espresso',
    name: 'Onyx Black Pearl Espresso Martini',
    category: 'Signature',
    tagline: 'Rich, velvet, and crowned with dark cocoa cream',
    alcoholBase: 'Grey Goose & Kahlúa Especial',
    flavorNotes: ['Single-Origin Cold Brew', 'Dark Cacao', 'Vanilla Bean froth'],
    ingredients: ['Vanilla Vodka', 'Coffee Liqueur', 'Freshly Pulled Espresso', 'Demerara Syrup', 'Black Truffle Salt Dash'],
    garnish: 'Trio of Torched Coffee Beans & Pink Sugar Dust',
    glassware: 'Martini Glass',
    isPopular: true,
    colorTone: 'noir',
    imageUrl: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cocktail-midnight-bourbon',
    name: 'Midnight Velvet Blackberry Sour',
    category: 'Classic',
    tagline: 'Bold Kentucky bourbon sweetened with muddled Oregon blackberries',
    alcoholBase: 'Woodford Reserve Bourbon',
    flavorNotes: ['Oak & Caramel', 'Wild Blackberries', 'Silky Aquafaba Foam'],
    ingredients: ['Straight Bourbon Whiskey', 'Fresh Lemon Juice', 'Blackberry Purée', 'Cardamom Simple Syrup', 'Foaming Bitters'],
    garnish: 'Torched Rosemary & Brandied Black Cherry',
    glassware: 'Rocks Glass',
    colorTone: 'noir',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cocktail-dragonfruit-mocktail',
    name: 'Lychee & Pink Dragonfruit Glow (Zero-Proof)',
    category: 'Zero-Proof',
    tagline: 'Sophisticated botanical elixir crafted without a single drop of alcohol',
    alcoholBase: 'Seedlip Grove 42 Non-Alcoholic Spirit',
    flavorNotes: ['Sweet Lychee', 'Vibrant Dragonfruit', 'Kaffir Lime Zing'],
    ingredients: ['Distilled Botanical Spirit', 'Cold-Pressed Pink Pitaya', 'Lychee Nectar', 'Fresh Lime', 'Botanical Tonic Water'],
    garnish: 'Fresh Dragonfruit Spear & Edible Viola Blossom',
    glassware: 'Coupe Glass',
    isPopular: true,
    colorTone: 'pink',
    imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cocktail-champagne-kiss',
    name: 'The Champagne Kiss & Rosewater Fizz',
    category: 'Seasonal',
    tagline: 'Sparkling celebratory nectar kissed with organic Persian rosewater',
    alcoholBase: 'Veuve Clicquot / Local Brut',
    flavorNotes: ['Crisp Green Apple', 'Brioche', 'Subtle Rose Petal'],
    ingredients: ['Brut Champagne', 'Rosewater Infused Sugar Cube', 'Peychaud\'s Bitters', 'Wild Strawberry Liqueur mist'],
    garnish: 'Organic Pink Rose Petals floating in crystal coupe',
    glassware: 'Flute',
    colorTone: 'champagne',
    imageUrl: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80'
  }
];

export const PACKAGES: BarPackage[] = [
  {
    id: 'pkg-pink-velvet',
    name: 'The Pink Velvet Soirée',
    subtitle: 'Our most requested, Instagram-worthy full cocktail package',
    priceStartingAt: 1650,
    guestRange: 'Up to 100 Guests',
    durationHours: 4,
    bartendersCount: 2,
    cocktailsIncluded: 3,
    isPopular: true,
    badge: 'Planner Favorite',
    features: [
      'Choice of Mobile Bar Setup (Horse Trailer or Fluted Bar)',
      '3 Handcrafted Signature Cocktails + 1 Zero-Proof Mocktail',
      'Beer, Wine & Seltzer Pouring Service included',
      '2 TIPS-Certified Master Mixologists for 4 hours of service',
      'Handcrafted house-made syrups, fresh juices & dehydrated garnishes',
      'Full crystal-cut glassware (Coupes, Highballs, Tumblers)',
      'Custom framed pink acrylic bar menu with custom wording',
      'All craft cube ice & bar tools (shakers, strainers, muddlers)',
      'Setup 2 hours prior and complete cleanup included'
    ]
  },
  {
    id: 'pkg-cosmo-luxe',
    name: 'The Cosmopolitan Luxe Experience',
    subtitle: 'The pinnacle of luxury beverage catering for unforgettable milestones',
    priceStartingAt: 2450,
    guestRange: 'Up to 180 Guests',
    durationHours: 5,
    bartendersCount: 3,
    cocktailsIncluded: 4,
    badge: 'Ultra VIP',
    features: [
      'Premium Vintage Horse Trailer or Luxury Satellite Bar + Neon Cart',
      '4 Bespoke Signature Cocktails + 2 Gourmet Mocktails',
      'Complimentary Champagne Toast pour for all guests',
      '3 TIPS-Certified Mixologists + 1 Dedicated Bar Back / Busser',
      'Personalized Edible Cocktail Toppers with your monogram or logo',
      'Smoked Cocktail Cloche Experience station for photo ops',
      'Luxe gold-rimmed crystal glassware package',
      'Hydration station with infused strawberry-mint & cucumber waters',
      'Full liquor liability & general commercial insurance certificate for venue'
    ]
  },
  {
    id: 'pkg-petite-sip',
    name: 'The Petite Sip & Pour',
    subtitle: 'Tailored specifically for intimate gatherings & chic cocktail hours',
    priceStartingAt: 1100,
    guestRange: 'Up to 50 Guests',
    durationHours: 3,
    bartendersCount: 1,
    cocktailsIncluded: 2,
    features: [
      'Noir & Fluted Pink Satellite Bar or Champagne Cart',
      '2 Custom Signature Cocktails + Beer & Wine service',
      '1 Certified Lead Mixologist for 3 active hours',
      'All organic mixers, fresh-squeezed citrus & garnishes',
      'Eco-luxe biodegradable or acrylic drinkware (crystal upgrade available)',
      'Custom printed baby pink menu board',
      'Full bar tools, cooler chests & beverage styling'
    ]
  },
  {
    id: 'pkg-zero-proof',
    name: 'The Non-Alcoholic Botanical Lounge',
    subtitle: 'Elevated sober-curious & health-conscious beverage elegance',
    priceStartingAt: 1250,
    guestRange: 'Up to 75 Guests',
    durationHours: 3.5,
    bartendersCount: 2,
    cocktailsIncluded: 4,
    features: [
      '4 Artisanal zero-proof botanical cocktails using distilled botanicals',
      'Cold-pressed juices, infused wellness tonics & functional elixirs',
      'Fluted pink satellite bar with glowing marquee',
      'Fresh botanical garnishes, edible gold flakes & orchid blossoms',
      'Full crystal glassware, custom signage and hydration bar'
    ]
  }
];

export const ADD_ONS: AddOnItem[] = [
  {
    id: 'addon-champagne-tower',
    name: '5-Tier Crystal Champagne Tower',
    price: 350,
    priceType: 'flat',
    description: 'A breathtaking 55-glass vintage coupe champagne tower with baby pink floral spill tray & sparkler presentation.',
    category: 'Experience',
    iconName: 'Wine'
  },
  {
    id: 'addon-edible-toppers',
    name: 'Custom Edible Cocktail Toppers (100 pcs)',
    price: 150,
    priceType: 'flat',
    description: 'High-res printed edible cocktail foam wafers with bride/groom initials, company logos, or photos.',
    category: 'Presentation',
    iconName: 'Sparkles'
  },
  {
    id: 'addon-monogram-ice',
    name: 'Hand-Stamped Monogram Ice Spheres',
    price: 180,
    priceType: 'flat',
    description: 'Crystal-clear 2.5" craft ice cubes individually stamped with custom brass monogram initials.',
    category: 'Presentation',
    iconName: 'Layers'
  },
  {
    id: 'addon-smoked-station',
    name: 'Smoked Cloche Cocktail Experience',
    price: 220,
    priceType: 'flat',
    description: 'Applewood & cherrywood smoke infusion dome tableside demonstration for bourbon & mezcal drinks.',
    category: 'Experience',
    iconName: 'Flame'
  },
  {
    id: 'addon-hydration-station',
    name: 'Artisanal Hydration & Lemonade Bar',
    price: 120,
    priceType: 'flat',
    description: 'Twin 3-gallon glass dispensers featuring Strawberry-Rosemary Lemonade and Cucumber-Mint detox water.',
    category: 'Beverage',
    iconName: 'GlassWater'
  },
  {
    id: 'addon-extra-bartender-hour',
    name: 'Additional Service Hour (Per Bartender)',
    price: 75,
    priceType: 'flat',
    description: 'Extend the party! Keeps the cocktails flowing smoothly past scheduled closing time.',
    category: 'Staffing',
    iconName: 'Clock'
  }
];

export const INITIAL_BOOKINGS: BookingOrder[] = [
  {
    id: 'bk-1',
    referenceCode: 'CMB-8491',
    createdAt: '2026-09-15',
    status: 'confirmed',
    clientName: 'Camilla & Julian Vance',
    clientEmail: 'c.vance@lifestylegroup.com',
    clientPhone: '(555) 234-8910',
    isPlanner: true,
    plannerCompany: 'Vance Luxury Events',
    eventType: 'Wedding Reception',
    eventDate: '2026-10-24',
    eventTime: '16:00',
    eventDurationHours: 5,
    guestCount: 140,
    venueName: 'The Glasshouse Estate',
    venueCity: 'Beverly Hills, CA',
    isOutdoor: true,
    packageId: 'pkg-cosmo-luxe',
    packageName: 'The Cosmopolitan Luxe Experience',
    barSetupId: 'setup-vintage-trailer',
    barSetupName: 'The Onyx & Rose Vintage Horse Trailer',
    selectedCocktailIds: ['cocktail-cosmo-2', 'cocktail-blush-spritz', 'cocktail-smoked-paloma', 'cocktail-onyx-espresso'],
    selectedAddOnIds: ['addon-champagne-tower', 'addon-monogram-ice'],
    basePrice: 2450,
    addOnsPrice: 530,
    travelFee: 100,
    taxAmount: 246.4,
    totalAmount: 3326.4,
    depositPaid: 1500,
    depositStatus: 'Deposit Paid',
    specialRequests: 'Couple requested extra pink dragonfruit cubes and a grand champagne tower pour at 6:30 PM sharp after first dance.',
    adminNotes: 'Assigned lead mixologist Marcus & bar back Lily. Trailer load-in scheduled for 1:30 PM via north garden gate.'
  },
  {
    id: 'bk-2',
    referenceCode: 'CMB-8492',
    createdAt: '2026-09-17',
    status: 'pending',
    clientName: 'Eleanor Sterling',
    clientEmail: 'eleanor@sterlingpr.com',
    clientPhone: '(555) 902-3341',
    isPlanner: false,
    eventType: 'Fashion & Pop-Up Event',
    eventDate: '2026-11-05',
    eventTime: '18:30',
    eventDurationHours: 4,
    guestCount: 95,
    venueName: 'Loft 44 Gallery',
    venueCity: 'Downtown Arts District',
    isOutdoor: false,
    packageId: 'pkg-pink-velvet',
    packageName: 'The Pink Velvet Soirée',
    barSetupId: 'setup-blush-marble',
    barSetupName: 'The Noir & Fluted Pink Satellite Bar',
    selectedCocktailIds: ['cocktail-cosmo-2', 'cocktail-blush-spritz', 'cocktail-dragonfruit-mocktail'],
    selectedAddOnIds: ['addon-edible-toppers'],
    basePrice: 1650,
    addOnsPrice: 150,
    travelFee: 50,
    taxAmount: 148.0,
    totalAmount: 1998.0,
    depositPaid: 0,
    depositStatus: 'Unpaid',
    specialRequests: 'Need custom printed logo toppers with Sterling PR brand logo. High-contrast baby pink and black aesthetic required.',
    adminNotes: 'Awaiting venue COI approval before confirming deposit.'
  },
  {
    id: 'bk-3',
    referenceCode: 'CMB-8488',
    createdAt: '2026-09-10',
    status: 'in_progress',
    clientName: 'Victoria Hastings',
    clientEmail: 'victoria.hastings@gmail.com',
    clientPhone: '(555) 478-1129',
    isPlanner: false,
    eventType: 'Birthday Soirée',
    eventDate: '2026-09-28',
    eventTime: '19:00',
    eventDurationHours: 4,
    guestCount: 60,
    venueName: 'Private Residence & Terrace',
    venueCity: 'Malibu, CA',
    isOutdoor: true,
    packageId: 'pkg-pink-velvet',
    packageName: 'The Pink Velvet Soirée',
    barSetupId: 'setup-neon-cart',
    barSetupName: 'The Petite Blush & Champagne Cart',
    selectedCocktailIds: ['cocktail-cosmo-2', 'cocktail-onyx-espresso', 'cocktail-smoked-paloma'],
    selectedAddOnIds: ['addon-smoked-station', 'addon-hydration-station'],
    basePrice: 1650,
    addOnsPrice: 340,
    travelFee: 80,
    taxAmount: 165.6,
    totalAmount: 2235.6,
    depositPaid: 2235.6,
    depositStatus: 'Fully Paid',
    specialRequests: '30th Birthday theme: "Midnight Glam & Rose Gold". Espresso martinis are the centerpiece of the evening.',
    adminNotes: 'Pre-batched cold brew ready. Dry ice smoke demonstration approved by homeowner.'
  },
  {
    id: 'bk-4',
    referenceCode: 'CMB-8475',
    createdAt: '2026-08-28',
    status: 'completed',
    clientName: 'Jonathan Hayes (Aura Tech)',
    clientEmail: 'j.hayes@auratech.io',
    clientPhone: '(555) 881-9920',
    isPlanner: true,
    plannerCompany: 'Apex Corporate Experiences',
    eventType: 'Corporate Gala & Launch',
    eventDate: '2026-09-12',
    eventTime: '17:00',
    eventDurationHours: 5,
    guestCount: 220,
    venueName: 'Pacific Design Center',
    venueCity: 'West Hollywood, CA',
    isOutdoor: false,
    packageId: 'pkg-cosmo-luxe',
    packageName: 'The Cosmopolitan Luxe Experience',
    barSetupId: 'setup-blush-marble',
    barSetupName: 'The Noir & Fluted Pink Satellite Bar',
    selectedCocktailIds: ['cocktail-cosmo-2', 'cocktail-blush-spritz', 'cocktail-midnight-bourbon', 'cocktail-dragonfruit-mocktail'],
    selectedAddOnIds: ['addon-edible-toppers', 'addon-champagne-tower'],
    basePrice: 2450,
    addOnsPrice: 500,
    travelFee: 120,
    taxAmount: 245.6,
    totalAmount: 3315.6,
    depositPaid: 3315.6,
    depositStatus: 'Fully Paid',
    specialRequests: 'Corporate product launch. Brand colors were black and pink.',
    adminNotes: 'Event went brilliantly! Client left 5-star review and tipped crew.'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g-1',
    title: 'The Onyx Trailer at Golden Hour',
    category: 'Trailer Setup',
    location: 'Malibu Wine Country',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-2',
    title: 'Pink Cosmopolitan 2.0 with Hibiscus Veil',
    category: 'Cocktails',
    location: 'Beverly Hills Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-3',
    title: '5-Tier Coupe Champagne Tower Pour',
    category: 'Experience',
    location: 'The Glasshouse Gala',
    imageUrl: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-4',
    title: 'Fluted Blush Satellite Bar Styling',
    category: 'Trailer Setup',
    location: 'Penthouse Soirée',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-5',
    title: 'Smoked Rose Paloma with Himalayan Rim',
    category: 'Cocktails',
    location: 'Estate Lawn Party',
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-6',
    title: 'Onyx Cold Brew Espresso Martini Pour',
    category: 'Cocktails',
    location: 'Late Night Dance Floor',
    imageUrl: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-7',
    title: 'Pink Pitaya & Lychee Botanical Mocktail',
    category: 'Cocktails',
    location: 'Bridal Brunch',
    imageUrl: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'g-8',
    title: 'Certified Mixologists in Black & Pink Aprons',
    category: 'Experience',
    location: 'Private Art Soirée',
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80'
  }
];

export const FAQS = [
  {
    q: 'Do you provide the alcohol or does the host buy the alcohol?',
    a: 'In accordance with California / state liquor laws, mobile bars typically operate on a "Dry Hire" model or through a licensed retail partner. We provide the complete luxury mobile bar setup, ice, artisan syrups, garnishes, crystal glassware, insurance, and certified mixologists. We supply a curated shopping list tailored to your guest count so you buy alcohol at retail price with zero markup!'
  },
  {
    q: 'What electrical and space requirements does the mobile bar need?',
    a: 'Our vintage horse trailer requires a standard 110V household outlet within 75ft (or we can provide our ultra-quiet inverter generator). Our modular indoor fluted bar requires zero electricity, fits inside standard elevators, and can be placed anywhere with 8ft of clearance.'
  },
  {
    q: 'Can we create custom signature cocktails named after us or our brand?',
    a: 'Absolutely! That is our specialty. Every package includes a bespoke consultation where our head mixologist formulates cocktails named after the couple, pets, or brand themes, matched to your event color scheme.'
  },
  {
    q: 'Are you licensed and insured for luxury venues and private estates?',
    a: 'Yes, 100%. We carry $2,000,000 General Commercial & Liquor Liability Insurance. We provide custom Certificates of Insurance (COI) naming your venue or planner as additionally insured at no extra cost.'
  },
  {
    q: 'How far in advance should event planners book?',
    a: 'Popular weekend dates during peak wedding season (May through October and December) book 4 to 9 months in advance. However, we love accommodating last-minute soirees when schedule allows!'
  }
];
