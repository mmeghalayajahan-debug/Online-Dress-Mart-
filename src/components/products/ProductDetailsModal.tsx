import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ZoomIn
} from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCheckoutOpen, storeSettings } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setSelectedSize(selectedProduct.availableSizes[0] || 'Free Size');
      setSelectedColor(selectedProduct.availableColors[0] || { name: 'Standard', hex: '#000000' });
      setQuantity(1);
      setIsZoomed(false);
      setAddedToast(false);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const currentPrice = selectedProduct.discountPrice || selectedProduct.price;
  const discountPercent = selectedProduct.discountPrice
    ? Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)
    : 0;

  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (!selectedColor) return;
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = () => {
    if (!selectedColor) return;
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppChat = () => {
    const text = `আসসালামু আলাইকুম, আমি অনলাইন ড্রেস মার্ট থেকে অর্ডার করতে চাই:\n\nপোশাক: ${selectedProduct.bengaliName} (${selectedProduct.name})\nকোড: ${selectedProduct.code}\nসাইজ: ${selectedSize}\nকালার: ${selectedColor?.name}\nপরিমাণ: ${quantity} টি\nমূল্য: ৳${currentPrice * quantity}\n\nদয়া করে ডেলিভারির বিস্তারিত জানাবেন।`;
    window.open(`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Container Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#121422] border border-[#d4af37]/30 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-5 sm:p-8 text-white my-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Added to cart toast alert */}
        {addedToast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-500 text-gray-950 font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 animate-bounce">
            <Check size={18} />
            <span>সফলভাবে কার্টে যোগ করা হয়েছে!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Big Image Gallery & Zoom */}
          <div className="md:col-span-6 flex flex-col gap-3">
            {/* Main Interactive Zoom Box */}
            <div
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMoveZoom}
            >
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className={`h-full w-full object-cover object-top transition-transform duration-200 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />

              {/* Zoom hint badge */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-gray-300 flex items-center gap-1.5 pointer-events-none">
                <ZoomIn size={13} className="text-[#ffd700]" />
                <span className="hidden sm:inline">কার্সার রেখে জুম করুন</span>
                <span className="sm:hidden">ট্যাপ করে ছবি দেখুন</span>
              </div>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {discountPercent}% ছাড়
                </div>
              )}
            </div>

            {/* Thumbnail Selector */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 scale-105'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Selectors, CTAs */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Product Code & Category */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#d4af37]/15 text-[#ffd700] font-semibold border border-[#d4af37]/30">
                  {selectedProduct.category}
                </span>
                <span className="font-mono text-gray-400">কোড: {selectedProduct.code}</span>
              </div>

              {/* Bengali & English Title */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
                  {selectedProduct.bengaliName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{selectedProduct.name}</p>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#ffd700]">
                  ৳{currentPrice.toLocaleString('en-US')}
                </span>
                {selectedProduct.discountPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ৳{selectedProduct.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      (৳{(selectedProduct.price - selectedProduct.discountPrice).toLocaleString('en-US')} সাশ্রয়)
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">স্টক অবস্থা:</span>
                {selectedProduct.stock > 0 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check size={14} /> স্টকে আছে ({selectedProduct.stock} পিস এভেইলেবল)
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">স্টক শেষ (Out of Stock)</span>
                )}
              </div>

              {/* Size Selector */}
              {selectedProduct.availableSizes && selectedProduct.availableSizes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    সাইজ সিলেক্ট করুন (Size):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 font-bold shadow-md'
                            : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {selectedProduct.availableColors && selectedProduct.availableColors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">
                    কালার / রঙ: <span className="text-[#ffd700]">{selectedColor?.name}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {selectedProduct.availableColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                          selectedColor?.name === color.name
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-white font-bold'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">পরিমাণ (Quantity):</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-white/15 rounded-xl bg-white/5 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-base text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-bold text-white min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(selectedProduct.stock || 10, quantity + 1))}
                      className="px-3 py-1.5 text-base text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    মোট: <span className="text-white font-bold">৳{(currentPrice * quantity).toLocaleString('en-US')}</span>
                  </span>
                </div>
              </div>

              {/* Descriptions & Fabric Info */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <p className="text-gray-300 leading-relaxed">
                  {selectedProduct.bengaliDescription || selectedProduct.description}
                </p>
                {selectedProduct.fabric && (
                  <p className="text-amber-200/90">
                    <span className="font-semibold text-white">ফেব্রিক:</span> {selectedProduct.fabric}
                  </p>
                )}
                {selectedProduct.careInstructions && (
                  <p className="text-gray-400">
                    <span className="font-semibold text-white">যত্ন:</span> {selectedProduct.careInstructions}
                  </p>
                )}
              </div>
            </div>

            {/* CTAs: Buy Now, Add to Cart, WhatsApp, Call */}
            <div className="space-y-3 pt-5 border-t border-white/10 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-[#d4af37]/40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag size={16} className="text-[#ffd700]" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 rounded-xl gold-gradient-btn font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-95"
                >
                  সরাসরি অর্ডার করুন
                </button>
              </div>

              {/* Contact Seller via WhatsApp and Direct Call buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp এ অর্ডার</span>
                </button>

                <a
                  href={`tel:${storeSettings.hotline}`}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone size={15} className="text-emerald-400" />
                  <span>কল করুন ({storeSettings.hotline})</span>
                </a>
              </div>

              {/* Guarantee highlights */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 px-1">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-[#ffd700]" /> ক্যাশ অন ডেলিভারি
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" /> ১০০% অরিজিনাল পণ্য
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw size={13} className="text-blue-400" /> এক্সচেঞ্জ গ্যারান্টি
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
