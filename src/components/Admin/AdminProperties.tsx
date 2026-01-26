import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { PropertyStatus } from '@/types/property';
import Portal from '@/components/Portal';
import { COUNTY_DATA } from '@/data/counties';

interface AdminProperty {
  id: string;
  title: string;
  description: string | null;
  price: number;
  size: number;
  county: string;
  state: string;
  apn: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[] | null;
  thumbnail: string | null;
  zoning: string | null;
  road_access: 'yes' | 'no' | 'unknown';
  water: 'yes' | 'no' | 'unknown';
  power: 'yes' | 'no' | 'unknown';
  sewer: 'yes' | 'no' | 'unknown';
  annual_tax: string | null;
  status: PropertyStatus;
  is_featured: boolean | null;
  created_at: string | null;
  views: number | null;
}

// State name mapping
const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California', 'CO': 'Colorado',
  'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky',
  'ME': 'Maine', 'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota',
  'MS': 'Mississippi', 'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon',
  'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota',
  'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia',
  'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

const getStatusBadgeStyle = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'lead': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'under_contract': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'due_diligence': return 'bg-green-100 text-green-700 border border-green-200';
    case 'closing': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'listed': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'sold': return 'bg-slate-100 text-slate-700 border border-slate-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};


// Custom Select Component
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select...', 
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); setTimeout(() => inputRef.current?.focus(), 100); } }}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-xl text-left transition-all duration-200 ${
          isOpen 
            ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
            : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {options.length > 10 && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No options found</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 flex items-center justify-between ${
                    opt.value === value 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Image Upload Component with Drag & Drop
interface ImageUploadProps {
  images: string[];
  thumbnail: string;
  onImagesChange: (images: string[]) => void;
  onThumbnailChange: (thumbnail: string) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  thumbnail,
  onImagesChange,
  onThumbnailChange,
  maxImages = 5
}) => {
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  };

  // Handle thumbnail upload
  const handleThumbnailFiles = async (files: FileList) => {
    const file = Array.from(files).find(f => 
      f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
    );

    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const url = await uploadFile(file);
      if (url) {
        console.log('Thumbnail uploaded successfully:', url);
        onThumbnailChange(url);
      } else {
        console.error('Failed to get URL for uploaded thumbnail');
      }
    } catch (err) {
      console.error('Thumbnail upload error:', err);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Handle additional images upload
  const handleImagesFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );

    const remainingSlots = maxImages - images.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) return;

    setUploadingImages(true);
    const newImages: string[] = [];

    for (const file of filesToUpload) {
      const url = await uploadFile(file);
      if (url) {
        newImages.push(url);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
    }

    setUploadingImages(false);
  };

  // Thumbnail drag handlers
  const handleThumbnailDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingThumbnail(true);
  }, []);

  const handleThumbnailDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingThumbnail(false);
  }, []);

  const handleThumbnailDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingThumbnail(false);
    if (e.dataTransfer.files) {
      handleThumbnailFiles(e.dataTransfer.files);
    }
  }, [onThumbnailChange]);

  // Images drag handlers
  const handleImagesDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImages(true);
  }, []);

  const handleImagesDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImages(false);
  }, []);

  const handleImagesDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImages(false);
    if (e.dataTransfer.files) {
      handleImagesFiles(e.dataTransfer.files);
    }
  }, [images, maxImages, onImagesChange]);

  const removeThumbnail = () => {
    onThumbnailChange('');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h5 className="font-medium text-gray-900">Thumbnail Image</h5>
            <p className="text-xs text-gray-500">Main cover image for the property listing</p>
          </div>
        </div>

        {thumbnail ? (
          <div className="relative group w-full max-w-xs">
            <div className="aspect-video rounded-xl overflow-hidden border-2 border-emerald-500 ring-2 ring-emerald-500/20">
              <img 
                src={thumbnail} 
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-lg">
              Thumbnail
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="p-2 bg-white rounded-lg hover:bg-emerald-50 transition-colors"
                title="Replace thumbnail"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={removeThumbnail}
                className="p-2 bg-white rounded-lg hover:bg-rose-50 transition-colors"
                title="Remove thumbnail"
              >
                <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleThumbnailFiles(e.target.files)}
              className="hidden"
            />
          </div>
        ) : (
          <div
            onDragOver={handleThumbnailDragOver}
            onDragLeave={handleThumbnailDragLeave}
            onDrop={handleThumbnailDrop}
            onClick={() => thumbnailInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 max-w-xs ${
              isDraggingThumbnail 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleThumbnailFiles(e.target.files)}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDraggingThumbnail ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-6 h-6 ${isDraggingThumbnail ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDraggingThumbnail ? 'Drop image here' : 'Drag & drop thumbnail'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  or <span className="text-emerald-600 font-medium">browse</span>
                </p>
              </div>
            </div>

            {uploadingThumbnail && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-medium text-gray-700">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Additional Images Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h5 className="font-medium text-gray-900">Additional Images</h5>
            <p className="text-xs text-gray-500">Add up to {maxImages} additional property photos</p>
          </div>
        </div>

        {/* Drop Zone for Additional Images */}
        <div
          onDragOver={handleImagesDragOver}
          onDragLeave={handleImagesDragLeave}
          onDrop={handleImagesDrop}
          onClick={() => imagesInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDraggingImages 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={imagesInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleImagesFiles(e.target.files)}
            className="hidden"
            disabled={images.length >= maxImages}
          />
          
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isDraggingImages ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-6 h-6 ${isDraggingImages ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDraggingImages ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                or <span className="text-blue-600 font-medium">browse</span> to select files
              </p>
            </div>
            
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP up to 10MB • {images.length}/{maxImages} uploaded
            </p>
          </div>

          {uploadingImages && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-gray-700">Uploading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Images Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((imageUrl, index) => (
              <div 
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                <img 
                  src={imageUrl} 
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Image number badge */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-white rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};






const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    size: '',
    county: '',
    state: '',
    apn: '',
    latitude: '',
    longitude: '',
    thumbnail: '',
    images: [] as string[],
    zoning: '',
    road_access: 'unknown' as 'yes' | 'no' | 'unknown',
    water: 'unknown' as 'yes' | 'no' | 'unknown',
    annual_tax: '',
    status: 'listed' as PropertyStatus,
    is_featured: false,
  });


  // Fetch properties from database
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get admin full name from session
  const getAdminFullName = (): string => {
    try {
      // First try adminSession
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        const parsed = JSON.parse(adminSession);
        if (parsed.user?.first_name && parsed.user?.last_name) {
          return `${parsed.user.first_name} ${parsed.user.last_name}`.trim();
        }
        if (parsed.user?.email) {
          return parsed.user.email;
        }
      }
      
      // Fallback to session
      const session = localStorage.getItem('session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.user?.first_name && parsed.user?.last_name) {
          return `${parsed.user.first_name} ${parsed.user.last_name}`.trim();
        }
        if (parsed.user?.email) {
          return parsed.user.email;
        }
      }
    } catch (e) {
      console.error('Error getting admin name:', e);
    }
    return 'Admin';
  };

  // Handle status change
  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    // Find the property to get its current status and title
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const oldStatus = property.status;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      // Update local state
      setProperties(properties.map(prop =>
        prop.id === propertyId ? { ...prop, status: newStatus as PropertyStatus } : prop
      ));

      // Log the activity
      const adminFullName = getAdminFullName();
      const actionName = `Changed property "${property.title}" status from ${oldStatus} to ${newStatus}`;
      
      const { error: activityLogError } = await supabase
        .from('activity_logs')
        .insert({
          full_name: adminFullName,
          action_name: actionName,
          action_type: 'property'
        });

      if (activityLogError) {
        console.error('Error logging activity:', activityLogError);
        // Don't throw - the status change was successful, just log the error
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update property status');
    }
  };


  // Handle add property
  const handleAddProperty = async () => {
    setSaving(true);
    try {
      // Log the formData to debug
      console.log('Adding property with formData:', {
        thumbnail: formData.thumbnail,
        images: formData.images,
        title: formData.title
      });

      const newProperty = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price) || 0,
        size: parseFloat(formData.size) || 0,
        county: formData.county,
        state: formData.state,
        apn: formData.apn || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        thumbnail: formData.thumbnail || null,
        images: formData.images.length > 0 ? formData.images : null,
        zoning: formData.zoning || null,
        road_access: formData.road_access,
        water: formData.water,
        power: formData.power,
        sewer: formData.sewer,
        annual_tax: formData.annual_tax || null,
        status: formData.status,
        is_featured: formData.is_featured,
        views: 0,
      };

      console.log('Inserting property:', newProperty);

      const { data, error } = await supabase
        .from('properties')
        .insert([newProperty])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Property added successfully:', data);

      setShowAddModal(false);
      resetForm();
      fetchProperties();
    } catch (err) {
      console.error('Error adding property:', err);
      alert('Failed to add property: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };


  // Handle edit property
  const handleEditProperty = async () => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const updatedProperty = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price) || 0,
        size: parseFloat(formData.size) || 0,
        county: formData.county,
        state: formData.state,
        apn: formData.apn || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        thumbnail: formData.thumbnail || null,
        images: formData.images.length > 0 ? formData.images : null,
        zoning: formData.zoning || null,
        road_access: formData.road_access,
        water: formData.water,
        power: formData.power,
        sewer: formData.sewer,
        annual_tax: formData.annual_tax || null,
        status: formData.status,
        is_featured: formData.is_featured,
      };

      const { error } = await supabase
        .from('properties')
        .update(updatedProperty)
        .eq('id', selectedProperty.id);

      if (error) throw error;

      setShowEditModal(false);
      setSelectedProperty(null);
      resetForm();
      fetchProperties();
    } catch (err) {
      console.error('Error updating property:', err);
      alert('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete property
  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedProperty.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property');
    } finally {
      setSaving(false);
    }
  };

  // Open edit modal with property data
  const openEditModal = (property: AdminProperty) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      price: property.price.toString(),
      size: property.size.toString(),
      county: property.county,
      state: property.state,
      apn: property.apn || '',
      latitude: property.latitude?.toString() || '',
      longitude: property.longitude?.toString() || '',
      thumbnail: property.thumbnail || '',
      images: property.images || [],
      zoning: property.zoning || '',
      road_access: property.road_access,
      water: property.water,
      power: property.power,
      sewer: property.sewer,
      annual_tax: property.annual_tax || '',
      status: property.status,
      is_featured: property.is_featured || false,
    });
    setActiveTab(0);
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (property: AdminProperty) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      size: '',
      county: '',
      state: '',
      apn: '',
      latitude: '',
      longitude: '',
      thumbnail: '',
      images: [],
      zoning: '',
      road_access: 'unknown',
      water: 'unknown',
      power: 'unknown',
      sewer: 'unknown',
      annual_tax: '',
      status: 'listed',
      is_featured: false,

    });
    setActiveTab(0);
  };

  // Stats
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending').length,
    sold: properties.filter(p => p.status === 'sold').length,
    inactive: properties.filter(p => p.status === 'inactive').length,
  };

  // Get counties for selected state
  const getCountiesForState = (stateCode: string): string[] => {
    return COUNTY_DATA[stateCode] || [];
  };

  // State options
  const stateOptions = Object.entries(STATE_NAMES).map(([code, name]) => ({
    value: code,
    label: `${name} (${code})`
  }));

  // County options based on selected state
  const countyOptions = formData.state 
    ? getCountiesForState(formData.state).map(county => ({
        value: county,
        label: county
      }))
    : [];

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Images
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Upload Images</h4>
                <p className="text-sm text-gray-500">Add property photos (max 5 images)</p>
              </div>
            </div>
            <ImageUpload
              images={formData.images}
              thumbnail={formData.thumbnail}
              onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              onThumbnailChange={(thumbnail) => setFormData(prev => ({ ...prev, thumbnail }))}
              maxImages={5}
            />

          </div>
        );
      
      case 1: // Basic Info
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Basic Information</h4>
                <p className="text-sm text-gray-500">Enter property details</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 10 Acres in Texas Hill Country"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($) *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="89000"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Size (acres) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="10"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                <CustomSelect
                  value={formData.state}
                  onChange={(value) => setFormData({ ...formData, state: value, county: '' })}
                  options={stateOptions}
                  placeholder="Select state..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">County *</label>
                <CustomSelect
                  value={formData.county}
                  onChange={(value) => setFormData({ ...formData, county: value })}
                  options={countyOptions}
                  placeholder="Select county..."
                  disabled={!formData.state}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Detailed property description..."
              />
            </div>
          </div>
        );
      
      case 2: // Additional Info
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Additional Details</h4>
                <p className="text-sm text-gray-500">Utilities, location, and status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">APN *</label>
                <Input
                  value={formData.apn}
                  onChange={(e) => setFormData({ ...formData, apn: e.target.value })}
                  placeholder="Assessor Parcel Number"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Zoning *</label>
                <Input
                  value={formData.zoning}
                  onChange={(e) => setFormData({ ...formData, zoning: e.target.value })}
                  placeholder="Agricultural, Residential, etc."
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude *</label>
                <Input
                  type="number"
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="30.123456"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude *</label>
                <Input
                  type="number"
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="-98.123456"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Tax *</label>
              <Input
                value={formData.annual_tax}
                onChange={(e) => setFormData({ ...formData, annual_tax: e.target.value })}
                placeholder="$500"
                className="rounded-xl"
              />
            </div>


            {/* Utilities */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Utilities</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Road Access</label>
                  <CustomSelect
                    value={formData.road_access}
                    onChange={(value) => setFormData({ ...formData, road_access: value as 'yes' | 'no' | 'unknown' })}
                    options={[
                      { value: 'unknown', label: 'Unknown' },
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Water</label>
                  <CustomSelect
                    value={formData.water}
                    onChange={(value) => setFormData({ ...formData, water: value as 'yes' | 'no' | 'unknown' })}
                    options={[
                      { value: 'unknown', label: 'Unknown' },
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Power</label>
                  <CustomSelect
                    value={formData.power}
                    onChange={(value) => setFormData({ ...formData, power: value as 'yes' | 'no' | 'unknown' })}
                    options={[
                      { value: 'unknown', label: 'Unknown' },
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Sewer</label>
                  <CustomSelect
                    value={formData.sewer}
                    onChange={(value) => setFormData({ ...formData, sewer: value as 'yes' | 'no' | 'unknown' })}
                    options={[
                      { value: 'unknown', label: 'Unknown' },
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Status & Featured */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Status & Visibility</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                  <CustomSelect
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value as PropertyStatus })}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'sold', label: 'Sold' },
                      { value: 'inactive', label: 'Inactive' }
                    ]}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Featured Property</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Check if can proceed to next tab
  const canProceedToNext = () => {
    switch (activeTab) {
      case 0: return true; // Images are optional
      case 1: return formData.title && formData.state && formData.county && formData.price && formData.size;
      case 2: return true;
      default: return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchProperties} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Property Management</h2>
          <p className="text-sm sm:text-base text-gray-500">Manage all property listings ({properties.length} total)</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 shadow-lg">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
          <p className="text-sm text-emerald-600">Active</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <p className="text-sm text-amber-600">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="bg-sky-50 rounded-xl border border-sky-100 p-4">
          <p className="text-sm text-sky-600">Sold</p>
          <p className="text-2xl font-bold text-sky-700">{stats.sold}</p>
        </div>
        <div className="bg-rose-50 rounded-xl border border-rose-100 p-4">
          <p className="text-sm text-rose-600">Inactive</p>
          <p className="text-2xl font-bold text-rose-700">{stats.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
            />
          </div>
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'sold', label: 'Sold' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            className="w-full sm:w-48"
          />
          <Button variant="outline" onClick={fetchProperties} className="flex items-center gap-2 rounded-xl">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden xl:block bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map((property, index) => (
                <tr 
                  key={property.id} 
                  className="hover:bg-emerald-50/50 transition-colors duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-gray-100">
                        {property.thumbnail ? (
                          <img src={property.thumbnail} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{property.title}</p>
                        {property.is_featured && (
                          <span className="text-xs text-amber-600 font-medium">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{property.county}, {property.state}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-emerald-600">${property.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{property.size} acres</span>
                  </td>
                  <td className="px-6 py-4">
                    <CustomSelect
                      value={property.status}
                      onChange={(value) => handleStatusChange(property.id, value)}
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'sold', label: 'Sold' },
                        { value: 'inactive', label: 'Inactive' }
                      ]}
                      className="w-32"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {property.views || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(property)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(property)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <a 
                        href={`/property/${property.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-300"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProperties.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No properties found matching your criteria
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredProperties.map((property, index) => (
          <div 
            key={property.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Property Image */}
            <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-100">
              {property.thumbnail ? (
                <img 
                  src={property.thumbnail} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadgeStyle(property.status)}`}>
                {property.status}
              </span>
              {property.is_featured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                  Featured
                </span>
              )}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white font-semibold text-sm sm:text-base truncate">{property.title}</p>
                <p className="text-white/80 text-xs sm:text-sm truncate">{property.county}, {property.state}</p>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl font-bold text-emerald-600">${property.price.toLocaleString()}</span>
                <span className="text-xs sm:text-sm text-gray-500">{property.size} acres</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 text-xs sm:text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {property.views || 0} views
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomSelect
                    value={property.status}
                    onChange={(value) => handleStatusChange(property.id, value)}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'sold', label: 'Sold' },
                      { value: 'inactive', label: 'Inactive' }
                    ]}
                  />
                </div>
                <button 
                  onClick={() => openEditModal(property)}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => openDeleteModal(property)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 text-sm">No properties found</p>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Add New Property</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-1 mt-4 bg-gray-100 p-1 rounded-xl">
                  {['Images', 'Basic Info', 'Details'].map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(index)}
                      className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === index 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                          activeTab === index 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                        {tab}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {renderTabContent()}
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex-shrink-0">
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => activeTab > 0 ? setActiveTab(activeTab - 1) : setShowAddModal(false)}
                    className="rounded-xl"
                  >
                    {activeTab === 0 ? 'Cancel' : 'Previous'}
                  </Button>
                  <div className="flex gap-3">
                    {activeTab < 2 ? (
                      <Button 
                        onClick={() => setActiveTab(activeTab + 1)}
                        disabled={!canProceedToNext()}
                        className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleAddProperty} 
                        disabled={saving || !formData.title || !formData.county || !formData.state || !formData.apn || !formData.zoning || !formData.latitude || !formData.longitude || !formData.annual_tax}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                      >
                        {saving ? 'Adding...' : 'Add Property'}
                      </Button>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Edit Property Modal */}
      {showEditModal && selectedProperty && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Edit Property</h3>
                  <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-1 mt-4 bg-gray-100 p-1 rounded-xl">
                  {['Images', 'Basic Info', 'Details'].map((tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(index)}
                      className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === index 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                          activeTab === index 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index + 1}
                        </span>
                        {tab}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {renderTabContent()}
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex-shrink-0">
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => activeTab > 0 ? setActiveTab(activeTab - 1) : setShowEditModal(false)}
                    className="rounded-xl"
                  >
                    {activeTab === 0 ? 'Cancel' : 'Previous'}
                  </Button>
                  <div className="flex gap-3">
                    {activeTab < 2 ? (
                      <Button 
                        onClick={() => setActiveTab(activeTab + 1)}
                        disabled={!canProceedToNext()}
                        className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleEditProperty} 
                        disabled={saving || !formData.title || !formData.county || !formData.state || !formData.apn || !formData.zoning || !formData.latitude || !formData.longitude || !formData.annual_tax}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProperty && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Property</h3>
                <p className="text-gray-500 text-center mb-6">
                  Are you sure you want to delete "{selectedProperty.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDeleteProperty} 
                    disabled={saving}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 rounded-xl"
                  >
                    {saving ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default AdminProperties;
