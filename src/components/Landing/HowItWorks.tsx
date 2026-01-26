import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { FileText, Building2, Banknote, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Get an Offer',
      description: 'Enter your parcel info or drop a pin on the map. Get an instant ballpark offer in under 60 seconds.',
      icon: FileText,
    },
    {
      number: '02',
      title: 'We Handle Closing',
      description: 'We coordinate with a licensed title company. Upload your documents and track progress in real-time.',
      icon: Building2,
    },
    {
      number: '03',
      title: 'Get Paid Fast',
      description: 'Receive your payment quickly and securely. Close in as little as 7-14 days.',
      icon: Banknote,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2327AE60' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
            <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
            <span className="text-sm font-semibold text-[#1E8449]">Simple Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
            How It Works in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">3 Easy Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Selling your land has never been easier. Our streamlined process gets you cash fast.
          </p>
        </div>
        
        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#d5f5e3] via-[#27AE60] to-[#d5f5e3] -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div 
                key={step.number} 
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                {/* Card */}
                <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-500 hover-lift border border-[#d5f5e3] text-center group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#27AE60] to-[#1E8449] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-green">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#e8f8ef] to-[#d5f5e3] rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10 text-[#27AE60]" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[#0d3d22] mb-4 group-hover:text-[#1E8449] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow (between cards) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-[#27AE60]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16 animate-fade-in-up animation-delay-600">
          <Link to="/sell">
            <Button 
              size="lg" 
              className="bg-[#27AE60] hover:bg-[#1E8449] text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-green hover:shadow-green-lg transition-all duration-300 group"
            >
              Start Your Offer Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
