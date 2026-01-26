import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Phone, Mail, MessageCircle, CheckCircle, Star, Users, Clock, Shield } from 'lucide-react';

export const HowItWorksCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="mt-20 space-y-16">
      {/* Trust Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Happy Sellers', value: '2,500+', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Star, label: 'Average Rating', value: '4.9/5', color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { icon: Clock, label: 'Avg. Close Time', value: '10 Days', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: Shield, label: 'BBB Accredited', value: 'A+ Rating', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, index) => (
          <div 
            key={index}
            className={`${stat.bg} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main CTA Card */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full"></div>
        
        <div className="relative grid lg:grid-cols-2 gap-12 p-8 lg:p-12">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Ready to Get Started?</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Get Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Cash Offer
              </span>{' '}
              Today
            </h2>
            
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              No obligation, no fees, no hassle. Just a fair price for your land delivered within 24-48 hours.
            </p>
            
            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {[
                'Free property evaluation',
                'No realtor commissions',
                'We pay all closing costs',
                'Close on your timeline',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-100">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/sell">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Start Your Offer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Content - Quick Contact Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
            <p className="text-blue-200 mb-6">Get in touch and we'll respond within 24 hours.</p>
            
            {isSubmitted ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Thank You!</h4>
                <p className="text-blue-200">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleQuickContact} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Mail className="w-5 h-5" />
                  Get Free Consultation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
            
            {/* Contact Options */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-blue-200 mb-4">Or reach us directly:</p>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="tel:+18005551234"
                  className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Call Us</span>
                </a>
                <a 
                  href="mailto:info@summitlandusa.com"
                  className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-blue-300 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Live Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <Link 
          to="/contact"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
        >
          View our FAQ
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
