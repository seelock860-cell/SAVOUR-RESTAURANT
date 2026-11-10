import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MenuItem, MenuCategory, OrderStatus, ReservationStatus } from '../types';
import { SUPABASE_SETUP_SQL } from '../lib/supabase';
import { heroImg, jollofImg, suyaImg, seafoodImg, dessertImg } from '../data/initialData';
import {
  X,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  Copy,
  Database,
  ShoppingBag,
  Calendar,
  Settings,
  UtensilsCrossed,
  LogOut,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleFeaturedItem,
    categories,
    orders,
    updateOrderStatus,
    reservations,
    updateReservationStatus,
    restaurantInfo,
    updateRestaurantInfo,
    isSupabaseActive,
  } = useRestaurant();

  // Navigation tab in Admin
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'reservations' | 'settings' | 'supabase'>('overview');

  // Login form state
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // New menu item modal state
  const [isEditingItem, setIsEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<MenuCategory>('Rice Dishes');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState(15000);
  const [itemImage, setItemImage] = useState(jollofImg);
  const [itemIsFeatured, setItemIsFeatured] = useState(false);
  const [itemPrepTime, setItemPrepTime] = useState('20 mins');
  const [itemSpice, setItemSpice] = useState<'Mild' | 'Medium' | 'Hot' | 'Chef Specialty'>('Medium');

  // Photo upload and source mode state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');

  // Copied SQL state
  const [copiedSql, setCopiedSql] = useState(false);

  // Restaurant settings form state
  const [tempInfo, setTempInfo] = useState(restaurantInfo);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Lock background body scroll when Admin Dashboard is open to eliminate scroll stutter and jump
  useEffect(() => {
    if (isAdminModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, passcode);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setUsername('');
      setPasscode('');
    }
  };

  // Client-side image upload & compressor (resizes phone photos to crisp HD < 120KB for flawless storage)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setItemImage(compressedDataUrl);
        } else {
          setItemImage(rawDataUrl);
        }
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      img.onerror = () => {
        setItemImage(rawDataUrl);
        setIsUploading(false);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setIsEditingItem(null);
    setItemName('');
    setItemCategory('Rice Dishes');
    setItemDescription('');
    setItemPrice(18000);
    setItemImage(jollofImg);
    setItemIsFeatured(false);
    setItemPrepTime('20 mins');
    setItemSpice('Medium');
    setImageSourceMode('upload');
    setUploadSuccess(false);
    setIsAddingItem(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setIsEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemDescription(item.description);
    setItemPrice(item.price);
    setItemImage(item.image);
    setItemIsFeatured(item.isFeatured);
    setItemPrepTime(item.prepTime || '20 mins');
    setItemSpice(item.spiceLevel || 'Medium');
    setImageSourceMode(item.image.startsWith('data:') ? 'upload' : 'preset');
    setUploadSuccess(false);
    setIsAddingItem(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || itemPrice <= 0) return;

    if (isEditingItem) {
      await updateMenuItem(isEditingItem.id, {
        name: itemName.trim(),
        category: itemCategory,
        description: itemDescription.trim(),
        price: Number(itemPrice),
        image: itemImage,
        isFeatured: itemIsFeatured,
        prepTime: itemPrepTime,
        spiceLevel: itemSpice,
      });
    } else {
      await addMenuItem({
        name: itemName.trim(),
        category: itemCategory,
        description: itemDescription.trim(),
        price: Number(itemPrice),
        image: itemImage,
        isFeatured: itemIsFeatured,
        tags: [itemCategory, 'New Addition'],
        prepTime: itemPrepTime,
        spiceLevel: itemSpice,
      });
    }

    setIsAddingItem(false);
    setIsEditingItem(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantInfo(tempInfo);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Preset image gallery for easy image assignment
  const PRESET_IMAGES = [
    { label: 'Royal Jollof & Prawns', path: jollofImg },
    { label: 'Artisanal Beef Suya', path: suyaImg },
    { label: 'Grand Seafood Soup', path: seafoodImg },
    { label: 'Gold Leaf Chocolate Dessert', path: dessertImg },
    { label: 'Wagyu Ribeye Steak Showcase', path: heroImg },
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdminModalOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fade-in"
    >
      <div
        className="relative bg-[#0d0e14] border border-[#d4af37]/40 rounded-2xl md:rounded-3xl max-w-6xl w-full h-[94vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#12131b] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-[#fdfbf7]">
                  SAVOURÉ Executive Operations Portal
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {isSupabaseActive ? 'Supabase Live Sync' : 'Local Storage Sandbox'}
                </span>
              </div>
              <p className="text-xs text-[#ded3c0]/60">
                Menu curation, real-time orders, table reservations & cloud infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-2 rounded-lg text-[#ded3c0]/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In View */}
        {!isAdminLoggedIn ? (
          <div className="flex-1 min-h-0 p-6 sm:p-8 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full overflow-y-auto overscroll-contain">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">
                Executive Admin Access
              </h4>
              <p className="text-xs text-[#ded3c0]/70">
                Please enter your administrator credentials to access the restaurant operations portal.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-3.5 text-left">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Invalid administrator credentials. Please check and try again.</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-[#ded3c0]/80 mb-1 font-medium">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#ded3c0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (loginError) setLoginError(false);
                    }}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#171821] border border-white/15 text-xs text-white placeholder-[#ded3c0]/35 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#ded3c0]/80 mb-1 font-medium">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ded3c0]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (loginError) setLoginError(false);
                    }}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#171821] border border-white/15 text-xs text-white placeholder-[#ded3c0]/35 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ded3c0]/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                Sign In to Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#101117] border-b md:border-b-0 md:border-r border-white/10 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 overscroll-contain">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-[#d4af37] text-[#08080a] font-semibold'
                    : 'text-[#ded3c0]/80 hover:bg-white/5'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'bg-[#d4af37] text-[#08080a] font-semibold'
                    : 'text-[#ded3c0]/80 hover:bg-white/5'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Menu Manager ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#d4af37] text-[#08080a] font-semibold'
                    : 'text-[#ded3c0]/80 hover:bg-white/5'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'reservations'
                    ? 'bg-[#d4af37] text-[#08080a] font-semibold'
                    : 'text-[#ded3c0]/80 hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Reservations ({reservations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-[#d4af37] text-[#08080a] font-semibold'
                    : 'text-[#ded3c0]/80 hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Restaurant Info</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'supabase'
                    ? 'bg-[#d4af37] text-[#08080a] font-semibold'
                    : 'text-[#ded3c0]/80 hover:bg-white/5'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Supabase & Vercel</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overscroll-contain bg-[#0a0b10] touch-pan-y focus:outline-none">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">
                      Restaurant Pulse & Metrics
                    </h4>
                    <p className="text-xs text-[#ded3c0]/70">
                      Real-time operational summary for SAVOURÉ Restaurant & Lounge.
                    </p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#12131b] border border-white/10">
                      <span className="text-xs text-[#ded3c0]/60 block mb-1">Active Menu Items</span>
                      <div className="font-mono text-2xl font-bold text-[#f3dc8f] tabular-nums">
                        {menuItems.length}
                      </div>
                      <span className="text-[11px] text-emerald-400 mt-1 block">6 Categories Live</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12131b] border border-white/10">
                      <span className="text-xs text-[#ded3c0]/60 block mb-1">Total Orders</span>
                      <div className="font-mono text-2xl font-bold text-white tabular-nums">
                        {orders.length}
                      </div>
                      <span className="text-[11px] text-[#d4af37] mt-1 block">WhatsApp & Web</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12131b] border border-white/10">
                      <span className="text-xs text-[#ded3c0]/60 block mb-1">Confirmed Bookings</span>
                      <div className="font-mono text-2xl font-bold text-white tabular-nums">
                        {reservations.filter((r) => r.status === 'Confirmed').length}
                      </div>
                      <span className="text-[11px] text-[#efe8db]/60 mt-1 block">Grand Dining & VIP</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#12131b] border border-white/10">
                      <span className="text-xs text-[#ded3c0]/60 block mb-1">Pipeline Revenue</span>
                      <div className="font-mono text-xl sm:text-2xl font-bold text-[#f3dc8f] tabular-nums truncate">
                        ₦{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
                      </div>
                      <span className="text-[11px] text-emerald-400 mt-1 block">Nigerian Naira</span>
                    </div>
                  </div>

                  {/* Quick Action Bar */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171821] to-[#14151e] border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h5 className="font-serif text-lg font-bold text-[#fdfbf7]">
                        Ready to add a new signature dish to the menu?
                      </h5>
                      <p className="text-xs text-[#ded3c0]/70">
                        Upload custom dish images, set pricing in ₦, and toggle homepage feature.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('menu');
                        handleOpenAdd();
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#08080a] text-xs font-semibold uppercase tracking-wider hover:brightness-110 shrink-0"
                    >
                      + Add New Dish
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: MENU MANAGER */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">Menu Items</h4>
                      <p className="text-xs text-[#ded3c0]/70">
                        Create, modify pricing, upload images, and control homepage featured status.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAdd}
                      className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-[#08080a] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Food Item</span>
                    </button>
                  </div>

                  {/* Menu Table */}
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#12131b]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#171821] text-[#d4af37] uppercase tracking-wider font-mono border-b border-white/10">
                          <tr>
                            <th className="py-3 px-4">Dish</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Price (₦)</th>
                            <th className="py-3 px-4">Featured</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {menuItems.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <div className="font-semibold text-white font-serif text-sm">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] text-[#ded3c0]/50 truncate max-w-xs">
                                    {item.description}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-[#ded3c0]">{item.category}</td>
                              <td className="py-3 px-4 font-mono font-bold text-[#f3dc8f] tabular-nums">
                                ₦{item.price.toLocaleString()}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => toggleFeaturedItem(item.id)}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    item.isFeatured
                                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                                      : 'bg-white/5 border-white/10 text-[#ded3c0]/40 hover:text-white'
                                  }`}
                                  title="Toggle Featured on Homepage"
                                >
                                  <Star className="w-4 h-4 fill-current" />
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenEdit(item)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#ded3c0] hover:text-[#d4af37] transition-colors"
                                  title="Edit Dish"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete "${item.name}" from the menu?`)) {
                                      deleteMenuItem(item.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-[#ded3c0] hover:text-red-400 transition-colors"
                                  title="Delete Dish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS MANAGER */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">Customer Orders</h4>
                    <p className="text-xs text-[#ded3c0]/70">
                      Manage kitchen order lifecycle from Pending to Delivered.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-[#ded3c0]/60 bg-[#12131b] rounded-2xl">
                      No customer orders yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-5 rounded-2xl bg-[#12131b] border border-white/10 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-bold text-[#f3dc8f]">
                                {order.id}
                              </span>
                              <span className="text-xs text-[#ded3c0]/60">
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white">
                                {order.orderType}
                              </span>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#ded3c0]/60">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="bg-[#171821] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-[#f3dc8f] font-medium"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Customer & Address Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-[#ded3c0]/60 block mb-0.5">Customer</span>
                              <span className="font-semibold text-white">{order.customerName}</span>
                              <span className="block text-[#ded3c0]/70">{order.customerPhone}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-[#ded3c0]/60 block mb-0.5">Address / Instructions</span>
                              <p className="text-white">{order.deliveryAddress}</p>
                              {order.notes && (
                                <p className="text-[#d4af37] italic mt-0.5">Note: {order.notes}</p>
                              )}
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="bg-[#171821] p-3 rounded-xl border border-white/5 text-xs space-y-1">
                            {order.items.map((i, idx) => (
                              <div key={idx} className="flex justify-between text-[#efe8db]">
                                <span>
                                  {i.name} (x{i.quantity})
                                </span>
                                <span className="font-mono text-[#f3dc8f] tabular-nums">
                                  ₦{(i.price * i.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                              <span>Total ({order.paymentMethod})</span>
                              <span className="text-[#f3dc8f] font-mono tabular-nums">
                                ₦{order.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: RESERVATIONS MANAGER */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">Table Reservations</h4>
                    <p className="text-xs text-[#ded3c0]/70">
                      Guest seating bookings, dates, times, and special VIP requests.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#12131b]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#171821] text-[#d4af37] uppercase tracking-wider font-mono border-b border-white/10">
                          <tr>
                            <th className="py-3 px-4">Ref</th>
                            <th className="py-3 px-4">Guest</th>
                            <th className="py-3 px-4">Date & Time</th>
                            <th className="py-3 px-4">Guests</th>
                            <th className="py-3 px-4">Seating</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-white/5">
                              <td className="py-3 px-4 font-mono font-bold text-[#f3dc8f]">
                                {res.referenceCode}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-semibold text-white">{res.customerName}</div>
                                <div className="text-[11px] text-[#ded3c0]/60">{res.customerPhone}</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>{res.date}</div>
                                <div className="text-[#d4af37] font-mono">{res.time}</div>
                              </td>
                              <td className="py-3 px-4 font-bold text-white tabular-nums">
                                {res.guests} Guests
                              </td>
                              <td className="py-3 px-4 text-[#ded3c0]">{res.seatingArea}</td>
                              <td className="py-3 px-4">
                                <select
                                  value={res.status}
                                  onChange={(e) => updateReservationStatus(res.id, e.target.value as ReservationStatus)}
                                  className="bg-[#171821] border border-white/15 rounded px-2 py-1 text-xs text-white"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: RESTAURANT INFO & SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">Restaurant Information</h4>
                    <p className="text-xs text-[#ded3c0]/70">
                      Configure contact details, address, opening hours, and WhatsApp integration number.
                    </p>
                  </div>

                  {savedSettingsNotice && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Restaurant settings saved and live on website!</span>
                    </div>
                  )}

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        value={tempInfo.name}
                        onChange={(e) => setTempInfo({ ...tempInfo, name: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#14151e] border border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={tempInfo.tagline}
                        onChange={(e) => setTempInfo({ ...tempInfo, tagline: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#14151e] border border-white/10 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#ded3c0]/70 mb-1">WhatsApp Order Number</label>
                        <input
                          type="text"
                          value={tempInfo.whatsappNumber}
                          onChange={(e) => setTempInfo({ ...tempInfo, whatsappNumber: e.target.value })}
                          placeholder="09024971419"
                          className="w-full p-2.5 rounded-lg bg-[#14151e] border border-white/10 text-white font-mono"
                        />
                        <span className="text-[10px] text-[#ded3c0]/50">e.g. 09024971419 (or 2349024971419)</span>
                      </div>
                      <div>
                        <label className="block text-[#ded3c0]/70 mb-1">Phone Number Display</label>
                        <input
                          type="text"
                          value={tempInfo.phone}
                          onChange={(e) => setTempInfo({ ...tempInfo, phone: e.target.value })}
                          className="w-full p-2.5 rounded-lg bg-[#14151e] border border-white/10 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Physical Address</label>
                      <input
                        type="text"
                        value={tempInfo.address}
                        onChange={(e) => setTempInfo({ ...tempInfo, address: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#14151e] border border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Announcement Banner (Optional)</label>
                      <input
                        type="text"
                        value={tempInfo.announcement || ''}
                        onChange={(e) => setTempInfo({ ...tempInfo, announcement: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-[#14151e] border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-full bg-[#d4af37] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Restaurant Settings</span>
                  </button>
                </form>
              )}

              {/* TAB 6: SUPABASE & VERCEL DEPLOYMENT GUIDE */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[#fdfbf7]">
                      Supabase Database & Vercel Deployment Guide
                    </h4>
                    <p className="text-xs text-[#ded3c0]/70">
                      Step-by-step instructions to connect persistent Cloud PostgreSQL and deploy to production.
                    </p>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      isSupabaseActive
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-[#171821] border-[#d4af37]/30 text-[#ded3c0]'
                    }`}
                  >
                    <Database className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>Current Status:</span>
                        <span className={isSupabaseActive ? 'text-emerald-400' : 'text-[#f3dc8f]'}>
                          {isSupabaseActive ? 'Connected to Remote Supabase' : 'Running in Safe Local Demo Mode'}
                        </span>
                      </div>
                      <p className="text-[#ded3c0]/80">
                        {isSupabaseActive
                          ? 'Real-time database queries and mutations are synchronizing with your configured Supabase project.'
                          : 'Your website is operating in complete client-side demo mode with rich persistence in localStorage. To connect your Supabase database, follow the 3 quick steps below.'}
                      </p>
                    </div>
                  </div>

                  {/* Step by step */}
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#12131b] border border-white/10 space-y-2">
                      <div className="font-bold text-[#f3dc8f] uppercase tracking-wider">
                        Step 1: Create Supabase Project & Run Schema
                      </div>
                      <p className="text-[#ded3c0]/80">
                        Log in to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#d4af37] underline">supabase.com</a>, open your project SQL Editor, and paste the schema below:
                      </p>
                      <div className="relative">
                        <pre className="p-3 rounded-lg bg-[#08080a] border border-white/10 font-mono text-[11px] text-[#ded3c0] max-h-48 overflow-y-auto">
                          {SUPABASE_SETUP_SQL}
                        </pre>
                        <button
                          onClick={handleCopySql}
                          className="absolute top-2 right-2 px-3 py-1.5 rounded bg-[#d4af37] text-[#08080a] font-bold text-[10px] uppercase flex items-center gap-1 hover:brightness-110"
                        >
                          {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12131b] border border-white/10 space-y-2">
                      <div className="font-bold text-[#f3dc8f] uppercase tracking-wider">
                        Step 2: Add Environment Variables in Vercel or .env
                      </div>
                      <p className="text-[#ded3c0]/80">
                        Under Settings &gt; API in Supabase, copy your Project URL and Anon Public Key (never service-role!):
                      </p>
                      <div className="p-3 rounded-lg bg-[#08080a] font-mono text-[11px] text-[#f3dc8f] space-y-1">
                        <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                        <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...</div>
                        <div>VITE_WHATSAPP_NUMBER=2349024971419</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#12131b] border border-white/10 space-y-2">
                      <div className="font-bold text-[#f3dc8f] uppercase tracking-wider">
                        Step 3: Deploy to Vercel or GitHub
                      </div>
                      <p className="text-[#ded3c0]/80">
                        Push this repository to GitHub and connect it to Vercel. Add the 3 environment variables above in the Vercel project settings. Your luxury SAVOURÉ restaurant site will build and deploy in seconds!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Adding/Editing Food Item */}
        {isAddingItem && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsAddingItem(false);
            }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fade-in"
          >
            <div
              className="bg-[#12131b] border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center shrink-0 bg-[#161722]">
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#fdfbf7]">
                  {isEditingItem ? 'Edit Food Item' : 'Add New Food Item'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="text-[#ded3c0]/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="flex-1 min-h-0 flex flex-col overflow-hidden text-xs">
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4 touch-pan-y">
                  <div>
                    <label className="block text-[#ded3c0]/70 mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g. Truffle Infused Fisherman Stew"
                      className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Category *</label>
                      <select
                        value={itemCategory}
                        onChange={(e) => setItemCategory(e.target.value as MenuCategory)}
                        className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Price in Naira (₦) *</label>
                      <input
                        type="number"
                        required
                        min={100}
                        step={500}
                        value={itemPrice}
                        onChange={(e) => setItemPrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#ded3c0]/70 mb-1">Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      placeholder="Rich description of spices, cooking techniques, and accompaniments..."
                      className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-white"
                    />
                  </div>

                  {/* Photo Selection & Phone Upload */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[#ded3c0]/80 font-medium">
                        Food Photography Asset *
                      </label>
                      {/* Source mode pills */}
                      <div className="flex items-center gap-1 bg-[#171821] p-1 rounded-xl border border-white/10 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setImageSourceMode('upload')}
                          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                            imageSourceMode === 'upload'
                              ? 'bg-[#d4af37] text-[#08080a] font-bold shadow-sm'
                              : 'text-[#ded3c0]/60 hover:text-white'
                          }`}
                        >
                          <Upload className="w-3 h-3" />
                          <span>Phone File</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageSourceMode('preset')}
                          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                            imageSourceMode === 'preset'
                              ? 'bg-[#d4af37] text-[#08080a] font-bold shadow-sm'
                              : 'text-[#ded3c0]/60 hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Presets</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageSourceMode('url')}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            imageSourceMode === 'url'
                              ? 'bg-[#d4af37] text-[#08080a] font-bold shadow-sm'
                              : 'text-[#ded3c0]/60 hover:text-white'
                          }`}
                        >
                          Web URL
                        </button>
                      </div>
                    </div>

                    {/* MODE 1: Upload from Phone / Device */}
                    {imageSourceMode === 'upload' && (
                      <div className="space-y-3">
                        {/* Hidden native input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        {/* Upload Dropzone / Trigger */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-[#171821]/80 hover:bg-[#171821] p-4 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center group active:scale-[0.99]"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div className="text-xs font-semibold text-white group-hover:text-[#f3dc8f] transition-colors">
                            Tap to upload food photo from phone files or gallery
                          </div>
                          <p className="text-[10px] text-[#ded3c0]/60 mt-1">
                            Select from your iPhone/Android photo library, camera, or documents
                          </p>

                          {isUploading && (
                            <div className="mt-2 text-[11px] text-[#d4af37] flex items-center gap-1.5 animate-pulse font-medium">
                              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
                              <span>Optimizing image for fast delivery...</span>
                            </div>
                          )}

                          {uploadSuccess && (
                            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Photo successfully uploaded from device!</span>
                            </div>
                          )}
                        </div>

                        {/* Current Photo Preview Card */}
                        {itemImage && (
                          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#14151e] border border-white/10">
                            <img
                              src={itemImage}
                              alt="Dish preview"
                              className="w-14 h-14 rounded-lg object-cover border border-white/20 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-semibold text-white truncate">
                                {itemImage.startsWith('data:') ? 'Custom Uploaded Photo' : 'Active Food Photo'}
                              </div>
                              <div className="text-[10px] text-[#ded3c0]/60 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>Ready for menu display</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[10px] font-semibold transition-colors shrink-0"
                            >
                              Replace Photo
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* MODE 2: Presets */}
                    {imageSourceMode === 'preset' && (
                      <div>
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          {PRESET_IMAGES.map((preset, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setItemImage(preset.path)}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                itemImage === preset.path
                                  ? 'border-[#d4af37] scale-105 shadow-md'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                              title={preset.label}
                            >
                              <img
                                src={preset.path}
                                alt={preset.label}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#ded3c0]/60">Select from our signature photography presets</p>
                      </div>
                    )}

                    {/* MODE 3: Direct URL */}
                    {imageSourceMode === 'url' && (
                      <div>
                        <input
                          type="text"
                          value={itemImage}
                          onChange={(e) => setItemImage(e.target.value)}
                          placeholder="https://images.unsplash.com/... or image web link"
                          className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-[11px] text-white font-mono focus:outline-none focus:border-[#d4af37]"
                        />
                        <p className="text-[10px] text-[#ded3c0]/60 mt-1">Paste a direct web link to any food photography image</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Preparation Time</label>
                      <input
                        type="text"
                        value={itemPrepTime}
                        onChange={(e) => setItemPrepTime(e.target.value)}
                        placeholder="e.g. 25 mins"
                        className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[#ded3c0]/70 mb-1">Spice Level</label>
                      <select
                        value={itemSpice}
                        onChange={(e) => setItemSpice(e.target.value as any)}
                        className="w-full p-2.5 rounded-lg bg-[#171821] border border-white/10 text-white"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Medium">Medium</option>
                        <option value="Hot">Hot</option>
                        <option value="Chef Specialty">Chef Specialty</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured-check"
                      checked={itemIsFeatured}
                      onChange={(e) => setItemIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-[#171821] text-[#d4af37] focus:ring-0"
                    />
                    <label htmlFor="featured-check" className="text-white cursor-pointer select-none">
                      Feature on Homepage Signature Carousel
                    </label>
                  </div>
                </div>

                {/* Pinned action buttons */}
                <div className="p-4 border-t border-white/10 bg-[#14151f] flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/15 text-[#ded3c0] hover:bg-white/5 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89628] text-[#08080a] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
                  >
                    Save Dish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
