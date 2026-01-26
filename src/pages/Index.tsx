import React from 'react';
import {
  HeroSection,
  HowItWorks,
  FeaturesSection,
  StatsSection,
  Testimonials,
  CTASection,
} from '@/components/Landing';
import { Footer } from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <main className="pt-20 overflow-hidden">
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </main>
  );
};

export default Index;
