import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedMeals } from './components/FeaturedMeals';
import { MenuSection } from './components/MenuSection';
import { StoryAndAmbience } from './components/StoryAndAmbience';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ReservationModal } from './components/ReservationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LockvexModal } from './components/LockvexModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Sparkles } from 'lucide-react';

const RestaurantApp: React.FC = () => {
  const {
    restaurantInfo,
    setIsReservationModalOpen,
  } = useRestaurant();

  return (
    <div className="min-h-screen bg-[#08080a] text-[#fdfbf7] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      {/* Top Announcement Bar */}
      {restaurantInfo.announcement && (
        <div className="bg-gradient-to-r from-[#937418] via-[#d4af37] to-[#b89628] text-[#08080a] text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{restaurantInfo.announcement}</span>
          <button
            onClick={() => setIsReservationModalOpen(true)}
            className="underline hover:text-black ml-1 whitespace-nowrap hidden sm:inline"
          >
            Claim Offer
          </button>
        </div>
      )}

      {/* Main Luxury Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <FeaturedMeals />
        <MenuSection />
        <StoryAndAmbience />
      </main>

      {/* Professional Footer */}
      <Footer />

      {/* Pumping WhatsApp Live Action Button */}
      <FloatingWhatsApp />

      {/* Drawers & Modals */}
      <CartDrawer />
      <ReservationModal />
      <AdminDashboard />
      <LockvexModal />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <RestaurantApp />
    </RestaurantProvider>
  );
}
