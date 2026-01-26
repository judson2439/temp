import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, User, LogOut, MessageCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check user session and role
    const checkSession = () => {
      const session = localStorage.getItem('session');
      const role = localStorage.getItem('userRole');
      
      if (session) {
        try {
          const parsedSession = JSON.parse(session);
          if (parsedSession?.user) {
            setIsLoggedIn(true);
            setUserRole(parsedSession.user.role || role || 'buyer');
          }
        } catch (e) {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkSession();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, [location]);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminSession');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setMobileMenuOpen(false);
  };

  // Navigation links (same for all users)
  const navLinks = [
    { to: '/buy', label: 'Buy Land' },
    { to: '/sell', label: 'Sell My Land' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];





  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 relative z-[60] group">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6910faa9f176e10ae44e6892_1766590309325_ba24224c.png" 
              alt="Summit Land USA" 
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(link.to)
                    ? 'text-[#27AE60]'
                    : 'text-gray-700 hover:text-[#27AE60] hover:bg-[#e8f8ef]'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#27AE60] rounded-full"></span>
                )}
              </Link>
            ))}
            
            <div className="pl-4 flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* Messages button - shows for both buyers and sellers */}
                  <button
                    onClick={() => navigate('/messages')}
                    className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-[#27AE60] hover:bg-[#e8f8ef] rounded-lg transition-all duration-300"
                    title="Messages"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {/* Optional: Notification badge - can be connected to real message count later */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>
                  {/* Show Dashboard button for both buyers and sellers */}
                  <button
                    onClick={handleDashboardClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#27AE60] hover:bg-[#e8f8ef] rounded-lg transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>

              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant="outline"
                      size="sm" 
                      className="border-[#27AE60] text-[#27AE60] hover:bg-[#e8f8ef] font-semibold px-6 rounded-lg transition-all duration-300"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm" 
                      className="bg-[#27AE60] hover:bg-[#1E8449] text-white font-semibold px-6 rounded-lg shadow-green hover:shadow-green-lg transition-all duration-300"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}

          <button 
            className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e8f8ef] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#145A32]/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className={`absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-soft-xl border border-[#d5f5e3] overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                onClick={handleMobileNavClick} 
                className={`block w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.to)
                    ? 'bg-[#e8f8ef] text-[#27AE60]'
                    : 'text-gray-700 hover:bg-[#e8f8ef] hover:text-[#27AE60]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <>
                {/* Messages button - shows for both buyers and sellers */}
                <button
                  onClick={() => {
                    navigate('/messages');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-[#e8f8ef] hover:text-[#27AE60] transition-all duration-300 text-left"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    3
                  </span>
                </button>
                {/* Show Dashboard button for both buyers and sellers */}
                <button
                  onClick={handleDashboardClick}
                  className="block w-full px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-[#e8f8ef] hover:text-[#27AE60] transition-all duration-300 text-left"
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-300 text-left"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Sign Out
                </button>
              </>



            ) : (
              <div className="pt-2 space-y-2">
                <Link to="/login" onClick={handleMobileNavClick} className="block">
                  <Button 
                    variant="outline"
                    className="w-full border-[#27AE60] text-[#27AE60] hover:bg-[#e8f8ef] font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={handleMobileNavClick} className="block">
                  <Button 
                    className="w-full bg-[#27AE60] hover:bg-[#1E8449] text-white font-semibold py-3 rounded-xl shadow-green transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};
