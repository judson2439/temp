import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  FollowDeal, 
  FollowStage,
  DynamicStageColumn,
  getStageColor,
  getFollowDealsForStage,
  formatCurrency,
  formatDate,
} from './dealTypes';
import EMDDashboard from './EMDDashboard';
import ClosingSchedule from './ClosingSchedule';


// Helper function to get two-letter initials from a name

const getInitials = (name: string | null | undefined): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    // Single word - take first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }
  // Multiple words - take first letter of first and last word
  const firstInitial = parts[0].charAt(0);
  const lastInitial = parts[parts.length - 1].charAt(0);
  return (firstInitial + lastInitial).toUpperCase();
};

// Avatar component with tooltip popup
interface AvatarWithTooltipProps {
  name: string | null | undefined;
  email?: string | null | undefined;
  picture?: any;
  bgColor: string;
  textColor: string;
}

const AvatarWithTooltip: React.FC<AvatarWithTooltipProps> = ({ 
  name, 
  email, 
  picture, 
  bgColor, 
  textColor 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const displayName = name || email || 'Unknown';
  const initials = getInitials(name || email);
  const pictureUrl = picture?.['26x26'] || picture;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`w-7 h-7 rounded-full ${bgColor} flex items-center justify-center text-xs font-medium ${textColor} border-2 border-white shadow-sm cursor-pointer`}
      >
        {pictureUrl ? (
          <img 
            src={pictureUrl} 
            alt={displayName} 
            className="w-full h-full rounded-full object-cover" 
          />
        ) : (
          <span className="font-semibold text-[10px]">
            {initials}
          </span>
        )}
      </div>
      
      {/* Tooltip Popup */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {displayName}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Warning type for deal warnings
interface DealWarning {
  dealId: number;
  warnings: string[];
  effectiveDate: string | null;
  daysSinceEffective: number | null;
  customTCListingAgent: string | null;
  customAgentSListingLink: string | null;
  lastCommunicationDate: string | null;
}

interface FollowDealCardProps {
  deal: FollowDeal;
  onDragStart: (e: React.DragEvent, dealId: number) => void;
  onClick: () => void;
  isSelected: boolean;
  warnings?: string[];
}

const FollowDealCard: React.FC<FollowDealCardProps> = ({ deal, onDragStart, onClick, isSelected, warnings = [] }) => {
  // Determine card badge based on status and dates
  const getCardBadge = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deal.projectedCloseDate) {
      const closingDate = new Date(deal.projectedCloseDate);
      const diffDays = Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0 && deal.status !== 'Closed') {
        return { text: 'Overdue', bg: 'bg-red-500', textColor: 'text-white' };
      }
      if (diffDays <= 3 && diffDays > 0) {
        return { text: `Closing ${closingDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}`, bg: 'bg-sky-500', textColor: 'text-white' };
      }
      if (diffDays <= 7 && diffDays > 3) {
        return { text: 'Closing Soon', bg: 'bg-amber-500', textColor: 'text-white' };
      }
    }
    
    if (deal.customExtensionUsed) {
      return { text: deal.customExtensionUsed, bg: 'bg-purple-500', textColor: 'text-white' };
    }
    
    return null;
  };
  
  const badge = getCardBadge();

  // Parse county and state from customCountyState
  const parseCountyState = (countyState: string | null) => {
    if (!countyState) return { county: '--', state: '--' };
    const parts = countyState.split(',').map(s => s.trim());
    return {
      county: parts[0] || '--',
      state: parts[1] || '--'
    };
  };

  const { county } = parseCountyState(deal.customCountyState);

  // Get warning icon based on warning type
  const getWarningIcon = (warning: string) => {
    if (warning.includes('Realtor not assigned')) {
      return (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }
    if (warning.includes('Listing not live')) {
      return (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    }
    if (warning.includes('No realtor update')) {
      return (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={onClick}
      className={`bg-white rounded-lg p-3 shadow-sm border-2 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : warnings.length > 0 ? 'border-red-300 bg-red-50/30' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="space-y-2">
        {/* Warning Badges - Display at top if any warnings */}
        {warnings.length > 0 && (
          <div className="space-y-1.5 pb-2 border-b border-red-200">
            {warnings.map((warning, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-medium"
              >
                {getWarningIcon(warning)}
                <span className="leading-tight">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Title - word wrap for long titles */}
        <div className="font-semibold text-slate-800 text-sm break-words leading-tight">
          {deal.name || 'Untitled Deal'}
        </div>

        {/* County */}
        <div className="text-slate-600 text-xs">
          <span className="text-slate-400">County:</span>{' '}
          <span className="font-medium">{county}</span>
        </div>

        {/* Price and Acreage on one line */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-600 font-bold">
            {formatCurrency(deal.price)}
          </span>
          <span className="text-slate-600 font-medium">
            {deal.customAcres ? `${deal.customAcres} Acres` : '--'}
          </span>
        </div>

        {/* Full APN */}
        <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="text-slate-400">APN:</span>{' '}
          <span className="font-medium break-all">{deal.customAPN || '--'}</span>
        </div>

        {/* Projected Close Date */}
        <div className="text-xs text-slate-500">
          <span className="text-slate-400">Close Date:</span>{' '}
          <span className={`font-medium ${deal.projectedCloseDate ? 'text-blue-600' : ''}`}>
            {formatDate(deal.projectedCloseDate)}
          </span>
        </div>

        {/* Commission Value */}
        {deal.commissionValue && deal.commissionValue > 0 && (
          <div className="text-xs text-slate-500">
            <span className="text-slate-400">Commission:</span>{' '}
            <span className="font-medium text-green-600">{formatCurrency(deal.commissionValue)}</span>
          </div>
        )}


        {/* People (left) and Users (right) */}
        {((deal.people && deal.people.length > 0) || (deal.users && deal.users.length > 0)) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {/* People - Left Side */}
            <div className="flex items-center gap-1 flex-wrap">
              {deal.people && deal.people.map((person: any, idx: number) => (
                <AvatarWithTooltip
                  key={`person-${idx}`}
                  name={person.name}
                  email={person.email}
                  picture={person.picture}
                  bgColor="bg-slate-100"
                  textColor="text-slate-700"
                />
              ))}
            </div>

            {/* Separator */}
            {deal.people && deal.people.length > 0 && deal.users && deal.users.length > 0 && (
              <div className="h-5 w-px bg-slate-200 mx-2 flex-shrink-0"></div>
            )}

            {/* Users - Right Side */}
            <div className="flex items-center gap-1 flex-wrap">
              {deal.users && deal.users.map((user: any, idx: number) => (
                <AvatarWithTooltip
                  key={`user-${idx}`}
                  name={user.name}
                  email={user.email}
                  picture={user.picture}
                  bgColor="bg-amber-50"
                  textColor="text-amber-700"
                />
              ))}
            </div>
          </div>
        )}


        {badge && (
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${badge.bg} ${badge.textColor}`}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};




// Export interface for ref methods
export interface DealPipelineBoardRef {
  scrollToStage: (stageId: number) => void;
}

interface DealPipelineBoardProps {
  onDealSelect?: (deal: FollowDeal) => void;
  selectedDealId?: number | null;
  pipelineId?: number;
  onTabChange?: (tab: string) => void;
}

// Tab definitions - Updated Section 2 to EMD
const TABS = [
  { id: 'pipeline', label: 'Pipeline Board' },
  { id: 'emd', label: 'EMD' },
  { id: 'closing-schedule', label: 'Closing Schedule' },
];


// Stage IDs that should display warnings on deal cards
const WARNING_STAGE_IDS = [19, 21, 33, 66, 107];


const DealPipelineBoard = forwardRef<DealPipelineBoardRef, DealPipelineBoardProps>(({ 
  onDealSelect,
  selectedDealId,
  pipelineId = 1, // Default to Dispo pipeline
  onTabChange
}, ref) => {

  const [activeTab, setActiveTab] = useState('pipeline');
  const [stages, setStages] = useState<FollowStage[]>([]);
  const [deals, setDeals] = useState<FollowDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<number | null>(null);
  
  // Deal warnings state - map of dealId to warnings array
  const [dealWarnings, setDealWarnings] = useState<Map<number, string[]>>(new Map());
  const [warningsLoading, setWarningsLoading] = useState(false);

  // Ref for the scrollable pipeline container
  const pipelineScrollRef = useRef<HTMLDivElement>(null);
  // Refs for each stage column
  const stageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Expose scrollToStage method via ref
  useImperativeHandle(ref, () => ({
    scrollToStage: (stageId: number) => {
      // First, switch to pipeline tab if not already active
      if (activeTab !== 'pipeline') {
        setActiveTab('pipeline');
        if (onTabChange) {
          onTabChange('pipeline');
        }
      }
      
      // Use setTimeout to ensure the tab switch has rendered
      setTimeout(() => {
        const stageElement = stageRefs.current.get(stageId);
        const scrollContainer = pipelineScrollRef.current;
        
        if (stageElement && scrollContainer) {
          // Calculate the scroll position to center the stage
          const containerWidth = scrollContainer.clientWidth;
          const stageLeft = stageElement.offsetLeft;
          const stageWidth = stageElement.offsetWidth;
          
          // Calculate scroll position to center the stage
          const scrollPosition = stageLeft - (containerWidth / 2) + (stageWidth / 2);
          
          // Smooth scroll to the position
          scrollContainer.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
          
          // Also scroll the pipeline board into view
          scrollContainer.closest('.bg-white')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  }));

  // Fetch stages and deals from Supabase

  useEffect(() => {
    fetchData();
  }, [pipelineId]);

  // Subscribe to realtime updates on follow_deal table
  useEffect(() => {
    // Create a channel for realtime subscription
    const channel = supabase
      .channel('follow_deal_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'follow_deal',
          filter: `pipelineId=eq.${pipelineId}`
        },
        (payload) => {
          console.log('Realtime UPDATE received:', payload);
          const updatedDeal = payload.new as FollowDeal;
          
          // Update the local deals state with the updated deal
          setDeals(prevDeals => 
            prevDeals.map(deal => 
              deal.id === updatedDeal.id ? updatedDeal : deal
            )
          );
          
          // If the deal moved to or from a warning stage, refresh warnings
          if (WARNING_STAGE_IDS.includes(updatedDeal.stageId)) {
            fetchDealWarnings();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'follow_deal',
          filter: `pipelineId=eq.${pipelineId}`
        },
        (payload) => {
          console.log('Realtime INSERT received:', payload);
          const newDeal = payload.new as FollowDeal;
          
          // Add the new deal to the local state
          setDeals(prevDeals => [...prevDeals, newDeal]);
          
          // If the new deal is in a warning stage, refresh warnings
          if (WARNING_STAGE_IDS.includes(newDeal.stageId)) {
            fetchDealWarnings();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'follow_deal'
        },
        (payload) => {
          console.log('Realtime DELETE received:', payload);
          const deletedDeal = payload.old as FollowDeal;
          
          // Remove the deleted deal from local state
          setDeals(prevDeals => 
            prevDeals.filter(deal => deal.id !== deletedDeal.id)
          );
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Cleanup subscription on unmount or when pipelineId changes
    return () => {
      console.log('Unsubscribing from realtime channel');
      supabase.removeChannel(channel);
    };
  }, [pipelineId]);

  // Fetch deal warnings for warning stage deals
  const fetchDealWarnings = async () => {
    try {
      setWarningsLoading(true);
      
      const { data, error: fnError } = await supabase.functions.invoke('get-deal-warnings', {
        body: { stageIds: WARNING_STAGE_IDS }
      });

      if (fnError) {
        console.error('Error fetching deal warnings:', fnError);
        return;
      }

      if (data && data.warnings) {
        const warningsMap = new Map<number, string[]>();
        data.warnings.forEach((warning: DealWarning) => {
          if (warning.warnings && warning.warnings.length > 0) {
            warningsMap.set(warning.dealId, warning.warnings);
          }
        });
        setDealWarnings(warningsMap);
        console.log('Deal warnings loaded:', warningsMap.size, 'deals with warnings');
      }
    } catch (err) {
      console.error('Error fetching deal warnings:', err);
    } finally {
      setWarningsLoading(false);
    }
  };



  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stages from follow_stages table, ordered by the 'order' field
      const { data: stagesData, error: stagesError } = await supabase
        .from('follow_stages')
        .select('*')
        .order('order', { ascending: true });

      if (stagesError) {
        throw stagesError;
      }

      // Fetch deals from follow_deal table
      const { data: dealsData, error: dealsError } = await supabase
        .from('follow_deal')
        .select('*')
        .eq('pipelineId', pipelineId)
        .order('orderWeight', { ascending: true });

      if (dealsError) {
        throw dealsError;
      }

      setStages(stagesData || []);
      setDeals(dealsData || []);
      
      // Fetch warnings for stageId 19 deals
      fetchDealWarnings();
    } catch (err: any) {
      console.error('Error fetching pipeline data:', err);
      setError(err.message || 'Failed to fetch pipeline data');
    } finally {
      setLoading(false);
    }
  };


  // Create dynamic stage columns with colors - stages are already sorted by 'order' field
  const stageColumns: DynamicStageColumn[] = stages.map((stage, index) => {
    const colors = getStageColor(index);
    return {
      id: stage.id,
      name: stage.name || 'Unknown Stage',
      ...colors
    };
  });

  const handleDragStart = (e: React.DragEvent, dealId: number) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dealId.toString());
  };

  const handleDragOver = (e: React.DragEvent, stageId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStageId(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStageId(null);
  };

  const handleDrop = async (e: React.DragEvent, newStageId: number) => {
    e.preventDefault();
    const dealIdStr = e.dataTransfer.getData('text/plain');
    const dealId = parseInt(dealIdStr, 10);
    
    if (!isNaN(dealId)) {
      // Optimistically update the UI
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === dealId ? { ...deal, stageId: newStageId, enteredStageAt: new Date().toISOString() } : deal
        )
      );

      // Update the stageId in Supabase
      try {
        const { error: updateError } = await supabase
          .from('follow_deal')
          .update({ 
            stageId: newStageId,
            enteredStageAt: new Date().toISOString()
          })
          .eq('id', dealId);

        if (updateError) {
          throw updateError;
        }
        
        // If moved to or from a warning stage, refresh warnings
        if (WARNING_STAGE_IDS.includes(newStageId)) {
          fetchDealWarnings();
        }
      } catch (err: any) {
        console.error('Error updating deal stage:', err);
        // Revert the optimistic update on error
        fetchData();
      }
    }
    
    setDraggedDealId(null);
    setDragOverStageId(null);
  };



  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStageId(null);
  };

  const handleDealClick = (deal: FollowDeal) => {
    if (onDealSelect) {
      onDealSelect(deal);
    }
  };

  // Render Pipeline Board content
  const renderPipelineBoard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 text-sm">Loading pipeline...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
            <svg className="w-10 h-10 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-base font-semibold text-red-800 mb-2">Error Loading Pipeline</h3>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Combined Stage Headers and Columns - Scrollable container */}
        <div ref={pipelineScrollRef} className="flex gap-4 overflow-x-auto flex-1 pb-2">
          {stageColumns.map((stage, index) => {
            const stageDeals = getFollowDealsForStage(deals, stage.id);
            const isDragOver = dragOverStageId === stage.id;
            const isWarningStage = WARNING_STAGE_IDS.includes(stage.id);
            
            // Count warnings for this stage (only for warning stages)
            const warningCount = isWarningStage 
              ? stageDeals.filter(d => dealWarnings.has(d.id)).length 
              : 0;
            
            return (
              <div
                key={stage.id}
                ref={(el) => {
                  if (el) {
                    stageRefs.current.set(stage.id, el);
                  }
                }}
                className="flex flex-col flex-shrink-0"
                style={{ width: '320px' }}
              >

                {/* Stage Header - Arrow Style */}
                <div className="relative mb-2 flex-shrink-0">
                  <div 
                    className={`${stage.bgColor} ${stage.color} py-2.5 px-4 text-center text-sm font-semibold relative`}
                    style={{
                      clipPath: index === 0 
                        ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                        : index === stageColumns.length - 1
                        ? 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)'
                        : 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)',
                    }}
                  >
                    {stage.name}
                    <span className="ml-2 text-xs opacity-75">({stageDeals.length})</span>
                    {/* Warning indicator for warning stages */}
                    {isWarningStage && warningCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                        {warningCount}
                      </span>
                    )}
                  </div>
                </div>
                

                {/* Stage Column / Drop Zone - Scrollable */}
                <div
                  className={`flex-1 rounded-lg p-2 transition-colors duration-200 overflow-y-auto ${
                    isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-slate-50 border-2 border-transparent'
                  }`}
                  style={{ minHeight: '200px' }}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  <div className="space-y-2">
                    {stageDeals.map((deal) => (
                      <FollowDealCard
                        key={deal.id}
                        deal={deal}
                        onDragStart={handleDragStart}
                        onClick={() => handleDealClick(deal)}
                        isSelected={selectedDealId === deal.id}
                        warnings={dealWarnings.get(deal.id) || []}
                      />
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        No deals
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total Deals: <strong className="text-slate-800">{deals.length}</strong></span>
            <span>Total Value: <strong className="text-emerald-600">{formatCurrency(deals.reduce((sum, d) => sum + (d.price || 0), 0))}</strong></span>
            <span>Total Commission: <strong className="text-green-600">{formatCurrency(deals.reduce((sum, d) => sum + (d.commissionValue || 0), 0))}</strong></span>
            {dealWarnings.size > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-600">Warnings: <strong>{dealWarnings.size}</strong></span>
              </span>
            )}
          </div>
        </div>
      </>
    );
  };

  // Render EMD Dashboard
  const renderEMDDashboard = () => {
    return <EMDDashboard />;
  };
  // Handle deal click from Closing Schedule
  const handleClosingScheduleDealClick = async (dealId: number) => {
    // Switch to pipeline tab to show the deal
    setActiveTab('pipeline');
    // Notify parent of tab change so the detail sections are shown
    if (onTabChange) {
      onTabChange('pipeline');
    }
    
    // First try to find the deal in the local deals list
    let deal = deals.find(d => d.id === dealId);
    
    // If not found locally (e.g., deal is in a different pipeline), fetch it from the database
    if (!deal) {
      try {
        const { data, error } = await supabase
          .from('follow_deal')
          .select('*')
          .eq('id', dealId)
          .single();
        
        if (!error && data) {
          deal = data as FollowDeal;
        }
      } catch (err) {
        console.error('Error fetching deal:', err);
      }
    }
    
    if (deal && onDealSelect) {
      onDealSelect(deal);
    }
  };

  // Render Closing Schedule
  const renderClosingSchedule = () => {
    return <ClosingSchedule onDealClick={handleClosingScheduleDealClick} />;
  };






  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col"
      style={{ height: 'calc(100vh - 72px)', maxHeight: 'calc(100vh - 72px)' }}
    >

      {/* Tab Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Notify parent of tab change
                if (onTabChange) {
                  onTabChange(tab.id);
                }
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        
        {/* Refresh button - only show for Pipeline tab */}
        {activeTab === 'pipeline' && (
          <div className="flex items-center gap-2">
            {warningsLoading && (
              <span className="text-xs text-slate-400">Checking warnings...</span>
            )}
            <button
              onClick={fetchData}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'pipeline' && renderPipelineBoard()}
        {activeTab === 'emd' && renderEMDDashboard()}
        {activeTab === 'closing-schedule' && renderClosingSchedule()}
      </div>

    </div>
  );
});

export default DealPipelineBoard;
