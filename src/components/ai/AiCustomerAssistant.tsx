import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X, Send, Bot, Sparkles, Phone, Facebook } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  orderCard?: {
    orderNumber: string;
    customerName: string;
    status: string;
    total: number;
    itemsCount: number;
  };
}

export const AiCustomerAssistant: React.FC = () => {
  const { products, storeSettings, findOrderByIdOrNumber } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'আসসালামু আলাইকুম! অনলাইন ড্রেস মার্ট (Online Dress Mart) এ আপনাকে স্বাগতম। ✨\n\nআমি আপনার স্মার্ট অ্যাসিস্ট্যান্ট। পোশাকের সাইজ, দাম, নতুন কালেকশন, ডেলিভারি নিয়ম বা আপনার অর্ডারের স্ট্যাটাস জানতে আমাকে যে কোনো প্রশ্ন করতে পারেন।',
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'ডেলিভারি চার্জ কত?',
    'অর্ডার করার নিয়ম কী?',
    'শাড়ির কালেকশন ও দাম',
    'হটলাইন ও WhatsApp নম্বর',
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setInput('');
    setIsTyping(true);

    // 1. ORDER STATUS CHECK: Inspect query for Order ID patterns (e.g. ODM-2026-XXXX or numbers)
    const orderMatch = textToSend.match(/ODM[-_0-9]+/i) || textToSend.match(/\b\d{4,11}\b/);
    if (
      textToSend.includes('অর্ডার') ||
      textToSend.includes('order') ||
      textToSend.includes('স্ট্যাটাস') ||
      textToSend.includes('status') ||
      orderMatch
    ) {
      if (orderMatch) {
        const foundOrder = findOrderByIdOrNumber(orderMatch[0]);
        if (foundOrder) {
          setTimeout(() => {
            const statusBn =
              foundOrder.status === 'delivered'
                ? 'ডেলিভারি সম্পন্ন (Delivered)'
                : foundOrder.status === 'shipped'
                ? 'ডেলিভারির জন্য কুরিয়ারে পাঠানো হয়েছে (Shipped)'
                : foundOrder.status === 'processing'
                ? 'পণ্য প্রস্তুত করা হচ্ছে (Processing)'
                : foundOrder.status === 'confirmed'
                ? 'অর্ডার নিশ্চিত হয়েছে (Confirmed)'
                : 'অপেক্ষমান (Pending)';

            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: 'assistant',
                text: `আপনার অর্ডার নম্বর ${foundOrder.orderNumber} এর বর্তমান স্ট্যাটাস: ${statusBn}।\n\nগ্রাহকের নাম: ${foundOrder.customerName}\nঠিকানা: ${foundOrder.deliveryAddress}\nমোট প্রদেয়: ৳${foundOrder.total}\nপেমেন্ট: ${foundOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : foundOrder.paymentMethod}`,
                timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
                orderCard: {
                  orderNumber: foundOrder.orderNumber,
                  customerName: foundOrder.customerName,
                  status: statusBn,
                  total: foundOrder.total,
                  itemsCount: foundOrder.items.length,
                },
              },
            ]);
            setIsTyping(false);
          }, 600);
          return;
        } else {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                sender: 'assistant',
                text: `দুঃখিত, "${orderMatch[0]}" নম্বরের কোনো অর্ডার আমাদের সিস্টেমে খুঁজে পাওয়া যায়নি।\n\nঅনুগ্রহ করে সঠিক অর্ডার আইডি চেক করুন অথবা সরাসরি আমাদের এডমিন/হটলাইনে যোগাযোগ করুন: 01897514604 বা WhatsApp এ মেসেজ দিন।`,
                timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            setIsTyping(false);
          }, 600);
          return;
        }
      } else if (textToSend.includes('অর্ডার') && (textToSend.includes('কোথায়') || textToSend.includes('স্ট্যাটাস'))) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'assistant',
              text: 'আপনার অর্ডারের সঠিক তথ্য জানতে অনুগ্রহ করে আপনার Order ID (যেমন: ODM-2026-XXXX) অথবা যে মোবাইল নম্বর দিয়ে অর্ডার করেছেন তা লিখে পাঠান। আমি আমাদের অর্ডার ডেটাবেস থেকে সঠিক তথ্য জানিয়ে দিচ্ছি।',
              timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsTyping(false);
        }, 500);
        return;
      }
    }

    // 2. Call backend proxy or intelligent grounded knowledge responder
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          catalog: products.slice(0, 8).map((p) => ({
            code: p.code,
            name: p.bengaliName,
            price: p.discountPrice || p.price,
            category: p.category,
            sizes: p.availableSizes,
            stock: p.stock,
          })),
          storeInfo: {
            hotline: storeSettings.hotline,
            whatsapp: storeSettings.whatsapp,
            facebook: storeSettings.facebookUrl,
            dhakaFee: storeSettings.deliveryInsideDhaka,
            outsideFee: storeSettings.deliveryOutsideDhaka,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'assistant',
              text: data.reply,
              timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Grounded client-side fallback if server API is unavailable
    setTimeout(() => {
      let botReply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('ডেলিভারি') || lower.includes('চার্জ') || lower.includes('shipping')) {
        botReply = `আমাদের ডেলিভারি চার্জ:\n• ঢাকা সিটির ভেতরে: ৳${storeSettings.deliveryInsideDhaka} (২-৩ দিনে ডেলিভারি)\n• ঢাকা উপশহর/সাভার/গাজীপুর: ৳${storeSettings.deliverySubDhaka}\n• ঢাকার বাইরে সারাদেশে: ৳${storeSettings.deliveryOutsideDhaka} (৩-৫ দিনে ডেলিভারি)\n\n৳${storeSettings.freeDeliveryThreshold} বা তার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!`;
      } else if (lower.includes('অর্ডার') || lower.includes('how to order') || lower.includes('নিয়ম')) {
        botReply = `অর্ডার করার নিয়ম অত্যন্ত সহজ:\n১. পছন্দের পোশাক সিলেক্ট করে "কার্টে নিন" বা "সরাসরি অর্ডার করুন" বাটনে চাপুন।\n২. সাইজ ও কালার পছন্দ করুন।\n৩. আপনার নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা লিখে অর্ডার সাবমিট করুন।\n৪. আপনি ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ) বা বিকাশ/নগদে মূল্য পরিশোধ করতে পারেন।`;
      } else if (lower.includes('শাড়ি') || lower.includes('saree')) {
        botReply = `আমাদের কাছে রয়েছে এক্সক্লুসিভ পিওর কাতান সিল্ক ও ট্র্যাডিশনাল জামদানি শাড়ি কালেকশন। শাড়ির মূল্য ৳৩,৯৫০ থেকে শুরু। প্রতিটি শাড়ির সাথে ম্যাচিং ব্লাউজ পিস রয়েছে।`;
      } else if (lower.includes('থ্রি-পিস') || lower.includes('three piece')) {
        botReply = `আমাদের পাকিস্তানি ও জয়পুরী ভারী এমব্রয়ডারি জর্জেট থ্রি-পিস কালেকশন এভেইলেবল আছে। সাইজ: M, L, XL, XXL। প্রারম্ভিক মূল্য ৳৩,২০০।`;
      } else if (lower.includes('হটলাইন') || lower.includes('ফোন') || lower.includes('যোগাযোগ') || lower.includes('whatsapp')) {
        botReply = `আমাদের সাথে যোগাযোগের তথ্য:\n• হটলাইন কল: ${storeSettings.hotline}\n• WhatsApp: ${storeSettings.whatsapp}\n• Facebook Page: ${storeSettings.facebookUrl}\nসকাল ৯টা থেকে রাত ১১টা পর্যন্ত আমাদের কাস্টমার প্রতিনিধি প্রস্তুত আছেন।`;
      } else {
        botReply = `ধন্যবাদ আপনার বার্তার জন্য! অনলাইন ড্রেস মার্ট (Online Dress Mart) এ রয়েছে প্রিমিয়াম শাড়ি, থ্রি-পিস, লেহেঙ্গা ও কুর্তি। নির্দিষ্ট পোশাক বা তথ্যের জন্য কল করুন ${storeSettings.hotline} নম্বরে অথবা WhatsApp করুন ${storeSettings.whatsapp} নম্বরে।`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-[#916b1e] via-[#d4af37] to-[#ffd700] text-gray-950 shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:scale-110 active:scale-95 transition-all group"
          aria-label="AI Assistant"
        >
          {isOpen ? <X size={24} /> : <Bot size={24} />}

          {!isOpen && (
            <span className="absolute -top-1 -left-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-40 w-[94vw] sm:w-[380px] max-h-[580px] rounded-3xl bg-[#121422] border border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white animate-scaleUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#171a2b] via-[#211f18] to-[#171a2b] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#d4af37]/60 shadow-[0_0_12px_rgba(212,175,55,0.4)] p-[1px] bg-gradient-to-tr from-[#916b1e] via-[#ffdf79] to-[#916b1e] shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Online Dress Mart"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif-luxury text-white flex items-center gap-1.5">
                  <span>ড্রেস মার্ট AI অ্যাসিস্ট্যান্ট</span>
                  <Sparkles size={13} className="text-[#ffd700]" />
                </h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> অনলাইনে সক্রিয়
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Actions Header row */}
          <div className="p-2 bg-[#0c0d15] border-b border-white/5 flex items-center justify-between text-[11px] px-3">
            <a href={`tel:${storeSettings.hotline}`} className="flex items-center gap-1 text-emerald-400 hover:underline">
              <Phone size={12} /> কল: {storeSettings.hotline}
            </a>
            <a
              href={`https://wa.me/88${storeSettings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#25D366] hover:underline"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
            <a
              href={storeSettings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#1877F2] hover:underline"
            >
              <Facebook size={12} /> Facebook
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-[13px] bg-[#10121d]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 font-semibold rounded-br-none'
                      : 'bg-[#1a1d2e] border border-white/10 text-gray-200 rounded-bl-none'
                  }`}
                >
                  {m.text}

                  {/* If order card */}
                  {m.orderCard && (
                    <div className="mt-2.5 p-2 rounded-xl bg-black/40 border border-[#d4af37]/30 text-[11px] text-amber-200 space-y-0.5">
                      <p className="font-bold text-white">অর্ডার বিবরণী:</p>
                      <p>আইডি: {m.orderCard.orderNumber}</p>
                      <p>গ্রাহক: {m.orderCard.customerName}</p>
                      <p className="text-emerald-400 font-bold">স্ট্যাটাস: {m.orderCard.status}</p>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-[#1a1d2e] border border-white/10 w-fit text-gray-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">টাইপ করছে...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#141624] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-amber-200 whitespace-nowrap"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#121422] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="প্রশ্ন বা অর্ডার আইডি লিখুন..."
              className="flex-1 bg-[#1a1d2e] border border-white/10 rounded-xl py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl gold-gradient-btn text-gray-950 disabled:opacity-40 transition-opacity"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
