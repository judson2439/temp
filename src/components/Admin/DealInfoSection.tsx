import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { FollowDeal, FollowStage, formatCurrency } from './dealTypes';

// Define the six scenario tables
const SCENARIO_TABLES = [
  { id: 'ideal', tableName: 'follow_ideal_scenario' },
  { id: 'listing', tableName: 'follow_listing_scenario' },
  { id: 'minimum', tableName: 'follow_minimum_scenario' },
  { id: 'original', tableName: 'follow_original_scenario' },
  { id: 'realistic', tableName: 'follow_realistic_scenario' },
  { id: 'renegotiated', tableName: 'follow_renegotiated_scenario' },
];

interface DealInfoSectionProps {
  deal: FollowDeal | null;
  stages: FollowStage[];
  onScenariosUpdated?: () => void;
}


interface DealInfo {
  id: string;
  deal_id: number;
  purchase_price: number | null;
  emd: number | null;
  funding_fee: number | null;
  seller_closing_costs_paid_by_us: number | null;
  buyer_closing_credit: number | null;
  recording_state_fees: number | null;
  back_taxes_paid: number | null;
  non_resident_withholding_enabled: boolean | null;
  non_resident_withholding_amount: number | null;
  non_resident_withholding_percent: number | null;
  soil_test_cost: number | null;
  survey_cost: number | null;
  wetlands_or_env_review_cost: number | null;
  perc_option_4_cost: number | null;
  engineering_cost: number | null;
  platting_cost: number | null;
  entitlement_legal_cost: number | null;
  target_profit: number | null;
  default_realtor_fee_percent: number | null;
  drone_photos_cost: number | null;
  landscaping_cost: number | null;
  signage_cost: number | null;
  created_at: string;
  updated_at: string | null;
}

interface Scenario {
  id: string;
  deal_id: number;
  scenario_type: string;
  tableName: string;
  sale_price: number | null;
  realtor_fee_percent: number | null;
  realtor_fee: number | null;
  total_costs: number | null;
  net_profit: number | null;
  roi_percent: number | null;
  coc_roi: number | null;
  min_sale_price: number | null;
  created_at: string;
  updated_at: string;
}

interface TitleCompany {
  id: string;
  name: string;
  base_fee: number | null;
}

type FormDataType = Omit<DealInfo, 'id' | 'deal_id' | 'created_at' | 'updated_at'>;

const defaultDealInfo: FormDataType = {
  purchase_price: null,
  emd: null,
  funding_fee: null,
  seller_closing_costs_paid_by_us: null,
  buyer_closing_credit: null,
  recording_state_fees: null,
  back_taxes_paid: null,
  non_resident_withholding_enabled: false,
  non_resident_withholding_amount: null,
  non_resident_withholding_percent: null,
  soil_test_cost: null,
  survey_cost: null,
  wetlands_or_env_review_cost: null,
  perc_option_4_cost: null,
  engineering_cost: null,
  platting_cost: null,
  entitlement_legal_cost: null,
  target_profit: null,
  default_realtor_fee_percent: null,
  drone_photos_cost: null,
  landscaping_cost: null,
  signage_cost: null,
};

// Currency input field component - defined outside to prevent re-creation
interface CurrencyFieldProps {
  label: string;
  fieldName: string;
  value: number | null;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const CurrencyField: React.FC<CurrencyFieldProps> = React.memo(({ 
  label, 
  fieldName, 
  value,
  onChange,
  disabled = false
}) => (
  <div>
    <label className={`block text-xs uppercase tracking-wide mb-1 ${disabled ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    <div className="relative">
      <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>$</span>
      <input
        type="number"
        step="0.01"
        value={value !== null && value !== undefined ? value : ''}
        onChange={(e) => onChange(fieldName, e.target.value)}
        disabled={disabled}
        className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled 
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        placeholder="0"
      />
    </div>
  </div>
));

CurrencyField.displayName = 'CurrencyField';

// Percentage input field component - defined outside to prevent re-creation
interface PercentFieldProps {
  label: string;
  fieldName: string;
  value: number | null;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

const PercentField: React.FC<PercentFieldProps> = React.memo(({ 
  label, 
  fieldName, 
  value,
  onChange,
  disabled = false
}) => (
  <div>
    <label className={`block text-xs uppercase tracking-wide mb-1 ${disabled ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    <div className="relative">
      <input
        type="number"
        step="0.01"
        value={value !== null && value !== undefined ? value : ''}
        onChange={(e) => onChange(fieldName, e.target.value)}
        disabled={disabled}
        className={`w-full pl-3 pr-7 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          disabled 
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        placeholder="0"
      />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>%</span>
    </div>
  </div>
));

PercentField.displayName = 'PercentField';


const DealInfoSection: React.FC<DealInfoSectionProps> = ({ deal, stages, onScenariosUpdated }) => {

  const [dealInfo, setDealInfo] = useState<DealInfo | null>(null);
  const [formData, setFormData] = useState<FormDataType>(defaultDealInfo);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // State for scenarios and title company (for subtotal calculation)
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [titleCompanyBaseFee, setTitleCompanyBaseFee] = useState<number>(0);

  // Fetch deal info when deal changes
  useEffect(() => {
    if (deal?.id) {
      fetchDealInfo(deal.id);
      fetchAllScenarios(deal.id);
    } else {
      setDealInfo(null);
      setFormData(defaultDealInfo);
      setScenarios([]);
      setTitleCompanyBaseFee(0);
    }
  }, [deal?.id]);

  const fetchDealInfo = async (dealId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('follow_deal_info')
        .select('*')
        .eq('deal_id', dealId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching deal info:', error);
      }

      if (data) {
        setDealInfo(data);
        setFormData({
          purchase_price: data.purchase_price,
          emd: data.emd,
          funding_fee: data.funding_fee,
          seller_closing_costs_paid_by_us: data.seller_closing_costs_paid_by_us,
          buyer_closing_credit: data.buyer_closing_credit,
          recording_state_fees: data.recording_state_fees,
          back_taxes_paid: data.back_taxes_paid,
          non_resident_withholding_enabled: data.non_resident_withholding_enabled,
          non_resident_withholding_amount: data.non_resident_withholding_amount,
          non_resident_withholding_percent: data.non_resident_withholding_percent,
          soil_test_cost: data.soil_test_cost,
          survey_cost: data.survey_cost,
          wetlands_or_env_review_cost: data.wetlands_or_env_review_cost,
          perc_option_4_cost: data.perc_option_4_cost,
          engineering_cost: data.engineering_cost,
          platting_cost: data.platting_cost,
          entitlement_legal_cost: data.entitlement_legal_cost,
          target_profit: data.target_profit,
          default_realtor_fee_percent: data.default_realtor_fee_percent,
          drone_photos_cost: data.drone_photos_cost,
          landscaping_cost: data.landscaping_cost,
          signage_cost: data.signage_cost,
        });
      } else {
        setDealInfo(null);
        setFormData(defaultDealInfo);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch scenarios from all six tables
  const fetchAllScenarios = async (dealId: number) => {
    try {
      const allScenarios: Scenario[] = [];

      // Fetch from each scenario table
      for (const scenarioTable of SCENARIO_TABLES) {
        const { data, error } = await supabase
          .from(scenarioTable.tableName)
          .select('*')
          .eq('deal_id', dealId)
          .maybeSingle();

        if (error) {
          console.error(`Error fetching from ${scenarioTable.tableName}:`, error);
          continue;
        }

        if (data) {
          allScenarios.push({
            ...data,
            scenario_type: scenarioTable.id,
            tableName: scenarioTable.tableName,
          });
        }
      }

      setScenarios(allScenarios);
    } catch (err) {
      console.error('Error fetching scenarios:', err);
    }
  };

  const fetchTitleCompanyBaseFee = async (titleCompanyId: string) => {
    try {
      const { data, error } = await supabase
        .from('title_companies')
        .select('base_fee')
        .eq('id', titleCompanyId)
        .single();

      if (error) {
        console.error('Error fetching title company:', error);
        setTitleCompanyBaseFee(0);
        return;
      }

      setTitleCompanyBaseFee(data?.base_fee || 0);
    } catch (err) {
      console.error('Error fetching title company:', err);
      setTitleCompanyBaseFee(0);
    }
  };

  // Calculate expenses subtotal (everything except purchase price)
  const expensesSubtotal = useMemo(() => {
    // Get the first scenario's realtor_fee and sale_price (or use 0 if not available)
    const firstScenario = scenarios[0];
    const realtorFee = firstScenario?.realtor_fee || 0;
    const salePrice = firstScenario?.sale_price || 0;

    // Calculate non-resident withholding
    let nonResidentWithholding = 0;
    if (formData.non_resident_withholding_enabled) {
      if ((formData.non_resident_withholding_amount || 0) > 0) {
        nonResidentWithholding = formData.non_resident_withholding_amount || 0;
      } else {
        nonResidentWithholding = salePrice * ((formData.non_resident_withholding_percent || 0) / 100);
      }
    }

    // Calculate expenses subtotal (excluding purchase price)
    const expenses = 
      titleCompanyBaseFee +
      realtorFee +
      (formData.emd || 0) +
      (formData.funding_fee || 0) +
      (formData.soil_test_cost || 0) +
      (formData.seller_closing_costs_paid_by_us || 0) +
      (formData.buyer_closing_credit || 0) +
      (formData.recording_state_fees || 0) +
      (formData.back_taxes_paid || 0) +
      nonResidentWithholding +
      (formData.wetlands_or_env_review_cost || 0) +
      (formData.survey_cost || 0) +
      (formData.perc_option_4_cost || 0) +
      (formData.engineering_cost || 0) +
      (formData.platting_cost || 0) +
      (formData.entitlement_legal_cost || 0) +
      (formData.drone_photos_cost || 0) +
      (formData.landscaping_cost || 0) +
      (formData.signage_cost || 0);

    return expenses;
  }, [formData, scenarios, titleCompanyBaseFee]);

  // Land Purchase Price
  const landPurchasePrice = formData.purchase_price || 0;

  // Total Cost = Land Price + Expenses Subtotal
  const totalCost = landPurchasePrice + expensesSubtotal;



  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'non_resident_withholding_enabled') {
      setFormData(prev => ({ ...prev, [field]: value as boolean }));
    } else {
      const numValue = value === '' ? null : parseFloat(value as string);
      setFormData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleSave = async () => {
    if (!deal?.id) return;

    setSaving(true);
    setMessage(null);

    try {
      const dataToSave = {
        ...formData,
        deal_id: deal.id,
        updated_at: new Date().toISOString(),
      };

      if (dealInfo?.id) {
        // Update existing record
        const { error } = await supabase
          .from('follow_deal_info')
          .update(dataToSave)
          .eq('id', dealInfo.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Deal info updated successfully!' });
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('follow_deal_info')
          .insert(dataToSave)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setDealInfo(data);
        }
        setMessage({ type: 'success', text: 'Deal info created successfully!' });
      }

      // Call edge function to calculate and update all scenario fields
      await calculateScenarios(deal.id);

      // Refresh scenarios to get updated data
      await fetchAllScenarios(deal.id);

      // Notify parent that scenarios have been updated
      if (onScenariosUpdated) {
        onScenariosUpdated();
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (err: any) {
      console.error('Error saving deal info:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to save deal info' });
    } finally {
      setSaving(false);
    }
  };


  // Function to call edge function to calculate and update all scenario fields
  const calculateScenarios = async (dealId: number) => {
    try {
      console.log('Calling calculate-scenarios edge function for deal:', dealId);
      
      const { data, error } = await supabase.functions.invoke('calculate-scenarios', {
        body: { deal_id: dealId }
      });

      if (error) {
        console.error('Error calling calculate-scenarios:', error);
        return;
      }

      console.log('calculate-scenarios response:', data);
    } catch (err) {
      console.error('Error invoking calculate-scenarios:', err);
    }
  };


  if (!deal) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Deal Info</h2>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Select a deal to view info</p>
        </div>
      </div>
    );
  }

  const stageName = stages.find(s => s.id === deal.stageId)?.name || 'Unknown Stage';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Deal Info</h2>
        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {stageName}
        </span>
      </div>

      {/* Deal Name */}
      <div className="mb-4 pb-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-800 break-words">{deal.name || 'Untitled Deal'}</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {/* Purchase & Fees Section */}
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Purchase & Fees</h4>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Purchase Price" fieldName="purchase_price" value={formData.purchase_price} onChange={handleInputChange} />
              <CurrencyField label="EMD" fieldName="emd" value={formData.emd} onChange={handleInputChange} />
              <CurrencyField label="Funding Fee" fieldName="funding_fee" value={formData.funding_fee} onChange={handleInputChange} />
              <CurrencyField label="Recording/State Fees" fieldName="recording_state_fees" value={formData.recording_state_fees} onChange={handleInputChange} />
            </div>
          </div>

          {/* Closing Costs Section */}
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Closing Costs</h4>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Seller Closing Costs (Paid by Us)" fieldName="seller_closing_costs_paid_by_us" value={formData.seller_closing_costs_paid_by_us} onChange={handleInputChange} />
              <CurrencyField label="Buyer Closing Credit" fieldName="buyer_closing_credit" value={formData.buyer_closing_credit} onChange={handleInputChange} />
              <CurrencyField label="Back Taxes Paid" fieldName="back_taxes_paid" value={formData.back_taxes_paid} onChange={handleInputChange} />
            </div>
          </div>

          {/* Non-Resident Withholding Section */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">Non-Resident Withholding</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.non_resident_withholding_enabled ?? false}
                    onChange={(e) => handleInputChange('non_resident_withholding_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span className="text-sm text-slate-700">Enabled</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <CurrencyField 
                  label="Withholding Amount" 
                  fieldName="non_resident_withholding_amount" 
                  value={formData.non_resident_withholding_amount} 
                  onChange={handleInputChange} 
                  disabled={!formData.non_resident_withholding_enabled}
                />
                <PercentField 
                  label="Withholding Percent" 
                  fieldName="non_resident_withholding_percent" 
                  value={formData.non_resident_withholding_percent} 
                  onChange={handleInputChange} 
                  disabled={!formData.non_resident_withholding_enabled}
                />
              </div>

            </div>
          </div>

          {/* Due Diligence Costs Section */}
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Due Diligence Costs</h4>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Soil Test Cost" fieldName="soil_test_cost" value={formData.soil_test_cost} onChange={handleInputChange} />
              <CurrencyField label="Survey Cost" fieldName="survey_cost" value={formData.survey_cost} onChange={handleInputChange} />
              <CurrencyField label="Wetlands/Env Review" fieldName="wetlands_or_env_review_cost" value={formData.wetlands_or_env_review_cost} onChange={handleInputChange} />
              <CurrencyField label="Perc Option 4 Cost" fieldName="perc_option_4_cost" value={formData.perc_option_4_cost} onChange={handleInputChange} />
            </div>
          </div>

          {/* Development Costs Section */}
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Development Costs</h4>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Engineering Cost" fieldName="engineering_cost" value={formData.engineering_cost} onChange={handleInputChange} />
              <CurrencyField label="Platting Cost" fieldName="platting_cost" value={formData.platting_cost} onChange={handleInputChange} />
              <CurrencyField label="Entitlement/Legal Cost" fieldName="entitlement_legal_cost" value={formData.entitlement_legal_cost} onChange={handleInputChange} />
            </div>
          </div>

          {/* Marketing & Property Costs Section */}
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-3">Marketing & Property Costs</h4>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Drone Photos" fieldName="drone_photos_cost" value={formData.drone_photos_cost} onChange={handleInputChange} />
              <CurrencyField label="Landscaping" fieldName="landscaping_cost" value={formData.landscaping_cost} onChange={handleInputChange} />
              <CurrencyField label="Signage Cost" fieldName="signage_cost" value={formData.signage_cost} onChange={handleInputChange} />
            </div>
          </div>

          {/* Profit & Commission Section */}
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
            <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">Profit & Commission</h4>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Target Profit" fieldName="target_profit" value={formData.target_profit} onChange={handleInputChange} />
              <PercentField label="Default Realtor Fee %" fieldName="default_realtor_fee_percent" value={formData.default_realtor_fee_percent} onChange={handleInputChange} />
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Cost Breakdown Display */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="space-y-2">
          {/* Land Purchase Price */}
          <div className="flex items-center justify-between py-3 px-4 bg-white border-l-4 border-slate-300 rounded-r-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm text-slate-600">Land Purchase Price</span>
            </div>
            <span className="text-base font-semibold text-slate-800">{formatCurrency(landPurchasePrice)}</span>
          </div>

          {/* Expenses Subtotal */}
          <div className="py-3 px-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-amber-700">Expenses Subtotal</span>
              </div>
              <span className="text-base font-semibold text-amber-700">{formatCurrency(expensesSubtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-amber-600/70 ml-6">
              Title Fee, Realtor Fee, EMD, Taxes, Closing Costs, Due Diligence, Marketing, etc.
            </p>
          </div>

          {/* Total Cost */}
          <div className="py-4 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold text-white uppercase tracking-wide">Total Cost</span>
              </div>
              <span className="text-xl font-bold text-white">{formatCurrency(totalCost)}</span>
            </div>
            <p className="mt-1 text-xs text-white/70 text-right">
              {formatCurrency(landPurchasePrice)} + {formatCurrency(expensesSubtotal)} = {formatCurrency(totalCost)}
            </p>
          </div>
        </div>
      </div>




      {/* Save Button */}
      <div className="mt-4">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Deal Info
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DealInfoSection;
