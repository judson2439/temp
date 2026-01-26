import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766468647786_21d17432.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - CTA */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
              <span className="w-2 h-2 bg-[#27AE60] rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-[#1E8449]">Get Started Today</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6 leading-tight">
              Ready to Sell Your Land?
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">
                Get Your Free Offer Now
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join hundreds of satisfied landowners who have sold their property quickly and hassle-free. 
              No obligations, no fees, just a fair cash offer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/sell">
                <Button 
                  size="lg" 
                  className="bg-[#27AE60] hover:bg-[#1E8449] text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-green hover:shadow-green-lg transition-all duration-300 group w-full sm:w-auto"
                >
                  Get Instant Offer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-[#d5f5e3] text-[#1E8449] hover:bg-[#e8f8ef] hover:border-[#82e0aa] font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-10 h-10 bg-[#d5f5e3] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#27AE60]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">No Fees</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-10 h-10 bg-[#d5f5e3] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#27AE60]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Fast Closing</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-10 h-10 bg-[#d5f5e3] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#27AE60]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Fair Offers</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Card */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#27AE60]/20 to-[#2ECC71]/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-[#0d3d22] via-[#145A32] to-[#1E8449] rounded-3xl p-8 lg:p-10 shadow-soft-xl text-white">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <a 
                    href="tel:+12523768366" 
                    className="flex items-center gap-4 group hover:translate-x-2 transition-transform"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5 text-[#82e0aa]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#82e0aa]">Call Us</p>
                      <p className="text-lg font-semibold">(252) 376-8366</p>
                    </div>
                  </a>
                  
                  <a 
                    href="mailto:info@summitlandusa.com" 
                    className="flex items-center gap-4 group hover:translate-x-2 transition-transform"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5 text-[#82e0aa]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#82e0aa]">Email Us</p>
                      <p className="text-lg font-semibold">info@summitlandusa.com</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#82e0aa]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#82e0aa]">Location</p>
                      <p className="text-lg font-semibold">Nationwide Service</p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Element */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#27AE60]/10 rounded-tl-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
