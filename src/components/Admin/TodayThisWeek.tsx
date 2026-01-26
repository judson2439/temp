import React from 'react';
import { 
  Deal, 
  isOverdue,
  isDueToday,
  isDueTomorrow,
  isDueThisWeek,
  formatDate,
} from './dealTypes';

interface TodayThisWeekProps {
  deals: Deal[];
  onDealSelect: (deal: Deal) => void;
}

const TodayThisWeek: React.FC<TodayThisWeekProps> = ({ deals, onDealSelect }) => {
  // Get follow-ups due (today, tomorrow, or overdue)
  const followUpsDue = deals.filter(deal => {
    if (!deal.nextFollowUp) return false;
    return isOverdue(deal.nextFollowUp) || isDueToday(deal.nextFollowUp) || isDueTomorrow(deal.nextFollowUp);
  });

  // Get upcoming closings (this week)
  const upcomingClosings = deals.filter(deal => {
    if (!deal.closingDate || deal.stage === 'sold') return false;
    return isDueThisWeek(deal.closingDate);
  });

  // Get at-risk deals (overdue follow-ups, overdue closings, no contact in 7+ days)
  const atRiskDeals = deals.filter(deal => {
    if (deal.stage === 'sold') return false;
    
    // Overdue follow-up
    if (deal.nextFollowUp && isOverdue(deal.nextFollowUp)) return true;
    
    // Overdue closing
    if (deal.closingDate && isOverdue(deal.closingDate)) return true;
    
    // No contact in 7+ days for active deals
    if (deal.lastContactDate && deal.stage !== 'lead') {
      const lastContact = new Date(deal.lastContactDate);
      const today = new Date();
      const diffDays = Math.ceil((today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) return true;
    }
    
    return false;
  });

  const getFollowUpIcon = () => {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Today / This Week</h2>
      
      {/* Follow-Ups Due */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Follow-Ups Due
        </h3>
        <div className="space-y-2">
          {followUpsDue.length > 0 ? (
            followUpsDue.map(deal => (
              <div 
                key={deal.id}
                onClick={() => onDealSelect(deal)}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {getFollowUpIcon()}
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-700 font-medium">
                    {deal.title}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {deal.county}, {deal.state} - Due: {formatDate(deal.nextFollowUp)}
                  </span>
                </div>
                {isOverdue(deal.nextFollowUp) && (
                  <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">Overdue</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 py-2 px-3 bg-slate-50 rounded-lg">
              No follow-ups due
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Closings */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Upcoming Closings
        </h3>
        <div className="space-y-2">
          {upcomingClosings.length > 0 ? (
            upcomingClosings.map(deal => (
              <div 
                key={deal.id}
                onClick={() => onDealSelect(deal)}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-700 font-medium">
                    {deal.title}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {deal.county}, {deal.state} - Closing: {formatDate(deal.closingDate)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-400 py-2 px-3 bg-slate-50 rounded-lg">
              No upcoming closings this week
            </div>
          )}
        </div>
      </div>

      {/* At Risk Deals */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          At Risk Deals
        </h3>
        <div className="space-y-2">
          {atRiskDeals.length > 0 ? (
            atRiskDeals.map(deal => {
              let riskReason = '';
              if (deal.nextFollowUp && isOverdue(deal.nextFollowUp)) {
                riskReason = 'Follow-Up Overdue';
              } else if (deal.closingDate && isOverdue(deal.closingDate)) {
                riskReason = 'Closing Overdue';
              } else {
                riskReason = 'No Recent Contact';
              }
              
              return (
                <div 
                  key={deal.id}
                  onClick={() => onDealSelect(deal)}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer border border-red-100"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-slate-700 font-medium">
                      {deal.title}
                    </span>
                    <span className="text-xs text-red-600 block">
                      {riskReason}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-slate-400 py-2 px-3 bg-slate-50 rounded-lg">
              No at-risk deals
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayThisWeek;
