import React from 'react';
import { Property } from '@/types/property';
import { MapPin, Maximize, Heart, Eye, Info } from 'lucide-react';


interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
  onRequestInfo: (id: string, title: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onRequestInfo,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#82e0aa] transition-all duration-300 group h-full flex flex-col">
      {/* Image Section */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-56 object-cover cursor-pointer transform group-hover:scale-105 transition-transform duration-500"
          onClick={() => onViewDetails(property.id)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#27AE60] text-white text-xs font-semibold rounded-full shadow-lg">
            {property.acres} acres
          </span>
          {property.featured && (
            <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Featured
            </span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isFavorite 
              ? 'bg-pink-500 text-white scale-110' 
              : 'bg-white/90 text-gray-600 hover:bg-pink-500 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions on Hover */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => onViewDetails(property.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 font-medium rounded-xl hover:bg-white transition-colors shadow-lg"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Location - Fixed height with truncation */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2 h-5 overflow-hidden">
          <MapPin className="w-4 h-4 text-[#27AE60] flex-shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span>
          <span className="text-gray-300 mx-1 flex-shrink-0">•</span>
          <span className="truncate">{property.county} County</span>
        </div>

        {/* Title - Fixed height for 2 lines */}
        <h3 
          className="font-bold text-lg text-gray-900 mb-3 cursor-pointer hover:text-[#27AE60] transition-colors line-clamp-2 h-14"
          onClick={() => onViewDetails(property.id)}
        >
          {property.title}
        </h3>

        {/* Property Features - Fixed height */}
        <div className="flex items-center gap-4 mb-4 h-7">
          <div className="flex items-center gap-1.5 text-gray-600 text-sm flex-shrink-0">
            <Maximize className="w-4 h-4 text-[#27AE60]" />
            <span>{property.acres} acres</span>
          </div>
          {property.zoning && (
            <div className="text-gray-600 text-sm bg-gray-100 px-2 py-0.5 rounded truncate max-w-[180px]">
              {property.zoning}
            </div>
          )}
        </div>

        {/* Price & Actions - Push to bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div>
            <p className="text-sm text-gray-500">Starting at</p>
            <p className="text-2xl font-bold text-[#27AE60]">
              ${property.price.toLocaleString()}
            </p>
            {property.monthlyPayment && (
              <p className="text-sm text-gray-500">
                or ${property.monthlyPayment}/mo
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRequestInfo(property.id, property.title)}
              className="p-2.5 text-gray-500 hover:text-[#27AE60] hover:bg-[#e8f8ef] rounded-xl transition-colors"
              title="Request Info"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewDetails(property.id)}
              className="px-5 py-2.5 bg-[#27AE60] hover:bg-[#1E8449] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#27AE60]/20"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
