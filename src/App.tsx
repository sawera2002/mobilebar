import React, { useState, useEffect, useCallback } from 'react';
import { AppPage, BookingOrder, BookingStatus } from './types';
import { INITIAL_BOOKINGS } from './data/barData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { MobileBarsPage } from './components/MobileBarsPage';
import { PackagesPage } from './components/PackagesPage';
import { BookingPage } from './components/BookingPage';
import { AdminDashboard } from './components/AdminDashboard';
import {
  fetchBookings,
  submitBookingToServer,
  updateBookingOnServer,
  deleteBookingOnServer,
} from './services/supabaseApi';

export default function App() {
  // Check if current URL path is /admin or #/admin
  const detectIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.startsWith('/admin') ||
      hash === '#/admin' ||
      hash === '#admin' ||
      search.includes('page=admin') ||
      search.includes('admin=true')
    );
  };

  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    return detectIsAdminRoute() ? 'admin' : 'home';
  });

  // Stored Bookings State with LocalStorage persistence + Supabase Server Sync
  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    try {
      const stored = localStorage.getItem('cosmo_mobile_bar_orders');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
    }
    return INITIAL_BOOKINGS;
  });

  const [isLoadingServerBookings, setIsLoadingServerBookings] = useState(false);
  const [supabaseSource, setSupabaseSource] = useState<'supabase' | 'local_fallback'>('local_fallback');

  const loadServerBookings = useCallback(async () => {
    setIsLoadingServerBookings(true);
    try {
      const { orders: serverOrders, source } = await fetchBookings();
      setSupabaseSource(source);
      if (serverOrders && serverOrders.length > 0) {
        setOrders(serverOrders);
      }
    } catch (err) {
      console.warn('Failed to load server bookings:', err);
    } finally {
      setIsLoadingServerBookings(false);
    }
  }, []);

  // Fetch real bookings from Supabase on mount
  useEffect(() => {
    loadServerBookings();
  }, [loadServerBookings]);

  // Sync orders to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('cosmo_mobile_bar_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }, [orders]);

  // Handle URL change detection (back/forward navigation, manual URL typing)
  useEffect(() => {
    const handleUrlChange = () => {
      if (detectIsAdminRoute()) {
        setCurrentPage('admin');
      } else {
        // If not admin and current page is admin, revert to home
        setCurrentPage((prev) => (prev === 'admin' ? 'home' : prev));
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Navigation handler that synchronizes browser URL history
  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    try {
      if (page === 'admin') {
        if (!window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/admin');
        }
      } else {
        if (window.location.pathname.startsWith('/admin')) {
          window.history.pushState(null, '', '/');
        }
      }
    } catch (e) {
      console.error('History push error', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking wizard pre-selection state
  const [bookingPackageId, setBookingPackageId] = useState<string>('pkg-pink-velvet');
  const [bookingBarSetupId, setBookingBarSetupId] = useState<string>('trailer-onyx-rose');

  // Booking Operations for Admin & Public
  const handleBookingSubmitted = async (newBooking: BookingOrder) => {
    setOrders((prev) => [newBooking, ...prev]);
    // Save to server (which persists to disk and Supabase cloud)
    const result = await submitBookingToServer(newBooking);
    if (result?.booking) {
      setOrders((prev) =>
        prev.map((o) => (o.id === newBooking.id ? { ...newBooking, ...result.booking } : o))
      );
    }
    loadServerBookings();
  };

  const handleUpdateOrderStatus = (orderId: string, status: BookingStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    updateBookingOnServer(orderId, { status });
  };

  const handleUpdateDepositStatus = (
    orderId: string,
    depositStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, depositStatus } : o))
    );
    updateBookingOnServer(orderId, { depositStatus });
  };

  const handleSaveAdminNotes = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, adminNotes: notes } : o))
    );
    updateBookingOnServer(orderId, { adminNotes: notes });
  };

  const handleAddManualBooking = async (newBooking: BookingOrder) => {
    setOrders((prev) => [newBooking, ...prev]);
    const result = await submitBookingToServer(newBooking);
    if (result?.booking) {
      setOrders((prev) =>
        prev.map((o) => (o.id === newBooking.id ? { ...newBooking, ...result.booking } : o))
      );
    }
    loadServerBookings();
  };

  const handleDeleteBooking = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    deleteBookingOnServer(orderId);
  };

  const handleSelectPackageAndBook = (packageId: string) => {
    setBookingPackageId(packageId);
    handleNavigate('booking');
  };

  const handleSelectBarSetupAndBook = (setupId: string) => {
    setBookingBarSetupId(setupId);
    handleNavigate('booking');
  };

  // If in admin mode, show the dedicated admin experience
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#f472b6] selection:text-[#09090b]">
        <AdminDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateDepositStatus={handleUpdateDepositStatus}
          onSaveAdminNotes={handleSaveAdminNotes}
          onAddManualBooking={handleAddManualBooking}
          onDeleteBooking={handleDeleteBooking}
          onNavigate={handleNavigate}
          onRefreshBookings={loadServerBookings}
          isLoadingBookings={isLoadingServerBookings}
          supabaseSource={supabaseSource}
        />
      </div>
    );
  }

  // Public 5-Page Website
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#f472b6] selection:text-[#09090b]">
      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Pages */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectPackage={handleSelectPackageAndBook}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'bars' && (
          <MobileBarsPage
            onSelectBarSetup={handleSelectBarSetupAndBook}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'menu' && (
          <PackagesPage
            onSelectPackage={handleSelectPackageAndBook}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'booking' && (
          <BookingPage
            initialPackageId={bookingPackageId}
            onBookingSubmitted={handleBookingSubmitted}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer with Admin Portal Access */}
      <Footer
        onNavigate={handleNavigate}
      />
    </div>
  );
}
