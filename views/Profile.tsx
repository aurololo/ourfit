import React, { useState } from 'react';
import { User, Product } from '../types';
import { Avatar, Sticker, Counter, Icons, avatarFor, colorFor, PRODUCT_COLORS } from '../components/ui';

interface ProfileProps {
  user: User;
  products: Product[];
  wishlistIds: Set<string>;
  onProductSelect: (p: Product) => void;
  isOwnProfile: boolean;
  onBack?: () => void;
  onDmUser?: (user: User) => void;
  accent?: string;
  dark?: boolean;
  layout?: 'grid' | 'cards' | 'zine';
}

const Profile: React.FC<ProfileProps> = ({
  user, products, wishlistIds, onProductSelect, isOwnProfile, onBack, onDmUser,
  accent = '#FF6B35', dark = true, layout = 'grid',
}) => {
  const [tab, setTab] = useState<'collected' | 'wishlist' | 'listed'>('collected');
  const fg   = dark ? '#FAF6EC' : '#0A0A0A';
  const bg   = dark ? '#0A0A0A' : '#F2EAD8';
  const card = dark ? '#141414' : '#FAF6EC';

  const uc  = colorFor(user.id);
  const av  = user.avatar || avatarFor(user.name, uc);

  const listed    = products.filter(p => p.owner.id === user.id);
  const wishlist  = products.filter(p => wishlistIds.has(p.id));
  const collected = products.slice(0, Math.min(9, products.length));
  const source    = tab === 'wishlist' ? wishlist : tab === 'collected' ? collected : listed;

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: fg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="no-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>

        <div style={{ paddingTop: 54, padding: '54px 20px 0', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            {!isOwnProfile && onBack ? (
              <button onClick={onBack} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `${fg}10`, border: 'none', color: fg, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icons.Back width={18} height={18} /></button>
            ) : (
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.6, letterSpacing: '0.1em' }}>
                @{user.handle}
              </span>
            )}
            <Icons.Settings width={20} height={20} style={{ opacity: 0.5 }} />
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ position: 'relative' }}>
              <Avatar src={av} name={user.name} size={86} ring={accent} />
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                background: '#CCFF00', color: '#0A0A0A',
                fontFamily: '"Archivo Black", sans-serif', fontSize: 10,
                padding: '3px 6px', borderRadius: 6, border: '2px solid #0A0A0A',
                letterSpacing: '0.04em',
              }}>{user.role}</div>
            </div>
            <div style={{ flex: 1, paddingTop: 6 }}>
              <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                {user.name}
              </div>
              {user.bio && (
                <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 14, opacity: 0.75, marginTop: 3 }}>
                  "{user.bio}"
                </div>
              )}
              <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                <Sticker bg={accent} rotate={-2}>◆ AURA {user.vibeScore}</Sticker>
                <Sticker bg="#CCFF00" rotate={2}>{user.vouches} VOUCHES</Sticker>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            border: `1px solid ${fg}15`, borderRadius: 14, overflow: 'hidden',
          }}>
            {[
              [14, 'COPPED'],
              [wishlist.length, 'WISH'],
              [user.vouches, 'VOUCHED'],
              [listed.length, 'LISTED'],
            ].map(([v, l], i) => (
              <div key={l as string} style={{
                padding: '10px 4px', textAlign: 'center',
                borderRight: i < 3 ? `1px solid ${fg}15` : 'none',
              }}>
                <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 20 }}>
                  <Counter to={v as number} />
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, opacity: 0.6, letterSpacing: '0.12em', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {isOwnProfile ? (
              <>
                <button style={{
                  flex: 1, height: 42, borderRadius: 21,
                  background: fg, color: bg, border: 'none', cursor: 'pointer',
                  fontFamily: '"Archivo Black", sans-serif', fontSize: 12,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>edit profile</button>
                <button style={{
                  flex: 1, height: 42, borderRadius: 21,
                  background: 'transparent', color: fg, border: `1.5px solid ${fg}30`, cursor: 'pointer',
                  fontFamily: '"Archivo Black", sans-serif', fontSize: 12,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>share archive</button>
              </>
            ) : (
              <>
                <button style={{
                  flex: 1, height: 42, borderRadius: 21,
                  background: fg, color: bg, border: 'none', cursor: 'pointer',
                  fontFamily: '"Archivo Black", sans-serif', fontSize: 12,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>+ follow</button>
                <button onClick={() => onDmUser?.(user)} style={{
                  flex: 1, height: 42, borderRadius: 21,
                  background: accent, color: '#0A0A0A', border: 'none', cursor: 'pointer',
                  fontFamily: '"Archivo Black", sans-serif', fontSize: 12,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>message</button>
              </>
            )}
          </div>
        </div>

        <div style={{
          marginTop: 22, padding: '0 20px', borderBottom: `1px solid ${fg}12`,
          display: 'flex', gap: 22,
        }}>
          {([
            { k: 'collected', l: 'COLLECTED', n: collected.length },
            { k: 'wishlist',  l: 'WISHLIST',  n: wishlist.length },
            { k: 'listed',    l: 'LISTED',    n: listed.length },
          ] as const).map(t => {
            const on = tab === t.k;
            return (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 0', position: 'relative',
                color: fg, opacity: on ? 1 : 0.5,
                fontFamily: '"Archivo", sans-serif', fontWeight: 900, fontSize: 11, letterSpacing: '0.08em',
              }}>
                {t.l} <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 400, opacity: 0.7 }}>({t.n})</span>
                {on && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: accent }} />}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '12px 12px 0' }}>
          {layout === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {source.map(p => (
                <button key={p.id} onClick={() => onProductSelect(p)} style={{
                  aspectRatio: '1 / 1', border: 'none', padding: 0, background: 'none', cursor: 'pointer',
                  position: 'relative', borderRadius: 6, overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, backgroundImage: `url(${p.images[0]})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 4, left: 4, right: 4,
                    color: '#fff', fontFamily: '"Archivo Black", sans-serif', fontSize: 10,
                    textShadow: '0 1px 3px rgba(0,0,0,0.6)', textAlign: 'left',
                  }}>₹{(p.price / 1000).toFixed(1)}k</div>
                </button>
              ))}
            </div>
          ) : layout === 'cards' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 6px' }}>
              {source.map(p => (
                <button key={p.id} onClick={() => onProductSelect(p)} style={{
                  display: 'flex', gap: 12, padding: 10, background: card, borderRadius: 14,
                  border: `1px solid ${fg}12`, cursor: 'pointer', textAlign: 'left', color: fg,
                }}>
                  <div style={{ width: 80, height: 80, borderRadius: 8, backgroundImage: `url(${p.images[0]})`, backgroundSize: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Sticker bg={colorFor(p.id, PRODUCT_COLORS)} rotate={-2}>{(p.tags[0] || 'FIT').toUpperCase()}</Sticker>
                    <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 14, marginTop: 4, textTransform: 'uppercase' }}>{p.title}</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.6, marginTop: 3 }}>₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 4 }}>
              {source.map((p, i) => (
                <button key={p.id} onClick={() => onProductSelect(p)} style={{
                  gridColumn: i % 3 === 0 ? '1 / -1' : 'auto',
                  aspectRatio: i % 3 === 0 ? '2 / 1' : '1 / 1.3',
                  border: 'none', padding: 0, cursor: 'pointer',
                  backgroundImage: `url(${p.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  borderRadius: 6, position: 'relative',
                }}>
                  <div style={{ position: 'absolute', top: 6, left: 6 }}>
                    <Sticker bg={colorFor(p.id, PRODUCT_COLORS)} rotate={-3} style={{ fontSize: 8, padding: '2px 6px' }}>
                      {(p.tags[0] || 'FIT').toUpperCase()}
                    </Sticker>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '22px 20px 0' }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.12em', opacity: 0.6, marginBottom: 10 }}>
            ◆ VOUCHED BY
          </div>
          <div className="no-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {products.slice(0, 6).map(p => p.owner)
              .filter((u, i, arr) => arr.findIndex(x => x.id === u.id) === i).slice(0, 5).map(u => (
                <div key={u.id} style={{
                  flexShrink: 0, width: 84, background: card, padding: 10, borderRadius: 12,
                  border: `1px solid ${fg}12`, textAlign: 'center',
                }}>
                  <Avatar
                    src={u.avatar || avatarFor(u.name, colorFor(u.id))}
                    name={u.name} size={48} ring={colorFor(u.id)}
                    style={{ margin: '0 auto' }}
                  />
                  <div style={{
                    fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 10, marginTop: 6,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>@{u.handle}</div>
                </div>
              ))}
          </div>
        </div>

        <div style={{ height: 30 }} />
      </div>
    </div>
  );
};

export default Profile;
