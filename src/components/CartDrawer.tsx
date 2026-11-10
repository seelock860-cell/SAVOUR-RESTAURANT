import React, { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, MenuItem } from '../types';
import { cleanWhatsAppNumber } from '../lib/whatsapp';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowRight,
  AlertCircle,
  Truck,
  Store,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    menuItems,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    restaurantInfo,
    createOrder,
    customerInfo,
    updateCustomerInfo,
  } = useRestaurant();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Lock background body scroll when Cart Drawer is open
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const validateForm = () => {
    const errors: { name?: boolean; phone?: boolean; address?: boolean } = {};
    let errorMsg = '';

    if (!customerInfo.name.trim()) {
      errors.name = true;
      errorMsg = 'Please enter your full name to proceed with your order.';
    } else if (!customerInfo.phone.trim() || customerInfo.phone.trim().length < 7) {
      errors.phone = true;
      errorMsg = 'Please provide a valid phone number for delivery contact.';
    } else if (customerInfo.orderType === 'Delivery' && !customerInfo.address.trim()) {
      errors.address = true;
      errorMsg = 'Please enter your delivery street address in Lagos.';
    }

    setFieldErrors(errors);
    setErrorMessage(errorMsg);

    if (errors.name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (errors.phone && phoneInputRef.current) {
      phoneInputRef.current.focus();
    } else if (errors.address && addressInputRef.current) {
      addressInputRef.current.focus();
    }

    return Object.keys(errors).length === 0;
  };

  // Generate formatted WhatsApp message text
  const generateWhatsAppMessage = (orderId?: string) => {
    const cleanPhone = cleanWhatsAppNumber(restaurantInfo.whatsappNumber);
    const lines: string[] = [
      '*SAVOURÉ RESTAURANT — NEW ORDER* 🍽️',
      '---------------------------------',
      ...(orderId ? [`*Order Ref:* ${orderId}`] : []),
      `*Customer:* ${customerInfo.name.trim()}`,
      `*Phone:* ${customerInfo.phone.trim()}`,
      `*Order Type:* ${customerInfo.orderType}`,
      customerInfo.orderType === 'Delivery'
        ? `*Delivery Address:* ${customerInfo.address.trim()}`
        : '*Pickup:* At Restaurant Lounge Counter',
      `*Payment Method:* ${customerInfo.paymentMethod}`,
    ];

    if (customerInfo.notes.trim()) {
      lines.push(`*Special Instructions:* ${customerInfo.notes.trim()}`);
    }

    lines.push('');
    lines.push('*ITEMS ORDERED:*');
    cart.forEach((c, i) => {
      lines.push(
        `${i + 1}. ${c.menuItem.name} (x${c.quantity}) — ₦${(
          c.menuItem.price * c.quantity
        ).toLocaleString()}${c.instructions ? ` (Note: ${c.instructions})` : ''}`
      );
    });

    lines.push('');
    lines.push(`*Subtotal:* ₦${cartSubtotal.toLocaleString()}`);
    lines.push(
      customerInfo.orderType === 'Delivery'
        ? `*Delivery Fee:* ${cartDeliveryFee === 0 ? 'FREE' : `₦${cartDeliveryFee.toLocaleString()}`}`
        : '*Delivery Fee:* FREE (Pickup)'
    );
    lines.push(
      `*TOTAL AMOUNT:* ₦${(customerInfo.orderType === 'Delivery' ? cartTotal : cartSubtotal).toLocaleString()}`
    );
    lines.push('---------------------------------');
    lines.push('*Status:* Awaiting kitchen preparation');
    lines.push('Powered by LOCKVEX ⚡ Digital Suite');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const order = await createOrder({
        customerName: customerInfo.name.trim(),
        customerPhone: customerInfo.phone.trim(),
        deliveryAddress:
          customerInfo.orderType === 'Delivery'
            ? customerInfo.address.trim()
            : 'In-Restaurant Pickup at Admiralty Lounge',
        orderType: customerInfo.orderType,
        paymentMethod: customerInfo.paymentMethod,
        notes: customerInfo.notes.trim() || undefined,
      });

      // Launch celebratory confetti safely
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f3dc8f', '#ffffff'],
        });
      } catch (e) {
        console.warn('Confetti skipped', e);
      }

      // If user selected WhatsApp payment method, open WhatsApp in new tab
      if (customerInfo.paymentMethod === 'WhatsApp Order') {
        const waUrl = generateWhatsAppMessage(order.id);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      setCompletedOrder(order);
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage('Failed to place order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setCompletedOrder(null);
    setErrorMessage('');
    setFieldErrors({});
  };

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1);
  };

  const scrollToMenu = () => {
    handleClose();
    const el = document.getElementById('menu');
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Top 3 quick add items for empty cart
  const quickItems = menuItems.slice(0, 3);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end"
    >
      <div className="w-full max-w-lg bg-[#0e0f14] border-l border-[#d4af37]/30 h-full flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#12131b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">Your Dining Order</h3>
              <p className="text-xs text-[#ded3c0]/60">
                {cart.length === 0 ? 'Bag is empty' : `${cart.length} unique dish(es) in bag`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-[#ded3c0]/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Order Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Order Confirmation View */}
        {completedOrder ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37]">Order Placed Successfully</span>
              <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">
                Thank You, {completedOrder.customerName}!
              </h4>
              <p className="text-xs text-[#ded3c0]/80 max-w-xs mx-auto">
                Your order is confirmed and has been transmitted to our executive kitchen.
              </p>
              <div className="inline-block px-4 py-1.5 rounded-lg bg-[#171821] border border-[#d4af37]/40 font-mono text-sm font-bold text-[#f3dc8f]">
                Reference ID: {completedOrder.id}
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full bg-[#12131b] p-5 rounded-2xl border border-white/10 text-left text-xs space-y-2.5">
              <div className="flex justify-between text-[#ded3c0]/80">
                <span>Customer:</span>
                <span className="font-semibold text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-[#ded3c0]/80">
                <span>Phone:</span>
                <span className="font-mono text-white">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between text-[#ded3c0]/80">
                <span>Order Type:</span>
                <span className="text-white font-medium">{completedOrder.orderType}</span>
              </div>
              {completedOrder.orderType === 'Delivery' && (
                <div className="flex justify-between text-[#ded3c0]/80">
                  <span>Address:</span>
                  <span className="text-white text-right max-w-[200px] truncate">{completedOrder.deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between text-[#ded3c0]/80">
                <span>Payment:</span>
                <span className="text-[#f3dc8f] font-medium">{completedOrder.paymentMethod}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-[#f3dc8f]">₦{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* If Bank Transfer, show details */}
            {completedOrder.paymentMethod === 'Bank Transfer' && (
              <div className="w-full bg-[#151722] p-4 rounded-xl border border-[#d4af37]/30 text-left text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                  Savoure Bank Details
                </span>
                <div className="text-white flex justify-between">
                  <span>Bank:</span>
                  <span className="font-semibold">Zenith Bank Nigeria</span>
                </div>
                <div className="text-white flex justify-between">
                  <span>Account Number:</span>
                  <span className="font-mono font-bold text-[#f3dc8f]">1018892341</span>
                </div>
                <div className="text-white flex justify-between">
                  <span>Account Name:</span>
                  <span className="font-semibold">Savoure Hospitality Ltd</span>
                </div>
              </div>
            )}

            <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={generateWhatsAppMessage(completedOrder.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify via WhatsApp</span>
              </a>

              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl bg-[#d4af37] text-[#08080a] text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Bag State with 1-Click Quick Add */
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ded3c0]/40 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-[#fdfbf7]">Your bag is currently empty</h4>
                <p className="text-xs text-[#ded3c0]/70 max-w-xs mx-auto leading-relaxed">
                  Add signature rice bowls, charcoal grills, ocean delicacies, and desserts to order delivery or pickup.
                </p>
              </div>
              <button
                onClick={scrollToMenu}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] text-xs font-semibold uppercase tracking-wider hover:brightness-110 shadow-lg active:scale-95 transition-all"
              >
                Explore Full Digital Menu
              </button>
            </div>

            {/* Quick Add Section */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Popular Chef Picks (1-Tap Add)</span>
              </div>
              <div className="space-y-2.5">
                {quickItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#12131b] border border-white/5 flex items-center justify-between gap-3 hover:border-[#d4af37]/30 transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif text-xs font-bold text-white truncate">{item.name}</h5>
                      <span className="font-mono text-xs text-[#f3dc8f] tabular-nums">
                        ₦{Number(item.price || 0).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#08080a] text-xs font-bold hover:brightness-110 flex items-center gap-1 active:scale-95 transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Order & Checkout Form */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Items & Customer Form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* 1. Itemized Dish List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                    1. Order Summary ({cart.length})
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-[#ded3c0]/50 hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5 divide-y divide-white/5">
                  {cart.map((item) => (
                    <div key={item.menuItem.id} className="pt-2.5 first:pt-0 flex gap-3 items-center">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-semibold text-[#fdfbf7] truncate">
                          {item.menuItem.name}
                        </h5>
                        <div className="text-xs font-mono text-[#f3dc8f] tabular-nums mt-0.5">
                          ₦{Number(item.menuItem.price || 0).toLocaleString()} each
                        </div>
                        {item.instructions && (
                          <p className="text-[10px] text-[#d4af37]/80 truncate mt-0.5">
                            Note: {item.instructions}
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#171821] px-2 py-1 rounded-lg border border-white/10 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                          className="text-[#d4af37] hover:text-white p-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-white px-1 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                          className="text-[#d4af37] hover:text-white p-1"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="text-[#ded3c0]/40 hover:text-red-400 p-1.5 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Delivery & Customer Contact Details */}
              <div className="p-4 rounded-2xl bg-[#12131b] border border-[#d4af37]/25 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                    2. Delivery &amp; Contact Details
                  </span>

                  {/* Order Type Tabs */}
                  <div className="flex gap-1.5 p-1 rounded-xl bg-[#08080a] border border-white/10">
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo({ orderType: 'Delivery' })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        customerInfo.orderType === 'Delivery'
                          ? 'bg-[#d4af37] text-[#08080a] font-bold shadow-sm'
                          : 'text-[#ded3c0]/70 hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo({ orderType: 'Pickup' })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        customerInfo.orderType === 'Pickup'
                          ? 'bg-[#d4af37] text-[#08080a] font-bold shadow-sm'
                          : 'text-[#ded3c0]/70 hover:text-white'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Pickup</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] text-[#ded3c0] mb-1 font-medium">
                      Full Name * <span className="text-xs text-[#ded3c0]/50 font-normal">(Required for delivery receipt)</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => {
                        updateCustomerInfo({ name: e.target.value });
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: false }));
                      }}
                      placeholder="e.g. Chief Adebayo Davies"
                      className={`w-full p-3 rounded-xl bg-[#171821] text-xs text-white placeholder-[#ded3c0]/35 focus:outline-none transition-all ${
                        fieldErrors.name
                          ? 'border-2 border-red-500 ring-2 ring-red-500/20'
                          : 'border border-white/15 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] text-red-400 mt-1">Please enter your full name.</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] text-[#ded3c0] mb-1 font-medium">
                      Phone Number * <span className="text-xs text-[#ded3c0]/50 font-normal">(For driver dispatch)</span>
                    </label>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        updateCustomerInfo({ phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: false }));
                      }}
                      placeholder="e.g. +234 812 345 6789"
                      className={`w-full p-3 rounded-xl bg-[#171821] text-xs text-white placeholder-[#ded3c0]/35 focus:outline-none transition-all ${
                        fieldErrors.phone
                          ? 'border-2 border-red-500 ring-2 ring-red-500/20'
                          : 'border border-white/15 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-red-400 mt-1">Please enter a valid contact phone number.</p>
                    )}
                  </div>

                  {/* Delivery Address (only if Delivery is selected) */}
                  {customerInfo.orderType === 'Delivery' && (
                    <div>
                      <label className="block text-[11px] text-[#ded3c0] mb-1 font-medium">
                        Delivery Street Address * <span className="text-xs text-[#ded3c0]/50 font-normal">(Lagos areas)</span>
                      </label>
                      <input
                        ref={addressInputRef}
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) => {
                          updateCustomerInfo({ address: e.target.value });
                          if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: false }));
                        }}
                        placeholder="House/Apt No., Street, Victoria Island / Ikoyi / Lekki"
                        className={`w-full p-3 rounded-xl bg-[#171821] text-xs text-white placeholder-[#ded3c0]/35 focus:outline-none transition-all ${
                          fieldErrors.address
                            ? 'border-2 border-red-500 ring-2 ring-red-500/20'
                            : 'border border-white/15 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]'
                        }`}
                      />
                      {fieldErrors.address && (
                        <p className="text-[11px] text-red-400 mt-1">Please enter your delivery address.</p>
                      )}
                    </div>
                  )}

                  {/* Special Notes */}
                  <div>
                    <label className="block text-[11px] text-[#ded3c0]/70 mb-1">
                      Preparation &amp; Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerInfo.notes}
                      onChange={(e) => updateCustomerInfo({ notes: e.target.value })}
                      placeholder="Gate pass, extra pepper sauce, cutlery requested..."
                      className="w-full p-2.5 rounded-xl bg-[#171821] border border-white/10 text-xs text-white placeholder-[#ded3c0]/30 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Selection */}
              <div className="p-4 rounded-2xl bg-[#12131b] border border-[#d4af37]/25 space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold block">
                  3. Select Payment Method
                </span>

                <div className="space-y-2">
                  {/* Pay on Delivery Option */}
                  <label
                    onClick={() => updateCustomerInfo({ paymentMethod: 'Pay on Delivery' })}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      customerInfo.paymentMethod === 'Pay on Delivery'
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#171821] border-white/10 text-[#ded3c0]/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={customerInfo.paymentMethod === 'Pay on Delivery'}
                      onChange={() => updateCustomerInfo({ paymentMethod: 'Pay on Delivery' })}
                      className="mt-0.5 accent-[#d4af37]"
                    />
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs flex items-center gap-1.5 text-white">
                        <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                        <span>Pay on Delivery (Cash or POS Card)</span>
                      </div>
                      <p className="text-[11px] text-[#ded3c0]/70">
                        Pay our executive dispatch courier with cash or debit card when your meal arrives.
                      </p>
                    </div>
                  </label>

                  {/* WhatsApp Order Option */}
                  <label
                    onClick={() => updateCustomerInfo({ paymentMethod: 'WhatsApp Order' })}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      customerInfo.paymentMethod === 'WhatsApp Order'
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#171821] border-white/10 text-[#ded3c0]/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={customerInfo.paymentMethod === 'WhatsApp Order'}
                      onChange={() => updateCustomerInfo({ paymentMethod: 'WhatsApp Order' })}
                      className="mt-0.5 accent-[#d4af37]"
                    />
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs flex items-center gap-1.5 text-white">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Order &amp; Confirm via WhatsApp</span>
                      </div>
                      <p className="text-[11px] text-[#ded3c0]/70">
                        Automatically formats complete order and opens WhatsApp for instant kitchen confirmation.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer Option */}
                  <label
                    onClick={() => updateCustomerInfo({ paymentMethod: 'Bank Transfer' })}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      customerInfo.paymentMethod === 'Bank Transfer'
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#171821] border-white/10 text-[#ded3c0]/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      checked={customerInfo.paymentMethod === 'Bank Transfer'}
                      onChange={() => updateCustomerInfo({ paymentMethod: 'Bank Transfer' })}
                      className="mt-0.5 accent-[#d4af37]"
                    />
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs flex items-center gap-1.5 text-white">
                        <Building2 className="w-4 h-4 text-[#f3dc8f]" />
                        <span>Direct Bank Transfer</span>
                      </div>
                      <p className="text-[11px] text-[#ded3c0]/70">
                        Transfer to Savoure Restaurant corporate account (Zenith Bank).
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Order Panel */}
            <div className="p-5 bg-[#12131b] border-t border-[#d4af37]/20 space-y-3.5 shrink-0">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#ded3c0]/80">
                  <span>Subtotal</span>
                  <span className="font-mono text-white tabular-nums">₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#ded3c0]/80">
                  <span>Delivery ({customerInfo.orderType})</span>
                  <span className="font-mono text-white tabular-nums">
                    {customerInfo.orderType === 'Pickup'
                      ? 'FREE'
                      : cartDeliveryFee === 0
                      ? 'FREE (Orders > ₦50k)'
                      : `₦${cartDeliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Payable:</span>
                  <span className="font-mono text-[#f3dc8f] text-base tabular-nums">
                    ₦{(customerInfo.orderType === 'Pickup' ? cartSubtotal : cartTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Prominent Validation Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b89628] text-[#08080a] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {customerInfo.paymentMethod === 'WhatsApp Order' ? (
                  <>
                    <MessageCircle className="w-4 h-4 text-[#08080a]" />
                    <span>Send Order via WhatsApp • ₦{(customerInfo.orderType === 'Pickup' ? cartSubtotal : cartTotal).toLocaleString()}</span>
                  </>
                ) : customerInfo.paymentMethod === 'Pay on Delivery' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#08080a]" />
                    <span>Confirm Order (Pay on Delivery) • ₦{(customerInfo.orderType === 'Pickup' ? cartSubtotal : cartTotal).toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 text-[#08080a]" />
                    <span>Place Order (Bank Transfer) • ₦{(customerInfo.orderType === 'Pickup' ? cartSubtotal : cartTotal).toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#ded3c0]/50 flex items-center justify-center gap-1">
                <span>🔒 Powered by</span>
                <span className="text-[#d4af37] font-semibold">LOCKVEX ⚡ Digital Ordering Suite</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
