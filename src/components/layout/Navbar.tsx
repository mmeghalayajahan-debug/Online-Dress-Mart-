import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  Phone, 
  MessageCircle, 
  User, 
  Shield, 
  Menu, 
  X,
  Facebook,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsLampLoginOpen,
    setIsProfileOpen,
    setIsComplaintOpen,
    setIsAdminOpen,
    currentUser,
    isAdminLoggedIn,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    storeSettings
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories = [
    'All',
    'Saree',
    'Three Piece',
    'Lehenga',
    'Kurti',
    'Abaya & Hijab',
    'Gown & Western',
  ];

  const handleProfileClick = () => {
    if (currentUser) {
      setIsProfileOpen(true);
    } else {
      setIsLampLoginOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0f17]/90 backdrop-blur-xl border-b border-[#d4af37]/20 shadow-lg">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-[#17150c] via-[#2d2411] to-[#17150c] border-b border-[#d4af37]/15 py-1.5 px-2.5 sm:px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] xs:text-[11px] sm:text-xs gap-2">
          <div className="hidden sm:flex items-center gap-2.5 text-amber-200/80 shrink-0">
            <span className="flex items-center gap-1">
              <Phone size={12} className="text-[#ffd700]" /> হটলাইন: <a href={`tel:${storeSettings.hotline}`} className="hover:underline font-semibold text-white">{storeSettings.hotline}</a>
            </span>
            <span>·</span>
            <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
          </div>

          <p className="flex-1 text-center font-medium text-[#ffd700] truncate px-1">
            {storeSettings.announcementText}
          </p>

          <div className="flex items-center gap-2 xs:gap-3 shrink-0">
            <a
              href={storeSettings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-gray-300 hover:text-[#1877F2] transition-colors"
              title="Facebook Page"
            >
              <Facebook size={12} />
              <span className="hidden md:inline font-medium">Facebook</span>
            </a>
            <span className="hidden sm:inline text-white/20">|</span>
            <button
              onClick={() => setIsComplaintOpen(true)}
              className="hidden xs:flex items-center gap-1 text-gray-300 hover:text-amber-300 transition-colors"
            >
              <HelpCircle size={12} />
              <span className="hidden sm:inline">সাপোর্ট</span>
            </button>
            <span className="hidden xs:inline text-white/20">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className={`flex items-center gap-1 text-[10px] xs:text-xs px-2 py-0.5 rounded transition-colors ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="এডমিন প্যানেল"
            >
              <Shield size={11} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20 gap-1.5 xs:gap-2 sm:gap-4">
          {/* Left: Mobile hamburger menu toggle */}
          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 xs:p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg active:scale-95 transition-transform"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Center: Brand Logo & Name (Separated, proportional, NEVER overlapping) */}
          <div
            className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 cursor-pointer select-none group min-w-0 max-w-[62%] sm:max-w-none"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            {/* Official Uploaded Circular Logo Image */}
            <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full shrink-0 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.45)] border border-[#d4af37]/60 p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e] group-hover:scale-105 transition-transform">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart Official Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-serif-luxury text-[13px] xs:text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-wide sm:tracking-wider gold-gradient-text block leading-tight truncate">
                ONLINE DRESS MART
              </span>
              <span className="hidden sm:block text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium truncate mt-0.5">
                Curated Fashion · Luxury Boutique
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শাড়ি, থ্রি-পিস, লেহেঙ্গা বা কোড দিয়ে খুঁজুন..."
                className="w-full bg-[#181a26] border border-white/10 rounded-full py-2 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Buttons (Responsive, fitting inside all screens without cutting off) */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile search toggle button */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="md:hidden p-1.5 xs:p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/5 active:scale-95 transition-transform"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Direct Call Button (Desktop/Tablet) */}
            <a
              href={`tel:${storeSettings.hotline}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all"
              title="Call us directly"
            >
              <Phone size={13} />
              <span>কল করুন</span>
            </a>

            {/* Direct WhatsApp Button (Desktop/Tablet) */}
            <a
              href={`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent('Hello Online Dress Mart, I want to know about your dresses!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>

            {/* Facebook Page Icon Button (Desktop) */}
            <a
              href={storeSettings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 rounded-full text-gray-300 hover:text-[#1877F2] hover:bg-white/5 transition-all"
              title="Facebook Page"
            >
              <Facebook size={18} />
            </a>

            {/* Pull-String Lamp Login / Customer Profile Button */}
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-1 p-1.5 xs:p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-medium active:scale-95 transition-all"
              title={currentUser ? `Profile: ${currentUser.name}` : 'লগইন করুন (Pull String Lamp)'}
            >
              <User size={17} className={currentUser ? 'text-[#ffd700]' : 'text-gray-300'} />
              <span className="hidden md:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'লগইন'}
              </span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 xs:p-2.5 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-[#b8861d]/30 border border-[#d4af37]/40 text-[#ffd700] hover:scale-105 active:scale-95 transition-all"
              aria-label="View Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 xs:h-5 xs:w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-[9px] xs:text-[10px] font-bold text-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar dropdown */}
        {showSearchInput && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শাড়ি, থ্রি-পিস, লেহেঙ্গা বা কোড দিয়ে খুঁজুন..."
                className="w-full bg-[#181a26] border border-[#d4af37]/40 rounded-full py-2 pl-10 pr-9 text-xs text-white placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Horizontal Filter Row */}
        <div className="hidden lg:flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat === 'All' ? 'সব পোশাক (All)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#10121d] border-b border-white/10 px-4 py-4 space-y-3">
          {/* Mobile Drawer Brand Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif-luxury text-base font-bold gold-gradient-text block leading-tight">
                ONLINE DRESS MART
              </span>
              <span className="text-[10px] text-gray-400">Curated Fashion Boutique</span>
            </div>
          </div>

          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">ক্যাটাগরি</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37]/20 border border-[#d4af37] text-[#ffd700]'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {cat === 'All' ? 'সকল কালেকশন' : cat}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                handleProfileClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs text-white"
            >
              <User size={16} className="text-[#ffd700]" />
              <span>{currentUser ? `আমার প্রোফাইল (${currentUser.name})` : 'লগইন / রেজিস্টার (Pull String Lamp)'}</span>
            </button>

            <button
              onClick={() => {
                setIsComplaintOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs text-white"
            >
              <HelpCircle size={16} className="text-amber-400" />
              <span>অভিযোগ ও সাপোর্ট বক্স (Complaint Box)</span>
            </button>

            <button
              onClick={() => {
                setIsAdminOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-xs text-amber-300"
            >
              <Shield size={16} />
              <span>এডমিন ড্যাশবোর্ড (Admin Panel)</span>
            </button>
          </div>

          {/* Quick Contacts in Mobile Menu */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[11px]">
            <a
              href={`tel:${storeSettings.hotline}`}
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-1 font-semibold"
            >
              <Phone size={15} />
              <span>কল করুন</span>
            </a>
            <a
              href={`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent('Hello Online Dress Mart, I want to know about your dresses!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex flex-col items-center gap-1 font-semibold"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
            <a
              href={storeSettings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] flex flex-col items-center gap-1 font-semibold"
            >
              <Facebook size={15} />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
