import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { getWhatsAppUrl } from '../lib/whatsapp';
import { MapPin, Clock, Phone, Mail, MessageCircle, Star, Sparkles, Navigation } from 'lucide-react';
import { heroImg } from '../data/initialData';

export const StoryAndAmbience: React.FC = () => {
  const { restaurantInfo, setIsReservationModalOpen } = useRestaurant();

  const testimonials = [
    {
      name: 'Chef Opeoluwa Cole',
      title: 'West African Gastronomy Critic',
      review:
        'SAVOURÉ transcends traditional fine dining. The smoky firewood jollof with charred lobster tail and yaji-dusted Wagyu rival the finest Michelin tables across Paris and London.',
      rating: 5,
    },
    {
      name: 'Dame Nneka Adeleke',
      title: 'Patron & Lifestyle Curator',
      review:
        'The atmosphere is pure quiet luxury — dark granite, brushed brass, warm candlelight. It has quickly become our family’s premier choice for anniversary milestones in Lagos.',
      rating: 5,
    },
    {
      name: 'Marcus Sterling',
      title: 'International Food & Wine Journal',
      review:
        'A magnificent testament to Nigerian culinary artistry elevated with French technique. The Zobo Hibiscus Champagne Sangria alone is worth crossing continents for.',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* 1. Culinary Heritage & Story Section */}
      <section id="story" className="py-24 bg-[#0a0a0d] relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl bg-[#14151e]">
                <img
                  src={heroImg}
                  alt="Atmospheric Ambience at Savoure"
                  className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#08080a]/90 backdrop-blur-md border border-white/10 text-xs text-[#efe8db]">
                  <p className="font-serif text-sm font-semibold text-[#f3dc8f] mb-1">
                    "Every plate tells the ancient tale of spice caravans and coastal fishermen."
                  </p>
                  <span className="text-[11px] text-[#ded3c0]/60">— Culinary Vision Statement</span>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The SAVOURÉ Philosophy</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7] leading-tight">
                Where African Heritage Meets Uncompromised Elegance
              </h2>

              <p className="text-base text-[#efe8db]/80 leading-relaxed font-light">
                Founded with a singular conviction: that West Africa's ancient spice repertoires, firewood-roasted delicacies, and coastal ocean treasures deserve a permanent seat on the global fine-dining stage.
              </p>

              <p className="text-sm text-[#efe8db]/70 leading-relaxed font-light">
                At SAVOURÉ, our culinary artisans scour smallholder farms across Oyo, Kano, and Delta states for heirloom botanicals, while our seafood is wild-caught daily by artisanal fishermen off the Atlantic shores of Lagos.
              </p>

              {/* Three Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#f3dc8f]">Artisanal Charcoal</h4>
                  <p className="text-xs text-[#ded3c0]/60">Slow-smoked over aged mangrove wood for signature depth.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#f3dc8f]">Ocean To Table</h4>
                  <p className="text-xs text-[#ded3c0]/60">Fresh lobster, king prawns, and red snapper within 6 hours of catch.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-[#f3dc8f]">Curated Cellar</h4>
                  <p className="text-xs text-[#ded3c0]/60">Over 180 rare vintages, grand crus, and African botanical distillations.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsReservationModalOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                >
                  Experience It in Person
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Testimonials Section */}
      <section className="py-20 bg-[#08080a] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">Critical Acclaim</span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#fdfbf7]">
              Words from Our Patrons
            </h3>
            <p className="text-xs sm:text-sm text-[#ded3c0]/70">
              Honored to craft unforgettable evenings for culinary connoisseurs and esteemed guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#0f1016] border border-[#d4af37]/20 flex flex-col justify-between space-y-6 hover:border-[#d4af37]/50 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex text-[#d4af37] gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#efe8db]/85 italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h5 className="font-serif text-base font-bold text-[#fdfbf7]">{t.name}</h5>
                  <p className="text-xs text-[#d4af37]/80">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Hours & Location Section */}
      <section id="location" className="py-24 bg-[#0a0a0d] relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Hours & Contact Card */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#0f1016] border border-[#d4af37]/30 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d4af37]">Visit Us</span>
                  <h3 className="font-serif text-3xl font-bold text-[#fdfbf7] mt-1">
                    Hours & Sanctuary Location
                  </h3>
                </div>

                {/* Opening Hours */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                    <Clock className="w-4 h-4" />
                    <span>Dining Hours</span>
                  </div>
                  <div className="space-y-2 text-xs divide-y divide-white/5">
                    {restaurantInfo.openingHours.map((h, i) => (
                      <div key={i} className="pt-2 first:pt-0 flex justify-between items-center text-[#ded3c0]">
                        <span className="font-medium text-white">{h.days}</span>
                        <span className="font-mono text-[#f3dc8f] tabular-nums">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address & Contact */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-start gap-3 text-xs text-[#ded3c0]">
                    <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">{restaurantInfo.address}</p>
                      <p className="text-[#ded3c0]/70">{restaurantInfo.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#ded3c0]">
                    <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>{restaurantInfo.phone}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#ded3c0]">
                    <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>{restaurantInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <a
                  href={getWhatsAppUrl(restaurantInfo.whatsappNumber, 'Hello SAVOURÉ Restaurant, I would like to inquire about dining')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquiries</span>
                </a>

                <button
                  onClick={() => setIsReservationModalOpen(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#d4af37] text-[#08080a] text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Book Table
                </button>
              </div>
            </div>

            {/* Interactive Location Visual Card */}
            <div className="lg:col-span-7 rounded-3xl bg-[#0f1016] border border-[#d4af37]/30 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#d4af37]">Enclave Map</span>
                    <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">Admiralty Enclave, Lagos</h4>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Admiralty+Way+Victoria+Island+Lagos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171821] border border-[#d4af37]/30 text-xs text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open in Maps</span>
                  </a>
                </div>

                <p className="text-xs text-[#ded3c0]/80">
                  Nestled in the prestigious Admiralty waterfront corridor of Victoria Island, with valet parking, 24/7 executive security, private marina boat access, and secluded VIP lounges.
                </p>

                {/* Stylized Visual Map Representation */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#14151e] border border-white/10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-radial from-[#d4af37]/10 via-[#0a0a0d] to-[#08080a] opacity-80" />
                  
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

                  {/* Pin Mark */}
                  <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                    <div className="w-12 h-12 rounded-full bg-[#d4af37] text-[#08080a] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                      <MapPin className="w-6 h-6 fill-current" />
                    </div>
                    <div className="mt-2 px-3 py-1 rounded-full bg-[#08080a]/90 border border-[#d4af37]/40 text-xs font-serif font-bold text-[#f3dc8f]">
                      SAVOURÉ RESTAURANT
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 text-[11px] text-[#ded3c0]/60 bg-[#08080a]/80 backdrop-blur-sm px-3 py-1 rounded-md border border-white/5">
                    14A Admiralty Way, Victoria Island, Lagos
                  </div>
                </div>
              </div>

              {/* Valet & Dress Code Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[#ded3c0]/80">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span>Complimentary Valet Parking Available</span>
                </div>
                <div className="flex items-center gap-2 text-[#ded3c0]/80">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span>Dress Code: Smart Elegant / Traditional Formal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
