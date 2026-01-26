import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;
  const registeredEmail = location.state?.email;
  const from = location.state?.from || '/dashboard';

  const [formData, setFormData] = useState({
    email: registeredEmail || '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(justRegistered);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in and redirect
  useEffect(() => {
    // Check for admin session first
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const parsedAdminSession = JSON.parse(adminSession);
        if (parsedAdminSession && parsedAdminSession.isAdmin) {
          navigate('/admin', { replace: true });
          return;
        }
      } catch (e) {
        localStorage.removeItem('adminSession');
      }
    }
    
    // Check for regular session
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession && parsedSession.user) {
          // Check if user is admin
          if (parsedSession.user.role === 'admin' || parsedSession.isAdmin) {
            navigate('/admin', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (e) {
        localStorage.removeItem('session');
      }
    }
  }, [navigate]);





  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    // Check for admin credentials
    const ADMIN_EMAIL = 'admin@test.com';
    const ADMIN_PASSWORD = '123qwe!@#QWE';
    
    if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
      const adminSession = {
        user: {
          id: 'admin-001',
          email: ADMIN_EMAIL,
          role: 'admin',
        },
        isAdmin: true,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
      setIsLoading(false);
      navigate('/admin', { replace: true });
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: 'Invalid email or password. Please try again.' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ submit: 'Please confirm your email address before signing in. Check your inbox for the confirmation link.' });
        } else {
          setErrors({ submit: error.message });
        }
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        // Fetch user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', data.user.id)
          .single();

        const userRole = profile?.role || 'buyer';
        
        // Check if user is admin - redirect to admin panel
        if (userRole === 'admin') {
          const adminSession = {
            user: {
              id: data.user.id,
              email: data.user.email,
              role: 'admin',
              first_name: profile?.first_name || '',
              last_name: profile?.last_name || '',
            },
            isAdmin: true,
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
            loginTime: new Date().toISOString(),
          };
          localStorage.setItem('adminSession', JSON.stringify(adminSession));
          localStorage.setItem('session', JSON.stringify(adminSession));
          localStorage.setItem('userRole', 'admin');
          setIsLoading(false);
          navigate('/admin', { replace: true });
          return;
        }
        
        const sessionData = {
          user: {
            id: data.user.id,
            email: data.user.email,
            created_at: data.user.created_at,
            role: userRole,
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
          },
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        };
        localStorage.setItem('session', JSON.stringify(sessionData));
        localStorage.setItem('userRole', userRole);

        // Redirect to dashboard or original destination
        navigate(from, { replace: true });
      }


    } catch (error: any) {
      console.error('Login error:', error);
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
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-12 flex items-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#27AE60]/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#2ECC71]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#27AE60]/10 to-[#2ECC71]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block animate-fade-in">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#27AE60]/20 rounded-full blur-xl animate-pulse" />
              <Sparkles className="w-12 h-12 text-[#27AE60] mb-6 animate-bounce-slow" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">Summit Land USA</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your trusted partner in land investment. Access exclusive properties, manage your portfolio, and discover new opportunities.
              </p>
              
              {/* Feature List */}
              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Secure & encrypted transactions' },
                  { icon: Mail, text: 'Instant property notifications' },
                  { icon: Lock, text: 'Protected account access' },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 text-gray-600 animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#27AE60] to-[#2ECC71] flex items-center justify-center shadow-lg shadow-[#27AE60]/20">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Image */}
              <div className="mt-10 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-green-50 to-transparent z-10" />
                <img 
                  src="https://d64gsuwffb70l.cloudfront.net/69483c9b42a6f2b1970bd1b5_1767366502014_e22dd649.jpg" 
                  alt="Land Investment"
                  className="rounded-2xl shadow-2xl shadow-[#27AE60]/10 w-full h-48 object-cover"
                />

              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {showSuccess && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-[#27AE60]/30 rounded-xl p-4 flex items-start gap-3 animate-scale-in shadow-lg">
                <div className="w-8 h-8 rounded-full bg-[#27AE60] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[#1e8449] font-semibold">Account created successfully!</p>
                  <p className="text-[#27AE60] text-sm mt-1">Please check your email to confirm your account.</p>
                </div>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="text-[#27AE60] hover:text-[#1e8449] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}


            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-scale-in shadow-lg">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-800">{errors.submit}</p>
                </div>
                <button 
                  onClick={() => setErrors(prev => ({ ...prev, submit: '' }))}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Header - Mobile Only */}
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#27AE60]/10 p-8 border border-white/50 relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#27AE60]/10 to-[#2ECC71]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="text-center mb-8 hidden lg:block">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                  <p className="text-gray-500">Access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="group">
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-[#27AE60]" />
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-4 pr-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="john@example.com"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#27AE60]" />
                        Password
                      </Label>
                      <Link to="/forgot-password" className="text-sm text-[#27AE60] hover:text-[#1e8449] font-medium transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-4 pr-12 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-50/50 focus:bg-white focus:border-[#27AE60] focus:ring-4 focus:ring-[#27AE60]/10 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="Enter your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fade-in">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }));
                      }}
                      disabled={isLoading}
                      className="border-2 border-gray-300 data-[state=checked]:bg-[#27AE60] data-[state=checked]:border-[#27AE60]"
                    />
                    <Label htmlFor="rememberMe" className="text-gray-600 text-sm cursor-pointer">
                      Remember me for 30 days
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#27AE60] to-[#2ECC71] hover:from-[#1e8449] hover:to-[#27AE60] text-white py-6 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#27AE60]/30 hover:shadow-xl hover:shadow-[#27AE60]/40 hover:-translate-y-0.5 group"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing In...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In
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
                    <span className="px-4 bg-white text-gray-500">New to Summit Land?</span>
                  </div>
                </div>

                {/* Register Link */}
                <Link 
                  to="/register" 
                  className="block w-full text-center py-3 px-4 border-2 border-[#27AE60]/30 text-[#27AE60] font-semibold rounded-xl hover:bg-[#27AE60]/5 hover:border-[#27AE60]/50 transition-all duration-300"
                >
                  Create an Account
                </Link>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100">
                <Shield className="w-4 h-4 text-[#27AE60]" />
                <span>Secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
