import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from './dealTypes';

// Stage IDs for Buyer Under Contract and Clear to Close
const BUYER_UNDER_CONTRACT_STAGE_ID = 33;
const CLEAR_TO_CLOSE_STAGE_ID = 107;

// Default scenario table for net profit
const DEFAULT_SCENARIO_TABLE = 'follow_original_scenario';

interface ClosingDeal {
  id: number;
  name: string | null;
  customAPN: string | null;
  customCountyState: string | null;
  projectedCloseDate: string | null;
  stageId: number | null;
  stageName: string | null;
  netProfit: number | null;
}

interface ClosingScheduleProps {
  onDealClick?: (dealId: number) => void;
}

const ClosingSchedule: React.FC<ClosingScheduleProps> = ({ onDealClick }) => {
  const [deals, setDeals] = useState<ClosingDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDealId, setExpandedDealId] = useState<number | null>(null);

  useEffect(() => {
    fetchClosingDeals();
  }, []);

  const fetchClosingDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch deals with stageId 33 or 107
      const { data: dealsData, error: dealsError } = await supabase
        .from('follow_deal')
        .select('id, name, customAPN, customCountyState, projectedCloseDate, stageId')
        .in('stageId', [BUYER_UNDER_CONTRACT_STAGE_ID, CLEAR_TO_CLOSE_STAGE_ID])
        .order('projectedCloseDate', { ascending: true });

      if (dealsError) {
        throw dealsError;
      }

      if (!dealsData || dealsData.length === 0) {
        setDeals([]);
        return;
      }

      // Fetch stage names
      const { data: stagesData, error: stagesError } = await supabase
        .from('follow_stages')
        .select('id, name')
        .in('id', [BUYER_UNDER_CONTRACT_STAGE_ID, CLEAR_TO_CLOSE_STAGE_ID]);

      if (stagesError) {
        console.error('Error fetching stages:', stagesError);
      }

      const stageMap = new Map<number, string>();
      if (stagesData) {
        stagesData.forEach(stage => {
          stageMap.set(stage.id, stage.name || 'Unknown');
        });
      }

      // Fetch net_profit from default scenario for each deal
      const dealIds = dealsData.map(d => d.id);
      const { data: scenarioData, error: scenarioError } = await supabase
        .from(DEFAULT_SCENARIO_TABLE)
        .select('deal_id, net_profit')
        .in('deal_id', dealIds);

      if (scenarioError) {
        console.error('Error fetching scenarios:', scenarioError);
      }

      const scenarioMap = new Map<number, number | null>();
      if (scenarioData) {
        scenarioData.forEach(scenario => {
          scenarioMap.set(scenario.deal_id, scenario.net_profit);
        });
      }

      // Combine data
      const closingDeals: ClosingDeal[] = dealsData.map(deal => ({
        id: deal.id,
        name: deal.name,
        customAPN: deal.customAPN,
        customCountyState: deal.customCountyState,
        projectedCloseDate: deal.projectedCloseDate,
        stageId: deal.stageId,
        stageName: stageMap.get(deal.stageId || 0) || 'Unknown',
        netProfit: scenarioMap.get(deal.id) ?? null,
      }));

      setDeals(closingDeals);
    } catch (err: any) {
      console.error('Error fetching closing deals:', err);
      setError(err.message || 'Failed to fetch closing deals');
    } finally {
      setLoading(false);
    }
  };

  // Parse state from customCountyState (format: "County, State")
  const parseState = (countyState: string | null): string => {
    if (!countyState) return '--';
    const parts = countyState.split(',').map(s => s.trim());
    return parts[1] || '--';
  };

  // Filter deals by closing date range
  const filterDealsByDateRange = (daysFrom: number, daysTo: number): ClosingDeal[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(today);
    fromDate.setDate(fromDate.getDate() + daysFrom);
    
    const toDate = new Date(today);
    toDate.setDate(toDate.getDate() + daysTo);

    return deals.filter(deal => {
      if (!deal.projectedCloseDate) return false;
      const closeDate = new Date(deal.projectedCloseDate);
      closeDate.setHours(0, 0, 0, 0);
      return closeDate >= fromDate && closeDate <= toDate;
    });
  };

  // Get deals closing in next 30 days
  const dealsNext30Days = filterDealsByDateRange(0, 30);
  
  // Get deals closing in 31-60 days
  const dealsNext60Days = filterDealsByDateRange(31, 60);

  // Calculate total net profit for a list of deals
  const calculateTotalProfit = (dealsList: ClosingDeal[]): number => {
    return dealsList.reduce((sum, deal) => sum + (deal.netProfit || 0), 0);
  };

  const totalProfit30Days = calculateTotalProfit(dealsNext30Days);
  const totalProfit60Days = calculateTotalProfit(dealsNext60Days);

  // Toggle expanded state for a deal
  const toggleExpanded = (dealId: number) => {
    setExpandedDealId(prev => prev === dealId ? null : dealId);
  };

  // Handle "Go to Pipeline Board" click
  const handleGoToPipelineBoard = (e: React.MouseEvent, dealId: number) => {
    e.stopPropagation(); // Prevent triggering the row toggle
    if (onDealClick) {
      onDealClick(dealId);
    }
  };

  // Calculate days until closing
  const getDaysUntilClosing = (closeDate: string | null): number | null => {
    if (!closeDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const close = new Date(closeDate);
    close.setHours(0, 0, 0, 0);
    const diffTime = close.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Render a deal row with expandable dropdown
  const renderDealRow = (deal: ClosingDeal) => {
    const state = parseState(deal.customCountyState);
    const displayName = deal.name || deal.customAPN || 'Untitled Deal';
    const isPositiveProfit = (deal.netProfit || 0) >= 0;
    const isExpanded = expandedDealId === deal.id;
    const daysUntilClosing = getDaysUntilClosing(deal.projectedCloseDate);

    return (
      <div
        key={deal.id}
        className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all"
      >
        {/* Main Row - Clickable to expand/collapse */}
        <div
          onClick={() => toggleExpanded(deal.id)}
          className={`flex items-center justify-between py-3 px-4 cursor-pointer transition-all group ${
            isExpanded ? 'bg-slate-50 border-b border-slate-200' : 'hover:bg-slate-50'
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium text-slate-800 truncate transition-colors ${
                isExpanded ? 'text-blue-600' : 'group-hover:text-blue-600'
              }`}>
                {displayName}
              </span>
              {state !== '--' && (
                <span className="flex-shrink-0 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                  {state}
                </span>
              )}
            </div>
            {deal.customAPN && deal.name && (
              <div className="text-xs text-slate-500 mt-0.5 truncate">
                APN: {deal.customAPN}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
            {/* Stage Badge */}
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              deal.stageId === CLEAR_TO_CLOSE_STAGE_ID 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {deal.stageName}
            </span>

            {/* Closing Date */}
            <div className="text-right min-w-[90px]">
              <div className="text-xs text-slate-500">Close Date</div>
              <div className="text-sm font-medium text-slate-700">
                {formatDate(deal.projectedCloseDate)}
              </div>
            </div>

            {/* Net Profit */}
            <div className="text-right min-w-[100px]">
              <div className="text-xs text-slate-500">Net Profit</div>
              <div className={`text-sm font-bold ${isPositiveProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(deal.netProfit)}
              </div>
            </div>

            {/* Chevron icon - rotates when expanded */}
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-500'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 py-4 bg-slate-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Days Until Closing */}
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Days Until Closing</div>
                <div className={`text-lg font-bold ${
                  daysUntilClosing !== null && daysUntilClosing <= 7 
                    ? 'text-amber-600' 
                    : 'text-slate-800'
                }`}>
                  {daysUntilClosing !== null ? `${daysUntilClosing} days` : '--'}
                </div>
              </div>

              {/* County/State */}
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Location</div>
                <div className="text-sm font-medium text-slate-800 truncate">
                  {deal.customCountyState || '--'}
                </div>
              </div>

              {/* APN */}
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">APN</div>
                <div className="text-sm font-medium text-slate-800 truncate">
                  {deal.customAPN || '--'}
                </div>
              </div>

              {/* Stage */}
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Current Stage</div>
                <div className={`text-sm font-medium ${
                  deal.stageId === CLEAR_TO_CLOSE_STAGE_ID 
                    ? 'text-green-700' 
                    : 'text-blue-700'
                }`}>
                  {deal.stageName}
                </div>
              </div>
            </div>

            {/* Go to Pipeline Board Link */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-200">
              <button
                onClick={(e) => handleGoToPipelineBoard(e, deal.id)}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
              >
                <span>Go to Pipeline Board</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a section (30 days or 60 days)
  const renderSection = (
    title: string, 
    dealsList: ClosingDeal[], 
    totalProfit: number, 
    bgColor: string,
    iconColor: string
  ) => {
    return (
      <div className="mb-6">
        {/* Section Header */}
        <div className={`flex items-center justify-between ${bgColor} rounded-lg p-4 mb-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500">{dealsList.length} deal{dealsList.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Total Projected Profit</div>
            <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </div>
          </div>
        </div>

        {/* Deals List */}
        {dealsList.length > 0 ? (
          <div className="space-y-2">
            {dealsList.map(deal => renderDealRow(deal))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-slate-400">No deals closing in this period</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm">Loading closing schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          <svg className="w-10 h-10 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base font-semibold text-red-800 mb-2">Error Loading Schedule</h3>
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button
            onClick={fetchClosingDeals}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalDeals = dealsNext30Days.length + dealsNext60Days.length;
  const totalAllProfit = totalProfit30Days + totalProfit60Days;

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-500 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Closing Schedule</h2>
            <p className="text-blue-100 text-sm">
              What's closing soon and how much profit is coming in?
            </p>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-xs uppercase tracking-wide mb-1">
              Total Deals Closing (60 days)
            </div>
            <div className="text-3xl font-bold">{totalDeals}</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-100 text-sm">Total Projected Profit (60 days)</span>
          </div>
          <div className={`text-2xl font-bold ${totalAllProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {formatCurrency(totalAllProfit)}
          </div>
        </div>
      </div>


      {/* 30 Days Section */}
      {renderSection(
        'Closing in Next 30 Days',
        dealsNext30Days,
        totalProfit30Days,
        'bg-amber-50 border border-amber-200',
        'bg-amber-500'
      )}

      {/* 60 Days Section */}
      {renderSection(
        'Closing in 31-60 Days',
        dealsNext60Days,
        totalProfit60Days,
        'bg-blue-50 border border-blue-200',
        'bg-blue-500'
      )}

      {/* Empty State */}
      {totalDeals === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-600 mb-2">No Upcoming Closings</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            There are no deals in "Buyer Under Contract" or "Clear to Close" stages with projected close dates in the next 60 days.
          </p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchClosingDeals}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Schedule
        </button>
      </div>
    </div>
  );
};

export default ClosingSchedule;
