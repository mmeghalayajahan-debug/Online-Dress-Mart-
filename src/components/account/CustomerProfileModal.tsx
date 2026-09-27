import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, User, Phone, MapPin, Package, Clock, CheckCircle2, Truck, AlertCircle, LogOut } from 'lucide-react';
import { OrderStatus } from '../../types';

export const CustomerProfileModal: React.FC = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    currentUser,
    orders,
    complaints,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'complaints'>('orders');

  if (!isProfileOpen || !currentUser) return null;

  // Filter orders matching customer
  const customerOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      (currentUser.phone && o.customerPhone.includes(currentUser.phone))
  );

  const customerComplaints = complaints.filter(
    (c) =>
      c.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      (currentUser.phone && c.customerPhone.includes(currentUser.phone))
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">নতুন</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">অপেক্ষমান (Pending)</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">নিশ্চিত হয়েছে (Confirmed)</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">প্রস্তুত হচ্ছে (Processing)</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1"><Truck size={12} /> ডেলিভারিতে পাঠানো হয়েছে (Shipped)</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> ডেলিভারি সম্পন্ন (Delivered)</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">বাতিল (Cancelled)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#121422] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 sm:p-8 text-white my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Official Store Logo Badge */}
            <div className="w-13 h-13 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0 p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e]">
              <img
                src="/logo.jpg"
                alt="Online Dress Mart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg sm:text-xl font-bold font-serif-luxury text-white">
                  {currentUser.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40 font-semibold">
                  Member
                </span>
              </div>
              <p className="text-xs text-gray-400">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
              title="লগআউট"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 my-5 border-b border-white/10">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#d4af37] text-[#ffd700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Package size={16} />
            <span>আমার অর্ডারসমূহ ({customerOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'complaints'
                ? 'border-[#d4af37] text-[#ffd700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <AlertCircle size={16} />
            <span>অভিযোগ / সাপোর্ট হিস্ট্রি ({customerComplaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#d4af37] text-[#ffd700]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <User size={16} />
            <span>প্রোফাইল তথ্য</span>
          </button>
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {customerOrders.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <Package size={36} className="mx-auto text-gray-500" />
                <p className="text-sm font-semibold text-gray-300">এখনো কোনো অর্ডার নেই</p>
                <p className="text-xs text-gray-500">আপনার পছন্দের পোশাক অর্ডার করুন</p>
              </div>
            ) : (
              customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-[#171929] border border-white/10 hover:border-white/20 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#ffd700]">
                        {ord.orderNumber}
                      </span>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>{getStatusBadge(ord.status)}</div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{item.product.bengaliName}</p>
                          <p className="text-[11px] text-gray-400">
                            সাইজ: {item.selectedSize} · রঙ: {item.selectedColor.name} · পরিমাণ: {item.quantity} টি
                          </p>
                        </div>
                        <span className="font-bold text-[#ffd700]">
                          ৳{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-US')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-gray-400">
                      পেমেন্ট: {ord.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : ord.paymentMethod}
                    </span>
                    <span className="text-sm font-extrabold text-[#ffd700]">
                      মোট: ৳{ord.total.toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Complaints List */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {customerComplaints.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <AlertCircle size={36} className="mx-auto text-gray-500" />
                <p className="text-sm font-semibold text-gray-300">কোনো অভিযোগ জমা দেওয়া নেই</p>
                <p className="text-xs text-gray-500">আপনার কোনো সাহায্য বা জিজ্ঞাসা থাকলে অভিযোগ বক্সে লিখুন</p>
              </div>
            ) : (
              customerComplaints.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#171929] border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#ffd700]">{c.complaintId}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300">{c.message}</p>
                  {c.adminNotes && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                      <span className="font-bold">এডমিন রিপ্লাই:</span> {c.adminNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Customer Profile Info */}
        {activeTab === 'profile' && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs sm:text-sm">
            <div>
              <label className="text-gray-400 block text-xs">পূর্ণ নাম</label>
              <p className="font-bold text-white text-base mt-0.5">{currentUser.name}</p>
            </div>
            <div>
              <label className="text-gray-400 block text-xs">ইমেইল</label>
              <p className="font-semibold text-gray-200 mt-0.5">{currentUser.email}</p>
            </div>
            {currentUser.phone && (
              <div>
                <label className="text-gray-400 block text-xs">মোবাইল</label>
                <p className="font-semibold text-gray-200 mt-0.5">{currentUser.phone}</p>
              </div>
            )}
            <div className="pt-2 text-xs text-gray-400">
              অ্যাকাউন্ট তৈরি হয়েছে: {new Date(currentUser.createdAt).toLocaleDateString('bn-BD')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
