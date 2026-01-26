// Deal Types
export type DealStage = 'lead' | 'under_contract' | 'due_diligence' | 'closing' | 'listed' | 'sold';

// Utility type for yes/no/unknown fields
export type YesNoUnknown = 'yes' | 'no' | 'unknown';

export interface Deal {
  id: string;
  title: string;
  description: string | null;
  apn: string;
  state: string;
  county: string;
  acreage: number;
  price: number;
  purchasePrice: number | null;
  closingDate: string | null;
  stage: DealStage;
  nextFollowUp: string | null;
  createdAt: string;
  lastContactDate: string | null;
  notes: string;
  // Additional property fields
  latitude: number | null;
  longitude: number | null;
  images: string[] | null;
  thumbnail: string | null;
  zoning: string | null;
  roadAccess: YesNoUnknown;
  water: YesNoUnknown;
  power: YesNoUnknown;
  sewer: YesNoUnknown;
  annualTax: string | null;
  isFeatured: boolean;
  views: number;
}

// Follow Deal from follow_deal table
export interface FollowDeal {
  id: number;
  name: string | null;
  description: string | null;
  type: number | null;
  status: string | null;
  price: number | null;
  orderWeight: number | null;
  pipelineId: number | null;
  stageId: number | null;
  commissionValue: number | null;
  agentCommission: number | null;
  teamCommission: number | null;
  timeToClose: number | null;
  earnestMoneyDueDate: string | null;
  mutualAcceptanceDate: string | null;
  dueDiligenceDate: string | null;
  finalWalkThroughDate: string | null;
  possessionDate: string | null;
  customAcceptedOfferPrice: string | null;
  customAcres: string | null;
  customAPN: string | null;
  customCountyState: string | null;
  customCurrentListedPrice: string | null;
  customExtensionUsed: string | null;
  customProfileLink: string | null;
  people: any[] | null;
  users: any[] | null;
  createdAt: string | null;
  projectedCloseDate: string | null;
  enteredStageAt: string | null;
}

// Follow Stage from follow_stages table
export interface FollowStage {
  id: number;
  name: string | null;
  order: number | null;
  pipelineId: number | null;
  created_at: string;
}

// Follow Pipeline from follow_pipeline table
export interface FollowPipeline {
  id: number;
  name: string | null;
  created_at: string;
}

// Stage column with dynamic colors
export interface DynamicStageColumn {
  id: number;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Predefined color palette for stages
export const stageColorPalette = [
  { color: 'text-white', bgColor: 'bg-blue-600', borderColor: 'border-blue-600' },
  { color: 'text-white', bgColor: 'bg-emerald-500', borderColor: 'border-emerald-500' },
  { color: 'text-white', bgColor: 'bg-green-600', borderColor: 'border-green-600' },
  { color: 'text-white', bgColor: 'bg-amber-500', borderColor: 'border-amber-500' },
  { color: 'text-white', bgColor: 'bg-orange-500', borderColor: 'border-orange-500' },
  { color: 'text-white', bgColor: 'bg-purple-500', borderColor: 'border-purple-500' },
  { color: 'text-white', bgColor: 'bg-pink-500', borderColor: 'border-pink-500' },
  { color: 'text-white', bgColor: 'bg-indigo-500', borderColor: 'border-indigo-500' },
  { color: 'text-white', bgColor: 'bg-teal-500', borderColor: 'border-teal-500' },
  { color: 'text-white', bgColor: 'bg-slate-700', borderColor: 'border-slate-700' },
];

// Get color for stage by index
export const getStageColor = (index: number) => {
  return stageColorPalette[index % stageColorPalette.length];
};

export interface StageColumn {
  id: DealStage;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Stage definitions with colors matching the reference image
export const stageColumns: StageColumn[] = [
  { id: 'lead', title: 'Lead', color: 'text-white', bgColor: 'bg-blue-600', borderColor: 'border-blue-600' },
  { id: 'under_contract', title: 'Under Contract', color: 'text-white', bgColor: 'bg-emerald-500', borderColor: 'border-emerald-500' },
  { id: 'due_diligence', title: 'Due Diligence', color: 'text-white', bgColor: 'bg-green-600', borderColor: 'border-green-600' },
  { id: 'closing', title: 'Closing', color: 'text-white', bgColor: 'bg-amber-500', borderColor: 'border-amber-500' },
  { id: 'listed', title: 'Listed', color: 'text-white', bgColor: 'bg-orange-500', borderColor: 'border-orange-500' },
  { id: 'sold', title: 'Sold', color: 'text-white', bgColor: 'bg-slate-700', borderColor: 'border-slate-700' },
];

// Get stage badge styling
export const getStageBadgeStyle = (stage: DealStage): { bg: string; text: string; border: string } => {
  switch (stage) {
    case 'lead':
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    case 'under_contract':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'due_diligence':
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    case 'closing':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    case 'listed':
      return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
    case 'sold':
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  }
};

// Format stage name for display
export const formatStageName = (stage: DealStage): string => {
  switch (stage) {
    case 'lead': return 'Lead';
    case 'under_contract': return 'Under Contract';
    case 'due_diligence': return 'Due Diligence';
    case 'closing': return 'Closing';
    case 'listed': return 'Listed';
    case 'sold': return 'Sold';
    default: return stage;
  }
};

// Helper functions
export const getDealsForStage = (deals: Deal[], stage: DealStage): Deal[] => {
  return deals.filter(deal => deal.stage === stage);
};

// Get follow deals for a specific stage
export const getFollowDealsForStage = (deals: FollowDeal[], stageId: number): FollowDeal[] => {
  return deals.filter(deal => deal.stageId === stageId);
};

export const isOverdue = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isDueToday = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isDueTomorrow = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const isDueThisWeek = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);
  return date >= today && date <= endOfWeek;
};

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

export const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return '--';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

// Format Yes/No/Unknown values
export const formatYesNoUnknown = (value: YesNoUnknown): string => {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'unknown': return 'Unknown';
    default: return '--';
  }
};

// Get Yes/No/Unknown badge style
export const getYesNoUnknownStyle = (value: YesNoUnknown): string => {
  switch (value) {
    case 'yes': return 'bg-green-100 text-green-700';
    case 'no': return 'bg-red-100 text-red-700';
    case 'unknown': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
