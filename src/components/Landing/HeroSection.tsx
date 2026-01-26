import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, MapPin, DollarSign, Clock, CheckCircle, Calendar } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#013d22] via-[#105A32] to-[#108449]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main Background Image */}
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766468632653_94d209b9.png"
          alt="Land"
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d22]/95 via-[#145A32]/80 to-[#1E8449]/70"></div>
        
        {/* Animated Circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#27AE60]/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-bounce-subtle"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 min-h-[70vh]">
          
          {/* Left Column - Main CTA */}
          <div className="space-y-8 text-white animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fade-in animation-delay-100">
              <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[#d5f5e3]">Trusted by 500+ Landowners</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight animate-fade-in-up animation-delay-200">
              Get an Instant 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#82e0aa] via-[#d5f5e3] to-white">
                Cash Offer
              </span>
              for Your Land
            </h1>
            
            <p className="text-xl text-[#d5f5e3]/90 max-w-xl leading-relaxed animate-fade-in-up animation-delay-300">
              Fast, fair, and hassle-free. No agents. No fees. No waiting. 
              Close in as little as 7 days.
            </p>
            
            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 animate-fade-in-up animation-delay-400">
              {[
                { icon: Clock, text: 'Close in 7-14 Days' },
                { icon: DollarSign, text: 'No Hidden Fees' },
                { icon: CheckCircle, text: 'Fair Cash Offers' },
                { icon: Calendar, text: 'Close on Your Timeline' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                  <item.icon className="w-4 h-4 text-[#82e0aa] flex-shrink-0" />
                  <span className="text-sm text-[#d5f5e3]">{item.text}</span>
                </div>
              ))}
            </div>

            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animation-delay-500">
              <Link to="/sell">
                <Button 
                  size="lg" 
                  className="group bg-white text-[#145A32] hover:bg-[#e8f8ef] font-semibold px-8 py-6 text-lg rounded-xl shadow-green-lg hover:shadow-green transition-all duration-300 w-full sm:w-auto"
                >
                  Get Instant Offer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Column - Card */}
          <div className="animate-fade-in-up animation-delay-300">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#27AE60]/20 to-[#2ECC71]/20 rounded-3xl blur-2xl"></div>
              
              <div className="relative glass-white rounded-3xl p-8 lg:p-10 shadow-soft-xl hover-lift">
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#27AE60] to-[#1E8449] rounded-xl flex items-center justify-center shadow-green">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#145A32]">
                      Find Your Perfect Parcel
                    </h2>
                    <p className="text-[#27AE60]/70 text-sm">Premium land opportunities</p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Browse premium land opportunities across America. 
                  Affordable financing options available.
                </p>
                
                {/* Property Preview Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766468664095_e9ef8dc6.jpg',
                    'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766468665014_a70f7267.jpg',
                    'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766468670939_07590b65.jpg',
                  ].map((img, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-xl aspect-square">
                      <img 
                        src={img} 
                        alt={`Property ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#145A32]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/buy" className="flex-1">
                    <Button 
                      size="lg" 
                      className="w-full bg-[#27AE60] hover:bg-[#1E8449] text-white font-semibold rounded-xl shadow-green transition-all duration-300"
                    >
                      Browse Properties
                    </Button>
                  </Link>
                  <Link to="/buy" className="flex-1">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full border-2 border-[#d5f5e3] text-[#1E8449] hover:bg-[#e8f8ef] hover:border-[#82e0aa] font-semibold rounded-xl transition-all duration-300"
                    >
                      View All Land
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-fade-in"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
