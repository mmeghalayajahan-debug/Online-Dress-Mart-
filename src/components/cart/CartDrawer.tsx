import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    storeSettings,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const freeDeliveryRemaining = Math.max(0, storeSettings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((cartSubtotal / storeSettings.freeDeliveryThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#111320] border-l border-[#d4af37]/30 shadow-2xl flex flex-col text-white">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_10px_rgba(212,175,55,0.3)] shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Online Dress Mart"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif-luxury text-white">
                আপনার শপিং কার্ট ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free delivery progress meter */}
          <div className="p-3 bg-[#181b2c] border-b border-white/5 text-xs">
            {freeDeliveryRemaining > 0 ? (
              <div>
                <p className="text-gray-300">
                  আর মাত্র <span className="font-bold text-[#ffd700]">৳{freeDeliveryRemaining}</span> টাকার পণ্য কিনলে পাচ্ছেন ফ্রি ডেলিভারি!
                </p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#ffd700] rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles size={14} /> অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!
              </p>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-base font-semibold text-gray-300">আপনার কার্ট বর্তমানে খালি</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  আপনার পছন্দের শাড়ি, থ্রি-পিস বা কুর্তি সিলেক্ট করে কার্টে যোগ করুন।
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2 rounded-full gold-gradient-btn text-xs font-bold"
                >
                  পোশাক দেখুন
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemPrice = item.product.discountPrice || item.product.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${index}`}
                    className="flex gap-3 p-3 rounded-2xl bg-[#171929] border border-white/10 hover:border-white/20 transition-all"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product.name}
                      className="w-20 h-24 rounded-xl object-cover shrink-0"
                    />

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                            {item.product.bengaliName || item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-gray-400 hover:text-red-400 p-1"
                            title="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#ffd700] font-mono mt-0.5">
                          {item.product.code}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            সাইজ: {item.selectedSize}
                          </span>
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center border border-white/15 rounded-lg bg-black/40 overflow-hidden">
                          <button
                            onClick={() => updateCartQty(index, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-xs text-gray-300 hover:bg-white/10"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(index, item.quantity + 1)}
                            className="px-2.5 py-0.5 text-xs text-gray-300 hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#ffd700]">
                            ৳{itemTotal.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#141624] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>সাবটোটাল (Subtotal):</span>
                  <span className="font-semibold text-white">৳{cartSubtotal.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>চেকআউট পেজে এরিয়া অনুযায়ী যুক্ত হবে</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#ffd700] pt-2 border-t border-white/10">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span>৳{cartSubtotal.toLocaleString('en-US')}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl gold-gradient-btn text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all active:scale-95"
              >
                <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-gray-400 hover:text-red-400 hover:underline"
                >
                  কার্ট খালি করুন
                </button>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={13} /> ১০০% নিরাপদ চেকআউট
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
