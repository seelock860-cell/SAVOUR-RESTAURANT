import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, Shield, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsReservationModalOpen,
    setIsAdminModalOpen,
    restaurantInfo,
  } = useRestaurant();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#d4af37]/20 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#0b0c10]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="flex items-center gap-2 group whitespace-nowrap shrink-0"
          >
            <span className="w-8 h-8 rounded-full border border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-[0.2em] font-semibold text-[#f8f4ec] group-hover:text-[#d4af37] transition-colors">
                SAVOURÉ
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#ded3c0] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4af37] after:transition-all"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('featured')}
              className="text-[#ded3c0] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4af37] after:transition-all"
            >
              Signatures
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-[#ded3c0] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4af37] after:transition-all"
            >
              Full Menu
            </button>
            <button
              onClick={() => scrollToSection('story')}
              className="text-[#ded3c0] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4af37] after:transition-all"
            >
              Our Story
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-[#ded3c0] hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#d4af37] after:transition-all"
            >
              Hours & Location
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[#b89628] hover:text-[#e5c158] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Zone 3: Primary action + Cart affordance */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Shopping Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full border border-[#d4af37]/30 bg-[#171821]/80 text-[#f8f4ec] hover:text-[#d4af37] hover:border-[#d4af37] transition-all"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-[#08080a] font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary CTA button */}
            <button
              onClick={() => setIsReservationModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Table</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg border border-[#d4af37]/30 text-[#f8f4ec] hover:text-[#d4af37]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0f14]/98 border-b border-[#d4af37]/30 px-6 py-6 space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col space-y-3 text-base">
            <button
              onClick={() => scrollToSection('home')}
              className="text-left text-[#f8f4ec] hover:text-[#d4af37] py-2 border-b border-white/5"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('featured')}
              className="text-left text-[#f8f4ec] hover:text-[#d4af37] py-2 border-b border-white/5"
            >
              Signature Dishes
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-left text-[#f8f4ec] hover:text-[#d4af37] py-2 border-b border-white/5"
            >
              Digital Food Menu
            </button>
            <button
              onClick={() => scrollToSection('story')}
              className="text-left text-[#f8f4ec] hover:text-[#d4af37] py-2 border-b border-white/5"
            >
              Our Culinary Story
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-left text-[#f8f4ec] hover:text-[#d4af37] py-2 border-b border-white/5"
            >
              Hours & Location
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminModalOpen(true);
              }}
              className="text-left text-[#d4af37] py-2 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Management</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsReservationModalOpen(true);
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] font-semibold text-center text-sm uppercase tracking-wider"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full py-3 rounded-full border border-[#d4af37]/40 bg-[#171821] text-[#f8f4ec] text-center text-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
              <span>View Order Cart ({cartCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
