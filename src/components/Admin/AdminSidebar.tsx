import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TabType, menuItems } from './adminData';
import { useAppContext } from '@/contexts/AppContext';

interface AdminSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  onSearchClear: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  onSearchClear,
}) => {
  const navigate = useNavigate();
  const { userEmail, isLoggedIn, userRole, logout } = useAppContext();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as TabType);
    onSearchClear();
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // Get display name from email
  const getDisplayName = (email: string) => {
    if (!email) return 'Admin';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Get initials for avatar
  const getInitials = (email: string) => {
    if (!email) return 'A';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`
          hidden lg:flex
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          flex-shrink-0 transition-all duration-300 ease-in-out h-full 
          bg-white/70 backdrop-blur-xl border-r border-gray-200/50 
          shadow-xl shadow-gray-200/20 flex-col
        `}
      >
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 transform hover:scale-[1.02] ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-gray-600 hover:bg-gray-100/80'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <svg 
                className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
        
        {/* Sidebar Footer - User Status & Sign Out */}
        <div className="p-4 flex-shrink-0 border-t border-gray-200/50">
          {!sidebarCollapsed ? (
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getInitials(userEmail)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getDisplayName(userEmail)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userEmail || 'admin@example.com'}
                  </p>
                </div>
                {/* Online status indicator */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {userRole || 'Admin'}
                </span>
                <span className="text-emerald-600 font-medium">Online</span>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {getInitials(userEmail)}
              </div>
              <button 
                onClick={handleSignOut}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                title="Sign Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside 
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-72 
          bg-white/95 backdrop-blur-xl border-r border-gray-200/50 
          shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Control Center</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-gray-600 hover:bg-gray-100/80'
              }`}
            >
              <svg 
                className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Mobile Sidebar Footer */}
        <div className="p-4 flex-shrink-0 border-t border-gray-200/50">
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {getInitials(userEmail)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getDisplayName(userEmail)}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userEmail || 'admin@example.com'}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 text-sm font-medium shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
