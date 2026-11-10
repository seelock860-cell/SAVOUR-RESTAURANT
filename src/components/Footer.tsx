import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Sparkles, MapPin, Phone, Mail, Clock, Shield, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    restaurantInfo,
    setIsReservationModalOpen,
    setIsAdminModalOpen,
    setIsLockvexModalOpen,
  } = useRestaurant();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-[#060608] border-t border-[#d4af37]/20 pt-16 pb-12 text-xs text-[#ded3c0]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand & Introduction */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
              </span>
              <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#f8f4ec]">
                SAVOURÉ
              </span>
            </div>
            <p className="text-xs text-[#ded3c0]/80 leading-relaxed font-light">
              An elevated dining sanctuary in Victoria Island, Lagos. Where contemporary gastronomy harmonizes with African culinary heritage.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  The Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('featured')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Chef’s Signatures
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Digital Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('story')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Our Culinary Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('location')}
                  className="hover:text-[#d4af37] transition-colors"
                >
                  Hours & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Dining Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Dining Hours</span>
            </h4>
            <ul className="space-y-2 text-[11px]">
              {restaurantInfo.openingHours.map((h, i) => (
                <li key={i} className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-white/80">{h.days}</span>
                  <span className="font-mono text-[#f3dc8f] tabular-nums">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sanctuary Location & Admin */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Sanctuary Address</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              <p className="text-white">{restaurantInfo.address}</p>
              <p className="text-[#ded3c0]/60">{restaurantInfo.city}</p>
              <p className="text-white pt-1">{restaurantInfo.phone}</p>
              <p className="text-[#ded3c0]/60">{restaurantInfo.email}</p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#b89628] hover:text-[#d4af37] transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Executive Admin Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Notice & LOCKVEX Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-[11px] text-[#ded3c0]/50 max-w-xl">
            Portfolio Demonstration Project: SAVOURÉ RESTAURANT is an illustrative showcase created to demonstrate bespoke restaurant web design, real-time ordering, and table booking technology.
          </div>

          {/* Required LOCKVEX Branding Link */}
          <div className="shrink-0">
            <button
              onClick={() => setIsLockvexModalOpen(true)}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12131b] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs text-[#fdfbf7] hover:text-[#d4af37] transition-all shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-[#d4af37] group-hover:scale-110 transition-transform" />
              <span>
                Website Designed &amp; Developed by{' '}
                <strong className="text-[#d4af37] font-semibold">LOCKVEX ⚡</strong>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
