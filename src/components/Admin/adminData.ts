// Types
export type TabType = 'dashboard' | 'users' | 'properties' | 'offers' | 'settings';


export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  properties: number;
  avatar: string;
}

export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  status: string;
  owner: string;
  views: number;
  inquiries: number;
  image: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProperties: number;
  activeListings: number;
  pendingReviews: number;
  totalRevenue: string;
  monthlyGrowth: string;
}

// Images
export const dashboardBg = 'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766760007741_76529702.png';

export const propertyImages = [
  'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766760041626_220cd03c.png',
  'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766760041097_8226b693.png',
  'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766760044048_88c0b202.jpg',
  'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766760038366_b64fd5fe.png',
];

// Menu items for sidebar
export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'properties', label: 'Properties', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'offers', label: 'Offers', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];


// Utility function for status badge styling
export const getStatusBadgeStyle = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'pending': case 'pending review': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'suspended': case 'rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
    case 'sold': case 'completed': return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'new': return 'bg-violet-100 text-violet-700 border border-violet-200';
    case 'under review': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'offer sent': return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};
