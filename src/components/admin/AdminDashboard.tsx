import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Package, 
  ShoppingBag, 
  AlertCircle, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Truck, 
  Users, 
  DollarSign, 
  Shield, 
  Upload, 
  FileText,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Facebook,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Product, ProductCategory, OrderStatus, ComplaintStatus, ProductStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    changeAdminPasscode,
    products,
    orders,
    complaints,
    storeSettings,
    updateStoreSettings,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
    updateComplaintStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'complaints' | 'settings'>('overview');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState('');

  // Change password form in settings
  const [newAdminPass, setNewAdminPass] = useState('');
  const [showNewAdminPass, setShowNewAdminPass] = useState(false);
  const [changePassStatus, setChangePassStatus] = useState<{ text: string; success: boolean } | null>(null);

  // Product edit/add modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Order status filter
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [viewingOrder, setViewingOrder] = useState<string | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  if (!isAdminOpen) return null;

  // Login Gate
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(adminPasscode)) {
      setPasscodeError('');
      setAdminPasscode('');
    } else {
      setPasscodeError('ভুল পাসকোড! অনুগ্রহ করে সঠিক এডমিন পাসকোড দিয়ে আবার চেষ্টা করুন।');
    }
  };

  // Metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'new').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const newComplaints = complaints.filter((c) => c.status === 'new' || c.status === 'reviewing').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered orders
  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === orderFilter);

  // Product save handler
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;

    const sizes = Array.isArray(editingProduct.availableSizes)
      ? editingProduct.availableSizes
      : ['Free Size'];

    const colors = editingProduct.availableColors && editingProduct.availableColors.length > 0
      ? editingProduct.availableColors
      : [{ name: 'Standard', hex: '#d4af37' }];

    const images = editingProduct.images && editingProduct.images.length > 0
      ? editingProduct.images
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'];

    const newProd: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      code: editingProduct.code || `ODM-${Math.floor(100 + Math.random() * 900)}`,
      name: editingProduct.name,
      bengaliName: editingProduct.bengaliName || editingProduct.name,
      category: (editingProduct.category as ProductCategory) || 'Saree',
      price: Number(editingProduct.price),
      discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : undefined,
      description: editingProduct.description || '',
      bengaliDescription: editingProduct.bengaliDescription || '',
      availableSizes: sizes,
      availableColors: colors,
      stock: Number(editingProduct.stock || 10),
      images,
      status: (editingProduct.status as ProductStatus) || 'active',
      isFeatured: !!editingProduct.isFeatured,
      isNewArrival: !!editingProduct.isNewArrival,
      isPopular: !!editingProduct.isPopular,
      fabric: editingProduct.fabric || 'Premium Quality',
      careInstructions: editingProduct.careInstructions || 'Dry Clean Recommended',
      createdAt: editingProduct.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProduct(newProd);
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  // Image Upload helper (supports file upload to base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setEditingProduct((prev) => ({
          ...prev,
          images: [...(prev?.images || []), result],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setEditingProduct((prev) => ({
      ...prev,
      images: [...(prev?.images || []), newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (idx: number) => {
    setEditingProduct((prev) => ({
      ...prev,
      images: prev?.images?.filter((_, i) => i !== idx) || [],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[96vh] overflow-y-auto rounded-3xl bg-[#0e101a] border border-[#d4af37]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white my-auto flex flex-col">
        {/* Admin Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#121524]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0 p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e]">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold font-serif-luxury text-white">
                  অনলাইন ড্রেস মার্ট এডমিন প্যানেল
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40 uppercase tracking-widest">
                  Secure Owner Panel
                </span>
              </div>
              <p className="text-xs text-gray-400">
                পণ্য স্টক, অর্ডার প্রসেসিং ও গ্রাহক সেবা ব্যবস্থাপনা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={adminLogout}
                className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30"
              >
                লগআউট
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* If not authenticated as Admin, show Passcode Lock */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.5)] p-[2px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e]">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart Official Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">এডমিন লগইন</h2>
              <p className="text-xs text-[#ffd700] uppercase tracking-wider font-semibold mt-0.5">Online Dress Mart Owner Portal</p>
            </div>
            <p className="text-xs text-gray-400">
              নিরাপত্তার স্বার্থে আপনার গোপনীয় এডমিন পাসকোড লিখুন
            </p>

            {passcodeError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
                {passcodeError}
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-3.5">
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  autoFocus
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="এডমিন পাসকোড লিখুন..."
                  className="w-full bg-[#181a28] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-center text-sm text-white focus:outline-none focus:border-[#d4af37] tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffd700] p-1 rounded transition-colors"
                  title={showPasscode ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="text-[11px] text-[#ffd700] hover:underline flex items-center gap-1"
                >
                  {showPasscode ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showPasscode ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন (Show Password)'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient-btn text-sm font-bold shadow-lg"
              >
                প্যানেলে প্রবেশ করুন
              </button>
            </form>
          </div>
        ) : (
          /* ===================== LOGGED IN ADMIN VIEW ===================== */
          <div className="flex-1 flex flex-col md:flex-row min-h-[580px]">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#0b0d14] border-r border-white/5 p-3 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <DollarSign size={16} />
                <span>ওভারভিউ (Overview)</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'products'
                    ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={16} />
                <span>পণ্য স্টক ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShoppingBag size={16} />
                <span>অর্ডারসমূহ ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'complaints'
                    ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <AlertCircle size={16} />
                <span>অভিযোগ বক্স ({complaints.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings size={16} />
                <span>সেটিংস ও API গাইড</span>
              </button>
            </div>

            {/* Main Tab Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-[#151829] border border-white/10">
                      <p className="text-gray-400 text-xs">মোট পণ্য (Products)</p>
                      <p className="text-xl sm:text-2xl font-bold text-white mt-1">{totalProducts}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151829] border border-white/10">
                      <p className="text-gray-400 text-xs">মোট অর্ডার (Orders)</p>
                      <p className="text-xl sm:text-2xl font-bold text-[#ffd700] mt-1">{totalOrders}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151829] border border-amber-500/30">
                      <p className="text-amber-300 text-xs">পেন্ডিং অর্ডার (Pending)</p>
                      <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">{pendingOrders}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151829] border border-emerald-500/30">
                      <p className="text-emerald-300 text-xs">ডেলিভার্ড (Delivered)</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">{deliveredOrders}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151829] border border-red-500/30">
                      <p className="text-red-300 text-xs">নতুন অভিযোগ (Complaints)</p>
                      <p className="text-xl sm:text-2xl font-bold text-red-400 mt-1">{newComplaints}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151829] border border-white/10">
                      <p className="text-gray-400 text-xs">মোট সেলস (Revenue)</p>
                      <p className="text-base sm:text-lg font-bold text-[#ffd700] mt-1">
                        ৳{totalRevenue.toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="p-5 rounded-2xl bg-[#131625] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                        <ShoppingBag size={18} className="text-[#ffd700]" />
                        <span>সাম্প্রতিক অর্ডারসমূহ (Recent Orders)</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#ffd700] hover:underline"
                      >
                        সব দেখুন →
                      </button>
                    </div>

                    <div className="divide-y divide-white/5 overflow-x-auto">
                      {orders.slice(0, 4).map((ord) => (
                        <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#ffd700]">{ord.orderNumber}</span>
                            <p className="text-white font-medium">{ord.customerName} ({ord.customerPhone})</p>
                            <p className="text-gray-400">{ord.deliveryAddress}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white">৳{ord.total}</span>
                            <p className="text-amber-300 uppercase text-[10px]">{ord.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCT MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">পোশাক সম্ভার ও স্টক নিয়ন্ত্রণ</h2>
                      <p className="text-xs text-gray-400">নতুন পোশাক যোগ করুন, দাম, সাইজ ও স্টক এডিট করুন</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          name: '',
                          bengaliName: '',
                          category: 'Saree',
                          price: 2500,
                          discountPrice: 2100,
                          stock: 10,
                          availableSizes: ['Free Size'],
                          availableColors: [{ name: 'Default', hex: '#d4af37' }],
                          images: [],
                          description: '',
                          bengaliDescription: '',
                          status: 'active',
                        });
                        setProductModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl gold-gradient-btn text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus size={16} />
                      <span>নতুন পোশাক যোগ করুন</span>
                    </button>
                  </div>

                  {/* Product Grid Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-[#141727] border border-white/10 hover:border-white/20 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-16 h-20 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-[#ffd700]">{p.code}</span>
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{p.bengaliName}</h4>
                            <p className="text-[11px] text-gray-400 truncate">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                              <span className="font-bold text-[#ffd700]">৳{p.discountPrice || p.price}</span>
                              {p.discountPrice && (
                                <span className="text-gray-500 line-through text-[11px]">৳{p.price}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-400 block mt-0.5">
                              স্টক: {p.stock} পিস
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white flex items-center gap-1"
                          >
                            <Edit3 size={13} />
                            <span>এডিট</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি "${p.bengaliName}" ডিলিট করতে চান?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs text-red-400 flex items-center gap-1"
                          >
                            <Trash2 size={13} />
                            <span>ডিলিট</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ORDER MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">গ্রাহক অর্ডারসমূহ ({orders.length})</h2>
                      <p className="text-xs text-gray-400">প্রতিটি অর্ডারের স্ট্যাটাস পরিবর্তন ও বিবরণ দেখুন</p>
                    </div>

                    {/* Status filter bar */}
                    <div className="flex flex-wrap gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
                      {['all', 'new', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => setOrderFilter(st)}
                            className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                              orderFilter === st
                                ? 'bg-[#d4af37] text-gray-950 font-bold'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <p className="text-center py-10 text-xs text-gray-500">এই ফিল্টারে কোনো অর্ডার নেই।</p>
                    ) : (
                      filteredOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-[#141727] border border-white/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                            <div>
                              <span className="font-mono font-bold text-[#ffd700] text-sm">
                                {ord.orderNumber}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                {new Date(ord.createdAt).toLocaleDateString('bn-BD')} {new Date(ord.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Status updater dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">স্ট্যাটাস:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                className="bg-[#1e2238] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none"
                              >
                                <option value="new">New (নতুন)</option>
                                <option value="pending">Pending (অপেক্ষমান)</option>
                                <option value="confirmed">Confirmed (নিশ্চিত)</option>
                                <option value="processing">Processing (প্রস্তুত হচ্ছে)</option>
                                <option value="shipped">Shipped (কুরিয়ারে)</option>
                                <option value="delivered">Delivered (ডেলিভার্ড)</option>
                                <option value="cancelled">Cancelled (বাতিল)</option>
                              </select>
                            </div>
                          </div>

                          {/* Customer & Items */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <p className="text-gray-400">
                                গ্রাহক: <span className="text-white font-bold">{ord.customerName}</span>
                              </p>
                              <p className="text-gray-400">
                                ফোন: <a href={`tel:${ord.customerPhone}`} className="text-emerald-400 font-bold hover:underline">{ord.customerPhone}</a>
                              </p>
                              <p className="text-gray-400">ঠিকানা: <span className="text-gray-200">{ord.deliveryAddress}</span></p>
                              {ord.orderNote && (
                                <p className="text-amber-200">নোট: {ord.orderNote}</p>
                              )}
                            </div>

                            <div className="space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                              <p className="font-semibold text-[#ffd700]">পণ্য তালিকা:</p>
                              {ord.items.map((item, idx) => (
                                <p key={idx} className="text-gray-300">
                                  • {item.product.bengaliName} (সাইজ: {item.selectedSize}, কালার: {item.selectedColor.name}) x {item.quantity}
                                </p>
                              ))}
                              <p className="pt-1 text-right font-extrabold text-[#ffd700] text-sm border-t border-white/5">
                                সর্বমোট: ৳{ord.total} ({ord.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : ord.paymentMethod})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: COMPLAINTS */}
              {activeTab === 'complaints' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">গ্রাহক সহায়তা ও অভিযোগ</h2>
                    <p className="text-xs text-gray-400">গ্রাহকদের অভিযোগের সমাধান ও রিপ্লাই দিন</p>
                  </div>

                  <div className="space-y-3">
                    {complaints.length === 0 ? (
                      <p className="text-center py-10 text-xs text-gray-500">কোনো অভিযোগ জমা নেই।</p>
                    ) : (
                      complaints.map((c) => (
                        <div key={c.id} className="p-4 rounded-2xl bg-[#141727] border border-white/10 space-y-3 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                            <div>
                              <span className="font-mono font-bold text-[#ffd700]">{c.complaintId}</span>
                              <span className="ml-2 text-gray-400">
                                কাস্টমার: <strong className="text-white">{c.customerName}</strong> ({c.customerPhone})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">স্ট্যাটাস:</span>
                              <select
                                value={c.status}
                                onChange={(e) => updateComplaintStatus(c.id, e.target.value as ComplaintStatus)}
                                className="bg-[#1e2238] border border-white/20 rounded px-2 py-0.5 text-xs text-amber-300"
                              >
                                <option value="new">New</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="processing">Processing</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                            <p className="text-gray-400 mb-1">গ্রাহকের অভিযোগ:</p>
                            <p className="text-white">{c.message}</p>
                          </div>

                          {/* Admin Resolution input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={c.adminNotes || ''}
                              placeholder="এডমিন সমাধান মন্তব্য লিখুন..."
                              onBlur={(e) => updateComplaintStatus(c.id, c.status, e.target.value)}
                              className="flex-1 bg-[#1a1d2e] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-xl gold-gradient-btn text-xs font-bold"
                            >
                              আপডেট সেভ
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS & CONFIGURATION GUIDE */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">স্টোর সেটিংস ও ইন্টিগ্রেশন</h2>
                    <p className="text-xs text-gray-400">হটলাইন, ফেসবুক পেজ ও ডেলিভারি চার্জ পরিবর্তন করুন</p>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">কল বাটন / হটলাইন নম্বর</label>
                      <input
                        type="text"
                        value={settingsForm.hotline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hotline: e.target.value })}
                        className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">WhatsApp নম্বর</label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Facebook Page URL</label>
                      <input
                        type="text"
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">ঢাকা সিটি ডেলিভারি (৳)</label>
                        <input
                          type="number"
                          value={settingsForm.deliveryInsideDhaka}
                          onChange={(e) => setSettingsForm({ ...settingsForm, deliveryInsideDhaka: Number(e.target.value) })}
                          className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">ঢাকা উপশহর (৳)</label>
                        <input
                          type="number"
                          value={settingsForm.deliverySubDhaka}
                          onChange={(e) => setSettingsForm({ ...settingsForm, deliverySubDhaka: Number(e.target.value) })}
                          className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-xs mb-1">ঢাকার বাইরে (৳)</label>
                        <input
                          type="number"
                          value={settingsForm.deliveryOutsideDhaka}
                          onChange={(e) => setSettingsForm({ ...settingsForm, deliveryOutsideDhaka: Number(e.target.value) })}
                          className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-1">ঘোষণা ব্যানার লেখা (Marquee Text)</label>
                      <input
                        type="text"
                        value={settingsForm.announcementText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                        className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        updateStoreSettings(settingsForm);
                        alert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
                      }}
                      className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-bold"
                    >
                      সেটিংস সংরক্ষণ করুন
                    </button>
                  </div>

                  {/* Admin Passcode Update Card */}
                  <div className="p-5 rounded-2xl bg-[#141624] border border-[#d4af37]/35 space-y-3.5 text-xs">
                    <div className="flex items-center gap-2">
                      <KeyRound size={16} className="text-[#ffd700]" />
                      <h4 className="font-bold text-white text-sm">এডমিন পাসকোড পরিবর্তন করুন</h4>
                    </div>
                    <p className="text-gray-400">
                      আপনার এডমিন প্যানেলের পাসওয়ার্ড যেকোনো সময় পরিবর্তন করতে পারবেন। পাসওয়ার্ড দেখার জন্য চোখের আইকনে ক্লিক করুন।
                    </p>

                    {changePassStatus && (
                      <div
                        className={`p-2.5 rounded-xl text-xs ${
                          changePassStatus.success
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                            : 'bg-red-950/80 border border-red-500/50 text-red-300'
                        }`}
                      >
                        {changePassStatus.text}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">নতুন এডমিন পাসকোড</label>
                      <div className="relative max-w-sm">
                        <input
                          type={showNewAdminPass ? 'text' : 'password'}
                          value={newAdminPass}
                          onChange={(e) => setNewAdminPass(e.target.value)}
                          placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসকোড দিন..."
                          className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 pl-3 pr-10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewAdminPass(!showNewAdminPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffd700]"
                          title={showNewAdminPass ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                        >
                          {showNewAdminPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newAdminPass.trim() || newAdminPass.trim().length < 4) {
                          setChangePassStatus({ text: 'পাসকোড কমপক্ষে ৪ ডিজিটের হতে হবে!', success: false });
                          return;
                        }
                        const ok = changeAdminPasscode(newAdminPass.trim());
                        if (ok) {
                          setChangePassStatus({ text: 'এডমিন পাসকোড সফলভাবে পরিবর্তন হয়েছে!', success: true });
                          setNewAdminPass('');
                        }
                      }}
                      className="px-5 py-2 rounded-xl gold-gradient-btn text-xs font-bold"
                    >
                      পাসকোড আপডেট করুন
                    </button>
                  </div>

                  {/* Developer / Configuration Guidance */}
                  <div className="p-4 rounded-2xl bg-[#141624] border border-[#d4af37]/30 space-y-3 text-xs">
                    <h4 className="font-bold text-[#ffd700] flex items-center gap-1.5">
                      <Sparkles size={14} /> Firebase ও Google OAuth কনফিগারেশন গাইড
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      আপনার প্রোডাকশন এনভায়রনমেন্টের জন্য Firebase বা Google Client ID সেট করতে হলে:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li><strong className="text-white">Gemini AI Key:</strong> .env ফাইলে <code className="text-amber-300">GEMINI_API_KEY</code> সেট করা আছে। AI সাপোর্ট স্বয়ংক্রিয়ভাবে কাজ করবে।</li>
                      <li><strong className="text-white">Google OAuth Client ID:</strong> Google Cloud Console &gt; Credentials থেকে Web Client ID নিয়ে বসানো যাবে।</li>
                      <li><strong className="text-white">Firebase Config:</strong> ফায়ারবেস কনসোলে প্রজেক্ট তৈরি করে Firestore এবং Auth অন করলেই সিস্টেম সরাসরি সিঙ্ক হবে।</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===================== ADD / EDIT PRODUCT MODAL ===================== */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#121422] border border-[#d4af37]/40 shadow-2xl p-5 sm:p-7 text-white my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-lg font-bold font-serif-luxury text-white">
                {editingProduct.id ? 'পোশাকের তথ্য এডিট করুন' : 'নতুন পোশাক যোগ করুন'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">বাংলা নাম (Title in Bengali) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.bengaliName || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, bengaliName: e.target.value })}
                    placeholder="যেমন: রয়্যাল কাতান সিল্ক শাড়ি"
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">ইংরেজি নাম (English Name) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Royal Crimson Silk Saree"
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">ক্যাটাগরি *</label>
                  <select
                    value={editingProduct.category || 'Saree'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  >
                    <option value="Saree">Saree (শাড়ি)</option>
                    <option value="Three Piece">Three Piece (থ্রি-পিস)</option>
                    <option value="Lehenga">Lehenga (লেহেঙ্গা)</option>
                    <option value="Kurti">Kurti (কুর্তি)</option>
                    <option value="Abaya & Hijab">Abaya & Hijab (আবায়া)</option>
                    <option value="Gown & Western">Gown & Western (গাউন)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">নিয়মিত মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    placeholder="2500"
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">অফার / ডিসকাউন্ট মূল্য (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="2100"
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">স্টক পরিমাণ (Stock Quantity)</label>
                  <input
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">ফেব্রিক / কাপড়ের বিবরণ</label>
                  <input
                    type="text"
                    value={editingProduct.fabric || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    placeholder="যেমন: Pure Georgette with Thread Embroidery"
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-white"
                  />
                </div>
              </div>

              {/* Images Manager */}
              <div>
                <label className="block text-gray-300 font-medium mb-1">পোশাকের ছবি (Image Upload & URLs)</label>
                
                {/* Upload File or Add URL */}
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="ছবির লিংক বা URL পেস্ট করুন..."
                      className="flex-1 bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
                    >
                      URL যোগ
                    </button>
                  </div>

                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] text-xs font-bold cursor-pointer hover:bg-[#d4af37]/30 transition-colors">
                    <Upload size={14} />
                    <span>ডিভাইস থেকে আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Thumbnails list */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {editingProduct.images.map((img, i) => (
                      <div key={i} className="relative w-16 h-20 rounded-lg overflow-hidden border border-white/20 group">
                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">বিবরণ (Description)</label>
                <textarea
                  rows={3}
                  value={editingProduct.bengaliDescription || editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, bengaliDescription: e.target.value, description: e.target.value })}
                  placeholder="পোশাকের কাজ, ওড়না, ব্লাউজ পিস এবং স্পেশাল ডিটেইলস..."
                  className="w-full bg-[#181a28] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-gray-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl gold-gradient-btn text-xs font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
