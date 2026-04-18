import React from 'react';
import { ChatSession, Product, User } from '../types';
import { Avatar, avatarFor, colorFor, Icons } from '../components/ui';

interface MessagesListProps {
  sessions: ChatSession[];
  onSelectSession: (product: Product) => void;
  onViewProfile: (user: User) => void;
  accent?: string;
  dark?: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
  sessions, onSelectSession, accent = '#FF6B35', dark = true,
}) => {
  const fg   = dark ? '#FAF6EC' : '#0A0A0A';
  const bg   = dark ? '#0A0A0A' : '#F2EAD8';
  const card = dark ? '#141414' : '#FAF6EC';
  const totalUnread = sessions.reduce((n, s) => n + s.unreadCount, 0);

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: fg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ paddingTop: 62, padding: '62px 20px 14px', borderBottom: `1px solid ${fg}12`, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h1 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 34, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
            dms<span style={{ color: accent }}>.</span>
          </h1>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.6, letterSpacing: '0.08em' }}>
            {totalUnread} UNREAD
          </span>
        </div>
        <div style={{
          marginTop: 14, padding: '10px 14px', background: card, borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${fg}12`,
        }}>
          <Icons.Search width={18} height={18} style={{ opacity: 0.5, flexShrink: 0 }} />
          <span style={{ fontSize: 13, opacity: 0.5 }}>search conversations...</span>
        </div>
      </div>

      {/* Thread list */}
      <div className="no-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 0 110px' }}>
        {sessions.map(s => {
          const uc = colorFor(s.otherUser.id);
          const av = s.otherUser.avatar || avatarFor(s.otherUser.name, uc);
          return (
            <button key={s.id} onClick={() => onSelectSession(s.product)} style={{
              display: 'flex', gap: 12, padding: '12px 20px', background: 'none', border: 'none',
              width: '100%', cursor: 'pointer', textAlign: 'left', color: fg,
              borderBottom: `1px solid ${fg}10`,
            }}>
              <Avatar src={av} name={s.otherUser.name} size={52} ring={s.unreadCount > 0 ? accent : undefined} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 14 }}>{s.otherUser.name}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.55 }}>
                    {new Date(s.lastMessage.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: accent, marginTop: 2, letterSpacing: '0.06em' }}>
                  RE: {s.product.title.toUpperCase().slice(0, 28)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, gap: 8 }}>
                  <span style={{
                    fontSize: 12, opacity: s.unreadCount ? 1 : 0.6,
                    fontWeight: s.unreadCount ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {s.lastMessage.text ?? '...'}
                  </span>
                  {s.unreadCount > 0 && (
                    <span style={{
                      flexShrink: 0, minWidth: 18, height: 18, padding: '0 5px',
                      borderRadius: 9, background: accent, color: '#0A0A0A',
                      fontFamily: '"Archivo Black", sans-serif', fontSize: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{s.unreadCount}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
