import React from 'react';
import { MapPin } from 'lucide-react';

interface StateTabsProps {
  states: string[];
  selectedState: string;
  onStateChange: (state: string) => void;
}

export const StateTabs: React.FC<StateTabsProps> = ({
  states,
  selectedState,
  onStateChange,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[#d5f5e3] rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-[#27AE60]" />
        </div>
        <h3 className="font-semibold text-gray-800">Browse by State</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {states.map((state) => (
          <button
            key={state}
            onClick={() => onStateChange(state)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              selectedState === state
                ? 'bg-[#27AE60] text-white shadow-lg shadow-[#27AE60]/30'
                : 'bg-white text-gray-600 hover:bg-[#e8f8ef] hover:text-[#27AE60] border border-gray-200 hover:border-[#82e0aa]'
            }`}
          >
            {state === 'all' ? 'All States' : state}
          </button>
        ))}
      </div>
    </div>
  );
};
