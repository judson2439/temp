import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, ChevronDown, ChevronUp, Users, Shield, Award } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VtbWl0bGFuZHVzYTEyMyIsImEiOiJjbWpuNmlsNTgxeXpsM2ZvbG12aXFlZnV3In0.mB7UKT_Qtl60Hv2v_koK3g';


export default function Contact() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mapbox refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);


  // Surfside, FL coordinates
  const SURFSIDE_COORDS: [number, number] = [-80.1256, 25.8784];

  useEffect(() => {
    document.title = 'Contact Us | Summit Land USA';
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Clean up any existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create new map instance
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: SURFSIDE_COORDS,
      zoom: 15,
      attributionControl: true,
    });


    mapRef.current = mapInstance;

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load before adding marker
    mapInstance.on('load', () => {
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #27AE60 0%, #1E8449 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
          border: 3px solid white;
          cursor: pointer;
        ">
          <svg style="transform: rotate(45deg); width: 24px; height: 24px;" fill="none" stroke="white" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; color: #1E8449; margin-bottom: 4px; font-size: 14px;">Summit Land USA</h3>
            <p style="font-size: 13px; color: #666; margin: 0;">Surfside, FL 33154</p>
            <p style="font-size: 13px; color: #666; margin: 0;">United States</p>
          </div>
        `);

      // Add marker to the map
      new mapboxgl.Marker(markerEl)
        .setLngLat(SURFSIDE_COORDS)
        .setPopup(popup)
        .addTo(mapInstance);
    });

    // Resize map when container becomes visible
    mapInstance.on('idle', () => {
      mapInstance.resize();
    });


    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);





  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log({ ...formData, propertyId });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactMethods = [
    { icon: Phone, title: 'Call Us', description: 'Speak directly with our team', value: '(252) 376-8366', action: 'tel:+12523768366', color: 'from-[#27AE60] to-[#1E8449]' },
    { icon: Mail, title: 'Email Us', description: 'Get a response within 24 hours', value: 'info@summitlandusa.com', action: 'mailto:info@summitlandusa.com', color: 'from-[#2ECC71] to-[#27AE60]' },
    { icon: MessageCircle, title: 'Live Chat', description: 'Chat with us in real-time', value: 'Available 9am-6pm EST', action: '#chat', color: 'from-purple-500 to-purple-600' },
    { icon: MapPin, title: 'Our Location', description: 'Our main office location', value: 'Surfside, FL', action: '#location', color: 'from-orange-500 to-orange-600' }
  ];

  const faqs = [
    { question: 'How quickly will I receive a response?', answer: 'We typically respond to all inquiries within 24 hours during business days.' },
    { question: 'What information should I include in my message?', answer: 'Please include details about your land (location, size, APN if known) and your goals.' },
    { question: 'Do you charge for consultations?', answer: 'No! All consultations and property evaluations are completely free with no obligation.' },
    { question: 'What areas do you serve?', answer: 'We purchase land throughout the United States, with a focus on Texas, Florida, Arizona, Colorado, and North Carolina.' },
    { question: 'Can I schedule a call at a specific time?', answer: 'Absolutely! Use our contact form and mention your preferred time in the message.' }
  ];

  const stats = [
    { icon: Users, value: '2,500+', label: 'Happy Sellers' },
    { icon: Clock, value: '< 24hrs', label: 'Response Time' },
    { icon: Shield, value: '100%', label: 'Satisfaction' },
    { icon: Award, value: 'A+', label: 'BBB Rating' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#0d3d22] via-[#145A32] to-[#1E8449] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2ECC71] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <MessageCircle className="w-4 h-4 text-[#2ECC71]" />
                  <span className="text-sm font-medium">We're Here to Help</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Get in Touch
                  <span className="block text-[#2ECC71]">With Our Team</span>
                </h1>
                
                <p className="text-xl text-[#82e0aa] mb-8 leading-relaxed">
                  Have questions about selling your land? Our friendly team of experts is ready to help you every step of the way.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <stat.icon className="w-6 h-6 text-[#2ECC71] mx-auto mb-2" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-[#82e0aa]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-[#145A32] via-transparent to-transparent z-10" />
                <img src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1766472970457_cc4bec9e.png" alt="Our friendly support team" className="rounded-2xl shadow-2xl w-full h-[400px] object-cover" />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d5f5e3] rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#27AE60]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Business Hours</div>
                      <div className="text-sm text-gray-500">Mon-Fri: 9am-6pm EST</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose How to Reach Us</h2>
              <p className="text-lg text-gray-600">Multiple ways to connect with our team</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <a key={index} href={method.action} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{method.description}</p>
                  <p className="font-medium text-[#1E8449] group-hover:text-[#27AE60] transition-colors">{method.value}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Form Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you shortly.</p>
                
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-[#d5f5e3] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <CheckCircle className="w-10 h-10 text-[#27AE60]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">Thank you for reaching out. We'll respond within 24 hours.</p>
                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '', preferredContact: 'email' }); }} className="text-[#27AE60] font-medium hover:text-[#1E8449] transition-colors">Send another message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {propertyId && (
                      <div className="bg-[#e8f8ef] border border-[#82e0aa] rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#d5f5e3] rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#27AE60]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1E8449]">Property Inquiry</p>
                          <p className="text-sm text-[#27AE60]">Property ID: {propertyId}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all" placeholder="John Doe" required />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all" placeholder="john@example.com" required />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all" placeholder="(555) 123-4567" />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                        <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all bg-white" required>
                          <option value="">Select a subject</option>
                          <option value="sell">I want to sell my land</option>
                          <option value="buy">I'm interested in buying land</option>
                          <option value="question">General question</option>
                          <option value="partnership">Partnership inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all resize-none" placeholder="Tell us about your land or how we can help you..." required />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Contact Method</label>
                      <div className="flex gap-4 justify-center sm:justify-start">
                        {['email', 'phone'].map((method) => (
                          <label key={method} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${formData.preferredContact === method ? 'border-[#27AE60] bg-[#e8f8ef] text-[#1E8449]' : 'border-gray-300 hover:border-gray-400'}`}>
                            <input type="radio" name="preferredContact" value={method} checked={formData.preferredContact === method} onChange={handleInputChange} className="sr-only" />
                            {method === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                            <span className="capitalize font-medium">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#27AE60] hover:bg-[#1E8449] text-white py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isSubmitting ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</>) : (<><Send className="w-5 h-5" />Send Message</>)}
                    </button>
                  </form>
                )}
              </div>
              
              {/* FAQ Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                <p className="text-gray-600 mb-8">Quick answers to common questions</p>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className={`bg-white rounded-xl border transition-all duration-300 ${openFaq === index ? 'border-[#82e0aa] shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
                      <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-[#d5f5e3] text-[#27AE60]' : 'bg-gray-100 text-gray-500'}`}>
                          {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-48' : 'max-h-0'}`}>
                        <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-br from-[#0d3d22] to-[#145A32] rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
                  <p className="text-[#82e0aa] mb-4">Our team is always happy to help. Give us a call or start a live chat.</p>
                  <div className="flex flex-wrap gap-3">
                    <a href="tel:+12523768366" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"><Phone className="w-4 h-4" />Call Now</a>
                    <button onClick={() => alert('Live chat feature coming soon!')} className="inline-flex items-center gap-2 bg-[#27AE60] hover:bg-[#2ECC71] px-4 py-2 rounded-lg transition-colors"><MessageCircle className="w-4 h-4" />Start Chat</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Office</h2>
              <p className="text-lg text-gray-600">Visit us or send mail to our headquarters</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid lg:grid-cols-2">
                {/* Mapbox Map Container */}
                <div className="relative min-h-[320px] lg:min-h-[450px]">
                  <div 
                    ref={mapContainerRef} 
                    className="absolute inset-0 w-full h-full"
                  />
                  {/* Open in Google Maps link overlay */}
                  <a 
                    href="https://maps.google.com/?q=Surfside,FL+33154" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-[#27AE60] hover:text-[#1E8449] text-sm font-medium flex items-center gap-2 transition-colors z-10"
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </div>
                

                

                
                <div className="p-8 lg:p-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Summit Land USA Headquarters</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#d5f5e3] rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-[#27AE60]" /></div>
                      <div><h4 className="font-semibold text-gray-900 mb-1">Address</h4><p className="text-gray-600">Surfside, FL 33154<br />United States</p></div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#d5f5e3] rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-[#27AE60]" /></div>
                      <div><h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4><p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST<br />Saturday: 10:00 AM - 2:00 PM EST<br />Sunday: Closed</p></div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#d5f5e3] rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-[#27AE60]" /></div>
                      <div><h4 className="font-semibold text-gray-900 mb-1">Contact</h4><p className="text-gray-600">Phone: <a href="tel:+12523768366" className="text-[#27AE60] hover:underline">(252) 376-8366</a><br />Email: <a href="mailto:info@summitlandusa.com" className="text-[#27AE60] hover:underline">info@summitlandusa.com</a></p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
