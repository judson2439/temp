import React from 'react';
import { 
  Deal, 
  getStageBadgeStyle,
  formatStageName,
  formatDate,
  formatCurrency,
  formatYesNoUnknown,
  getYesNoUnknownStyle,
} from './dealTypes';

interface DealDetailProps {
  deal: Deal | null;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal }) => {
  if (!deal) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Deal Detail</h2>
        <div className="text-center py-12 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Select a deal to view details</p>
        </div>
      </div>
    );
  }

  const stageBadge = getStageBadgeStyle(deal.stage);

  // Helper component for detail row
  const DetailRow = ({ label, value, isFullWidth = false }: { label: string; value: React.ReactNode; isFullWidth?: boolean }) => (
    <div className={isFullWidth ? 'col-span-2' : ''}>
      <div className="text-slate-500 text-sm">{label}:</div>
      <div className="text-slate-800 font-medium">{value || '--'}</div>
    </div>
  );

  // Helper component for badge
  const Badge = ({ value, style }: { value: string; style: string }) => (
    <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${style}`}>
      {value}
    </span>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[600px] overflow-y-auto">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Deal Detail</h2>
      
      {/* Title & APN Header */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4 overflow-hidden">
        <div className="font-bold text-slate-800 text-lg mb-1 break-words">{deal.title}</div>
        <div className="text-slate-600 text-sm mb-3 break-all">APN: {deal.apn}</div>
        

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="State" value={deal.state} />
          <DetailRow label="Purchase Price" value={formatCurrency(deal.purchasePrice)} />
          <DetailRow label="County" value={deal.county} />
          <DetailRow label="List Price" value={formatCurrency(deal.price)} />
          <DetailRow label="Acreage" value={`${deal.acreage} Acres`} />
          <DetailRow 
            label="Status" 
            value={
              <Badge 
                value={formatStageName(deal.stage)} 
                style={`${stageBadge.bg} ${stageBadge.text} border ${stageBadge.border}`} 
              />
            } 
          />
        </div>
      </div>

      {/* Property Details Section */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Property Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Zoning" value={deal.zoning} />
          <DetailRow label="Annual Tax" value={deal.annualTax} />
          <DetailRow 
            label="Road Access" 
            value={
              <Badge 
                value={formatYesNoUnknown(deal.roadAccess)} 
                style={getYesNoUnknownStyle(deal.roadAccess)} 
              />
            } 
          />
          <DetailRow 
            label="Featured" 
            value={
              <Badge 
                value={deal.isFeatured ? 'Yes' : 'No'} 
                style={deal.isFeatured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} 
              />
            } 
          />
        </div>
      </div>

      {/* Utilities Section */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Utilities</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-slate-500 text-sm">Water:</div>
            <Badge 
              value={formatYesNoUnknown(deal.water)} 
              style={getYesNoUnknownStyle(deal.water)} 
            />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Power:</div>
            <Badge 
              value={formatYesNoUnknown(deal.power)} 
              style={getYesNoUnknownStyle(deal.power)} 
            />
          </div>
          <div>
            <div className="text-slate-500 text-sm">Sewer:</div>
            <Badge 
              value={formatYesNoUnknown(deal.sewer)} 
              style={getYesNoUnknownStyle(deal.sewer)} 
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Latitude" value={deal.latitude?.toFixed(6)} />
          <DetailRow label="Longitude" value={deal.longitude?.toFixed(6)} />
        </div>
        {deal.latitude && deal.longitude && (
          <a 
            href={`https://www.google.com/maps?q=${deal.latitude},${deal.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View on Google Maps
          </a>
        )}
      </div>

      {/* Dates Section */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Important Dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Closing Date" value={formatDate(deal.closingDate)} />
          <DetailRow label="Next Follow-Up" value={formatDate(deal.nextFollowUp)} />
          <DetailRow label="Last Contact" value={formatDate(deal.lastContactDate)} />
          <DetailRow label="Created" value={formatDate(deal.createdAt)} />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <DetailRow label="Views" value={deal.views.toLocaleString()} />
          <DetailRow label="Images" value={deal.images?.length || 0} />
        </div>
      </div>

      {/* Thumbnail Preview */}
      {deal.thumbnail && (
        <div className="mb-4">
          <h3 className="font-semibold text-slate-800 mb-3">Thumbnail</h3>
          <img 
            src={deal.thumbnail} 
            alt={deal.title}
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Description Section */}
      {deal.description && (
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{deal.description}</p>
        </div>
      )}

      {/* Notes Section */}
      {deal.notes && (
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Notes
          </h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{deal.notes}</p>
        </div>
      )}
    </div>
  );
};

export default DealDetail;
