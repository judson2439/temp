import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: 'John & Mary Thompson',
      location: 'Maine',
      text: 'Summit Land made selling our 50-acre property so easy. We got an offer in minutes and closed in just 10 days. The team was professional and kept us informed every step of the way. Highly recommend!',
      rating: 5,
      image: 'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766532140617_ca95402e.jpg',
    },
    {
      name: 'Robert Martinez',
      location: 'Texas',
      text: 'Professional, honest, and fast. They handled everything from start to finish. Best land buying experience we\'ve had. The process was transparent and the team was always available to answer questions.',
      rating: 5,
      image: 'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766532154668_a6c7c7a4.jpg',
    },
    {
      name: 'Sarah Johnson',
      location: 'Florida',
      text: 'The instant offer feature is amazing! Got a fair price for our land without any hassle or hidden fees. The closing process was smooth and the payment was received exactly as promised.',
      rating: 5,
      image: 'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766532173810_525e9710.png',
    },
    {
      name: 'Michael Chen',
      location: 'Oklahoma',
      text: 'As a buyer, I found the perfect property through Summit Land. The financing calculator helped me plan everything out. Their customer service is top-notch and they made the entire process stress-free.',
      rating: 5,
      image: 'https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766532197336_acdac28d.png',
    },
  ];


  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#e8f8ef]/50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-[#d5f5e3]/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#d5f5e3]/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d5f5e3] rounded-full mb-6">
            <span className="w-2 h-2 bg-[#27AE60] rounded-full"></span>
            <span className="text-sm font-semibold text-[#1E8449]">Testimonials</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0d3d22] mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real landowners who trusted us with their property
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in-up animation-delay-200">
          <div className="relative bg-white rounded-3xl shadow-soft-xl p-8 lg:p-12 border border-[#d5f5e3]">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#27AE60] to-[#1E8449] rounded-xl flex items-center justify-center shadow-green">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-8 pt-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full blur opacity-30"></div>
                  <img 
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Stars */}
                <div className="flex justify-center lg:justify-start gap-1 mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonials[activeIndex].text}"
                </p>
                
                <div>
                  <p className="font-bold text-[#0d3d22] text-lg">{testimonials[activeIndex].name}</p>
                  <p className="text-[#27AE60]">{testimonials[activeIndex].location}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center lg:justify-end gap-3 mt-8">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 bg-[#e8f8ef] hover:bg-[#d5f5e3] rounded-full flex items-center justify-center transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 text-[#27AE60] group-hover:text-[#1E8449]" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 bg-[#27AE60] hover:bg-[#1E8449] rounded-full flex items-center justify-center transition-colors group"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex 
                      ? 'w-8 bg-[#27AE60]' 
                      : 'bg-[#d5f5e3] hover:bg-[#82e0aa]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-500 hover-lift border border-[#d5f5e3]/50 cursor-pointer animate-fade-in-up ${
                idx === activeIndex ? 'ring-2 ring-[#27AE60] ring-offset-2' : ''
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => setActiveIndex(idx)}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-[#0d3d22] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-[#27AE60]">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
