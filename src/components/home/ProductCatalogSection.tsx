import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Filter, SlidersHorizontal, Sparkles, Flame, Clock } from 'lucide-react';
import { ProductCategory } from '../../types';

export const ProductCatalogSection: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'new' | 'popular'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high' | 'rating'>('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Saree',
    'Three Piece',
    'Lehenga',
    'Kurti',
    'Abaya & Hijab',
    'Gown & Western',
  ];

  // Filtering & Sorting pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Category
      if (selectedCategory !== 'All' && prod.category !== selectedCategory) {
        return false;
      }

      // 2. Active Tab (Featured / New / Popular)
      if (activeTab === 'featured' && !prod.isFeatured) return false;
      if (activeTab === 'new' && !prod.isNewArrival) return false;
      if (activeTab === 'popular' && !prod.isPopular) return false;

      // 3. In stock only
      if (inStockOnly && prod.stock <= 0) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesBnName = prod.bengaliName.toLowerCase().includes(q);
        const matchesCode = prod.code.toLowerCase().includes(q);
        const matchesCategory = prod.category.toLowerCase().includes(q);
        const matchesFabric = prod.fabric?.toLowerCase().includes(q);

        if (!matchesName && !matchesBnName && !matchesCode && !matchesCategory && !matchesFabric) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // default chronological or featured
    });
  }, [products, selectedCategory, activeTab, inStockOnly, searchQuery, sortBy]);

  return (
    <section id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#ffd700]" /> এক্সক্লুসিভ কালেকশন
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury text-white mt-1">
            পছন্দের পোশাক খুঁজে নিন
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            প্রিমিয়াম কোয়ালিটির শাড়ি, থ্রি-পিস, লেহেঙ্গা ও কুর্তির সমাহার
          </p>
        </div>

        {/* Collection Filter Tabs: All, Featured, New Arrivals, Popular */}
        <div className="flex items-center gap-1 p-1 bg-[#141624] rounded-2xl border border-white/10 self-start md:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            সব কালেকশন
          </button>

          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTab === 'featured'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} />
            <span>ফিচার্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTab === 'new'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock size={12} />
            <span>নতুন আগমন</span>
          </button>

          <button
            onClick={() => setActiveTab('popular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
              activeTab === 'popular'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8861d] text-gray-950 font-bold shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame size={12} className="text-amber-400" />
            <span>জনপ্রিয়</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white/15 text-[#ffd700] border border-[#d4af37]'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'All' ? 'সব ক্যাটাগরি' : cat}
            </button>
          ))}
        </div>

        {/* Right Sort & Stock Toggle */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-300">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#ffd700] rounded"
            />
            <span>শুধুমাত্র স্টকে আছে</span>
          </label>

          <div className="flex items-center gap-1.5 bg-[#141624] border border-white/10 rounded-xl px-3 py-1.5">
            <SlidersHorizontal size={13} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="default" className="bg-[#141624] text-white">সর্ট: ডিফল্ট</option>
              <option value="price_low" className="bg-[#141624] text-white">দাম: কম থেকে বেশি</option>
              <option value="price_high" className="bg-[#141624] text-white">দাম: বেশি থেকে কম</option>
              <option value="rating" className="bg-[#141624] text-white">সর্বোচ্চ রেটিং</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Highlight feedback */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300">
          <span>
            খোঁজা হচ্ছে: <strong className="text-[#ffd700]">"{searchQuery}"</strong> ({filteredProducts.length} টি পোশাক পাওয়া গেছে)
          </span>
          <button
            onClick={() => useStore().setSearchQuery('')}
            className="text-[#d4af37] hover:underline"
          >
            সার্চ ফিল্টার বাতিল করুন
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 space-y-3">
          <Filter size={36} className="mx-auto text-gray-500" />
          <h3 className="text-base font-bold text-white">কোনো পোশাকের সাথে মিল পাওয়া যায়নি</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            অনুগ্রহ করে অন্য কোনো ক্যাটাগরি সিলেক্ট করুন অথবা সার্চ কিওয়ার্ড পরিবর্তন করে চেষ্টা করুন।
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              useStore().setSearchQuery('');
              setActiveTab('all');
            }}
            className="mt-2 px-5 py-2 rounded-full gold-gradient-btn text-xs font-bold"
          >
            সব পোশাক দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
