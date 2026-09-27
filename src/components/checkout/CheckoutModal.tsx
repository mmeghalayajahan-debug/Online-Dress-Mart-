import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Truck, ShieldCheck, MapPin, Phone, Mail, User, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    placeOrder,
    storeSettings,
    currentUser,
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState<'dhaka' | 'sub_dhaka' | 'outside_dhaka'>('dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderNote, setOrderNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill if customer is logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.cityArea) setCityArea(currentUser.cityArea);
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  // Delivery fee calculation
  let deliveryFee = storeSettings.deliveryInsideDhaka;
  if (cityArea === 'sub_dhaka') deliveryFee = storeSettings.deliverySubDhaka;
  if (cityArea === 'outside_dhaka') deliveryFee = storeSettings.deliveryOutsideDhaka;

  // Free delivery check
  const isFreeDelivery = cartSubtotal >= storeSettings.freeDeliveryThreshold;
  const appliedDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = cartSubtotal + appliedDeliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('আপনার কার্ট খালি। অনুগ্রহ করে পণ্য সিলেক্ট করুন।');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('আপনার নাম লিখুন');
      return;
    }

    // Bangladeshi phone validation
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/এলাকা)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      placeOrder({
        customerName: name.trim(),
        customerPhone: cleanPhone,
        customerEmail: email.trim() || 'customer@onlinedressmart.com',
        deliveryAddress: address.trim(),
        cityArea,
        deliveryFee: appliedDeliveryFee,
        items: cart,
        subtotal: cartSubtotal,
        total: grandTotal,
        paymentMethod,
        paymentStatus: 'unpaid',
        status: 'new',
        orderNote: orderNote.trim(),
      });

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#121422] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 sm:p-8 text-white my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
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
              <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                চেকআউট ও ডেলিভারি তথ্য
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Online Dress Mart · ক্যাশ অন ডেলিভারি ও দ্রুত শিপিং
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          {/* Section 1: Customer Contact & Delivery Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
              <MapPin size={14} /> গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">
                  আপনার পূর্ণ নাম <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: নুসরাত জাহান"
                    className="w-full bg-[#191c2b] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">
                  মোবাইল নম্বর <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full bg-[#191c2b] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs text-gray-300 font-medium mb-1">
                ইমেইল অ্যাড্রেস (অপশনাল)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল (অর্ডার ট্র্যাকিং ও চালানের জন্য)"
                  className="w-full bg-[#191c2b] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* City / Delivery Area Selector */}
            <div>
              <label className="block text-xs text-gray-300 font-medium mb-2">
                ডেলিভারি এরিয়া সিলেক্ট করুন <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCityArea('dhaka')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    cityArea === 'dhaka'
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold text-white">ঢাকা সিটি কর্পোরেশন</p>
                  <p className="text-[11px] text-amber-300">
                    চার্জ: {isFreeDelivery ? 'ফ্রি' : `৳${storeSettings.deliveryInsideDhaka}`} (২-৩ দিন)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCityArea('sub_dhaka')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    cityArea === 'sub_dhaka'
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold text-white">ঢাকা উপশহর / সাভার / গাজীপুর</p>
                  <p className="text-[11px] text-amber-300">
                    চার্জ: {isFreeDelivery ? 'ফ্রি' : `৳${storeSettings.deliverySubDhaka}`} (৩-৪ দিন)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCityArea('outside_dhaka')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    cityArea === 'outside_dhaka'
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold text-white">ঢাকার বাইরে (সারাদেশ)</p>
                  <p className="text-[11px] text-amber-300">
                    চার্জ: {isFreeDelivery ? 'ফ্রি' : `৳${storeSettings.deliveryOutsideDhaka}`} (৩-৫ দিন)
                  </p>
                </button>
              </div>
            </div>

            {/* Detailed Street Address */}
            <div>
              <label className="block text-xs text-gray-300 font-medium mb-1">
                সম্পূর্ণ ঠিকানা (বাসা নং, রোড, থানা, জেলা) <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="যেমন: বাসা নং ১২, রোড নং ৫, ব্লক বি, মিরপুর ২, ঢাকা"
                className="w-full bg-[#191c2b] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Order Note */}
            <div>
              <label className="block text-xs text-gray-300 font-medium mb-1">
                বিশেষ কোনো নোট বা নির্দেশিকা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="যেমন: বিকেলে কল দিয়ে ডেলিভারি করবেন"
                className="w-full bg-[#191c2b] border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffd700] flex items-center gap-1.5">
              <ShieldCheck size={14} /> পেমেন্ট পদ্ধতি
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#d4af37] bg-[#d4af37]/15'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#ffd700]"
                />
                <div>
                  <p className="text-xs font-bold text-white">ক্যাশ অন ডেলিভারি (COD)</p>
                  <p className="text-[11px] text-gray-400">পণ্য হাতে পেয়ে টাকা পরিশোধ</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-[#d4af37] bg-[#d4af37]/15'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="accent-[#ffd700]"
                />
                <div>
                  <p className="text-xs font-bold text-pink-400">bKash (বিকাশ সেন্ড মানি)</p>
                  <p className="text-[11px] text-gray-400">{storeSettings.bkashNumber}</p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-[#d4af37] bg-[#d4af37]/15'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="accent-[#ffd700]"
                />
                <div>
                  <p className="text-xs font-bold text-orange-400">Nagad (নগদ সেন্ড মানি)</p>
                  <p className="text-[11px] text-gray-400">{storeSettings.nagadNumber}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Order Summary Table */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-sm text-white pb-2 border-b border-white/10">
              <span>অর্ডারকৃত পণ্যসমূহ ({cart.length} টি)</span>
              <span>মোট</span>
            </div>

            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-gray-300 py-1">
                <div>
                  <p className="font-semibold text-white">
                    {item.product.bengaliName} x {item.quantity}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    সাইজ: {item.selectedSize} · কালার: {item.selectedColor.name}
                  </p>
                </div>
                <span className="font-semibold text-white">
                  ৳{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-US')}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-white/10 space-y-1">
              <div className="flex justify-between text-gray-300">
                <span>সাবটোটাল:</span>
                <span>৳{cartSubtotal.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>ডেলিভারি চার্জ:</span>
                <span>{isFreeDelivery ? '৳০ (ফ্রি ডেলিভারি)' : `৳${appliedDeliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#ffd700] pt-1 border-t border-white/10">
                <span>সর্বমোট প্রদেয়:</span>
                <span>৳{grandTotal.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl gold-gradient-btn text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_5px_30px_rgba(212,175,55,0.4)] transition-all active:scale-95"
          >
            {isSubmitting ? (
              <span>অর্ডার প্রসেস হচ্ছে...</span>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString('en-US')})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
