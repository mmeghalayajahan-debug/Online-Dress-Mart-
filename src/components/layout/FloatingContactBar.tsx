import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, MessageCircle, ShoppingBag, User, Facebook } from 'lucide-react';

export const FloatingContactBar: React.FC = () => {
  const { storeSettings, cartCount, setIsCartOpen, setIsLampLoginOpen, setIsProfileOpen, currentUser } = useStore();

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0f18]/95 backdrop-blur-xl border-t border-[#d4af37]/30 px-1 xs:px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-5 items-center w-full">
        {/* 1. Direct Call */}
        <a
          href={`tel:${storeSettings.hotline}`}
          className="flex flex-col items-center justify-center text-emerald-400 p-0.5 xs:p-1 active:scale-95 transition-transform min-w-0"
        >
          <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Phone size={14} className="xs:w-4 xs:h-4" />
          </div>
          <span className="text-[9px] xs:text-[10px] font-semibold mt-0.5 truncate text-center w-full block">
            কল করুন
          </span>
        </a>

        {/* 2. Direct WhatsApp */}
        <a
          href={`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent('Hello Online Dress Mart, I want to order a dress.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-[#25D366] p-0.5 xs:p-1 active:scale-95 transition-transform min-w-0"
        >
          <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0">
            <MessageCircle size={14} className="xs:w-4 xs:h-4" />
          </div>
          <span className="text-[9px] xs:text-[10px] font-semibold mt-0.5 truncate text-center w-full block">
            WhatsApp
          </span>
        </a>

        {/* 3. Facebook Page */}
        <a
          href={storeSettings.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-[#1877F2] p-0.5 xs:p-1 active:scale-95 transition-transform min-w-0"
        >
          <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center shrink-0">
            <Facebook size={14} className="xs:w-4 xs:h-4" />
          </div>
          <span className="text-[9px] xs:text-[10px] font-semibold mt-0.5 truncate text-center w-full block">
            Facebook
          </span>
        </a>

        {/* 4. Cart Drawer with counter */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center text-[#ffd700] p-0.5 xs:p-1 active:scale-95 transition-transform min-w-0"
        >
          <div className="relative w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0">
            <ShoppingBag size={14} className="xs:w-4 xs:h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 xs:h-4 xs:w-4 items-center justify-center rounded-full bg-red-600 text-[8px] xs:text-[9px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] xs:text-[10px] font-semibold mt-0.5 truncate text-center w-full block">
            কার্ট {cartCount > 0 ? `(${cartCount})` : ''}
          </span>
        </button>

        {/* 5. Account / Pull String Lamp Login */}
        <button
          type="button"
          onClick={() => (currentUser ? setIsProfileOpen(true) : setIsLampLoginOpen(true))}
          className="flex flex-col items-center justify-center text-amber-200 p-0.5 xs:p-1 active:scale-95 transition-transform min-w-0"
        >
          <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <User size={14} className="xs:w-4 xs:h-4" />
          </div>
          <span className="text-[9px] xs:text-[10px] font-semibold mt-0.5 truncate text-center w-full block">
            {currentUser ? 'প্রোফাইল' : 'লগইন'}
          </span>
        </button>
      </div>
    </div>
  );
};
