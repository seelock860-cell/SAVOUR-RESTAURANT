import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, MenuCategory, CartItem, Order, Reservation, RestaurantInfo, OrderStatus, ReservationStatus, CustomerCheckoutInfo } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_RESTAURANT_INFO, INITIAL_ORDERS, INITIAL_RESERVATIONS } from '../data/initialData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface RestaurantContextType {
  menuItems: MenuItem[];
  categories: MenuCategory[];
  featuredItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, instructions?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    orderType: 'Delivery' | 'Pickup' | 'Dine-In Pre-order';
    paymentMethod: 'WhatsApp Order' | 'Pay on Delivery' | 'Bank Transfer';
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reservations: Reservation[];
  createReservation: (resData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    date: string;
    time: string;
    guests: number;
    seatingArea: 'Grand Dining Hall' | 'Private VIP Suite' | 'Terrace Lounge';
    specialRequests?: string;
  }) => Promise<Reservation>;
  updateReservationStatus: (resId: string, status: ReservationStatus) => void;
  restaurantInfo: RestaurantInfo;
  updateRestaurantInfo: (info: Partial<RestaurantInfo>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleFeaturedItem: (id: string) => Promise<void>;
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isLockvexModalOpen: boolean;
  setIsLockvexModalOpen: (open: boolean) => void;
  isSupabaseActive: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  customerInfo: CustomerCheckoutInfo;
  updateCustomerInfo: (info: Partial<CustomerCheckoutInfo>) => void;
}

const CATEGORIES: MenuCategory[] = [
  'Rice Dishes',
  'Grills and BBQ',
  'Seafood',
  'Soups',
  'Drinks',
  'Desserts',
];

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  MENU: 'savoure_menu_items_v3',
  ORDERS: 'savoure_orders_v3',
  RESERVATIONS: 'savoure_reservations_v3',
  INFO: 'savoure_restaurant_info_v4',
  ADMIN_SESSION: 'savoure_admin_session_v3',
  CART: 'savoure_cart_v3',
  CUSTOMER: 'savoure_customer_info_v3',
};

const DEFAULT_CUSTOMER_INFO: CustomerCheckoutInfo = {
  name: '',
  phone: '',
  address: '',
  orderType: 'Delivery',
  paymentMethod: 'Pay on Delivery',
  notes: '',
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSupabaseActive = isSupabaseConfigured();

  // Menu items state with defensive validation
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MENU);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify items have name and price
          const valid = parsed.every(item => item && item.name && typeof item.price === 'number');
          if (valid) return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_MENU_ITEMS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RESERVATIONS);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  // Restaurant settings state
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INFO);
      return saved ? JSON.parse(saved) : INITIAL_RESTAURANT_INFO;
    } catch {
      return INITIAL_RESTAURANT_INFO;
    }
  });

  // Customer checkout info state
  const [customerInfo, setCustomerInfo] = useState<CustomerCheckoutInfo>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMER);
      return saved ? { ...DEFAULT_CUSTOMER_INFO, ...JSON.parse(saved) } : DEFAULT_CUSTOMER_INFO;
    } catch {
      return DEFAULT_CUSTOMER_INFO;
    }
  });

  const updateCustomerInfo = (info: Partial<CustomerCheckoutInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLockvexModalOpen, setIsLockvexModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Admin authentication (Safe demo key check with environment override)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_SESSION) === 'true';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INFO, JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMER, JSON.stringify(customerInfo));
  }, [customerInfo]);

  // Optionally load from Supabase if active
  useEffect(() => {
    if (isSupabaseActive && supabase) {
      supabase
        .from('menu_items')
        .select('*')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setMenuItems(
              data.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                description: item.description,
                price: Number(item.price),
                image: item.image,
                isFeatured: Boolean(item.is_featured),
                tags: item.tags || [],
                prepTime: item.prep_time,
                spiceLevel: item.spice_level,
              }))
            );
          }
        });
    }
  }, [isSupabaseActive]);

  // Derived properties
  const featuredItems = menuItems.filter((item) => item.isFeatured);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  const cartDeliveryFee = cartSubtotal > 0 ? (cartSubtotal > 50000 ? 0 : 3500) : 0;
  const cartTotal = cartSubtotal + cartDeliveryFee;

  // Cart operations
  const addToCart = (menuItem: MenuItem, quantity = 1, instructions = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.menuItem.id === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (instructions) {
          updated[existingIndex].instructions = instructions;
        }
        return updated;
      }
      return [...prevCart, { menuItem, quantity, instructions }];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.menuItem.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order submission
  const createOrder = async (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    orderType: 'Delivery' | 'Pickup' | 'Dine-In Pre-order';
    paymentMethod: 'WhatsApp Order' | 'Pay on Delivery' | 'Bank Transfer';
    notes?: string;
  }): Promise<Order> => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      orderType: orderData.orderType,
      items: cart.map((c) => ({
        id: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity,
        instructions: c.instructions,
      })),
      subtotal: cartSubtotal,
      deliveryFee: orderData.orderType === 'Pickup' ? 0 : cartDeliveryFee,
      total: cartSubtotal + (orderData.orderType === 'Pickup' ? 0 : cartDeliveryFee),
      status: 'Pending',
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
      notes: orderData.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // If Supabase is active, persist to database
    if (isSupabaseActive && supabase) {
      try {
        await supabase.from('orders').insert({
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          delivery_address: newOrder.deliveryAddress,
          order_type: newOrder.orderType,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          total: newOrder.total,
          status: newOrder.status,
          payment_method: newOrder.paymentMethod,
          notes: newOrder.notes,
        });
      } catch (err) {
        console.warn('Supabase sync skipped, order saved locally', err);
      }
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  // Reservation creation
  const createReservation = async (resData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    date: string;
    time: string;
    guests: number;
    seatingArea: 'Grand Dining Hall' | 'Private VIP Suite' | 'Terrace Lounge';
    specialRequests?: string;
  }): Promise<Reservation> => {
    const newReservation: Reservation = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      referenceCode: `SAV-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: resData.customerName,
      customerPhone: resData.customerPhone,
      customerEmail: resData.customerEmail,
      date: resData.date,
      time: resData.time,
      guests: resData.guests,
      seatingArea: resData.seatingArea,
      specialRequests: resData.specialRequests,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);

    if (isSupabaseActive && supabase) {
      try {
        await supabase.from('reservations').insert({
          reference_code: newReservation.referenceCode,
          customer_name: newReservation.customerName,
          customer_phone: newReservation.customerPhone,
          customer_email: newReservation.customerEmail,
          date: newReservation.date,
          time: newReservation.time,
          guests: newReservation.guests,
          seating_area: newReservation.seatingArea,
          special_requests: newReservation.specialRequests,
          status: newReservation.status,
        });
      } catch (err) {
        console.warn('Supabase reservation sync skipped', err);
      }
    }

    return newReservation;
  };

  const updateReservationStatus = (resId: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === resId ? { ...res, status } : res))
    );
  };

  const updateRestaurantInfo = (info: Partial<RestaurantInfo>) => {
    setRestaurantInfo((prev) => ({ ...prev, ...info }));
  };

  // Admin menu management
  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = async (id: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFeaturedItem = async (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
    );
  };

  // Admin Auth: Verify username 'lockvex' and password 'lockvex234'
  const loginAdmin = (username: string, password: string): boolean => {
    const validUsername = username.trim().toLowerCase() === 'lockvex';
    const validPassword = password.trim() === 'lockvex234';
    if (validUsername && validPassword) {
      setIsAdminLoggedIn(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_SESSION, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_SESSION);
  };

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        categories: CATEGORIES,
        featuredItems,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        reservations,
        createReservation,
        updateReservationStatus,
        restaurantInfo,
        updateRestaurantInfo,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleFeaturedItem,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        isReservationModalOpen,
        setIsReservationModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isLockvexModalOpen,
        setIsLockvexModalOpen,
        isSupabaseActive,
        activeSection,
        setActiveSection,
        customerInfo,
        updateCustomerInfo,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
