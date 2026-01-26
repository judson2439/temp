import React from 'react';
import { Property } from '@/types/property';

import { 
  MapPin, FileText, Zap, Car, Home, Share2, 
  Printer, Ruler, Navigation, DollarSign
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PropertyInfoProps {
  property: Property;
  onRequestInfo: () => void;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ 
  property, 
  onRequestInfo
}) => {
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

  const handlePrint = () => {
    window.print();
  };

  const pricePerAcre = Math.round(property.price / property.acres);

  const propertyDetails = [
    { label: 'ACREAGE', value: `${property.acres} acres`, icon: Ruler },
    { label: 'PRICE PER ACRE', value: `$${pricePerAcre.toLocaleString()}`, icon: DollarSign },
    { label: 'APN / PARCEL ID', value: property.apn || 'Buyer to verify with County', icon: Home },
    { label: 'ZONING', value: property.zoning || 'Contact for details', icon: FileText },
    { label: 'ROAD ACCESS', value: property.roadAccess ? 'Yes' : 'No', icon: Car },
    { label: 'UTILITIES', value: property.utilities || 'Nearby (buyer to verify)', icon: Zap },
  ];

  // Add coordinates if available
  if (property.lat && property.lng) {
    propertyDetails.push({
      label: 'COORDINATES',
      value: `${property.lat.toFixed(4)}, ${property.lng.toFixed(4)}`,
      icon: Navigation
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-[#1E8449] to-[#27AE60] px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-white">
              <p className="text-emerald-100 text-[10px] font-medium uppercase tracking-wide">Total Price</p>
              <p className="text-xl font-bold">${property.price.toLocaleString()}</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-white">
              <p className="text-emerald-100 text-[10px] font-medium uppercase tracking-wide">Size</p>
              <p className="text-base font-semibold">{property.acres} acres</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              aria-label="Share property"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              aria-label="Print property details"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-1.5 text-white">
          <p className="text-emerald-100 text-[10px] font-medium uppercase tracking-wide">Per Acre</p>
          <p className="text-base font-semibold">${pricePerAcre.toLocaleString()}</p>
        </div>
      </div>

      <div className="p-3 flex-1 overflow-auto">
        {/* Property Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#27AE60]" />
            Property Details
          </h3>
          <div className="space-y-1.5">
            {propertyDetails.map((detail, index) => (
              <div 
                key={index}
                className="py-2.5 px-3 rounded-lg border bg-gradient-to-br from-slate-50 to-emerald-50/30 border-slate-100"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <detail.icon className="w-4 h-4 text-[#27AE60] flex-shrink-0" />
                    <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">{detail.label}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-xs text-right max-w-[55%] truncate">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
