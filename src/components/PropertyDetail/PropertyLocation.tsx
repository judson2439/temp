import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Navigation, Copy, Map, Compass, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VtbWl0bGFuZHVzYTEyMyIsImEiOiJjbWpuNmlsNTgxeXpsM2ZvbG12aXFlZnV3In0.mB7UKT_Qtl60Hv2v_koK3g';

interface PropertyLocationProps {
  lat: number;
  lng: number;
}

type MapStyleType = 'streets' | 'satellite' | 'outdoors';

const mapStyles: Record<MapStyleType, string> = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
};

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ lat, lng }) => {
  const [copied, setCopied] = useState(false);
  const [activeMapType, setActiveMapType] = useState<MapStyleType>('satellite');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const mapTypes = [
    { id: 'streets' as MapStyleType, label: 'Road', icon: Map },
    { id: 'satellite' as MapStyleType, label: 'Satellite', icon: Compass },
    { id: 'outdoors' as MapStyleType, label: 'Terrain', icon: MapPin },
  ];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[activeMapType],
      center: [lng, lat],
      zoom: 14,
      attributionControl: false,
    });

    // Add attribution control in bottom-right
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    // Add navigation controls (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    // Create custom marker element with green theme
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.innerHTML = `
      <div style="position: relative;">
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #27AE60 0%, #1E8449 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(39, 174, 96, 0.5);
          border: 3px solid white;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid #1E8449;
        "></div>
      </div>
    `;

    // Add marker
    marker.current = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Add popup
    const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
      .setHTML(`
        <div style="padding: 8px 12px; font-family: system-ui, -apple-system, sans-serif;">
          <p style="font-weight: 600; color: #1e293b; margin: 0 0 4px 0;">Property Location</p>
          <p style="font-size: 12px; color: #64748b; margin: 0;">${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
        </div>
      `);

    marker.current.setPopup(popup);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lat, lng]);

  // Update map style when activeMapType changes
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyles[activeMapType]);
    }
  }, [activeMapType]);

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 1000,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'mt-8'}`}>
      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/50 -z-10" onClick={toggleFullscreen} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Property Location</h2>
              <p className="text-sm text-slate-300">View on map and get directions</p>
            </div>
          </div>
          
          {/* Map type toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg p-1">
            {mapTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveMapType(type.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeMapType === type.id
                    ? 'bg-white text-slate-800'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Coordinates Card */}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-xl p-5 mb-6 border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">GPS Coordinates</p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-mono font-semibold text-gray-900">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">WGS84</span>
              </div>
            </div>
            <button
              onClick={copyCoordinates}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                copied 
                  ? 'bg-[#27AE60] text-white' 
                  : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-[#27AE60] border border-gray-200 hover:border-[#27AE60]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Coordinates
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mapbox Map */}
        <div className={`relative rounded-xl overflow-hidden mb-6 border border-slate-200 ${isFullscreen ? 'h-[calc(100vh-380px)]' : ''}`}>
          <div 
            ref={mapContainer} 
            className={`w-full ${isFullscreen ? 'h-full' : 'h-[400px]'}`}
          />
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* Map style indicator */}
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 shadow-lg">
              {activeMapType.charAt(0).toUpperCase() + activeMapType.slice(1)} View
            </div>
          </div>

          {/* Custom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleResetView}
              className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              title="Reset view"
            >
              <MapPin className="w-5 h-5 text-[#27AE60]" />
            </button>
          </div>

          {/* Mobile map type selector */}
          <div className="absolute bottom-4 left-4 sm:hidden flex gap-1 bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-lg">
            {mapTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveMapType(type.id)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  activeMapType === type.id
                    ? 'bg-[#27AE60] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#1E8449] to-[#27AE60] text-white rounded-xl hover:from-[#196F3D] hover:to-[#1E8449] font-semibold transition-all duration-200 shadow-lg shadow-[#27AE60]/30 hover:shadow-xl hover:shadow-[#27AE60]/40 transform hover:-translate-y-0.5"
          >
            <ExternalLink className="w-5 h-5" />
            View on Google Maps
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Navigation className="w-5 h-5" />
            Get Driving Directions
          </a>
        </div>

        {/* Additional map links */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <a
            href={`https://earth.google.com/web/@${lat},${lng},0a,1000d,35y,0h,0t,0r`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-[#27AE60] flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Google Earth
          </a>
          <span className="text-gray-300">•</span>
          <a
            href={`https://www.bing.com/maps?cp=${lat}~${lng}&lvl=15`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-[#27AE60] flex items-center gap-1.5 transition-colors"
          >
            <Map className="w-4 h-4" />
            Bing Maps
          </a>
          <span className="text-gray-300">•</span>
          <a
            href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-[#27AE60] flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            OpenStreetMap
          </a>
        </div>
      </div>
    </div>
  );
};
