import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem } from '../types';
import { Plus, Check, Flame, Sparkles } from 'lucide-react';

export const FeaturedMeals: React.FC = () => {
  const { featuredItems, addToCart, setIsCartOpen } = useRestaurant();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section id="featured" className="py-24 bg-[#0a0a0d] relative border-t border-b border-[#d4af37]/15 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Culinary Masterpieces</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7] tracking-tight">
            Chef’s Signature Selection
          </h2>
          <p className="text-[#efe8db]/75 text-base sm:text-lg font-light leading-relaxed">
            Each creation is a synthesis of West African culinary storytelling and haute cuisine techniques, prepared fresh with seasonal harvest and ocean catches.
          </p>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.slice(0, 6).map((item) => {
            const isJustAdded = addedId === item.id;
            return (
              <div
                key={item.id}
                className="group rounded-2xl bg-[#12131b] border border-[#d4af37]/20 overflow-hidden flex flex-col hover:border-[#d4af37]/60 hover:shadow-[0_10px_30px_rgba(212,175,55,0.12)] transition-all duration-300"
              >
                {/* Image Container with 4:3 aspect ratio */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#171821]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback styled background
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12131b] via-transparent to-transparent opacity-80" />

                  {/* Category & Spice tag in clean unboxed style */}
                  <div className="absolute top-3 left-3 bg-[#08080a]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#d4af37]/20 text-[11px] font-medium text-[#d4af37] tracking-wider uppercase">
                    {item.category}
                  </div>

                  {item.spiceLevel && item.spiceLevel !== 'Mild' && (
                    <div className="absolute top-3 right-3 bg-[#08080a]/80 backdrop-blur-md px-2 py-1 rounded-md border border-red-500/30 text-[11px] font-medium text-red-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400" />
                      <span>{item.spiceLevel}</span>
                    </div>
                  )}

                  {/* Price Tag in Nigerian Naira */}
                  <div className="absolute bottom-3 right-3 bg-[#08080a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#d4af37]/40 text-sm font-mono font-bold text-[#f3dc8f] tabular-nums">
                    ₦{Number(item.price || 0).toLocaleString()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#d4af37]/80">
                      {item.tags?.map((tag, idx) => (
                        <React.Fragment key={tag}>
                          <span>{tag}</span>
                          {idx < (item.tags?.length || 0) - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#efe8db]/75 line-clamp-3 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Add to Order Action */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                    <span className="text-xs text-[#ded3c0]/60 font-mono">
                      Prep: {item.prepTime || '20-25 mins'}
                    </span>
                    <button
                      onClick={() => handleAdd(item)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-[#d4af37] text-[#08080a] hover:bg-[#e5c158] active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#171821] via-[#1a1b26] to-[#171821] border border-[#d4af37]/25 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#fdfbf7]">
              Craving something bespoke or hosting an exclusive celebration?
            </h4>
            <p className="text-sm text-[#efe8db]/70">
              Our culinary director custom designs multi-course degustation menus for private dinners.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('menu');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 76;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 rounded-full bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Browse Full Menu
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-3 rounded-full bg-[#d4af37] text-[#08080a] hover:brightness-110 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
