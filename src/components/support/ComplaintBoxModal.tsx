import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, HelpCircle, CheckCircle2, Search, MessageSquare, Phone, AlertCircle } from 'lucide-react';
import { ComplaintType, Complaint } from '../../types';

export const ComplaintBoxModal: React.FC = () => {
  const { isComplaintOpen, setIsComplaintOpen, submitComplaint, findComplaintById, currentUser } = useStore();

  const [activeView, setActiveView] = useState<'submit' | 'track'>('submit');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [orderId, setOrderId] = useState('');
  const [complaintType, setComplaintType] = useState<ComplaintType>('product_quality');
  const [message, setMessage] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Search track state
  const [searchQuery, setSearchQuery] = useState('');
  const [foundComplaint, setFoundComplaint] = useState<Complaint | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isComplaintOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    const newComp = submitComplaint({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || 'customer@onlinedressmart.com',
      orderId: orderId.trim() || undefined,
      complaintType,
      message,
    });

    setSubmittedComplaint(newComp);
    setMessage('');
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const result = findComplaintById(searchQuery);
    setFoundComplaint(result || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl xs:rounded-3xl bg-[#121422] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-3.5 xs:p-5 sm:p-8 text-white my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 xs:gap-3 min-w-0">
            <div className="w-9 h-9 xs:w-11 xs:h-11 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0 p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e]">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold font-serif-luxury text-white truncate">
                অভিযোগ ও কাস্টমার সাপোর্ট
              </h2>
              <p className="text-[10px] xs:text-xs text-gray-400 truncate">
                Online Dress Mart · তাৎক্ষণিক সমাধান
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsComplaintOpen(false)}
            className="p-1.5 xs:p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white shrink-0 ml-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex border-b border-white/10 mb-5">
          <button
            type="button"
            onClick={() => setActiveView('submit')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeView === 'submit'
                ? 'border-[#d4af37] text-[#ffd700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            নতুন অভিযোগ / সহায়তা চান
          </button>
          <button
            type="button"
            onClick={() => setActiveView('track')}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeView === 'track'
                ? 'border-[#d4af37] text-[#ffd700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            অভিযোগের স্ট্যাটাস ট্র্যাক করুন
          </button>
        </div>

        {/* View 1: Submit Complaint */}
        {activeView === 'submit' && (
          <div>
            {submittedComplaint ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">অভিযোগটি সফলভাবে জমা হয়েছে!</h3>
                <p className="text-xs text-gray-300">
                  আপনার অভিযোগ ট্র্যাকিংয়ের জন্য নিচের আইডিটি সংরক্ষণ করুন:
                </p>
                <div className="inline-block px-4 py-2 rounded-xl bg-white/10 border border-[#d4af37] text-[#ffd700] font-mono text-sm font-bold">
                  Complaint ID: {submittedComplaint.complaintId}
                </div>
                <p className="text-xs text-gray-400">
                  আমাদের সিনিয়র কাস্টমার রিলেশন টিম দ্রুত আপনার নম্বরে যোগাযোগ করবে।
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedComplaint(null)}
                  className="mt-3 px-6 py-2 rounded-xl gold-gradient-btn text-xs font-bold"
                >
                  আরেকটি অভিযোগ জমা দিন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 font-medium mb-1">
                      আপনার নাম <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="আপনার নাম"
                      className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 font-medium mb-1">
                      মোবাইল নম্বর <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="018XXXXXXXX"
                      className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 font-medium mb-1">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 font-medium mb-1">
                      অর্ডার নম্বর (যদি থাকে)
                    </label>
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="যেমন: ODM-2026-1088"
                      className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-medium mb-1">
                    অভিযোগের ধরন <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value as ComplaintType)}
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="delivery_delay">ডেলিভারিতে বিলম্ব (Delivery Delay)</option>
                    <option value="size_exchange">সাইজ পরিবর্তন / এক্সচেঞ্জ (Size Exchange)</option>
                    <option value="product_quality">পণ্যের কাপড়ের মান বা ডিফেক্ট (Quality Issue)</option>
                    <option value="wrong_item">ভুল পণ্য ডেলিভারি হয়েছে (Wrong Item)</option>
                    <option value="payment_issue">পেমেন্ট বা রিফান্ড সংক্রান্ত (Payment Issue)</option>
                    <option value="other">অন্যান্য সাহায্য (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 font-medium mb-1">
                    অভিযোগের বিস্তারিত বিবরণ <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন, যাতে আমরা দ্রুত ব্যবস্থা নিতে পারি..."
                    className="w-full bg-[#181a28] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl gold-gradient-btn text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
                >
                  অভিযোগ সাবমিট করুন
                </button>
              </form>
            )}
          </div>
        )}

        {/* View 2: Track Complaint Status */}
        {activeView === 'track' && (
          <div className="space-y-4">
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="অভিযোগ আইডি (যেমন: CMP-2026-901) বা ফোন নম্বর"
                className="flex-1 bg-[#181a28] border border-white/10 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl gold-gradient-btn text-xs font-bold flex items-center gap-1.5"
              >
                <Search size={14} />
                <span>খুঁজুন</span>
              </button>
            </form>

            {hasSearched && (
              <div>
                {foundComplaint ? (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[#ffd700] text-sm">
                        {foundComplaint.complaintId}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold uppercase">
                        স্ট্যাটাস: {foundComplaint.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-400">গ্রাহকের নাম: <span className="text-white font-medium">{foundComplaint.customerName}</span></p>
                      {foundComplaint.orderId && (
                        <p className="text-gray-400">সম্পর্কিত অর্ডার: <span className="text-amber-200">{foundComplaint.orderId}</span></p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                      <p className="text-gray-400 text-[11px] mb-1">অভিযোগের বিবরণ:</p>
                      <p className="text-gray-200">{foundComplaint.message}</p>
                    </div>

                    {foundComplaint.adminNotes && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200">
                        <p className="font-bold flex items-center gap-1 text-[11px] text-emerald-300">
                          <CheckCircle2 size={13} /> এডমিন সমাধান / আপডেট:
                        </p>
                        <p className="mt-1">{foundComplaint.adminNotes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    কোনো অভিযোগ পাওয়া যায়নি। অনুগ্রহ করে সঠিক Complaint ID বা মোবাইল নম্বর লিখুন।
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
