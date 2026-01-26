import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, CheckCircle, ArrowRight, Sparkles, MapPin, FileCheck } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setErrors({ email: 'This email is already registered. Please sign in instead.' });
        } else {
          setErrors({ submit: authError.message });
        }
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setErrors({ submit: 'Failed to create account. Please try again.' });
        setIsLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Log the new user registration to activity_logs
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const { error: activityLogError } = await supabase
        .from('activity_logs')
        .insert({
          full_name: fullName,
          action_name: 'New user registered',
          action_type: 'user',
        });

      if (activityLogError) {
        console.error('Activity log error:', activityLogError);
      }


      setSuccessMessage(
        'Account created successfully! Please check your email to confirm your account before signing in.'
      );

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });

      setTimeout(() => {
        navigate('/login', { state: { registered: true, email: formData.email } });
      }, 3000);

    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-[#27AE60]' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#27AE60]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#2ECC71]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#27AE60]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 animate-fade-in">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-[#27AE60] mb-6 animate-bounce-slow" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Summit Land USA</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create your account and unlock access to premium land listings, exclusive deals, and expert guidance.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-10">
                {[
                  { icon: MapPin, title: 'Exclusive Listings', desc: 'Access properties before they hit the market' },
                  { icon: FileCheck, title: 'Verified Properties', desc: 'All listings are thoroughly vetted' },
                  { icon: Shield, title: 'Secure Transactions', desc: 'Protected payments and documentation' },
                  { icon: CheckCircle, title: 'Expert Support', desc: '24/7 assistance from land specialists' },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white/80 transition-all duration-300 animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#27AE60] to-[#2ECC71] flex items-center justify-center shadow-lg shadow-[#27AE60]/20 flex-shrink-0">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-br from-[#27AE60] to-[#2ECC71] rounded-2xl p-6 text-white shadow-xl shadow-[#27AE60]/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/90 italic mb-4">
                  "Summit Land USA made buying my first property incredibly easy. The team was supportive throughout the entire process!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-white/70">First-time Land Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:col-span-3 w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Header - Mobile Only */}
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join Summit Land USA today</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-[#27AE60]/30 rounded-xl p-5 animate-scale-in shadow-lg">
                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-full bg-[#27AE60] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#1e8449] font-semibold text-lg">Registration Successful!</p>
                    <p className="text-[#27AE60] mt-1">{successMessage}</p>
                    <p className="text-[#27AE60] text-sm mt-2 flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Redirecting to login page...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General Error Message */}
            {errors.submit && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 animate-scale-in shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Registration Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#27AE60]/10 p-8 border border-white/50 relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#27AE60]/10 to-[#2ECC71]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-[#2ECC71]/10 to-[#27AE60]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="text-center mb-8 hidden lg:block">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                  <p className="text-gray-500">Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[#27AE60]" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="John"
                        disabled={isLoading || !!successMessage}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="group">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[#27AE60]" />
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Doe"
                        disabled={isLoading || !!successMessage}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-[#27AE60]" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="john@example.com"
                      disabled={isLoading || !!successMessage}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-[#27AE60]" />
                      Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 border-gray-200"
                      placeholder="(555) 123-4567"
                      disabled={isLoading || !!successMessage}
                    />
                  </div>

                  {/* Password */}
                  <div className="group">
                    <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-[#27AE60]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className={`py-3 pr-12 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="At least 8 characters"
                        disabled={isLoading || !!successMessage}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 animate-fade-in">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${passwordStrength.strength}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength.label === 'Weak' ? 'text-red-500' :
                            passwordStrength.label === 'Medium' ? 'text-yellow-500' : 'text-[#27AE60]'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-[#27AE60]" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`py-3 pr-12 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Confirm your password"
                        disabled={isLoading || !!successMessage}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-[#27AE60] text-sm mt-1 flex items-center gap-1 animate-fade-in">
                        <CheckCircle className="w-4 h-4" />
                        Passwords match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }));
                        if (errors.agreeToTerms) {
                          setErrors(prev => ({ ...prev, agreeToTerms: '' }));
                        }
                      }}
                      className="mt-0.5 border-2 border-gray-300 data-[state=checked]:bg-[#27AE60] data-[state=checked]:border-[#27AE60]"
                      disabled={isLoading || !!successMessage}
                    />
                    <div>
                      <Label htmlFor="agreeToTerms" className="text-gray-600 text-sm cursor-pointer leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" className="text-[#27AE60] hover:text-[#1e8449] font-medium hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-[#27AE60] hover:text-[#1e8449] font-medium hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.agreeToTerms}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !!successMessage}
                    className="w-full bg-gradient-to-r from-[#27AE60] to-[#2ECC71] hover:from-[#1e8449] hover:to-[#27AE60] text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#27AE60]/30 hover:shadow-xl hover:shadow-[#27AE60]/40 hover:-translate-y-0.5 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </div>
                    ) : successMessage ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Account Created!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>

                {/* Login Link */}
                <Link 
                  to="/login" 
                  className="block w-full text-center py-3 px-4 border-2 border-[#27AE60]/30 text-[#27AE60] font-semibold rounded-xl hover:bg-[#27AE60]/5 hover:border-[#27AE60]/50 transition-all duration-300"
                >
                  Sign In Instead
                </Link>
              </div>
            </div>

            {/* Email Confirmation Info */}
            <div className="mt-6 p-4 bg-[#27AE60]/5 backdrop-blur-sm border border-[#27AE60]/20 rounded-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#27AE60]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#27AE60]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Verification Required</p>
                  <p className="text-sm text-gray-600 mt-1">
                    After registration, you'll receive a confirmation email. Please click the link to verify your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100">
                <Shield className="w-4 h-4 text-[#27AE60]" />
                <span>Your data is protected with enterprise-grade security</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
