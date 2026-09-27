import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Eye, MessageCircle, Star, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, setIsCheckoutOpen, storeSettings } = useStore();

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.availableSizes[0], product.availableColors[0], 1);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.availableSizes[0], product.availableColors[0], 1);
  };

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentPrice = product.discountPrice || product.price;
    const msg = `আসসালামু আলাইকুম, আমি অনলাইন ড্রেস মার্ট থেকে এই পোশাকটি সম্পর্কে জানতে চাই:\n\nপণ্য: ${product.bengaliName} (${product.name})\nকোড: ${product.code}\nমূল্য: ৳${currentPrice}\nক্যাটাগরি: ${product.category}\n\nএটি কি স্টকে এভেইলেবল আছে?`;
    window.open(`https://wa.me/88${storeSettings.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col rounded-2xl bg-[#141624] border border-white/10 hover:border-[#d4af37]/50 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#10121d]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141624] via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#b8861d] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles size={10} /> নতুন কালেকশন
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              সীমিত স্টক ({product.stock} টি)
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              স্টক আউট
            </span>
          )}
        </div>

        {/* Product Code Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-mono font-medium px-2 py-0.5 rounded">
          {product.code}
        </div>

        {/* Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ShoppingBag size={14} />
            <span>কার্টে নিন</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="p-2 rounded-xl bg-black/80 hover:bg-black text-white border border-white/20 transition-colors"
            title="বিস্তারিত দেখুন"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-medium text-[#d4af37] text-[11px]">{product.category}</span>
            {product.rating && (
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <Star size={12} className="fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-500">({product.reviewsCount})</span>
              </div>
            )}
          </div>

          {/* Product Bengali Title */}
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#ffd700] transition-colors">
            {product.bengaliName || product.name}
          </h3>

          {/* English Subtitle */}
          <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-1 mt-0.5">
            {product.name}
          </p>

          {/* Size options preview */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.availableSizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300"
                >
                  {s}
                </span>
              ))}
              {product.availableSizes.length > 4 && (
                <span className="text-[10px] text-gray-500 self-center">+{product.availableSizes.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 mt-3 border-t border-white/5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-[#ffd700]">
                ৳{product.discountPrice ? product.discountPrice.toLocaleString('en-US') : product.price.toLocaleString('en-US')}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{product.price.toLocaleString('en-US')}
                </span>
              )}
            </div>
            <button
              onClick={handleWhatsAppInquiry}
              className="text-xs text-[#25D366] hover:text-[#28e770] flex items-center gap-1 transition-colors"
              title="WhatsApp এ প্রশ্ন করুন"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <ShoppingBag size={13} className="text-[#ffd700]" />
              <span>কার্টে নিন</span>
            </button>
            <button
              onClick={handleQuickBuy}
              className="py-2 rounded-xl gold-gradient-btn text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              অর্ডার করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
