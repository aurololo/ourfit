import { Product, FlipStatus, User, ChatSession } from './types';

// Fallback Images
export const IMG_FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80';
export const AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

// ─── PRODUCT IMAGES ───────────────────────────────────────────────────────────
// Main hero shots
const I = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const A = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

// Detail shots (reused across listings)
const D_STITCH   = I('photo-1617135805244-8d48a3cb3066');
const D_TAG      = I('photo-1620799140188-3b2a02fd9a77');
const D_DENIM    = I('photo-1584382294162-835b863d6b38');
const D_ZIPPER   = I('photo-1599696956557-410c545367d2');
const D_LEATHER  = I('photo-1506192777263-6d0df3413865');
const D_COTTON   = I('photo-1632120005720-7f41f057863f');
const D_STREET   = I('photo-1485230946086-1d99d529a7d3');
const D_FABRIC   = I('photo-1594938298603-c8148c4b4a20');

// Helper: build image gallery
const g = (main: string, ...extras: string[]) => [main, ...extras];

// ─── 10 INDIAN USERS ──────────────────────────────────────────────────────────
// Avatars are replaced at runtime by fetchIndianAvatars() in userService.ts.
// These placeholder URLs are used briefly while the fetch loads.
const PH = AVATAR_FALLBACK;

// Men (u2–u6)
const USER_ARYAN: User = {
    id: 'u2', name: 'Aryan Kapoor', handle: 'aryan.fits',
    avatar: PH, role: 'SELLER', vibeScore: 91, vouches: 18,
    bio: 'Archival menswear. Based in Bandra, Mumbai. DMs open.',
};
const USER_KARAN: User = {
    id: 'u3', name: 'Karan Dev', handle: 'karan_dev',
    avatar: PH, role: 'ARTIST', vibeScore: 96, vouches: 87,
    bio: 'Hand-painted denim & custom embroidery. Bangalore.',
    crafts: ['Hand Painting', 'Embroidery'],
    portfolio: [
        I('photo-1598532163257-52b3b8584446'),
        I('photo-1596755094514-f87e34085b2c'),
        I('photo-1617135805244-8d48a3cb3066'),
    ]
};
const USER_ROHAN: User = {
    id: 'u4', name: 'Rohan Mehta', handle: 'rohancores',
    avatar: PH, role: 'SELLER', vibeScore: 83, vouches: 9,
    bio: 'Sneakerhead + vintage hunter. Lajpat Nagar, Delhi.',
};
const USER_VIKRAM: User = {
    id: 'u5', name: 'Vikram Singh', handle: 'vikramvault',
    avatar: PH, role: 'SELLER', vibeScore: 79, vouches: 5,
    bio: 'Clearing my closet. Pure vintage, no fakes. Hyderabad.',
};
const USER_AARAV: User = {
    id: 'u6', name: 'Aarav Nair', handle: 'aarav.archive',
    avatar: PH, role: 'ARTIST', vibeScore: 94, vouches: 55,
    bio: 'Upcycled textiles, zero waste. Kochi → Chennai.',
    crafts: ['Upcycling', 'Block Printing'],
    portfolio: [
        I('photo-1610030469983-98e550d6193c'),
        I('photo-1589201940166-417646536b17'),
        I('photo-1620799140408-ed5341cd2431'),
    ]
};

// Women (u7–u10)
const USER_PRIYA: User = {
    id: 'u7', name: 'Priya Sharma', handle: 'priya.layers',
    avatar: PH, role: 'SELLER', vibeScore: 90, vouches: 22,
    bio: 'Quiet luxury meets desi roots. Juhu, Mumbai.',
};
const USER_NEHA: User = {
    id: 'u8', name: 'Neha Verma', handle: 'neha_drops',
    avatar: PH, role: 'ARTIST', vibeScore: 97, vouches: 112,
    bio: 'Reworking saris into streetwear. Koramangala, Blr.',
    crafts: ['Sari Rework', 'Patchwork'],
    portfolio: [
        I('photo-1596755094514-f87e34085b2c'),
        I('photo-1617135805244-8d48a3cb3066'),
        I('photo-1598532163257-52b3b8584446'),
    ]
};
const USER_ADITI: User = {
    id: 'u9', name: 'Aditi Joshi', handle: 'aditifits',
    avatar: PH, role: 'SELLER', vibeScore: 86, vouches: 14,
    bio: 'Y2K & indo-fusion. Kalyani Nagar, Pune.',
};
const USER_MEERA: User = {
    id: 'u10', name: 'Meera Reddy', handle: 'meerareddy',
    avatar: PH, role: 'SELLER', vibeScore: 75, vouches: 3,
    bio: 'Clearing old gems. Jubilee Hills, Hyderabad.',
};

// ─── PRIMARY USERS (kept for backward compat) ─────────────────────────────────
export const MOCK_USER: User = {
    id: 'u1',
    name: 'Anya',
    handle: 'anya_fits',
    avatar: PH,
    role: 'BUYER',
    vibeScore: 92,
    vouches: 5,
    bio: "Digital hoarder. Archival pieces only. Based in Indiranagar.",
    crafts: []
};

export const ARTIST_USER: User = {
    id: 'a1',
    name: 'Divya R.',
    handle: 'denim_wiz',
    avatar: PH,
    role: 'ARTIST',
    vibeScore: 98,
    vouches: 124,
    bio: "I turn trash into treasure. DM for commissions. Indiranagar, Blr.",
    crafts: ["Patchwork", "Embroidery"],
    portfolio: [
        I('photo-1598532163257-52b3b8584446'),
        I('photo-1620799140408-ed5341cd2431'),
        I('photo-1596755094514-f87e34085b2c'),
        I('photo-1617135805244-8d48a3cb3066'),
    ]
};

// ─── ALL USERS (used for avatar injection in App.tsx) ─────────────────────────
export const ALL_MOCK_USERS: User[] = [
    MOCK_USER, ARTIST_USER, USER_ARYAN, USER_KARAN, USER_ROHAN,
    USER_VIKRAM, USER_AARAV, USER_PRIYA, USER_NEHA, USER_ADITI, USER_MEERA,
];

// ─── 50 PRODUCTS ──────────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
    // ── ARTIST_USER (Divya) ────────────────────────────────────────────────────
    {
        id: 'p1', title: 'Kantha Stitch Workwear Jacket',
        description: 'Hand-stitched kantha detailing on vintage cotton. 1 of 1.',
        price: 6500, auraScore: 94, status: FlipStatus.AVAILABLE,
        owner: ARTIST_USER,
        tags: ['kantha', 'upcycled', 'jacket', 'handmade'],
        images: g(I('photo-1591047139829-d91aecb6caea'), D_STITCH, D_TAG, D_COTTON, D_STREET),
        specs: { size: 'M', brand: 'Vintage / Custom', material: '100% Cotton', origin: 'Jaipur', year: '2023', condition: 'New with flaws' }
    },
    {
        id: 'p2', title: 'Patchwork Denim Tote',
        description: 'Hand-sewn from 3 pairs of Levi\'s. Completely one-off.',
        price: 1200, auraScore: 95, status: FlipStatus.SOLD,
        owner: ARTIST_USER, artist: ARTIST_USER,
        tags: ['upcycled', 'handmade', 'bag'],
        images: g(I('photo-1584917865442-de89df76afd3'), D_DENIM, D_ZIPPER, D_STITCH, D_TAG),
        specs: { size: 'One Size', brand: 'Levi\'s (Reworked)', material: 'Denim', origin: 'Bangalore', year: '2024', condition: 'New' }
    },
    {
        id: 'p3', title: 'Mirror Work Denim Skirt',
        description: 'Festival ready. Kutch mirror embroidery on raw denim.',
        price: 12000, auraScore: 97, status: FlipStatus.AVAILABLE,
        owner: ARTIST_USER, artist: ARTIST_USER,
        tags: ['upcycled', 'mirror-work', 'denim', 'kutch'],
        images: g(I('photo-1596755094514-f87e34085b2c'), D_DENIM, D_STITCH, D_TAG, D_STREET),
        specs: { size: '28W', brand: 'Custom', material: 'Denim + Mirror', origin: 'Kutch', year: '2024', condition: 'New' }
    },
    {
        id: 'p4', title: 'Custom "Flower Boy" Spezials',
        description: 'Hand-embroidered Adidas Spezial. 1 of 1. Not for everyone.',
        price: 9000, auraScore: 98, status: FlipStatus.AVAILABLE,
        owner: ARTIST_USER,
        tags: ['custom', 'sneakers', 'embroidery', 'flip-ready'],
        images: g(I('photo-1600185365926-3a2ce3cdb9eb'), D_STITCH, D_COTTON, D_TAG, D_STREET),
        specs: { size: 'UK 9', brand: 'Adidas (Reworked)', material: 'Suede', origin: 'Bangalore', year: '2023', condition: 'New' }
    },
    {
        id: 'p5', title: 'Sari Crop Jacket',
        description: 'Vintage silk sari reconstructed into a structured crop jacket.',
        price: 7800, auraScore: 96, status: FlipStatus.AVAILABLE,
        owner: ARTIST_USER, artist: ARTIST_USER,
        tags: ['sari-rework', 'ethnic', 'fusion', 'handmade'],
        images: g(I('photo-1610030469983-98e550d6193c'), D_STITCH, D_FABRIC, D_TAG, D_COTTON),
        specs: { size: 'S', brand: 'Custom', material: 'Silk', origin: 'Varanasi (Reworked Blr)', year: '2024', condition: 'New' }
    },

    // ── KARAN DEV (Artist) ─────────────────────────────────────────────────────
    {
        id: 'p6', title: 'Hand-Painted Trucker Jacket',
        description: 'Acrylic portraits on classic denim. Signed.',
        price: 8500, auraScore: 95, status: FlipStatus.AVAILABLE,
        owner: USER_KARAN, artist: USER_KARAN,
        tags: ['hand-painted', 'denim', 'jacket', 'art'],
        images: g(I('photo-1551488831-00ddcb6c6bd3'), D_STITCH, D_DENIM, D_TAG, D_STREET),
        specs: { size: 'L', brand: 'Levi\'s (Custom)', material: 'Denim', origin: 'Bangalore', year: '2024', condition: 'New' }
    },
    {
        id: 'p7', title: 'Sanskrit Type Oversized Hoodie',
        description: 'Screen printed Sanskrit typography. Heavy 380gsm.',
        price: 3200, auraScore: 91, status: FlipStatus.AVAILABLE,
        owner: USER_KARAN,
        tags: ['hoodie', 'streetwear', 'typography'],
        images: g(I('photo-1556821840-3a63f15732ce'), D_COTTON, D_TAG, D_STREET),
        specs: { size: 'XL', brand: 'Custom', material: 'Cotton Fleece', origin: 'Bangalore', year: '2024', condition: 'New' }
    },
    {
        id: 'p8', title: 'Indigo Resist-Dye Cargo',
        description: 'Shibori-dyed cargo pants. Every pair unique.',
        price: 4500, auraScore: 93, status: FlipStatus.AVAILABLE,
        owner: USER_KARAN, artist: USER_KARAN,
        tags: ['indigo', 'shibori', 'cargo', 'handmade'],
        images: g(I('photo-1517487881594-2787fef5ebf7'), D_FABRIC, D_DENIM, D_STITCH, D_STREET),
        specs: { size: '32W', brand: 'Custom', material: 'Cotton', origin: 'Bangalore', year: '2024', condition: 'New' }
    },

    // ── ARYAN KAPOOR ──────────────────────────────────────────────────────────
    {
        id: 'p9', title: 'Air Jordan 1 Retro High OG',
        description: 'Bred colourway. Worn twice. OG box included.',
        price: 18000, auraScore: 99, status: FlipStatus.AVAILABLE,
        owner: USER_ARYAN,
        tags: ['sneakers', 'jordan', 'hype', 'flip-ready'],
        images: g(I('photo-1542291026-7eec264c27ff'), I('photo-1491553895911-0055eca6402d'), D_TAG, D_STREET),
        specs: { size: 'UK 10', brand: 'Nike / Jordan', material: 'Leather', origin: 'USA', year: '2022', condition: 'Like New' }
    },
    {
        id: 'p10', title: 'Comme des Garçons Play Tee',
        description: 'Classic heart logo. Size medium. No fakes, receipt available.',
        price: 6500, auraScore: 88, status: FlipStatus.AVAILABLE,
        owner: USER_ARYAN,
        tags: ['cdg', 'graphic-tee', 'designer'],
        images: g(I('photo-1583743814966-8936f5b7be1a'), D_TAG, D_COTTON, D_STREET),
        specs: { size: 'M', brand: 'Comme des Garçons', material: '100% Cotton', origin: 'Japan', year: '2021', condition: 'Excellent' }
    },
    {
        id: 'p11', title: 'Gorpcore Shell Windbreaker',
        description: 'Arc\'teryx vibes at 1/10th the price. Mountain ready.',
        price: 5500, auraScore: 90, status: FlipStatus.AVAILABLE,
        owner: USER_ARYAN,
        tags: ['gorpcore', 'outerwear', 'technical'],
        images: g(I('photo-1545593169-52d711019d66'), D_ZIPPER, D_TAG, D_STREET),
        specs: { size: 'L', brand: 'The North Face', material: 'Nylon Shell', origin: 'USA', year: '2019', condition: 'Good' }
    },
    {
        id: 'p12', title: 'Vintage Levi\'s 501 Straight',
        description: '90s orange tab. Perfect fade. Non-stretch.',
        price: 3800, auraScore: 87, status: FlipStatus.AVAILABLE,
        owner: USER_ARYAN,
        tags: ['denim', 'levi\'s', 'vintage', 'flip-ready'],
        images: g(I('photo-1582552938357-32b906df40cb'), D_DENIM, D_TAG, D_ZIPPER, D_STREET),
        specs: { size: '32W 30L', brand: 'Levi\'s', material: 'Denim', origin: 'USA', year: '1994', condition: 'Distressed' }
    },

    // ── ROHAN MEHTA ───────────────────────────────────────────────────────────
    {
        id: 'p13', title: 'Nike Air Max 95 OG Neon',
        description: 'The OG colourway. Clean pair, minimal creasing.',
        price: 14000, auraScore: 97, status: FlipStatus.AVAILABLE,
        owner: USER_ROHAN,
        tags: ['sneakers', 'nike', 'airmax', 'flip-ready'],
        images: g(I('photo-1600269452121-4f2416e55c28'), I('photo-1595950653106-6c9ebd614d3a'), D_TAG, D_STREET),
        specs: { size: 'UK 9', brand: 'Nike', material: 'Mesh/Leather', origin: 'USA', year: '2020', condition: 'Excellent' }
    },
    {
        id: 'p14', title: 'Stüssy 8-Ball Hoodie',
        description: 'Heavy blend. The cut is perfect. No bleach, no tears.',
        price: 4800, auraScore: 85, status: FlipStatus.AVAILABLE,
        owner: USER_ROHAN,
        tags: ['hoodie', 'streetwear', 'stussy'],
        images: g(I('photo-1578681994506-b8f463449011'), D_COTTON, D_TAG, D_STREET),
        specs: { size: 'M', brand: 'Stüssy', material: 'Cotton Fleece', origin: 'USA', year: '2022', condition: 'Good' }
    },
    {
        id: 'p15', title: 'Cyberpunk Cargo Pants',
        description: 'Techwear essentials. 12 pockets. No this isn\'t negotiable.',
        price: 2800, auraScore: 92, status: FlipStatus.AVAILABLE,
        owner: USER_ROHAN,
        tags: ['techwear', 'utility', 'streetwear'],
        images: g(I('photo-1517487881594-2787fef5ebf7'), D_ZIPPER, D_TAG, D_COTTON, D_STREET),
        specs: { size: '32W', brand: 'Uniqlo U', material: 'Nylon Blend', origin: 'Japan', year: '2022', condition: 'Excellent' }
    },
    {
        id: 'p16', title: 'Y2K Cyber Oval Sunnies',
        description: 'Direct from 2003. Scratch-free lenses.',
        price: 800, auraScore: 75, status: FlipStatus.AVAILABLE,
        owner: USER_ROHAN,
        tags: ['y2k', 'accessory', 'sunglasses'],
        images: g(I('photo-1572635196237-14b3f281503f'), D_TAG, D_STREET),
        specs: { size: 'OS', brand: 'Oakley (Replica)', material: 'Acetate', origin: 'Unknown', year: '2003', condition: 'Good' }
    },

    // ── VIKRAM SINGH ──────────────────────────────────────────────────────────
    {
        id: 'p17', title: 'Leather Biker Vest',
        description: 'Real cowhide, heavy weight. The real deal.',
        price: 4500, auraScore: 99, status: FlipStatus.AVAILABLE,
        owner: USER_VIKRAM,
        tags: ['leather', 'biker', 'opium', 'outerwear'],
        images: g(I('photo-1559563458-527698bf5295'), D_LEATHER, D_TAG, D_ZIPPER, D_STREET),
        specs: { size: 'L', brand: 'Harley Davidson', material: 'Cowhide Leather', origin: 'USA', year: '1998', condition: 'Distressed' }
    },
    {
        id: 'p18', title: 'Silver Adorned Platform Boots',
        description: 'Heavy metal hardware on genuine leather. EU 39.',
        price: 8500, auraScore: 99, status: FlipStatus.AVAILABLE,
        owner: USER_VIKRAM,
        tags: ['goth', 'boots', 'silver', 'leather'],
        images: g(I('photo-1608256246200-53e635b5b65f'), D_LEATHER, D_ZIPPER, D_STITCH, D_STREET),
        specs: { size: 'EU 39', brand: 'New Rock', material: 'Leather / Metal', origin: 'Spain', year: '2019', condition: 'Like New' }
    },
    {
        id: 'p19', title: 'Neon Puffer Jacket',
        description: 'See me from outer space. North Face archive.',
        price: 5500, auraScore: 81, status: FlipStatus.AVAILABLE,
        owner: USER_VIKRAM,
        tags: ['outerwear', 'statement', 'puffer'],
        images: g(I('photo-1545593169-52d711019d66'), D_ZIPPER, D_TAG, D_STREET),
        specs: { size: 'XL', brand: 'The North Face', material: 'Nylon / Down', origin: 'USA', year: '2018', condition: 'Good' }
    },
    {
        id: 'p20', title: 'Distressed Baggy Jeans',
        description: 'Polar Skate Co. 90s wash. Type of fit you live in.',
        price: 2200, auraScore: 85, status: FlipStatus.AVAILABLE,
        owner: USER_VIKRAM,
        tags: ['denim', 'baggy', 'skater'],
        images: g(I('photo-1509631179647-0177331693ae'), D_DENIM, D_ZIPPER, D_TAG, D_STREET),
        specs: { size: '34W 32L', brand: 'Polar Skate Co.', material: 'Denim', origin: 'Sweden', year: '2021', condition: 'Thrashed' }
    },

    // ── AARAV NAIR (Artist) ───────────────────────────────────────────────────
    {
        id: 'p21', title: 'Block Print Linen Co-Ord',
        description: 'Handmade in Kerala. Traditional motifs, modern silhouette.',
        price: 5800, auraScore: 93, status: FlipStatus.AVAILABLE,
        owner: USER_AARAV, artist: USER_AARAV,
        tags: ['block-print', 'linen', 'ethnic', 'handmade'],
        images: g(I('photo-1589201940166-417646536b17'), D_COTTON, D_STITCH, D_FABRIC, D_TAG),
        specs: { size: 'M', brand: 'Custom', material: 'Handloom Linen', origin: 'Kerala', year: '2024', condition: 'New' }
    },
    {
        id: 'p22', title: 'Upcycled Patchwork Bomber',
        description: 'Zero waste bomber. Made from deadstock fabric offcuts.',
        price: 6200, auraScore: 94, status: FlipStatus.AVAILABLE,
        owner: USER_AARAV, artist: USER_AARAV,
        tags: ['upcycled', 'patchwork', 'bomber', 'zero-waste'],
        images: g(I('photo-1544966503-7cc5ac882d5e'), D_STITCH, D_FABRIC, D_TAG, D_COTTON),
        specs: { size: 'L', brand: 'Custom', material: 'Mixed Deadstock', origin: 'Chennai', year: '2024', condition: 'New' }
    },
    {
        id: 'p23', title: 'Indigo Bandhani Oversized Shirt',
        description: 'Traditional bandhani tie-dye. Slow fashion, not fast.',
        price: 2800, auraScore: 89, status: FlipStatus.AVAILABLE,
        owner: USER_AARAV,
        tags: ['bandhani', 'indigo', 'shirt', 'ethnic'],
        images: g(I('photo-1620799140408-ed5341cd2431'), D_COTTON, D_STITCH, D_FABRIC, D_STREET),
        specs: { size: 'XL', brand: 'Custom', material: 'Cotton', origin: 'Gujarat', year: '2023', condition: 'New' }
    },

    // ── PRIYA SHARMA ──────────────────────────────────────────────────────────
    {
        id: 'p24', title: 'Sheer Block Print Shirt',
        description: 'Translucent cotton voile. Traditional Jaipur prints.',
        price: 2400, auraScore: 89, status: FlipStatus.AVAILABLE,
        owner: USER_PRIYA,
        tags: ['sheer', 'print', 'summer', 'ethnic'],
        images: g(I('photo-1620799140408-ed5341cd2431'), D_COTTON, D_TAG, D_STREET),
        specs: { size: 'L', brand: 'Anokhi', material: 'Cotton Voile', origin: 'Jaipur', year: '2022', condition: 'Excellent' }
    },
    {
        id: 'p25', title: 'Green Bandhani Wide Leg Set',
        description: 'Traditional print, contemporary silhouette. Very rare green.',
        price: 6800, auraScore: 91, status: FlipStatus.AVAILABLE,
        owner: USER_PRIYA,
        tags: ['ethnic', 'fusion', 'bandhani', 'co-ord'],
        images: g(I('photo-1610030469983-98e550d6193c'), D_COTTON, D_STITCH, D_TAG, D_STREET),
        specs: { size: 'S', brand: 'Local Boutique', material: 'Silk Blend', origin: 'Gujarat', year: '2024', condition: 'New' }
    },
    {
        id: 'p26', title: 'Orange Ikat Kimono Robe',
        description: '100% handloom cotton. Lounge in luxury.',
        price: 4200, auraScore: 88, status: FlipStatus.AVAILABLE,
        owner: USER_PRIYA,
        tags: ['ikat', 'robe', 'loungewear', 'ethnic'],
        images: g(I('photo-1589201940166-417646536b17'), D_COTTON, D_STITCH, D_TAG, D_STREET),
        specs: { size: 'Free Size', brand: 'Fabindia', material: 'Cotton', origin: 'Odisha', year: '2023', condition: 'Like New' }
    },
    {
        id: 'p27', title: 'Minimal Leather Crossbody',
        description: 'Real leather, saddle-stitched. Ages beautifully.',
        price: 3500, auraScore: 84, status: FlipStatus.AVAILABLE,
        owner: USER_PRIYA,
        tags: ['bag', 'leather', 'accessory'],
        images: g(I('photo-1548036328-c9fa89d128fa'), D_LEATHER, D_ZIPPER, D_TAG, D_STREET),
        specs: { size: 'OS', brand: 'Hidesign', material: 'Full Grain Leather', origin: 'Pondicherry', year: '2020', condition: 'Good' }
    },

    // ── NEHA VERMA (Artist) ───────────────────────────────────────────────────
    {
        id: 'p28', title: 'Sari Wrap Maxi Skirt',
        description: 'A Kanjivaram sari, reimagined. You can\'t find this anywhere.',
        price: 9500, auraScore: 96, status: FlipStatus.AVAILABLE,
        owner: USER_NEHA, artist: USER_NEHA,
        tags: ['sari-rework', 'ethnic', 'fusion', 'silk'],
        images: g(I('photo-1596755094514-f87e34085b2c'), D_FABRIC, D_STITCH, D_TAG, D_COTTON),
        specs: { size: 'S/M', brand: 'Custom', material: 'Kanjivaram Silk', origin: 'Chennai (Reworked Blr)', year: '2024', condition: 'New' }
    },
    {
        id: 'p29', title: 'Quilted Denim Jacket (Reworked)',
        description: 'Quilted with salvaged fabric, no two panels the same.',
        price: 7200, auraScore: 95, status: FlipStatus.AVAILABLE,
        owner: USER_NEHA, artist: USER_NEHA,
        tags: ['upcycled', 'quilted', 'denim', 'jacket'],
        images: g(I('photo-1525507119028-ed4c629a60a3'), D_DENIM, D_STITCH, D_TAG, D_FABRIC),
        specs: { size: 'M', brand: 'Custom', material: 'Denim + Salvage', origin: 'Bangalore', year: '2024', condition: 'New' }
    },
    {
        id: 'p30', title: 'Embroidered Nehru Collar Tee',
        description: 'Gota patti border on an oversized white tee.',
        price: 2200, auraScore: 87, status: FlipStatus.AVAILABLE,
        owner: USER_NEHA,
        tags: ['embroidery', 'gota', 'ethnic', 'tee'],
        images: g(I('photo-1521572163474-6864f9cf17ab'), D_STITCH, D_COTTON, D_TAG, D_STREET),
        specs: { size: 'L', brand: 'Custom', material: 'Cotton', origin: 'Bangalore', year: '2024', condition: 'New' }
    },

    // ── ADITI JOSHI ───────────────────────────────────────────────────────────
    {
        id: 'p31', title: 'Y2K Baby Tee (Original)',
        description: 'Genuine early 2000s. Cropped natural. No alterations.',
        price: 950, auraScore: 80, status: FlipStatus.AVAILABLE,
        owner: USER_ADITI,
        tags: ['y2k', 'baby-tee', 'vintage'],
        images: g(I('photo-1489987707025-afc232f7ea0f'), D_TAG, D_COTTON, D_STREET),
        specs: { size: 'XS', brand: 'Unknown Vintage', material: 'Cotton Rib', origin: 'Unknown', year: '2002', condition: 'Good' }
    },
    {
        id: 'p32', title: 'Fuzzy Kangol Bucket Hat',
        description: 'Faux fur, deep pile. Statement piece from 2005.',
        price: 1200, auraScore: 78, status: FlipStatus.AVAILABLE,
        owner: USER_ADITI,
        tags: ['accessory', 'streetwear', 'hat'],
        images: g(I('photo-1565780521869-d98c3973c66f'), D_TAG, D_COTTON, D_STREET),
        specs: { size: 'M', brand: 'Kangol', material: 'Faux Fur', origin: 'UK', year: '2005', condition: 'Good' }
    },
    {
        id: 'p33', title: 'Indo-Fusion Corset Top',
        description: 'Brocade fabric meets western cut. Dupatta included.',
        price: 3200, auraScore: 88, status: FlipStatus.AVAILABLE,
        owner: USER_ADITI,
        tags: ['fusion', 'ethnic', 'corset', 'brocade'],
        images: g(I('photo-1612423284934-2850a4ea6b0f'), D_FABRIC, D_STITCH, D_TAG, D_STREET),
        specs: { size: 'S', brand: 'Local Boutique', material: 'Brocade', origin: 'Pune', year: '2023', condition: 'Like New' }
    },
    {
        id: 'p34', title: 'Archive Champion Crewneck',
        description: 'Reverse weave. 90s era. Heavy & warm.',
        price: 3600, auraScore: 82, status: FlipStatus.AVAILABLE,
        owner: USER_ADITI,
        tags: ['champion', 'crewneck', 'vintage', 'archive'],
        images: g(I('photo-1578681994506-b8f463449011'), D_COTTON, D_TAG, D_STREET),
        specs: { size: 'L', brand: 'Champion', material: 'Reverse Weave Cotton', origin: 'USA', year: '1996', condition: 'Good' }
    },

    // ── MEERA REDDY ───────────────────────────────────────────────────────────
    {
        id: 'p35', title: 'Carhartt WIP Beanie (OG)',
        description: 'The acrylic one. Factory seconds but barely noticeable.',
        price: 450, auraScore: 60, status: FlipStatus.AVAILABLE,
        owner: USER_MEERA,
        tags: ['accessory', 'workwear', 'beanie'],
        images: g(I('photo-1576871337632-b9aef4c17ab9'), D_COTTON, D_TAG, D_STREET),
        specs: { size: 'OS', brand: 'Carhartt WIP', material: 'Acrylic', origin: 'USA', year: '2020', condition: 'Fair' }
    },
    {
        id: 'p36', title: 'Printed Kurta Set (Handblock)',
        description: 'Sanganeri print. Classic Rajasthani craft.',
        price: 2800, auraScore: 77, status: FlipStatus.AVAILABLE,
        owner: USER_MEERA,
        tags: ['kurta', 'handblock', 'ethnic'],
        images: g(I('photo-1602006702870-3f6b7aa3dcd5'), D_COTTON, D_FABRIC, D_STITCH, D_TAG),
        specs: { size: 'M', brand: 'Fabindia', material: 'Cotton', origin: 'Rajasthan', year: '2022', condition: 'Good' }
    },
    {
        id: 'p37', title: 'Nike Utility Vest (Technical)',
        description: 'Gorpcore-coded. Multiple zip pockets. Barely used.',
        price: 3200, auraScore: 86, status: FlipStatus.AVAILABLE,
        owner: USER_MEERA,
        tags: ['gorpcore', 'vest', 'technical', 'nike'],
        images: g(I('photo-1559563458-527698bf5295'), D_ZIPPER, D_TAG, D_STREET),
        specs: { size: 'M', brand: 'Nike ACG', material: 'Polyester', origin: 'Vietnam', year: '2021', condition: 'Excellent' }
    },

    // ── MOCK_USER (Anya, the logged-in buyer) ─────────────────────────────────
    {
        id: 'p38', title: 'Printed Silk Scarf (Vintage)',
        description: 'Classic silk twill. Italian print, no stains.',
        price: 1800, auraScore: 83, status: FlipStatus.AVAILABLE,
        owner: MOCK_USER,
        tags: ['accessory', 'silk', 'vintage', 'scarf'],
        images: g(I('photo-1584917865442-de89df76afd3'), D_FABRIC, D_TAG, D_STREET),
        specs: { size: 'OS', brand: 'Unknown Italian', material: 'Silk', origin: 'Italy', year: '1985', condition: 'Good' }
    },
    {
        id: 'p39', title: 'Zara Archive Tailored Blazer',
        description: 'Structured shoulder, double button. Very editorial.',
        price: 2200, auraScore: 76, status: FlipStatus.AVAILABLE,
        owner: MOCK_USER,
        tags: ['blazer', 'tailored', 'office-core'],
        images: g(I('photo-1544966503-7cc5ac882d5e'), D_TAG, D_COTTON, D_STREET),
        specs: { size: 'S', brand: 'Zara', material: 'Polyester Blend', origin: 'Bangladesh', year: '2019', condition: 'Like New' }
    },

    // ── EXTRA DROPS (mixed users, variety) ────────────────────────────────────
    {
        id: 'p40', title: 'Maharaja Kalamkari Bomber',
        description: 'Andhra kalamkari printed on a varsity bomber base.',
        price: 11000, auraScore: 96, status: FlipStatus.AVAILABLE,
        owner: USER_AARAV, artist: USER_AARAV,
        tags: ['kalamkari', 'ethnic', 'bomber', 'art'],
        images: g(I('photo-1544966503-7cc5ac882d5e'), D_STITCH, D_FABRIC, D_TAG, D_COTTON),
        specs: { size: 'M', brand: 'Custom', material: 'Cotton + Kalamkari', origin: 'Andhra Pradesh', year: '2024', condition: 'New' }
    },
    {
        id: 'p41', title: 'Puma Suede Classic (1970s)',
        description: 'Deadstock. Still in box. Never worn. Very serious.',
        price: 22000, auraScore: 100, status: FlipStatus.AVAILABLE,
        owner: USER_ARYAN,
        tags: ['sneakers', 'puma', 'vintage', 'deadstock', 'flip-ready'],
        images: g(I('photo-1595950653106-6c9ebd614d3a'), I('photo-1491553895911-0055eca6402d'), D_TAG, D_STREET),
        specs: { size: 'UK 8', brand: 'Puma', material: 'Suede', origin: 'Germany', year: '1974', condition: 'New (Deadstock)' }
    },
    {
        id: 'p42', title: 'Handwoven Khadi Kurta',
        description: 'From a village weaver in Kutch. Ethically sourced.',
        price: 1800, auraScore: 79, status: FlipStatus.AVAILABLE,
        owner: USER_AARAV,
        tags: ['khadi', 'kurta', 'ethnic', 'handwoven'],
        images: g(I('photo-1602006702870-3f6b7aa3dcd5'), D_COTTON, D_FABRIC, D_STITCH, D_TAG),
        specs: { size: 'L', brand: 'Khadi Gramodyog', material: 'Handspun Khadi', origin: 'Kutch', year: '2023', condition: 'New' }
    },
    {
        id: 'p43', title: 'Nike SB Dunk Low Pro',
        description: 'Travis colourway (unofficial). No receipt but 100% legit.',
        price: 16000, auraScore: 93, status: FlipStatus.AVAILABLE,
        owner: USER_ROHAN,
        tags: ['sneakers', 'dunk', 'nike', 'hype', 'flip-ready'],
        images: g(I('photo-1542291026-7eec264c27ff'), I('photo-1600269452121-4f2416e55c28'), D_TAG, D_STREET),
        specs: { size: 'UK 9.5', brand: 'Nike SB', material: 'Suede / Leather', origin: 'Indonesia', year: '2021', condition: 'Good' }
    },
    {
        id: 'p44', title: 'Biker Leather Jacket (Schott)',
        description: 'The original moto perfecto. Heavy horsehide. Earned not bought.',
        price: 28000, auraScore: 99, status: FlipStatus.AVAILABLE,
        owner: USER_VIKRAM,
        tags: ['leather', 'jacket', 'moto', 'archive', 'opium'],
        images: g(I('photo-1591047139829-d91aecb6caea'), D_LEATHER, D_ZIPPER, D_TAG, D_STREET),
        specs: { size: 'M', brand: 'Schott NYC', material: 'Horsehide', origin: 'USA', year: '1982', condition: 'Distressed' }
    },
    {
        id: 'p45', title: 'Mirror Sequin Lehenga (Vintage)',
        description: 'Full mirror work. Festival-season ready. No alterations needed.',
        price: 15000, auraScore: 95, status: FlipStatus.AVAILABLE,
        owner: USER_NEHA,
        tags: ['lehenga', 'ethnic', 'mirror-work', 'festival'],
        images: g(I('photo-1596755094514-f87e34085b2c'), D_STITCH, D_FABRIC, D_TAG, D_COTTON),
        specs: { size: 'S', brand: 'Unknown Vintage', material: 'Silk + Mirror', origin: 'Rajasthan', year: '1995', condition: 'Excellent' }
    },
    {
        id: 'p46', title: 'Opium Maxi Coat (Floor Length)',
        description: 'Japanese brand. Floor length, architectural shoulder.',
        price: 19000, auraScore: 98, status: FlipStatus.AVAILABLE,
        owner: USER_PRIYA,
        tags: ['opium', 'coat', 'maxi', 'japanese'],
        images: g(I('photo-1545593169-52d711019d66'), D_TAG, D_ZIPPER, D_LEATHER, D_STREET),
        specs: { size: 'S', brand: 'Yohji Yamamoto (diffusion)', material: 'Wool Blend', origin: 'Japan', year: '2015', condition: 'Like New' }
    },
    {
        id: 'p47', title: 'Ikat Print Palazzo Pants',
        description: 'Odisha ikat. Running print, no breaks in the pattern.',
        price: 2400, auraScore: 84, status: FlipStatus.AVAILABLE,
        owner: USER_MEERA,
        tags: ['ikat', 'palazzo', 'ethnic', 'handwoven'],
        images: g(I('photo-1589201940166-417646536b17'), D_FABRIC, D_COTTON, D_STITCH, D_TAG),
        specs: { size: 'M', brand: 'Ekaya', material: 'Ikat Silk-Cotton', origin: 'Odisha', year: '2021', condition: 'Good' }
    },
    {
        id: 'p48', title: 'Vintage Band Tee (Metallica)',
        description: 'OG 1994 tour tee. Soft with age. Size XL but fits like M.',
        price: 4500, auraScore: 89, status: FlipStatus.AVAILABLE,
        owner: USER_ARYAN,
        tags: ['band-tee', 'vintage', 'graphic', 'metal'],
        images: g(I('photo-1554568218-0f1715e72254'), D_TAG, D_COTTON, D_STREET),
        specs: { size: 'XL (fits M)', brand: 'Metallica', material: 'Cotton', origin: 'USA', year: '1994', condition: 'Thrashed (Good)' }
    },
    {
        id: 'p49', title: 'Handblock Print Dupatta',
        description: 'Mul cotton, soft and light. Rajasthani hand block.',
        price: 850, auraScore: 72, status: FlipStatus.AVAILABLE,
        owner: USER_ADITI,
        tags: ['dupatta', 'block-print', 'ethnic', 'accessory'],
        images: g(I('photo-1602006702870-3f6b7aa3dcd5'), D_COTTON, D_FABRIC, D_TAG),
        specs: { size: 'OS', brand: 'Jaipur Handloom', material: 'Mul Cotton', origin: 'Jaipur', year: '2022', condition: 'New' }
    },
    {
        id: 'p50', title: 'Silk Ajrakh Kurta',
        description: 'Masroo silk, natural dyes. Literally art you can wear.',
        price: 8500, auraScore: 94, status: FlipStatus.AVAILABLE,
        owner: USER_KARAN,
        tags: ['ajrakh', 'silk', 'ethnic', 'natural-dye', 'handmade'],
        images: g(I('photo-1610030469983-98e550d6193c'), D_FABRIC, D_STITCH, D_COTTON, D_TAG),
        specs: { size: 'M', brand: 'Kutch Artisan', material: 'Masroo Silk', origin: 'Bhuj, Gujarat', year: '2024', condition: 'New' }
    },
];

export const MOCK_CHATS: ChatSession[] = [
    {
        id: 'c1',
        product: MOCK_PRODUCTS[3], // Flower Boy Spezials
        otherUser: ARTIST_USER,
        lastMessage: {
            id: 'm1', senderId: 'a1',
            text: 'I can do 8500 if you pick up today.',
            type: 'TEXT',
            timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        unreadCount: 1
    },
    {
        id: 'c2',
        product: MOCK_PRODUCTS[1], // Patchwork Denim Tote (Sold)
        otherUser: ARTIST_USER,
        lastMessage: {
            id: 'm2', senderId: 'u1',
            text: 'Thanks for the quick shipping!',
            type: 'TEXT',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        unreadCount: 0
    },
    {
        id: 'c3',
        product: MOCK_PRODUCTS[14], // Cyberpunk Cargo
        otherUser: USER_ROHAN,
        lastMessage: {
            id: 'm3', senderId: 'u4',
            text: 'Are these true to size?',
            type: 'TEXT',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        unreadCount: 3
    }
];
