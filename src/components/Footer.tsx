import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-800/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gray-800/50 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6910faa9f176e10ae44e6892_1766590309325_ba24224c.png" 
                alt="Summit Land USA" 
                className="h-12 w-auto brightness-0 invert"
              />

            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for buying and selling land across America. Fast, fair, and hassle-free transactions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+12523768366" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#27AE60] transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>(252) 376-8366</span>
              </a>
              <a href="mailto:info@summitlandusa.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#27AE60] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@summitlandusa.com</span>
              </a>
            </div>
          </div>
          
          {/* For Sellers */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#27AE60] rounded-full"></span>
              For Sellers
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Get Instant Offer', to: '/sell' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Selling Process', to: '/how-it-works' },
                { label: 'FAQs', to: '/how-it-works' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#27AE60]" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* For Buyers */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#27AE60] rounded-full"></span>
              For Buyers
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Properties', to: '/buy' },
                { label: 'View All Land', to: '/buy' },
                { label: 'Financing Options', to: '/buy' },
                { label: 'Property Search', to: '/buy' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#27AE60]" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#27AE60] rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'Contact', to: '/contact' },
                { label: 'Privacy Policy', to: '/terms' },
                { label: 'Terms of Service', to: '/terms' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.to} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#27AE60]" />
                    {item.label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Get the latest land listings and market insights.</p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#27AE60] transition-colors"
              />
              <button className="px-6 py-3 bg-[#27AE60] hover:bg-[#2ECC71] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#27AE60]/20 hover:shadow-[#27AE60]/30">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Summit Land USA. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: '#' },
              { icon: Twitter, href: '#' },
              { icon: Instagram, href: '#' },
              { icon: Linkedin, href: '#' },
            ].map((social, idx) => (
              <a 
                key={idx}
                href={social.href}
                className="w-10 h-10 bg-gray-800 hover:bg-[#27AE60] rounded-lg flex items-center justify-center transition-colors group"
              >
                <social.icon className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
