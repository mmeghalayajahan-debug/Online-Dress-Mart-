import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { sound } from '../../services/sound';
import { X, Mail, Lock, User as UserIcon, Phone, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const PullStringLampLogin: React.FC = () => {
  const { isLampLoginOpen, setIsLampLoginOpen, loginCustomer, loginWithGoogle, registerCustomer, currentUser } = useStore();

  const [isLampOn, setIsLampOn] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const pullStartRef = useRef<number | null>(null);

  // Automatically light up when opened for high delight, but allow pulling anytime
  useEffect(() => {
    if (isLampLoginOpen) {
      const timer = setTimeout(() => {
        setIsLampOn(true);
        sound.playSwitchClick(true);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setIsLampOn(false);
    }
  }, [isLampLoginOpen]);

  // Toggle Lamp switch
  const toggleLamp = useCallback(() => {
    setIsLampOn((prev) => {
      const next = !prev;
      sound.playSwitchClick(next);
      return next;
    });
  }, []);

  // Pointer / Touch handlers for physical pull string
  const handlePointerDown = (clientY: number) => {
    setIsPulling(true);
    pullStartRef.current = clientY;
  };

  const handlePointerMove = (clientY: number) => {
    if (!isPulling || pullStartRef.current === null) return;
    const delta = Math.max(0, Math.min(80, (clientY - pullStartRef.current) * 0.8));
    setPullDistance(delta);
  };

  const handlePointerUp = () => {
    if (isPulling) {
      if (pullDistance > 25) {
        toggleLamp();
      }
      setIsPulling(false);
      setPullDistance(0);
      pullStartRef.current = null;
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await loginWithGoogle();
      setMessage({ text: 'Google অ্যাকাউন্টের মাধ্যমে সফলভাবে লগইন হয়েছে!', type: 'success' });
      setTimeout(() => {
        setIsLampLoginOpen(false);
      }, 900);
    } catch {
      setMessage({ text: 'Google লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setMessage({ text: 'ইমেইল এবং পাসওয়ার্ড দিন', type: 'error' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      loginCustomer(loginEmail);
      setIsLoading(false);
      setMessage({ text: 'স্বাগতম! সফলভাবে লগইন হয়েছে।', type: 'success' });
      setTimeout(() => {
        setIsLampLoginOpen(false);
      }, 800);
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      setMessage({ text: 'সবগুলো তথ্য সঠিকভাবে পূরণ করুন', type: 'error' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      registerCustomer(regName, regEmail, regPhone);
      setIsLoading(false);
      setMessage({ text: 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', type: 'success' });
      setTimeout(() => {
        setIsLampLoginOpen(false);
      }, 800);
    }, 400);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setMessage({ text: 'আপনার ইমেইল অ্যাড্রেস লিখুন', type: 'error' });
      return;
    }
    setMessage({ text: `পাসওয়ার্ড রিসেট লিংক ${forgotEmail} এ পাঠানো হয়েছে!`, type: 'success' });
    setTimeout(() => setTab('login'), 2000);
  };

  if (!isLampLoginOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto px-4 py-6 transition-all duration-700 ${
        isLampOn
          ? 'bg-[#0a0a0f]/95 backdrop-blur-md'
          : 'bg-[#050508]/98'
      }`}
      onMouseMove={(e) => handlePointerMove(e.clientY)}
      onMouseUp={handlePointerUp}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientY)}
      onTouchEnd={handlePointerUp}
    >
      {/* Close button */}
      <button
        onClick={() => setIsLampLoginOpen(false)}
        className="absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Atmospheric Lamp Light Beam effect when ON */}
      {isLampOn && (
        <div
          className="pointer-events-none absolute top-32 left-1/2 -translate-x-1/2 w-[340px] sm:w-[620px] h-[550px] transition-opacity duration-700 opacity-90"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.42) 0%, rgba(255, 180, 50, 0.18) 45%, rgba(0,0,0,0) 75%)',
          }}
        />
      )}

      {/* ===================== THE PULL STRING LAMP ===================== */}
      <div className="relative flex flex-col items-center select-none pt-2 shrink-0">
        {/* Ceiling cord / fixture */}
        <div className="w-1.5 h-10 bg-gradient-to-b from-[#2a2720] via-[#524424] to-[#8c7438]" />

        {/* Vintage metallic lamp socket & hood */}
        <div className="relative flex flex-col items-center">
          {/* Socket Cap */}
          <div className="w-9 h-3.5 bg-gradient-to-r from-[#44381e] via-[#c5a059] to-[#44381e] rounded-t-sm shadow-md" />

          {/* Lampshade Cone */}
          <div
            className="w-28 sm:w-36 h-12 rounded-t-xl transition-all duration-300"
            style={{
              background: isLampOn
                ? 'linear-gradient(180deg, #2b2314 0%, #17140e 60%, #4a3614 100%)'
                : 'linear-gradient(180deg, #1c1a16 0%, #0e0d0c 100%)',
              borderBottom: isLampOn ? '2px solid #ffdf7a' : '2px solid #5a4b27',
              boxShadow: isLampOn ? '0 8px 30px rgba(230, 180, 50, 0.35)' : 'none',
            }}
          />

          {/* Light Bulb */}
          <div className="relative -mt-1 flex items-center justify-center">
            <div
              className={`w-10 h-10 rounded-full transition-all duration-500 flex items-center justify-center ${
                isLampOn
                  ? 'bg-gradient-to-b from-[#fff6d1] via-[#ffd24d] to-[#ffaa00] lamp-glowing'
                  : 'bg-white/10 border border-white/20'
              }`}
            >
              {/* Internal Filament */}
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  isLampOn
                    ? 'bg-white shadow-[0_0_12px_#ffffff]'
                    : 'bg-[#403828] border border-[#5c4a2c]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* The Hanging Pull String & Cord Bead */}
        <div className="relative flex flex-col items-center pt-1">
          {/* Cord Line */}
          <div
            className="w-[2px] bg-gradient-to-b from-[#b39147] via-[#e6c26b] to-[#b39147] transition-all"
            style={{
              height: `${48 + pullDistance}px`,
              transition: isPulling ? 'none' : 'height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Brass Pull Bead / Bell */}
          <button
            type="button"
            onMouseDown={(e) => handlePointerDown(e.clientY)}
            onTouchStart={(e) => handlePointerDown(e.touches[0].clientY)}
            onClick={toggleLamp}
            title={isLampOn ? 'Pull to turn OFF' : 'Pull to turn ON'}
            className="group relative flex flex-col items-center cursor-grab active:cursor-grabbing focus:outline-none"
            style={{
              transform: `translateY(${pullDistance * 0.15}px)`,
              transition: isPulling ? 'none' : 'transform 0.3s ease',
            }}
          >
            {/* Upper small bead */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#dfb755] border border-[#775a20] shadow-sm" />
            {/* Lower weighted brass bell */}
            <div className="w-4 h-6 rounded-b-lg rounded-t-sm bg-gradient-to-b from-[#fad575] via-[#c69a30] to-[#7a5812] border border-[#ffea9f]/40 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>

            {/* Interactive hint badge */}
            <div className="absolute top-8 whitespace-nowrap text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded-full bg-[#1e2029]/90 text-[#e6c367] border border-[#e6c367]/30 shadow-md animate-bounce pointer-events-none">
              {isLampOn ? '🏮 দড়ি টানুন (বন্ধ করতে)' : '✨ দড়ি টেনে বাতি জ্বালান (Login)'}
            </div>
          </button>
        </div>
      </div>

      {/* ===================== THE GLASSMORPHISM LOGIN CARD ===================== */}
      <div
        className={`w-full max-w-md mt-14 mb-8 transition-all duration-500 transform ${
          isLampOn
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
        }`}
      >
        <div className="relative rounded-2xl p-6 sm:p-8 bg-[#12141f]/85 backdrop-blur-xl border border-[#d4af37]/35 shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(212,175,55,0.18)]">
          {/* Card Top Brand Heading with Official Logo */}
          <div className="text-center mb-6">
            {/* Official Logo Display */}
            <div className="inline-block relative mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.55)] border-2 border-[#d4af37] p-[2px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e] animate-pulse">
                <img
                  src="/logo.jpg"
                  alt="Online Dress Mart Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center justify-center gap-1.5">
              <Sparkles size={13} className="text-[#ffd700]" /> Online Dress Mart
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-white mt-1">
              {tab === 'login' && 'স্বাগতম (Welcome)'}
              {tab === 'register' && 'নতুন অ্যাকাউন্ট তৈরি করুন'}
              {tab === 'forgot' && 'পাসওয়ার্ড রিসেট'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {tab === 'login' && 'লগইন করে আপনার প্রিয় পোশাক অর্ডার করুন'}
              {tab === 'register' && 'মাত্র কয়েক সেকেন্ডে আপনার অ্যাকাউন্ট তৈরি করুন'}
              {tab === 'forgot' && 'আপনার নিবন্ধিত ইমেইল অ্যাড্রেস লিখুন'}
            </p>
          </div>

          {/* Feedback messages */}
          {message && (
            <div
              className={`mb-5 p-3 rounded-lg text-xs sm:text-sm flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}
            >
              {message.type === 'success' && <CheckCircle2 size={16} className="shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Current Logged In Info */}
          {currentUser && (
            <div className="mb-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-gray-400">বর্তমান লগইন অ্যাকাউন্ট:</p>
              <p className="text-sm font-semibold text-[#ffd700]">{currentUser.name} ({currentUser.email})</p>
              <button
                type="button"
                onClick={() => {
                  useStore().logout();
                  setMessage({ text: 'লগআউট সফল হয়েছে', type: 'success' });
                }}
                className="mt-2 text-xs text-red-400 hover:underline"
              >
                লগআউট করুন
              </button>
            </div>
          )}

          {/* Google / Gmail Instant Sign-in Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-100 active:scale-[0.98] transition-all shadow-md"
            >
              {/* Google official SVG logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'প্রসেসিং...' : 'Continue with Google / Gmail'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#12141f] px-3 text-gray-400">অথবা ইমেইল দিয়ে</span>
              </div>
            </div>
          </div>

          {/* Form Tabs */}
          {tab !== 'forgot' && (
            <div className="flex border-b border-white/10 mb-5">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-sm font-semibold transition-colors border-b-2 ${
                  tab === 'login'
                    ? 'border-[#d4af37] text-[#ffd700]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                লগইন (Sign In)
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 py-2 text-sm font-semibold transition-colors border-b-2 ${
                  tab === 'register'
                    ? 'border-[#d4af37] text-[#ffd700]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                রেজিস্টার (Register)
              </button>
            </div>
          )}

          {/* Tab 1: Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1.5">ইমেইল অ্যাড্রেস</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-300 font-medium">পাসওয়ার্ড</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffd700] transition-colors"
                    title={showLoginPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl gold-gradient-btn text-sm font-bold shadow-lg"
              >
                {isLoading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>
          )}

          {/* Tab 2: Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">পূর্ণ নাম</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="আপনার নাম লিখুন"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">ইমেইল</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ffd700] transition-colors"
                    title={showRegPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl gold-gradient-btn text-sm font-bold shadow-lg"
              >
                {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
              </button>
            </form>
          )}

          {/* Tab 3: Forgot Password */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 font-medium mb-1.5">আপনার ইমেইল অ্যাড্রেস</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gold-gradient-btn text-sm font-bold shadow-lg"
              >
                রিসেট লিংক পাঠান
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  ← লগইন পেজে ফিরে যান
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
