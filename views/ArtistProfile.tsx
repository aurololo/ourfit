import React, { useState } from 'react';
import { User, Product } from '../types';
import { Avatar, Sticker, Counter, MagButton, Marquee, Icons, avatarFor, colorFor, PRODUCT_COLORS } from '../components/ui';

interface ArtistProfileProps {
  user: User;
  products: Product[];
  onBack: () => void;
  onProductSelect: (p: Product) => void;
  onDmUser: (u: User) => void;
  accent?: string;
  dark?: boolean;
  motion?: boolean;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({
  user, products, onBack, onProductSelect, onDmUser,
  accent = '#FF6B35', dark = true, motion = true,
}) => {
  const fg   = dark ? '#FAF6EC' : '#0A0A0A';
  const bg   = dark ? '#0A0A0A' : '#F2EAD8';
  const [follow, setFollow] = useState(false);

  const works = products.filter(p => p.owner.id === user.id || p.artist?.id === user.id);
  const artistAccent = colorFor(user.id);
  const av = user.avatar || avatarFor(user.name, artistAccent);
  const [first, last = ''] = user.name.split(' ');

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: fg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="no-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>

        {/* Editorial hero */}
        <div style={{ position: 'relative', minHeight: 380, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${artistAccent}ee 0%, ${artistAccent}66 50%, #0A0A0A 100%)`,
          }} />

          <div style={{
            position: 'relative', zIndex: 2, padding: '54px 18px 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <button onClick={onBack} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icons.Back width={20} height={20} />
            </button>
            <div style={{
              padding: '6px 10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              borderRadius: 20, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.08em',
              color: '#CCFF00', border: '1px solid rgba(204,255,0,0.3)',
            }}>◆ CREATOR VERIFIED</div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '28px 18px 0' }}>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 18, color: '#fff', opacity: 0.85 }}>meet —</div>
            <div style={{
              fontFamily: '"Archivo Black", sans-serif', fontSize: 86, lineHeight: 0.82,
              color: '#0A0A0A', letterSpacing: '-0.05em', textTransform: 'uppercase',
              marginTop: 4, textShadow: '3px 3px 0 #FAF6EC', wordBreak: 'break-word',
            }}>{first}</div>
            {last && (
              <div style={{
                fontFamily: '"Archivo Black", sans-serif', fontSize: 54, lineHeight: 0.82,
                color: '#FAF6EC', letterSpacing: '-0.05em', textTransform: 'uppercase',
                textShadow: '3px 3px 0 #0A0A0A', wordBreak: 'break-word',
              }}>{last}.</div>
            )}
          </div>

          {/* Rotating badge */}
          <div style={{
            position: 'absolute', right: -32, bottom: -32, zIndex: 2,
            width: 160, height: 160, borderRadius: '50%',
            background: '#0A0A0A', color: artistAccent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className={motion ? 'spin-slow' : ''} style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <defs>
                  <path id="cp" d="M80,80 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
                </defs>
                <text fill={artistAccent} fontFamily="Archivo Black" fontSize="12" letterSpacing="5">
                  <textPath href="#cp">CREATOR · CREATOR · CREATOR · CREATOR · CREATOR ·</textPath>
                </text>
              </svg>
            </div>
            <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 28, letterSpacing: '-0.04em' }}>◆</div>
          </div>
        </div>

        {/* Avatar strip */}
        <div style={{ padding: '16px 18px 0', display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar src={av} name={user.name} size={60} ring={artistAccent} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: accent, letterSpacing: '0.06em' }}>@{user.handle}</div>
            {user.bio && (
              <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 15, marginTop: 4, opacity: 0.9, lineHeight: 1.2 }}>
                "{user.bio}"
              </div>
            )}
          </div>
        </div>

        {/* Craft tags */}
        {user.crafts && user.crafts.length > 0 && (
          <div style={{ padding: '14px 18px 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {user.crafts.map((c, i) => (
              <span key={c} style={{
                padding: '5px 10px', background: '#0A0A0A', color: artistAccent,
                fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 10,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius: 6, transform: `rotate(${(i % 2 ? 1 : -1) * 1.5}deg)`,
                boxShadow: `2px 2px 0 ${artistAccent}`,
              }}>◆ {c}</span>
            ))}
          </div>
        )}

        {/* Brutal stats grid */}
        <div style={{
          margin: '18px 14px 0', border: `2px solid ${fg}`,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        }}>
          {([['FITS', works.length], ['VOUCHES', user.vouches], ['AURA', user.vibeScore]] as [string, number][]).map(([l, v], i) => (
            <div key={l} style={{
              padding: '14px 8px', textAlign: 'center',
              borderRight: i < 2 ? `2px solid ${fg}` : 'none',
              background: i === 1 ? artistAccent : 'transparent',
              color: i === 1 ? '#0A0A0A' : fg,
            }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 28, lineHeight: 1 }}>
                <Counter to={v} />
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: i === 1 ? 1 : 0.6, letterSpacing: '0.14em', marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ padding: '14px 16px 0', display: 'flex', gap: 8 }}>
          <MagButton onClick={() => setFollow(f => !f)} style={{
            flex: 1, height: 52, borderRadius: 26,
            background: follow ? '#CCFF00' : fg, color: '#0A0A0A', border: 'none',
            fontFamily: '"Archivo Black", sans-serif', fontSize: 13, letterSpacing: '0.06em',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            {follow ? <><Icons.Check width={16} height={16} /> following</> : <>+ follow</>}
          </MagButton>
          <MagButton onClick={() => onDmUser(user)} style={{
            flex: 1, height: 52, borderRadius: 26,
            background: 'transparent', color: fg, border: `1.5px solid ${fg}`,
            fontFamily: '"Archivo Black", sans-serif', fontSize: 13, letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>commission</MagButton>
        </div>

        {/* Section ticker */}
        <div style={{
          marginTop: 26, padding: '8px 0', background: artistAccent, color: '#0A0A0A',
          borderTop: `2px solid ${fg}`, borderBottom: `2px solid ${fg}`,
          fontFamily: '"Archivo Black", sans-serif', fontSize: 12, letterSpacing: '0.1em', overflow: 'hidden',
        }}>
          <Marquee
            items={[`the archive by ${user.handle}`, `${works.length} fits live`, 'one of ones', 'no restocks', `aura ${user.vibeScore}`]}
            speed={35} sep="◆" pause={!motion}
            itemStyle={{ textTransform: 'uppercase' }}
          />
        </div>

        {/* Works */}
        <div style={{ padding: '14px 14px 0' }}>
          {works[0] && (
            <button onClick={() => onProductSelect(works[0])} style={{
              width: '100%', padding: 0, background: 'none', border: 'none', cursor: 'pointer',
              marginBottom: 10, position: 'relative', aspectRatio: '3/4',
              borderRadius: 14, overflow: 'hidden', textAlign: 'left',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${works[0].images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center',
              }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 50%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <Sticker bg={artistAccent} rotate={-3}>◆ FEATURED</Sticker>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: '#fff' }}>
                <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 26, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
                  {works[0].title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, opacity: 0.85 }}>
                    SIZE {works[0].specs?.size ?? '—'} · {works[0].specs?.material ?? '—'}
                  </span>
                  <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22 }}>₹{(works[0].price / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </button>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {works.slice(1).map(p => (
              <button key={p.id} onClick={() => onProductSelect(p)} style={{
                padding: 0, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${p.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0) 45%)' }} />
                <div style={{ position: 'absolute', top: 6, left: 6 }}>
                  <Sticker bg={colorFor(p.id, PRODUCT_COLORS)} rotate={-3} style={{ fontSize: 8, padding: '2px 6px' }}>
                    {(p.tags[0] || 'FIT').toUpperCase()}
                  </Sticker>
                </div>
                <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, color: '#fff' }}>
                  <div style={{
                    fontFamily: '"Archivo Black", sans-serif', fontSize: 11, textTransform: 'uppercase', lineHeight: 1.05,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{p.title}</div>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 14, marginTop: 2, color: artistAccent }}>
                    ₹{(p.price / 1000).toFixed(1)}k
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Artist quote */}
        <div style={{
          margin: '22px 14px 0', padding: '22px', background: '#0A0A0A', color: '#FAF6EC',
          borderRadius: 14, position: 'relative', overflow: 'hidden',
          border: `1px solid ${artistAccent}40`,
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -10,
            fontFamily: '"Instrument Serif", serif', fontSize: 160, opacity: 0.15,
            color: artistAccent, lineHeight: 1,
          }}>"</div>
          <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 20, lineHeight: 1.25 }}>
            I don't make clothes. I make objects you wear until they become part of who you remember being.
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, marginTop: 12, letterSpacing: '0.12em', color: artistAccent }}>
            — {user.name.toUpperCase()} · ARTIST STATEMENT
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
