import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import { 
  Heart, 
  Search, 
  Calendar, 
  LogOut, 
  MapPin, 
  Trash2, 
  ExternalLink, 
  Home, 
  Bell, 
  Settings, 
  User,
  TrendingUp,
  Eye,
  Clock,
  ChevronRight,
  Star,
  Bookmark,
  Filter,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'searches' | 'reservations'>('overview');

  // Fetch all properties from database
  const { properties, loading } = useProperties({ status: 'active' });

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      const storedSearches = localStorage.getItem('savedSearches');
      if (storedSearches) setSavedSearches(JSON.parse(storedSearches));
      
      const session = localStorage.getItem('session');
      if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession?.user?.email) {
          setUserEmail(parsedSession.user.email);
          setUserName(parsedSession.user.email.split('@')[0]);
        }
      }
    } catch (e) {}
  }, []);

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  const removeFavorite = (id: string) => {
    const newFavorites = favorites.filter(f => f !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeSearch = (index: number) => {
    const newSearches = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(newSearches);
    localStorage.setItem('savedSearches', JSON.stringify(newSearches));
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/login');
  };

  const stats = [
    { 
      label: 'Saved Properties', 
      value: favoriteProperties.length, 
      icon: Heart, 
      color: 'from-[#27AE60] to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-[#27AE60]'
    },
    { 
      label: 'Saved Searches', 
      value: savedSearches.length, 
      icon: Search, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      label: 'Reservations', 
      value: reservations.length, 
      icon: Calendar, 
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    { 
      label: 'Properties Viewed', 
      value: 24, 
      icon: Eye, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'saved', label: 'Saved Properties', icon: Heart },
    { id: 'searches', label: 'Saved Searches', icon: Search },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
  ];

  const recentActivity = [
    { action: 'Viewed property', property: 'Mountain View Ranch', time: '2 hours ago', icon: Eye },
    { action: 'Saved property', property: 'Lakefront Paradise', time: '5 hours ago', icon: Heart },
    { action: 'Searched for', property: 'Texas land under $50k', time: '1 day ago', icon: Search },
    { action: 'Viewed property', property: 'Desert Oasis', time: '2 days ago', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#27AE60] via-emerald-600 to-emerald-700 text-white pt-28 pb-32 overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl animate-bounce-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Welcome back, {userName || 'User'}!
                  </h1>
                  <p className="text-emerald-100 mt-1">{userEmail}</p>
                </div>
              </div>
              <p className="text-lg text-emerald-100 max-w-xl">
                Manage your saved properties, searches, and reservations all in one place.
              </p>
            </div>

            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 hover:scale-105">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 hover:scale-105">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-red-500/80 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 hover:border-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-in-up">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-emerald-900/5 border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-[#27AE60]" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-4 sticky top-28">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">Navigation</h3>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-[#27AE60] to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'text-gray-600 hover:bg-emerald-50 hover:text-[#27AE60]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">Quick Actions</h3>
                <button
                  onClick={() => navigate('/buy')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 text-[#27AE60] rounded-xl hover:from-emerald-100 hover:to-green-100 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Browse Properties</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-12 text-center">
                <Loader2 className="w-12 h-12 text-[#27AE60] animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your data...</p>
              </div>
            )}

            {/* Overview Tab */}
            {!loading && activeTab === 'overview' && (
              <>
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                    <button className="text-[#27AE60] hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors duration-300 group"
                      >
                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                          <activity.icon className="w-5 h-5 text-[#27AE60]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{activity.action}</p>
                          <p className="text-[#27AE60] text-sm">{activity.property}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Saved Properties */}
                {favoriteProperties.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Your Saved Properties</h2>
                      <button 
                        onClick={() => setActiveTab('saved')}
                        className="text-[#27AE60] hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {favoriteProperties.slice(0, 2).map((prop) => (
                        <div
                          key={prop.id}
                          className="group relative bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => navigate(`/property/${prop.id}`)}
                        >
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={prop.image}
                              alt={prop.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-3 right-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFavorite(prop.id);
                                }}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-colors"
                              >
                                <Heart className="w-4 h-4 fill-current text-red-500 hover:text-white" />
                              </button>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <p className="text-white font-bold text-lg">${prop.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#27AE60] transition-colors">{prop.title}</h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {prop.county}, {prop.state}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Saved Properties Tab */}
            {!loading && activeTab === 'saved' && (
              <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Properties</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-[#27AE60] rounded-full text-sm font-medium">
                    {favoriteProperties.length} properties
                  </span>
                </div>
                
                {favoriteProperties.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved properties yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start exploring and save properties you're interested in to view them here.
                    </p>
                    <button
                      onClick={() => navigate('/buy')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#27AE60] to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <MapPin className="w-5 h-5" />
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {favoriteProperties.map((prop, index) => (
                      <div
                        key={prop.id}
                        className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div 
                          className="relative h-48 overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/property/${prop.id}`)}
                        >
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-[#27AE60] text-white text-xs font-semibold rounded-full">
                              {prop.acres} acres
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFavorite(prop.id);
                              }}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 group/btn transition-colors"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/btn:text-white group-hover/btn:fill-white" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-2xl font-bold">${prop.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 
                            className="font-bold text-lg text-gray-900 group-hover:text-[#27AE60] transition-colors cursor-pointer mb-2"
                            onClick={() => navigate(`/property/${prop.id}`)}
                          >
                            {prop.title}
                          </h3>
                          <p className="text-gray-500 flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-[#27AE60]" />
                            {prop.county}, {prop.state}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => navigate(`/property/${prop.id}`)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#27AE60] to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => removeFavorite(prop.id)}
                              className="p-2.5 border-2 border-red-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Searches Tab */}
            {!loading && activeTab === 'searches' && (
              <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Searches</h2>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium">
                    {savedSearches.length} searches
                  </span>
                </div>

                {savedSearches.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved searches yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Save your search criteria to quickly find properties that match your preferences.
                    </p>
                    <button
                      onClick={() => navigate('/buy')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#27AE60] to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <Filter className="w-5 h-5" />
                      Start Searching
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSearches.map((search, index) => (
                      <div
                        key={index}
                        className="group p-5 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Search className="w-5 h-5 text-[#27AE60]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{search.name || `Search ${index + 1}`}</h3>
                              <p className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2">
                                {search.state && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full text-xs">
                                    <MapPin className="w-3 h-3" /> {search.state}
                                  </span>
                                )}
                                {search.minPrice && (
                                  <span className="px-2 py-0.5 bg-white rounded-full text-xs">
                                    Min: ${Number(search.minPrice).toLocaleString()}
                                  </span>
                                )}
                                {search.maxPrice && (
                                  <span className="px-2 py-0.5 bg-white rounded-full text-xs">
                                    Max: ${Number(search.maxPrice).toLocaleString()}
                                  </span>
                                )}
                                {search.minAcres && (
                                  <span className="px-2 py-0.5 bg-white rounded-full text-xs">
                                    {search.minAcres}+ acres
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSearch(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const params = new URLSearchParams();
                            if (search.state) params.set('state', search.state);
                            if (search.minPrice) params.set('minPrice', search.minPrice);
                            if (search.maxPrice) params.set('maxPrice', search.maxPrice);
                            if (search.minAcres) params.set('minAcres', search.minAcres);
                            navigate(`/buy?${params.toString()}`);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#27AE60] to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Search className="w-4 h-4" />
                          Run This Search
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reservations Tab */}
            {!loading && activeTab === 'reservations' && (
              <div className="bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-100 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Reservations</h2>
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium">
                    {reservations.length} reservations
                  </span>
                </div>

                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    When you reserve a property, it will appear here for easy tracking.
                  </p>
                  <button
                    onClick={() => navigate('/buy')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#27AE60] to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <MapPin className="w-5 h-5" />
                    Find Your Land
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
}
