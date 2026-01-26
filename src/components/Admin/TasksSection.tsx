import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { FollowDeal, FollowStage, formatCurrency, formatDate as formatDateUtil } from './dealTypes';

interface Task {
  id: number;
  created: string;
  updated: string;
  completed: string | null;
  createdById: number;
  updatedById: number;
  createdBy: string;
  updatedBy: string;
  personId: number;
  AssignedTo: string;
  assignedUserId: number;
  name: string;
  type: string;
  isCompleted: number;
  dueDate: string | null;
  externalTaskLink: string | null;
  externalCalendarId: string | null;
  remindSecondsBefore: number | null;
  dueDateTime: string | null;
}

interface DealWarning {
  dealId: number;
  warnings: string[];
}

interface TasksSectionProps {
  dealId: number | null;
  deal?: FollowDeal | null;
  stages?: FollowStage[];
}

// Task type badge colors
const getTaskTypeBadgeStyle = (type: string): string => {
  const typeMap: Record<string, string> = {
    'Follow Up': 'bg-blue-100 text-blue-700',
    'Call': 'bg-green-100 text-green-700',
    'Email': 'bg-purple-100 text-purple-700',
    'Meeting': 'bg-amber-100 text-amber-700',
    'Task': 'bg-slate-100 text-slate-700',
    'Reminder': 'bg-pink-100 text-pink-700',
    'Other': 'bg-gray-100 text-gray-700',
  };
  return typeMap[type] || 'bg-gray-100 text-gray-700';
};

// Format date for display
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format relative time
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Helper function to get two-letter initials from a name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const firstInitial = parts[0].charAt(0);
  const lastInitial = parts[parts.length - 1].charAt(0);
  return (firstInitial + lastInitial).toUpperCase();
};

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

// Deal Info Card Component
interface DealInfoCardProps {
  deal: FollowDeal;
  warnings: string[];
  stages: FollowStage[];
}

const DealInfoCard: React.FC<DealInfoCardProps> = ({ deal, warnings, stages }) => {
  // Parse county and state from customCountyState
  const parseCountyState = (countyState: string | null) => {
    if (!countyState) return { county: '--', state: '--' };
    const parts = countyState.split(',').map(s => s.trim());
    return {
      county: parts[0] || '--',
      state: parts[1] || '--'
    };
  };

  const { county, state } = parseCountyState(deal.customCountyState);
  
  // Get first person's name for display
  const firstPerson = deal.people && deal.people.length > 0 ? deal.people[0] : null;
  const personName = firstPerson?.name || firstPerson?.firstName || null;
  const personInitials = getInitials(personName);

  // Build display title
  const displayTitle = personName 
    ? `${personName} - ${deal.name || 'Untitled Deal'}`
    : deal.name || 'Untitled Deal';

  return (
    <div className="mb-4">
      {/* Warning Badges */}
      {warnings.length > 0 && (
        <div className="space-y-2 mb-3">
          {warnings.map((warning, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200"
            >
              {getWarningIcon(warning)}
              <span>PAST DUE: {warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Deal Card */}
      <div className={`bg-white rounded-lg p-4 border-2 ${warnings.length > 0 ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
        {/* Title with icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 text-base break-words leading-tight">
              {displayTitle}
            </div>
            <div className="text-slate-500 text-sm mt-0.5">
              County: {county}
            </div>
          </div>
        </div>

        {/* Price and Acreage */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-emerald-600 font-bold text-lg">
            {formatCurrency(deal.price)}
          </span>
          <span className="text-slate-600 font-medium">
            {deal.customAcres ? `${deal.customAcres} Acres` : '--'}
          </span>
        </div>

        {/* APN */}
        <div className="text-sm text-slate-500 mb-2">
          <span className="text-slate-400">APN:</span>{' '}
          <span className="font-medium break-all">{deal.customAPN || '--'}</span>
        </div>

        {/* Close Date and Avatar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            <span className="text-slate-400">Close Date:</span>{' '}
            <span className={`font-medium ${deal.projectedCloseDate ? 'text-blue-600' : ''}`}>
              {formatDateUtil(deal.projectedCloseDate)}
            </span>
          </div>
          
          {/* Person Avatar */}
          {personName && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 border-2 border-white shadow-sm">
              {personInitials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Task item component
interface TaskItemProps {
  task: Task;
  personName?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, personName }) => {
  const isCompleted = task.isCompleted === 1;
  
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
      isCompleted 
        ? 'bg-slate-50 border-slate-200' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      {/* Checkbox */}
      <div className="flex-shrink-0 pt-0.5">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          isCompleted 
            ? 'bg-emerald-500 border-emerald-500' 
            : 'bg-white border-slate-300'
        }`}>
          {isCompleted && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        {/* Task Name */}
        <div className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
          {task.name || 'Untitled Task'}
        </div>

        {/* Task Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {/* Task Type Badge */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTaskTypeBadgeStyle(task.type)}`}>
            {task.type || 'Task'}
          </span>

          {/* Assigned To */}
          {task.AssignedTo && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {task.AssignedTo}
            </span>
          )}

          {/* Person Name */}
          {personName && (
            <span className="text-xs text-purple-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {personName}
            </span>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Created Info */}
        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
          <span>Created {formatRelativeTime(task.created)}</span>
          {task.createdBy && (
            <>
              <span>•</span>
              <span>by {task.createdBy}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TasksSection: React.FC<TasksSectionProps> = ({ dealId, deal, stages = [] }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [warningsLoading, setWarningsLoading] = useState(false);

  // Create a map of personId to person name
  const personNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (deal?.people) {
      deal.people.forEach((person: any) => {
        if (person.id) {
          map[person.id] = person.name || person.firstName || 'Unknown';
        }
      });
    }
    return map;
  }, [deal?.people]);

  // Stage IDs that should skip warning calculations
  const SKIP_WARNING_STAGE_IDS = [25, 106, 105];

  // Fetch warnings for the deal
  const fetchWarnings = async () => {
    if (!dealId) {
      setWarnings([]);
      return;
    }

    // Skip warning calculations for specific stage IDs
    if (deal?.stageId && SKIP_WARNING_STAGE_IDS.includes(deal.stageId)) {
      setWarnings([]);
      return;
    }

    setWarningsLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-deal-warnings', {
        body: { stageId: deal?.stageId }
      });

      if (fnError) {
        console.error('Error fetching warnings:', fnError);
        return;
      }

      if (data && data.warnings) {
        const dealWarning = data.warnings.find((w: DealWarning) => w.dealId === dealId);
        setWarnings(dealWarning?.warnings || []);
      }
    } catch (err) {
      console.error('Error fetching warnings:', err);
    } finally {
      setWarningsLoading(false);
    }
  };


  // Fetch tasks when deal changes
  useEffect(() => {
    if (deal?.people && deal.people.length > 0) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [deal?.id, deal?.people]);

  // Fetch warnings when deal changes
  useEffect(() => {
    if (dealId && deal) {
      fetchWarnings();
    } else {
      setWarnings([]);
    }
  }, [dealId, deal?.stageId]);

  const fetchTasks = async () => {
    if (!deal?.people || deal.people.length === 0) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract person IDs from the deal
      const personIds = deal.people
        .map((person: any) => person.id)
        .filter((id: any) => id != null);

      if (personIds.length === 0) {
        setTasks([]);
        setLoading(false);
        return;
      }

      // Call the edge function
      const { data, error: fnError } = await supabase.functions.invoke('get-person-tasks', {
        body: { personIds }
      });

      if (fnError) {
        throw fnError;
      }

      if (data && data.success) {
        setTasks(data.tasks || []);
      } else {
        throw new Error(data?.error || 'Failed to fetch tasks');
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Count completed and pending tasks
  const completedCount = tasks.filter(t => t.isCompleted === 1).length;
  const pendingCount = tasks.filter(t => t.isCompleted !== 1).length;

  if (!dealId) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Updates
        </h2>
        <div className="text-center py-8 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>Select a deal to view updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Updates
        </h2>

        {/* Task counts */}
        {!loading && tasks.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              {pendingCount} pending
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              {completedCount} completed
            </span>
          </div>
        )}
      </div>

      {/* Deal Info Card with Warnings */}
      {deal && (
        <DealInfoCard 
          deal={deal} 
          warnings={warnings} 
          stages={stages}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 text-sm">Loading tasks...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-sm mb-2">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No People Message */}
      {!loading && !error && (!deal?.people || deal.people.length === 0) && (
        <div className="text-center py-8 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>No people associated with this deal</p>
        </div>
      )}

      {/* Empty Tasks Message */}
      {!loading && !error && deal?.people && deal.people.length > 0 && tasks.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>No tasks found for this deal</p>
        </div>
      )}

      {/* Tasks List */}
      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Tasks</h3>
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              personName={personNameMap[task.personId]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksSection;
