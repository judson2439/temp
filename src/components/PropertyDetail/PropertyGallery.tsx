import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Heart, X, ZoomIn, Grid3X3 } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ 
  images, 
  title,
  isFavorite = false,
  onToggleFavorite
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsLoading(true);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Main Image Container - Fixed aspect ratio */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl aspect-[16/10] group h-full">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
        
        <img 
          src={images[currentImageIndex]} 
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${isZoomed ? 'scale-110 cursor-zoom-out' : 'cursor-zoom-in'}`}
          onLoad={handleImageLoad}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        
        {/* Image counter badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="bg-[#27AE60]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Top right buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className={`p-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 ${
                isFavorite
                  ? 'bg-pink-500 text-white animate-pulse'
                  : 'bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-pink-500'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} />
            </button>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Progress bar */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-[#27AE60] transition-all duration-300"
              style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Favorite button in fullscreen */}
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 z-10 ${
                isFavorite
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          )}
          
          {/* Main fullscreen image */}
          <img 
            src={images[currentImageIndex]} 
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation in fullscreen */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </>
          )}

          {/* Thumbnail strip in fullscreen */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
              <div className="flex gap-2 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-xl">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-12 h-10 rounded-lg overflow-hidden transition-all duration-200 ${
                      idx === currentImageIndex 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
            {currentImageIndex + 1} of {images.length} • Press ESC to close
          </div>
        </div>
      )}
    </>
  );
};
