import React, { useState } from 'react';
import { ChatSession, Product, User } from '../types';
import { MessageSquare, CheckCheck, Banknote, ArrowUpRight, CornerDownLeft, Edit3 } from 'lucide-react';
import { AVATAR_FALLBACK, IMG_FALLBACK } from '../constants';

interface MessagesListProps {
    sessions: ChatSession[];
    onSelectSession: (product: Product) => void;
    onViewProfile?: (user: User) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({ sessions, onSelectSession, onViewProfile }) => {
    const [filter, setFilter] = useState<'ALL' | 'BUYING' | 'SELLING'>('ALL');

    // Apply filter logic — was completely missing before
    const filteredSessions = sessions.filter(session => {
        if (filter === 'ALL') return true;
        // BUYING: I initiated (sent the first message / I'm the buyer)
        // SELLING: The other user initiated (I'm the seller)
        if (filter === 'BUYING') return session.lastMessage.senderId === 'me';
        if (filter === 'SELLING') return session.lastMessage.senderId !== 'me';
        return true;
    });

    const totalUnread = sessions.reduce((sum, s) => sum + s.unreadCount, 0);

    return (
        <div className="overflow-y-auto overflow-x-hidden bg-brand-black pb-24 px-4 relative" style={{ height: '100dvh', paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 0.5rem))' }}>

            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h1 className="text-4xl font-display font-bold uppercase flex items-center gap-2">
                        <MessageSquare className="text-brand-orange" size={30} />
                        DMs
                    </h1>
                    {totalUnread > 0 && (
                        <p className="text-xs font-mono text-brand-orange mt-1">
                            {totalUnread} unread {totalUnread === 1 ? 'message' : 'messages'}
                        </p>
                    )}
                </div>
                <button className="p-2 bg-brand-orange/10 rounded-full border border-brand-orange/20 hover:bg-brand-orange/20 text-brand-orange transition-colors">
                    <Edit3 size={18} />
                </button>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 mb-6 pb-2 relative z-10">
                {(['ALL', 'BUYING', 'SELLING'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                            filter === f
                            ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3 relative z-10">
                {filteredSessions.length > 0 ? filteredSessions.map(session => {
                    const isOffer = session.lastMessage.type === 'OFFER';
                    const isUnread = session.unreadCount > 0;
                    const isMe = session.lastMessage.senderId === 'me';

                    return (
                        <div
                            key={session.id}
                            className={`group relative overflow-hidden p-4 rounded-xl border transition-all duration-300 cursor-pointer active:scale-[0.99] ${
                                isUnread
                                ? 'bg-[#121212] border-l-4 border-l-brand-orange border-y-white/5 border-r-white/5 shadow-lg'
                                : 'bg-black border border-white/5 hover:border-white/20'
                            }`}
                        >
                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                            <div className="flex gap-4 items-start relative z-10">
                                {/* Avatar */}
                                <div
                                    className="relative z-20 cursor-pointer flex-shrink-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewProfile && onViewProfile(session.otherUser);
                                    }}
                                >
                                    <img
                                        src={session.otherUser.avatar}
                                        onError={(e) => e.currentTarget.src = AVATAR_FALLBACK}
                                        alt={session.otherUser.name}
                                        className={`w-14 h-14 rounded-full object-cover border-2 bg-gray-800 hover:scale-105 transition-transform ${isUnread ? 'border-brand-orange' : 'border-gray-800'}`}
                                    />
                                    {isUnread && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center text-black text-[10px] font-bold shadow-sm">
                                            {session.unreadCount > 9 ? '9+' : session.unreadCount}
                                        </div>
                                    )}
                                </div>

                                {/* Main Content */}
                                <div
                                    className="flex-1 min-w-0 pt-1"
                                    onClick={() => onSelectSession(session.product)}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-bold truncate text-base ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                                            {session.otherUser.name}
                                        </h3>
                                        <span className="text-[10px] text-gray-600 font-mono font-bold flex-shrink-0 ml-2">
                                            {session.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <p className="text-[10px] text-violet-400 uppercase font-bold tracking-wider mb-2 truncate">
                                        Ref: {session.product.title}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        {isMe ? (
                                            <ArrowUpRight size={14} className="text-gray-500 flex-shrink-0" />
                                        ) : (
                                            <CornerDownLeft size={14} className={`flex-shrink-0 ${isUnread ? 'text-brand-orange' : 'text-gray-500'}`} />
                                        )}

                                        <p className={`text-sm truncate flex-1 flex items-center gap-2 ${isUnread ? 'text-gray-100 font-medium' : 'text-gray-500'}`}>
                                            {isOffer ? (
                                                <span className="text-brand-green flex items-center gap-1 font-mono">
                                                    <Banknote size={14} />
                                                    OFFER: ₹{session.lastMessage.offerAmount}
                                                </span>
                                            ) : (
                                                session.lastMessage.text
                                            )}
                                        </p>

                                        {isMe && (
                                            <CheckCheck size={14} className="text-brand-blue opacity-50 flex-shrink-0" />
                                        )}
                                    </div>
                                </div>

                                {/* Product Thumbnail */}
                                <div
                                    className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity bg-gray-800 flex-shrink-0"
                                    onClick={() => onSelectSession(session.product)}
                                >
                                    <img
                                        src={session.product.images?.[0] || IMG_FALLBACK}
                                        onError={(e) => e.currentTarget.src = IMG_FALLBACK}
                                        alt="item"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                            <MessageSquare size={32} className="text-gray-600" />
                        </div>
                        <p className="text-sm font-mono font-bold uppercase tracking-widest">
                            {filter === 'ALL' ? 'No DMs yet.' : `No ${filter.toLowerCase()} chats.`}
                        </p>
                        <p className="text-xs mt-2 text-gray-600 font-mono">
                            {filter === 'ALL' ? 'Start haggling.' : 'Try a different filter.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesList;
