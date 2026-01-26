// Utility type for yes/no/unknown fields
export type YesNoUnknown = 'yes' | 'no' | 'unknown';

// Property status type - matches pipeline stages
export type PropertyStatus = 'lead' | 'under_contract' | 'due_diligence' | 'closing' | 'listed' | 'sold';

// Database property type matching Supabase table structure
export interface DbProperty {
  id: string;
  title: string;
  description: string | null;
  price: number;
  size: number;
  county: string;
  state: string;
  apn: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[] | null;
  thumbnail: string | null;
  zoning: string | null;
  road_access: YesNoUnknown;
  water: YesNoUnknown;
  power: YesNoUnknown;
  sewer: YesNoUnknown;
  annual_tax: string | null;
  status: PropertyStatus;
  is_featured: boolean | null;
  created_at: string | null;
  views: number | null;
  closing_date?: string | null;
  next_follow_up?: string | null;
  last_contact_date?: string | null;
  notes?: string | null;
  purchase_price?: number | null;
}




// UI property type for components
export interface Property {
  id: string;
  slug: string;
  title: string;
  city: string;
  county: string;
  state: string;
  acres: number;
  price: number;
  image: string;
  images: string[];
  description: string;
  roadAccess: YesNoUnknown;
  utilities: string;
  zoning: string;
  apn?: string;
  lat?: number;
  lng?: number;
  ownerFinancing?: boolean;
  waterfront?: boolean;
  hoa?: boolean;
  featured?: boolean;
  monthlyPayment?: number;
  water: YesNoUnknown;
  power: YesNoUnknown;
  sewer: YesNoUnknown;
  annualTaxes?: string;
  status?: PropertyStatus;
  views?: number;
}



// Transform database property to UI property
export function transformDbPropertyToUi(dbProp: DbProperty): Property {
  // Build utilities string from water/power/sewer
  const utilityParts: string[] = [];
  if (dbProp.water === 'yes') utilityParts.push('Water');
  if (dbProp.power === 'yes') utilityParts.push('Power');
  if (dbProp.sewer === 'yes') utilityParts.push('Sewer');
  const utilities = utilityParts.length > 0 ? utilityParts.join(', ') : 'None on site';

  return {
    id: dbProp.id,
    slug: `${dbProp.title.toLowerCase().replace(/\s+/g, '-')}-${dbProp.county.toLowerCase().replace(/\s+/g, '-')}-${dbProp.state.toLowerCase()}`,
    title: dbProp.title,
    city: dbProp.county,
    county: dbProp.county,
    state: dbProp.state,
    acres: Number(dbProp.size),
    price: Number(dbProp.price),
    image: dbProp.thumbnail || dbProp.images?.[0] || '/placeholder.svg',
    images: dbProp.images || [],
    description: dbProp.description || '',
    roadAccess: dbProp.road_access,
    utilities,
    zoning: dbProp.zoning || 'N/A',
    apn: dbProp.apn || undefined,
    lat: dbProp.latitude ? Number(dbProp.latitude) : undefined,
    lng: dbProp.longitude ? Number(dbProp.longitude) : undefined,
    water: dbProp.water,
    power: dbProp.power,
    sewer: dbProp.sewer,
    annualTaxes: dbProp.annual_tax || undefined,
    status: dbProp.status,
    featured: dbProp.is_featured || false,
    views: dbProp.views || 0,
  };
}

// Helper function to get status display name
export function getStatusDisplayName(status: PropertyStatus): string {
  switch (status) {
    case 'lead': return 'Lead';
    case 'under_contract': return 'Under Contract';
    case 'due_diligence': return 'Due Diligence';
    case 'closing': return 'Closing';
    case 'listed': return 'Listed';
    case 'sold': return 'Sold';
    default: return status;
  }
}

// Helper function to get status badge style
export function getStatusBadgeStyle(status: PropertyStatus): string {
  switch (status) {
    case 'lead': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'under_contract': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'due_diligence': return 'bg-green-100 text-green-700 border border-green-200';
    case 'closing': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'listed': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'sold': return 'bg-slate-100 text-slate-700 border border-slate-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}
