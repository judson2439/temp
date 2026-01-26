import React, { useState, useMemo, useEffect } from 'react';
import { formatCurrency, formatDate } from './dealTypes';
import { supabase } from '@/lib/supabase';

// EMD Deal interface based on API response
interface EMDData {
  personId: number;
  personName: string;
  customTCABEMDAmount: string | null;
  customTCABEffectiveDate: string | null;
  customACQDepositAmount: string | null;
  customTCABEMDDueDate: string | null;
  customTCABEMDPaid: string | null;
  customTCABEMDNonRefundable: string | null;
  customAPN: string | null;
  customCounty: string | null;
  customState: string | null;
  customAcreage: string | null;
  customACQOfferPrice: string | null;
  customTCTitleCompany: string | null;
}

interface EMDDeal {
  id: number;
  name: string;
  stageId: number;
  customAPN: string | null;
  customCountyState: string | null;
  createdAt: string;
  projectedCloseDate: string | null;
  people: Array<{ id: number; name: string; avatar: string }>;
  emdData: EMDData | null;
}

// Time period filter options
type TimePeriod = 'this-month' | 'last-month' | 'ytd' | 'prior-year' | 'all-time';

// Parse EMD amount from string (handles formats like "$100", "1,500", "250")
const parseEMDAmount = (amount: string | null): number => {
  if (!amount) return 0;
  // Remove $ sign, commas, and any non-numeric characters except decimal point
  const cleaned = amount.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Group deals by month
interface MonthGroup {
  monthKey: string;
  monthLabel: string;
  year: number;
  month: number;
  deals: EMDDeal[];
  totalEMD: number;
}

const EMDDashboard: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all-time');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [allDeals, setAllDeals] = useState<EMDDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch EMD deals from edge function
  useEffect(() => {
    const fetchEMDDeals = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke('get-emd-deals', {
          body: {}
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data && data.deals) {
          setAllDeals(data.deals);
        }
      } catch (err) {
        console.error('Error fetching EMD deals:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch EMD deals');
      } finally {
        setLoading(false);
      }
    };

    fetchEMDDeals();
  }, []);

  // Get available years for prior year dropdown
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allDeals.forEach(deal => {
      const dateStr = deal.emdData?.customTCABEffectiveDate || deal.createdAt;
      if (dateStr) {
        const year = new Date(dateStr).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allDeals]);

  // Filter deals based on time period
  const filteredDeals = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return allDeals.filter(deal => {
      const dateStr = deal.emdData?.customTCABEffectiveDate || deal.createdAt;
      if (!dateStr) return timePeriod === 'all-time';
      
      const dealDate = new Date(dateStr);
      const dealYear = dealDate.getFullYear();
      const dealMonth = dealDate.getMonth();

      switch (timePeriod) {
        case 'this-month':
          return dealYear === currentYear && dealMonth === currentMonth;
        case 'last-month':
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return dealYear === lastMonthYear && dealMonth === lastMonth;
        case 'ytd':
          return dealYear === currentYear;
        case 'prior-year':
          return dealYear === selectedYear;
        case 'all-time':
          return true;
        default:
          return true;
      }
    });
  }, [allDeals, timePeriod, selectedYear]);

  // Group filtered deals by month
  const monthGroups = useMemo(() => {
    const groups: Map<string, MonthGroup> = new Map();

    filteredDeals.forEach(deal => {
      const dateStr = deal.emdData?.customTCABEffectiveDate || deal.createdAt;
      if (!dateStr) return;
      
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!groups.has(monthKey)) {
        groups.set(monthKey, {
          monthKey,
          monthLabel,
          year,
          month,
          deals: [],
          totalEMD: 0
        });
      }

      const group = groups.get(monthKey)!;
      group.deals.push(deal);
      
      // Calculate EMD amount from customTCABEMDAmount or customACQDepositAmount
      const emdAmount = parseEMDAmount(deal.emdData?.customTCABEMDAmount) || 
                        parseEMDAmount(deal.emdData?.customACQDepositAmount);
      group.totalEMD += emdAmount;
    });

    // Sort by date descending (most recent first)
    return Array.from(groups.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [filteredDeals]);

  // Calculate totals from monthGroups to ensure consistency
  // (Previously calculated from filteredDeals, but deals without dates were excluded from monthGroups)
  const totalEMD = useMemo(() => {
    return monthGroups.reduce((sum, group) => sum + group.totalEMD, 0);
  }, [monthGroups]);

  // Count only deals that are included in month groups (have valid dates)
  const totalDeals = useMemo(() => {
    return monthGroups.reduce((sum, group) => sum + group.deals.length, 0);
  }, [monthGroups]);

  const avgEMD = totalDeals > 0 ? totalEMD / totalDeals : 0;

  // Toggle month expansion
  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey);
      } else {
        newSet.add(monthKey);
      }
      return newSet;
    });
  };

  // Expand/collapse all
  const expandAll = () => {
    setExpandedMonths(new Set(monthGroups.map(g => g.monthKey)));
  };

  const collapseAll = () => {
    setExpandedMonths(new Set());
  };

  // Get period label for display
  const getPeriodLabel = () => {
    switch (timePeriod) {
      case 'this-month':
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'last-month':
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'ytd':
        return `Year to Date (${new Date().getFullYear()})`;
      case 'prior-year':
        return `Year ${selectedYear}`;
      case 'all-time':
        return 'All Time';
      default:
        return '';
    }
  };

  // Get stage name by ID
  const getStageName = (stageId: number): string => {
    const stageMap: Record<number, string> = {
      66: 'Contract Signed',
      21: 'Due Diligence',
      107: 'Extension',
      33: 'Clear to Close',
      25: 'Closed'
    };
    return stageMap[stageId] || `Stage ${stageId}`;
  };

  // Get stage color
  const getStageColor = (stageId: number): string => {
    const colorMap: Record<number, string> = {
      66: 'bg-blue-100 text-blue-700',
      21: 'bg-amber-100 text-amber-700',
      107: 'bg-purple-100 text-purple-700',
      33: 'bg-emerald-100 text-emerald-700',
      25: 'bg-slate-100 text-slate-700'
    };
    return colorMap[stageId] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading EMD deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Error Loading Data</h3>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Filters */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Time Period Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTimePeriod('this-month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timePeriod === 'this-month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimePeriod('last-month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timePeriod === 'last-month'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setTimePeriod('ytd')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timePeriod === 'ytd'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Year-to-Date
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTimePeriod('prior-year')}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${
                  timePeriod === 'prior-year'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Prior Year
              </button>
              {timePeriod === 'prior-year' && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-2 py-1.5 text-sm font-medium bg-emerald-500 text-white rounded-r-lg border-0 focus:ring-2 focus:ring-emerald-300"
                >
                  {availableYears.filter(y => y < new Date().getFullYear()).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}
            </div>
            <button
              onClick={() => setTimePeriod('all-time')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timePeriod === 'all-time'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All-Time
            </button>
          </div>

          {/* Expand/Collapse buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium opacity-90">Total EMD</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalEMD)}</div>
          <div className="text-xs opacity-75 mt-1">{getPeriodLabel()}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium opacity-90">Total Deals</span>
          </div>
          <div className="text-2xl font-bold">{totalDeals}</div>
          <div className="text-xs opacity-75 mt-1">With EMD Data</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm font-medium opacity-90">Average EMD</span>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(avgEMD)}</div>
          <div className="text-xs opacity-75 mt-1">Per Deal</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium opacity-90">Months</span>
          </div>
          <div className="text-2xl font-bold">{monthGroups.length}</div>
          <div className="text-xs opacity-75 mt-1">With EMDs</div>
        </div>
      </div>

      {/* Month-by-Month Breakdown */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {monthGroups.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No EMDs Found</h3>
              <p className="text-slate-500 text-sm">No EMD records for the selected time period.</p>
            </div>
          </div>
        ) : (
          monthGroups.map((group) => {
            const isExpanded = expandedMonths.has(group.monthKey);

            return (
              <div
                key={group.monthKey}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Month Header - Clickable */}
                <button
                  onClick={() => toggleMonth(group.monthKey)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Expand/Collapse Icon */}
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* Month Label */}
                    <div className="text-left">
                      <div className="text-lg font-semibold text-slate-800">{group.monthLabel}</div>
                      <div className="text-sm text-slate-500">{group.deals.length} deal{group.deals.length !== 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  {/* Total EMD for Month */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-600">{formatCurrency(group.totalEMD)}</div>
                    <div className="text-xs text-slate-500">Total EMD</div>
                  </div>
                </button>

                {/* Deals List - Collapsible */}
                {isExpanded && (
                  <div className="border-t border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Deal / APN</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stage</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">EMD Amount</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Deposit</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Effective Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title Company</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.deals.map((deal) => {
                            const emdAmount = parseEMDAmount(deal.emdData?.customTCABEMDAmount);
                            const depositAmount = parseEMDAmount(deal.emdData?.customACQDepositAmount);
                            
                            return (
                              <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="font-medium text-slate-800 text-sm">{deal.name}</div>
                                  <div className="text-xs text-slate-500 font-mono">{deal.emdData?.customAPN || deal.customAPN || '--'}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm text-slate-600">
                                    {deal.emdData?.customCounty && deal.emdData?.customState 
                                      ? `${deal.emdData.customCounty}, ${deal.emdData.customState}`
                                      : deal.customCountyState || '--'}
                                  </div>
                                  {deal.emdData?.customAcreage && (
                                    <div className="text-xs text-slate-400">{deal.emdData.customAcreage} acres</div>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(deal.stageId)}`}>
                                    {getStageName(deal.stageId)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {emdAmount > 0 ? (
                                    <span className="font-semibold text-emerald-600">{formatCurrency(emdAmount)}</span>
                                  ) : (
                                    <span className="text-slate-400">--</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  {depositAmount > 0 ? (
                                    <span className="font-medium text-blue-600">{formatCurrency(depositAmount)}</span>
                                  ) : (
                                    <span className="text-slate-400">--</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="text-sm text-slate-600">
                                    {deal.emdData?.customTCABEffectiveDate 
                                      ? formatDate(deal.emdData.customTCABEffectiveDate) 
                                      : '--'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-sm text-slate-600">
                                    {deal.emdData?.customTCTitleCompany || '--'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-slate-50">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-slate-700">
                              Month Total
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-bold text-emerald-600">{formatCurrency(group.totalEMD)}</span>
                            </td>
                            <td colSpan={3} className="px-4 py-3"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EMDDashboard;
