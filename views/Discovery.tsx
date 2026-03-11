import React, { useState } from 'react';
import { Product } from '../types';
import FeedItem from '../components/FeedItem';
import { Search, Flame, TrendingUp } from 'lucide-react';

interface DiscoveryProps {
    products: Product[];
    onProductSelect: (p: Product) => void;
}

const TRENDING_TAGS = ['Opium', 'Gorpcore', 'Bloke Core', 'Y2K', 'Cyber', 'Archive', 'Jersey', 'Leather'];

const Discovery: React.FC<DiscoveryProps> = ({ products, onProductSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTag = activeTag ? p.tags.some(t => t.toLowerCase() === activeTag.toLowerCase()) || p.title.toLowerCase().includes(activeTag.toLowerCase()) : true;
        return matchesSearch && matchesTag;
    });

    return (
        <div className="min-h-screen pb-24 px-4" style={{ paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top) + 0.5rem))' }}>
            <div className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                >
                    <source src="/videos/discovery-bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/50 to-transparent" />

                <h1 className="relative z-10 text-4xl font-display font-bold uppercase py-10 px-6 flex items-center gap-2 text-white">
                    <Search className="text-brand-orange" size={32} />
                    Find
                </h1>
            </div>

            {/* Search Input */}
            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search for vibes, brands, items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 pl-12 text-lg focus:border-brand-orange focus:outline-none transition-colors"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>

            {/* Trending Tags */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3 text-brand-orange font-mono text-xs uppercase tracking-widest">
                    <Flame size={14} />
                    <span>Trending Now</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {TRENDING_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase border transition-all ${activeTag === tag
                                    ? 'bg-brand-orange text-black border-brand-orange'
                                    : 'bg-transparent border-white/20 text-gray-400 hover:border-white hover:text-white'
                                }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-display">
                        {activeTag ? `#${activeTag}` : 'Fresh Finds'}
                    </h2>
                    <span className="text-gray-500 text-xs font-mono">{filteredProducts.length} RESULTS</span>
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="columns-2 gap-4 space-y-4">
                        {filteredProducts.map(p => (
                            <FeedItem key={p.id} product={p} onClick={onProductSelect} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <TrendingUp size={48} className="mx-auto mb-4 text-gray-600" />
                        <p>No vibes found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discovery;