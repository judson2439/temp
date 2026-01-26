import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from './dealTypes';

// Define the six scenario types with their corresponding table names
const SCENARIO_TYPES = [
  { id: 'original', name: 'Original', tableName: 'follow_original_scenario' },
  { id: 'renegotiated', name: 'Renegotiated', tableName: 'follow_renegotiated_scenario' },
  { id: 'realistic', name: 'Realistic', tableName: 'follow_realistic_scenario' },
  { id: 'ideal', name: 'Ideal', tableName: 'follow_ideal_scenario' },
  { id: 'minimum', name: 'Minimum', tableName: 'follow_minimum_scenario' },
  { id: 'listing', name: 'Listing', tableName: 'follow_listing_scenario' },
];

// Deal Profit Targets - Tiers based on Total Costs
const PROFIT_TIERS = [
  { maxCost: 50000, minProfit: 12000, targetProfit: 15000, tierName: 'Tier 1 (Under $50K)' },
  { maxCost: 100000, minProfit: 20000, targetProfit: 25000, tierName: 'Tier 2 ($50K-$100K)' },
  { maxCost: 150000, minProfit: 30000, targetProfit: 35000, tierName: 'Tier 3 ($100K-$150K)' },
  { maxCost: 250000, minProfit: 45000, targetProfit: 50000, tierName: 'Tier 4 ($150K-$250K)' },
  { maxCost: 400000, minProfit: 60000, targetProfit: 70000, tierName: 'Tier 5 ($250K-$400K)' },
  { maxCost: 600000, minProfit: 80000, targetProfit: 90000, tierName: 'Tier 6 ($400K-$600K)' },
  { maxCost: 800000, minProfit: 100000, targetProfit: 120000, tierName: 'Tier 7 ($600K-$800K)' },
];

// Helper function to get profit tier info based on total costs
const getProfitTierInfo = (totalCosts: number | null): { minProfit: number; targetProfit: number; tierName: string } | null => {
  if (totalCosts === null || totalCosts === undefined || totalCosts <= 0) {
    return null;
  }
  
  for (const tier of PROFIT_TIERS) {
    if (totalCosts < tier.maxCost) {
      return { minProfit: tier.minProfit, targetProfit: tier.targetProfit, tierName: tier.tierName };
    }
  }
  
  // For costs above $800K, use the highest tier
  const lastTier = PROFIT_TIERS[PROFIT_TIERS.length - 1];
  return { minProfit: lastTier.minProfit, targetProfit: lastTier.targetProfit, tierName: 'Tier 7+ ($800K+)' };
};

// Helper function to check if scenario is below minimum profit
const isBelowMinimumProfit = (totalCosts: number | null, netProfit: number | null): boolean => {
  const tierInfo = getProfitTierInfo(totalCosts);
  if (!tierInfo) return false;
  
  const profit = netProfit ?? 0;
  return profit < tierInfo.minProfit;
};


interface Scenario {
  id: string;
  deal_id: number;
  scenario_type: string; // This will be the id from SCENARIO_TYPES
  tableName: string;
  sale_price: number | null;
  realtor_fee_percent: number | null;
  realtor_fee: number | null;
  total_costs: number | null;
  net_profit: number | null;
  roi_percent: number | null;
  coc_roi: number | null;
  min_sale_price: number | null;
  // Additional fields for original scenario
  listing_price?: number | null;
  updated_listing_price?: number | null;
  created_at: string;
  updated_at: string;
}

interface ScenarioSectionProps {
  dealId: number | null;
  refreshTrigger?: number;
}

const ScenarioSection: React.FC<ScenarioSectionProps> = ({ dealId, refreshTrigger }) => {

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeTab, setActiveTab] = useState<string>('original');
  const [loading, setLoading] = useState(true);
  const [scenariosLoading, setScenariosLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable fields state
  const [editSalePrice, setEditSalePrice] = useState<string>('');
  const [editRealtorFeePercent, setEditRealtorFeePercent] = useState<string>('');
  // Additional editable fields for Original scenario
  const [editListingPrice, setEditListingPrice] = useState<string>('');
  const [editUpdatedListingPrice, setEditUpdatedListingPrice] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize loading state
  useEffect(() => {
    setLoading(false);
  }, []);

  // Fetch scenarios when dealId changes
  useEffect(() => {
    if (dealId) {
      fetchAllScenarios(dealId);
    } else {
      setScenarios([]);
    }
  }, [dealId]);

  // Refresh scenarios when refreshTrigger changes (triggered from DealInfoSection)
  useEffect(() => {
    if (dealId && refreshTrigger !== undefined) {
      fetchAllScenarios(dealId);
    }
  }, [refreshTrigger]);

  // Update editable fields when active scenario changes
  useEffect(() => {
    const activeScenario = getScenarioForType(activeTab);
    if (activeScenario) {
      setEditSalePrice(activeScenario.sale_price?.toString() || '');
      setEditRealtorFeePercent(activeScenario.realtor_fee_percent?.toString() || '');
      // Set original scenario specific fields
      if (activeTab === 'original') {
        setEditListingPrice(activeScenario.listing_price?.toString() || '');
        setEditUpdatedListingPrice(activeScenario.updated_listing_price?.toString() || '');
      }
      setHasChanges(false);
    } else {
      setEditSalePrice('');
      setEditRealtorFeePercent('');
      setEditListingPrice('');
      setEditUpdatedListingPrice('');
      setHasChanges(false);
    }
  }, [activeTab, scenarios]);

  // Fetch scenarios from all six tables
  const fetchAllScenarios = async (dealId: number) => {
    try {
      setScenariosLoading(true);
      console.log('Fetching scenarios for deal_id:', dealId);
      
      const allScenarios: Scenario[] = [];

      // Fetch from each scenario table
      for (const scenarioType of SCENARIO_TYPES) {
        const { data, error } = await supabase
          .from(scenarioType.tableName)
          .select('*')
          .eq('deal_id', dealId)
          .maybeSingle();

        if (error) {
          console.error(`Error fetching from ${scenarioType.tableName}:`, error);
          continue;
        }

        if (data) {
          allScenarios.push({
            ...data,
            scenario_type: scenarioType.id,
            tableName: scenarioType.tableName,
          });
        }
      }

      console.log('Fetched scenarios:', allScenarios);
      setScenarios(allScenarios);
    } catch (err: any) {
      console.error('Error fetching scenarios:', err);
      setError(err.message);
    } finally {
      setScenariosLoading(false);
    }
  };

  const getScenarioForType = (typeId: string): Scenario | undefined => {
    return scenarios.find(s => s.scenario_type === typeId);
  };

  const getTableNameForType = (typeId: string): string => {
    return SCENARIO_TYPES.find(t => t.id === typeId)?.tableName || '';
  };

  // Check if a specific scenario type is below minimum profit
  const isScenarioBelowMinimum = (typeId: string): boolean => {
    const scenario = getScenarioForType(typeId);
    if (!scenario) return false;
    return isBelowMinimumProfit(scenario.total_costs, scenario.net_profit);
  };

  const handleSalePriceChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    setEditSalePrice(sanitized);
    setHasChanges(true);
    setSaveMessage(null);
  };

  const handleRealtorFeePercentChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    setEditRealtorFeePercent(sanitized);
    setHasChanges(true);
    setSaveMessage(null);
  };

  const handleListingPriceChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setEditListingPrice(sanitized);
    setHasChanges(true);
    setSaveMessage(null);
  };

  const handleUpdatedListingPriceChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setEditUpdatedListingPrice(sanitized);
    setHasChanges(true);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    const activeScenario = getScenarioForType(activeTab);
    const tableName = getTableNameForType(activeTab);
    
    if (!tableName) {
      setSaveMessage({ type: 'error', text: 'Invalid scenario type' });
      return;
    }

    try {
      setSaving(true);
      setSaveMessage(null);

      const salePrice = editSalePrice ? parseFloat(editSalePrice) : null;
      const realtorFeePercent = editRealtorFeePercent ? parseFloat(editRealtorFeePercent) : null;

      // Build update/insert data
      let updateData: Record<string, any> = {
        sale_price: salePrice,
        realtor_fee_percent: realtorFeePercent,
        updated_at: new Date().toISOString()
      };

      // Add original scenario specific fields
      if (activeTab === 'original') {
        updateData.listing_price = editListingPrice ? parseFloat(editListingPrice) : null;
        updateData.updated_listing_price = editUpdatedListingPrice ? parseFloat(editUpdatedListingPrice) : null;
      }

      if (activeScenario) {
        // Update existing record
        const { error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq('id', activeScenario.id);

        if (error) throw error;
      } else if (dealId) {
        // Insert new record
        const insertData = {
          deal_id: dealId,
          ...updateData,
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from(tableName)
          .insert(insertData);

        if (error) throw error;
      }

      // Call edge function to calculate and update all scenario fields
      if (dealId) {
        await calculateScenarios(dealId);
      }

      // Refresh scenarios to get updated data
      if (dealId) {
        await fetchAllScenarios(dealId);
      }

      setHasChanges(false);
      setSaveMessage({ type: 'success', text: 'Saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);

    } catch (err: any) {
      console.error('Error saving scenario:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  // Function to call edge function to calculate and update all scenario fields
  const calculateScenarios = async (dealId: number) => {
    try {
      console.log('Calling calculate-scenarios edge function for deal:', dealId);
      
      const { data, error } = await supabase.functions.invoke('calculate-scenarios', {
        body: { deal_id: dealId }
      });

      if (error) {
        console.error('Error calling calculate-scenarios:', error);
        return;
      }

      console.log('calculate-scenarios response:', data);
    } catch (err) {
      console.error('Error invoking calculate-scenarios:', err);
    }
  };

  const formatPercent = (value: number | null): string => {
    if (value === null || value === undefined) return '0.00%';
    return `${Number(value).toFixed(2)}%`;
  };

  const formatNumber = (value: number | null): string => {
    if (value === null || value === undefined) return '$0';
    return formatCurrency(Number(value));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Scenario</h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Scenario</h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (!dealId) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Scenario</h2>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">Select a deal to view scenarios</p>
        </div>
      </div>
    );
  }

  const activeScenario = getScenarioForType(activeTab);
  const activeTypeName = SCENARIO_TYPES.find(t => t.id === activeTab)?.name || 'Unknown';
  const isOriginalScenario = activeTab === 'original';
  
  // Get profit tier info for active scenario
  const activeTierInfo = activeScenario ? getProfitTierInfo(activeScenario.total_costs) : null;
  const isActiveBelowMinimum = activeScenario ? isBelowMinimumProfit(activeScenario.total_costs, activeScenario.net_profit) : false;
  const profitShortfall = isActiveBelowMinimum && activeTierInfo 
    ? activeTierInfo.minProfit - (activeScenario?.net_profit ?? 0)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Scenario</h2>
        {scenariosLoading && (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-200 pb-2">
        {SCENARIO_TYPES.map((type) => {
          const hasData = scenarios.some(s => s.scenario_type === type.id);
          const belowMinimum = isScenarioBelowMinimum(type.id);
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-t-lg transition-colors relative ${
                activeTab === type.id
                  ? belowMinimum
                    ? 'bg-red-100 text-red-700 border-b-2 border-red-500'
                    : 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : belowMinimum
                    ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {type.name}
              {hasData && !belowMinimum && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
              {belowMinimum && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {scenariosLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Below Minimum Profit Warning */}
            {isActiveBelowMinimum && activeTierInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <div className="font-semibold text-red-700 text-sm">Below Minimum Profit</div>
                    <div className="text-xs text-red-600 mt-1">
                      <div><strong>{activeTierInfo.tierName}</strong></div>
                      <div className="mt-1">
                        Required Min Profit: <strong>{formatCurrency(activeTierInfo.minProfit)}</strong>
                      </div>
                      <div>
                        Current Net Profit: <strong>{formatNumber(activeScenario?.net_profit ?? null)}</strong>
                      </div>
                      <div className="mt-1 text-red-700 font-semibold">
                        Shortfall: {formatCurrency(profitShortfall)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario Type Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{activeTypeName} Scenario</span>
              <span className="text-xs text-slate-400">Deal ID: {dealId}</span>
            </div>

            {/* Editable Fields - Sale Price & Realtor Fee Percent on one line */}
            <div className="grid grid-cols-2 gap-3">
              {/* Field 1: Sale Price - EDITABLE */}
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-emerald-600 uppercase tracking-wide font-semibold">1. Sale Price</div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Editable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-700">$</span>
                  <input
                    type="text"
                    value={editSalePrice}
                    onChange={(e) => handleSalePriceChange(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-lg font-bold text-emerald-700 bg-white border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-0"
                  />
                </div>
              </div>

              {/* Field 2: Realtor Fee Percent - EDITABLE */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-blue-600 uppercase tracking-wide font-semibold">2. Realtor Fee %</div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Editable</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editRealtorFeePercent}
                    onChange={(e) => handleRealtorFeePercentChange(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-lg font-bold text-blue-700 bg-white border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
                  />
                  <span className="text-lg font-bold text-blue-700">%</span>
                </div>
              </div>
            </div>

            {/* Additional Editable Fields for Original Scenario */}
            {isOriginalScenario && (
              <div className="grid grid-cols-2 gap-3">
                {/* Listing Price - EDITABLE */}
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Listing Price</div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Editable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-700">$</span>
                    <input
                      type="text"
                      value={editListingPrice}
                      onChange={(e) => handleListingPriceChange(e.target.value)}
                      placeholder="0"
                      className="flex-1 text-lg font-bold text-purple-700 bg-white border border-purple-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-0"
                    />
                  </div>
                </div>

                {/* Updated Listing Price - EDITABLE */}
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-orange-600 uppercase tracking-wide font-semibold">Updated Listing Price</div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Editable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-700">$</span>
                    <input
                      type="text"
                      value={editUpdatedListingPrice}
                      onChange={(e) => handleUpdatedListingPriceChange(e.target.value)}
                      placeholder="0"
                      className="flex-1 text-lg font-bold text-orange-700 bg-white border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Display-only Fields (6 fields) */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Display Only Fields</div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Field 3: Realtor Fee (Amount) */}
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">3. Realtor Fee</div>
                  <div className="text-base font-semibold text-slate-800">{formatNumber(activeScenario?.realtor_fee ?? null)}</div>
                </div>

                {/* Field 4: Total Costs */}
                <div className={`rounded-lg p-3 border ${activeTierInfo ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                  <div className={`text-xs uppercase tracking-wide mb-1 ${activeTierInfo ? 'text-amber-600' : 'text-slate-500'}`}>4. Total Costs</div>
                  <div className={`text-base font-semibold ${activeTierInfo ? 'text-amber-800' : 'text-slate-800'}`}>
                    {formatNumber(activeScenario?.total_costs ?? null)}
                  </div>
                  {activeTierInfo && (
                    <div className="text-xs text-amber-600 mt-1">{activeTierInfo.tierName}</div>
                  )}
                </div>

                {/* Field 5: Net Profit */}
                <div className={`rounded-lg p-3 border ${
                  isActiveBelowMinimum 
                    ? 'bg-red-50 border-red-300' 
                    : (Number(activeScenario?.net_profit) || 0) >= 0 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                }`}>
                  <div className={`text-xs uppercase tracking-wide mb-1 ${
                    isActiveBelowMinimum 
                      ? 'text-red-600' 
                      : (Number(activeScenario?.net_profit) || 0) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                  }`}>5. Net Profit</div>
                  <div className={`text-base font-semibold ${
                    isActiveBelowMinimum 
                      ? 'text-red-700' 
                      : (Number(activeScenario?.net_profit) || 0) >= 0 
                        ? 'text-green-700' 
                        : 'text-red-700'
                  }`}>
                    {formatNumber(activeScenario?.net_profit ?? null)}
                  </div>
                  {isActiveBelowMinimum && activeTierInfo && (
                    <div className="text-xs text-red-600 mt-1 font-medium">
                      Min Required: {formatCurrency(activeTierInfo.minProfit)}
                    </div>
                  )}
                </div>

                {/* Field 6: ROI Percent */}
                <div className={`rounded-lg p-3 border ${(Number(activeScenario?.roi_percent) || 0) >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                  <div className={`text-xs uppercase tracking-wide mb-1 ${(Number(activeScenario?.roi_percent) || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>6. ROI Percent</div>
                  <div className={`text-base font-semibold ${(Number(activeScenario?.roi_percent) || 0) >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    {formatPercent(activeScenario?.roi_percent ?? null)}
                  </div>
                </div>

                {/* Field 7: CoC ROI */}
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">7. CoC ROI</div>
                  <div className="text-base font-semibold text-slate-800">{formatPercent(activeScenario?.coc_roi ?? null)}</div>
                </div>

                {/* Field 8: Min Sale Price */}
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">8. Min Sale Price</div>
                  <div className="text-base font-semibold text-slate-800">{formatNumber(activeScenario?.min_sale_price ?? null)}</div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  saving
                    ? 'bg-blue-400 cursor-not-allowed'
                    : hasChanges
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>

              {/* Save Message */}
              {saveMessage && (
                <div className={`mt-2 text-sm text-center py-2 px-3 rounded-lg ${
                  saveMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {saveMessage.text}
                </div>
              )}
            </div>

            {/* Last Updated */}
            {activeScenario && (
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                Last updated: {activeScenario.updated_at ? new Date(activeScenario.updated_at).toLocaleString() : '--'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scenarios Summary */}
      {scenarios.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 mb-2">Available Scenarios: {scenarios.length}</div>
          <div className="flex flex-wrap gap-1">
            {scenarios.map((scenario) => {
              const typeName = SCENARIO_TYPES.find(t => t.id === scenario.scenario_type)?.name || 'Unknown';
              const belowMinimum = isBelowMinimumProfit(scenario.total_costs, scenario.net_profit);
              return (
                <span
                  key={scenario.id}
                  className={`px-2 py-0.5 text-xs rounded-full cursor-pointer transition-colors ${
                    activeTab === scenario.scenario_type
                      ? belowMinimum
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                      : belowMinimum
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  onClick={() => setActiveTab(scenario.scenario_type)}
                >
                  {typeName}
                  {belowMinimum && ' ⚠'}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSection;
