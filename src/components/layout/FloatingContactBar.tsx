import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, MessageCircle, ShoppingBag, User, Facebook } from 'lucide-react';

export const FloatingContactBar: React.FC = () => {
  const { storeSettings, cartCount, setIsCartOpen, setIsLampLoginOpen, setIsProfileOpen, currentUser } = useStore();

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d0f18]/95 backdrop-blur-xl border-t border-[#d4af37]/30 px-3 py-2 flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      {/* 1. Direct Call */}
      <a
        href={`tel:${storeSettings.hotline}`}
        className="flex flex-col items-center justify-center text-emerald-400 p-1 active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Phone size={16} />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">কল করুন</span>
      </a>

      {/* 2. Direct WhatsApp */}
      <a
        href={`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent('Hello Online Dress Mart, I want to order a dress.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-[#25D366] p-1 active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center">
          <MessageCircle size={16} />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
      </a>

      {/* 3. Facebook Page */}
      <a
        href={storeSettings.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center text-[#1877F2] p-1 active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center">
          <Facebook size={16} />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Facebook</span>
      </a>

      {/* 4. Cart Drawer with counter */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center text-[#ffd700] p-1 active:scale-95 transition-transform"
      >
        <div className="relative w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
          <ShoppingBag size={16} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-0.5">কার্ট ({cartCount})</span>
      </button>

      {/* 5. Account / Pull String Lamp Login */}
      <button
        type="button"
        onClick={() => (currentUser ? setIsProfileOpen(true) : setIsLampLoginOpen(true))}
        className="flex flex-col items-center justify-center text-amber-200 p-1 active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">
          {currentUser ? 'প্রোফাইল' : 'লগইন'}
        </span>
      </button>
    </div>
  );
};
