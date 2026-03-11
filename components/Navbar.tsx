import React from 'react';
import { Home, Search, Plus, MessageSquare, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, unreadCount = 0 }) => {
  const iconSize = 22;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pointer-events-none" style={{ paddingBottom: 'max(1.75rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}>
      <div className="max-w-md mx-auto flex justify-center">
        <nav
          className="glass-panel rounded-full flex items-center gap-1 px-4 py-2.5 pointer-events-auto"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07)' }}
        >
          {/* Feed */}
          <button
            onClick={() => onTabChange('feed')}
            aria-label="Feed"
            className={`p-3 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'feed'
                ? 'text-brand-orange bg-brand-orange/10'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Home size={iconSize} strokeWidth={activeTab === 'feed' ? 2.5 : 1.5} />
          </button>

          {/* Discover */}
          <button
            onClick={() => onTabChange('search')}
            aria-label="Discover"
            className={`p-3 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'search'
                ? 'text-brand-orange bg-brand-orange/10'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Search size={iconSize} strokeWidth={activeTab === 'search' ? 2.5 : 1.5} />
          </button>

          {/* Center Upload — elevated */}
          <button
            onClick={() => onTabChange('upload')}
            aria-label="Upload"
            className="mx-2 w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
            style={{ boxShadow: '0 0 28px rgba(255,107,53,0.65), 0 4px 16px rgba(0,0,0,0.5)' }}
          >
            <Plus size={28} strokeWidth={2.5} className="text-black" />
          </button>

          {/* DMs with badge */}
          <button
            onClick={() => onTabChange('chat')}
            aria-label="Messages"
            className={`relative p-3 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'chat'
                ? 'text-brand-orange bg-brand-orange/10'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <MessageSquare size={iconSize} strokeWidth={activeTab === 'chat' ? 2.5 : 1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 min-w-[14px] h-3.5 bg-brand-orange rounded-full flex items-center justify-center text-[8px] font-bold text-black px-0.5 leading-none pointer-events-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => onTabChange('profile')}
            aria-label="Profile"
            className={`p-3 rounded-full transition-all duration-200 active:scale-90 ${
              activeTab === 'profile'
                ? 'text-brand-orange bg-brand-orange/10'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <User size={iconSize} strokeWidth={activeTab === 'profile' ? 2.5 : 1.5} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
