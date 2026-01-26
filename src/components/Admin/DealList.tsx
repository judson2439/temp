import React, { useState } from 'react';
import { 
  Deal, 
  DealStage,
  getStageBadgeStyle,
  formatStageName,
  formatDate,
  isOverdue,
  isDueTomorrow,
  isDueToday,
} from './dealTypes';

interface DealListProps {
  deals: Deal[];
  onDealSelect: (deal: Deal) => void;
  selectedDealId: string | null;
}

const DealList: React.FC<DealListProps> = ({ deals, onDealSelect, selectedDealId }) => {
  const [stageFilter, setStageFilter] = useState<DealStage | 'all'>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'closingDate' | 'followUp' | 'state'>('closingDate');

  // Get unique states from deals
  const uniqueStates = [...new Set(deals.map(d => d.state))].sort();

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    if (stageFilter !== 'all' && deal.stage !== stageFilter) return false;
    if (stateFilter !== 'all' && deal.state !== stateFilter) return false;
    return true;
  });

  // Sort deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'closingDate':
        if (!a.closingDate && !b.closingDate) return 0;
        if (!a.closingDate) return 1;
        if (!b.closingDate) return -1;
        return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
      case 'followUp':
        if (!a.nextFollowUp && !b.nextFollowUp) return 0;
        if (!a.nextFollowUp) return 1;
        if (!b.nextFollowUp) return -1;
        return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
      case 'state':
        return a.state.localeCompare(b.state);
      default:
        return 0;
    }
  });

  const getFollowUpDisplay = (deal: Deal) => {
    if (!deal.nextFollowUp) return { text: '--', className: 'text-slate-400' };
    
    if (isOverdue(deal.nextFollowUp)) {
      return { text: 'Overdue', className: 'text-red-600 font-semibold' };
    }
    if (isDueToday(deal.nextFollowUp)) {
      return { text: 'Today', className: 'text-amber-600 font-semibold' };
    }
    if (isDueTomorrow(deal.nextFollowUp)) {
      return { text: 'Tomorrow', className: 'text-blue-600 font-semibold' };
    }
    return { text: formatDate(deal.nextFollowUp), className: 'text-slate-600' };
  };

  const getClosingDateDisplay = (deal: Deal) => {
    if (!deal.closingDate) return { text: '--', className: 'text-slate-400' };
    
    const closingDate = new Date(deal.closingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 && deal.stage !== 'sold') {
      return { text: 'Overdue', className: 'text-red-600 font-semibold' };
    }
    
    // Show green checkmark for "Under Stove" type indicator
    if (deal.stage === 'lead' && deal.nextFollowUp) {
      const followUpDate = new Date(deal.nextFollowUp);
      if (followUpDate > today) {
        return { 
          text: formatDate(deal.closingDate), 
          className: 'text-slate-600',
          hasIndicator: true,
          indicatorType: 'scheduled'
        };
      }
    }
    
    return { text: formatDate(deal.closingDate), className: 'text-slate-600' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-800">Deal List</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as DealStage | 'all')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stages</option>
            <option value="lead">Lead</option>
            <option value="under_contract">Under Contract</option>
            <option value="due_diligence">Due Diligence</option>
            <option value="closing">Closing</option>
            <option value="listed">Listed</option>
            <option value="sold">Sold</option>
          </select>
          
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'closingDate' | 'followUp' | 'state')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="closingDate">Sort by Closing</option>
            <option value="followUp">Sort by Follow-Up</option>
            <option value="state">Sort by State</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">APN</th>
              <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">State</th>
              <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">County</th>
              <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">Stage</th>
              <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">Closing Date</th>
              <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">Follow-Up</th>
            </tr>
          </thead>
          <tbody>
            {sortedDeals.map((deal) => {
              const stageBadge = getStageBadgeStyle(deal.stage);
              const followUp = getFollowUpDisplay(deal);
              const closingDate = getClosingDateDisplay(deal);
              
              return (
                <tr
                  key={deal.id}
                  onClick={() => onDealSelect(deal)}
                  className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedDealId === deal.id 
                      ? 'bg-blue-50' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-3 text-sm font-medium text-slate-800">{deal.apn}</td>
                  <td className="py-3 px-3 text-sm text-slate-600">{deal.state}</td>
                  <td className="py-3 px-3 text-sm text-slate-600">{deal.county}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${stageBadge.bg} ${stageBadge.text} ${stageBadge.border}`}>
                      {formatStageName(deal.stage)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {'hasIndicator' in closingDate && closingDate.hasIndicator && (
                        <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className={`text-sm ${closingDate.className}`}>{closingDate.text}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-sm ${followUp.className}`}>{followUp.text}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {sortedDeals.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No deals match the current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default DealList;
