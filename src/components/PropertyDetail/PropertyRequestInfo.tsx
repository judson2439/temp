import React, { useState } from 'react';
import { Send, Phone, Mail, User, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PropertyRequestInfoProps {
  propertyId: string;
  propertyTitle: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const PropertyRequestInfo: React.FC<PropertyRequestInfoProps> = ({ propertyId, propertyTitle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log({ name, email, phone, message, propertyId, propertyTitle });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const getFieldProgress = () => {
    let progress = 0;
    if (name.trim().length >= 2) progress += 25;
    if (validateEmail(email)) progress += 25;
    if (phone.trim().length >= 10) progress += 25;
    if (message.trim().length >= 10) progress += 25;
    return progress;
  };

  const progress = getFieldProgress();

  if (submitted) {
    return (
      <section id="request-info" className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#27AE60] to-[#2ecc71] h-2" />
        <div className="p-8 md:p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-[#27AE60]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in <span className="font-medium text-gray-900">{propertyTitle}</span>. 
              Our team will review your inquiry and get back to you within 24 hours.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-2">Confirmation sent to:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                  setTouched({});
                }}
                className="flex-1 px-6 py-3 bg-[#27AE60] text-white rounded-xl font-medium hover:bg-[#1E8449] transition-colors"
              >
                Send Another Message
              </button>
              <a
                href="tel:2523768366"
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="request-info" className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-[#1E8449] to-[#27AE60] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#27AE60]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Have Questions?</h2>
              <p className="text-sm text-gray-500">We typically respond within 2 hours</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500">Form completion</p>
            <p className="text-lg font-semibold text-[#27AE60]">{progress}%</p>
          </div>
        </div>
        
        {/* Property context */}
        <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#27AE60] rounded-full animate-pulse" />
            <p className="text-sm text-emerald-700">
              <span className="font-medium">Inquiry about:</span> {propertyTitle}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                touched.name && errors.name ? 'text-red-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full pl-12 pr-4 py-3.5 border rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white ${
                  touched.name && errors.name 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60]'
                }`}
                placeholder="John Doe"
              />
              {name.trim().length >= 2 && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27AE60]" />
              )}
            </div>
            {touched.name && errors.name && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                touched.email && errors.email ? 'text-red-400' : 'text-gray-400'
              }`} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-12 pr-4 py-3.5 border rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white ${
                  touched.email && errors.email 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60]'
                }`}
                placeholder="john@example.com"
              />
              {validateEmail(email) && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27AE60]" />
              )}
            </div>
            {touched.email && errors.email && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="(555) 123-4567"
              />
              {phone.trim().length >= 10 && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#27AE60]" />
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">We'll only call if you request it</p>
          </div>
          
          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onBlur={() => handleBlur('message')}
                rows={4}
                className={`w-full px-4 py-3.5 border rounded-xl transition-all duration-200 resize-none bg-gray-50 focus:bg-white ${
                  touched.message && errors.message 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60]'
                }`}
                placeholder="I'm interested in learning more about this property. Could you tell me about..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {message.length}/500
              </div>
            </div>
            {touched.message && errors.message && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Quick Questions */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick questions to include:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Is this property still available?',
                'What are the financing terms?',
                'Can I schedule a visit?',
                'What are the property taxes?',
              ].map((question, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(prev => prev ? `${prev}\n\n${question}` : question)}
                  className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-[#27AE60] hover:text-[#27AE60] transition-colors"
                >
                  + {question}
                </button>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#1E8449] to-[#27AE60] text-white py-4 rounded-xl text-lg font-semibold hover:from-[#196F3D] hover:to-[#1E8449] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#27AE60]/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
          
          {/* Alternative Contact */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or contact us directly</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <a 
              href="tel:2523768366" 
              className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <Phone className="w-5 h-5 text-[#27AE60]" />
              (252) 376-8366
            </a>
            <a 
              href="mailto:info@summitlandusa.com" 
              className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <Mail className="w-5 h-5 text-[#27AE60]" />
              Email Us
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#27AE60]" />
              No spam, ever
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#27AE60]" />
              Response within 24h
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#27AE60]" />
              100% confidential
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
