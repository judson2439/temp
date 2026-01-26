import React from 'react';
import { DollarSign, Zap, CheckCircle, BarChart3, Shield, Users } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Instant Cash Offers',
      description: 'Get a ballpark offer in under 60 seconds. No waiting, no hassle.',
      icon: DollarSign,
      color: 'from-[#27AE60] to-[#1E8449]',
      bgColor: 'bg-[#e8f8ef]',
    },
    {
      title: 'Fast Closing',
      description: 'Close in as little as 7-14 days. We handle all the paperwork.',
      icon: Zap,
      color: 'from-[#1E8449] to-[#145A32]',
      bgColor: 'bg-[#e8f8ef]',
    },
    {
      title: 'No Hidden Fees',
      description: 'We pay all closing costs. What you see is what you get.',
      icon: CheckCircle,
      color: 'from-[#27AE60] to-[#1E8449]',
      bgColor: 'bg-[#e8f8ef]',
    },
    {
      title: 'Real-Time Tracking',
      description: 'Track your deal status from offer to closing in your portal.',
      icon: BarChart3,
      color: 'from-[#1E8449] to-[#145A32]',
      bgColor: 'bg-[#e8f8ef]',
    },
    {
      title: 'Secure Process',
      description: 'Licensed title companies and secure document handling.',
      icon: Shield,
      color: 'from-[#27AE60] to-[#1E8449]',
      bgColor: 'bg-[#e8f8ef]',
    },
    {
      title: 'Family Values',
      description: 'Family-run business built on honesty and integrity.',
      icon: Users,
      color: 'from-[#1E8449] to-[#145A32]',
      bgColor: 'bg-[#e8f8ef]',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#e8f8ef]/50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#d5f5e3]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#d5f5e3]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
            <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
            <span className="text-sm font-semibold text-[#1E8449]">Why Choose Us</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Summit Land USA</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make land transactions simple, fast, and stress-free with our proven process
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all duration-500 hover-lift animate-fade-in-up border border-[#d5f5e3]/50"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center shadow-green`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-[#0d3d22] mb-3 group-hover:text-[#1E8449] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Hover Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#27AE60] to-[#2ECC71] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
