import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Zap, Sparkles, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import { generateListingDetails } from '../services/geminiService';
import { Product, FlipStatus, User } from '../types';

interface UploadFlowProps {
    onClose: () => void;
    onSuccess: (product: Product) => void;
    currentUser: User; // Fixed: use actual user instead of hardcoded 'me'
}

type Step = 'CAPTURE' | 'DETAILS' | 'ANALYZING' | 'PREVIEW' | 'FINAL_CHECK' | 'SUCCESS';

const UploadFlow: React.FC<UploadFlowProps> = ({ onClose, onSuccess, currentUser }) => {
    const [step, setStep] = useState<Step>('CAPTURE');
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [aiData, setAiData] = useState<{ tags: string[], description: string, auraScore: number } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderX, setSliderX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (step === 'FINAL_CHECK') {
            setSliderX(0);
        }
    }, [step]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setStep('DETAILS');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!title || !price) return;
        setStep('ANALYZING');
        const data = await generateListingDetails(title);
        setAiData(data);
        setStep('PREVIEW');
    };

    const handlePost = () => {
        if (!image || !aiData) return;

        const newProduct: Product = {
            id: `new_${Date.now()}`,
            title: title,
            price: parseInt(price),
            description: aiData.description,
            images: [image],
            status: FlipStatus.AVAILABLE,
            owner: currentUser, // Fixed: use real user
            auraScore: aiData.auraScore,
            tags: aiData.tags,
            specs: {
                size: 'M',
                brand: 'Unknown',
                material: 'Mixed',
                origin: 'India',
                year: new Date().getFullYear().toString(),
                condition: 'Used — Good'
            }
        };

        setStep('SUCCESS');
        setTimeout(() => {
            onSuccess(newProduct);
        }, 2000);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const handleWidth = 80;
        const maxDrag = rect.width - handleWidth;
        const newX = Math.max(0, Math.min(e.clientX - rect.left, maxDrag));
        setSliderX(newX);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        if (!sliderRef.current) return;
        const handleWidth = 80;
        const maxDrag = sliderRef.current.offsetWidth - handleWidth;
        if (sliderX > maxDrag * 0.9) {
            setSliderX(maxDrag);
            handlePost();
        } else {
            setSliderX(0);
        }
    };

    if (step === 'CAPTURE') {
        return (
            <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35] via-[#CCFF00] to-[#ff00cc] bg-[length:300%_300%] animate-gradient" />
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-overlay pointer-events-none contrast-125" />

                <div className="flex justify-between pt-safe px-4 pb-4 relative z-20">
                    <button onClick={onClose} className="p-2 bg-black/10 hover:bg-black/20 text-black rounded-full transition-colors backdrop-blur-md active:scale-90">
                        <X size={24} />
                    </button>
                    <span className="font-bold font-display uppercase pt-2 text-black tracking-widest text-sm drop-shadow-sm">Step 1: The Fit</span>
                    <div className="w-10" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-20">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-[3/4] bg-black border-4 border-dotted border-white/40 rounded-3xl flex flex-col items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="w-24 h-24 rounded-full bg-brand-neon flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-[0_0_25px_rgba(204,255,0,0.6)] relative z-10">
                            <Camera size={40} className="text-black" />
                        </div>
                        <p className="font-display font-bold text-3xl uppercase text-white tracking-tighter relative z-10">Snap It</p>
                        <p className="text-gray-500 text-xs mt-3 font-mono uppercase tracking-widest relative z-10">or upload from gallery</p>
                    </div>
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
            </div>
        );
    }

    if (step === 'DETAILS') {
        return (
            <div className="fixed inset-0 bg-brand-black z-50 flex flex-col">
                <div className="flex justify-between pt-safe px-4 pb-4 border-b border-white/10">
                    <button onClick={() => setStep('CAPTURE')} className="p-2 active:scale-90"><ArrowLeft size={24} /></button>
                    <span className="font-bold font-display uppercase">Step 2: The Deets</span>
                    <div className="w-10" />
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex gap-4 mb-8">
                        <img src={image!} className="w-24 h-24 object-cover rounded-xl border border-white/20" alt="preview" />
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="text-gray-400 text-sm">Looks fire.</p>
                            <p className="text-xs text-brand-orange uppercase font-bold mt-1">Ready to list</p>
                            <p className="text-xs text-gray-600 font-mono mt-1">as @{currentUser.handle}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">What is it?</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Vintage Nike Windbreaker"
                                className="w-full bg-transparent border-b border-white/20 py-3 text-2xl font-bold focus:border-brand-orange focus:outline-none placeholder:text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                                className="w-full bg-transparent border-b border-white/20 py-3 text-2xl font-bold font-mono focus:border-brand-orange focus:outline-none placeholder:text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleAnalyze}
                        disabled={!title || !price}
                        className="w-full py-4 bg-brand-orange text-black font-bold uppercase rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <Sparkles size={20} />
                        Run Vibe Check
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'ANALYZING') {
        return (
            <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B35] via-[#CCFF00] to-[#ff00cc] bg-[length:300%_300%] animate-gradient" />
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-overlay pointer-events-none contrast-125" />
                <div className="relative z-10 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 text-center shadow-2xl max-w-xs w-full">
                    <div className="w-20 h-20 border-8 border-brand-neon border-t-transparent rounded-full animate-spin mb-8 mx-auto shadow-[0_0_30px_#CCFF00]" />
                    <h2 className="text-3xl font-bold font-display uppercase text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] animate-pulse">Consulting the Vibe Council...</h2>
                    <p className="text-white/80 mt-4 font-mono font-bold uppercase tracking-widest text-xs">Gemini is judging your fit</p>
                </div>
            </div>
        );
    }

    if (step === 'PREVIEW' && aiData) {
        return (
            <div className="fixed inset-0 bg-brand-black z-50 flex flex-col overflow-y-auto">
                <div className="flex justify-between pt-safe px-4 pb-4 border-b border-white/10">
                    <button onClick={() => setStep('DETAILS')} className="p-2 active:scale-90"><ArrowLeft size={24} /></button>
                    <span className="font-bold font-display uppercase">Step 3: Confirm</span>
                    <div className="w-10" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-brand-neon text-xs uppercase tracking-[0.2em] mb-4 font-bold animate-pulse">Gemini generated listing</h2>

                    <div className="brutalist-card p-5 rounded-none mb-8 border border-white/20 relative shadow-[8px_8px_0px_#CCFF00] bg-[#121212]">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold font-display uppercase leading-none flex-1 mr-4">{title}</h1>
                            <div className="flex flex-col items-end flex-shrink-0">
                                <span className="font-mono text-2xl font-bold">₹{price}</span>
                                <div className="flex items-center gap-1 text-brand-neon bg-black/50 px-2 py-1 rounded mt-1">
                                    <Zap size={12} className="fill-brand-neon" />
                                    <span className="text-xs font-bold">{aiData.auraScore} AURA</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-300 italic mb-6 text-lg leading-relaxed border-l-2 border-brand-orange pl-4">"{aiData.description}"</p>
                        <div className="flex flex-wrap gap-2">
                            {aiData.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 text-xs uppercase font-bold text-gray-400 tracking-wider">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1" />

                    <button
                        onClick={() => setStep('FINAL_CHECK')}
                        className="w-full py-4 bg-white text-black font-bold uppercase rounded-xl hover:scale-[1.02] transition-transform mb-3 flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <span>Looks Good</span>
                        <ArrowRight size={20} />
                    </button>
                    <button
                        onClick={() => setStep('DETAILS')}
                        className="w-full py-4 bg-transparent border border-white/20 text-white font-bold uppercase rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Edit Details
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'FINAL_CHECK') {
        return (
            <div className="fixed inset-0 bg-brand-black z-50 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                <div className="relative z-10 w-full max-w-sm">
                    <div className="mb-8 text-center">
                        <AlertTriangle size={48} className="text-brand-orange mx-auto mb-4" />
                        <h2 className="text-3xl font-display font-bold uppercase text-white mb-2">Final Call</h2>
                        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Once you drop, it's live.</p>
                    </div>

                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-dashed border-white/20 mb-10 relative">
                        <div className="absolute -left-2 top-1/2 w-4 h-4 bg-brand-black rounded-full" />
                        <div className="absolute -right-2 top-1/2 w-4 h-4 bg-brand-black rounded-full" />
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Item</span>
                            <span className="font-bold text-sm truncate max-w-[150px]">{title}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-xs font-bold uppercase">Listing Price</span>
                            <span className="font-mono text-brand-orange text-xl font-bold">₹{price}</span>
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <div
                            ref={sliderRef}
                            role="slider"
                            tabIndex={0}
                            aria-label="Swipe to list your item"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={sliderRef.current ? Math.round((sliderX / (sliderRef.current.offsetWidth - 80)) * 100) : 0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handlePost();
                                }
                            }}
                            className="relative w-full h-20 bg-[#222] rounded-xl overflow-hidden border border-brand-orange/50 shadow-[0_0_15px_rgba(255,107,53,0.2)] select-none touch-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                        >
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 10px, #FF6B35 10px, #FF6B35 20px)' }} />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                <span className="font-display font-bold uppercase tracking-[0.2em] text-brand-orange animate-pulse">Swipe to List</span>
                            </div>
                            <div className="absolute top-0 left-0 h-full bg-brand-orange/20 z-0 transition-all duration-75" style={{ width: `${sliderX + 80}px` }} />
                            <div
                                className="absolute top-0 left-0 h-full w-20 bg-brand-orange flex items-center justify-center border-r border-black/50 shadow-lg z-10 cursor-grab active:cursor-grabbing"
                                style={{ transform: `translateX(${sliderX}px)` }}
                            >
                                <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center">
                                    <ArrowRight size={20} className="text-black stroke-[3]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setStep('PREVIEW')} className="w-full mt-2 py-4 text-xs text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'SUCCESS') {
        return (
            <div className="fixed inset-0 bg-brand-neon z-[60] flex flex-col items-center justify-center p-6 text-black animate-in zoom-in duration-300">
                <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center mb-8 shadow-[10px_10px_0px_rgba(0,0,0,0.2)]">
                        <Check size={64} className="text-brand-neon" />
                    </div>
                    <h1 className="text-7xl font-display font-bold uppercase tracking-tighter mb-2 scale-y-110">DROPPED.</h1>
                    <p className="font-bold text-2xl opacity-80 font-mono uppercase tracking-widest">It's live.</p>
                </div>
            </div>
        );
    }

    return null;
};

export default UploadFlow;
