import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  Users, 
  Handshake,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  Phone,
  Mail
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We believe in honest, transparent dealings. What we say is what we do, every single time.',
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Building lasting relationships through reliability and consistent, fair practices.',
    },
    {
      icon: Users,
      title: 'Family Values',
      description: 'As a family-run business, we treat every client like family with care and respect.',
    },
    {
      icon: Handshake,
      title: 'Commitment',
      description: 'We are committed to making land transactions simple, fast, and stress-free.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Properties Purchased', icon: MapPin },
    { number: '$50M+', label: 'Total Transactions', icon: DollarSign },
    { number: '7-14', label: 'Days to Close', icon: Clock },
    { number: '98%', label: 'Customer Satisfaction', icon: Award },
  ];

  const milestones = [
    { year: '2018', title: 'Company Founded', description: 'Summit Land USA was established with a mission to simplify land transactions.' },
    { year: '2019', title: 'First 100 Deals', description: 'Reached our first milestone of 100 successful land purchases.' },
    { year: '2021', title: 'Nationwide Expansion', description: 'Expanded operations to cover all 50 states across America.' },
    { year: '2023', title: 'Digital Platform Launch', description: 'Launched our instant offer platform for faster, easier transactions.' },
    { year: '2024', title: '500+ Properties', description: 'Celebrated purchasing over 500 properties from satisfied landowners.' },
  ];

  return (
    <main className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-[#013d22] via-[#105A32] to-[#108449]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766605601873_5caca2fa.png"
            alt="American Landscape"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d22]/95 via-[#145A32]/85 to-[#1E8449]/70"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#27AE60]/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#2ECC71]/10 rounded-full blur-3xl animate-float"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-[#2ECC71] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-[#d5f5e3]">About Summit Land USA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Your Trusted Partner in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#82e0aa] via-[#d5f5e3] to-white">
                Land Transactions
              </span>
            </h1>
            
            <p className="text-xl text-[#d5f5e3]/90 leading-relaxed mb-8">
              We're a family-owned business dedicated to making land buying and selling 
              simple, fast, and fair. With hundreds of successful transactions, we've 
              built our reputation on trust, integrity, and exceptional service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sell">
                <Button 
                  size="lg" 
                  className="group bg-white text-[#145A32] hover:bg-[#e8f8ef] font-semibold px-8 py-6 text-lg rounded-xl shadow-green-lg hover:shadow-green transition-all duration-300"
                >
                  Get Your Offer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-[#d5f5e3]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="w-14 h-14 bg-[#e8f8ef] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-[#27AE60]" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-[#0d3d22] mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#e8f8ef]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
                <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
                <span className="text-sm font-semibold text-[#1E8449]">Our Story</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
                Built on Trust,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]"> Driven by Values</span>
              </h2>
              
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Summit Land USA was founded with a simple yet powerful mission: to transform 
                  the land buying and selling experience. We saw too many landowners struggling 
                  with complicated processes, hidden fees, and unreliable buyers.
                </p>
                <p>
                  As a family-run business, we bring personal attention and genuine care to 
                  every transaction. We understand that your land represents more than just 
                  property—it's often tied to memories, dreams, and hard work.
                </p>
                <p>
                  That's why we've built a process that's transparent, fast, and fair. 
                  No hidden fees, no complicated paperwork, no endless waiting. Just honest 
                  dealings and cash offers you can count on.
                </p>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#27AE60]/20 to-[#2ECC71]/20 rounded-3xl blur-2xl"></div>
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1768234294117_3eb3fddb.png"
                alt="Summit Land USA Team"
                className="relative rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-[#0d3d22] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#27AE60]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2ECC71]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-[#27AE60] to-[#1E8449] rounded-2xl flex items-center justify-center mb-6 shadow-green">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-[#d5f5e3]/80 text-lg leading-relaxed">
                To provide landowners with the fastest, fairest, and most hassle-free way 
                to sell their property. We strive to make every transaction transparent, 
                efficient, and beneficial for all parties involved.
              </p>
            </div>
            
            {/* Vision */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 animate-fade-in-up animation-delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center mb-6 shadow-green">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-[#d5f5e3]/80 text-lg leading-relaxed">
                To become America's most trusted land buying company, known for our 
                integrity, speed, and commitment to customer satisfaction. We envision 
                a future where selling land is as simple as it should be.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#e8f8ef]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d5f5e3]/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
              <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
              <span className="text-sm font-semibold text-[#1E8449]">What We Stand For</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and how we treat our clients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="group bg-white p-8 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all duration-500 hover-lift border border-[#d5f5e3]/50 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#e8f8ef] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#27AE60] to-[#1E8449] rounded-lg flex items-center justify-center shadow-green">
                    <value.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0d3d22] mb-3 group-hover:text-[#1E8449] transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#27AE60] to-[#2ECC71] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
              <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
              <span className="text-sm font-semibold text-[#1E8449]">Our Journey</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
              Company <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Milestones</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A look at our growth and achievements over the years
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#27AE60] to-[#2ECC71] hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col lg:flex-row items-center gap-8 animate-fade-in-up ${
                    idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`bg-white p-8 rounded-2xl shadow-soft border border-[#d5f5e3]/50 ${
                      idx % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                    }`}>
                      <span className="text-[#27AE60] font-bold text-lg">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-[#0d3d22] mt-2 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-[#27AE60] to-[#1E8449] rounded-full flex items-center justify-center shadow-green">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-b from-[#e8f8ef]/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
              <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
              <span className="text-sm font-semibold text-[#1E8449]">Why Summit Land USA</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
              What Sets Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Apart</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Lightning Fast Process',
                description: 'Get an instant offer in minutes and close in as little as 7 days. No waiting, no uncertainty.',
              },
              {
                icon: CheckCircle,
                title: 'No Hidden Fees',
                description: 'We pay all closing costs. The offer you receive is the amount you get—guaranteed.',
              },
              {
                icon: Shield,
                title: 'Secure & Professional',
                description: 'Licensed title companies handle all transactions with secure document processing.',
              },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="text-center p-8 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-20 h-20 bg-[#e8f8ef] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#27AE60] to-[#1E8449] rounded-xl flex items-center justify-center shadow-green">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#0d3d22] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0d3d22] via-[#145A32] to-[#1E8449] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#27AE60]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2ECC71]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Sell Your Land?
            </h2>
            <p className="text-xl text-[#d5f5e3]/90 mb-10 max-w-2xl mx-auto">
              Join hundreds of satisfied landowners who chose Summit Land USA. 
              Get your instant cash offer today—no obligations, no fees.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/sell">
                <Button 
                  size="lg" 
                  className="group bg-white text-[#145A32] hover:bg-[#e8f8ef] font-semibold px-10 py-6 text-lg rounded-xl shadow-green-lg hover:shadow-green transition-all duration-300"
                >
                  Get Instant Offer
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/buy">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-10 py-6 text-lg rounded-xl transition-all duration-300"
                >
                  Browse Properties
                </Button>
              </Link>
            </div>
            
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[#d5f5e3]">
              <a href="tel:+12523768366" className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="font-medium">(252) 376-8366</span>
              </a>
              <a href="mailto:info@summitlandusa.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">info@summitlandusa.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
