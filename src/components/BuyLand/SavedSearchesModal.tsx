import React, { useState, useEffect } from 'react';
import { PropertyFiltersType } from './PropertyFilters';
import { X, Bookmark, Save, Trash2, ArrowRight, Search, FolderOpen } from 'lucide-react';

interface SavedSearch {
  id: string;
  name: string;
  filters: PropertyFiltersType;
  createdAt: string;
}

interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: PropertyFiltersType;
  onLoadSearch: (filters: PropertyFiltersType) => void;
}

export const SavedSearchesModal: React.FC<SavedSearchesModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onLoadSearch,
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchName, setSearchName] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('savedSearches');
      if (stored) setSavedSearches(JSON.parse(stored));
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!searchName.trim()) return;
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: currentFilters,
      createdAt: new Date().toLocaleDateString(),
    };
    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    try {
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    } catch (e) {}
    setSearchName('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    try {
      localStorage.setItem('savedSearches', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleLoad = (filters: PropertyFiltersType) => {
    onLoadSearch(filters);
    onClose();
  };

  const getFilterSummary = (filters: PropertyFiltersType) => {
    const parts = [];
    if (filters.state !== 'all') parts.push(filters.state);
    if (filters.county !== 'all') parts.push(filters.county);
    if (filters.minAcres || filters.maxAcres) {
      parts.push(`${filters.minAcres || '0'}-${filters.maxAcres || '∞'} acres`);
    }
    if (filters.minPrice || filters.maxPrice) {
      parts.push(`$${filters.minPrice || '0'}-$${filters.maxPrice || '∞'}`);
    }
    return parts.length > 0 ? parts.join(' • ') : 'All properties';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E8449] to-[#27AE60] p-6 text-white relative overflow-hidden flex-shrink-0">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bookmark className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Saved Searches</h2>
                  <p className="text-[#d5f5e3] text-sm">Manage your search preferences</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Save Current Search */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Save className="w-4 h-4 text-[#27AE60]" />
              Save Current Search
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter a name for this search..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={!searchName.trim()}
                className="px-5 py-3 bg-[#27AE60] hover:bg-[#1E8449] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#27AE60]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
            {showSaveSuccess && (
              <p className="text-[#27AE60] text-sm mt-2 animate-fade-in">
                Search saved successfully!
              </p>
            )}
          </div>

          {/* Saved Searches List */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#27AE60]" />
              Your Saved Searches
            </h3>
            
            {savedSearches.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No saved searches yet</p>
                <p className="text-gray-400 text-sm">Save your current filters to quickly access them later</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {savedSearches.map((search, index) => (
                  <li
                    key={search.id}
                    className="group bg-gray-50 hover:bg-[#e8f8ef] rounded-xl p-4 border border-gray-100 hover:border-[#82e0aa] transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 group-hover:text-[#27AE60] transition-colors">
                          {search.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {getFilterSummary(search.filters)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Saved on {search.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleLoad(search.filters)}
                          className="px-4 py-2 bg-[#27AE60] text-white text-sm font-medium rounded-lg hover:bg-[#1E8449] transition-colors flex items-center gap-1.5"
                        >
                          Load
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(search.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete search"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
