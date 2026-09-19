import { BookingOrder, BookingStatus } from '../types';

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
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status request failed');
    return await res.json();
  } catch (err: any) {
    return {
      supabaseConfigured: false,
      supabaseUrl: null,
      hasDatabaseUrl: false,
      tableReady: false,
      testError: err?.message || 'Server connection error',
      sqlScript: '',
    };
  }
}

export async function autoSetupSupabaseTable(): Promise<{ success: boolean; message?: string; method?: string; sqlScript?: string; error?: string }> {
  try {
    const res = await fetch('/api/setup-table', { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to auto-setup table' };
  }
}

export async function syncBookingsWithServer(): Promise<{ success: boolean; syncedCount?: number; errors?: string[] }> {
  try {
    const res = await fetch('/api/sync-bookings', { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    return { success: false, errors: [err?.message || 'Sync failed'] };
  }
}

export async function fetchBookings(): Promise<{ orders: BookingOrder[]; source: 'supabase' | 'local_fallback'; pendingSyncCount?: number }> {
  try {
    const res = await fetch('/api/bookings');
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const data = await res.json();
    return {
      orders: data.orders || [],
      source: data.source || 'local_fallback',
      pendingSyncCount: data.pendingSyncCount || 0,
    };
  } catch (err) {
    console.warn('Could not fetch server bookings, using cached:', err);
    return { orders: [], source: 'local_fallback' };
  }
}

export async function submitBookingToServer(booking: BookingOrder): Promise<{ success: boolean; booking?: BookingOrder; supabaseSaved?: boolean; supabaseError?: string }> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error('Failed to save booking');
    return await res.json();
  } catch (err: any) {
    console.error('Error submitting booking to server:', err);
    return { success: false, supabaseError: err?.message };
  }
}

export async function updateBookingOnServer(id: string, updates: { status?: BookingStatus; depositStatus?: string; adminNotes?: string }) {
  try {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  } catch (err) {
    console.error('Failed to update booking on server:', err);
  }
}

export async function deleteBookingOnServer(id: string) {
  try {
    await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.error('Failed to delete booking on server:', err);
  }
}
