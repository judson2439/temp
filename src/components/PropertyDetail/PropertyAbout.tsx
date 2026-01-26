import React, { useState } from 'react';
import { Property } from '@/types/property';

import { supabase } from '@/lib/supabase';
import { 
  CreditCard, HelpCircle, Shield, FileText, Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PropertyAboutProps {
  property: Property;
  onRequestInfo: () => void;
}

export const PropertyAbout: React.FC<PropertyAboutProps> = ({ 
  property, 
  onRequestInfo
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReserve = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          propertyId: property.id,
          propertyTitle: property.title,
          successUrl: `${window.location.origin}/payment-success.html?property_id=${property.id}`,
          cancelUrl: `${window.location.origin}/property/${property.id}`,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this ${property.acres} acre property in ${property.city}, ${property.state} for $${property.price.toLocaleString()}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Property link has been copied to your clipboard.",
        });
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        {/* Description */}
        {property.description && (
          <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-[#27AE60]" />
              About This Property
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">{property.description}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">Payment Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons - Horizontal layout for full width */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            onClick={handleReserve}
            disabled={isLoading}
            className="flex-1 min-w-[200px] bg-gradient-to-r from-[#1E8449] to-[#27AE60] text-white py-3 px-5 rounded-xl hover:from-[#196F3D] hover:to-[#1E8449] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#27AE60]/30 hover:shadow-xl hover:shadow-[#27AE60]/40 transform hover:-translate-y-0.5 text-sm"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Reserve Now - $850
              </>
            )}
          </button>
          <button 
            onClick={onRequestInfo} 
            className="flex-1 min-w-[200px] bg-slate-800 text-white py-3 px-5 rounded-xl hover:bg-slate-900 font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
          >
            <HelpCircle className="w-5 h-5" />
            Ask a Question
          </button>
          
          {/* Share button */}
          <button
            onClick={handleShare}
            className="py-3 px-5 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Share2 className="w-5 h-5" />
            Share Property
          </button>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-[#27AE60]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">100% Secure Transaction</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Powered by Stripe. Your $850 reservation fee is fully refundable within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
