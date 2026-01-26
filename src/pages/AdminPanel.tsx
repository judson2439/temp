import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminSidebar,
  AdminHeader,
  AdminDashboard,
  AdminUsers,
  AdminProperties,
  AdminOffers,
  AdminSettings,
  TabType,
} from '@/components/Admin';
import { supabase } from '@/lib/supabase';


const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [propertyStats, setPropertyStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
  });

  // Fetch user counts for dashboard stats
  const fetchUserCounts = async () => {
    try {
      const { count: total } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: active } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active');
      
      setUserCount(total || 0);
      setActiveUserCount(active || 0);
    } catch (err) {
      console.error('Error fetching user counts:', err);
    }
  };

  // Fetch property stats for dashboard
  const fetchPropertyStats = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: data?.filter(p => p.status === 'active').length || 0,
        pending: data?.filter(p => p.status === 'pending').length || 0,
        sold: data?.filter(p => p.status === 'sold').length || 0,
      };

      setPropertyStats(stats);
    } catch (err) {
      console.error('Error fetching property stats:', err);
    }
  };

  // Check admin authentication
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    const session = localStorage.getItem('session');
    const userRole = localStorage.getItem('userRole');
    
    let isAdmin = false;
    
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        if (parsed.isAdmin) {
          isAdmin = true;
        }
      } catch {
        localStorage.removeItem('adminSession');
      }
    }
    
    if (!isAdmin && session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.user?.role === 'admin' || parsed.isAdmin) {
          isAdmin = true;
        }
      } catch {
        localStorage.removeItem('session');
      }
    }
    
    if (!isAdmin && userRole === 'admin') {
      isAdmin = true;
    }
    
    if (!isAdmin) {
      navigate('/login', { replace: true });
    }
    
    // Fetch data
    fetchUserCounts();
    fetchPropertyStats();
    
    // Trigger animations after mount
    setTimeout(() => setIsLoaded(true), 100);
  }, [navigate]);

  // Close mobile sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    // Refresh data when switching to dashboard
    if (tab === 'dashboard') {
      fetchUserCounts();
      fetchPropertyStats();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('session');
    localStorage.removeItem('userRole');
    navigate('/login', { replace: true });
  };

  const stats = {
    totalUsers: userCount,
    activeUsers: activeUserCount,
    totalProperties: propertyStats.total,
    activeListings: propertyStats.active,
    pendingReviews: propertyStats.pending,
    totalRevenue: '$1,245,000',
    monthlyGrowth: '+12.5%',
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleViewAllProperties = () => {
    setActiveTab('properties');
    setSearchTerm('');
  };

  const handleViewUsers = () => {
    setActiveTab('users');
    setSearchTerm('');
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-violet-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-sky-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Admin Header - Fixed height */}
      <AdminHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Content Area - Takes remaining height */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed width on desktop, drawer on mobile */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          sidebarCollapsed={sidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          onSearchClear={handleClearSearch}
        />

        {/* Main Content - Scrollable */}
        <main 
          className={`flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <AdminDashboard
              stats={stats}
              onViewAllProperties={handleViewAllProperties}
              onViewUsers={handleViewUsers}
            />
          )}


          {/* Users Tab */}
          {activeTab === 'users' && (
            <AdminUsers />
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <AdminProperties />
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <AdminOffers />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && <AdminSettings />}
        </main>

      </div>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
