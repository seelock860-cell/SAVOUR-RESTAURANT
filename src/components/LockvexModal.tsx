import React, { useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Sparkles, MessageCircle, Globe, CheckCircle2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const LockvexModal: React.FC = () => {
  const { isLockvexModalOpen, setIsLockvexModalOpen, restaurantInfo } = useRestaurant();

  // Lock background body scroll when Lockvex Modal is open
  useEffect(() => {
    if (isLockvexModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLockvexModalOpen]);

  if (!isLockvexModalOpen) return null;

  const handleWhatsAppContact = () => {
    const waUrl = restaurantInfo.lockvexWhatsapp || 'https://wa.me/2349024971419?text=Hello%20LOCKVEX%20I%20am%20interested%20in%20a%20luxury%20website%20like%20Savoure';
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsLockvexModalOpen(false);
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-start sm:items-center justify-center py-8 sm:py-12 animate-fade-in"
    >
      <div
        className="relative bg-[#0d0e14] border border-[#d4af37]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsLockvexModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-[#ded3c0] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b89628] text-[#08080a] flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                  LOCKVEX ⚡
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 uppercase tracking-widest font-mono">
                  Agency Portfolio
                </span>
              </div>
              <p className="text-xs text-[#ded3c0]/70">
                Professional Website & Web Application Development
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#efe8db]/85 leading-relaxed font-light">
            This <strong className="text-[#f3dc8f] font-medium">SAVOURÉ RESTAURANT</strong> experience is an exclusive demonstration built by <strong>LOCKVEX ⚡</strong> to showcase bespoke culinary digital storefronts, friction-free WhatsApp ordering, table booking automation, and real-time operations portals.
          </p>

          {/* Key Agency Capabilities */}
          <div className="space-y-2.5">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold block">
              What We Build for Restaurants & Brands:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#efe8db]">
              <div className="p-3 rounded-xl bg-[#14151e] border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Luxury Responsive Design</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14151e] border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Instant WhatsApp Checkout</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14151e] border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Table Reservation Engines</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14151e] border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Custom Executive Dashboards</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14151e] border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Supabase & Cloud Sync</span>
              </div>
              <div className="p-3 rounded-xl bg-[#14151e] border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>High Performance & SEO</span>
              </div>
            </div>
          </div>

          {/* Contact Action */}
          <div className="p-4 rounded-2xl bg-[#14151e] border border-[#d4af37]/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#ded3c0]/70">Interested in a website for your restaurant or brand?</span>
            </div>
            <button
              onClick={handleWhatsAppContact}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with LOCKVEX ⚡ on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-center text-[#ded3c0]/50">
            © {new Date().getFullYear()} LOCKVEX ⚡ Professional Website Development. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
