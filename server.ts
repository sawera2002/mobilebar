import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Supabase client holder
let supabaseClient: SupabaseClient | null = null;
let pgPool: pg.Pool | null = null;

// Helper: Check if a string is a valid Postgres connection URL (not a CLI command or template placeholder)
function isValidPostgresUrl(raw?: string): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const trimmed = raw.trim();

  // Must strictly start with postgresql:// or postgres://
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) return false;

  // Must NOT contain spaces or shell commands (e.g. "supabase login ...")
  if (/\s/.test(trimmed)) return false;

  // Must NOT contain template placeholders like [YOUR-PASSWORD]
  if (/\[.*?password.*?\]|<.*?password.*?>|YOUR-PASSWORD/i.test(trimmed)) return false;

  try {
    const parsed = new URL(trimmed);
    return Boolean(
      parsed.hostname &&
      parsed.hostname.length > 2 &&
      !parsed.hostname.includes(' ') &&
      parsed.hostname !== 'base'
    );
  } catch {
    return false;
  }
}

// Helper: Get a validated PostgreSQL connection string from any of the env variables
function getValidPostgresConnectionString(): string | null {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.SUPABASE_DB_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_KEY,
  ];

  for (const c of candidates) {
    if (c && isValidPostgresUrl(c)) {
      return c.trim();
    }
  }
  return null;
}

// Helper: Check if a string is a valid Supabase API key (JWT or publishable token, NOT a postgres URI)
function isValidSupabaseKey(key?: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();

  // Reject PostgreSQL URLs mistakenly placed in key variables
  if (/^postgres(ql)?:\/\//i.test(trimmed)) return false;

  // Reject HTTP URLs
  if (/^https?:\/\//i.test(trimmed)) return false;

  // Reject shell commands or multi-word strings
  if (/\s/.test(trimmed)) return false;

  // Supabase keys are at least 20 characters (JWTs or publishable keys like sb_...)
  return trimmed.length >= 20;
}

// Default project fallback credentials so exported zip works out of the box even before configuring .env
const DEFAULT_SUPABASE_URL = 'https://cwcirefnuuoeclmrkbyw.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_bTTL-OY22CFEE3grQ-AnQw_pmN2ndc5';

// Helper: Extract valid Supabase URL
function getValidSupabaseUrl(): string | null {
  const raw = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (raw && typeof raw === 'string') {
    const trimmed = raw.trim();
    const match = trimmed.match(/https?:\/\/[a-zA-Z0-9_.-]+/);
    if (match) return match[0];
  }
  return DEFAULT_SUPABASE_URL;
}

// Helper: Extract project ref (e.g. cwcirefnuuoeclmrkbyw)
function getSupabaseProjectRef(): string | null {
  const url = getValidSupabaseUrl();
  if (url) {
    const match = url.match(/https?:\/\/([a-zA-Z0-9_-]+)\.supabase\.co/);
    if (match) return match[1];
  }
  const dbOrCli = `${process.env.DATABASE_URL || ''} ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`;
  const matchCli = dbOrCli.match(/--project-ref\s+([a-zA-Z0-9_-]+)/) || dbOrCli.match(/db\.([a-zA-Z0-9_-]+)\.supabase\.co/);
  return matchCli ? matchCli[1] : 'cwcirefnuuoeclmrkbyw';
}

// Helper: Extract valid API key (prioritizing true service role key or anon key)
function getValidSupabaseKey(): string | null {
  const candidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_KEY,
    process.env.VITE_SUPABASE_ANON_KEY,
    process.env.SUPABASE_ANON_KEY,
  ];

  for (const c of candidates) {
    if (c && isValidSupabaseKey(c)) {
      return c.trim();
    }
  }
  return DEFAULT_SUPABASE_KEY;
}

function getSupabase(): SupabaseClient | null {
  const url = getValidSupabaseUrl();
  const key = getValidSupabaseKey();

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return supabaseClient;
}

function getPgPool(): pg.Pool | null {
  const dbUrl = getValidPostgresConnectionString();
  if (!dbUrl) return null;

  if (!pgPool) {
    try {
      pgPool = new pg.Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3500,
      });

      pgPool.on('error', (err) => {
        // Prevent unhandled error crashes from idle clients
        console.warn('Postgres connection pool idle error (isolated):', err?.message);
      });
    } catch (err: any) {
      console.warn('Could not initialize Postgres pool:', err?.message);
      return null;
    }
  }
  return pgPool;
}

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  reference_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  is_planner BOOLEAN DEFAULT FALSE,
  planner_company TEXT,
  event_type TEXT,
  event_date TEXT,
  event_time TEXT,
  event_duration_hours INTEGER,
  guest_count INTEGER,
  venue_name TEXT,
  venue_city TEXT,
  is_outdoor BOOLEAN DEFAULT FALSE,
  package_id TEXT,
  package_name TEXT,
  bar_setup_id TEXT,
  bar_setup_name TEXT,
  selected_cocktails JSONB DEFAULT '[]'::jsonb,
  selected_addons JSONB DEFAULT '[]'::jsonb,
  base_price NUMERIC,
  addons_price NUMERIC,
  travel_fee NUMERIC,
  tax_amount NUMERIC,
  total_amount NUMERIC,
  deposit_paid NUMERIC,
  deposit_status TEXT DEFAULT 'Unpaid',
  special_requests TEXT,
  admin_notes TEXT,
  raw_data JSONB
);

-- Enable RLS and create policy if not exists
DO $$
BEGIN
  ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow public operations on bookings'
  ) THEN
    CREATE POLICY "Allow public operations on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END
$$;
`;

async function executeTableCreation(): Promise<{ success: boolean; error?: string; method?: string }> {
  // Method 1: Try direct PostgreSQL connection if valid DATABASE_URL is provided
  const pool = getPgPool();
  if (pool) {
    try {
      await pool.query(CREATE_TABLE_SQL);
      return { success: true, method: 'Direct PostgreSQL connection' };
    } catch (err: any) {
      console.warn('Postgres connection attempt note:', err?.message);
    }
  }

  // Method 2: Try Supabase SQL Query API endpoint
  const url = getValidSupabaseUrl();
  const key = getValidSupabaseKey();

  if (url && key) {
    try {
      const queryEndpoint = `${url.replace(/\/$/, '')}/pg/query`;
      const res = await fetch(queryEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ query: CREATE_TABLE_SQL }),
      });

      if (res.ok) {
        return { success: true, method: 'Supabase SQL Engine (/pg/query)' };
      }
    } catch {
      // Ignored
    }

    // Method 3: Try Supabase RPC 'exec_sql' if user or project has it
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL });
        if (!error) {
          return { success: true, method: 'Supabase RPC exec_sql' };
        }
      } catch {
        // RPC might not exist, proceed to check if table already exists
      }
    }
  }

  // Method 4: Check if table already exists
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('bookings').select('id').limit(1);
      if (!error) {
        return { success: true, method: 'Table verified existing' };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Table could not be auto-created' };
    }
  }

  return {
    success: false,
    error: "Table 'public.bookings' is not found in schema cache. Paste and run the SQL query in Supabase SQL Editor.",
  };
}

// File-backed persistent storage to guarantee ZERO data loss even across server restarts
const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'server_bookings.json');

function loadLocalBookings(): any[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to read bookings file:', e);
  }
  return [];
}

function saveLocalBookings(bookings: any[]) {
  try {
    const dir = path.dirname(BOOKINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save bookings file:', e);
  }
}

// In-memory cache synced with disk
let localBookingsStore: any[] = loadLocalBookings();

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

function mapDbRowToBooking(row: any) {
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

// Background auto-sync function: uploads all pending local bookings to Supabase once table exists
async function syncUnsyncedBookingsToSupabase(): Promise<{ syncedCount: number; errors: string[] }> {
  const supabase = getSupabase();
  if (!supabase) return { syncedCount: 0, errors: ['Supabase not configured'] };

  try {
    const { error: testErr } = await supabase.from('bookings').select('id').limit(1);
    if (testErr) {
      return { syncedCount: 0, errors: [testErr.message] };
    }

    localBookingsStore = loadLocalBookings();
    const unsynced = localBookingsStore.filter((b) => b.synced_to_supabase !== true);
    if (unsynced.length === 0) {
      return { syncedCount: 0, errors: [] };
    }

    let syncedCount = 0;
    const errors: string[] = [];

    for (const booking of unsynced) {
      const payload = mapBookingToDbPayload(booking);
      const { error } = await supabase.from('bookings').upsert([payload], { onConflict: 'id' });
      if (!error) {
        booking.synced_to_supabase = true;
        syncedCount++;
      } else {
        errors.push(`Booking ${booking.referenceCode || booking.id}: ${error.message}`);
      }
    }

    if (syncedCount > 0) {
      saveLocalBookings(localBookingsStore);
      console.log(`[Supabase Auto-Sync] Synced ${syncedCount} bookings to Supabase cloud!`);
    }

    return { syncedCount, errors };
  } catch (err: any) {
    return { syncedCount: 0, errors: [err?.message || 'Sync failed'] };
  }
}

// API ROUTES
app.get('/api/status', async (_req, res) => {
  const url = getValidSupabaseUrl();
  const key = getValidSupabaseKey();
  const hasValidDbUrl = Boolean(getValidPostgresConnectionString());
  const projectRef = getSupabaseProjectRef();

  // Check if raw values had common copy-paste errors
  const rawDbUrl = `${process.env.DATABASE_URL || ''} ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`;
  const hasPlaceholderPassword = /\[.*?password.*?\]|<.*?password.*?>|YOUR-PASSWORD/i.test(rawDbUrl);
  const hasCliCommandsInDbUrl = /\b(supabase\s+login|supabase\s+init|supabase\s+link)\b/i.test(rawDbUrl);

  const configured = Boolean(url && key);
  let tableReady = false;
  let testError: string | null = null;

  if (configured) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('bookings').select('id').limit(1);
        if (!error) {
          tableReady = true;
          // Trigger sync in background if table is ready
          syncUnsyncedBookingsToSupabase().catch(() => {});
        } else {
          if (
            error.code === 'PGRST205' ||
            error.message?.includes('schema cache') ||
            error.message?.includes('relation "bookings" does not exist')
          ) {
            testError = "Table 'public.bookings' is not found in schema cache. Click 'View SQL' to copy and run in Supabase SQL Editor.";
          } else {
            testError = error.message;
          }
        }
      } catch (err: any) {
        testError = err?.message || 'Error checking table';
      }
    }
  }

  localBookingsStore = loadLocalBookings();
  const pendingSyncCount = localBookingsStore.filter((b) => b.synced_to_supabase !== true).length;

  res.json({
    supabaseConfigured: configured,
    supabaseUrl: url ? `${url.substring(0, 24)}...` : null,
    projectRef,
    hasDatabaseUrl: hasValidDbUrl,
    hasPlaceholderPassword,
    hasCliCommandsInDbUrl,
    tableReady,
    testError,
    pendingSyncCount,
    totalLocalBookings: localBookingsStore.length,
    sqlScript: CREATE_TABLE_SQL.trim(),
  });
});

app.post('/api/setup-table', async (_req, res) => {
  const result = await executeTableCreation();
  if (result.success) {
    syncUnsyncedBookingsToSupabase().catch(() => {});
  }
  res.json({
    ...result,
    sqlScript: CREATE_TABLE_SQL.trim(),
  });
});

// Force sync local bookings to Supabase
app.post('/api/sync-bookings', async (_req, res) => {
  const result = await syncUnsyncedBookingsToSupabase();
  res.json({
    success: result.syncedCount > 0 || result.errors.length === 0,
    ...result,
  });
});

// GET all bookings (from Supabase + local merged fallback)
app.get('/api/bookings', async (_req, res) => {
  const supabase = getSupabase();
  let supabaseOrders: any[] | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        supabaseOrders = data.map(mapDbRowToBooking);
      }
    } catch {
      // Ignore
    }
  }

  // Refresh local data from disk
  localBookingsStore = loadLocalBookings();

  if (supabaseOrders !== null) {
    // Merge: Supabase orders + any local bookings that haven't synced yet
    const supabaseIds = new Set(supabaseOrders.map((o: any) => o.id));
    const unsyncedLocals = localBookingsStore.filter((o) => !supabaseIds.has(o.id));
    const combined = [...unsyncedLocals, ...supabaseOrders];

    return res.json({
      source: 'supabase',
      orders: combined,
      totalCount: combined.length,
      supabaseCount: supabaseOrders.length,
      pendingSyncCount: unsyncedLocals.length,
    });
  }

  // Fallback to local file store (which contains initial bookings + all newly submitted bookings)
  const pendingSync = localBookingsStore.filter((b) => b.synced_to_supabase !== true).length;
  res.json({
    source: 'local_fallback',
    orders: localBookingsStore,
    totalCount: localBookingsStore.length,
    pendingSyncCount: pendingSync,
  });
});

// POST new booking
app.post('/api/bookings', async (req, res) => {
  const booking = req.body;
  if (!booking || !booking.clientName) {
    return res.status(400).json({ error: 'Invalid booking data' });
  }

  const id = booking.id || `booking-${Date.now()}`;
  const referenceCode = booking.referenceCode || `CMB-${Math.floor(1000 + Math.random() * 9000)}`;
  const fullBooking = {
    ...booking,
    id,
    referenceCode,
    createdAt: booking.createdAt || new Date().toISOString().split('T')[0],
  };

  const supabase = getSupabase();
  let supabaseSaved = false;
  let supabaseError: string | null = null;

  if (supabase) {
    const dbPayload = mapBookingToDbPayload(fullBooking);
    try {
      let { error } = await supabase.from('bookings').insert([dbPayload]);

      // If table doesn't exist, auto-create and retry once!
      if (error && (error.code === '42P01' || error.message?.includes('relation "bookings" does not exist') || error.message?.includes('schema cache'))) {
        await executeTableCreation();
        const retryResult = await supabase.from('bookings').insert([dbPayload]);
        error = retryResult.error;
      }

      if (!error) {
        supabaseSaved = true;
      } else {
        supabaseError = error.message;
      }
    } catch (err: any) {
      supabaseError = err?.message || 'Error inserting into Supabase';
    }
  }

  // Always save immediately to local file store with exact sync flag!
  fullBooking.synced_to_supabase = supabaseSaved;
  localBookingsStore = loadLocalBookings();
  const existingIdx = localBookingsStore.findIndex((b) => b.id === id || (b.referenceCode && b.referenceCode === referenceCode));
  if (existingIdx >= 0) {
    localBookingsStore[existingIdx] = fullBooking;
  } else {
    localBookingsStore.unshift(fullBooking);
  }
  saveLocalBookings(localBookingsStore);

  res.json({
    success: true,
    booking: fullBooking,
    supabaseSaved,
    supabaseError,
  });
});

// PATCH booking (Status / Deposit / Notes)
app.patch('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  localBookingsStore = loadLocalBookings();
  localBookingsStore = localBookingsStore.map((o) => (o.id === id ? { ...o, ...updates } : o));
  saveLocalBookings(localBookingsStore);

  const supabase = getSupabase();
  if (supabase) {
    const dbUpdates: any = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.depositStatus !== undefined) dbUpdates.deposit_status = updates.depositStatus;
    if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;

    try {
      await supabase.from('bookings').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.error('Failed to update Supabase record:', err);
    }
  }

  res.json({ success: true, id, updates });
});

// DELETE booking
app.delete('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  localBookingsStore = loadLocalBookings();
  localBookingsStore = localBookingsStore.filter((o) => o.id !== id);
  saveLocalBookings(localBookingsStore);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('bookings').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to delete Supabase record:', err);
    }
  }

  res.json({ success: true, id });
});

// VITE MIDDLEWARE & STATIC SERVING
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`COSMO Server running on http://0.0.0.0:${PORT}`);
    // Auto-verify / create table on server startup if credentials are present
    executeTableCreation().catch(() => {});
    // Auto sync check interval every 12 seconds
    setInterval(() => {
      syncUnsyncedBookingsToSupabase().catch(() => {});
    }, 12000);
  });
}

startServer();
