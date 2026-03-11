import React, { useState, useMemo } from 'react';
import FeedItem from '../components/FeedItem';
import { Product, User } from '../types';
import { SlidersHorizontal, Repeat, X, Ruler, Sparkles, Zap } from 'lucide-react';

interface FeedProps {
  products: Product[];
  wishlistIds: Set<string>;
  onProductSelect: (p: Product) => void;
  onToggleWishlist: (e: React.MouseEvent, id: string) => void;
  onViewProfile?: (user: User) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Thrashed', 'Distressed'];
const CATEGORIES = ['All', 'Flip-Ready', 'Y2K', 'Vintage', 'Gorpcore', 'Streetwear', 'Knitwear', 'Denim'];

// Gradient ring styles that cycle for story avatars — gives visual variety
const RING_STYLES = [
  'bg-gradient-to-br from-brand-orange to-brand-neon',
  'bg-gradient-to-br from-brand-blue to-brand-green',
  'bg-gradient-to-br from-[#FF6B35] to-[#FF0080]',
  'bg-gradient-to-br from-brand-neon to-brand-blue',
  'bg-white/20',
];

const Feed: React.FC<FeedProps> = ({ products, wishlistIds, onProductSelect, onToggleWishlist, onViewProfile }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [onlyFlipReady, setOnlyFlipReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  // Unique sellers for the stories row
  const storySellers = useMemo(() => {
    const seen = new Set<string>();
    return products
      .map(p => p.owner)
      .filter(owner => {
        if (seen.has(owner.id)) return false;
        seen.add(owner.id);
        return true;
      })
      .slice(0, 8);
  }, [products]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (activeCategory !== 'All') {
        const catLower = activeCategory.toLowerCase();
        const matchesCat =
          p.tags.some(t => t.toLowerCase().includes(catLower)) ||
          (activeCategory === 'Flip-Ready' && p.tags.includes('flip-ready'));
        if (!matchesCat) return false;
      }
      if (p.price > maxPrice) return false;
      if (onlyFlipReady && !p.tags.includes('flip-ready')) return false;
      if (selectedSize) {
        if (selectedSize === 'OS') {
          if (!['OS', 'One Size', 'Free Size'].includes(p.specs.size)) return false;
        } else {
          if (p.specs.size !== selectedSize && !p.specs.size.includes(selectedSize)) return false;
        }
      }
      if (selectedCondition) {
        if (!p.specs.condition.toLowerCase().includes(selectedCondition.toLowerCase())) return false;
      }
      return true;
    });
  }, [products, activeCategory, maxPrice, onlyFlipReady, selectedSize, selectedCondition]);

  const clearFilters = () => {
    setMaxPrice(10000);
    setOnlyFlipReady(false);
    setSelectedSize(null);
    setSelectedCondition(null);
  };

  const hasActiveFilters = maxPrice < 10000 || onlyFlipReady || selectedSize || selectedCondition;

  return (
    <div className="pb-32 min-h-screen">

      {/* Compact Sticky Header */}
      <div className="sticky top-0 z-20 bg-brand-black/90 backdrop-blur-xl border-b border-white/5">
        <div
          className="flex justify-between items-center px-4 py-3"
          style={{ paddingTop: 'max(0.75rem, calc(env(safe-area-inset-top) + 0.25rem))' }}
        >
          <div className="flex items-baseline gap-0">
            <span className="text-[26px] font-display font-black tracking-tighter text-white leading-none">our</span>
            <span className="text-[26px] font-display font-black tracking-tighter text-brand-orange leading-none">FIT</span>
            <span className="text-[9px] text-gray-600 font-mono uppercase ml-2 mb-0.5 self-end">BLR • IND</span>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[10px] text-brand-orange font-bold uppercase tracking-wider bg-brand-orange/10 border border-brand-orange/20 px-2 py-1 rounded-full"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-full border transition-all duration-300 ${
                showFilters
                  ? 'bg-brand-orange text-black border-brand-orange shadow-[0_0_12px_rgba(255,107,53,0.4)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {showFilters ? <X size={17} /> : <SlidersHorizontal size={17} />}
            </button>
          </div>
        </div>

        {/* Category Pills — inside the sticky header for always-visible access */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3 pt-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 border transition-all duration-200 font-bold text-[10px] uppercase whitespace-nowrap rounded-full ${
                activeCategory === cat
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                  : 'bg-transparent border-white/15 text-gray-400 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">

        {/* Filter Panel */}
        {showFilters && (
          <div className="glass-panel rounded-2xl p-5 mt-4 mb-1 animate-in slide-in-from-top-4 duration-300 shadow-xl shadow-black/50 border border-white/10">
            <div className="flex flex-col gap-6">
              {/* Flip Ready Toggle */}
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${onlyFlipReady ? 'bg-brand-blue/20 text-brand-blue' : 'bg-white/5 text-gray-400'}`}>
                    <Repeat size={18} />
                  </div>
                  <div>
                    <span className="block font-bold uppercase text-sm tracking-wider">Flip Ready</span>
                    <span className="text-[10px] text-gray-500 font-mono">Show upcyclable items only</span>
                  </div>
                </div>
                <button
                  onClick={() => setOnlyFlipReady(!onlyFlipReady)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${onlyFlipReady ? 'bg-brand-blue' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${onlyFlipReady ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="h-px bg-white/10 w-full" />

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase">
                  <span className="text-gray-400">Max Price</span>
                  <span className="text-brand-orange bg-brand-orange/10 px-2 py-1 rounded border border-brand-orange/20 font-mono text-sm">
                    ₹{maxPrice < 10000 ? maxPrice : '10,000+'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                />
              </div>

              {/* Size Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase text-gray-400">
                  <Ruler size={14} /> Size
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase text-gray-400">
                  <Sparkles size={14} /> Condition
                </div>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map(cond => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(selectedCondition === cond ? null : cond)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedCondition === cond
                          ? 'bg-brand-orange text-black border-brand-orange'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="text-xs uppercase font-bold text-gray-500 hover:text-white mt-2 border-t border-white/10 pt-4 text-left"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* Seller Stories Row */}
        {storySellers.length > 0 && (
          <div className="mt-5 mb-1">
            <div className="flex items-center gap-1.5 mb-3">
              <Zap size={11} className="text-brand-neon" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Active Sellers</span>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {storySellers.map((seller, i) => (
                <button
                  key={seller.id}
                  onClick={() => onViewProfile?.(seller)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
                >
                  <div className={`p-[2px] rounded-full ${RING_STYLES[i % RING_STYLES.length]}`}>
                    <img
                      src={seller.avatar}
                      className="w-[52px] h-[52px] rounded-full object-cover bg-gray-800 border-[2.5px] border-brand-black"
                      alt={seller.handle}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 w-[60px] text-center truncate">
                    @{seller.handle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between mt-5 mb-4">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'fit' : 'fits'}
          </span>
          {activeCategory !== 'All' && (
            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full font-bold uppercase text-gray-400">
              {activeCategory}
            </span>
          )}
        </div>

        {/* Masonry Grid */}
        {filteredProducts.length > 0 ? (
          <div className="columns-2 gap-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="break-inside-avoid mb-3">
                <FeedItem
                  product={product}
                  onClick={onProductSelect}
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onProfileClick={onViewProfile}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 opacity-40">
            <p className="font-mono text-sm">No fits found.</p>
            <p className="text-xs mt-2 text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
