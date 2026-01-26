import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  PropertyCard,
  PropertyFilters,
  PropertyFiltersType,
  defaultFilters,
  StateTabs,
  RequestInfoModal,
  AccountModal,
  SavedSearchesModal,
} from '@/components/BuyLand';
import { useProperties, getPropertyStates, getPropertyCounties } from '@/hooks/useProperties';
import { Search, MapPin, Filter, Grid3X3, List, Heart, Bookmark, ChevronDown, SlidersHorizontal, X, TrendingUp, Shield, Clock, Award, Loader2 } from 'lucide-react';

export default function BuyLand() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PropertyFiltersType>(defaultFilters);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [requestInfoModal, setRequestInfoModal] = useState<{
    open: boolean;
    propertyId?: string;
    propertyTitle?: string;
  }>({ open: false });
  const [accountModal, setAccountModal] = useState(false);
  const [savedSearchesModal, setSavedSearchesModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [states, setStates] = useState<string[]>(['all']);
  const [counties, setCounties] = useState<string[]>(['all']);

  // Fetch properties from database
  const { properties, loading, error, refetch } = useProperties({
    state: filters.state !== 'all' ? filters.state : undefined,
    county: filters.county !== 'all' ? filters.county : undefined,
    minAcres: filters.minAcres ? parseFloat(filters.minAcres) : undefined,
    maxAcres: filters.maxAcres ? parseFloat(filters.maxAcres) : undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    search: filters.search || quickSearch || undefined,
  });


  useEffect(() => {
    document.title = 'Buy Land | Summit Land USA';
  }, []);

  // Fetch states and counties on mount
  useEffect(() => {
    const fetchFiltersData = async () => {
      const statesData = await getPropertyStates();
      setStates(['all', ...statesData]);
    };
    fetchFiltersData();
  }, []);

  // Fetch counties when state changes
  useEffect(() => {
    const fetchCounties = async () => {
      const countiesData = await getPropertyCounties(filters.state);
      setCounties(['all', ...countiesData]);
    };
    fetchCounties();
  }, [filters.state]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) setUserEmail(storedEmail);
    } catch (e) {}
  }, []);

  // Sort properties
  const sortedProperties = useMemo(() => {
    let result = [...properties];

    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (filters.sort === 'acres-asc') result.sort((a, b) => a.acres - b.acres);
    else if (filters.sort === 'acres-desc') result.sort((a, b) => b.acres - a.acres);

    return result;
  }, [properties, filters.sort]);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    try {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) {}
  };

  const handleViewDetails = (id: string) => {
    navigate(`/property/${id}`);
  };

  const handleRequestInfo = (id: string, title: string) => {
    setRequestInfoModal({ open: true, propertyId: id, propertyTitle: title });
  };

  const handleStateChange = (state: string) => {
    setFilters({ ...filters, state, county: 'all' });
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
    setQuickSearch('');
  };

  const activeFiltersCount = [
    filters.state !== 'all',
    filters.county !== 'all',
    filters.minAcres,
    filters.maxAcres,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
    quickSearch
  ].filter(Boolean).length;

  // Stats for hero section
  const stats = [
    { label: 'Properties Listed', value: properties.length.toString() + '+' },
    { label: 'States Covered', value: states.length - 1 },
    { label: 'Happy Buyers', value: '2,500+' },
    { label: 'Acres Sold', value: '50K+' }
  ];

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Hero Section with Image - Updated to #27AE60 green theme */}
      <div className="relative pt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766470404105_e111dbc2.jpg" 
            alt="Beautiful land landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a5c38]/90 via-[#27AE60]/80 to-[#1a5c38]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a5c38]/50 to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#27AE60]/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#2ecc71]/10 rounded-full blur-2xl animate-bounce-slow" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-green-100 text-sm mb-6 border border-white/20">
              <MapPin className="w-4 h-4" />
              <span>Explore Land Across America</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#a8e6cf] to-white">
                Piece of Land
              </span>
            </h1>
            
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-10">
              Discover affordable land opportunities across the United States. 
              From rural retreats to investment properties, your dream land awaits.
            </p>

            {/* Quick Search Bar */}
            <div className="max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-[#1a5c38]/20 p-2">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, state, or property name..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="w-full py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-lg"
                  />
                  {quickSearch && (
                    <button 
                      onClick={() => setQuickSearch('')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden md:flex items-center gap-2 px-5 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border-l border-gray-200"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-[#27AE60] text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white font-semibold rounded-xl hover:from-[#219a52] hover:to-[#27AE60] transition-all shadow-lg shadow-[#27AE60]/30">
                  Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-green-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#paint0_linear_green)"/>
            <defs>
              <linearGradient id="paint0_linear_green" x1="720" y1="60" x2="720" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f0fdf4"/>
                <stop offset="1" stopColor="#f0fdf4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-in">
          {/* Left Side - State Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {states.slice(0, 6).map((state) => (
              <button
                key={state}
                onClick={() => handleStateChange(state)}
                className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filters.state === state
                    ? 'bg-[#27AE60] text-white shadow-lg shadow-[#27AE60]/30'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-[#27AE60] border border-gray-200'
                }`}
              >
                {state === 'all' ? 'All States' : state}
              </button>
            ))}
            {states.length > 6 && (
              <button className="px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-green-50 hover:text-[#27AE60] transition-all flex items-center gap-2">
                More <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-3">
            {!userEmail ? (
              <button
                onClick={() => setAccountModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white font-medium rounded-xl hover:from-[#219a52] hover:to-[#27AE60] transition-all shadow-lg shadow-[#27AE60]/20 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Create Account
              </button>
            ) : (
              <span className="px-4 py-2.5 bg-green-100 text-[#27AE60] rounded-xl text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-pulse" />
                {userEmail}
              </span>
            )}
            <button
              onClick={() => setSavedSearchesModal(true)}
              className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-green-50 hover:text-[#27AE60] hover:border-[#27AE60]/30 transition-all flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              Saved Searches
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#27AE60]" />
                Filter Properties
              </h3>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-[#27AE60] hover:text-[#219a52] font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search location or keywords..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
                />
              </div>
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value, county: 'all' })}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all appearance-none bg-white cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All States' : s}
                  </option>
                ))}
              </select>
              <select
                value={filters.county}
                onChange={(e) => setFilters({ ...filters, county: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all appearance-none bg-white cursor-pointer"
              >
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Counties' : c}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="number"
                  placeholder="Min Acres"
                  value={filters.minAcres}
                  onChange={(e) => setFilters({ ...filters, minAcres: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Max Acres"
                  value={filters.maxAcres}
                  onChange={(e) => setFilters({ ...filters, maxAcres: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full mb-6 px-5 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-green-50 hover:text-[#27AE60] transition-all flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-[#27AE60] text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Results Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{sortedProperties.length}</span> properties found
            </p>
            {favorites.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full">
                <Heart className="w-4 h-4 fill-current" />
                {favorites.length} saved
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-[#27AE60]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#27AE60]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all appearance-none bg-white cursor-pointer pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="acres-asc">Acres: Small to Large</option>
              <option value="acres-desc">Acres: Large to Small</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#27AE60] animate-spin mb-4" />
            <p className="text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-red-100 animate-fade-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Error Loading Properties</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white font-semibold rounded-xl hover:from-[#219a52] hover:to-[#27AE60] transition-all shadow-lg shadow-[#27AE60]/30"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !error && sortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="w-20 h-20 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#27AE60]" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Properties Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any properties matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white font-semibold rounded-xl hover:from-[#219a52] hover:to-[#27AE60] transition-all shadow-lg shadow-[#27AE60]/30"
            >
              Clear All Filters
            </button>
          </div>
        ) : !loading && !error && (
          <div className={`grid gap-6 mb-12 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedProperties.map((prop, index) => (
              <div 
                key={prop.id} 
                className="animate-fade-in-up h-full"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PropertyCard
                  property={prop}
                  isFavorite={favorites.includes(prop.id)}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={handleViewDetails}
                  onRequestInfo={handleRequestInfo}
                />
              </div>
            ))}
          </div>

        )}

        {/* Features Section */}
        <div className="mt-16 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Summit Land USA?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make buying land simple, transparent, and affordable. Here's what sets us apart.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive pricing on all properties' },
              { icon: Shield, title: 'Verified Listings', desc: 'All properties are thoroughly vetted' },
              { icon: Clock, title: 'Quick Process', desc: 'Fast and easy purchasing process' },
              { icon: Award, title: 'Expert Support', desc: 'Dedicated team to help you' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#27AE60]/30 transition-all group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#27AE60]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#27AE60] transition-colors">
                  <feature.icon className="w-7 h-7 text-[#27AE60] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestInfoModal
        isOpen={requestInfoModal.open}
        onClose={() => setRequestInfoModal({ open: false })}
        propertyId={requestInfoModal.propertyId}
        propertyTitle={requestInfoModal.propertyTitle}
      />
      <AccountModal
        isOpen={accountModal}
        onClose={() => setAccountModal(false)}
        onSuccess={(email) => setUserEmail(email)}
      />
      <SavedSearchesModal
        isOpen={savedSearchesModal}
        onClose={() => setSavedSearchesModal(false)}
        currentFilters={filters}
        onLoadSearch={(loadedFilters) => setFilters(loadedFilters)}
      />
    </div>
  );
}
