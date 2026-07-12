import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Package, Tag, Layers, DollarSign, Calendar,
  FileText, MapPin, CheckCircle2, AlertCircle, Loader2,
  ToggleLeft, ToggleRight, ScanLine, Building2, Wrench
} from 'lucide-react';

import { organizationService } from '../../organization/services/organizationService';
import { assetService } from '../services/assetService';

// ─── Field Components ─────────────────────────────────────────────────────────

function FieldWrapper({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#374151] uppercase tracking-wider">
        {label} {required && <span className="text-[#EF4444]">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-[#EF4444] font-semibold">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error.message}
        </p>
      )}
    </div>
  );
}

function Input({ icon: Icon, error, ...props }) {
  return (
    <div className={`flex items-center gap-2.5 bg-white border rounded-xl px-3.5 h-11 transition-all duration-200 ${
      error ? 'border-[#EF4444] ring-2 ring-red-100' : 'border-[#E5E7EB] hover:border-[#7C3AED] focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-purple-100'
    }`}>
      {Icon && <Icon className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
      <input
        className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none min-w-0"
        {...props}
      />
    </div>
  );
}

function Select({ icon: Icon, error, children, ...props }) {
  return (
    <div className={`flex items-center gap-2.5 bg-white border rounded-xl px-3.5 h-11 transition-all duration-200 ${
      error ? 'border-[#EF4444] ring-2 ring-red-100' : 'border-[#E5E7EB] hover:border-[#7C3AED] focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-purple-100'
    }`}>
      {Icon && <Icon className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
      <select
        className="flex-1 bg-transparent text-sm text-[#111827] outline-none min-w-0 cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F4F6] bg-gradient-to-r from-[#F9F5FF] to-white">
        <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#7C3AED]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#111827]">{title}</h3>
          {subtitle && <p className="text-xs text-[#6B7280]">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterAssetPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isBookable, setIsBookable] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      categoryId: '',
      serialNumber: '',
      acquisitionDate: '',
      acquisitionCost: '',
      location: '',
      condition: 'GOOD',
      description: '',
    },
  });

  useEffect(() => {
    organizationService.getCategories()
      .then(setCategories)
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    try {
      const payload = {
        name: data.name,
        categoryId: data.categoryId,
        ...(data.serialNumber && { serialNumber: data.serialNumber }),
        ...(data.acquisitionDate && { acquisitionDate: new Date(data.acquisitionDate).toISOString() }),
        ...(data.acquisitionCost && { acquisitionCost: parseFloat(data.acquisitionCost) }),
        ...(data.location && { location: data.location }),
        condition: data.condition || 'GOOD',
        isBookable,
      };
      await assetService.registerAsset(payload);
      setSubmitStatus('success');
      setTimeout(() => navigate('/assets/directory'), 1500);
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    }
  };

  const handleCancel = () => navigate('/assets/directory');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="w-9 h-9 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 flex items-center justify-center text-[#475569] hover:text-[#111827] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
            Register New Asset
          </h1>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] pl-12">
          <span>Dashboard</span>
          <span className="text-gray-300">/</span>
          <span>Assets</span>
          <span className="text-gray-300">/</span>
          <span className="text-[#7C3AED]">Register New Asset</span>
        </div>
      </div>

      {/* Status Banner */}
      {submitStatus === 'success' && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-green-700">Asset registered successfully! Redirecting…</p>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-red-700">Failed to register asset. Please check your inputs and try again.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Section 1 — Basic Info */}
        <SectionCard icon={Package} title="Basic Information" subtitle="Core details that identify this asset">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            <FieldWrapper label="Asset Name" required error={errors.name}>
              <Input
                icon={Package}
                placeholder="e.g. Dell XPS 15 Laptop"
                error={errors.name}
                {...register('name', { required: 'Asset name is required' })}
              />
            </FieldWrapper>

            <FieldWrapper label="Category" required error={errors.categoryId}>
              <Select
                icon={Layers}
                error={errors.categoryId}
                {...register('categoryId', { required: 'Category is required' })}
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Condition" error={errors.condition}>
              <Select
                icon={Wrench}
                error={errors.condition}
                {...register('condition')}
              >
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="DAMAGED">Damaged</option>
                <option value="UNUSABLE">Unusable</option>
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Serial Number" error={errors.serialNumber}>
              <Input
                icon={ScanLine}
                placeholder="e.g. SN-2024-00123"
                error={errors.serialNumber}
                {...register('serialNumber')}
              />
            </FieldWrapper>

            <FieldWrapper label="Location" error={errors.location}>
              <Input
                icon={MapPin}
                placeholder="e.g. Floor 3 – IT Rack B"
                error={errors.location}
                {...register('location')}
              />
            </FieldWrapper>

            {/* Bookable Toggle */}
            <FieldWrapper label="Bookable Resource">
              <button
                type="button"
                onClick={() => setIsBookable(prev => !prev)}
                className={`flex items-center gap-3 h-11 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isBookable
                    ? 'bg-[#F9F5FF] border-[#7C3AED] text-[#7C3AED]'
                    : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#7C3AED]'
                }`}
              >
                {isBookable ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
                {isBookable ? 'Yes — Can be booked' : 'No — Not bookable'}
              </button>
            </FieldWrapper>
          </div>
        </SectionCard>

        {/* Section 2 — Financial Info */}
        <SectionCard icon={DollarSign} title="Financial Details" subtitle="Purchase and warranty information for accounting">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            <FieldWrapper label="Acquisition Date" error={errors.acquisitionDate}>
              <Input
                icon={Calendar}
                type="date"
                error={errors.acquisitionDate}
                {...register('acquisitionDate')}
              />
            </FieldWrapper>

            <FieldWrapper label="Acquisition Cost (₹)" error={errors.acquisitionCost}>
              <Input
                icon={DollarSign}
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 85000.00"
                error={errors.acquisitionCost}
                {...register('acquisitionCost', {
                  min: { value: 0, message: 'Cost must be positive' },
                })}
              />
            </FieldWrapper>

          </div>
        </SectionCard>

        {/* Section 3 — Notes */}
        <SectionCard icon={FileText} title="Additional Notes" subtitle="Optional notes visible to asset managers">
          <div className={`flex items-start gap-2.5 bg-white border rounded-xl px-3.5 py-3 transition-all duration-200 ${
            errors.description ? 'border-[#EF4444] ring-2 ring-red-100' : 'border-[#E5E7EB] hover:border-[#7C3AED] focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-purple-100'
          }`}>
            <FileText className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-0.5" />
            <textarea
              className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none resize-none min-h-[96px]"
              placeholder="Enter any additional notes about this asset's condition, history, or special handling requirements…"
              {...register('description')}
            />
          </div>
        </SectionCard>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 pb-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#374151] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-70 text-white text-sm font-bold transition-colors cursor-pointer shadow-md shadow-purple-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Register Asset
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
