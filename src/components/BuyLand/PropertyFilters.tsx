import React from 'react';
import { Search, MapPin, DollarSign, Maximize } from 'lucide-react';

export interface PropertyFiltersType {
  search: string;
  state: string;
  county: string;
  minAcres: string;
  maxAcres: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (filters: PropertyFiltersType) => void;
  states: string[];
  counties: string[];
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  states,
  counties,
}) => {
  const updateFilter = (key: keyof PropertyFiltersType, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
        <div className="w-8 h-8 bg-[#d5f5e3] rounded-lg flex items-center justify-center">
          <Search className="w-4 h-4 text-[#27AE60]" />
        </div>
        Filter Properties
      </h3>
      
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search location or keywords..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filters.state}
            onChange={(e) => updateFilter('state', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all appearance-none bg-white cursor-pointer"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All States' : s}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filters.county}
            onChange={(e) => updateFilter('county', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all appearance-none bg-white cursor-pointer"
          >
            {counties.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Counties' : c}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div className="relative">
          <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            placeholder="Min Acres"
            value={filters.minAcres}
            onChange={(e) => updateFilter('minAcres', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
          />
        </div>
        
        <div className="relative">
          <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            placeholder="Max Acres"
            value={filters.maxAcres}
            onChange={(e) => updateFilter('maxAcres', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
          />
        </div>
        
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
          />
        </div>
        
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export const defaultFilters: PropertyFiltersType = {
  search: '',
  state: 'all',
  county: 'all',
  minAcres: '',
  maxAcres: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
};
