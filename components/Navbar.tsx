import React from 'react';
import { Icons } from './ui';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
  accent?: string;
  dark?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  activeTab, onTabChange, unreadCount = 0, accent = '#FF6B35', dark = true,
}) => {
  const bg   = dark ? 'rgba(14,14,14,0.88)' : 'rgba(250,246,236,0.94)';
  const fg   = dark ? '#FAF6EC' : '#0A0A0A';
  const mute = dark ? 'rgba(250,246,236,0.38)' : 'rgba(10,10,10,0.38)';

  const tabs = [
    { k: 'feed',    Icon: Icons.Home,   label: 'FEED' },
    { k: 'search',  Icon: Icons.Search, label: 'FIND' },
    { k: 'upload',  Icon: Icons.Plus,   label: 'DROP' },
    { k: 'chat',    Icon: Icons.Chat,   label: 'DM' },
    { k: 'profile', Icon: Icons.User,   label: 'YOU' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 20px)', maxWidth: 430, zIndex: 30,
      padding: '0 10px',
      pointerEvents: 'none',
    }}>
      <nav style={{
        background: bg,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: dark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(10,10,10,0.09)',
        borderRadius: 32, padding: '10px 8px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
        pointerEvents: 'auto',
      }}>
        {tabs.map(({ k, Icon, label }) => {
          const on = activeTab === k;
          const isUpload = k === 'upload';

          if (isUpload) {
            return (
              <button
                key={k}
                onClick={() => onTabChange(k)}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: accent, color: '#0A0A0A',
                  border: '2px solid #0A0A0A', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: -22,
                  boxShadow: `0 6px 22px ${accent}99`,
                  transition: 'transform .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(90deg) scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(0) scale(1)')}
              >
                <Icon width={26} height={26} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={k}
              onClick={() => onTabChange(k)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center',
                color: on ? fg : mute, padding: '6px 10px', position: 'relative',
              }}
            >
              {on && (
                <div style={{
                  position: 'absolute', top: -2,
                  width: 5, height: 5, borderRadius: '50%', background: accent,
                }} />
              )}
              <Icon width={22} height={22} />
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
              }}>{label}</span>
              {k === 'chat' && unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 6,
                  minWidth: 14, height: 14, padding: '0 3px',
                  borderRadius: 7, background: accent, color: '#0A0A0A',
                  fontFamily: '"Archivo Black", sans-serif', fontSize: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
