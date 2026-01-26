import React from 'react';
import { Play, CheckCircle, Clock, Shield, ArrowDown } from 'lucide-react';

export const HowItWorksHero: React.FC = () => {
  const scrollToSteps = () => {
    const stepsSection = document.getElementById('steps-section');
    if (stepsSection) {
      stepsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-20 relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766471522009_5af8bc90.png"
          alt="Beautiful rural landscape"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay - Updated to green (#27AE60) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a5c38]/95 via-[#27AE60]/85 to-[#2ecc71]/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a5c38]/50 via-transparent to-transparent"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#27AE60]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#2ecc71]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#27AE60]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20 animate-fade-in-down">
              <span className="w-2 h-2 bg-[#2ecc71] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-green-100">Simple 5-Step Process</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              How It{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2ecc71] via-[#a8e6cf] to-white">
                Works
              </span>
            </h1>
            
            <p className="text-xl text-green-100/90 mb-8 leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Selling your land has never been easier. Our streamlined process gets you a fair cash offer in 24-48 hours with zero hassle.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <Clock className="w-6 h-6 text-[#2ecc71] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">24-48</div>
                <div className="text-xs text-green-200">Hours to Offer</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <Shield className="w-6 h-6 text-[#2ecc71] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-green-200">Free Service</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center hover:bg-white/15 transition-colors">
                <CheckCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">7-14</div>
                <div className="text-xs text-green-200">Days to Close</div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <button
                onClick={scrollToSteps}
                className="group inline-flex items-center gap-2 bg-white text-[#27AE60] px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                See How It Works
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
              <button className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Play className="w-5 h-5" />
                Watch Video
              </button>
            </div>
          </div>
          
          {/* Right Content - Process Preview Card */}
          <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#27AE60] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </span>
                Quick Overview
              </h3>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Submit Your Land', time: '2 min' },
                  { step: 2, title: 'We Research Property', time: '24 hrs' },
                  { step: 3, title: 'Receive Cash Offer', time: '48 hrs' },
                  { step: 4, title: 'We Handle Paperwork', time: '3-5 days' },
                  { step: 5, title: 'You Get Paid!', time: '7-14 days' },
                ].map((item, index) => (
                  <div 
                    key={item.step}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#27AE60] to-[#2ecc71] rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.title}</div>
                    </div>
                    <div className="text-[#a8e6cf] text-sm font-medium bg-[#27AE60]/20 px-3 py-1 rounded-full">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-200">Total Time to Cash</span>
                  <span className="text-white font-bold text-lg">As fast as 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </div>
  );
};
