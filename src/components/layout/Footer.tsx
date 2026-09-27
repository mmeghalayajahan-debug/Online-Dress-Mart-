import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, MessageCircle, Facebook, Sparkles, HelpCircle, Shield, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeSettings, setSelectedCategory, setIsComplaintOpen, setIsAdminOpen, setIsLampLoginOpen } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#090a10] border-t border-[#d4af37]/25 text-white pt-12 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] shrink-0 p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e] group-hover:scale-105 transition-transform">
                <img
                  src="/logo.jpg"
                  alt="Online Dress Mart Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-serif-luxury text-xl font-black gold-gradient-text tracking-wider block leading-none">
                  ONLINE DRESS MART
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 block mt-0.5">
                  Curated Fashion Boutique
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              অভিজাত কাতান শাড়ি, মনোহর জামদানি, ভারী কারুকাজের ডিজাইনার থ্রি-পিস ও প্রিমিয়াম লেহেঙ্গার বিশ্বস্ত অনলাইন ডেস্টিনেশন।
            </p>

            {/* Social Media & Contact Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeSettings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 text-[#1877F2] flex items-center justify-center transition-all hover:scale-105"
                title="Facebook Page"
              >
                <Facebook size={18} />
              </a>

              <a
                href={`https://wa.me/88${storeSettings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center transition-all hover:scale-105"
                title="WhatsApp Chat"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href={`tel:${storeSettings.hotline}`}
                className="w-10 h-10 rounded-full bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-all hover:scale-105"
                title="Direct Phone Call"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#ffd700]">
              পোশাক ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Saree');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  এক্সক্লুসিভ শাড়ি কালেকশন (কাতান ও জামদানি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Three Piece');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  ডিজাইনার পার্টি থ্রি-পিস
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Lehenga');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  ব্রাইডাল ও পার্টি লেহেঙ্গা
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Kurti');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  ক্যাজুয়াল ও ফ্যাশনেবল কুর্তি
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Abaya & Hijab');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  দুবাই নিদা ফ্যাব্রিক আবায়া সেট
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Help */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#ffd700]">
              কাস্টমার সাপোর্ট
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => setIsComplaintOpen(true)}
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle size={14} className="text-amber-400" />
                  <span>অভিযোগ ও সাপোর্ট বক্স (Complaint Box)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsLampLoginOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  লগইন ও অ্যাকাউন্ট (Pull String Lamp)
                </button>
              </li>
              <li>
                <span className="text-gray-300">ডেলিভারি সময়: ঢাকা ২-৩ দিন, সারাদেশে ৩-৫ দিন</span>
              </li>
              <li>
                <span className="text-gray-300">পেমেন্ট: ক্যাশ অন ডেলিভারি / বিকাশ / নগদ</span>
              </li>
            </ul>
          </div>

          {/* Hotline & Official Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#ffd700]">
              সরাসরি যোগাযোগ
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <span>হটলাইন: <a href={`tel:${storeSettings.hotline}`} className="font-bold text-white hover:underline">{storeSettings.hotline}</a></span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#25D366] shrink-0" />
                <span>WhatsApp: <a href={`https://wa.me/88${storeSettings.whatsapp}`} className="font-bold text-white hover:underline">{storeSettings.whatsapp}</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Facebook size={14} className="text-[#1877F2] shrink-0" />
                <span>Facebook Page: <a href={storeSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">Online Dress Mart</a></span>
              </p>
              <p className="flex items-center gap-2 text-gray-400 pt-1">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span>ঢাকা, বাংলাদেশ (সারা দেশে হোম ডেলিভারি)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright and admin gateway */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Online Dress Mart. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-gray-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Shield size={13} />
              <span>এডমিন এক্সেস (Admin Portal)</span>
            </button>
            <span>·</span>
            <span>১০০% নিরাপদ ও সুরক্ষিত কেনাকাটা</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
