import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ArrowRight, Calendar, Star, Compass } from 'lucide-react';
import { heroImg, jollofImg } from '../data/initialData';

export const Hero: React.FC = () => {
  const { setIsReservationModalOpen } = useRestaurant();

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
    <section id="home" className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden scroll-mt-20">
      {/* Background with measured luxury scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Fine Dining at Savoure Restaurant"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[12000ms]"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark vignette & scrim for 4.5:1 text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Statement & Primary CTAs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Architectural Trust marker with typographic separators */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
              <span>Haute African Gastronomy</span>
              <span aria-hidden="true" className="text-[#d4af37]/60">·</span>
              <span>Victoria Island, Lagos</span>
              <span aria-hidden="true" className="text-[#d4af37]/60">·</span>
              <span>Est. 2024</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#fdfbf7] leading-[1.08] text-balance">
              Exceptional Taste.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f3dc8f] via-[#d4af37] to-[#b89628] italic font-normal">
                Unforgettable Moments.
              </span>
            </h1>

            {/* Restaurant Introduction */}
            <p className="text-base sm:text-lg text-[#efe8db]/85 max-w-2xl font-light leading-relaxed">
              Welcome to SAVOURÉ — an extraordinary epicurean sanctuary where the vibrant soul of African culinary heritage meets contemporary Michelin-level craftsmanship. Indulge in artisanal grills, wild ocean catches, and bespoke mixology.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => setIsReservationModalOpen(true)}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89628] text-[#08080a] font-semibold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 transition-all"
              >
                <Calendar className="w-4 h-4 text-[#08080a]" />
                <span>Reserve a Table</span>
                <ArrowRight className="w-4 h-4 text-[#08080a] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('menu')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#d4af37]/50 bg-[#171821]/60 text-[#fdfbf7] font-semibold text-sm uppercase tracking-wider hover:bg-[#d4af37]/10 hover:border-[#d4af37] active:scale-95 transition-all backdrop-blur-sm"
              >
                <Compass className="w-4 h-4 text-[#d4af37]" />
                <span>Explore Our Menu</span>
              </button>
            </div>

            {/* Social Proof Strip with subtle hairline borders */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#f3dc8f] tabular-nums">
                  4.9<span className="text-sm font-sans text-[#ded3c0] font-normal">/5.0</span>
                </div>
                <div className="text-xs text-[#ded3c0]/70 mt-0.5">Over 1,200 Fine Dining Patrons</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#f3dc8f] tabular-nums">
                  100%
                </div>
                <div className="text-xs text-[#ded3c0]/70 mt-0.5">Prime Artisanal Sourced Ingredients</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#f3dc8f] tabular-nums">
                  #1
                </div>
                <div className="text-xs text-[#ded3c0]/70 mt-0.5">Premier Luxury Dining in Lagos</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/10 to-transparent shadow-2xl backdrop-blur-md">
              <div className="bg-[#0f1015]/90 rounded-2xl p-6 border border-[#d4af37]/20 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#d4af37]">
                  <span className="tracking-widest uppercase">Tonight's Chef Showcase</span>
                  <div className="flex items-center gap-1 text-[#e5c158]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5">
                  <img
                    src={jollofImg}
                    alt="Royal Tiger Prawn & Smoked Jollof"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#08080a]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#d4af37]/30 text-xs font-mono font-medium text-[#f3dc8f] tabular-nums">
                    ₦18,500
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-semibold text-[#fdfbf7]">
                    Royal Tiger Prawn & Smoked Jollof
                  </h3>
                  <p className="text-xs text-[#ded3c0]/80 line-clamp-2">
                    Smoky firewood-infused long-grain jollof cooked in rich bell pepper reductions with flame-grilled jumbo tiger prawns.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[#ded3c0]/60">Pre-order for dinner tonight</span>
                  <button
                    onClick={() => scrollToSection('menu')}
                    className="text-[#d4af37] font-medium hover:underline inline-flex items-center gap-1"
                  >
                    View in Menu <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
