import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  Plus,
  Home,
  DollarSign,
  Eye,
  TrendingUp,
  LogOut,
  Bell,
  Settings,
  User,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  price: number;
  acres: number;
  county: string;
  state: string;
  status: 'active' | 'pending' | 'sold' | 'draft';
  views: number;
  inquiries: number;
  image: string;
  created_at: string;
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'analytics' | 'messages'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession?.user?.email) {
          setUserEmail(parsedSession.user.email);
          setUserName(parsedSession.user.email.split('@')[0]);
        }
      } catch (e) {
        console.error('Error parsing session:', e);
      }
    }

    // Mock properties data for demonstration
    setProperties([
      {
        id: '1',
        title: 'Beautiful 10-Acre Ranch',
        price: 75000,
        acres: 10,
        county: 'Travis',
        state: 'Texas',
        status: 'active',
        views: 245,
        inquiries: 12,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
        created_at: '2024-01-15'
      },
      {
        id: '2',
        title: 'Mountain View Property',
        price: 125000,
        acres: 25,
        county: 'El Paso',
        state: 'Colorado',
        status: 'pending',
        views: 189,
        inquiries: 8,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        created_at: '2024-02-20'
      },
      {
        id: '3',
        title: 'Lakefront Lot',
        price: 95000,
        acres: 5,
        county: 'Lake',
        state: 'Florida',
        status: 'sold',
        views: 312,
        inquiries: 25,
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
        created_at: '2024-01-05'
      }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const stats = [
    { 
      label: 'Total Listings', 
      value: properties.length, 
      icon: Home, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Total Views', 
      value: properties.reduce((sum, p) => sum + p.views, 0), 
      icon: Eye, 
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'Total Inquiries', 
      value: properties.reduce((sum, p) => sum + p.inquiries, 0), 
      icon: FileText, 
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    { 
      label: 'Revenue', 
      value: '$95,000', 
      icon: DollarSign, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      isString: true
    },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'listings', label: 'My Listings', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: FileText },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Sold
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white pt-28 pb-32 overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl animate-bounce-slow" />
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
                    Seller Dashboard
                  </h1>
                  <p className="text-blue-100 mt-1">{userEmail}</p>
                </div>
              </div>
              <p className="text-lg text-blue-100 max-w-xl">
                Manage your property listings, track performance, and connect with potential buyers.
              </p>
            </div>

            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button
                onClick={() => navigate('/post-land')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Post New Land
              </Button>
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
              className="bg-white rounded-2xl p-6 shadow-lg shadow-blue-900/5 border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.isString ? stat.value : stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-4 sticky top-28">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-4 mb-4">Navigation</h3>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
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
                  onClick={() => navigate('/post-land')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Post New Land</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Recent Listings */}
                <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
                    <button 
                      onClick={() => setActiveTab('listings')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {properties.slice(0, 3).map((property, index) => (
                      <div
                        key={property.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300 group"
                      >
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {property.county}, {property.state}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-blue-600 font-bold">${property.price.toLocaleString()}</span>
                            <span className="text-gray-400 text-sm">{property.acres} acres</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(property.status)}
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {property.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {property.inquiries}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Summary</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-1">85%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-1">4.8</div>
                      <div className="text-sm text-gray-600">Avg. Rating</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">2.5h</div>
                      <div className="text-sm text-gray-600">Avg. Response Time</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
                  <Button
                    onClick={() => navigate('/post-land')}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </div>
                
                {properties.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Home className="w-10 h-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start selling your land by creating your first listing.
                    </p>
                    <Button
                      onClick={() => navigate('/post-land')}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    >
                      <Plus className="w-5 h-5" />
                      Post Your First Land
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property, index) => (
                      <div
                        key={property.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {property.county}, {property.state}
                              </p>
                            </div>
                            {getStatusBadge(property.status)}
                          </div>
                          <div className="flex items-center gap-6 mt-3">
                            <span className="text-blue-600 font-bold text-lg">${property.price.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm">{property.acres} acres</span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Listed {property.created_at}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {property.views} views
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {property.inquiries} inquiries
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics</h2>
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Detailed analytics and insights about your listings will be available here.
                  </p>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Messages</h2>
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    When buyers inquire about your properties, their messages will appear here.
                  </p>
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
