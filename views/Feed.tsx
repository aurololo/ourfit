import React, { useMemo, useRef, useState } from 'react';
import { Product, User } from '../types';
import { Marquee, Sticker, avatarFor, colorFor, PRODUCT_COLORS } from '../components/ui';

const TICKER = [
  'NEHA.V listed Sari Wrap Skirt ₹9,500',
  'ANYA copped Flower Boy Spezials',
  'KARAN.D opened commissions · 3 slots',
  'DIVYA R vouched by @priya.layers',
  'AARAV shipped Patchwork Bomber → Delhi',
  'ROHAN dropped 2 new fits',
  'PRIYA listed Opium Maxi ₹19,000',
  'ARYAN flipped Puma 1974 Deadstock',
  'NEW ARTIST · Indiranagar, Blr',
  'FITS LIVE · 2,147 · BANGALORE',
];

const CATEGORIES = ['ALL','UPCYCLED','1-OF-1','Y2K','DENIM','OPIUM','SARI','SNEAKERS'];

interface FeedProps {
  products: Product[];
  wishlistIds: Set<string>;
  onProductSelect: (p: Product) => void;
  onToggleWishlist: (e: React.MouseEvent, id: string) => void;
  onViewProfile: (u: User) => void;
  accent?: string;
  dark?: boolean;
  motion?: boolean;
}

const Feed: React.FC<FeedProps> = ({
  products, onProductSelect, onViewProfile,
  accent = '#FF6B35', dark = true, motion = true,
}) => {
  const [cat, setCat]       = useState('ALL');
  const [sort, setSort]     = useState('HOT');
  const [scroll, setScroll] = useState(0);
  const scrollRef           = useRef<HTMLDivElement>(null);

  const fg   = dark ? '#FAF6EC' : '#0A0A0A';
  const bg   = dark ? '#0A0A0A' : '#F2EAD8';

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== 'ALL') {
      list = list.filter(p => p.tags.some(t => t.toUpperCase().includes(cat)));
    }
    if (sort === 'HOT')   list.sort((a, b) => b.auraScore - a.auraScore);
    if (sort === 'NEW')   list.reverse();
    if (sort === 'CHEAP') list.sort((a, b) => a.price - b.price);
    return list;
  }, [products, cat, sort]);

  type Entry = { type: 'product'; data: Product } | { type: 'quote' } | { type: 'commission' };
  const decorated = useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    filtered.forEach((p, i) => {
      out.push({ type: 'product', data: p });
      if (i === 3) out.push({ type: 'quote' });
      if (i === 9) out.push({ type: 'commission' });
    });
    return out;
  }, [filtered]);

  const storyUsers = useMemo(() => {
    const seen = new Set<string>();
    const out: User[] = [];
    products.forEach(p => {
      if (!seen.has(p.owner.id) && out.length < 7) {
        seen.add(p.owner.id);
        out.push(p.owner);
      }
    });
    return out;
  }, [products]);

  const commissionUser = useMemo(() => {
    const found = products.find(p => p.owner.role === 'ARTIST');
    return (found ?? products[0])?.owner ?? null;
  }, [products]);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: bg, color: fg,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: '"Archivo", sans-serif',
    }}>
      {/* Header */}
      <div style={{
        paddingTop: 54, flexShrink: 0, zIndex: 10,
        background: dark ? 'rgba(10,10,10,0.88)' : 'rgba(242,234,216,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${fg}14`,
      }}>
        <div style={{ padding: '8px 18px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/OF_Logo.png" alt="OurFit" style={{ height: 42, objectFit: 'contain' }} />
            <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 14, opacity: 0.6 }}>blr</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#CCFF00',
              boxShadow: '0 0 8px #CCFF00', display: 'inline-block', flexShrink: 0,
              animation: motion ? 'flicker 1.6s ease-in-out infinite' : 'none',
            }} />
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.1em', opacity: 0.7 }}>
              2,147 LIVE
            </span>
          </div>
        </div>

        {/* Kinetic ticker */}
        <div style={{
          borderTop: `1px solid ${fg}15`, borderBottom: `1px solid ${fg}15`,
          padding: '5px 0', background: dark ? '#000' : `${fg}05`,
        }}>
          <Marquee items={TICKER} speed={55} sep="◆"
            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.05em' }}
            itemStyle={{ color: fg, opacity: 0.7 }} pause={!motion} />
        </div>

        {/* Category chips */}
        <div className="no-scroll" style={{ padding: '10px 14px 6px', display: 'flex', gap: 7, overflowX: 'auto' }}>
          {CATEGORIES.map((c, i) => {
            const on = cat === c;
            const r  = (i % 2 === 0 ? -1 : 1) * 0.8;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                flexShrink: 0, padding: '7px 14px',
                background: on ? fg : `${fg}10`, color: on ? bg : fg,
                fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 11,
                letterSpacing: '0.06em', border: `1.5px solid ${on ? fg : fg + '55'}`,
                borderRadius: 999, transform: `rotate(${on ? 0 : r}deg)`,
                cursor: 'pointer', transition: 'all .2s',
              }}>{c}</button>
            );
          })}
        </div>

        {/* Stories rail */}
        <div className="no-scroll" style={{ padding: '8px 16px 6px', display: 'flex', gap: 12, overflowX: 'auto' }}>
          {storyUsers.map((u, i) => {
            const uc = colorFor(u.id);
            const av = u.avatar || avatarFor(u.name, uc);
            return (
              <button key={u.id} onClick={() => onViewProfile(u)} style={{
                flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', padding: 0,
              }}>
                <div style={{
                  width: 58, height: 58, borderRadius: '50%', padding: 2, position: 'relative',
                  background: `conic-gradient(from ${i * 60}deg, ${accent}, #CCFF00, #FF3D8A, #00D9FF, ${accent})`,
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', padding: 2, background: bg }}>
                    <img src={av} alt={u.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2, background: '#CCFF00', color: '#0A0A0A',
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 7, fontWeight: 900,
                      padding: '2px 4px', borderRadius: 4, border: '1.5px solid #0A0A0A',
                    }}>LIVE</div>
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: fg,
                  maxWidth: 62, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{u.handle.split('.')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Sort row */}
        <div style={{
          padding: '6px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', opacity: 0.75,
        }}>
          <span>{filtered.length} FITS ◆ {cat}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['HOT', 'NEW', 'CHEAP'] as const).map(s => (
              <button key={s} onClick={() => setSort(s)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: sort === s ? accent : fg,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textDecoration: sort === s ? 'underline' : 'none',
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable masonry */}
      <div
        ref={scrollRef}
        className="no-scroll"
        onScroll={e => setScroll((e.target as HTMLDivElement).scrollTop)}
        style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 120px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, gridAutoFlow: 'dense' }}>
          {decorated.map((entry, i) => {
            if (entry.type === 'quote') {
              return (
                <div key={'q' + i} style={{
                  gridColumn: '1 / -1', padding: '18px 20px', background: accent, color: '#0A0A0A',
                  borderRadius: 14, position: 'relative', overflow: 'hidden', minHeight: 110,
                }}>
                  <div style={{
                    position: 'absolute', top: -10, right: -10,
                    fontSize: 140, opacity: 0.15, fontFamily: '"Instrument Serif", serif', lineHeight: 1,
                  }}>"</div>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 22, lineHeight: 1.1 }}>
                    the garment you wear tonight tells tomorrow who you are.
                  </div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, marginTop: 8, letterSpacing: '0.12em', opacity: 0.7 }}>
                    — OURFIT MANIFESTO · VOL 01
                  </div>
                </div>
              );
            }
            if (entry.type === 'commission') {
              return (
                <div key={'c' + i} onClick={() => commissionUser && onViewProfile(commissionUser)} style={{
                  gridColumn: '1 / -1', padding: '16px', background: '#0A0A0A',
                  color: '#CCFF00', border: '1px solid #CCFF00', borderRadius: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 20, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                      commission open
                    </div>
                    <div style={{ fontSize: 11, marginTop: 3, color: '#FAF6EC', opacity: 0.7 }}>
                      @denim.wiz · 3 slots · open
                    </div>
                  </div>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', background: '#CCFF00',
                    color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Archivo Black", sans-serif', fontSize: 18,
                  }}>→</div>
                </div>
              );
            }

            const p      = entry.data;
            const tall   = i % 3 === 0;
            const pColor = colorFor(p.id, PRODUCT_COLORS);
            const dy     = motion ? -scroll * 0.03 * ((i % 4) - 1.5) : 0;

            return (
              <button key={p.id} onClick={() => onProductSelect(p)} className="enter" style={{
                position: 'relative', padding: 0, border: 'none', background: 'none',
                textAlign: 'left', cursor: 'pointer', borderRadius: 14, overflow: 'hidden',
                aspectRatio: tall ? '3 / 4.2' : '3 / 3.6',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${p.images[0]})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  transform: `translateY(${dy}px)`, transition: 'transform .6s',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%)' }} />

                {/* Top overlay */}
                <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Sticker bg={pColor} rotate={-3} style={{ fontSize: 9, padding: '3px 8px' }}>
                    {(p.tags[0] || 'FIT').toUpperCase()}
                  </Sticker>
                  <div style={{
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    padding: '3px 7px', borderRadius: 4,
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#CCFF00', fontWeight: 700,
                  }}>◆ {p.auraScore}</div>
                </div>

                {/* Bottom info */}
                <div style={{ position: 'relative', padding: '10px 10px 8px', color: '#fff' }}>
                  <div style={{
                    fontFamily: '"Archivo Black", sans-serif', fontSize: tall ? 15 : 13,
                    lineHeight: 1.05, letterSpacing: '-0.02em',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{p.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 3 }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.85 }}>@{p.owner.handle}</span>
                    <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 13 }}>₹{(p.price / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{
          textAlign: 'center', padding: '24px 0 10px',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.4, letterSpacing: '0.12em',
        }}>
          ◆ END OF ARCHIVE ◆
        </div>
      </div>
    </div>
  );
};

export default Feed;
