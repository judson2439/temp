import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { 
      value: 500, 
      suffix: '+', 
      label: 'Properties Sold',
      icon: TrendingUp,
      description: 'Successful transactions'
    },
    { 
      value: 50, 
      prefix: '$', 
      suffix: 'M+', 
      label: 'Total Transactions',
      icon: Award,
      description: 'In land purchases'
    },
    { 
      value: 98, 
      suffix: '%', 
      label: 'Customer Satisfaction',
      icon: Users,
      description: 'Happy landowners'
    },
    { 
      value: 7, 
      suffix: ' Days', 
      label: 'Average Closing Time',
      icon: Clock,
      description: 'Fast & efficient'
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-[#0d3d22] via-[#145A32] to-[#1E8449] text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#27AE60]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#2ECC71]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#27AE60]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-[#82e0aa] rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[#d5f5e3]">Our Track Record</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Landowners <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#82e0aa] to-[#d5f5e3]">Nationwide</span>
          </h2>
          <p className="text-xl text-[#d5f5e3]/80 max-w-2xl mx-auto">
            Our numbers speak for themselves. Join hundreds of satisfied landowners.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`relative group ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-500 hover-lift">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#27AE60]/20 to-[#2ECC71]/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-7 h-7 text-[#82e0aa]" />
                </div>
                
                {/* Value */}
                <div className="mb-2">
                  <span className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#d5f5e3]">
                    {stat.prefix}
                    <CountUp 
                      end={stat.value} 
                      isVisible={isVisible} 
                      duration={2000}
                    />
                    {stat.suffix}
                  </span>
                </div>
                
                {/* Label */}
                <p className="text-lg font-semibold text-white mb-1">{stat.label}</p>
                <p className="text-sm text-[#82e0aa]/70">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CountUp Animation Component
const CountUp: React.FC<{ end: number; isVisible: boolean; duration?: number }> = ({ 
  end, 
  isVisible, 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, isVisible, duration]);

  return <>{count}</>;
};
