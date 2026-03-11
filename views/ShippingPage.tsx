import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { ArrowLeft, Phone, MessageCircle, Star, MapPin, Package, CheckCircle2, Truck, Home } from 'lucide-react';
import { IMG_FALLBACK, AVATAR_FALLBACK } from '../constants';

interface ShippingPageProps {
    product: Product;
    onBack: () => void;
    currentUser: User;
}

const DELIVERY_PARTNER = {
    name: 'Arjun S.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    trips: 1240,
    vehicle: 'Bajaj RE Auto',
    vehicleNum: 'KA 03 AB 7788',
    eta: '3–5 days',
    partner: 'Delhivery Express'
};

const TRACKING_STEPS = [
    { id: 0, label: 'Order Placed', sub: 'Seller notified', icon: Package },
    { id: 1, label: 'Packed & Ready', sub: 'Awaiting pickup', icon: CheckCircle2 },
    { id: 2, label: 'Out for Pickup', sub: 'Partner en route to seller', icon: Truck },
    { id: 3, label: 'In Transit', sub: 'Your package is on the move', icon: Truck },
    { id: 4, label: 'Out for Delivery', sub: 'Almost there!', icon: MapPin },
    { id: 5, label: 'Delivered', sub: 'Enjoy the fit ✦', icon: Home },
];

const MAP_DOTS = [
    { x: '20%', y: '30%', delay: '0s' },
    { x: '50%', y: '20%', delay: '0.4s' },
    { x: '70%', y: '55%', delay: '0.8s' },
    { x: '35%', y: '65%', delay: '0.2s' },
    { x: '80%', y: '25%', delay: '1s' },
    { x: '15%', y: '70%', delay: '0.6s' },
];

const ShippingPage: React.FC<ShippingPageProps> = ({ product, onBack, currentUser }) => {
    const [step, setStep] = useState(0);
    const [imgSrc, setImgSrc] = useState(product.images?.[0] || IMG_FALLBACK);
    const [driverImgSrc, setDriverImgSrc] = useState(DELIVERY_PARTNER.avatar);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 600),
            setTimeout(() => setStep(2), 1800),
            setTimeout(() => setStep(3), 4000),
            setTimeout(() => setStep(4), 7500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const orderId = `#ORD-${product.id.toUpperCase().slice(-4)}-${Date.now().toString().slice(-4)}`;

    return (
        <div className="flex flex-col h-screen bg-brand-black overflow-hidden relative animate-in slide-in-from-right duration-500">

            {/* ── MAP AREA ────────────────────────────────────────── */}
            <div className="relative flex-shrink-0" style={{ height: '52vh' }}>

                {/* Map background */}
                <div className="absolute inset-0 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0d1117 0%, #111827 40%, #0f172a 100%)' }}
                >
                    {/* Street grid SVG */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                            </pattern>
                            <pattern id="grid-major" width="120" height="120" patternUnits="userSpaceOnUse">
                                <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#475569" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        <rect width="100%" height="100%" fill="url(#grid-major)" />
                    </svg>

                    {/* Road lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 350" preserveAspectRatio="none">
                        <path d="M0 180 Q100 160 200 175 Q300 190 400 170" stroke="#1e40af" strokeWidth="6" fill="none" />
                        <path d="M0 100 Q80 90 160 110 Q240 130 320 100 Q360 85 400 95" stroke="#1e3a5f" strokeWidth="4" fill="none" />
                        <path d="M120 0 Q130 80 125 180 Q120 270 130 350" stroke="#1e40af" strokeWidth="5" fill="none" />
                        <path d="M260 0 Q270 100 265 200 Q260 290 270 350" stroke="#1e3a5f" strokeWidth="3" fill="none" />
                        <path d="M0 260 Q120 250 240 265 Q320 275 400 255" stroke="#1e40af" strokeWidth="4" fill="none" />
                    </svg>

                    {/* Static route — dashed line stays fixed, only the pin moves */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 350" preserveAspectRatio="none">
                        <path
                            d="M60 280 Q130 160 200 175 Q270 190 340 80"
                            stroke="#FF6B35" strokeWidth="3" fill="none"
                            strokeDasharray="8 4"
                        />
                    </svg>

                    {/* Pulse dots */}
                    {MAP_DOTS.map((dot, i) => (
                        <div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-ping"
                            style={{ left: dot.x, top: dot.y, animationDelay: dot.delay, animationDuration: '2s' }}
                        />
                    ))}

                    {/* Seller origin pin */}
                    <div className="absolute flex flex-col items-center" style={{ left: '15%', top: '76%', transform: 'translate(-50%, -50%)' }}>
                        <div className="w-8 h-8 bg-brand-orange rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_12px_rgba(255,107,53,0.7)]">
                            <Package size={14} className="text-white" />
                        </div>
                        <div className="w-0.5 h-3 bg-brand-orange" />
                        <div className="whitespace-nowrap text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded font-mono">SELLER</div>
                    </div>

                    {/* Moving delivery pin — travels along route, matches SVG path waypoints */}
                    {(() => {
                        const waypoints = [
                            { left: '15%', top: '76%' }, // step 0: at seller
                            { left: '15%', top: '76%' }, // step 1: still at seller (packed)
                            { left: '33%', top: '54%' }, // step 2: out for pickup, 1/4 along
                            { left: '50%', top: '50%' }, // step 3: in transit, midpoint
                            { left: '67%', top: '34%' }, // step 4: out for delivery, 3/4 along
                            { left: '78%', top: '18%' }, // step 5: delivered, at destination
                        ];
                        const pos = waypoints[Math.min(step, waypoints.length - 1)];
                        return (
                            <div
                                className="absolute flex flex-col items-center transition-all duration-[2500ms] ease-in-out"
                                style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
                            >
                                <div className="w-10 h-10 bg-brand-blue rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_16px_rgba(0,217,255,0.8)] animate-pulse">
                                    <Truck size={16} className="text-white" />
                                </div>
                                <div className="w-0.5 h-3 bg-brand-blue" />
                            </div>
                        );
                    })()}

                    {/* Destination pin */}
                    <div className="absolute flex flex-col items-center" style={{ left: '78%', top: '18%', transform: 'translate(-50%, -50%)' }}>
                        <div className="w-8 h-8 bg-brand-neon rounded-full border-2 border-black flex items-center justify-center shadow-[0_0_12px_rgba(204,255,0,0.7)]">
                            <Home size={14} className="text-black" />
                        </div>
                        <div className="w-0.5 h-3 bg-brand-neon" />
                        <div className="whitespace-nowrap text-[9px] bg-black/70 text-brand-neon px-1.5 py-0.5 rounded font-mono">YOU</div>
                    </div>
                </div>

                {/* Header overlay */}
                <div
                    className="absolute left-0 right-0 top-0 flex items-center gap-4 px-4 bg-gradient-to-b from-black/80 to-transparent z-20"
                    style={{ paddingTop: 'max(1rem, calc(env(safe-area-inset-top) + 0.25rem))', paddingBottom: '1rem' }}
                >
                    <button onClick={onBack} className="p-2 bg-black/40 backdrop-blur border border-white/10 rounded-full active:scale-90">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live Tracking</p>
                        <p className="font-bold text-sm text-brand-neon">{orderId}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 bg-brand-green/20 border border-brand-green/40 px-3 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-brand-green uppercase">Live</span>
                    </div>
                </div>

                {/* ETA floating bar */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3">
                    <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 font-mono uppercase">Est. Delivery</p>
                            <p className="font-display font-bold text-xl text-white">{DELIVERY_PARTNER.eta}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{DELIVERY_PARTNER.partner}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-mono uppercase">Status</p>
                            <p className="font-bold text-sm text-brand-orange">
                                {TRACKING_STEPS[Math.min(step, TRACKING_STEPS.length - 1)].label}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM SHEET ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-[#0D0D0D] rounded-t-3xl -mt-3 relative z-10 border-t border-white/10">

                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                <div className="px-5 pb-10">

                    {/* Delivery Partner */}
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 mb-4 mt-3">
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">Delivery Partner</p>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={driverImgSrc}
                                    onError={() => setDriverImgSrc(AVATAR_FALLBACK)}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-orange/40 bg-gray-800"
                                    alt="driver"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-brand-green text-black text-[8px] font-bold px-1 rounded">LIVE</div>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-base">{DELIVERY_PARTNER.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star size={10} className="fill-brand-neon text-brand-neon" />
                                    <span className="text-xs font-mono text-brand-neon">{DELIVERY_PARTNER.rating}</span>
                                    <span className="text-xs text-gray-500 ml-1">· {DELIVERY_PARTNER.trips.toLocaleString()} deliveries</span>
                                </div>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">{DELIVERY_PARTNER.vehicle} · {DELIVERY_PARTNER.vehicleNum}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/30 rounded-full flex items-center justify-center active:scale-90">
                                    <Phone size={16} className="text-brand-orange" />
                                </button>
                                <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center active:scale-90">
                                    <MessageCircle size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order item */}
                    <div className="flex gap-3 mb-4 bg-[#161616] border border-white/10 rounded-2xl p-4 items-center">
                        <img
                            src={imgSrc}
                            onError={() => setImgSrc(IMG_FALLBACK)}
                            className="w-16 h-16 rounded-xl object-cover bg-gray-800 border border-white/10 flex-shrink-0"
                            alt="product"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{product.title}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">@{product.owner.handle}</p>
                            <p className="text-brand-orange font-bold font-mono mt-1">₹{product.price}</p>
                        </div>
                        <div className="flex-shrink-0 text-center">
                            <div className="w-9 h-9 bg-brand-green/10 border border-brand-green/30 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={18} className="text-brand-green" />
                            </div>
                            <p className="text-[9px] text-brand-green font-bold uppercase mt-1">Paid</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-4">
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-3">Shipment Progress</p>
                        {TRACKING_STEPS.map((s, idx) => {
                            const isActive = idx === Math.min(step, TRACKING_STEPS.length - 1);
                            const isDone = idx < step;
                            const Icon = s.icon;
                            return (
                                <div key={s.id} className="flex gap-3 items-start">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                                            isDone ? 'bg-brand-green text-black shadow-[0_0_8px_rgba(57,255,20,0.4)]'
                                            : isActive ? 'bg-brand-orange text-black shadow-[0_0_8px_rgba(255,107,53,0.5)] scale-110'
                                            : 'bg-white/5 border border-white/10 text-gray-600'
                                        }`}>
                                            <Icon size={14} />
                                        </div>
                                        {idx < TRACKING_STEPS.length - 1 && (
                                            <div className={`w-0.5 h-5 transition-all duration-500 ${isDone ? 'bg-brand-green' : 'bg-white/10'}`} />
                                        )}
                                    </div>
                                    <div className="pt-1 pb-3">
                                        <p className={`text-sm font-bold ${isActive ? 'text-brand-orange' : isDone ? 'text-white' : 'text-gray-600'}`}>
                                            {s.label}
                                        </p>
                                        <p className={`text-[10px] font-mono ${isActive || isDone ? 'text-gray-400' : 'text-gray-700'}`}>
                                            {s.sub}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Address */}
                    <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 mb-5">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={14} className="text-brand-orange" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shipping To</span>
                        </div>
                        <p className="font-bold text-sm">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">Saved address on file</p>
                        <button className="mt-2 text-xs text-brand-orange font-bold uppercase tracking-wider">+ Change Address</button>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Back to Feed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
