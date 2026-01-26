import React, { useState } from 'react';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <Link to="/" className="flex items-center gap-2 relative z-[60]">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6910faa9f176e10ae44e6892_1764707931796_95c1e39b.png" 
              alt="Summit Land USA" 
              className="h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/buy" className="text-gray-700 hover:text-[#27AE60] font-medium">Buy Land</Link>
            <Link to="/sell" className="text-gray-700 hover:text-[#27AE60] font-medium">Get Offer</Link>

            <Link to="/how-it-works" className="text-gray-700 hover:text-[#27AE60] font-medium">How It Works</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#27AE60] font-medium">Contact</Link>
            <Button variant="primary" size="sm" onClick={() => navigate('/sell')}>Get Started</Button>

          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => handleNavClick('/buy')} className="block w-full text-left text-gray-700 hover:text-[#27AE60] font-medium">Buy Land</button>
            <button onClick={() => handleNavClick('/sell')} className="block w-full text-left text-gray-700 hover:text-[#27AE60] font-medium">Get Offer</button>

            <button onClick={() => handleNavClick('/how-it-works')} className="block w-full text-left text-gray-700 hover:text-[#27AE60] font-medium">How It Works</button>
            <button onClick={() => handleNavClick('/contact')} className="block w-full text-left text-gray-700 hover:text-[#27AE60] font-medium">Contact</button>
            <Button variant="primary" size="sm" className="w-full" onClick={() => handleNavClick('/sell')}>Get Started</Button>

          </div>
        </div>
      )}
    </nav>
  );
};

