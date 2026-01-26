import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminStats } from './adminData';
import { Deal, DealStage, YesNoUnknown, FollowDeal, FollowStage, FollowPipeline, formatCurrency } from './dealTypes';
import DealPipelineBoard, { DealPipelineBoardRef } from './DealPipelineBoard';
import DealDetail from './DealDetail';
import DealInfoSection from './DealInfoSection';
import ScenarioSection from './ScenarioSection';
import TasksSection from './TasksSection';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';




interface AdminDashboardProps {
  stats: AdminStats;
  onViewAllProperties: () => void;
  onViewUsers: () => void;
}

interface PropertyFromDB {
  id: string;
  title: string;
  description: string | null;
  state: string;
  county: string;
  apn: string;
  size: string;
  price: string;
  status: string;
  closing_date: string | null;
  next_follow_up: string | null;
  last_contact_date: string | null;
  notes: string | null;
  purchase_price: string | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  images: string[] | null;
  thumbnail: string | null;
  zoning: string | null;
  road_access: string;
  water: string;
  power: string;
  sewer: string;
  annual_tax: string | null;
  is_featured: boolean | null;
  views: number | null;
}

// Extended FollowDeal with stage and pipeline info from API
interface FollowDealDetail extends FollowDeal {
  stageInfo?: FollowStage | null;
  pipelineInfo?: FollowPipeline | null;
}

// Map database property to Deal interface
const mapPropertyToDeal = (property: PropertyFromDB): Deal => {
  return {
    id: property.id,
    title: property.title || 'Untitled Property',
    description: property.description,
    apn: property.apn || 'N/A',
    state: property.state || 'Unknown',
    county: property.county || 'Unknown',
    acreage: parseFloat(property.size) || 0,
    price: parseFloat(property.price) || 0,
    purchasePrice: property.purchase_price ? parseFloat(property.purchase_price) : null,
    closingDate: property.closing_date,
    stage: (property.status as DealStage) || 'lead',
    nextFollowUp: property.next_follow_up,
    createdAt: property.created_at,
    lastContactDate: property.last_contact_date,
    notes: property.notes || '',
    latitude: property.latitude,
    longitude: property.longitude,
    images: property.images,
    thumbnail: property.thumbnail,
    zoning: property.zoning,
    roadAccess: (property.road_access as YesNoUnknown) || 'unknown',
    water: (property.water as YesNoUnknown) || 'unknown',
    power: (property.power as YesNoUnknown) || 'unknown',
    sewer: (property.sewer as YesNoUnknown) || 'unknown',
    annualTax: property.annual_tax,
    isFeatured: property.is_featured || false,
    views: property.views || 0,
  };
};

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [followDeals, setFollowDeals] = useState<FollowDeal[]>([]);
  const [followStages, setFollowStages] = useState<FollowStage[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedFollowDeal, setSelectedFollowDeal] = useState<FollowDealDetail | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [dealDetailLoading, setDealDetailLoading] = useState(false);
  const [dealDetailError, setDealDetailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scenarioRefreshTrigger, setScenarioRefreshTrigger] = useState(0);
  const [pipelineActiveTab, setPipelineActiveTab] = useState<string>('pipeline');

  // Ref for DealPipelineBoard to call scrollToStage
  const pipelineBoardRef = useRef<DealPipelineBoardRef>(null);

  // Handler to scroll to a specific stage in the pipeline board
  const handleStageClick = (stageId: number) => {
    if (pipelineBoardRef.current) {
      pipelineBoardRef.current.scrollToStage(stageId);
    }
  };


  // Handler to refresh scenarios when deal info is saved
  const handleScenariosUpdated = () => {
    setScenarioRefreshTrigger(prev => prev + 1);
  };

  // Fetch data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch properties for list view
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
      }

      if (propertiesData) {
        const mappedDeals = propertiesData.map(mapPropertyToDeal);
        setDeals(mappedDeals);
      }

      // Fetch follow_deal for pipeline stats
      const { data: followDealsData, error: followDealsError } = await supabase
        .from('follow_deal')
        .select('*')
        .order('orderWeight', { ascending: true });

      if (followDealsError) {
        console.error('Error fetching follow deals:', followDealsError);
      }

      if (followDealsData) {
        setFollowDeals(followDealsData);
      }

      // Fetch follow_stages for stats - ordered by 'order' field
      const { data: stagesData, error: stagesError } = await supabase
        .from('follow_stages')
        .select('*')
        .order('order', { ascending: true });

      if (stagesError) {
        console.error('Error fetching stages:', stagesError);
      }

      if (stagesData) {
        setFollowStages(stagesData);
      }

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDealMove = async (dealId: string, newStage: DealStage) => {
    // Optimistically update the UI
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
    
    // Update selected deal if it's the one being moved
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(prev => prev ? { ...prev, stage: newStage } : null);
    }

    // Update the status in Supabase
    try {
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: newStage })
        .eq('id', dealId);

      if (updateError) {
        throw updateError;
      }

      // Log the activity
      await supabase.from('activity_logs').insert({
        action: `Deal moved to ${newStage.replace('_', ' ')}`,
        entity_type: 'property',
        entity_id: dealId,
        details: { previous_stage: deals.find(d => d.id === dealId)?.stage, new_stage: newStage }
      });

    } catch (err: any) {
      console.error('Error updating deal status:', err);
      // Revert the optimistic update on error
      fetchData();
    }
  };

  const handleDealSelect = (deal: Deal) => {
    setSelectedDeal(deal);
    setSelectedFollowDeal(null);
    setSelectedDealId(null);
  };

  // Fetch deal detail from edge function
  const handleFollowDealSelect = async (deal: FollowDeal) => {
    setSelectedDeal(null);
    setSelectedDealId(deal.id);
    setDealDetailLoading(true);
    setDealDetailError(null);

    try {
      // Call the get-detail-deal edge function
      const { data, error } = await supabase.functions.invoke('get-detail-deal', {
        body: { id: deal.id }
      });

      if (error) {
        throw error;
      }

      if (data && data.success && data.deal) {
        setSelectedFollowDeal(data.deal as FollowDealDetail);
      } else {
        throw new Error(data?.error || 'Failed to fetch deal details');
      }
    } catch (err: any) {
      console.error('Error fetching deal details:', err);
      setDealDetailError(err.message || 'Failed to fetch deal details');
      // Fallback to using the local deal data
      setSelectedFollowDeal(deal);
    } finally {
      setDealDetailLoading(false);
    }
  };

  // Get stage counts for stats
  const getStageCount = (stageName: string) => {
    const stage = followStages.find(s => s.name?.toLowerCase().includes(stageName.toLowerCase()));
    if (!stage) return 0;
    return followDeals.filter(d => d.stageId === stage.id).length;
  };

  // Calculate stats from follow_deal data - moved before early returns to follow rules of hooks
  const totalValue = followDeals.reduce((sum, d) => sum + (d.price || 0), 0);
  
  // Closed Commission: sum of commissionValue where stageId is 25
  const closedCommission = followDeals
    .filter(d => d.stageId === 25)
    .reduce((sum, d) => sum + (d.commissionValue || 0), 0);
  
  // Potential Commission: sum of commissionValue where stageId is 19, 66, 21, 107, or 33
  const potentialStageIds = [19, 66, 21, 107, 33];
  const potentialCommission = followDeals
    .filter(d => potentialStageIds.includes(d.stageId))
    .reduce((sum, d) => sum + (d.commissionValue || 0), 0);

  // Calculate monthly closed deal prices and commissions for bar chart (stageId = 25)
  // Must be called before any early returns to follow React's rules of hooks
  const monthlyClosedData = useMemo(() => {
    const closedDeals = followDeals.filter(d => d.stageId === 25);
    
    // Group by month using enteredStageAt - track both price and commission
    const monthlyData: { [key: string]: { price: number; commission: number } } = {};
    
    closedDeals.forEach(deal => {
      if (deal.enteredStageAt) {
        const date = new Date(deal.enteredStageAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { price: 0, commission: 0 };
        }
        monthlyData[monthKey].price += (deal.price || 0);
        monthlyData[monthKey].commission += (deal.commissionValue || 0);
      }
    });

    // Convert to array and sort by month
    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Get last 12 months for display
    const last12Months = sortedMonths.slice(-12);
    
    return last12Months.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[parseInt(month) - 1];
      return {
        month: `${monthName} ${year.slice(2)}`,
        price: monthlyData[monthKey].price,
        commission: monthlyData[monthKey].commission,
        fullMonth: monthKey
      };
    });
  }, [followDeals]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Deals</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Custom tooltip for the bar chart - shows both price and commission
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-slate-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Deal Management</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your land deals pipeline</p>
        </div>
      </div>



      {/* Monthly Closed Deals Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Monthly Closed Deal Volume</h3>
            <p className="text-sm text-slate-500">Sum of deal prices and commissions by month (Closed stage)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#27AE60]"></div>
              <span className="text-sm text-slate-600">Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-sm text-slate-600">Commission</span>
            </div>
          </div>
        </div>
        {monthlyClosedData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyClosedData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={{ stroke: '#e2e8f0' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={{ stroke: '#e2e8f0' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                />
                <Bar 
                  dataKey="price" 
                  name="Price"
                  fill="#27AE60" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="commission" 
                  name="Commission"
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <p className="text-slate-500">No closed deals data available</p>
          </div>
        )}
      </div>

      {/* Quick Stats - Using follow_deal data */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <div>
              <div className="text-2xl font-bold text-slate-800">{followDeals.length}</div>
              <div className="text-xs text-slate-500">Total Deals</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div>
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalValue)}</div>
              <div className="text-xs text-slate-500">Total Value</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(closedCommission)}</div>
              <div className="text-xs text-slate-500">Closed Commission</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(potentialCommission)}</div>
              <div className="text-xs text-slate-500">Potential Commission</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div>
              <div className="text-2xl font-bold text-slate-800">{followDeals.filter(d => d.status === 'Active').length}</div>
              <div className="text-xs text-slate-500">Active Deals</div>
            </div>
          </div>
        </div>
      </div>


      {/* Stage-based Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Deals by Stage</h3>
        <div className="flex flex-wrap gap-3">
          {followStages.map((stage, index) => {
            const count = followDeals.filter(d => d.stageId === stage.id).length;
            const colors = ['bg-blue-100 text-blue-700 hover:bg-blue-200', 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200', 'bg-green-100 text-green-700 hover:bg-green-200', 'bg-amber-100 text-amber-700 hover:bg-amber-200', 'bg-orange-100 text-orange-700 hover:bg-orange-200', 'bg-purple-100 text-purple-700 hover:bg-purple-200', 'bg-pink-100 text-pink-700 hover:bg-pink-200', 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200', 'bg-teal-100 text-teal-700 hover:bg-teal-200', 'bg-slate-100 text-slate-700 hover:bg-slate-200'];
            const colorClass = colors[index % colors.length];
            return (
              <button 
                key={stage.id} 
                onClick={() => handleStageClick(stage.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${colorClass} cursor-pointer transition-colors duration-200`}
              >
                {stage.name}: <span className="font-bold">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-6">
        {/* Pipeline View */}
        <div>
          <DealPipelineBoard
            ref={pipelineBoardRef}
            onDealSelect={handleFollowDealSelect}
            selectedDealId={selectedDealId}
            pipelineId={1}
            onTabChange={(tab) => setPipelineActiveTab(tab)}
          />
        </div>



        {/* Bottom Row - Deal Detail (Left) & Deal Info + Scenario (Right) */}
        {/* Only show when Pipeline Board tab is active (not EMD or Closing Schedule) */}
        {pipelineActiveTab === 'pipeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Deal Detail + Tasks stacked */}
            <div className="w-full flex flex-col gap-6">
              {dealDetailLoading ? (
                <DealDetailLoading />
              ) : dealDetailError ? (
                <DealDetailError error={dealDetailError} onRetry={() => selectedFollowDeal && handleFollowDealSelect(selectedFollowDeal)} />
              ) : selectedFollowDeal ? (
                <FollowDealDetailCard deal={selectedFollowDeal} stages={followStages} />
              ) : (
                <DealDetail deal={selectedDeal} />
              )}

              {/* Tasks Section */}
              <TasksSection 
                dealId={selectedDealId} 
                deal={selectedFollowDeal}
                stages={followStages}
              />
            </div>

            {/* Right: Deal Info + Scenario stacked */}
            <div className="w-full flex flex-col gap-6">
              <DealInfoSection deal={selectedFollowDeal} stages={followStages} onScenariosUpdated={handleScenariosUpdated} />
              <ScenarioSection dealId={selectedDealId} refreshTrigger={scenarioRefreshTrigger} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Loading state for deal detail

const DealDetailLoading: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-bold text-slate-800 mb-4">Deal Details</h2>
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 text-sm">Loading deal details...</p>
    </div>
  </div>
);

// Error state for deal detail
interface DealDetailErrorProps {
  error: string;
  onRetry: () => void;
}

const DealDetailError: React.FC<DealDetailErrorProps> = ({ error, onRetry }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-bold text-slate-800 mb-4">Deal Details</h2>
    <div className="flex flex-col items-center justify-center py-8">
      <svg className="w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-600 text-sm mb-3">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Component to display FollowDeal details
interface FollowDealDetailCardProps {
  deal: FollowDealDetail;
  stages: FollowStage[];
}

const FollowDealDetailCard: React.FC<FollowDealDetailCardProps> = ({ deal, stages }) => {
  // Use stageInfo from API response if available, otherwise fallback to stages prop
  const stageName = deal.stageInfo?.name || stages.find(s => s.id === deal.stageId)?.name || 'Unknown Stage';
  const pipelineName = deal.pipelineInfo?.name || 'Unknown Pipeline';
  
  const parseCountyState = (countyState: string | null) => {
    if (!countyState) return { county: '--', state: '--' };
    const parts = countyState.split(',').map(s => s.trim());
    return {
      county: parts[0] || '--',
      state: parts[1] || '--'
    };
  };

  const { county, state } = parseCountyState(deal.customCountyState);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Deal Details</h2>
      
      <div className="space-y-4">
        {/* Deal Name */}
        <div>
          <h3 className="text-xl font-semibold text-slate-800 break-words">{deal.name || 'Untitled Deal'}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              {stageName}
            </span>
            {deal.pipelineInfo && (
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                {pipelineName}
              </span>
            )}
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Price</div>
            <div className="text-lg font-bold text-emerald-600">{formatCurrency(deal.price)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Commission</div>
            <div className="text-lg font-bold text-green-600">{formatCurrency(deal.commissionValue)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Acreage</div>
            <div className="text-base font-semibold text-slate-800">{deal.customAcres || '--'} Acres</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Status</div>
            <div className="text-base font-semibold text-slate-800">{deal.status || '--'}</div>
          </div>
        </div>

        {/* Location */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Location</div>
          <div className="text-base text-slate-800">{county}, {state}</div>
        </div>

        {/* APN */}
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">APN</div>
          <div className="text-base text-slate-800 font-mono break-all">{deal.customAPN || '--'}</div>
        </div>

        {/* Profile Link */}
        {deal.customProfileLink && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Profile Link</div>
            <a 
              href={deal.customProfileLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
            >
              {deal.customProfileLink}
            </a>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Created</div>
            <div className="text-sm text-slate-800">
              {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '--'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Projected Close</div>
            <div className="text-sm text-slate-800">
              {deal.projectedCloseDate ? new Date(deal.projectedCloseDate).toLocaleDateString() : '--'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Entered Stage</div>
            <div className="text-sm text-slate-800">
              {deal.enteredStageAt ? new Date(deal.enteredStageAt).toLocaleDateString() : '--'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Mutual Acceptance</div>
            <div className="text-sm text-slate-800">
              {deal.mutualAcceptanceDate ? new Date(deal.mutualAcceptanceDate).toLocaleDateString() : '--'}
            </div>
          </div>
        </div>

        {/* Additional Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Earnest Money Due</div>
            <div className="text-sm text-slate-800">
              {deal.earnestMoneyDueDate ? new Date(deal.earnestMoneyDueDate).toLocaleDateString() : '--'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Due Diligence</div>
            <div className="text-sm text-slate-800">
              {deal.dueDiligenceDate ? new Date(deal.dueDiligenceDate).toLocaleDateString() : '--'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Final Walk Through</div>
            <div className="text-sm text-slate-800">
              {deal.finalWalkThroughDate ? new Date(deal.finalWalkThroughDate).toLocaleDateString() : '--'}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Possession</div>
            <div className="text-sm text-slate-800">
              {deal.possessionDate ? new Date(deal.possessionDate).toLocaleDateString() : '--'}
            </div>
          </div>
        </div>

        {/* Commission Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Agent Commission</div>
            <div className="text-sm font-semibold text-slate-800">{formatCurrency(deal.agentCommission)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Team Commission</div>
            <div className="text-sm font-semibold text-slate-800">{formatCurrency(deal.teamCommission)}</div>
          </div>
        </div>

        {/* Time to Close */}
        {deal.timeToClose && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Time to Close</div>
            <div className="text-base text-slate-800">{deal.timeToClose} days</div>
          </div>
        )}

        {/* Custom Fields */}
        {deal.customAcceptedOfferPrice && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Accepted Offer Price</div>
            <div className="text-base font-semibold text-emerald-600">{deal.customAcceptedOfferPrice}</div>
          </div>
        )}

        {deal.customCurrentListedPrice && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current Listed Price</div>
            <div className="text-base font-semibold text-slate-800">{deal.customCurrentListedPrice}</div>
          </div>
        )}

        {deal.customExtensionUsed && (
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Extension Used</div>
            <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-purple-100 text-purple-700">
              {deal.customExtensionUsed}
            </span>
          </div>
        )}

        {/* Description */}
        {deal.description && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Description</div>
            <div className="text-sm text-slate-700">{deal.description}</div>
          </div>
        )}

        {/* Assigned Users */}
        {deal.users && deal.users.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Assigned To</div>
            <div className="flex flex-wrap gap-2">
              {deal.users.map((user: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                    {user.picture?.['26x26'] ? (
                      <img src={user.picture['26x26']} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* People */}
        {deal.people && deal.people.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Related People</div>
            <div className="flex flex-wrap gap-2">
              {deal.people.map((person: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-medium text-slate-600">
                    {person.avatar ? (
                      <img src={person.avatar} alt={person.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      person.name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{person.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
