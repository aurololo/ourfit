import React, { useState } from 'react';
import { Product, User } from '../types';
import { Sticker, Avatar, MagButton, Counter, colorFor, avatarFor, PRODUCT_COLORS } from '../components/ui';
import { Icons } from '../components/ui';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onChat: (product: Product, offerAmount?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onViewProfile: (user: User) => void;
  onNavigateToShipping: (product: Product) => void;
  accent?: string;
  dark?: boolean;
  motion?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product: p, onBack, onChat, isWishlisted, onToggleWishlist, onViewProfile, onNavigateToShipping,
  accent = '#FF6B35', dark = true, motion = true,
}) => {
  const [liked, setLiked]       = useState(isWishlisted);
  const [zoom, setZoom]         = useState(false);
  const [offer, setOffer]       = useState(false);
  const [offerVal, setOfferVal] = useState(Math.round(p.price * 0.88));
  const [showUpi, setShowUpi]   = useState(false);

  const fg   = dark ? '#FAF6EC' : '#0A0A0A';
  const bg   = dark ? '#0A0A0A' : '#F2EAD8';
  const card = dark ? '#141414' : '#FAF6EC';

  const pColor  = colorFor(p.id, PRODUCT_COLORS);
  const ownerAv = p.owner.avatar || avatarFor(p.owner.name, colorFor(p.owner.id));
  const similar = [];
  const specs   = p.specs ?? { size: '—', material: '—', year: '—' };

  const handleLike = () => {
    setLiked(l => !l);
    onToggleWishlist(p.id);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: fg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="no-scroll" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Hero image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3 / 4.1', overflow: 'hidden' }}>
          <div
            onClick={() => setZoom(z => !z)}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${p.images[0]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              transform: zoom ? 'scale(1.18)' : 'scale(1)',
              transition: motion ? 'transform .6s cubic-bezier(.22,1,.36,1)' : 'none',
              cursor: 'zoom-in',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.62) 100%)' }} />

          {/* Top controls */}
          <div style={{ position: 'absolute', top: 54, left: 0, right: 0, padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
            <button onClick={onBack} style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.Back width={22} height={22} />
            </button>
            <button onClick={handleLike} style={{
              width: 42, height: 42, borderRadius: '50%',
              background: liked ? '#FF3D8A' : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
              border: liked ? 'none' : '1px solid rgba(255,255,255,0.2)',
              color: liked ? '#0A0A0A' : '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: liked ? 'scale(1.08)' : 'scale(1)', transition: 'transform .3s',
            }}>
              {liked ? <Icons.Heart width={20} height={20} /> : <Icons.HeartOut width={20} height={20} />}
            </button>
          </div>

          {/* Bottom stickers */}
          <div style={{ position: 'absolute', left: 14, bottom: 18, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Sticker bg={pColor} rotate={-3}>{(p.tags[0] || 'FIT').toUpperCase()}</Sticker>
            <Sticker bg="#CCFF00" rotate={2}>◆ AURA {p.auraScore}</Sticker>
            {specs.year && <Sticker bg="#FAF6EC" rotate={-1}>{specs.year}</Sticker>}
          </div>

          {/* Dot indicators */}
          <div style={{ position: 'absolute', right: 14, bottom: 24, display: 'flex', gap: 5 }}>
            {[0, 1, 2, 3].map(j => (
              <div key={j} style={{
                width: j === 0 ? 14 : 6, height: 6, borderRadius: 3,
                background: j === 0 ? '#FAF6EC' : 'rgba(255,255,255,0.4)',
              }} />
            ))}
          </div>
        </div>

        {/* Title block */}
        <div style={{ padding: '18px 20px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <h1 style={{
              fontFamily: '"Archivo Black", sans-serif', fontSize: 30, lineHeight: 0.92,
              letterSpacing: '-0.035em', margin: 0, maxWidth: '72%', textTransform: 'uppercase',
            }}>{p.title}</h1>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 28, color: accent, lineHeight: 1 }}>
                ₹{(p.price / 1000).toFixed(1)}k
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.55, marginTop: 2, letterSpacing: '0.1em' }}>
                FIRM · NEG OK
              </div>
            </div>
          </div>
          <p style={{
            fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
            fontSize: 17, lineHeight: 1.3, opacity: 0.85, marginTop: 16,
          }}>"{p.description}"</p>
        </div>

        {/* Specs row */}
        <div style={{ padding: '4px 20px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {([['SIZE', specs.size], ['MATERIAL', specs.material], ['YEAR', specs.year]] as [string,string][]).map(([k, v]) => (
            <div key={k} style={{ background: card, padding: '10px 12px', borderRadius: 10, border: `1px solid ${fg}12` }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, opacity: 0.55, letterSpacing: '0.12em' }}>{k}</div>
              <div style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 12, marginTop: 4 }}>{v || '—'}</div>
            </div>
          ))}
        </div>

        {/* Artist strip */}
        <div style={{ padding: '0 16px' }}>
          <button onClick={() => onViewProfile(p.owner)} style={{
            width: '100%', padding: '14px', background: card, border: `1px solid ${fg}12`,
            borderRadius: 16, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
            color: fg,
          }}>
            <Avatar src={ownerAv} name={p.owner.name} size={50} ring={pColor} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 14, textTransform: 'uppercase' }}>{p.owner.name}</span>
                <span style={{ fontSize: 10, color: '#CCFF00' }}>◆</span>
              </div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 1 }}>@{p.owner.handle}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, marginTop: 4, letterSpacing: '0.08em', color: accent }}>
                {p.owner.vouches} VOUCHES · AURA {p.owner.vibeScore}
              </div>
            </div>
            <Icons.Arrow width={20} height={20} style={{ opacity: 0.5 }} />
          </button>
        </div>

        {/* Vouched-by block */}
        <div style={{
          margin: '14px 16px', padding: '14px', borderRadius: 16,
          background: dark ? '#000' : '#FAF6EC', border: `1px dashed ${fg}22`,
        }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.12em', opacity: 0.6 }}>◆ VOUCHED BY</div>
          <div style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
            {[p.owner, ...(p.artist ? [p.artist] : [])].slice(0, 4).map((u, j) => (
              <div key={u.id} style={{ marginLeft: j ? -10 : 0, zIndex: 10 - j }}>
                <Avatar src={u.avatar || avatarFor(u.name, colorFor(u.id))} name={u.name} size={30} ring={colorFor(u.id)} />
              </div>
            ))}
            <div style={{ marginLeft: 8, fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 14, opacity: 0.85 }}>
              + {Math.max(0, p.auraScore - 3)} others
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ padding: '6px 16px 4px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {p.tags.map(t => (
            <span key={t} style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              padding: '4px 8px', borderRadius: 4, background: `${fg}10`, color: fg, letterSpacing: '0.04em',
            }}>#{t}</span>
          ))}
        </div>

        <div style={{ height: 140 }} />
      </div>

      {/* Sticky CTA bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '12px 16px 30px',
        background: dark
          ? 'linear-gradient(to top, #0A0A0A 62%, rgba(10,10,10,0))'
          : 'linear-gradient(to top, #F2EAD8 62%, rgba(242,234,216,0))',
      }}>
        {offer ? (
          <div style={{ background: card, padding: '14px', borderRadius: 18, border: `1px solid ${fg}15` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.6, letterSpacing: '0.1em' }}>YOUR OFFER</span>
              <button onClick={() => setOffer(false)} style={{ background: 'none', border: 'none', color: fg, opacity: 0.6, cursor: 'pointer' }}>
                <Icons.Close width={18} height={18} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
              <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 36, color: accent }}>₹{offerVal.toLocaleString('en-IN')}</span>
              <span style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 14, opacity: 0.5 }}>of ₹{p.price.toLocaleString('en-IN')}</span>
            </div>
            <input type="range" min={Math.round(p.price * 0.5)} max={p.price} value={offerVal}
              onChange={e => setOfferVal(+e.target.value)}
              style={{ width: '100%', accentColor: accent, marginTop: 8 }} />
            <MagButton onClick={() => onChat(p, offerVal)} style={{
              width: '100%', marginTop: 10, height: 48, borderRadius: 24,
              background: accent, color: '#0A0A0A', border: 'none',
              fontFamily: '"Archivo Black", sans-serif', fontSize: 13,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}>send offer →</MagButton>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <MagButton onClick={() => setOffer(true)} style={{
                flex: 1, height: 50, borderRadius: 25,
                background: 'transparent', color: fg, border: `1.5px solid ${fg}35`,
                fontFamily: '"Archivo Black", sans-serif', fontSize: 12,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}>make offer</MagButton>
              <MagButton onClick={() => onChat(p)} style={{
                flex: 1, height: 50, borderRadius: 25,
                background: `${fg}12`, color: fg, border: `1.5px solid ${fg}30`,
                fontFamily: '"Archivo Black", sans-serif', fontSize: 12,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icons.Send width={15} height={15} /> dm seller
              </MagButton>
            </div>
            <MagButton onClick={() => setShowUpi(true)} style={{
              width: '100%', height: 56, borderRadius: 28,
              background: '#CCFF00', color: '#0A0A0A', border: 'none',
              fontFamily: '"Archivo Black", sans-serif', fontSize: 14,
              letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
            }}>BUY NOW · ₹{(p.price / 1000).toFixed(1)}k</MagButton>
          </div>
        )}
      </div>

      {/* UPI Payment modal */}
      {showUpi && (
        <div onClick={() => setShowUpi(false)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: dark ? '#0F0F0F' : '#FAF6EC',
            borderRadius: '28px 28px 0 0', padding: '6px 20px 44px',
            border: `1px solid ${fg}15`,
          }}>
            <div style={{ width: 40, height: 4, background: `${fg}30`, borderRadius: 2, margin: '12px auto 20px' }} />
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', opacity: 0.5, marginBottom: 6 }}>◆ SECURE CHECKOUT</div>
            <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 32, letterSpacing: '-0.03em', color: fg }}>
              ₹{p.price.toLocaleString('en-IN')}
            </div>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 14, opacity: 0.6, marginBottom: 20, color: fg }}>
              {p.title}
            </div>
            <div style={{ background: `${fg}08`, borderRadius: 14, padding: '12px 14px', marginBottom: 20, border: `1px solid ${fg}12` }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.5, letterSpacing: '0.1em', color: fg }}>UPI ID</div>
              <div style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 16, marginTop: 4, color: fg }}>ourfit@upi</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'GPay', color: '#1A73E8', icon: '◈' },
                { label: 'PhonePe', color: '#5F259F', icon: '◉' },
                { label: 'Paytm', color: '#002970', icon: '◎' },
              ].map(({ label, color, icon }) => (
                <button key={label} onClick={() => { setShowUpi(false); onNavigateToShipping(p); }} style={{
                  height: 52, borderRadius: 14, background: `${color}18`,
                  border: `1.5px solid ${color}55`, color: fg, cursor: 'pointer',
                  fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>{icon}</span> Pay with {label}
                </button>
              ))}
              <button onClick={() => { setShowUpi(false); onNavigateToShipping(p); }} style={{
                height: 56, borderRadius: 16, marginTop: 4,
                background: '#CCFF00', color: '#0A0A0A', border: 'none', cursor: 'pointer',
                fontFamily: '"Archivo Black", sans-serif', fontSize: 14,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>◆ CONFIRM PAYMENT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
