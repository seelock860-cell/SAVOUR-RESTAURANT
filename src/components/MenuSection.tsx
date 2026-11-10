import React, { useState, useMemo, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuCategory, MenuItem } from '../types';
import { Search, Plus, Check, Flame, SlidersHorizontal, Info, Sparkles } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { menuItems, categories, addToCart, setIsCartOpen } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);

  // Lock background body scroll when Dish Customization Modal is open
  useEffect(() => {
    if (activeModalItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeModalItem]);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
    setAddedItemMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const handleModalAdd = () => {
    if (!activeModalItem) return;
    addToCart(activeModalItem, modalQuantity, customInstructions);
    setActiveModalItem(null);
    setCustomInstructions('');
    setModalQuantity(1);
    setIsCartOpen(true);
  };

  return (
    <section id="menu" className="py-24 bg-[#08080a] relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Epicurean Digital Catalog</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7]">
            The SAVOURÉ Food Menu
          </h2>
          <p className="text-[#efe8db]/75 text-base font-light">
            Crafted for connoisseurs. Every dish reflects uncompromised quality, authentic spices, and sublime presentation. Prices displayed in Nigerian Naira (₦).
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-[#d4af37]/80 bg-[#171821] px-4 py-1.5 rounded-full border border-[#d4af37]/20">
            <Info className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Interactive Portfolio Demonstration • Live WhatsApp & Checkout Simulation</span>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="space-y-6 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'bg-[#12131b] text-[#efe8db]/70 hover:text-[#fdfbf7] hover:border-[#d4af37]/50 border border-white/5'
              }`}
            >
              All Categories ({menuItems.length})
            </button>

            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'bg-[#12131b] text-[#efe8db]/70 hover:text-[#fdfbf7] hover:border-[#d4af37]/50 border border-white/5'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#ded3c0]/50 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, or spices..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-[#12131b] border border-[#d4af37]/20 text-sm text-[#fdfbf7] placeholder-[#efe8db]/40 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#ded3c0]/50 hover:text-[#fdfbf7]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#12131b]/60 rounded-2xl border border-white/5 max-w-lg mx-auto p-8 space-y-4">
            <p className="text-lg text-[#ded3c0]/80">No dishes matched "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#08080a] text-xs font-semibold uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const isAdded = addedItemMap[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveModalItem(item);
                    setModalQuantity(1);
                    setCustomInstructions('');
                  }}
                  className="group rounded-2xl bg-[#0f1016] border border-white/10 hover:border-[#d4af37]/50 hover:bg-[#13141f] p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
                >
                  <div className="space-y-4">
                    {/* Image with 4:3 ratio */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#181924]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#08080a]/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase text-[#d4af37] border border-[#d4af37]/20">
                        {item.category}
                      </div>

                      {item.isFeatured && (
                        <div className="absolute top-2.5 right-2.5 bg-[#d4af37] text-[#08080a] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                          Featured
                        </div>
                      )}

                      <div className="absolute bottom-2.5 right-2.5 bg-[#08080a]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#d4af37]/40 text-sm font-mono font-bold text-[#f3dc8f] tabular-nums">
                        ₦{Number(item.price || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-[#fdfbf7] group-hover:text-[#d4af37] transition-colors">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#ded3c0]/70 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price Row */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#d4af37] font-medium hover:underline">
                      Customize & View
                    </span>

                    <button
                      onClick={(e) => handleQuickAdd(item, e)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#d4af37] text-[#08080a] hover:bg-[#e5c158] active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
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
              );
            })}
          </div>
        )}

        {/* Dish Detail & Customization Modal */}
        {activeModalItem && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveModalItem(null);
            }}
            className="fixed inset-0 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-4 py-8 bg-black/80 backdrop-blur-sm animate-fade-in"
          >
            <div
              className="bg-[#0f1016] border border-[#d4af37]/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-6 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-[#181924]">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  ✕
                </button>
                <div className="absolute bottom-3 left-4 bg-[#08080a]/90 backdrop-blur-md px-3 py-1 rounded text-sm font-mono font-bold text-[#f3dc8f]">
                  ₦{Number(activeModalItem.price || 0).toLocaleString()}
                </div>
              </div>

              <div className="px-6 pb-6 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#d4af37] mb-1">
                    {activeModalItem.category}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#fdfbf7]">
                    {activeModalItem.name}
                  </h3>
                  <p className="text-sm text-[#ded3c0]/80 mt-2 leading-relaxed">
                    {activeModalItem.description}
                  </p>
                </div>

                {/* Special Instructions Field */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#d4af37] mb-1.5 font-medium">
                    Chef Preparation Notes / Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="E.g., extra spicy, no onions, dressing on side..."
                    className="w-full p-3 rounded-xl bg-[#171821] border border-white/10 text-xs text-[#fdfbf7] placeholder-[#efe8db]/30 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Quantity and Add CTA */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3 bg-[#171821] px-3 py-1.5 rounded-full border border-white/10">
                    <button
                      onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-full text-[#d4af37] hover:bg-white/10 flex items-center justify-center font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold text-white tabular-nums px-2">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity((q) => q + 1)}
                      className="w-7 h-7 rounded-full text-[#d4af37] hover:bg-white/10 flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleModalAdd}
                    className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      Add to Order • ₦{Number((activeModalItem.price || 0) * modalQuantity).toLocaleString()}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
