import React, { useState, useEffect, useRef } from 'react';
import { Product, ChatMessage, User } from '../types';
import { ArrowLeft, Send, Check, X as XIcon, ShoppingBag, ShieldCheck, Camera, Mic, Smile, Ticket, Play } from 'lucide-react';
import { AVATAR_FALLBACK, IMG_FALLBACK } from '../constants';
import { generateSellerChat } from '../services/geminiService';

interface ChatInterfaceProps {
  product: Product;
  onBack: () => void;
  onNavigateToShipping: (product: Product) => void;
  onViewProfile?: (user: User) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ product, onBack, onNavigateToShipping, onViewProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCopped, setIsCopped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // useRef mirror keeps messages in sync for async generateSellerChat calls
  const messagesRef = useRef<ChatMessage[]>([]);

  const [avatarSrc, setAvatarSrc] = useState(product.owner.avatar);
  const [prodImgSrc, setProdImgSrc] = useState(product.images?.[0] || IMG_FALLBACK);

  // Initialize Chat + seller auto-greeting
  useEffect(() => {
    const initMsg: ChatMessage = {
      id: 'sys-1',
      senderId: 'system',
      text: `You started a chat with @${product.owner.handle}`,
      type: 'SYSTEM',
      timestamp: new Date()
    };
    messagesRef.current = [initMsg];
    setMessages([initMsg]);

    // Seller sends an opening message after a short delay
    const greetingDelay = 1200 + Math.random() * 800;
    const greetings = [
      `Hey! 👋 Thanks for checking out the ${product.title}. Feel free to ask me anything about it!`,
      `Yo, what's up! Saw you looking at my ${product.title} 😄 Any questions? I'm around.`,
      `Hey hey! Yeah this piece is pretty special ngl. DM me if you wanna know more about condition, sizing, etc.`,
      `Haan bhai, dekh lo — ${product.title}, quite rare yaar. Any doubts just ask 🙌`,
      `Anna, thanks for the interest! Let me know if you want more pics or details on the ${product.title}.`,
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const greetMsg: ChatMessage = {
          id: 'seller-greet',
          senderId: 'artist',
          text: greeting,
          type: 'TEXT',
          timestamp: new Date()
        };
        messagesRef.current = [...messagesRef.current, greetMsg];
        setMessages(prev => [...prev, greetMsg]);
      }, 1000 + Math.random() * 600);
    }, greetingDelay);

    return () => clearTimeout(timer);
  }, [product]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isRecording]);

  const addMessage = (msg: ChatMessage) => {
    messagesRef.current = [...messagesRef.current, msg];
    setMessages(prev => [...prev, msg]);
  };

  const simulateTyping = (duration: number = 1500) => {
    setIsTyping(true);
    return new Promise(resolve => setTimeout(() => {
      setIsTyping(false);
      resolve(true);
    }, duration));
  };

  const handleSellerResponse = async (userLastMsg: string) => {
    await simulateTyping(1000 + Math.random() * 1500);

    const response = await generateSellerChat(product, product.owner, messagesRef.current, userLastMsg);

    addMessage({
      id: Date.now().toString(),
      senderId: 'artist',
      text: response.text,
      type: response.offerAction === 'COUNTER_OFFER' ? 'OFFER' : 'TEXT',
      offerAmount: response.counterAmount,
      offerStatus: response.offerAction === 'COUNTER_OFFER' ? 'PENDING' : undefined,
      timestamp: new Date()
    });

    if (response.offerAction === 'ACCEPT_OFFER') {
      setMessages(prev => {
        const newMsgs = [...prev];
        for (let i = newMsgs.length - 1; i >= 0; i--) {
          if (newMsgs[i].type === 'OFFER' && newMsgs[i].senderId === 'me' && newMsgs[i].offerStatus === 'PENDING') {
            newMsgs[i] = { ...newMsgs[i], offerStatus: 'ACCEPTED' };
            break;
          }
        }
        return newMsgs;
      });
      setTimeout(() => triggerCoppedAnimation(), 800);
    } else if (response.offerAction === 'DECLINE_OFFER') {
      setMessages(prev => {
        const newMsgs = [...prev];
        for (let i = newMsgs.length - 1; i >= 0; i--) {
          if (newMsgs[i].type === 'OFFER' && newMsgs[i].senderId === 'me' && newMsgs[i].offerStatus === 'PENDING') {
            newMsgs[i] = { ...newMsgs[i], offerStatus: 'DECLINED' };
            break;
          }
        }
        return newMsgs;
      });
    }
  };

  const handleSendText = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue("");
    addMessage({
      id: Date.now().toString(),
      senderId: 'me',
      text: text,
      type: 'TEXT',
      timestamp: new Date()
    });
    await handleSellerResponse(text);
  };

  const handleSendOffer = async (amount: number) => {
    addMessage({
      id: Date.now().toString(),
      senderId: 'me',
      type: 'OFFER',
      offerAmount: amount,
      offerStatus: 'PENDING',
      timestamp: new Date()
    });
    await handleSellerResponse(`I'm offering ₹${amount}`);
  };

  // Fixed: single handler, resets input so same file can be sent again
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMessage({
        id: Date.now().toString(),
        senderId: 'me',
        type: 'IMAGE',
        attachmentUrl: url,
        timestamp: new Date()
      });
      handleSellerResponse("[Sent an image]");
    }
    e.target.value = '';
  };

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      addMessage({
        id: Date.now().toString(),
        senderId: 'me',
        type: 'AUDIO',
        text: 'Voice Message (0:07)',
        timestamp: new Date()
      });
      handleSellerResponse("[Sent a voice note]");
    }
  };

  const handleAcceptCounter = (messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, offerStatus: 'ACCEPTED' } : m
    ));
    setTimeout(async () => {
      addMessage({
        id: Date.now().toString(),
        senderId: 'artist',
        text: "Locked in. Shipping it out tomorrow.",
        type: 'TEXT',
        timestamp: new Date()
      });
      setTimeout(() => triggerCoppedAnimation(), 800);
    }, 500);
  };

  const handleDeclineCounter = (messageId: string) => {
    addMessage({
      id: Date.now().toString(),
      senderId: 'me',
      text: "Can't do that much.",
      type: 'TEXT',
      timestamp: new Date()
    });
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, offerStatus: 'DECLINED' } : m
    ));
    handleSellerResponse("Can't do that much.");
  };

  const triggerCoppedAnimation = () => {
    setIsCopped(true);
    setTimeout(() => {
      onNavigateToShipping(product);
    }, 3000);
  };

  return (
    <div className="flex flex-col bg-brand-black relative overflow-hidden" style={{ height: '100dvh' }}>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      {/* COPPED OVERLAY */}
      {isCopped && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-brand-neon text-black animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mb-6 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] animate-bounce">
              <ShoppingBag size={40} className="text-brand-neon" />
            </div>
            <h1 className="text-6xl font-display font-bold uppercase tracking-tighter mb-2">COPPED</h1>
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full font-mono text-sm font-bold uppercase">
              <ShieldCheck size={16} className="text-brand-green" />
              <span>Payment Secured</span>
            </div>
            <p className="mt-8 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">Redirecting to Shipping...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-safe px-4 pb-4 border-b border-white/10 flex items-center gap-4 bg-brand-dark/95 backdrop-blur-md relative z-10 shadow-lg">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div
          onClick={() => onViewProfile && onViewProfile(product.owner)}
          className="flex-1 flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <img
              src={avatarSrc}
              onError={() => setAvatarSrc(AVATAR_FALLBACK)}
              className="w-10 h-10 object-cover rounded-full border border-white/20 bg-gray-800"
              alt="user"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand-green rounded-full border-2 border-brand-dark" />
          </div>
          <div>
            <p className="font-bold text-sm group-hover:text-brand-orange transition-colors">@{product.owner.handle}</p>
            <span className={`text-[10px] text-gray-400 ${isTyping ? "text-brand-orange animate-pulse" : ""}`}>
              {isTyping ? "Typing..." : "Online"}
            </span>
          </div>
        </div>

        {/* Product Pill */}
        <div className="flex items-center gap-2 bg-black/40 pr-3 rounded-lg border border-white/5 backdrop-blur-sm">
          <img
            src={prodImgSrc}
            onError={() => setProdImgSrc(IMG_FALLBACK)}
            className="w-10 h-10 object-cover rounded-l-lg bg-gray-800"
            alt="product"
          />
          <div className="py-1">
            <p className="text-[10px] uppercase text-gray-400 font-bold">Ref</p>
            <p className="text-xs font-bold text-brand-orange">₹{product.price}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          const isSystem = msg.type === 'SYSTEM';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <span className="text-[10px] font-mono text-gray-500 bg-white/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-widest">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 group`}>
              {!isMe && (
                <img
                  src={avatarSrc}
                  onError={(e) => e.currentTarget.src = AVATAR_FALLBACK}
                  className="w-8 h-8 rounded-full border border-white/10 bg-gray-800 object-cover mb-1"
                  alt="them"
                />
              )}

              <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.type === 'TEXT' && (
                  <div className={`px-5 py-3 text-sm leading-relaxed shadow-lg transition-transform group-hover:scale-[1.01] ${
                    isMe
                    ? 'bg-gradient-to-br from-brand-orange to-orange-600 text-black font-medium rounded-2xl rounded-br-none shadow-[4px_4px_0px_rgba(0,0,0,0.2)]'
                    : 'bg-gradient-to-br from-[#1A1A1A] to-[#252525] border border-white/10 text-gray-100 rounded-2xl rounded-bl-none shadow-[0_4px_10px_rgba(0,0,0,0.3)]'
                  }`}>
                    {msg.text}
                  </div>
                )}

                {msg.type === 'IMAGE' && (
                  <div className={`p-2 rounded-2xl border ${isMe ? 'bg-white/10 border-white/20' : 'bg-[#1A1A1A] border-white/10'}`}>
                    <img src={msg.attachmentUrl} className="max-w-full h-auto rounded-xl max-h-60" alt="attachment" />
                  </div>
                )}

                {msg.type === 'AUDIO' && (
                  <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[160px] ${isMe ? 'bg-brand-orange text-black' : 'bg-[#1A1A1A] text-white border border-white/10'}`}>
                    <button className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center active:scale-90">
                      <Play size={14} className="fill-current" />
                    </button>
                    <div className="flex-1 h-8 flex items-center gap-0.5">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 rounded-full bg-current opacity-60" style={{ height: `${20 + (i * 7) % 80}%` }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono opacity-60">0:07</span>
                  </div>
                )}

                {msg.type === 'OFFER' && (
                  <div className={`relative p-5 rounded-lg border-2 shadow-xl transition-all ${
                    msg.offerStatus === 'ACCEPTED'
                    ? 'bg-brand-green/10 border-brand-green shadow-[0_0_15px_rgba(57,255,20,0.15)]'
                    : msg.offerStatus === 'DECLINED'
                      ? 'bg-red-500/10 border-red-500 opacity-70'
                      : isMe
                        ? 'bg-black border-brand-orange'
                        : 'bg-[#121212] border-white/20'
                  }`}>
                    <div className="absolute -left-2 top-1/2 w-4 h-4 bg-brand-black rounded-full" />
                    <div className="absolute -right-2 top-1/2 w-4 h-4 bg-brand-black rounded-full" />

                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Ticket size={14} className={isMe ? 'text-brand-orange' : 'text-gray-400'} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          {isMe ? 'You Offered' : 'Counter Offer'}
                        </span>
                      </div>
                      {msg.offerStatus === 'ACCEPTED' && <Check size={16} className="text-brand-green" />}
                      {msg.offerStatus === 'DECLINED' && <XIcon size={16} className="text-red-500" />}
                    </div>

                    <div className={`text-3xl font-mono font-bold mb-4 text-center ${
                      msg.offerStatus === 'ACCEPTED' ? 'text-brand-green'
                      : msg.offerStatus === 'DECLINED' ? 'text-red-500 line-through'
                      : 'text-white'
                    }`}>
                      ₹{msg.offerAmount}
                    </div>

                    {msg.offerStatus === 'PENDING' && !isMe && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptCounter(msg.id)}
                          className="flex-1 py-2 bg-brand-green text-black text-xs font-bold uppercase rounded hover:bg-green-400 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineCounter(msg.id)}
                          className="flex-1 py-2 bg-white/10 text-white text-xs font-bold uppercase rounded hover:bg-white/20 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {msg.offerStatus === 'PENDING' && isMe && (
                      <div className="text-[10px] text-gray-500 font-mono text-center w-full bg-white/5 py-1 rounded">
                        Waiting for seller...
                      </div>
                    )}
                    {msg.offerStatus === 'ACCEPTED' && (
                      <div className="text-xs font-bold uppercase text-brand-green flex items-center justify-center gap-2 border-t border-brand-green/20 pt-2 animate-pulse drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
                        <ShieldCheck size={14} /> Offer Accepted
                      </div>
                    )}
                    {msg.offerStatus === 'DECLINED' && (
                      <div className="text-xs font-bold uppercase text-red-500 flex items-center justify-center gap-1 border-t border-red-500/20 pt-2">
                        Offer Declined
                      </div>
                    )}
                  </div>
                )}

                <span className={`text-[9px] text-gray-500 mt-1.5 font-mono font-bold opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-200 ml-10">
            <div className="bg-[#1A1A1A] px-4 py-3 rounded-2xl rounded-bl-none border border-white/10 flex gap-1 items-center shadow-md">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 pt-4 bg-[#121212] border-t border-white/10 relative z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]" style={{ paddingBottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}>
        {/* Quick Offer Chips */}
        {!isRecording && (
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {[product.price * 0.7, product.price * 0.85, product.price * 0.95].map(price => (
              <button
                key={price}
                onClick={() => handleSendOffer(Math.floor(price / 100) * 100)}
                className="flex-shrink-0 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-brand-orange hover:text-black hover:border-brand-orange transition-all group active:scale-95"
              >
                <span className="text-[10px] uppercase font-bold text-gray-400 block group-hover:text-black/60 mb-0.5">Offer</span>
                <span className="font-mono text-sm font-bold block">₹{Math.floor(price / 100) * 100}</span>
              </button>
            ))}
          </div>
        )}

        {isRecording ? (
          <div className="flex items-center gap-4 bg-red-900/20 border border-red-500/30 rounded-3xl p-3 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <span className="flex-1 text-red-400 font-mono text-sm font-bold">Recording...</span>
            <button onClick={handleMicClick} className="p-2 bg-red-500 text-white rounded-full active:scale-90">
              <Send size={18} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-end">
            {/* Fixed: removed duplicate ImageIcon button; Camera + Mic only */}
            <div className="flex gap-1 pb-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-gray-400 hover:text-brand-orange hover:bg-white/5 rounded-full transition-colors active:scale-90"
                title="Send photo"
              >
                <Camera size={22} />
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileSelect} />

              <button
                onClick={handleMicClick}
                className="p-2.5 text-gray-400 hover:text-brand-blue hover:bg-white/5 rounded-full transition-colors active:scale-90"
                title="Voice note"
              >
                <Mic size={22} />
              </button>
            </div>

            {/* Input */}
            <div className="flex-1 relative bg-black border border-white/20 rounded-3xl flex items-center shadow-inner transition-colors focus-within:border-brand-orange/50">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="Message..."
                className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none text-white placeholder:text-gray-600"
              />
              {/* Emoji button — cosmetic in demo */}
              <button className="p-2 pr-3 text-gray-600 hover:text-yellow-400 transition-colors" title="Emoji">
                <Smile size={18} />
              </button>
            </div>

            {/* Send */}
            <button
              onClick={handleSendText}
              disabled={!inputValue.trim()}
              className="p-3 bg-brand-orange text-black rounded-full hover:scale-105 active:scale-90 transition-all disabled:opacity-40 disabled:scale-100 shadow-[0_0_15px_rgba(255,107,53,0.4)]"
            >
              <Send size={20} className={inputValue.trim() ? "fill-black" : ""} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
