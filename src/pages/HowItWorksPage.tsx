import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  HowItWorksHero,
  HowItWorksSteps,
  HowItWorksCTA,
} from '@/components/HowItWorks';
import { MessageCircle, HelpCircle, FileQuestion, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How quickly can I get an offer?',
    answer: 'We typically provide cash offers within 24-48 hours of receiving your property information. In some cases, we can provide same-day offers for straightforward properties.',
  },
  {
    question: 'Are there any fees or commissions?',
    answer: 'No! We charge zero fees and zero commissions. We also cover all closing costs. The offer you accept is the amount you receive.',
  },
  {
    question: 'What types of land do you buy?',
    answer: 'We buy all types of land including vacant lots, rural acreage, farmland, timberland, recreational land, and more. We purchase land in any condition.',
  },
  {
    question: 'How long does the closing process take?',
    answer: 'Once you accept our offer, we can typically close in 7-14 days. However, we can work with your timeline if you need more time.',
  },
  {
    question: 'Do I need to clean up or prepare my land?',
    answer: 'No preparation is needed. We buy land as-is, regardless of condition. You don\'t need to clear brush, remove debris, or make any improvements.',
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'How It Works | Summit Land USA';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HowItWorksHero />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <HowItWorksSteps />
        
        {/* FAQ Section */}
        <div className="mt-20 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#27AE60]/10 rounded-full mb-4">
              <HelpCircle className="w-4 h-4 text-[#27AE60]" />
              <span className="text-sm font-semibold text-[#27AE60]">Common Questions</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ecc71]">
                Questions
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to the most common questions about selling your land.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === index 
                    ? 'border-[#27AE60]/30 shadow-lg shadow-[#27AE60]/10' 
                    : 'border-gray-200 hover:border-[#27AE60]/30 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      openFaq === index ? 'bg-[#27AE60] text-white' : 'bg-[#27AE60]/10 text-[#27AE60]'
                    }`}>
                      <FileQuestion className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'max-h-48' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-6 pl-20">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Questions CTA */}
          <div className="text-center mt-8">
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#27AE60]/10 text-[#27AE60] rounded-xl font-semibold hover:bg-[#27AE60]/20 transition-colors group"
            >
              <MessageCircle className="w-5 h-5" />
              Have more questions? Contact us
            </a>
          </div>
        </div>

        <HowItWorksCTA />
      </div>
    </div>
  );
}
