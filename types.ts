export enum FlipStatus {
  AVAILABLE = 'AVAILABLE',
  ARTIST_REQUESTED = 'ARTIST_REQUESTED',
  IN_UPCYCLING = 'IN_UPCYCLING',
  SOLD = 'SOLD'
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'SELLER' | 'ARTIST' | 'BUYER';
  vibeScore: number;
  vouches: number;
  bio?: string;
  crafts?: string[]; // New field for Artist Badges
  portfolio?: string[]; // Work Showcase images
}

export interface ProductSpecs {
  size: string;
  brand: string;
  material: string;
  origin: string;
  year: string;
  condition: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[]; // Changed from single imageUrl to array
  status: FlipStatus;
  owner: User;
  artist?: User; // If upcycling
  auraScore: number;
  tags: string[];
  specs: ProductSpecs; // New detailed info
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  type: 'TEXT' | 'OFFER' | 'SYSTEM' | 'IMAGE' | 'AUDIO';
  offerAmount?: number;
  offerStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  attachmentUrl?: string;
  attachmentType?: 'IMAGE' | 'AUDIO';
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  product: Product;
  otherUser: User;
  lastMessage: ChatMessage;
  unreadCount: number;
}