import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './views/Feed';
import ProductDetail from './views/ProductDetail';
import ChatInterface from './views/ChatInterface';
import Discovery from './views/Discovery';
import UploadFlow from './views/UploadFlow';
import Profile from './views/Profile';
import ArtistProfile from './views/ArtistProfile';
import MessagesList from './views/MessagesList';
import Onboarding from './views/Onboarding';
import ShippingPage from './views/ShippingPage';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_CHATS, ARTIST_USER } from './constants';

// Distinct seed avatars per user so DMs never look identical before real photos load
const CHAT_AVATAR_SEEDS: Record<string, string> = {
  'a1': 'https://ui-avatars.com/api/?name=Divya+R&background=FF6B35&color=fff&size=200&bold=true',
  'u8': 'https://ui-avatars.com/api/?name=Neha+V&background=7C3AED&color=fff&size=200&bold=true',
  'u4': 'https://ui-avatars.com/api/?name=Rohan+M&background=1D4ED8&color=fff&size=200&bold=true',
};
import { Product, User } from './types';
import { fetchIndianAvatars } from './services/userService';

// ── localStorage helpers ─────────────────────────────────────────────────────
const LS = {
  AUTH: 'ourfit_auth',
  UPLOADS: 'ourfit_uploads',
  WISHLIST: 'ourfit_wishlist',
  TWEAKS: 'ourfit_tweaks',
};

interface Tweaks {
  accent: string;
  dark: boolean;
  motion: boolean;
  profileLayout: 'grid' | 'cards' | 'zine';
}

const DEFAULT_TWEAKS: Tweaks = {
  accent: '#FF6B35',
  dark: true,
  motion: true,
  profileLayout: 'grid',
};

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore quota errors (base64 images can be large)
  }
}

interface StoredAuth {
  isAuthenticated: boolean;
  role: 'BUYER' | 'ARTIST';
  crafts: string[];
}

function resolveInitialUser(auth: StoredAuth | null): User {
  if (!auth || !auth.isAuthenticated) return MOCK_USER;
  return auth.role === 'ARTIST'
    ? { ...ARTIST_USER, crafts: auth.crafts ?? ARTIST_USER.crafts }
    : MOCK_USER;
}
// ────────────────────────────────────────────────────────────────────────────

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [products, setProducts] = useState<Product[]>(() => {
    // Always clear auth on load — onboarding must restart on every refresh (mock experience)
    localStorage.removeItem(LS.AUTH);
    const storedUploads = lsGet<Product[]>(LS.UPLOADS, []);
    return [...storedUploads, ...MOCK_PRODUCTS];
  });
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [chatOfferAmount, setChatOfferAmount] = useState<number | undefined>(undefined);
  const [shippingProduct, setShippingProduct] = useState<Product | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(
    new Set(lsGet<string[]>(LS.WISHLIST, []))
  );
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [tweaks] = useState<Tweaks>(() => lsGet<Tweaks>(LS.TWEAKS, DEFAULT_TWEAKS));
  const { accent, dark, motion, profileLayout } = tweaks;
  const [chatSessions, setChatSessions] = useState(() =>
    MOCK_CHATS.map(s => ({
      ...s,
      otherUser: CHAT_AVATAR_SEEDS[s.otherUser.id]
        ? { ...s.otherUser, avatar: CHAT_AVATAR_SEEDS[s.otherUser.id] }
        : s.otherUser,
    }))
  );

  const navigate = useNavigate();

  // Fetch real Indian user photos from randomuser.me and apply to products + chat sessions
  useEffect(() => {
    fetchIndianAvatars().then(avatarMap => {
      if (!Object.keys(avatarMap).length) return;
      setProducts(prev => prev.map(p => ({
        ...p,
        owner: avatarMap[p.owner.id] ? { ...p.owner, avatar: avatarMap[p.owner.id] } : p.owner,
        artist: p.artist && avatarMap[p.artist.id] ? { ...p.artist, avatar: avatarMap[p.artist.id] } : p.artist,
      })));
      setChatSessions(prev => prev.map(s => ({
        ...s,
        otherUser: avatarMap[s.otherUser.id]
          ? { ...s.otherUser, avatar: avatarMap[s.otherUser.id] }
          : s.otherUser,
      })));
    });
  }, []);

  const handleLogin = (role?: 'BUYER' | 'ARTIST', crafts?: string[]) => {
    const resolvedRole = role ?? 'BUYER';
    const resolvedCrafts = crafts ?? [];
    if (resolvedRole === 'ARTIST') {
      setCurrentUser({ ...ARTIST_USER, crafts: resolvedCrafts.length ? resolvedCrafts : ARTIST_USER.crafts });
    } else {
      setCurrentUser(MOCK_USER);
    }
    lsSet(LS.AUTH, { isAuthenticated: true, role: resolvedRole, crafts: resolvedCrafts });
    setIsAuthenticated(true);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'upload') {
      setShowUpload(true);
      return;
    }
    setActiveTab(tab);
    // Reset stack views when switching tabs
    setSelectedProduct(null);
    setChatProduct(null);
    setShippingProduct(null);
    setViewingUser(null);

    if (tab === 'feed') navigate('/');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackFromDetail = () => {
    setSelectedProduct(null);
  };

  const handleStartChat = (product: Product, offerAmount?: number) => {
    setChatProduct(product);
    setChatOfferAmount(offerAmount);
  };

  const handleBackFromChat = () => {
    setChatProduct(null);
    setChatOfferAmount(undefined);
  };

  const handleNavigateToShipping = (product: Product) => {
    setChatProduct(null);
    setShippingProduct(product);
  };

  const handleBackFromShipping = () => {
    setShippingProduct(null);
    setActiveTab('feed');
  };

  const handleDmUser = (user: User) => {
    // Find a product from this user to anchor the chat to
    const userProduct = products.find(p => p.owner.id === user.id);
    if (userProduct) {
      setViewingUser(null);
      setChatProduct(userProduct);
    }
  };

  const handleUploadSuccess = (newProduct: Product) => {
    setProducts(prev => {
      const next = [newProduct, ...prev];
      // Persist only user-uploaded products (mock products are always loaded from constants)
      const userUploads = next.filter(p => p.id.startsWith('new_'));
      lsSet(LS.UPLOADS, userUploads);
      return next;
    });
    setShowUpload(false);
    setActiveTab('feed');
  };

  const handleToggleWishlist = (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      lsSet(LS.WISHLIST, Array.from(next));
      return next;
    });
  };

  const handleViewProfile = (user: User) => {
    if (user.id === currentUser.id) {
      setActiveTab('profile');
      setSelectedProduct(null);
      setChatProduct(null);
    } else {
      setViewingUser(user);
    }
  };

  const handleBackFromProfile = () => {
    setViewingUser(null);
  };

  const handleEditProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  // Unread count for Navbar badge
  const totalUnread = chatSessions.reduce((sum, s) => sum + s.unreadCount, 0);

  // Auth gate
  if (!isAuthenticated) {
    return <Onboarding onLogin={handleLogin} />;
  }

  // Stack views (ordered by priority)
  if (showUpload) {
    return (
      <UploadFlow
        onClose={() => setShowUpload(false)}
        onSuccess={handleUploadSuccess}
        currentUser={currentUser}
      />
    );
  }

  if (viewingUser && !selectedProduct) {
    if (viewingUser.role === 'ARTIST') {
      return (
        <ArtistProfile
          user={viewingUser}
          products={products}
          onBack={handleBackFromProfile}
          onProductSelect={handleProductSelect}
          onDmUser={handleDmUser}
          accent={accent}
          dark={dark}
          motion={motion}
        />
      );
    }
    return (
      <Profile
        user={viewingUser}
        products={products}
        wishlistIds={new Set()}
        onProductSelect={handleProductSelect}
        isOwnProfile={false}
        onBack={handleBackFromProfile}
        onDmUser={handleDmUser}
        accent={accent}
        dark={dark}
        layout={profileLayout}
      />
    );
  }

  if (shippingProduct) {
    return <ShippingPage product={shippingProduct} onBack={handleBackFromShipping} currentUser={currentUser} />;
  }

  if (chatProduct) {
    return (
      <ChatInterface
        product={chatProduct}
        onBack={handleBackFromChat}
        onNavigateToShipping={handleNavigateToShipping}
        onViewProfile={handleViewProfile}
        accent={accent}
        dark={dark}
        initialOfferAmount={chatOfferAmount}
      />
    );
  }

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={handleBackFromDetail}
        onChat={handleStartChat}
        isWishlisted={wishlistIds.has(selectedProduct.id)}
        onToggleWishlist={(id) => handleToggleWishlist(null, id)}
        onViewProfile={handleViewProfile}
        onNavigateToShipping={(p) => {
          setSelectedProduct(null);
          setShippingProduct(p);
        }}
        accent={accent}
        dark={dark}
        motion={motion}
      />
    );
  }

  // Main Tabbed UI
  return (
    <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-orange selection:text-black">
      <div className="max-w-md mx-auto min-h-screen bg-brand-black border-x border-white/5 relative shadow-2xl">
        {activeTab === 'feed' && (
          <Feed
            products={products}
            wishlistIds={wishlistIds}
            onProductSelect={handleProductSelect}
            onToggleWishlist={handleToggleWishlist}
            onViewProfile={handleViewProfile}
            accent={accent}
            dark={dark}
            motion={motion}
          />
        )}

        {activeTab === 'search' && (
          <Discovery products={products} onProductSelect={handleProductSelect} />
        )}

        {activeTab === 'chat' && (
          <MessagesList
            sessions={chatSessions}
            onSelectSession={(product) => setChatProduct(product)}
            onViewProfile={handleViewProfile}
            accent={accent}
            dark={dark}
          />
        )}

        {activeTab === 'profile' && (
          <Profile
            user={currentUser}
            products={products}
            wishlistIds={wishlistIds}
            onProductSelect={handleProductSelect}
            isOwnProfile={true}
            accent={accent}
            dark={dark}
            layout={profileLayout}
            onEditProfile={handleEditProfile}
          />
        )}

        <Navbar activeTab={activeTab} onTabChange={handleTabChange} unreadCount={totalUnread} accent={accent} dark={dark} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
