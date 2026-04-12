import React, { useState, useEffect } from 'react';
import { User, Product } from '../types';
import FeedItem from '../components/FeedItem';
import { Settings, Sparkles, RefreshCw, Grid, Heart, ShoppingBag, ShieldCheck, ArrowLeft, Archive, MessageCircle } from 'lucide-react';
import { generateStylePersona, generateCraftBadge } from '../services/geminiService';
import { AVATAR_FALLBACK } from '../constants';

interface ProfileProps {
    user: User;
    products: Product[];
    wishlistIds: Set<string>;
    onProductSelect: (p: Product) => void;
    isOwnProfile?: boolean;
    onBack?: () => void;
    onDmUser?: (user: User) => void;
}

type Tab = 'CLOSET' | 'COPPED' | 'WISHLIST' | 'ARCHIVE';

const Profile: React.FC<ProfileProps> = ({ user, products, wishlistIds, onProductSelect, isOwnProfile = false, onBack, onDmUser }) => {
    const [activeTab, setActiveTab] = useState<Tab>('CLOSET');
    const [persona, setPersona] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [badges, setBadges] = useState<Record<string, string>>({});
    const [loadingBadges, setLoadingBadges] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(user.avatar);
    const [dmCopied, setDmCopied] = useState(false);

    useEffect(() => {
        setAvatarSrc(user.avatar);
    }, [user.avatar]);

    // Filter Data
    const myCloset = products.filter(p => p.owner.id === user.id && p.status === 'AVAILABLE');
    // Archive = items I've sold
    const myArchive = products.filter(p => p.owner.id === user.id && p.status === 'SOLD');
    const myWishlist = products.filter(p => wishlistIds.has(p.id));
    // Copped = items bought from others (approximated from mock data)
    const myCopped = products.filter(p => p.owner.id !== user.id && p.status === 'SOLD').slice(0, 4);

    const displayedProducts = activeTab === 'CLOSET' ? myCloset
        : activeTab === 'ARCHIVE' ? myArchive
            : activeTab === 'COPPED' ? myCopped
                : myWishlist;

    // Load Badges for Artist
    useEffect(() => {
        const loadBadges = async () => {
            if (user.role === 'ARTIST' && user.crafts && user.crafts.length > 0) {
                setLoadingBadges(true);
                const newBadges: Record<string, string> = {};

                for (const craft of user.crafts) {
                    const cached = localStorage.getItem(`badge_${craft}`);
                    if (cached) {
                        newBadges[craft] = cached;
                    } else {
                        const base64 = await generateCraftBadge(craft);
                        if (base64) {
                            newBadges[craft] = base64;
                            try {
                                localStorage.setItem(`badge_${craft}`, base64);
                            } catch (e) {
                                console.warn("Storage full");
                            }
                        }
                    }
                }
                setBadges(newBadges);
                setLoadingBadges(false);
            }
        };

        loadBadges();
    }, [user.id, user.role, user.crafts]);

    const handleAnalyzeStyle = async () => {
        setAnalyzing(true);
        const allMyItems = [...myCloset, ...myWishlist, ...myCopped];
        const result = await generateStylePersona(allMyItems);
        setPersona(result);
        setAnalyzing(false);
    };

    const handleDmArtist = () => {
        if (onDmUser) {
            onDmUser(user);
        } else {
            setDmCopied(true);
            setTimeout(() => setDmCopied(false), 2000);
        }
    };

    const totalListings = myCloset.length + myArchive.length;

    return (
        <div className="min-h-screen bg-brand-black pb-24 relative animate-in slide-in-from-right duration-300">

            {/* Header Image with Gradient */}
            <div className="relative overflow-hidden" style={{ height: 'max(10rem, calc(env(safe-area-inset-top) + 7rem))' }}>
                <div
                    className={`absolute inset-0 bg-[length:300%_300%] animate-gradient ${user.role === 'ARTIST'
                        ? 'bg-gradient-to-tr from-[#FF6B35] via-[#8B5CF6] to-[#ff00cc]'
                        : 'bg-gradient-to-tr from-[#FF6B35] via-[#CCFF00] to-[#ff00cc]'
                    }`}
                />
                <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay pointer-events-none" />

                {/* Back Button */}
                {!isOwnProfile && onBack && (
                    <button
                        onClick={onBack}
                        aria-label="Go back"
                        style={{ top: 'max(1rem, calc(env(safe-area-inset-top) + 0.25rem))' }}
                        className="absolute left-4 p-2 bg-black/20 backdrop-blur rounded-full hover:bg-black/40 transition-colors z-20 text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                {/* Settings */}
                {isOwnProfile && (
                    <button aria-label="Settings" style={{ top: 'max(1rem, calc(env(safe-area-inset-top) + 0.25rem))' }} className="absolute right-4 p-2 bg-black/20 backdrop-blur rounded-full hover:bg-black/40 transition-colors z-20">
                        <Settings className="text-white" size={20} />
                    </button>
                )}
            </div>

            {/* Profile Info */}
            <div className="px-4 relative -mt-16 mb-6">
                <div className="flex justify-between items-end mb-4 relative">

                    {/* Avatar */}
                    <div className="relative z-10">
                        <img
                            src={avatarSrc}
                            onError={() => setAvatarSrc(AVATAR_FALLBACK)}
                            alt="profile"
                            className="w-28 h-28 rounded-full border-4 border-brand-black object-cover bg-gray-800"
                        />

                        {/* Artist Craft Badges */}
                        {user.role === 'ARTIST' && (
                            <div className="absolute -top-8 -right-8 flex -space-x-3 z-30 pointer-events-auto">
                                {loadingBadges ? (
                                    <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse border border-white/20 ml-2" />
                                ) : (
                                    user.crafts?.map((craft, idx) => (
                                        <div
                                            key={craft}
                                            className="relative group w-14 h-14 transition-transform hover:scale-110 hover:z-40 cursor-help"
                                            style={{ zIndex: 30 - idx }}
                                        >
                                            <div className="absolute inset-0 bg-brand-neon/20 rounded-full scale-75 blur-md" />
                                            {badges[craft] ? (
                                                <img
                                                    src={badges[craft]}
                                                    alt={craft}
                                                    className="w-full h-full object-contain filter drop-shadow-xl"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/20 flex items-center justify-center text-[8px] uppercase font-bold text-center p-1">
                                                    {craft}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-brand-neon text-[10px] font-bold uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-neon/20 pointer-events-none z-50">
                                                {craft} Expert
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Artist Verification Tick */}
                        {user.role === 'ARTIST' && (
                            <div className="absolute bottom-1 right-1 bg-brand-black rounded-full p-1 z-20">
                                <div className="bg-brand-neon p-1 rounded-full">
                                    <ShieldCheck size={16} className="text-black" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats — Fixed: myArchive.length for "Sold", not closet+archive */}
                    <div className="flex gap-2 mb-2 ml-auto relative z-10">
                        <div className="bg-brand-dark/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col items-center min-w-[62px]">
                            <span className="block font-bold text-lg text-brand-neon">{user.vibeScore}</span>
                            <span className="text-[9px] uppercase text-gray-400 tracking-wider font-bold">Aura</span>
                        </div>
                        <div className="bg-brand-dark/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col items-center min-w-[62px]">
                            <span className="block font-bold text-lg text-brand-green">{user.vouches}</span>
                            <span className="text-[9px] uppercase text-gray-400 tracking-wider font-bold">Vouches</span>
                        </div>
                        <div className="bg-brand-dark/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col items-center min-w-[62px]">
                            <span className="block font-bold text-lg text-brand-orange">{myArchive.length}</span>
                            <span className="text-[9px] uppercase text-gray-400 tracking-wider font-bold">Sold</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-display font-bold uppercase tracking-tight flex items-center gap-2">
                        {user.name}
                        {user.role === 'ARTIST' && (
                            <span className="text-[10px] bg-brand-neon text-black px-2 py-1 rounded font-bold tracking-wider align-middle">
                                PRO ARTIST
                            </span>
                        )}
                    </h1>
                    <p className="text-brand-orange font-mono text-sm">@{user.handle}</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">{user.bio}</p>

                    {/* Artist Actions — Fixed: no more hardcoded Instagram link */}
                    {user.role === 'ARTIST' && !isOwnProfile && (
                        <div className="mt-6">
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={handleDmArtist}
                                    className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    <MessageCircle size={18} />
                                    <span className="text-xs">{dmCopied ? 'Opening DM...' : 'DM Artist'}</span>
                                </button>
                                <div className="px-4 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {totalListings} Drops
                                    </span>
                                </div>
                            </div>

                            {/* Work Showcase */}
                            {user.portfolio && user.portfolio.length > 0 && (
                                <div className="mb-2">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Work Showcase</h3>
                                        <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded border border-brand-orange/20">
                                            {user.portfolio.length} Projects
                                        </span>
                                    </div>

                                    <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
                                        {user.portfolio.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="min-w-[140px] h-[180px] rounded-xl overflow-hidden relative border border-white/10 snap-center group"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Work ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                                <div className="absolute bottom-2 left-2 right-2">
                                                    <div className="h-0.5 w-8 bg-brand-orange mb-1" />
                                                    <span className="text-[10px] font-mono text-gray-300">PROJECT 0{idx + 1}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* AI Style Analysis */}
                {isOwnProfile && (
                    <div className="mt-6">
                        {!persona ? (
                            <button
                                onClick={handleAnalyzeStyle}
                                disabled={analyzing}
                                className="w-full py-3 bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center gap-2 text-sm font-bold uppercase hover:bg-white/10 transition-colors active:scale-[0.98]"
                            >
                                {analyzing ? (
                                    <RefreshCw className="animate-spin text-brand-orange" size={16} />
                                ) : (
                                    <Sparkles className="text-brand-orange" size={16} />
                                )}
                                {analyzing ? "Reading the stars..." : "Analyze My Style Persona"}
                            </button>
                        ) : (
                            <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl relative">
                                <button onClick={() => setPersona(null)} className="absolute top-2 right-2 text-brand-orange/50">
                                    <RefreshCw size={12} />
                                </button>
                                <div className="flex items-center gap-2 mb-2 text-brand-orange">
                                    <Sparkles size={14} />
                                    <span className="text-xs font-bold uppercase">Gemini Diagnosis</span>
                                </div>
                                <p className="text-sm italic text-gray-200 leading-relaxed">"{persona}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-4 sticky top-0 bg-brand-black/90 backdrop-blur z-20">
                <button
                    onClick={() => setActiveTab('CLOSET')}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'CLOSET' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500'}`}
                >
                    <Grid size={16} />
                    Closet
                </button>

                <button
                    onClick={() => setActiveTab('ARCHIVE')}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'ARCHIVE' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500'}`}
                >
                    <Archive size={16} />
                    Archive
                </button>

                {isOwnProfile && (
                    <>
                        <button
                            onClick={() => setActiveTab('COPPED')}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'COPPED' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500'}`}
                        >
                            <ShoppingBag size={16} />
                            Copped
                        </button>
                        <button
                            onClick={() => setActiveTab('WISHLIST')}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'WISHLIST' ? 'border-brand-orange text-white' : 'border-transparent text-gray-500'}`}
                        >
                            <Heart size={16} />
                            Wishlist
                        </button>
                    </>
                )}
            </div>

            {/* Grid */}
            <div className="px-4">
                {displayedProducts.length > 0 ? (
                    <div className="columns-2 gap-4 space-y-4">
                        {displayedProducts.map(p => (
                            <FeedItem key={p.id} product={p} onClick={onProductSelect} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center opacity-50">
                        <p className="font-mono text-sm uppercase tracking-widest">Nothing here yet.</p>
                        {activeTab === 'WISHLIST' && <p className="text-xs mt-2 text-gray-500">Go swipe some fits.</p>}
                        {activeTab === 'ARCHIVE' && <p className="text-xs mt-2 text-gray-500">No sold items yet.</p>}
                        {activeTab === 'CLOSET' && <p className="text-xs mt-2 text-gray-500">Drop something.</p>}
                        {activeTab === 'COPPED' && <p className="text-xs mt-2 text-gray-500">Go cop something.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
