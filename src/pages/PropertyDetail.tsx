import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProperty, incrementPropertyViews } from '@/hooks/useProperties';
import { PropertyGallery, PropertyInfo, PropertyAbout, PropertyLocation, PropertyRequestInfo } from '@/components/PropertyDetail';
import { ArrowLeft, Heart, ChevronRight, Home, Share2, Phone, MapPin, Loader2 } from 'lucide-react';

import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(id);
  const { isFavorite, toggleFavorite, isLoggedIn } = useAppContext();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const viewsIncrementedRef = useRef(false);

  // Increment views when property is loaded
  useEffect(() => {
    if (id && property && !viewsIncrementedRef.current) {
      viewsIncrementedRef.current = true;
      incrementPropertyViews(id);
    }
  }, [id, property]);

  useEffect(() => {
    if (property) {
      document.title = `${property.title} | Summit Land USA`;
    }
  }, [property]);

  // Show sticky bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#27AE60] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-16 pt-28 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Error Loading Property</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => navigate('/buy')} 
              className="px-8 py-3 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white rounded-xl hover:from-[#219a52] hover:to-[#27AE60] font-semibold transition-all duration-200 shadow-lg shadow-[#27AE60]/30"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 py-16 pt-28 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Property Not Found</h1>
            <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/buy')} 
              className="px-8 py-3 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white rounded-xl hover:from-[#219a52] hover:to-[#27AE60] font-semibold transition-all duration-200 shadow-lg shadow-[#27AE60]/30"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  const propertyIsFavorite = isFavorite(property.id);

  const handleRequestInfo = () => {
    const section = document.getElementById('request-info');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleFavorite = () => {
    const wasAlreadyFavorite = propertyIsFavorite;
    toggleFavorite(property.id);
    
    if (wasAlreadyFavorite) {
      toast({
        title: "Removed from Favorites",
        description: `${property.title} has been removed from your favorites.`,
      });
    } else {
      toast({
        title: "Saved to Favorites",
        description: isLoggedIn 
          ? `${property.title} has been saved to your favorites and synced to your account.`
          : `${property.title} has been saved to your favorites. Sign in to sync across devices.`,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this ${property.acres} acre property in ${property.city}, ${property.state}`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pb-24 md:pb-8">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm overflow-x-auto">
            <Link to="/" className="text-gray-500 hover:text-[#27AE60] transition-colors flex items-center gap-1 flex-shrink-0">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <Link to="/buy" className="text-gray-500 hover:text-[#27AE60] transition-colors flex-shrink-0">
              Properties
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <Link to={`/buy?state=${property.state}`} className="text-gray-500 hover:text-[#27AE60] transition-colors flex-shrink-0">
              {property.state}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#145A32] via-[#1E8449] to-[#27AE60] py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={() => navigate('/buy')} 
            className="text-emerald-200 hover:text-white mb-4 flex items-center gap-2 font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </button>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{property.title}</h1>
              <p className="text-emerald-200 flex items-center gap-2 text-sm sm:text-base">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{property.city}, {property.county} County, {property.state}</span>
              </p>
              
              {/* Quick stats for mobile */}
              <div className="flex items-center gap-4 mt-4 md:hidden">
                <div className="text-white">
                  <p className="text-emerald-200 text-xs">Price</p>
                  <p className="text-xl font-bold">${property.price.toLocaleString()}</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-white">
                  <p className="text-emerald-200 text-xs">Size</p>
                  <p className="text-xl font-bold">{property.acres} acres</p>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200"
                aria-label="Share property"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  propertyIsFavorite
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 transition-transform ${propertyIsFavorite ? 'fill-current scale-110' : ''}`} />
                <span className="hidden sm:inline">
                  {propertyIsFavorite ? 'Saved' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Layout */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 -mt-4">
        {/* Gallery & Details - Horizontal Layout (2:1 ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
          {/* Gallery Section - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col">
            <PropertyGallery 
              images={images} 
              title={property.title}
              isFavorite={propertyIsFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Property Info Section - 1/3 width */}
          <div className="lg:col-span-1 flex flex-col">
            <PropertyInfo 
              property={property} 
              onRequestInfo={handleRequestInfo}
            />
          </div>
        </div>


        {/* Description Section - Full Width */}
        <div className="mb-6">
          <PropertyAbout 
            property={property} 
            onRequestInfo={handleRequestInfo}
          />
        </div>

        {/* Location Section */}
        {property.lat && property.lng && (
          <PropertyLocation lat={property.lat} lng={property.lng} />
        )}
        
        {/* Request Info Form */}
        <PropertyRequestInfo propertyId={property.id} propertyTitle={property.title} />

      </div>



      {/* Sticky Bottom Bar for Mobile */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden transition-transform duration-300 z-40 ${
        showStickyBar ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{property.title}</p>
            <p className="text-lg font-bold text-[#27AE60]">${property.price.toLocaleString()}</p>
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`p-3 rounded-xl transition-all duration-200 ${
              propertyIsFavorite
                ? 'bg-pink-100 text-pink-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${propertyIsFavorite ? 'fill-current' : ''}`} />
          </button>
          <a
            href="tel:2523768366"
            className="p-3 rounded-xl bg-gray-100 text-gray-600"
          >
            <Phone className="w-5 h-5" />
          </a>
          <button
            onClick={handleRequestInfo}
            className="px-6 py-3 bg-gradient-to-r from-[#27AE60] to-[#2ecc71] text-white rounded-xl font-semibold shadow-lg"
          >
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
}
