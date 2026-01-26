import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import Portal from '@/components/Portal';

interface Offer {
  id: string;
  state: string;
  county: string;
  acreage: number;
  apn: string | null;
  gps_pin: string | null;
  access_type: string;
  power_available: boolean;
  water_available: boolean;
  sewer_available: boolean;
  flood_risk: boolean;
  has_survey: string | null;
  has_perc_test: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  seller_name: string | null;
  seller_email: string | null;
  seller_phone: string | null;
  offer_amount: number | null;
  asking_price: number | null;
  status: string | null;
}

type OfferStatus = 'new' | 'under_review' | 'offer_sent' | 'accepted' | 'rejected' | 'expired' | 'counter_offer';

const getStatusBadgeStyle = (status: string | null): string => {
  switch (status?.toLowerCase()) {
    case 'new': return 'bg-violet-100 text-violet-700 border border-violet-200';
    case 'under_review': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'offer_sent': return 'bg-cyan-100 text-cyan-700 border border-cyan-200';
    case 'accepted': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'rejected': return 'bg-rose-100 text-rose-700 border border-rose-200';
    case 'expired': return 'bg-gray-100 text-gray-700 border border-gray-200';
    case 'counter_offer': return 'bg-orange-100 text-orange-700 border border-orange-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const formatStatus = (status: string | null): string => {
  if (!status) return 'Unknown';
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 bg-white border rounded-lg text-left text-sm transition-all duration-200 ${
          isOpen 
            ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
            : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 flex items-center justify-between ${
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    offer_amount: '',
    status: 'new' as OfferStatus,
    notes: '',
  });

  // Fetch offers from database
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      setOffers(data || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      (offer.seller_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (offer.seller_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (offer.county?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (offer.state?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = async (offerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', offerId);

      if (error) throw error;

      setOffers(offers.map(offer =>
        offer.id === offerId ? { ...offer, status: newStatus } : offer
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update offer status');
    }
  };

  // Handle edit offer
  const handleEditOffer = async () => {
    if (!selectedOffer) return;
    setSaving(true);
    try {
      const updatedOffer = {
        offer_amount: formData.offer_amount ? parseFloat(formData.offer_amount) : null,
        status: formData.status,
        notes: formData.notes || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('offers')
        .update(updatedOffer)
        .eq('id', selectedOffer.id);

      if (error) throw error;

      setShowEditModal(false);
      setSelectedOffer(null);
      fetchOffers();
    } catch (err) {
      console.error('Error updating offer:', err);
      alert('Failed to update offer');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete offer
  const handleDeleteOffer = async () => {
    if (!selectedOffer) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', selectedOffer.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedOffer(null);
      fetchOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert('Failed to delete offer');
    } finally {
      setSaving(false);
    }
  };

  // Open detail modal
  const openDetailModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowDetailModal(true);
  };

  // Open edit modal with offer data
  const openEditModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormData({
      offer_amount: offer.offer_amount?.toString() || '',
      status: (offer.status as OfferStatus) || 'new',
      notes: offer.notes || '',
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowDeleteModal(true);
  };

  // Stats
  const stats = {
    total: offers.length,
    new: offers.filter(o => o.status === 'new').length,
    under_review: offers.filter(o => o.status === 'under_review').length,
    offer_sent: offers.filter(o => o.status === 'offer_sent').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
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
        <Button onClick={fetchOffers} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Offer Management</h2>
          <p className="text-sm sm:text-base text-gray-500">Manage all land purchase offers ({offers.length} total)</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 shadow-lg">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-4">
          <p className="text-sm text-violet-600">New</p>
          <p className="text-2xl font-bold text-violet-700">{stats.new}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <p className="text-sm text-amber-600">Under Review</p>
          <p className="text-2xl font-bold text-amber-700">{stats.under_review}</p>
        </div>
        <div className="bg-cyan-50 rounded-xl border border-cyan-100 p-4">
          <p className="text-sm text-cyan-600">Offer Sent</p>
          <p className="text-2xl font-bold text-cyan-700">{stats.offer_sent}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
          <p className="text-sm text-emerald-600">Accepted</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.accepted}</p>
        </div>
        <div className="bg-rose-50 rounded-xl border border-rose-100 p-4">
          <p className="text-sm text-rose-600">Rejected</p>
          <p className="text-2xl font-bold text-rose-700">{stats.rejected}</p>
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
              placeholder="Search by seller name, email, or location..."
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
              { value: 'new', label: 'New' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'offer_sent', label: 'Offer Sent' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'expired', label: 'Expired' },
              { value: 'counter_offer', label: 'Counter Offer' },
            ]}
            className="w-full sm:w-48"
          />
          <Button variant="outline" onClick={fetchOffers} className="flex items-center gap-2 rounded-xl">
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asking Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Our Offer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOffers.map((offer, index) => (
                <tr 
                  key={offer.id} 
                  className="hover:bg-emerald-50/50 transition-colors duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{offer.seller_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{offer.seller_email || 'No email'}</p>
                      {offer.seller_phone && (
                        <p className="text-xs text-gray-400">{offer.seller_phone}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{offer.county}, {offer.state}</p>
                      <p className="text-sm text-gray-500">{offer.acreage} acres • {offer.access_type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {offer.asking_price ? (
                      <span className="text-lg font-bold text-gray-700">${offer.asking_price.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">Not specified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {offer.offer_amount ? (
                      <span className="text-lg font-bold text-emerald-600">${offer.offer_amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <CustomSelect
                      value={offer.status || 'new'}
                      onChange={(value) => handleStatusChange(offer.id, value)}
                      options={[
                        { value: 'new', label: 'New' },
                        { value: 'under_review', label: 'Under Review' },
                        { value: 'offer_sent', label: 'Offer Sent' },
                        { value: 'accepted', label: 'Accepted' },
                        { value: 'rejected', label: 'Rejected' },
                        { value: 'expired', label: 'Expired' },
                        { value: 'counter_offer', label: 'Counter Offer' },
                      ]}
                      className="w-36"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{formatDate(offer.created_at)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openDetailModal(offer)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-300"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openEditModal(offer)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(offer)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-300"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOffers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No offers found matching your criteria
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredOffers.map((offer, index) => (
          <div 
            key={offer.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{offer.seller_name || 'Unknown Seller'}</p>
                  <p className="text-sm text-gray-500">{offer.seller_email || 'No email'}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(offer.status)}`}>
                  {formatStatus(offer.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{offer.county}, {offer.state}</p>
              <p className="text-xs text-gray-400">{offer.acreage} acres • {offer.access_type}</p>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Asking Price</p>
                  <p className="font-bold text-gray-700">
                    {offer.asking_price ? `$${offer.asking_price.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Our Offer</p>
                  <p className="font-bold text-emerald-600">
                    {offer.offer_amount ? `$${offer.offer_amount.toLocaleString()}` : 'Pending'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-3">{formatDate(offer.created_at)}</p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomSelect
                    value={offer.status || 'new'}
                    onChange={(value) => handleStatusChange(offer.id, value)}
                    options={[
                      { value: 'new', label: 'New' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'offer_sent', label: 'Offer Sent' },
                      { value: 'accepted', label: 'Accepted' },
                      { value: 'rejected', label: 'Rejected' },
                      { value: 'expired', label: 'Expired' },
                      { value: 'counter_offer', label: 'Counter Offer' },
                    ]}
                  />
                </div>
                <button 
                  onClick={() => openDetailModal(offer)}
                  className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  onClick={() => openEditModal(offer)}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => openDeleteModal(offer)}
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

        {filteredOffers.length === 0 && (
          <div className="col-span-full bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg p-8 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm">No offers found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOffer && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Offer Details</h3>
                    <p className="text-sm text-gray-500">{selectedOffer.county}, {selectedOffer.state}</p>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeStyle(selectedOffer.status)}`}>
                    {formatStatus(selectedOffer.status)}
                  </span>
                  <span className="text-sm text-gray-500">Created: {formatDate(selectedOffer.created_at)}</span>
                </div>

                {/* Seller Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Seller Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{selectedOffer.seller_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedOffer.seller_email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedOffer.seller_phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Property Information
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{selectedOffer.county}, {selectedOffer.state}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Acreage</p>
                      <p className="font-medium text-gray-900">{selectedOffer.acreage} acres</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Access Type</p>
                      <p className="font-medium text-gray-900">{selectedOffer.access_type}</p>
                    </div>
                    {selectedOffer.apn && (
                      <div>
                        <p className="text-xs text-gray-500">APN</p>
                        <p className="font-medium text-gray-900">{selectedOffer.apn}</p>
                      </div>
                    )}
                    {selectedOffer.gps_pin && (
                      <div>
                        <p className="text-xs text-gray-500">GPS Pin</p>
                        <p className="font-medium text-gray-900">{selectedOffer.gps_pin}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Utilities */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Utilities & Features
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedOffer.power_available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      Power: {selectedOffer.power_available ? 'Yes' : 'No'}
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedOffer.water_available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      Water: {selectedOffer.water_available ? 'Yes' : 'No'}
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedOffer.sewer_available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      Sewer: {selectedOffer.sewer_available ? 'Yes' : 'No'}
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedOffer.flood_risk ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      Flood Risk: {selectedOffer.flood_risk ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pricing
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Asking Price</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {selectedOffer.asking_price ? `$${selectedOffer.asking_price.toLocaleString()}` : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Our Offer</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {selectedOffer.offer_amount ? `$${selectedOffer.offer_amount.toLocaleString()}` : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOffer.notes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Notes
                    </h4>
                    <p className="text-gray-700">{selectedOffer.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 flex-shrink-0">
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)} className="rounded-xl">
                    Close
                  </Button>
                  <Button 
                    onClick={() => { setShowDetailModal(false); openEditModal(selectedOffer); }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                  >
                    Edit Offer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOffer && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Edit Offer</h3>
                  <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Our Offer Amount ($)</label>
                  <Input
                    type="number"
                    value={formData.offer_amount}
                    onChange={(e) => setFormData({ ...formData, offer_amount: e.target.value })}
                    placeholder="Enter offer amount"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <CustomSelect
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value as OfferStatus })}
                    options={[
                      { value: 'new', label: 'New' },
                      { value: 'under_review', label: 'Under Review' },
                      { value: 'offer_sent', label: 'Offer Sent' },
                      { value: 'accepted', label: 'Accepted' },
                      { value: 'rejected', label: 'Rejected' },
                      { value: 'expired', label: 'Expired' },
                      { value: 'counter_offer', label: 'Counter Offer' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Add notes about this offer..."
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleEditOffer} 
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOffer && (
        <Portal>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Offer</h3>
                <p className="text-gray-500 text-center mb-6">
                  Are you sure you want to delete the offer from "{selectedOffer.seller_name || 'Unknown'}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1 rounded-xl">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDeleteOffer} 
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

export default AdminOffers;
