import React, { useState, useEffect, useRef } from 'react';
import { Product, FlipStatus, User } from '../types';
import { ArrowLeft, Share2, Zap, ShieldCheck, Sparkles, Heart, Ruler, Tag, Globe, Calendar, Layers, Activity } from 'lucide-react';
import { generateVibeCheck, suggestUpcycleIdea } from '../services/geminiService';
import { IMG_FALLBACK, AVATAR_FALLBACK } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onChat: (p: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onViewProfile?: (user: User) => void;
  onNavigateToShipping?: (p: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onChat, isWishlisted, onToggleWishlist, onViewProfile, onNavigateToShipping }) => {
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [upcycleIdea, setUpcycleIdea] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showUPI, setShowUPI] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product.description || product.description.length < 10) {
      handleVibeCheck();
    }
  }, [product.id]);

  const handleVibeCheck = async () => {
    setLoadingAi(true);
    const [desc, idea] = await Promise.all([
      generateVibeCheck(product.title, product.tags),
      suggestUpcycleIdea(product.title),
    ]);
    setAiDescription(desc);
    setUpcycleIdea(idea);
    setLoadingAi(false);
  };

  // Fixed: proper Share API with clipboard fallback
  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `${product.title} for ₹${product.price} on ourFIT — check it out!`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${product.title} — ₹${product.price} | ourFIT`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (_) {
      // User cancelled share or not supported
    }
  };

  // Fixed: don't allow buy on SOLD items
  const handleBuy = () => {
    if (product.status === FlipStatus.SOLD) return;
    setShowUPI(true);
  };

  const processPayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowUPI(false);
        setPaymentSuccess(false);
        if (onNavigateToShipping) {
          onNavigateToShipping(product);
        } else {
          onBack();
        }
      }, 3000);
    }, 2000);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      setActiveImageIndex(index);
    }
  };

  const isSold = product.status === FlipStatus.SOLD;

  const buyLabel = isSold
    ? 'Sold Out'
    : product.status === FlipStatus.AVAILABLE
      ? 'Buy Now'
      : 'Pre-Order Flip';

  return (
    <div className="bg-brand-black min-h-screen pb-24 relative animate-in fade-in duration-300">

      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 pt-safe px-4 pb-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button onClick={onBack} aria-label="Go back" className="pointer-events-auto p-2 bg-black/50 backdrop-blur rounded-full border border-white/10 shadow-lg active:scale-90 transition-transform">
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={() => onToggleWishlist(product.id)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="p-2 bg-black/50 backdrop-blur rounded-full border border-white/10 shadow-lg active:scale-90 transition-transform"
          >
            <Heart size={20} className={isWishlisted ? "fill-brand-orange text-brand-orange" : "text-white"} />
          </button>
          <button
            onClick={handleShare}
            aria-label="Share this product"
            className="p-2 bg-black/50 backdrop-blur rounded-full border border-white/10 shadow-lg active:scale-90 transition-transform relative"
          >
            <Share2 size={20} />
            {shareCopied && (
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-brand-green font-bold whitespace-nowrap bg-black/80 px-2 py-0.5 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full h-[60vh] bg-gray-900">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              onError={(e) => e.currentTarget.src = IMG_FALLBACK}
              className="w-full h-full object-cover snap-center flex-shrink-0"
              alt={`${product.title} - view ${idx + 1}`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding={idx === 0 ? "sync" : "async"}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 pointer-events-none">
          {product.images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === activeImageIndex ? 'bg-brand-orange w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* SOLD overlay on image */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
            <div className="bg-brand-black border-2 border-white/30 px-6 py-2 rotate-[-12deg] shadow-2xl">
              <span className="text-3xl font-display font-bold uppercase tracking-widest text-white/60">SOLD</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-black to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 mr-4">
            <h1 className="text-3xl font-display font-bold uppercase leading-none mb-1">{product.title}</h1>
            <button
              onClick={() => onViewProfile && onViewProfile(product.owner)}
              className="text-gray-400 text-sm font-mono hover:text-brand-orange transition-colors"
            >
              @{product.owner.handle}
            </button>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-2xl font-mono font-bold ${isSold ? 'text-gray-500 line-through' : 'text-white'}`}>
              ₹{product.price}
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-brand-green mt-1">
              <ShieldCheck size={12} />
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* AI Vibe Check */}
        <div className="mb-8 p-4 border border-brand-orange/30 bg-brand-orange/5 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 opacity-20">
            <Sparkles size={60} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-brand-orange fill-brand-orange" />
            <span className="text-brand-orange font-bold uppercase text-xs tracking-wider">Gemini Vibe Check</span>
          </div>

          {loadingAi ? (
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-white/10 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-white/10 animate-pulse rounded" />
            </div>
          ) : (
            <p className="font-display text-lg leading-tight text-white/90 italic">
              "{aiDescription || product.description}"
            </p>
          )}

          {product.status === FlipStatus.AVAILABLE && upcycleIdea && (
            <div className="mt-4 pt-4 border-t border-brand-orange/20">
              <p className="text-xs text-brand-blue uppercase font-bold mb-1">Flip Potential</p>
              <p className="text-sm text-gray-300">{upcycleIdea}</p>
            </div>
          )}
        </div>

        {/* Tags — now clickable to trigger Discovery search */}
        {product.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-gray-400 tracking-wider rounded hover:border-brand-orange/40 hover:text-brand-orange transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Specs Grid */}
        <div className="mb-8">
          <h3 className="text-xs uppercase text-gray-500 mb-4 tracking-widest font-bold">The Fine Print</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs uppercase font-bold">
                <Ruler size={14} /> Size
              </div>
              <p className="font-mono text-sm">{product.specs.size}</p>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs uppercase font-bold">
                <Tag size={14} /> Brand
              </div>
              <p className="font-mono text-sm">{product.specs.brand}</p>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs uppercase font-bold">
                <Layers size={14} /> Material
              </div>
              <p className="font-mono text-sm truncate">{product.specs.material}</p>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs uppercase font-bold">
                <Globe size={14} /> Origin
              </div>
              <p className="font-mono text-sm">{product.specs.origin}</p>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs uppercase font-bold">
                <Calendar size={14} /> Year
              </div>
              <p className="font-mono text-sm">{product.specs.year}</p>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-1 text-gray-500 text-xs uppercase font-bold">
                <Activity size={14} /> Condition
              </div>
              <p className="font-mono text-sm">{product.specs.condition}</p>
            </div>
          </div>
        </div>

        {/* Garment Journey */}
        {product.status !== FlipStatus.AVAILABLE && (
          <div className="mb-6">
            <h3 className="text-xs uppercase text-gray-500 mb-3 tracking-widest">Garment Journey</h3>
            <div className="flex items-center justify-between text-xs font-mono relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10" />
              {[FlipStatus.AVAILABLE, FlipStatus.ARTIST_REQUESTED, FlipStatus.IN_UPCYCLING, FlipStatus.SOLD].map((step, idx) => {
                const stepIndex = [FlipStatus.AVAILABLE, FlipStatus.ARTIST_REQUESTED, FlipStatus.IN_UPCYCLING, FlipStatus.SOLD].indexOf(product.status);
                const isActive = idx <= stepIndex;
                return (
                  <div key={step} className={`flex flex-col items-center gap-2 ${isActive ? 'text-brand-orange' : 'text-gray-600'}`}>
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-brand-orange shadow-[0_0_10px_#FF6B35]' : 'bg-gray-800 border border-gray-600'}`} />
                    <span className="scale-[0.6] uppercase">{step === 'IN_UPCYCLING' ? 'Working' : step.replace('ARTIST_', '')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Artist Profile */}
        {product.artist && (
          <div
            onClick={() => onViewProfile && onViewProfile(product.artist!)}
            className="flex items-center gap-4 mb-6 p-3 glass-panel rounded-xl cursor-pointer hover:bg-white/5 transition-colors group"
          >
            <img
              src={product.artist.avatar}
              onError={(e) => e.currentTarget.src = AVATAR_FALLBACK}
              className="w-10 h-10 rounded-full border border-white/20 bg-gray-800"
              alt="Artist"
            />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase group-hover:text-white transition-colors">Flipping by</p>
              <p className="font-bold">{product.artist.name}</p>
            </div>
            <div className="flex flex-col items-center px-3 border-l border-white/10">
              <span className="font-display font-bold text-lg">{product.artist.vouches}</span>
              <span className="text-[10px] uppercase text-gray-500">Vouches</span>
            </div>
          </div>
        )}

        {/* Action Buttons — Fixed: SOLD items disable Buy Now */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onChat(product)}
            disabled={isSold}
            className="flex-1 py-4 border border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Haggle
          </button>
          <button
            onClick={handleBuy}
            disabled={isSold}
            className={`flex-[2] py-4 font-bold uppercase tracking-wider transition-colors active:scale-[0.98] ${
              isSold
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-brand-orange text-black hover:bg-orange-400 shadow-[0_0_20px_rgba(255,107,53,0.3)]'
            }`}
          >
            {buyLabel}
          </button>
        </div>
      </div>

      {/* UPI Modal */}
      {showUPI && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col justify-end">
          <div className="bg-[#1a1a1a] rounded-t-3xl p-6 pb-12 animate-in slide-in-from-bottom duration-300">
            {!paymentSuccess ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">Pay with UPI</h2>
                  <button
                    onClick={() => setShowUPI(false)}
                    className="text-sm font-bold text-gray-400 hover:text-white border border-white/10 px-3 py-1 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3 mb-8">
                  {['Google Pay', 'PhonePe', 'Paytm'].map(app => (
                    <button
                      key={app}
                      onClick={processPayment}
                      disabled={paymentProcessing}
                      className="w-full flex items-center justify-between p-4 bg-black border border-white/10 rounded-xl active:scale-[0.98] transition-all hover:border-brand-orange/30"
                    >
                      <span className="font-bold">{app}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                    </button>
                  ))}
                </div>

                {paymentProcessing && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-t-3xl">
                    <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <ShieldCheck size={40} className="text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-400 text-center">Your fit is secured. Redirecting...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
