import React, { useMemo, useState } from 'react';
import { Product, FlipStatus, User } from '../types';
import { Zap, Repeat, Heart, Flame } from 'lucide-react';
import { IMG_FALLBACK } from '../constants';

interface FeedItemProps {
  product: Product;
  onClick: (product: Product) => void;
  onProfileClick?: (user: User) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent, id: string) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ product, onClick, onProfileClick, isWishlisted = false, onToggleWishlist }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Deterministic aspect ratio based on product ID
  const aspectRatio = useMemo(() => {
    const charCode = product.id.charCodeAt(product.id.length - 1);
    return charCode % 2 === 0 ? '3/4' : '1/1';
  }, [product.id]);

  // Items with very high aura score get a "HOT" badge
  const isHot = product.auraScore >= 90;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    if (onToggleWishlist) {
      onToggleWishlist(e, product.id);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick(product.owner);
    }
  };

  // Carousel State
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveImageIndex(index);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(product)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(product); } }}
      aria-label={`${product.title} by @${product.owner.handle}, ₹${product.price}`}
      className="brutalist-card mb-4 break-inside-avoid overflow-hidden rounded-none relative group cursor-pointer active:scale-[0.97] transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
    >
      <div className="relative bg-gray-900 group" style={{ aspectRatio }}>
        {/* Skeleton Loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse z-0" />
        )}

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              onLoad={() => { if (idx === 0) setImgLoaded(true); }}
              onError={(e) => {
                setImgLoaded(true);
                const target = e.currentTarget;
                if (target.src !== IMG_FALLBACK) target.src = IMG_FALLBACK;
              }}
              alt={`${product.title} - ${idx + 1}`}
              className="w-full h-full object-cover snap-center flex-shrink-0 grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
        </div>

        {/* Pagination Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === activeImageIndex
                  ? 'bg-brand-orange w-4'
                  : 'bg-white/50 w-1.5'
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={handleHeartClick}
            className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition-colors z-30 active:scale-90"
          >
            <Heart
              size={16}
              className={`transition-all duration-200 ease-out ${isWishlisted ? "fill-brand-orange text-brand-orange" : "text-white"
                } ${isAnimating ? "scale-150" : "scale-100"}`}
            />
          </button>
        )}

        {/* HOT badge for high aura items */}
        {isHot && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-brand-orange text-black text-[9px] font-bold px-2 py-1 uppercase tracking-wider z-20 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <Flame size={10} className="fill-black" />
            HOT
          </div>
        )}

        {/* Status Badge (overrides HOT if sold/upcycling) */}
        {product.status !== FlipStatus.AVAILABLE && (
          <div className="absolute top-2 left-2 bg-brand-black/95 border border-brand-orange text-brand-orange text-[9px] font-bold px-2 py-1 uppercase tracking-wider z-20">
            {product.status.replace('_', ' ')}
          </div>
        )}

        {/* Aura Score */}
        <div className="absolute bottom-2 right-2 bg-brand-glass backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1 z-20">
          <Zap size={10} className="text-brand-orange fill-brand-orange" />
          <span className="text-[10px] font-display font-bold">{product.auraScore}</span>
        </div>

        {/* Hover overlay with quick info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      </div>

      <div className="p-3">
        <h3 className="font-display font-bold text-base leading-tight uppercase truncate">{product.title}</h3>
        <div className="flex justify-between items-end mt-1.5">
          <button
            onClick={handleProfileClick}
            className="text-gray-500 text-[11px] font-mono hover:text-brand-orange transition-colors z-10 truncate max-w-[100px]"
          >
            @{product.owner.handle}
          </button>
          <span className="text-white font-bold font-mono text-sm">₹{product.price}</span>
        </div>

        {/* Flip Indicator */}
        {product.tags.includes('flip-ready') && (
          <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5 text-brand-blue text-[10px] font-bold uppercase">
            <Repeat size={10} />
            <span>Flip Ready</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItem;
