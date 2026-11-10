export type MenuCategory =
  | 'Rice Dishes'
  | 'Grills and BBQ'
  | 'Seafood'
  | 'Soups'
  | 'Drinks'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number; // in Nigerian Naira (₦)
  image: string;
  isFeatured: boolean;
  tags?: string[];
  prepTime?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Chef Specialty';
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  instructions?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderType: 'Delivery' | 'Pickup' | 'Dine-In Pre-order';
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    instructions?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'WhatsApp Order' | 'Pay on Delivery' | 'Bank Transfer';
  createdAt: string;
  notes?: string;
}

export type ReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Reservation {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'Grand Dining Hall' | 'Private VIP Suite' | 'Terrace Lounge';
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface OpeningHour {
  days: string;
  hours: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  openingHours: OpeningHour[];
  announcement?: string;
  lockvexUrl: string;
  lockvexWhatsapp: string;
}

export interface CustomerCheckoutInfo {
  name: string;
  phone: string;
  address: string;
  orderType: 'Delivery' | 'Pickup';
  paymentMethod: 'Pay on Delivery' | 'WhatsApp Order' | 'Bank Transfer';
  notes: string;
}
