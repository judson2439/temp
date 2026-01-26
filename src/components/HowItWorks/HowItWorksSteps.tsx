import React, { useState } from 'react';
import { FileText, Search, DollarSign, FileCheck, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';

const steps = [
  {
    num: 1,
    title: 'Submit Your Land',
    desc: 'Fill out our simple form with your property details. It takes less than 2 minutes.',
    longDesc: 'Just provide basic information about your property - location, size, and how to contact you. No complicated paperwork or lengthy questionnaires.',
    icon: FileText,
    color: 'from-[#27AE60] to-[#1E8449]',
    bgColor: 'bg-[#e8f8ef]',
    borderColor: 'border-[#82e0aa]',
    iconBg: 'bg-[#d5f5e3]',
    iconColor: 'text-[#27AE60]',
  },
  {
    num: 2,
    title: 'We Research Your Property',
    desc: 'Our team reviews county records, zoning, and market data to evaluate your land.',
    longDesc: 'Our experienced team conducts thorough due diligence including title search, zoning verification, comparable sales analysis, and market research.',
    icon: Search,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    num: 3,
    title: 'Receive Your Cash Offer',
    desc: 'Get a fair, no-obligation cash offer within 24-48 hours.',
    longDesc: 'We provide a competitive cash offer based on current market conditions. No hidden fees, no commissions, and absolutely no obligation to accept.',
    icon: DollarSign,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    num: 4,
    title: 'We Handle Title Work',
    desc: 'We coordinate with a licensed title company to handle all paperwork and closing.',
    longDesc: 'Our team manages the entire closing process. We work with reputable title companies to ensure a smooth, hassle-free transaction.',
    icon: FileCheck,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    num: 5,
    title: 'You Get Paid',
    desc: 'Close in as little as 7-14 days and receive your cash payment.',
    longDesc: 'Once everything is finalized, you receive your payment via wire transfer or certified check. Fast, secure, and hassle-free.',
    icon: CheckCircle,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
];

export const HowItWorksSteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div id="steps-section" className="relative py-8">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-[#27AE60]" />
          <span className="text-sm font-semibold text-[#27AE60]">Our Process</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Five Simple Steps to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">
            Sell Your Land
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We've simplified the land selling process so you can get cash for your property quickly and easily.
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-8 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#27AE60] via-purple-500 via-green-500 via-orange-500 to-teal-500 hidden md:block"></div>

        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === i;
          const isEven = i % 2 === 0;

          return (
            <div
              key={i}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 last:mb-0 animate-fade-in-up cursor-pointer group`}
              style={{ animationDelay: `${i * 150}ms` }}
              onClick={() => setActiveStep(isActive ? null : i)}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Timeline Node - Mobile */}
              <div className="md:hidden flex items-center gap-4">
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform transition-all duration-300 ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-105'}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className={`text-sm font-bold ${step.iconColor}`}>Step {step.num}</span>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className={`hidden md:flex w-full items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Content Card */}
                <div className={`w-5/12 ${isEven ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className={`${step.bgColor} ${step.borderColor} border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${isActive ? 'scale-105 shadow-xl' : ''}`}>
                    <span className={`inline-block text-sm font-bold ${step.iconColor} mb-2`}>Step {step.num}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#27AE60] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {isActive ? step.longDesc : step.desc}
                    </p>
                    {isActive && (
                      <div className={`mt-4 pt-4 border-t ${step.borderColor} animate-fade-in`}>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                          <CheckCircle className={`w-4 h-4 ${step.iconColor}`} />
                          <span>Click to learn more</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center Node */}
                <div className="w-2/12 flex justify-center">
                  <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform transition-all duration-300 ${isActive ? 'scale-125 rotate-6' : 'group-hover:scale-110'}`}>
                    <Icon className="w-7 h-7 text-white" />
                    {/* Pulse Ring */}
                    {isActive && (
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} animate-ping opacity-30`}></div>
                    )}
                  </div>
                </div>

                {/* Empty Space */}
                <div className="w-5/12"></div>
              </div>

              {/* Mobile Content */}
              <div className="md:hidden pl-20">
                <div className={`${step.bgColor} ${step.borderColor} border rounded-xl p-4 transition-all duration-300 ${isActive ? 'shadow-lg' : ''}`}>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {isActive ? step.longDesc : step.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Decoration */}
      <div className="flex justify-center mt-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#27AE60] text-white rounded-full shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">That's it! Simple, fast, and hassle-free.</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
