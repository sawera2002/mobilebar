import React, { useState, useEffect } from 'react';
import { AppPage, BookingOrder, BookingStatus, EventType } from '../types';
import { PACKAGES, BAR_SETUPS, SIGNATURE_COCKTAILS, ADD_ONS } from '../data/barData';
import {
  Wine,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Search,
  Plus,
  Download,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
  Trash2,
  Sparkles,
  ShieldCheck,
  Check,
  Edit3,
  Database,
  RefreshCw,
  Copy,
  CheckCheck,
  Code,
  UploadCloud,
  CheckCircle
} from 'lucide-react';
import { fetchServerStatus, autoSetupSupabaseTable, syncBookingsWithServer, SupabaseStatus } from '../services/supabaseApi';

interface AdminDashboardProps {
  orders: BookingOrder[];
  onUpdateOrderStatus: (orderId: string, status: BookingStatus) => void;
  onUpdateDepositStatus: (orderId: string, depositStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid') => void;
  onSaveAdminNotes: (orderId: string, notes: string) => void;
  onAddManualBooking: (booking: BookingOrder) => void;
  onDeleteBooking: (orderId: string) => void;
  onNavigate: (page: AppPage) => void;
  onRefreshBookings?: () => void;
  isLoadingBookings?: boolean;
  supabaseSource?: 'supabase' | 'local_fallback';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onUpdateDepositStatus,
  onSaveAdminNotes,
  onAddManualBooking,
  onDeleteBooking,
  onNavigate,
  onRefreshBookings,
  isLoadingBookings = false,
  supabaseSource = 'local_fallback',
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cosmo_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Supabase Integration State
  const [serverStatus, setServerStatus] = useState<SupabaseStatus | null>(null);
  const [isSettingUpTable, setIsSettingUpTable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [setupFeedback, setSetupFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  // Check Supabase status on load
  const checkSupabaseStatus = async () => {
    const status = await fetchServerStatus();
    setServerStatus(status);
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkSupabaseStatus();
    }
  }, [isAuthenticated]);

  const handleSyncBookings = async () => {
    setIsSyncing(true);
    setSetupFeedback(null);
    try {
      const result = await syncBookingsWithServer();
      if (result.success && result.syncedCount && result.syncedCount > 0) {
        setSetupFeedback({
          success: true,
          message: `Successfully uploaded ${result.syncedCount} offline/local bookings directly into Supabase cloud!`,
        });
      } else if (result.errors && result.errors.length > 0) {
        setSetupFeedback({
          success: false,
          message: `Sync notice: ${result.errors[0]}`,
        });
      }
      await checkSupabaseStatus();
      onRefreshBookings?.();
    } catch (err: any) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAutoSetupSupabase = async () => {
    setIsSettingUpTable(true);
    setSetupFeedback(null);
    try {
      const res = await autoSetupSupabaseTable();
      if (res.success) {
        setSetupFeedback({
          success: true,
          message: `Supabase table verified/created successfully via ${res.method || 'PostgreSQL Engine'}!`,
        });
      } else {
        setSetupFeedback({
          success: false,
          message: res.error || 'Could not auto-create table. Please check credentials or run SQL in Supabase SQL Editor.',
        });
      }
      await checkSupabaseStatus();
      onRefreshBookings?.();
    } catch (err: any) {
      setSetupFeedback({
        success: false,
        message: err?.message || 'Setup request failed',
      });
    } finally {
      setIsSettingUpTable(false);
    }
  };

  const handleCopySql = () => {
    if (serverStatus?.sqlScript) {
      navigator.clipboard.writeText(serverStatus.sqlScript);
      setHasCopiedSql(true);
      setTimeout(() => setHasCopiedSql(false), 2500);
    }
  };

  // Dashboard Filters & State
  const [activeTab, setActiveTab] = useState<'bookings' | 'fleet' | 'cocktails' | 'pricing'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedOrderForBEO, setSelectedOrderForBEO] = useState<BookingOrder | null>(null);
  const [editingNotesOrderId, setEditingNotesOrderId] = useState<string | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Booking Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>('Wedding Reception');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('16:00');
  const [newGuestCount, setNewGuestCount] = useState<number>(100);
  const [newDuration, setNewDuration] = useState<number>(4);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueCity, setNewVenueCity] = useState('Los Angeles, CA');
  const [newPackageId, setNewPackageId] = useState(PACKAGES[0].id);
  const [newBarSetupId, setNewBarSetupId] = useState(BAR_SETUPS[0].id);
  const [newNotes, setNewNotes] = useState('');

  // Check login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Credentials strictly set as requested:
    // Username: admin, Password: admin@321
    if (username.trim() === 'admin' && password === 'admin@321') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('cosmo_admin_session', 'true');
      } catch (err) {
        console.error(err);
      }
    } else {
      setLoginError('Invalid username or password. Please use admin / admin@321');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('cosmo_admin_session');
    } catch (err) {
      console.error(err);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin@321');
    setLoginError('');
  };

  // KPIs
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed' || o.status === 'in_progress').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const avgBookingValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      order.clientName.toLowerCase().includes(query) ||
      order.referenceCode.toLowerCase().includes(query) ||
      order.clientEmail.toLowerCase().includes(query) ||
      order.clientPhone.toLowerCase().includes(query) ||
      order.venueName.toLowerCase().includes(query) ||
      order.packageName.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Reference Code',
      'Client Name',
      'Email',
      'Phone',
      'Event Type',
      'Date',
      'Time',
      'Guests',
      'Duration (hrs)',
      'Venue',
      'Package',
      'Bar Setup',
      'Total Amount ($)',
      'Status',
      'Deposit Status',
      'Notes'
    ];

    const rows = orders.map((o) => [
      `"${o.referenceCode}"`,
      `"${o.clientName}"`,
      `"${o.clientEmail}"`,
      `"${o.clientPhone}"`,
      `"${o.eventType}"`,
      `"${o.eventDate}"`,
      `"${o.eventTime}"`,
      o.guestCount,
      o.eventDurationHours,
      `"${o.venueName}, ${o.venueCity}"`,
      `"${o.packageName}"`,
      `"${o.barSetupName}"`,
      o.totalAmount,
      `"${o.status}"`,
      `"${o.depositStatus || 'Unpaid'}"`,
      `"${(o.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cosmo-bookings-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit manual booking
  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPkg = PACKAGES.find((p) => p.id === newPackageId) || PACKAGES[0];
    const selectedBar = BAR_SETUPS.find((b) => b.id === newBarSetupId) || BAR_SETUPS[0];
    const basePrice = selectedPkg.priceStartingAt;
    const tax = Math.round(basePrice * 0.0825);
    const total = basePrice + 120 + tax;

    const ref = `CMB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: BookingOrder = {
      id: `booking-${Date.now()}`,
      referenceCode: ref,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      clientName: newClientName,
      clientEmail: newClientEmail,
      clientPhone: newClientPhone,
      isPlanner: false,
      eventType: newEventType,
      eventDate: newEventDate || new Date().toISOString().slice(0, 10),
      eventTime: newEventTime,
      eventDurationHours: newDuration,
      guestCount: newGuestCount,
      venueName: newVenueName || 'Private Residence',
      venueCity: newVenueCity,
      isOutdoor: true,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      barSetupId: selectedBar.id,
      barSetupName: selectedBar.name,
      selectedCocktailIds: ['cocktail-cosmo-2', 'cocktail-blush-spritz'],
      selectedAddOnIds: [],
      basePrice,
      addOnsPrice: 0,
      travelFee: 120,
      taxAmount: tax,
      totalAmount: total,
      depositPaid: Math.round(total * 0.4),
      depositStatus: 'Deposit Paid',
      specialRequests: newNotes,
      adminNotes: 'Manually logged by admin staff.'
    };

    onAddManualBooking(newOrder);
    setIsAddModalOpen(false);
    // Reset fields
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewNotes('');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock3 className="w-3 h-3" />
            In Prep
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-700/40 text-zinc-300 border border-zinc-600">
            <Check className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#f472b6]/15 text-[#f472b6] border border-[#f472b6]/40">
            <AlertCircle className="w-3 h-3 animate-pulse" />
            Inquiry Pending
          </span>
        );
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#121216] border border-[#f472b6]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Pink Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f472b6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#f472b6]/15">
              <Wine className="w-7 h-7 text-[#f472b6]" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
              COSMO <span className="text-[#f472b6] font-sans text-xs tracking-widest uppercase font-semibold px-2 py-0.5 rounded bg-[#f472b6]/10 border border-[#f472b6]/30 align-middle ml-1">Admin</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Operations & Event Management Portal
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  id="admin-username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181b] border border-zinc-800 text-white text-sm focus:border-[#f472b6] focus:outline-none focus:ring-1 focus:ring-[#f472b6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#18181b] border border-zinc-800 text-white text-sm focus:border-[#f472b6] focus:outline-none focus:ring-1 focus:ring-[#f472b6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className="p-3 rounded-xl bg-[#18181b] border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono text-[11px]">
                admin / admin@321
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[#f472b6] hover:text-[#fbcfe8] font-semibold text-xs transition-colors"
              >
                Auto Fill
              </button>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#f472b6]/20 hover:brightness-110 active:scale-95 transition-all mt-2"
            >
              Log In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Admin Sub-Header */}
      <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#18181b] border border-[#f472b6]/40 flex items-center justify-center shrink-0">
            <Wine className="w-6 h-6 text-[#f472b6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Cosmo Executive Operations
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                Live Synced
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Logged in as <span className="text-white font-medium">admin</span> • Event Dispatch & Bar Fleet Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            id="admin-view-site-btn"
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-xl bg-[#18181b] border border-[#3f3f46] text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#f472b6]/50 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>View Live Website</span>
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Supabase Cloud Connection & Auto-Setup Banner */}
      <div className="bg-[#121216] border border-[#27272a] rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              serverStatus?.tableReady
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : serverStatus?.supabaseConfigured
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-white">Supabase Cloud Database</span>
                {serverStatus?.tableReady ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Table 'public.bookings' Active & Ready
                  </span>
                ) : serverStatus?.supabaseConfigured ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <Clock3 className="w-3 h-3" />
                    Supabase Connected • Setup Table Below
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <AlertCircle className="w-3 h-3" />
                    Supabase Standby (Auto-Sync Ready)
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">
                  Storage: {supabaseSource === 'supabase' ? '🟢 Supabase Cloud' : '🟡 Local Storage + Auto-Sync'}
                </span>
                {Boolean((serverStatus?.pendingSyncCount ?? 0) > 0) && (
                  <span className="text-[11px] font-medium text-amber-300 px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 flex items-center gap-1">
                    <UploadCloud className="w-3 h-3 text-amber-400" />
                    {serverStatus?.pendingSyncCount ?? 0} local booking{(serverStatus?.pendingSyncCount ?? 0) > 1 ? 's' : ''} queued for Supabase
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {serverStatus?.tableReady ? (
                  `Real bookings from clients are stored in your Supabase 'bookings' table.`
                ) : serverStatus?.supabaseConfigured ? (
                  <span>
                    Connected to Supabase project <code className="text-[#f472b6] font-mono px-1 py-0.5 bg-zinc-800 rounded">{serverStatus?.projectRef || 'Supabase'}</code>. 
                    Table <code className="text-zinc-300 font-mono">public.bookings</code> is awaiting setup. Click <strong>"View SQL"</strong> to copy the DDL script or auto-create below.
                  </span>
                ) : (
                  `Automated table creator runs PostgreSQL DDL automatically so you never have to manually design tables in Supabase.`
                )}
              </p>

              {serverStatus?.hasPlaceholderPassword && !serverStatus?.tableReady && (
                <div className="mt-2 text-[11px] text-amber-300/90 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>
                    Database URI has <code className="font-mono text-amber-200">[YOUR-PASSWORD]</code>. You can copy the SQL script to run directly in Supabase SQL Editor, or put your actual DB password in Settings.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <button
              id="admin-auto-setup-table-btn"
              onClick={handleAutoSetupSupabase}
              disabled={isSettingUpTable}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-[#f472b6]/20 disabled:opacity-50"
              title="Runs automatic table creation query on Supabase"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSettingUpTable ? 'animate-spin' : ''}`} />
              <span>{isSettingUpTable ? 'Creating Table...' : '⚡ Auto-Create Supabase Table'}</span>
            </button>

            <button
              id="admin-view-sql-btn"
              onClick={() => setShowSqlModal(true)}
              className="px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors flex items-center gap-1.5"
              title="View SQL DDL Script"
            >
              <Code className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>View SQL</span>
            </button>

            <button
              id="admin-sync-bookings-btn"
              onClick={handleSyncBookings}
              disabled={isSyncing || isLoadingBookings}
              className="px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Upload pending bookings and synchronize with Supabase cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#f472b6] ${(isSyncing || isLoadingBookings) ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync with Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Feedback notification if triggered */}
        {setupFeedback && (
          <div className={`mt-3.5 p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            setupFeedback.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              {setupFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              )}
              <span>{setupFeedback.message}</span>
            </div>
            <button
              onClick={() => setSetupFeedback(null)}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Pipeline Revenue</span>
            <DollarSign className="w-4 h-4 text-[#f472b6]" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            ${totalRevenue.toLocaleString()}
          </p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Active event gross</span>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-[#f472b6]" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            {orders.length}
          </p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Registered in ledger</span>
        </div>

        <div className="bg-[#121216] border border-[#f472b6]/30 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span className="text-[#fbcfe8] font-medium">Pending Inquiries</span>
            <AlertCircle className="w-4 h-4 text-[#f472b6]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#f472b6]">
            {pendingCount}
          </p>
          <span className="text-[10px] text-zinc-400 mt-1 block">Requires confirmation</span>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Confirmed & Prep</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            {confirmedCount}
          </p>
          <span className="text-[10px] text-emerald-400/80 mt-1 block">Staff & liquor assigned</span>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Avg Event Value</span>
            <Sparkles className="w-4 h-4 text-[#f472b6]" />
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            ${avgBookingValue.toLocaleString()}
          </p>
          <span className="text-[10px] text-zinc-500 mt-1 block">Per event average</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#f472b6] text-[#09090b]'
                : 'bg-[#18181b] text-zinc-400 hover:text-white'
            }`}
          >
            Events & Bookings ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'fleet'
                ? 'bg-[#f472b6] text-[#09090b]'
                : 'bg-[#18181b] text-zinc-400 hover:text-white'
            }`}
          >
            Fleet & Setups
          </button>
          <button
            onClick={() => setActiveTab('cocktails')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'cocktails'
                ? 'bg-[#f472b6] text-[#09090b]'
                : 'bg-[#18181b] text-zinc-400 hover:text-white'
            }`}
          >
            Cocktail Recipes
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="admin-export-csv-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors flex items-center gap-1.5"
            title="Download CSV of all bookings"
          >
            <Download className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>Export CSV</span>
          </button>
          <button
            id="admin-add-booking-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#ec4899] text-[#09090b] text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* ------------------ TAB 1: BOOKINGS & EVENTS ------------------ */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-[#121216] border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client, ref code, venue, email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-[#f472b6] focus:outline-none"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    statusFilter === status
                      ? 'bg-[#f472b6]/20 text-[#fbcfe8] border border-[#f472b6]/50'
                      : 'bg-[#18181b] text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  {status === 'all' ? 'All Events' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-12 text-center">
              <p className="text-zinc-400 text-sm">No bookings matched your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-3 text-xs text-[#f472b6] hover:underline"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#121216] border border-zinc-800 hover:border-[#f472b6]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Client & Event Details */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#fbcfe8] px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800">
                          {order.referenceCode}
                        </span>
                        {getStatusBadge(order.status)}
                        <span className="text-xs text-zinc-500">•</span>
                        <span className="text-xs text-zinc-400 font-medium">{order.eventType}</span>
                        <span className="text-xs text-zinc-500">•</span>
                        {order.synced_to_supabase ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20" title="Safely stored on Supabase Cloud Database">
                            <CheckCircle className="w-2.5 h-2.5" /> Supabase
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20" title="Stored locally on server & queued for Supabase auto-sync">
                            <Clock3 className="w-2.5 h-2.5" /> Local / Queued
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <h3 className="font-serif text-xl font-bold text-white">
                          {order.clientName}
                        </h3>
                        {order.isPlanner && (
                          <span className="text-[10px] text-[#f472b6] font-medium bg-[#f472b6]/10 px-2 py-0.5 rounded border border-[#f472b6]/20">
                            Planner: {order.plannerCompany || 'Private'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <Calendar className="w-3.5 h-3.5 text-[#f472b6]" />
                          {order.eventDate} ({order.eventTime || '16:00'})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          {order.eventDurationHours} Hours
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-zinc-500" />
                          {order.guestCount} Guests
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {order.venueName} ({order.venueCity})
                        </span>
                      </div>

                      {/* Package & Setup Pills */}
                      <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                        <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800 text-zinc-300">
                          📦 {order.packageName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800 text-zinc-300">
                          🚚 {order.barSetupName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800 text-zinc-400">
                          📞 {order.clientPhone}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#18181b] border border-zinc-800 text-zinc-400">
                          ✉️ {order.clientEmail}
                        </span>
                      </div>

                      {/* Special Requests or Admin Notes */}
                      {(order.specialRequests || order.adminNotes) && (
                        <div className="text-xs bg-[#09090b] border border-zinc-800/80 rounded-xl p-2.5 space-y-1 mt-2">
                          {order.specialRequests && (
                            <p className="text-zinc-400">
                              <span className="text-[#fbcfe8] font-medium">Client Notes:</span> {order.specialRequests}
                            </p>
                          )}
                          {order.adminNotes && (
                            <p className="text-zinc-300">
                              <span className="text-amber-400 font-medium">Staff Note:</span> {order.adminNotes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Financial & Operations Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                          Total Investment
                        </span>
                        <span className="font-serif text-2xl font-bold text-white">
                          ${order.totalAmount?.toLocaleString() || '0'}
                        </span>
                        
                        {/* Deposit Toggle Pill */}
                        <div className="mt-1 flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              const nextStatus =
                                order.depositStatus === 'Fully Paid'
                                  ? 'Unpaid'
                                  : order.depositStatus === 'Deposit Paid'
                                  ? 'Fully Paid'
                                  : 'Deposit Paid';
                              onUpdateDepositStatus(order.id, nextStatus);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                              order.depositStatus === 'Fully Paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : order.depositStatus === 'Deposit Paid'
                                ? 'bg-[#f472b6]/10 text-[#fbcfe8] border-[#f472b6]/30'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                            title="Click to toggle deposit status"
                          >
                            Deposit: {order.depositStatus || 'Unpaid'} ↺
                          </button>
                        </div>
                      </div>

                      {/* Interactive Status Selector */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as BookingStatus)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#18181b] border border-zinc-700 text-xs text-white focus:border-[#f472b6] focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Inquiry Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Prep</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrderForBEO(order)}
                          className="px-3 py-1.5 rounded-xl bg-[#18181b] border border-zinc-700 text-xs text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors flex items-center gap-1"
                          title="View BEO & Prep Sheet"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#f472b6]" />
                          <span>BEO</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingNotesOrderId(order.id);
                            setCurrentNoteText(order.adminNotes || '');
                          }}
                          className="p-1.5 rounded-xl bg-[#18181b] border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          title="Edit Staff Notes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete booking ${order.referenceCode} for ${order.clientName}?`)) {
                              onDeleteBooking(order.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------ TAB 2: FLEET & SETUPS ------------------ */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BAR_SETUPS.map((bar) => (
            <div key={bar.id} className="bg-[#121216] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
              <img src={bar.imageUrl} alt={bar.name} className="w-full h-44 object-cover" />
              <div className="p-5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#f472b6] tracking-wider">
                  Dimensions: {bar.dimensions}
                </span>
                <h3 className="font-serif text-lg font-bold text-white">{bar.name}</h3>
                <p className="text-xs text-zinc-400">{bar.description}</p>
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-emerald-400 font-medium">Ready for Dispatch</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------ TAB 3: COCKTAIL RECIPES ------------------ */}
      {activeTab === 'cocktails' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SIGNATURE_COCKTAILS.map((cocktail) => (
            <div key={cocktail.id} className="bg-[#121216] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#f472b6] font-bold">
                  {cocktail.category} • {cocktail.alcoholBase}
                </span>
                <span className="text-[11px] text-zinc-400">{cocktail.glassware}</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-white">{cocktail.name}</h4>
              <p className="text-xs text-zinc-400">{cocktail.tagline}</p>
              
              <div className="pt-2 border-t border-zinc-800 text-xs space-y-1">
                <p className="text-zinc-300 font-medium">Ingredients Prep:</p>
                <ul className="list-disc list-inside text-zinc-400 space-y-0.5 text-[11px]">
                  {cocktail.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-zinc-400 pt-1">
                <span className="text-[#fbcfe8] font-medium">Garnish:</span> {cocktail.garnish}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------ BANQUET EVENT ORDER (BEO) MODAL ------------------ */}
      {selectedOrderForBEO && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-[#f472b6]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f472b6]">
                  Official Event Banquet Sheet (BEO)
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Event Reference: {selectedOrderForBEO.referenceCode}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-[#18181b] border border-zinc-700 text-zinc-300 hover:text-white"
                  title="Print BEO Sheet"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrderForBEO(null)}
                  className="p-2 rounded-xl bg-[#18181b] border border-zinc-700 text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* BEO Details Grid */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#09090b] p-4 rounded-xl border border-zinc-800">
                <div>
                  <span className="text-zinc-500 block">Client Name</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.clientName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Contact Phone</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.clientPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Email Address</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.clientEmail}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Event Date</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.eventDate}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Service Hours</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.eventTime} ({selectedOrderForBEO.eventDurationHours} hrs)</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Guest Count</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.guestCount} Guests</span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-zinc-500 block">Venue Location</span>
                  <span className="text-white font-medium">{selectedOrderForBEO.venueName}, {selectedOrderForBEO.venueCity}</span>
                </div>
              </div>

              <div className="bg-[#09090b] p-4 rounded-xl border border-zinc-800 space-y-2">
                <p className="text-zinc-300 font-semibold uppercase tracking-wider text-[10px]">
                  Hardware & Staff Deployment
                </p>
                <div className="grid grid-cols-2 gap-2 text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block">Bar Unit</span>
                    <span>{selectedOrderForBEO.barSetupName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Package Tier</span>
                    <span>{selectedOrderForBEO.packageName}</span>
                  </div>
                </div>
              </div>

              {/* Selected Cocktails */}
              <div className="bg-[#09090b] p-4 rounded-xl border border-zinc-800 space-y-2">
                <p className="text-zinc-300 font-semibold uppercase tracking-wider text-[10px]">
                  Curated Cocktail Recipes to Prep
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrderForBEO.selectedCocktailIds.map((cid) => {
                    const c = SIGNATURE_COCKTAILS.find((item) => item.id === cid);
                    return (
                      <div key={cid} className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-zinc-800 text-zinc-300">
                        <span className="font-semibold text-white">{c?.name || cid}</span>
                        {c?.garnish && <span className="text-zinc-500 block text-[10px]">Garnish: {c.garnish}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Billing Summary */}
              <div className="bg-[#09090b] p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 block text-[11px]">Total Event Cost</span>
                  <span className="font-serif text-xl font-bold text-white">
                    ${selectedOrderForBEO.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block text-[11px]">Deposit Status</span>
                  <span className="text-[#fbcfe8] font-bold">
                    {selectedOrderForBEO.depositStatus || 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrderForBEO(null)}
                className="px-6 py-2 rounded-xl bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Close BEO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ EDIT STAFF NOTES MODAL ------------------ */}
      {editingNotesOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-2">Staff & Prep Notes</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Add internal instructions (load-in codes, staff assignments, ice deliveries).
            </p>
            <textarea
              value={currentNoteText}
              onChange={(e) => setCurrentNoteText(e.target.value)}
              rows={4}
              placeholder="e.g., Gate code 4821. Venue requires load-in from rear alley by 14:00."
              className="w-full p-3 rounded-xl bg-[#18181b] border border-zinc-800 text-white text-xs focus:border-[#f472b6] focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingNotesOrderId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSaveAdminNotes(editingNotesOrderId, currentNoteText);
                  setEditingNotesOrderId(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#f472b6] text-xs font-bold text-[#09090b] hover:brightness-110"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MANUAL BOOKING MODAL ------------------ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-[#f472b6]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <h2 className="font-serif text-2xl font-bold text-white mb-1">
              Add Manual Event Booking
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Log phone orders, walk-ins, or corporate contract events directly.
            </p>

            <form onSubmit={handleCreateManualBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-300 font-medium block mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Victoria Sterling"
                  className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="victoria@luxuryevents.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Client Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="(555) 321-9876"
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Event Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as EventType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Corporate Gala & Launch">Corporate Gala & Launch</option>
                    <option value="Birthday Soirée">Birthday Soirée</option>
                    <option value="Bridal Shower / Bachelorette">Bridal Shower / Bachelorette</option>
                    <option value="Private Dinner Party">Private Dinner Party</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Guest Count</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Package Tier</label>
                  <select
                    value={newPackageId}
                    onChange={(e) => setNewPackageId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  >
                    {PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} (${pkg.priceStartingAt})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block mb-1">Bar Setup</label>
                  <select
                    value={newBarSetupId}
                    onChange={(e) => setNewBarSetupId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                  >
                    {BAR_SETUPS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Venue Name</label>
                <input
                  type="text"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  placeholder="e.g. Bel-Air Estate Lawn"
                  className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-medium block mb-1">Admin Internal Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Special instructions or phone agreement details"
                  className="w-full px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-800 text-white focus:border-[#f472b6] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#f472b6] text-[#09090b] font-bold hover:brightness-110"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase SQL DDL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121216] border border-[#f472b6]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f472b6]/20 border border-[#f472b6] flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#f472b6]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Supabase PostgreSQL Table Schema
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Table: <code className="text-[#f472b6]">public.bookings</code> with RLS policies
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 py-3">
              This schema is executed automatically when you click <strong>"⚡ Auto-Create Supabase Table"</strong> or when a customer completes a booking. You can also copy and run it directly in your Supabase project's SQL Editor:
            </p>

            <div className="flex-1 overflow-auto bg-[#09090b] p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed select-all">
              <pre>{serverStatus?.sqlScript || '-- Loading SQL script...'}</pre>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-zinc-500">
                Includes RLS policies and indexes for high performance
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {serverStatus?.projectRef && (
                  <a
                    href={`https://supabase.com/dashboard/project/${serverStatus.projectRef}/sql/new`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#18181b] border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#f472b6]/40 transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Supabase SQL Editor ↗</span>
                  </a>
                )}
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 rounded-xl bg-[#f472b6] text-[#09090b] font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
                >
                  {hasCopiedSql ? (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Query</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
