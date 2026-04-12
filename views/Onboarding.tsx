import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, RefreshCw, Zap, ArrowLeft, Palette, ShoppingBag } from 'lucide-react';

interface OnboardingProps {
    onLogin: (role?: 'BUYER' | 'ARTIST', crafts?: string[]) => void;
}

type UserRole = 'BUYER' | 'ARTIST' | null;

const INTRO_STEPS = [
    {
        id: 'intro',
        icon: <Sparkles size={48} className="text-brand-neon fill-brand-neon" />,
        title: "ourFIT",
        headline: "The Archive for the New India",
        desc: "The anti-fast fashion ecosystem."
    },
    {
        id: 'upcycle',
        icon: <RefreshCw size={48} className="text-brand-neon" />,
        title: "FLIP IT.",
        headline: "Don't Bin It.",
        desc: "Connect with local wizards to transform deadstock into 1-of-1 pieces."
    },
    {
        id: 'vibe',
        icon: <Zap size={48} className="text-brand-neon fill-brand-neon" />,
        title: "VIBE CHECK.",
        headline: "AI Powered Listings.",
        desc: "Every listing is analyzed. We assign an Aura Score to ensure no basic fits enter."
    }
];

const ARTIST_TAGS = ["Embroidery", "Patchwork", "Painting", "Distressing", "Screen Print", "Crochet"];

const Onboarding: React.FC<OnboardingProps> = ({ onLogin }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [role, setRole] = useState<UserRole>(null);
    const [artistTags, setArtistTags] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [clickedRole, setClickedRole] = useState<UserRole | null>(null);

    const totalSteps = INTRO_STEPS.length;
    const isIntro = currentStep < totalSteps;
    const isRoleSelect = currentStep === totalSteps;
    const isArtistDetails = role === 'ARTIST' && currentStep === totalSteps + 1;
    const isLogin = (role === 'BUYER' && currentStep === totalSteps + 1) ||
        (role === 'ARTIST' && currentStep === totalSteps + 2);

    const handleNext = () => setCurrentStep(prev => prev + 1);

    const handleBack = () => {
        if (isLogin) {
            if (role === 'ARTIST') {
                setCurrentStep(totalSteps + 1);
            } else {
                setRole(null);
                setCurrentStep(totalSteps);
            }
        } else if (isArtistDetails) {
            setRole(null);
            setCurrentStep(totalSteps);
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleRoleSelect = (selectedRole: UserRole) => {
        setClickedRole(selectedRole);
        setTimeout(() => {
            setRole(selectedRole);
            setCurrentStep(totalSteps + 1);
            setClickedRole(null);
        }, 450);
    };

    const toggleArtistTag = (tag: string) => {
        setArtistTags(prev => {
            const next = new Set(prev);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            return next;
        });
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (role === 'ARTIST') {
                onLogin('ARTIST', Array.from(artistTags));
            } else {
                onLogin('BUYER', []);
            }
        }, 2000);
    };

    const handleSkip = () => onLogin('BUYER', []);

    const stepData = isIntro ? INTRO_STEPS[currentStep] : null;

    const getActiveDot = () => {
        if (isIntro) return currentStep;
        return 3;
    };

    // Canvas-based pixelation — the only cross-browser method that works on mobile video
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // PIXEL_SCALE: higher = more pixelated. 14 obscures faces while staying subtle.
        const PIXEL_SCALE = 14;
        const off = document.createElement('canvas');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            if (video.readyState >= 2) {
                off.width = Math.max(1, Math.ceil(canvas.width / PIXEL_SCALE));
                off.height = Math.max(1, Math.ceil(canvas.height / PIXEL_SCALE));
                const offCtx = off.getContext('2d');
                if (offCtx) {
                    offCtx.drawImage(video, 0, 0, off.width, off.height);
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
                }
            }
            animFrameRef.current = requestAnimationFrame(draw);
        };

        animFrameRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden text-white font-sans">
            {/* Video — hidden, drives the canvas below */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                poster="/videos/onboarding-poster.jpg"
            >
                <source src="/videos/ourfit-onboarding.mp4" type="video/mp4" />
            </video>

            {/* Canvas — renders pixelated frames from the hidden video */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Gradient Overlay — heavier so text always readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay pointer-events-none contrast-125" />

            {/* Top Navigation — safe area aware */}
            <div
                className="relative z-10 w-full flex justify-between items-center px-6"
                style={{ paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 0.5rem))' }}
            >
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx === getActiveDot() ? 'w-8 bg-brand-neon shadow-[0_0_8px_rgba(204,255,0,0.8)]' : 'w-2 bg-white/30'
                            }`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    {isIntro && currentStep > 0 && (
                        <button
                            onClick={handleSkip}
                            className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                        >
                            Skip
                        </button>
                    )}
                    {(currentStep > 0) && (
                        <button onClick={handleBack} className="p-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div key={currentStep} className="relative z-10 w-full flex-1 flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-500 px-6">

                {isIntro && stepData && (
                    <>
                        <div className="mb-10 relative">
                            <div className="absolute inset-0 bg-brand-neon/20 blur-2xl rounded-full scale-150 animate-pulse" />
                            <div className="relative z-10 p-5 border-2 border-brand-neon/40 rounded-full bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                                {stepData.icon}
                            </div>
                        </div>

                        <h1 className="text-6xl font-display font-bold uppercase tracking-tighter leading-[0.9] mb-4 text-white drop-shadow-lg whitespace-pre-line">
                            {stepData.title}
                        </h1>

                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest bg-brand-neon text-black px-3 py-1 mb-5 transform -rotate-2 shadow-[3px_3px_0px_rgba(0,0,0,0.8)]">
                            {stepData.headline}
                        </h2>

                        <p className="text-base font-bold max-w-xs leading-snug text-white/80">
                            {stepData.desc}
                        </p>
                    </>
                )}

                {isRoleSelect && (
                    <>
                        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-8 leading-[0.9] text-white drop-shadow-lg">
                            What's your<br />Contribution?
                        </h1>

                        <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
                            {/* BLUE LIQUID GLASS BUTTON - BUYER */}
                            <button
                                onClick={() => handleRoleSelect('BUYER')}
                                className="group relative h-48 w-full rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-700" />
                                <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_6px_rgba(0,0,0,0.2)] rounded-[2.5rem]" />
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-80" />
                                <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/30 blur-2xl rounded-full pointer-events-none" />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/70 to-transparent w-[200%] h-full -skew-x-12 transition-transform duration-500 ease-out z-20 pointer-events-none ${clickedRole === 'BUYER' ? 'translate-x-full' : '-translate-x-[150%]'}`}
                                />
                                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-left">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                                            <ShoppingBag size={28} className="text-white drop-shadow-md" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                            <ArrowRight size={16} className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-display font-bold uppercase text-white tracking-tight drop-shadow-md">Cop Fits</h3>
                                        <p className="text-blue-100 text-xs font-mono font-bold uppercase tracking-wider mt-1 opacity-90">Browse & Buy Archive</p>
                                    </div>
                                </div>
                            </button>

                            {/* RED/ORANGE LIQUID GLASS BUTTON - ARTIST */}
                            <button
                                onClick={() => handleRoleSelect('ARTIST')}
                                className="group relative h-48 w-full rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42] via-[#FF5F1F] to-[#E11D48]" />
                                <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-4px_6px_rgba(0,0,0,0.2)] rounded-[2.5rem]" />
                                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-80" />
                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-yellow-400/30 blur-2xl rounded-full pointer-events-none mix-blend-overlay" />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/70 to-transparent w-[200%] h-full -skew-x-12 transition-transform duration-500 ease-out z-20 pointer-events-none ${clickedRole === 'ARTIST' ? 'translate-x-full' : '-translate-x-[150%]'}`}
                                />
                                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-left">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                                            <Palette size={28} className="text-white drop-shadow-md" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                            <ArrowRight size={16} className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-display font-bold uppercase text-white tracking-tight drop-shadow-md">Create Heat</h3>
                                        <p className="text-orange-100 text-xs font-mono font-bold uppercase tracking-wider mt-1 opacity-90">Upcycle & Sell 1-of-1s</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {isArtistDetails && (
                    <>
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-neon text-black rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                                <Palette size={16} className="fill-black" />
                                <span className="text-xs font-bold uppercase tracking-widest">Artist Profile</span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-2 text-white drop-shadow-lg">
                            Define Your<br />Craft
                        </h1>
                        <p className="text-sm font-bold text-white/60 mb-8 max-w-xs">Select the services you provide to the community.</p>

                        <div className="flex flex-wrap justify-center gap-3 max-w-xs mb-8">
                            {ARTIST_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleArtistTag(tag)}
                                    className={`px-4 py-3 rounded-xl border-2 font-bold uppercase text-xs tracking-wider transition-all ${artistTags.has(tag)
                                        ? 'bg-brand-neon text-black border-brand-neon shadow-[0_0_15px_rgba(204,255,0,0.5)] transform -translate-y-1'
                                        : 'bg-white/10 border-white/20 text-white hover:border-brand-neon/60 backdrop-blur-sm'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {isLogin && (
                    <>
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-neon text-black rounded-full shadow-[0_0_20px_rgba(204,255,0,0.5)] animate-pulse-fast">
                                <Sparkles size={16} className="fill-black" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {role === 'ARTIST' ? 'Creator Access' : 'Beta Access'}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-7xl font-display font-bold uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-lg text-white">
                            our<br />FIT
                        </h1>

                        <p className="text-sm font-mono font-bold uppercase tracking-widest max-w-[200px] leading-tight mb-12 border-y-2 border-brand-neon/50 py-4 text-white/80">
                            {role === 'ARTIST' ? 'Ready to change the game?' : 'Ready to join the cult?'}
                        </p>
                    </>
                )}
            </div>

            {/* Footer / Action Area */}
            <div
                className="relative z-10 w-full max-w-sm px-6"
                style={{ paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
            >
                {isIntro ? (
                    <button
                        onClick={handleNext}
                        className="group w-full h-14 bg-brand-neon text-black hover:bg-yellow-300 rounded-xl border-2 border-black/20 flex items-center justify-between px-6 shadow-[0_0_30px_rgba(204,255,0,0.4),6px_6px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <span className="font-bold text-lg uppercase tracking-widest">
                            {currentStep === totalSteps - 1 ? "Let's Go" : 'Next'}
                        </span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </button>
                ) : isArtistDetails ? (
                    <button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        disabled={artistTags.size === 0}
                        className="group w-full h-14 bg-brand-neon text-black hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed rounded-xl border-2 border-black/20 flex items-center justify-between px-6 shadow-[0_0_20px_rgba(204,255,0,0.3)] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <span className="font-bold text-lg uppercase tracking-widest">Confirm Specs</span>
                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </button>
                ) : isLogin ? (
                    <>
                        {isLoading ? (
                            <div className="w-full h-14 bg-black/60 backdrop-blur border border-brand-neon/30 text-white rounded-xl flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-brand-neon border-t-transparent rounded-full animate-spin" />
                                <span className="font-mono text-xs uppercase tracking-widest text-brand-neon">Authenticating...</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleGoogleLogin}
                                className="group w-full h-14 bg-white hover:bg-gray-100 text-black rounded-xl border-2 border-black flex items-center justify-center gap-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="font-bold text-base tracking-tight">
                                    {role === 'ARTIST' ? 'Connect Artist ID' : 'Continue with Google'}
                                </span>
                                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" size={18} />
                            </button>
                        )}
                        <p className="text-center mt-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            By entering, you agree to the Vibe Check Policy.
                        </p>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Onboarding;
