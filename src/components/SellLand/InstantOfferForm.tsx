import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';
import { COUNTY_DATA } from '@/data/counties';
import { supabase } from '@/lib/supabase';
import { MapPin, Zap, Droplets, Home, AlertTriangle, FileText, CheckCircle2, ArrowRight, ArrowLeft, Loader2, DollarSign, TrendingUp, User, Mail, Phone, Route, PipetteIcon, ClipboardList, FlaskConical, MessageSquare, Hash } from 'lucide-react';



const US_STATES = Object.keys(COUNTY_DATA).sort();

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  state: string;
  county: string;
  zip: string;
  acreage: string;
  apn: string;
  gpsPin: string;
  accessType: string;
  powerAvailable: string;
  waterAvailable: string;
  sewerAvailable: string;
  floodRisk: string;
  notes: string;
  hasSurvey: string;
  hasPercTest: string;
}

interface ValuationResult {

  success: boolean;
  error?: string;
  propertyInfo?: {
    state: string;
    county: string;
    acreage: number;
    apn: string;
    coordinates: string;
  };
  valuation?: {
    estimatedValue: number;
    lowEstimate: number;
    highEstimate: number;
    pricePerAcre: number;
    confidence: string;
  };
  propertyCharacteristics?: {
    accessType: string;
    utilities: {
      power: boolean;
      water: boolean;
      sewer: boolean;
    };
    floodRisk: boolean;
    hasSurvey: boolean;
    hasPercTest: boolean;
  };
  marketData?: {
    averagePricePerAcre: number;
    stateMarketTrend: string;
    dataSource: string;
  };
}

// Custom styled input component
const StyledInput = ({ 
  name, 
  type = 'text',
  placeholder, 
  value, 
  onChange, 
  error,
  disabled,
  icon: Icon,
  required
}: { 
  name: string; 
  type?: string;
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string;
  disabled?: boolean;
  icon?: React.ElementType;
  required?: boolean;
}) => (
  <div className="relative">
    {Icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#27AE60]/60 pointer-events-none z-10">
        <Icon className="w-5 h-5" />
      </div>
    )}
    <Input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 h-auto bg-white dark:bg-slate-800 border-2 ${
        error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#27AE60]'
      } rounded-xl text-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#27AE60]/10 disabled:opacity-50 disabled:cursor-not-allowed ${
        disabled ? 'bg-slate-100 dark:bg-slate-900' : ''
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
  </div>
);

export const InstantOfferForm: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isContactPreFilled, setIsContactPreFilled] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);


  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    state: '',
    county: '',
    zip: '',
    acreage: '',
    apn: '',
    gpsPin: '',
    accessType: '',
    powerAvailable: '',
    waterAvailable: '',
    sewerAvailable: '',
    floodRisk: '',
    notes: '',
    hasSurvey: '',
    hasPercTest: '',
  });


  // Load user data from localStorage and Supabase on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const sessionStr = localStorage.getItem('session');
        if (!sessionStr) return;

        const session = JSON.parse(sessionStr);
        if (!session?.user?.id) return;

        // Set email from session immediately
        const userEmail = session.user.email || '';

        // Fetch profile data from Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone, email')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          // Even if profile fetch fails, we can still use the email from session
          if (userEmail) {
            setFormData(prev => ({
              ...prev,
              email: userEmail,
            }));
            setIsContactPreFilled(true);
          }
          return;
        }

        if (profile) {
          setFormData(prev => ({
            ...prev,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email || userEmail,
            phone: profile.phone || '',
          }));
          setIsContactPreFilled(true);
        }
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    // Reset county when state changes
    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, county: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Get available counties for the selected state
  const availableCounties = formData.state ? COUNTY_DATA[formData.state] || [] : [];
  const isCountySelectable = availableCounties.length > 0;

  // Convert states to SelectOption format
  const stateOptions: SelectOption[] = US_STATES.map(s => ({ value: s, label: s }));

  // Convert counties to SelectOption format
  const countyOptions: SelectOption[] = availableCounties.map(c => ({ value: c, label: c }));

  // Access type options
  const accessTypeOptions: SelectOption[] = [
    { value: 'paved', label: 'Paved Road' },
    { value: 'dirt', label: 'Dirt Road' },
    { value: 'easement', label: 'Easement' },
    { value: 'none', label: 'No Access' },
  ];

  // Yes/No options
  const yesNoOptions: SelectOption[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  // Survey status options
  const surveyOptions: SelectOption[] = [
    { value: 'yes', label: 'Yes, Current Survey' },
    { value: 'no', label: 'No, Survey Required' },
    { value: 'unknown', label: 'Unknown' },
  ];

  // Perc test options
  const percTestOptions: SelectOption[] = [
    { value: 'yes', label: 'Yes, Passed' },
    { value: 'no', label: 'No, Required' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.state) newErrors.state = 'State required';
    if (!formData.county) newErrors.county = 'County required';
    if (!formData.zip || !/^\d{5}(-\d{4})?$/.test(formData.zip.trim()))
      newErrors.zip = 'Valid ZIP code required (5 digits)';
    if (!formData.acreage || parseFloat(formData.acreage) <= 0)
      newErrors.acreage = 'Valid acreage required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const validateStep2 = (): boolean => {
    const requiredFields = [
      'accessType',
      'powerAvailable',
      'waterAvailable',
      'sewerAvailable',
      'floodRisk',
    ];
    const newErrors: Partial<FormData> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof FormData]) {
        newErrors[field as keyof FormData] = 'Required';
      }
    });

    // Validate contact info
    if (!formData.firstName) newErrors.firstName = 'First Name required.';
    if (!formData.lastName) newErrors.lastName = 'Last Name required.';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone: exactly 10 digits required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchPropertyValuation = async () => {
    try {
      setApiError(null);
      
      const { data, error } = await supabase.functions.invoke('attom-property-valuation', {
        body: {
          email: formData.email,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          state: formData.state,
          county: formData.county,
          zip: formData.zip,
          acreage: formData.acreage,
          apn: formData.apn,
          gpsPin: formData.gpsPin,
          accessType: formData.accessType,
          powerAvailable: formData.powerAvailable,
          waterAvailable: formData.waterAvailable,
          sewerAvailable: formData.sewerAvailable,
          floodRisk: formData.floodRisk,
          hasSurvey: formData.hasSurvey,
          hasPercTest: formData.hasPercTest,
          notes: formData.notes
        }
      });


      if (error) {
        console.error('Supabase function error:', error);
        setApiError('Failed to get property valuation. Please try again.');
        return null;
      }

      if (data && data.success) {
        return data as ValuationResult;
      } else {
        setApiError(data?.error || 'Failed to get property valuation.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching valuation:', err);
      setApiError('An unexpected error occurred. Please try again.');
      return null;
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      // Scroll to top of form when moving to step 2
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    if (step === 2) {
      if (!validateStep2()) return;
      setLoading(true);

      // Call ATTOM API for property valuation
      const result = await fetchPropertyValuation();
      
      setLoading(false);
      
      if (result) {
        setValuationResult(result);
        setShowResult(true);
        setStep(3);
        // Scroll to the very top of the page when showing results (especially important for mobile)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  };



  const resetForm = () => {
    setStep(1);
    setShowResult(false);
    setValuationResult(null);
    setApiError(null);
    if (isContactPreFilled) {
      setFormData(prev => ({
        ...prev,
        state: '',
        county: '',
        zip: '',
        acreage: '',
        apn: '',
        gpsPin: '',
        accessType: '',
        powerAvailable: '',
        waterAvailable: '',
        sewerAvailable: '',
        floodRisk: '',
        notes: '',
        hasSurvey: '',
        hasPercTest: '',
      }));
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        state: '',
        county: '',
        zip: '',
        acreage: '',
        apn: '',
        gpsPin: '',
        accessType: '',
        powerAvailable: '',
        waterAvailable: '',
        sewerAvailable: '',
        floodRisk: '',
        notes: '',
        hasSurvey: '',
        hasPercTest: '',
      });
    }

    // Scroll to the top of the form section after resetting
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleViewOfferStatus = () => {
    navigate('/register');
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section ref={formRef} className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-[#e8f8ef]/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header - Hidden on Valuation Complete step */}
        {step !== 3 && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#27AE60]/10 text-[#27AE60] dark:text-[#2ECC71] px-4 py-2 rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              <span>Free Property Valuation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Get Your <span className="text-gradient-green">Instant Cash Offer</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Fill out the form below and receive a competitive offer for your land within minutes.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

          {/* Progress Steps */}
          {step <= 2 && (
            <div className="bg-slate-50 dark:bg-slate-900 px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Step {step} of 2</span>
                <span className="text-sm font-medium text-[#27AE60] dark:text-[#2ECC71]">{step === 1 ? 'Property Location' : 'Property Details'}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                      s <= step 
                        ? 'bg-gradient-to-r from-[#1E8449] to-[#27AE60]' 
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {step === 3 && showResult && valuationResult ? (
              <div className="text-center">
                {/* Valuation Header */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d5f5e3] dark:bg-[#27AE60]/30 rounded-full mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#27AE60] dark:text-[#2ECC71]" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Valuation Complete!</h3>
                  <p className="text-muted-foreground">Here's your property estimate</p>
                </div>

                {/* Main Valuation Display */}
                <div className="bg-gradient-to-r from-[#1E8449] via-[#27AE60] to-[#2ECC71] text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg shadow-[#27AE60]/20">
                  <p className="text-sm uppercase tracking-wider opacity-80 mb-2 font-medium">Estimated Value Range</p>
                  <p className="text-3xl md:text-4xl font-bold mb-3">
                    {formatCurrency(valuationResult.valuation?.lowEstimate || 0)} - {formatCurrency(valuationResult.valuation?.highEstimate || 0)}
                  </p>
                  <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-3" />
                  <p className="text-lg opacity-90">
                    Best Estimate: <span className="font-bold text-xl">{formatCurrency(valuationResult.valuation?.estimatedValue || 0)}</span>
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      valuationResult.valuation?.confidence === 'High' 
                        ? 'bg-green-500/90' 
                        : valuationResult.valuation?.confidence === 'Medium'
                        ? 'bg-yellow-500/90'
                        : 'bg-orange-500/90'
                    }`}>
                      {valuationResult.valuation?.confidence} Confidence
                    </span>
                  </div>
                </div>

                {/* Property Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-left border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[#27AE60]" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {valuationResult.propertyInfo?.county}, {valuationResult.propertyInfo?.state}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-left border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4 text-[#27AE60]" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acreage</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {valuationResult.propertyInfo?.acreage} acres
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-left border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-[#27AE60]" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Price/Acre</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(valuationResult.valuation?.pricePerAcre || 0)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-left border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-[#27AE60]" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Market Avg</p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(valuationResult.marketData?.averagePricePerAcre || 0)}
                    </p>
                  </div>
                </div>

                {/* Property Characteristics */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 mb-6 text-left border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#27AE60]" />
                    Property Characteristics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      {valuationResult.propertyCharacteristics?.utilities.power ? (
                        <div className="w-5 h-5 rounded-full bg-[#d5f5e3] dark:bg-[#27AE60]/30 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-foreground">Power</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {valuationResult.propertyCharacteristics?.utilities.water ? (
                        <div className="w-5 h-5 rounded-full bg-[#d5f5e3] dark:bg-[#27AE60]/30 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-foreground">Water</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {valuationResult.propertyCharacteristics?.utilities.sewer ? (
                        <div className="w-5 h-5 rounded-full bg-[#d5f5e3] dark:bg-[#27AE60]/30 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-foreground">Sewer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!valuationResult.propertyCharacteristics?.floodRisk ? (
                        <div className="w-5 h-5 rounded-full bg-[#d5f5e3] dark:bg-[#27AE60]/30 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                      )}
                      <span className="text-sm text-foreground">{valuationResult.propertyCharacteristics?.floodRisk ? 'Flood Risk' : 'No Flood'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#27AE60]/10 flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-[#27AE60]" />
                      </div>
                      <span className="text-sm text-foreground capitalize">{valuationResult.propertyCharacteristics?.accessType || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {valuationResult.propertyCharacteristics?.hasSurvey ? (
                        <div className="w-5 h-5 rounded-full bg-[#d5f5e3] dark:bg-[#27AE60]/30 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#27AE60]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-foreground">Survey</span>
                    </div>
                  </div>
                </div>

                {/* Confirmation Message */}
                <div className="p-5 rounded-xl mb-6 bg-[#e8f8ef] dark:bg-[#27AE60]/20 border border-[#82e0aa] dark:border-[#27AE60]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[#27AE60] dark:text-[#2ECC71]" />
                    <span className="font-semibold text-[#1E8449] dark:text-[#82e0aa]">Submission Received!</span>
                  </div>
                  <p className="text-sm text-[#1E8449] dark:text-[#2ECC71]">
                    A confirmation email has been sent to <strong>{formData.email}</strong>.
                    Our team will contact you within 24 hours to discuss your offer.
                  </p>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground italic mb-6">
                  This is a preliminary estimate based on property characteristics and market data. 
                  Final offer may vary after property verification and due diligence.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleViewOfferStatus}
                    className="bg-[#27AE60] hover:bg-[#1E8449] text-white shadow-lg shadow-[#27AE60]/20 h-12 px-6 rounded-xl font-medium"
                  >
                    View Offer Status
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-12 px-6 rounded-xl font-medium"
                  >
                    Submit Another Property
                  </Button>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {apiError && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{apiError}</span>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Property Location</h3>
                      <p className="text-sm text-muted-foreground">Tell us where your land is located</p>
                    </div>

                    <CustomSelect
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      options={stateOptions}
                      placeholder="Select State *"
                      icon={MapPin}
                      error={errors.state}
                    />

                    <CustomSelect
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      options={countyOptions}
                      placeholder={isCountySelectable ? 'Select County *' : 'Select State First'}
                      disabled={!isCountySelectable}
                      error={errors.county}
                    />


                    <StyledInput
                      name="zip"
                      placeholder="ZIP Code *"
                      value={formData.zip}
                      onChange={handleChange}
                      icon={Hash}
                      error={errors.zip}
                      required
                    />


                    <StyledInput
                      name="acreage"
                      type="number"
                      placeholder="Acreage *"
                      value={formData.acreage}
                      onChange={handleChange}
                      icon={Home}
                      error={errors.acreage}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <StyledInput
                        name="apn"
                        placeholder="APN / Parcel Number (Optional)"
                        value={formData.apn}
                        onChange={handleChange}
                        icon={FileText}
                      />

                      <StyledInput
                        name="gpsPin"
                        placeholder="GPS Coordinates (Optional)"
                        value={formData.gpsPin}
                        onChange={handleChange}
                        icon={MapPin}
                      />
                    </div>
                  </div>
                )}




                {step === 2 && (
                  <div className="space-y-5">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Property Details</h3>
                      <p className="text-sm text-muted-foreground">Tell us more about your property features</p>
                    </div>

                    <CustomSelect
                      name="accessType"
                      value={formData.accessType}
                      onChange={handleChange}
                      options={accessTypeOptions}
                      placeholder="Access Type *"
                      icon={Route}
                      error={errors.accessType}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <CustomSelect
                        name="powerAvailable"
                        value={formData.powerAvailable}
                        onChange={handleChange}
                        options={yesNoOptions}
                        placeholder="Select"
                        icon={Zap}
                        label="Power *"
                        error={errors.powerAvailable}
                      />
                      <CustomSelect
                        name="waterAvailable"
                        value={formData.waterAvailable}
                        onChange={handleChange}
                        options={yesNoOptions}
                        placeholder="Select"
                        icon={Droplets}
                        label="Water *"
                        error={errors.waterAvailable}
                      />
                      <CustomSelect
                        name="sewerAvailable"
                        value={formData.sewerAvailable}
                        onChange={handleChange}
                        options={yesNoOptions}
                        placeholder="Select"
                        icon={PipetteIcon}
                        label="Sewer *"
                        error={errors.sewerAvailable}
                      />
                    </div>

                    <CustomSelect
                      name="floodRisk"
                      value={formData.floodRisk}
                      onChange={handleChange}
                      options={yesNoOptions}
                      placeholder="Select"
                      icon={AlertTriangle}
                      label="Flood Risk *"
                      error={errors.floodRisk}
                    />


                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <CustomSelect
                        name="hasSurvey"
                        value={formData.hasSurvey}
                        onChange={handleChange}
                        options={surveyOptions}
                        placeholder="Survey Status (Optional)"
                        icon={ClipboardList}
                      />
                      <CustomSelect
                        name="hasPercTest"
                        value={formData.hasPercTest}
                        onChange={handleChange}
                        options={percTestOptions}
                        placeholder="Perc Test (Optional)"
                        icon={FlaskConical}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-3 text-[#27AE60]/60 pointer-events-none z-10">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <Textarea
                        name="notes"
                        placeholder="Additional Notes (optional)"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-[#27AE60] rounded-xl text-foreground transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#27AE60]/10 resize-none"
                      />
                    </div>


                    {/* Contact Info Section */}
                    <div className="border-t-2 border-slate-100 dark:border-slate-700 pt-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <User className="w-5 h-5 text-[#27AE60]" />
                            Contact Information
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5">How can we reach you?</p>
                        </div>
                        {isContactPreFilled && (
                          <span className="text-xs text-[#27AE60] dark:text-[#2ECC71] bg-[#e8f8ef] dark:bg-[#27AE60]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Auto-filled
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <StyledInput
                          name="firstName"
                          placeholder="First Name *"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={isContactPreFilled}
                          icon={User}
                          error={errors.firstName}
                          required
                        />
                        <StyledInput
                          name="lastName"
                          placeholder="Last Name *"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={isContactPreFilled}
                          error={errors.lastName}
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <StyledInput
                          name="email"
                          type="email"
                          placeholder="Email *"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isContactPreFilled}
                          icon={Mail}
                          error={errors.email}
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <StyledInput
                          name="phone"
                          type="tel"
                          placeholder="Phone (10 digits) *"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={isContactPreFilled}
                          icon={Phone}
                          error={errors.phone}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                      className="border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-12 px-6 rounded-xl font-medium"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="flex-1 bg-[#27AE60] hover:bg-[#1E8449] text-white shadow-lg shadow-[#27AE60]/20 h-12 rounded-xl font-medium" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Property...
                      </span>
                    ) : step === 2 ? (
                      <span className="flex items-center gap-2">
                        Get My Offer
                        <DollarSign className="w-5 h-5" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Next Step
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 max-w-sm mx-auto text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
            <span>No Obligation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
            <span>100% Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
            <span>Fast Response</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#27AE60]" />
            <span>Close on Your Timeline</span>
          </div>
        </div>


      </div>
    </section>
  );
};
