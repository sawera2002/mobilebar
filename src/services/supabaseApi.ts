import { BookingOrder, BookingStatus } from '../types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://cwcirefnuuoeclmrkbyw.supabase.co';
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bTTL-OY22CFEE3grQ-AnQw_pmN2ndc5';

let browserSupabaseClient: SupabaseClient | null = null;
function getBrowserSupabase(): SupabaseClient | null {
  if (browserSupabaseClient) return browserSupabaseClient;
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      browserSupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
      return browserSupabaseClient;
    } catch (e) {
      console.warn('Could not initialize browser Supabase client:', e);
    }
  }
  return null;
}

function mapBookingToDbPayload(booking: any) {
  return {
    id: booking.id || `booking-${Date.now()}`,
    reference_code: booking.referenceCode || `CMB-${Math.floor(1000 + Math.random() * 9000)}`,
    created_at: booking.createdAt || new Date().toISOString(),
    status: booking.status || 'pending',
    client_name: booking.clientName,
    client_email: booking.clientEmail || '',
    client_phone: booking.clientPhone || '',
    is_planner: Boolean(booking.isPlanner),
    planner_company: booking.plannerCompany || '',
    event_type: booking.eventType || 'Wedding Reception',
    event_date: booking.eventDate || '',
    event_time: booking.eventTime || '16:00',
    event_duration_hours: Number(booking.eventDurationHours || 4),
    guest_count: Number(booking.guestCount || 100),
    venue_name: booking.venueName || 'Private Venue',
    venue_city: booking.venueCity || 'Los Angeles, CA',
    is_outdoor: Boolean(booking.isOutdoor),
    package_id: booking.packageId || 'pkg-pink-velvet',
    package_name: booking.packageName || 'The Pink Velvet Soirée',
    bar_setup_id: booking.barSetupId || 'setup-blush-marble',
    bar_setup_name: booking.barSetupName || 'The Noir & Fluted Pink Satellite Bar',
    selected_cocktails: booking.selectedCocktailIds || [],
    selected_addons: booking.selectedAddOnIds || [],
    base_price: Number(booking.basePrice || 0),
    addons_price: Number(booking.addOnsPrice || 0),
    travel_fee: Number(booking.travelFee || 0),
    tax_amount: Number(booking.taxAmount || 0),
    total_amount: Number(booking.totalAmount || 0),
    deposit_paid: Number(booking.depositPaid || 0),
    deposit_status: booking.depositStatus || 'Unpaid',
    special_requests: booking.specialRequests || '',
    admin_notes: booking.adminNotes || '',
    raw_data: booking,
  };
}

function mapDbRowToBooking(row: any): BookingOrder {
  return {
    id: row.id,
    referenceCode: row.reference_code || row.id,
    createdAt: row.created_at ? String(row.created_at).split('T')[0] : new Date().toISOString().split('T')[0],
    status: row.status || 'pending',
    clientName: row.client_name,
    clientEmail: row.client_email || '',
    clientPhone: row.client_phone || '',
    isPlanner: Boolean(row.is_planner),
    plannerCompany: row.planner_company || '',
    eventType: row.event_type || 'Wedding Reception',
    eventDate: row.event_date || '',
    eventTime: row.event_time || '16:00',
    eventDurationHours: Number(row.event_duration_hours || 4),
    guestCount: Number(row.guest_count || 100),
    venueName: row.venue_name || 'Private Venue',
    venueCity: row.venue_city || 'Los Angeles, CA',
    isOutdoor: Boolean(row.is_outdoor),
    packageId: row.package_id || '',
    packageName: row.package_name || '',
    barSetupId: row.bar_setup_id || '',
    barSetupName: row.bar_setup_name || '',
    selectedCocktailIds: row.selected_cocktails || [],
    selectedAddOnIds: row.selected_addons || [],
    basePrice: Number(row.base_price || 0),
    addOnsPrice: Number(row.addons_price || 0),
    travelFee: Number(row.travel_fee || 0),
    taxAmount: Number(row.tax_amount || 0),
    totalAmount: Number(row.total_amount || 0),
    depositPaid: Number(row.deposit_paid || 0),
    depositStatus: row.deposit_status || 'Unpaid',
    specialRequests: row.special_requests || '',
    adminNotes: row.admin_notes || '',
    synced_to_supabase: true,
  };
}

export interface SupabaseStatus {
  supabaseConfigured: boolean;
  supabaseUrl: string | null;
  projectRef?: string | null;
  hasDatabaseUrl: boolean;
  hasPlaceholderPassword?: boolean;
  hasCliCommandsInDbUrl?: boolean;
  tableReady: boolean;
  testError: string | null;
  pendingSyncCount?: number;
  totalLocalBookings?: number;
  sqlScript: string;
}

export async function fetchServerStatus(): Promise<SupabaseStatus> {
  // First try backend API (works in full-stack Express / Cloud Run / Local)
  try {
    const res = await fetch('/api/status', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim() && text.startsWith('{')) {
        return JSON.parse(text);
      }
    }
  } catch (err: any) {
    // API not available, proceed to direct client fallback
  }

  // Fallback for Vercel static hosting: direct browser client check
  const supabase = getBrowserSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('bookings').select('id').limit(1);
      if (!error) {
        return {
          supabaseConfigured: true,
          supabaseUrl: SUPABASE_URL,
          projectRef: 'cwcirefnuuoeclmrkbyw',
          hasDatabaseUrl: false,
          tableReady: true,
          testError: null,
          pendingSyncCount: 0,
          totalLocalBookings: 0,
          sqlScript: '',
        };
      }
      return {
        supabaseConfigured: true,
        supabaseUrl: SUPABASE_URL,
        projectRef: 'cwcirefnuuoeclmrkbyw',
        hasDatabaseUrl: false,
        tableReady: false,
        testError: error.message,
        sqlScript: '',
      };
    } catch (e: any) {
      return {
        supabaseConfigured: true,
        supabaseUrl: SUPABASE_URL,
        hasDatabaseUrl: false,
        tableReady: false,
        testError: e?.message || 'Direct Supabase check error',
        sqlScript: '',
      };
    }
  }

  return {
    supabaseConfigured: false,
    supabaseUrl: null,
    hasDatabaseUrl: false,
    tableReady: false,
    testError: 'Supabase client not initialized',
    sqlScript: '',
  };
}

export async function autoSetupSupabaseTable(): Promise<{ success: boolean; message?: string; method?: string; sqlScript?: string; error?: string }> {
  try {
    const res = await fetch('/api/setup-table', {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
    const text = await res.text();
    if (text && text.trim() && text.startsWith('{')) {
      return JSON.parse(text);
    }
  } catch (err: any) {
    // Ignore server error
  }
  return { success: false, error: 'Auto-setup requires backend server or manual SQL execution in Supabase.' };
}

export async function syncBookingsWithServer(): Promise<{ success: boolean; syncedCount?: number; errors?: string[] }> {
  // 1. Try server endpoint
  try {
    const res = await fetch('/api/sync-bookings', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    const text = await res.text();
    if (text && text.trim() && text.startsWith('{')) {
      const data = JSON.parse(text);
      return {
        success: data.success ?? true,
        syncedCount: data.syncedCount ?? 0,
        errors: data.errors ?? [],
      };
    }
  } catch (err: any) {
    // fallback
  }

  // 2. Direct browser fallback for Vercel
  const supabase = getBrowserSupabase();
  if (supabase) {
    try {
      const stored = localStorage.getItem('cosmo_mobile_bar_orders');
      if (stored) {
        const localOrders: BookingOrder[] = JSON.parse(stored);
        let synced = 0;
        for (const order of localOrders) {
          const payload = mapBookingToDbPayload(order);
          const { error } = await supabase.from('bookings').upsert(payload);
          if (!error) synced++;
        }
        return { success: true, syncedCount: synced, errors: [] };
      }
    } catch (e: any) {
      return { success: false, errors: [e?.message || 'Sync failed'] };
    }
  }

  return { success: true, syncedCount: 0, errors: [] };
}

export async function fetchBookings(): Promise<{ orders: BookingOrder[]; source: 'supabase' | 'local_fallback'; pendingSyncCount?: number }> {
  // 1. Try server API
  try {
    const res = await fetch('/api/bookings', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim() && text.startsWith('{')) {
        const data = JSON.parse(text);
        if (Array.isArray(data.orders)) {
          return {
            orders: data.orders,
            source: data.source || 'supabase',
            pendingSyncCount: data.pendingSyncCount || 0,
          };
        }
      }
    }
  } catch (err) {
    // API not accessible (e.g. static Vercel host)
  }

  // 2. Direct browser Supabase query (for Vercel)
  const supabase = getBrowserSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const orders = data.map(mapDbRowToBooking);
        return {
          orders,
          source: 'supabase',
          pendingSyncCount: 0,
        };
      }
    } catch (err) {
      console.warn('Direct browser Supabase fetch failed:', err);
    }
  }

  return { orders: [], source: 'local_fallback' };
}

export async function submitBookingToServer(booking: BookingOrder): Promise<{ success: boolean; booking?: BookingOrder; supabaseSaved?: boolean; supabaseError?: string }> {
  // 1. Try server API
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim() && text.startsWith('{')) {
        return JSON.parse(text);
      }
    }
  } catch (err: any) {
    // API failed, fallback to direct browser client
  }

  // 2. Direct browser Supabase query (for Vercel)
  const supabase = getBrowserSupabase();
  if (supabase) {
    try {
      const payload = mapBookingToDbPayload(booking);
      const { error } = await supabase.from('bookings').upsert(payload);
      if (!error) {
        return {
          success: true,
          booking: { ...booking, synced_to_supabase: true },
          supabaseSaved: true,
        };
      } else {
        return {
          success: true,
          booking: { ...booking, synced_to_supabase: false },
          supabaseSaved: false,
          supabaseError: error.message,
        };
      }
    } catch (e: any) {
      return { success: true, booking, supabaseSaved: false, supabaseError: e?.message };
    }
  }

  return { success: true, booking, supabaseSaved: false };
}

export async function updateBookingOnServer(id: string, updates: { status?: BookingStatus; depositStatus?: string; adminNotes?: string }) {
  // 1. Try server API
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) return;
  } catch (err) {
    // Proceed to fallback
  }

  // 2. Direct browser Supabase query (for Vercel)
  const supabase = getBrowserSupabase();
  if (supabase) {
    try {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.depositStatus) dbUpdates.deposit_status = updates.depositStatus;
      if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;
      await supabase.from('bookings').update(dbUpdates).eq('id', id);
    } catch (e) {
      console.warn('Direct browser Supabase update failed:', e);
    }
  }
}

export async function deleteBookingOnServer(id: string) {
  // 1. Try server API
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) return;
  } catch (err) {
    // Proceed to fallback
  }

  // 2. Direct browser Supabase query (for Vercel)
  const supabase = getBrowserSupabase();
  if (supabase) {
    try {
      await supabase.from('bookings').delete().eq('id', id);
    } catch (e) {
      console.warn('Direct browser Supabase delete failed:', e);
    }
  }
}
