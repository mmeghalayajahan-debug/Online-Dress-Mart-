import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, MessageCircle, Phone, Printer, ArrowRight, Package, MapPin } from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, storeSettings } = useStore();

  if (!lastPlacedOrder) return null;

  const handleWhatsAppSend = () => {
    const text = `আসসালামু আলাইকুম অনলাইন ড্রেস মার্ট,\nআমার নতুন অর্ডার সম্পন্ন হয়েছে!\n\nঅর্ডার আইডি: ${lastPlacedOrder.orderNumber}\nগ্রাহকের নাম: ${lastPlacedOrder.customerName}\nমোবাইল: ${lastPlacedOrder.customerPhone}\nঠিকানা: ${lastPlacedOrder.deliveryAddress}\nসর্বমোট মূল্য: ৳${lastPlacedOrder.total}\n\nঅনুগ্রহ করে অর্ডারটি দ্রুত কনফার্ম করবেন।`;
    window.open(`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl xs:rounded-3xl bg-[#121422] border border-[#d4af37]/40 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-3.5 xs:p-5 sm:p-8 text-white my-auto">
        {/* Success Icon & Header */}
        <div className="text-center space-y-2 pb-5 sm:pb-6 border-b border-white/10">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-2">
            <div className="w-11 h-11 xs:w-14 xs:h-14 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e]">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-11 h-11 xs:w-14 xs:h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={26} className="xs:w-8 xs:h-8" />
            </div>
          </div>
          <span className="text-[11px] xs:text-xs uppercase tracking-widest text-[#ffd700] font-semibold">
            {storeSettings.brandName}
          </span>
          <h2 className="text-lg xs:text-2xl sm:text-3xl font-bold font-serif-luxury text-white">
            অর্ডারটি সফলভাবে গৃহীত হয়েছে!
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            ধন্যবাদ! আমাদের প্রতিনিধি খুব শীঘ্রই ফোন করে আপনার অর্ডারটি নিশ্চিত করবেন।
          </p>

          {/* Unique Order ID Badge */}
          <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#d4af37]/40 text-[#ffd700] font-mono text-sm font-bold">
            Order ID: {lastPlacedOrder.orderNumber}
          </div>
        </div>

        {/* Order Details Body */}
        <div className="py-5 space-y-4 text-xs sm:text-sm">
          {/* Customer & Delivery address */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#ffd700] font-bold text-xs uppercase">
              <MapPin size={14} /> ডেলিভারি তথ্য
            </div>
            <p className="font-semibold text-white">{lastPlacedOrder.customerName} ({lastPlacedOrder.customerPhone})</p>
            <p className="text-gray-300">{lastPlacedOrder.deliveryAddress}</p>
            <p className="text-gray-400 text-xs">
              এরিয়া: {lastPlacedOrder.cityArea === 'dhaka' ? 'ঢাকা সিটি' : lastPlacedOrder.cityArea === 'sub_dhaka' ? 'ঢাকা উপশহর' : 'ঢাকার বাইরে'}
            </p>
            {lastPlacedOrder.orderNote && (
              <p className="text-amber-200/90 text-xs pt-1 border-t border-white/5">
                নোট: {lastPlacedOrder.orderNote}
              </p>
            )}
          </div>

          {/* Items Summary */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-[#ffd700] font-bold text-xs uppercase">
              <Package size={14} /> অর্ডারকৃত পোশাক
            </div>
            {lastPlacedOrder.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-gray-300 text-xs py-1 border-b border-white/5 last:border-0">
                <div>
                  <span className="font-medium text-white">{item.product.bengaliName}</span> x {item.quantity}
                  <p className="text-[11px] text-gray-400">
                    সাইজ: {item.selectedSize} | রঙ: {item.selectedColor.name} | কোড: {item.product.code}
                  </p>
                </div>
                <span className="font-bold text-white">
                  ৳{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-US')}
                </span>
              </div>
            ))}

            {/* Total calculation */}
            <div className="pt-2 text-xs space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>পণ্য মূল্য:</span>
                <span>৳{lastPlacedOrder.subtotal.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>ডেলিভারি চার্জ:</span>
                <span>{lastPlacedOrder.deliveryFee === 0 ? 'ফ্রি' : `৳${lastPlacedOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#ffd700] pt-1 border-t border-white/10">
                <span>মোট পরিশোধযোগ্য:</span>
                <span>৳{lastPlacedOrder.total.toLocaleString('en-US')} ({lastPlacedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : lastPlacedOrder.paymentMethod})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Send via WhatsApp */}
          <button
            onClick={handleWhatsAppSend}
            className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-gray-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <MessageCircle size={18} />
            <span>অর্ডারের তথ্য WhatsApp এ পাঠান ({storeSettings.whatsapp})</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer size={15} />
              <span>রসিদ প্রিন্ট / সেভ</span>
            </button>

            <a
              href={`tel:${storeSettings.hotline}`}
              className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-emerald-400 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone size={15} />
              <span>হটলাইনে কল করুন</span>
            </a>
          </div>

          <button
            onClick={() => setLastPlacedOrder(null)}
            className="w-full py-3 rounded-xl gold-gradient-btn text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <span>আরো কেনাকাটা করুন</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
