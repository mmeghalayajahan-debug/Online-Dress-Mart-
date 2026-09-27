import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, MessageCircle, Facebook, Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { storeSettings, setSelectedCategory, setIsLampLoginOpen, currentUser } = useStore();

  const scrollToProducts = () => {
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#10121d] via-[#0d0e17] to-[#0c0d12] pt-6 pb-12 sm:pt-10 sm:pb-20 border-b border-white/5">
      {/* Background ambient gold lighting glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#ff8800]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Brand copy, CTAs, Highlights */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Official Logo & Brand Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37]/25 via-[#b8861d]/15 to-[#d4af37]/10 border border-[#d4af37]/40 text-[#ffd700] text-xs font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-[#d4af37] shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Online Dress Mart"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <Sparkles size={13} className="text-[#ffd700]" />
              <span>Online Dress Mart · অফিসিয়াল ফেসবুক পেজ স্টোর</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif-luxury tracking-tight text-white leading-tight">
              অনলাইন ড্রেস মার্ট <br />
              <span className="gold-gradient-text">এক্সক্লুসিভ ফ্যাশন সম্ভার</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              অভিজাত কাতান ও জামদানি শাড়ি, ভারী কারুকাজের ডিজাইনার থ্রি-পিস, রাজকীয় ব্রাইডাল লেহেঙ্গা এবং আরামদায়ক কুর্তির প্রিমিয়াম কালেকশন।
            </p>

            {/* Action Buttons: Order Now, Call, WhatsApp, Facebook */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={scrollToProducts}
                className="px-6 py-3.5 rounded-full gold-gradient-btn text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                <span>পোশাক দেখুন ও অর্ডার করুন</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`tel:${storeSettings.hotline}`}
                className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Phone size={16} className="text-emerald-400" />
                <span>সরাসরি কল: {storeSettings.hotline}</span>
              </a>

              <a
                href={`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent('Hello Online Dress Mart, I want to order a dress.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
              >
                <MessageCircle size={17} />
                <span>WhatsApp অর্ডার</span>
              </a>

              <a
                href={storeSettings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-full bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 text-[#1877F2] text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
              >
                <Facebook size={17} />
                <span>Facebook Page</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Truck size={16} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">হোম ডেলিভারি</h4>
                  <p className="text-[11px] text-gray-400">সারা দেশে ৩-৫ দিনে</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">ক্যাশ অন ডেলিভারি</h4>
                  <p className="text-[11px] text-gray-400">পণ্য দেখে মূল্য পরিশোধ</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <RotateCcw size={16} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">সহজ এক্সচেঞ্জ</h4>
                  <p className="text-[11px] text-gray-400">সাইজ পরিবর্তন সুবিধা</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Main Featured Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85"
                  alt="Exclusive Saree Collection"
                  className="w-full h-[420px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/20 to-transparent" />

                {/* Floating promo badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  🔥 বৈশাখী মেগা অফার ২৫% ছাড়
                </div>

                {/* Pull-String Lamp Login teaser badge on the card */}
                {!currentUser && (
                  <button
                    onClick={() => setIsLampLoginOpen(true)}
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-[#d4af37]/60 text-amber-200 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-black/80 transition-all flex items-center gap-1.5"
                  >
                    <span>🏮 ল্যাম্প টেনে লগইন করুন</span>
                  </button>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-amber-300 uppercase tracking-wider font-semibold">
                        Pure Katan Silk Edition
                      </p>
                      <h3 className="text-base font-bold text-white font-serif-luxury">
                        রয়্যাল ক্রিমসন কাতান শাড়ি
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through">৳৪,৮৫০</span>
                      <p className="text-lg font-extrabold text-[#ffd700]">৳৩,৯৫০</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('Saree');
                      scrollToProducts();
                    }}
                    className="w-full mt-3 py-2 rounded-xl gold-gradient-btn text-xs font-bold"
                  >
                    শাড়ি কালেকশন দেখুন
                  </button>
                </div>
              </div>

              {/* Secondary Floating Mini Card */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-[#141724]/90 backdrop-blur-xl border border-[#d4af37]/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1583391733975-dd4d445258f2?auto=format&fit=crop&w=200&q=80"
                  alt="Pakistani Three-Piece"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-white">ডিজাইনার থ্রি-পিস</p>
                  <p className="text-[11px] text-[#ffd700] font-semibold">৳৩,২০০ থেকে শুরু</p>
                  <span className="text-[10px] text-emerald-400">স্টক সীমিত</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
