import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Reservation } from '../types';
import { cleanWhatsAppNumber } from '../lib/whatsapp';
import { X, Calendar, Clock, Users, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReservationModal: React.FC = () => {
  const {
    isReservationModalOpen,
    setIsReservationModalOpen,
    createReservation,
    restaurantInfo,
  } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [date, setDate] = useState(() => {
    // Tomorrow as default date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<'Grand Dining Hall' | 'Private VIP Suite' | 'Terrace Lounge'>('Grand Dining Hall');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock background body scroll when Reservation Modal is open
  useEffect(() => {
    if (isReservationModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isReservationModalOpen]);

  if (!isReservationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMessage('Please provide your name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMessage('Please provide a valid phone number');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await createReservation({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        date,
        time,
        guests,
        seatingArea,
        specialRequests: specialRequests.trim() || undefined,
      });

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#e5c158', '#b89628'],
        });
      } catch (e) {
        console.warn('Confetti animation skipped', e);
      }

      setConfirmedReservation(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToWhatsApp = () => {
    if (!confirmedReservation) return;
    const cleanPhone = cleanWhatsAppNumber(restaurantInfo.whatsappNumber);
    const lines = [
      '*SAVOURÉ RESTAURANT — TABLE RESERVATION* 🥂',
      '---------------------------------------',
      `*Booking Reference:* ${confirmedReservation.referenceCode}`,
      `*Guest:* ${confirmedReservation.customerName}`,
      `*Phone:* ${confirmedReservation.customerPhone}`,
      `*Date:* ${confirmedReservation.date}`,
      `*Time:* ${confirmedReservation.time}`,
      `*Party Size:* ${confirmedReservation.guests} Guest(s)`,
      `*Seating Area:* ${confirmedReservation.seatingArea}`,
    ];
    if (confirmedReservation.specialRequests) {
      lines.push(`*Special Request:* ${confirmedReservation.specialRequests}`);
    }
    lines.push('---------------------------------------');
    lines.push('Please confirm host greeting and table assignment.');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsReservationModalOpen(false);
    setConfirmedReservation(null);
    setErrorMessage('');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex items-start sm:items-center justify-center py-8 sm:py-12 animate-fade-in"
    >
      <div
        className="relative bg-[#0e0f14] border border-[#d4af37]/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 text-[#ded3c0] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedReservation ? (
          /* Confirmation Success State */
          <div className="text-center py-6 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37]">Reservation Confirmed</span>
              <h3 className="font-serif text-3xl font-bold text-[#fdfbf7]">
                We Look Forward to Hosting You
              </h3>
              <p className="text-xs text-[#ded3c0]/70 max-w-sm mx-auto">
                A table has been allocated for {confirmedReservation.customerName}.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#14151e] border border-[#d4af37]/30 rounded-2xl p-5 text-left space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs text-[#ded3c0]/70 uppercase tracking-wider">Booking Reference</span>
                <span className="font-mono text-sm font-bold text-[#f3dc8f] tracking-wider">
                  {confirmedReservation.referenceCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#ded3c0]/60 block mb-0.5">Date & Time</span>
                  <span className="font-medium text-white">
                    {confirmedReservation.date} at {confirmedReservation.time}
                  </span>
                </div>
                <div>
                  <span className="text-[#ded3c0]/60 block mb-0.5">Guests</span>
                  <span className="font-medium text-white">{confirmedReservation.guests} Person(s)</span>
                </div>
                <div>
                  <span className="text-[#ded3c0]/60 block mb-0.5">Seating Ambience</span>
                  <span className="font-medium text-[#d4af37]">{confirmedReservation.seatingArea}</span>
                </div>
                <div>
                  <span className="text-[#ded3c0]/60 block mb-0.5">Contact</span>
                  <span className="font-medium text-white truncate block">{confirmedReservation.customerPhone}</span>
                </div>
              </div>

              {confirmedReservation.specialRequests && (
                <div className="pt-2 border-t border-white/5 text-xs">
                  <span className="text-[#ded3c0]/60 block mb-0.5">Special Notes</span>
                  <p className="text-white italic">{confirmedReservation.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSendToWhatsApp}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl bg-[#d4af37] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:bg-[#e5c158]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Table Reservation</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
                Reserve Your Dining Experience
              </h3>
              <p className="text-xs text-[#ded3c0]/70">
                Experience exceptional hospitality and unforgettable culinary storytelling at SAVOURÉ.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Guest Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#ded3c0]/70 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Chief Adeleke"
                  className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#ded3c0]/70 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs text-[#ded3c0]/70 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="for calendar invite & confirmation"
                className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Date, Time & Number of Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-[#ded3c0]/70 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#ded3c0]/70 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Time *</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="12:00">12:00 PM (Lunch)</option>
                  <option value="13:30">01:30 PM (Lunch)</option>
                  <option value="15:00">03:00 PM (Afternoon)</option>
                  <option value="18:00">06:00 PM (Dinner)</option>
                  <option value="19:30">07:30 PM (Dinner)</option>
                  <option value="20:30">08:30 PM (Dinner)</option>
                  <option value="21:45">09:45 PM (Late Evening)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#ded3c0]/70 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Guests *</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seating Ambience */}
            <div>
              <label className="block text-xs text-[#ded3c0]/70 mb-1.5 font-medium">
                Preferred Seating Area
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Grand Dining Hall', 'Private VIP Suite', 'Terrace Lounge'] as const).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSeatingArea(area)}
                    className={`p-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                      seatingArea === area
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f3dc8f]'
                        : 'border-white/10 bg-[#14151e] text-[#ded3c0]/70 hover:border-white/20'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs text-[#ded3c0]/70 mb-1">
                Special Requests / Occasion
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Anniversary, business executive dinner, dietary allergy, champagne toast on arrival..."
                className="w-full p-3 rounded-xl bg-[#14151e] border border-white/10 text-xs text-white placeholder-[#ded3c0]/30 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89628] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#08080a]" />
              <span>{isSubmitting ? 'Confirming Table...' : 'Confirm Reservation'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
