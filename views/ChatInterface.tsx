import React, { useEffect, useRef, useState } from 'react';
import { Product, User, ChatMessage } from '../types';
import { Avatar, Sticker, Icons, avatarFor, colorFor, PRODUCT_COLORS } from '../components/ui';
import { generateSellerChat } from '../services/geminiService';

interface ChatInterfaceProps {
  product: Product;
  onBack: () => void;
  onNavigateToShipping: (product: Product) => void;
  onViewProfile: (user: User) => void;
  accent?: string;
  dark?: boolean;
  initialOfferAmount?: number;
}

const buildInitialMessages = (p: Product, seller: User, offerAmount?: number): ChatMessage[] => {
  const base: ChatMessage[] = [
    { id: '1', senderId: seller.id, text: `yo, interested in the ${p.title.toLowerCase()}?`, type: 'TEXT', timestamp: new Date(Date.now() - 12 * 60000) },
    { id: '2', senderId: 'me', text: 'yes!! is it still available?', type: 'TEXT', timestamp: new Date(Date.now() - 10 * 60000) },
    { id: '3', senderId: seller.id, text: 'for you, yes ◆', type: 'TEXT', timestamp: new Date(Date.now() - 9 * 60000) },
  ];
  if (offerAmount) {
    return [...base, {
      id: '4', senderId: 'me',
      text: `my offer: ₹${offerAmount.toLocaleString('en-IN')}`,
      type: 'OFFER' as const,
      offerAmount,
      timestamp: new Date(Date.now() - 60000),
    }];
  }
  return [...base,
    { id: '4', senderId: 'me', text: `how firm are you on ₹${p.price.toLocaleString('en-IN')}?`, type: 'TEXT', timestamp: new Date(Date.now() - 8 * 60000) },
    { id: '5', senderId: seller.id, text: `I can do ₹${Math.round(p.price * 0.94).toLocaleString('en-IN')} if you pick up today.`, type: 'TEXT', timestamp: new Date(Date.now() - 6 * 60000) },
  ];
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  product: p, onBack, onViewProfile, accent = '#FF6B35', dark = true, initialOfferAmount,
}) => {
  const seller    = p.owner;
  const sellerAv  = seller.avatar || avatarFor(seller.name, colorFor(seller.id));
  const pColor    = colorFor(p.id, PRODUCT_COLORS);
  const fg        = dark ? '#FAF6EC' : '#0A0A0A';
  const bg        = dark ? '#0A0A0A' : '#F2EAD8';
  const card      = dark ? '#141414' : '#FAF6EC';

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    buildInitialMessages(p, seller, initialOfferAmount)
  );
  const [draft,   setDraft]   = useState('');
  const [typing,  setTyping]  = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Auto-respond to an initial offer placed from ProductDetail
  useEffect(() => {
    if (!initialOfferAmount) return;
    const initMsgs = buildInitialMessages(p, seller, initialOfferAmount);
    setTyping(true);
    (async () => {
      try {
        const reply = await generateSellerChat(p, seller, initMsgs, '');
        const replyText = typeof reply === 'string' ? reply : (reply?.text ?? 'sure, lmk!');
        await new Promise(r => setTimeout(r, 700));
        setMessages(prev => [...prev, { id: Date.now().toString(), senderId: seller.id, text: replyText, type: 'TEXT', timestamp: new Date() }]);
      } catch {
        setMessages(prev => [...prev, { id: Date.now().toString(), senderId: seller.id, text: 'sure, lmk!', type: 'TEXT', timestamp: new Date() }]);
      } finally {
        setTyping(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate typing then AI response
  const simulateReply = async (userText: string) => {
    setTyping(true);
    try {
      const reply = await generateSellerChat(p, seller, messages, userText);
      const replyText = typeof reply === 'string' ? reply : (reply?.text ?? 'sure, lmk!');
      await new Promise(r => setTimeout(r, 700));
      setMessages(prev => [...prev, {
        id: Date.now().toString(), senderId: seller.id,
        text: replyText, type: 'TEXT', timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), senderId: seller.id,
        text: 'sure, lmk!', type: 'TEXT', timestamp: new Date(),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSend = async () => {
    const txt = draft.trim();
    if (!txt) return;
    setDraft('');
    const msg: ChatMessage = { id: Date.now().toString(), senderId: 'me', text: txt, type: 'TEXT', timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    if (!loading) { setLoading(true); await simulateReply(txt); setLoading(false); }
  };

  const fmtTime = (d: Date) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, color: fg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Thread header */}
      <div style={{
        paddingTop: 54, padding: '54px 14px 12px',
        borderBottom: `1px solid ${fg}12`,
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        background: dark ? 'rgba(10,10,10,0.92)' : 'rgba(242,234,216,0.92)',
        backdropFilter: 'blur(16px)',
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'none', border: `1px solid ${fg}20`, color: fg, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icons.Back width={18} height={18} />
        </button>
        <button onClick={() => onViewProfile(seller)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
          <Avatar src={sellerAv} name={seller.name} size={40} ring={accent} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 14 }}>{seller.name}</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#CCFF00', letterSpacing: '0.08em' }}>
            ◆ ACTIVE 2M AGO
          </div>
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9, padding: '4px 8px',
          background: `${fg}10`, borderRadius: 6, letterSpacing: '0.08em', flexShrink: 0,
        }}>AURA {seller.vibeScore}</div>
      </div>

      {/* Context pill */}
      <div style={{
        margin: '10px 14px 0', padding: '8px 10px', background: card, border: `1px solid ${fg}15`,
        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 6, flexShrink: 0,
          backgroundImage: `url(${p.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            RE: {p.title}
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.6, letterSpacing: '0.08em', marginTop: 1 }}>
            ₹{p.price.toLocaleString('en-IN')} · {p.specs?.size ?? '—'}
          </div>
        </div>
        <Icons.Arrow width={14} height={14} style={{ opacity: 0.4, flexShrink: 0 }} />
      </div>

      {/* Messages */}
      <div ref={listRef} className="no-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ alignSelf: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.4, letterSpacing: '0.1em', margin: '6px 0' }}>
          ◆ TODAY ◆
        </div>

        {messages.map(m => {
          const mine = m.senderId === 'me';
          return (
            <div key={m.id} style={{
              alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%',
              display: 'flex', flexDirection: 'column', gap: 2,
              alignItems: mine ? 'flex-end' : 'flex-start', position: 'relative',
            }}>
              {m.type === 'OFFER' ? (
                <div style={{
                  padding: '12px 14px', background: mine ? accent : card,
                  color: mine ? '#0A0A0A' : fg,
                  borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: `2px solid ${mine ? 'rgba(0,0,0,0.15)' : accent + '44'}`,
                }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, letterSpacing: '0.14em', opacity: 0.7, marginBottom: 4 }}>◆ OFFER SENT</div>
                  <div style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: 22, lineHeight: 1 }}>₹{m.offerAmount?.toLocaleString('en-IN')}</div>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 11, opacity: 0.65, marginTop: 3 }}>awaiting response...</div>
                </div>
              ) : (
                <div style={{
                  padding: '9px 14px',
                  background: mine ? accent : card,
                  color: mine ? '#0A0A0A' : fg,
                  borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: 14, lineHeight: 1.25, fontWeight: mine ? 600 : 500,
                }}>{m.text}</div>
              )}
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, opacity: 0.45, letterSpacing: '0.08em', marginTop: 2 }}>
                {fmtTime(new Date(m.timestamp))}{mine ? ' · READ' : ''}
              </span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 4, padding: '10px 14px', background: card, borderRadius: '18px 18px 18px 4px' }}>
            {[0, 1, 2].map(j => (
              <div key={j} style={{
                width: 6, height: 6, borderRadius: '50%', background: fg, opacity: 0.5,
                animation: `typing 1.2s ease-in-out ${j * 0.15}s infinite`,
              }} />
            ))}
          </div>
        )}
        <style>{`
          @keyframes typing {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </div>

      {/* Composer */}
      <div style={{
        padding: '8px 12px 30px', borderTop: `1px solid ${fg}12`,
        display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
        background: dark ? 'rgba(10,10,10,0.95)' : 'rgba(242,234,216,0.95)',
      }}>
        <div style={{
          flex: 1, background: card, borderRadius: 22,
          padding: '10px 14px', border: `1px solid ${fg}15`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="write back..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: fg, fontFamily: '"Archivo", sans-serif', fontSize: 14,
            }}
          />
          <Icons.Mic width={18} height={18} style={{ opacity: 0.4, flexShrink: 0 }} />
        </div>
        <button onClick={handleSend} disabled={!draft.trim()} style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: draft.trim() ? accent : `${fg}20`, border: 'none',
          color: draft.trim() ? '#0A0A0A' : fg, cursor: draft.trim() ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s',
        }}>
          <Icons.Send width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
