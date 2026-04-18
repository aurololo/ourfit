import React, { useEffect, useRef, useState } from 'react';

// ── Design tokens ────────────────────────────────────────────────────────────
export const ACCENTS = [
  { k: '#FF6B35', name: 'saffron' },
  { k: '#CCFF00', name: 'neon' },
  { k: '#FF3D8A', name: 'pink' },
  { k: '#C7B3FF', name: 'lilac' },
  { k: '#00D9FF', name: 'cyan' },
  { k: '#39FF14', name: 'toxic' },
];

export const PRODUCT_COLORS = ['#FF6B35','#CCFF00','#FF3D8A','#C7B3FF','#00D9FF','#39FF14','#FF6B35','#CCFF00'];
export const USER_COLORS   = ['#FF6B35','#CCFF00','#FF3D8A','#C7B3FF','#00D9FF','#39FF14'];

export function colorFor(id: string, palette = USER_COLORS): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return palette[Math.abs(h) % palette.length];
}

export function avatarFor(name: string, color: string): string {
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <defs>
      <pattern id='s' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
        <rect width='4' height='8' fill='${color}'/>
        <rect x='4' width='4' height='8' fill='%230A0A0A'/>
      </pattern>
    </defs>
    <rect width='200' height='200' fill='url(%23s)'/>
    <rect x='20' y='70' width='160' height='60' fill='%230A0A0A'/>
    <text x='100' y='115' font-family='Archivo Black,Archivo,sans-serif' font-weight='900'
          font-size='50' fill='${color}' text-anchor='middle' letter-spacing='2'>${initials}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ── Counter ──────────────────────────────────────────────────────────────────
interface CounterProps { to: number; prefix?: string; suffix?: string; duration?: number; }
export const Counter: React.FC<CounterProps> = ({ to, prefix = '', suffix = '', duration = 900 }) => {
  const [v, setV] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.floor(to * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setV(to);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration]);
  return <span>{prefix}{v.toLocaleString('en-IN')}{suffix}</span>;
};

// ── Marquee ──────────────────────────────────────────────────────────────────
interface MarqueeProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  sep?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  pause?: boolean;
}
export const Marquee: React.FC<MarqueeProps> = ({
  items, speed = 35, reverse = false, sep = '◆', style = {}, itemStyle = {}, pause = false,
}) => {
  const content = items.map((t, i) => (
    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, padding: '0 22px', ...itemStyle }}>
      <span>{t}</span>
      <span style={{ opacity: 0.5 }}>{sep}</span>
    </span>
  ));
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', ...style }}>
      <div style={{
        display: 'inline-flex',
        animation: `${reverse ? 'marq-rev' : 'marq'} ${speed}s linear infinite`,
        animationPlayState: pause ? 'paused' : 'running',
      }}>
        {content}{content}
      </div>
    </div>
  );
};

// ── Sticker ──────────────────────────────────────────────────────────────────
interface StickerProps {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
}
export const Sticker: React.FC<StickerProps> = ({
  children, bg = '#CCFF00', color = '#0A0A0A', rotate = -2, style = {},
}) => (
  <span style={{
    display: 'inline-block', padding: '4px 10px',
    fontFamily: '"Archivo", sans-serif', fontWeight: 900, fontSize: 10,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    background: bg, color, borderRadius: 4,
    boxShadow: '2px 2px 0 #0A0A0A', transform: `rotate(${rotate}deg)`,
    flexShrink: 0,
    ...style,
  }}>{children}</span>
);

// ── MagButton ────────────────────────────────────────────────────────────────
interface MagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export const MagButton: React.FC<MagButtonProps> = ({ children, style, ...rest }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left - r.width / 2) * 0.25;
    const my = (e.clientY - r.top - r.height / 2) * 0.35;
    el.style.transform = `translate(${mx}px,${my}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <button ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      transition: 'transform .35s cubic-bezier(.22,1,.36,1), background .2s, color .2s',
      cursor: 'pointer', ...style,
    }} {...rest}>{children}</button>
  );
};

// ── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  src: string;
  name: string;
  size?: number;
  ring?: string;
  style?: React.CSSProperties;
}
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 44, ring, style = {} }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
    boxShadow: ring ? `0 0 0 2px ${ring}, 0 0 0 4px #0a0a0a` : 'none',
    ...style,
  }}>
    <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
);

// ── Icons ────────────────────────────────────────────────────────────────────
type SvgProps = React.SVGProps<SVGSVGElement>;
export const Icons = {
  Home:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1V11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Search:  (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Plus:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>,
  Chat:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  User:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 21c1-4 4-7 8-7s7 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Back:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Heart:   (p: SvgProps) => <svg viewBox="0 0 24 24" width={24} height={24} {...p}><path d="M12 21s-8-5.5-8-11a5 5 0 019-3 5 5 0 019 3c0 5.5-8 11-8 11z" fill="currentColor"/></svg>,
  HeartOut:(p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M12 21s-8-5.5-8-11a5 5 0 019-3 5 5 0 019 3c0 5.5-8 11-8 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Close:   (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Arrow:   (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Send:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M3 11l18-7-7 18-2.5-8L3 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Mic:     (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Cam:     (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M4 8h4l2-3h4l2 3h4v11H4V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
  Settings:(p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  Check:   (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Grid:    (p: SvgProps) => <svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...p}><rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.8"/><rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.8"/><rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.8"/></svg>,
};
