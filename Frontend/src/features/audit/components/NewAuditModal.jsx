import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle } from 'lucide-react';
import FormInput from '../../assets/components/FormInput';
import FormSelect from '../../assets/components/FormSelect';
import FormTextarea from '../../assets/components/FormTextarea';
import DatePicker from '../../assets/components/DatePicker';
import UploadArea from './UploadArea';

import auditData from '../data/data.json';

export default function NewAuditModal({ isOpen, onClose, onSubmitSuccess, onSaveDraft }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      location: '',
      auditorName: '',
      scheduledOn: '2025-05-15', // Default reference today
      startTime: '10:00',
      duration: '1 Hour',
      scope: [],
      checklistTemplate: '',
      notes: '',
    },
  });

  const watchTemplate = watch('checklistTemplate');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedFile(null);
    }
  }, [isOpen, reset]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const typeOptions = useMemo(() => {
    return auditData.auditTypes.map((t) => ({ value: t, label: t }));
  }, []);

  const locationOptions = useMemo(() => {
    return auditData.locations.map((loc) => ({ value: loc, label: loc }));
  }, []);

  const auditorOptions = useMemo(() => {
    return auditData.auditors.map((aud) => ({ value: aud.name, label: `${aud.name} (${aud.department})` }));
  }, []);

  const durationOptions = [
    { value: '30 Minutes', label: '30 Minutes' },
    { value: '1 Hour', label: '1 Hour' },
    { value: '2 Hours', label: '2 Hours' },
    { value: 'Half Day', label: 'Half Day' },
    { value: 'Full Day', label: 'Full Day' },
  ];

  const templateOptions = Object.keys(auditData.checklists).map((key) => ({
    value: key,
    label: key,
  }));

  // Preview checklist tasks dynamically
  const previewTasks = useMemo(() => {
    if (!watchTemplate) return [];
    return auditData.checklists[watchTemplate] || [];
  }, [watchTemplate]);

  const handleSaveDraftClick = () => {
    const values = getValues();
    onSaveDraft({ ...values, attachment: selectedFile });
  };

  const handleFormSubmit = (data) => {
    const selectedAuditorObj = auditData.auditors.find((aud) => aud.name === data.auditorName);
    
    // Build initial checklist items from template
    const initialChecklist = previewTasks.map((t, idx) => ({
      id: `c-${idx}`,
      task: t.task,
      completed: false, // Start scheduled audits unchecked
    }));

    const newAudit = {
      ...data,
      auditor: selectedAuditorObj || {
        name: data.auditorName,
        department: 'Operations',
        avatar: '/avatars/default.png',
      },
      checklist: initialChecklist,
      attachment: selectedFile,
    };
    onSubmitSuccess(newAudit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[800px] max-h-[90vh] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50">
          <div className="flex flex-col gap-0.5 select-none text-left">
            <h2 className="text-base font-black text-[#111827]">Create New Audit</h2>
            <p className="text-xs font-semibold text-[#6B7280]">
              Schedule a new audit for assets, departments, or locations.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-[#9CA3AF] hover:text-[#475569] rounded-xl transition-colors cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin text-left">
          <form id="new-audit-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
            
            {/* Section 1: Core Parameters */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
                1. General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Audit Name"
                  placeholder="e.g. IT Assets Audit - May 2025"
                  required
                  error={errors.name}
                  {...register('name', { required: 'Audit name is required' })}
                />

                <FormSelect
                  label="Audit Type"
                  placeholder="Select Type"
                  required
                  options={typeOptions}
                  error={errors.type}
                  {...register('type', { required: 'Audit type is required' })}
                />

                <FormSelect
                  label="Location"
                  placeholder="Select Location"
                  required
                  options={locationOptions}
                  error={errors.location}
                  {...register('location', { required: 'Location is required' })}
                />

                <FormSelect
                  label="Assigned Auditor"
                  placeholder="Choose Auditor"
                  required
                  options={auditorOptions}
                  error={errors.auditorName}
                  {...register('auditorName', { required: 'Auditor assignment is required' })}
                />
              </div>
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 2: Timing parameters */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
                2. Scheduling & Duration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DatePicker
                  label="Audit Date"
                  required
                  error={errors.scheduledOn}
                  {...register('scheduledOn', { required: 'Scheduled date is required' })}
                />

                <div className="flex flex-col gap-1 w-full text-left">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
                    Start Time
                  </span>
                  <input
                    type="time"
                    className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-3.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-colors cursor-pointer"
                    {...register('startTime')}
                  />
                </div>

                <FormSelect
                  label="Expected Duration"
                  placeholder="Duration"
                  options={durationOptions}
                  error={errors.duration}
                  {...register('duration')}
                />
              </div>
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 3: Checkbox Scope */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
                3. Audit Scope
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {['Assets', 'Departments', 'Inventory', 'Compliance', 'Safety', 'Documents'].map((scopeItem) => (
                  <label
                    key={scopeItem}
                    className="flex items-center gap-2 p-3 border border-[#E5E7EB] rounded-xl bg-gray-50/20 hover:bg-gray-50/50 cursor-pointer select-none transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={scopeItem}
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('scope')}
                    />
                    <span className="text-xs font-semibold text-[#475569]">{scopeItem}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 4: Checklist template */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
                4. Checklist Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <FormSelect
                  label="Checklist Template"
                  placeholder="Select Template"
                  options={templateOptions}
                  {...register('checklistTemplate')}
                />

                {/* Previews */}
                {previewTasks.length > 0 && (
                  <div className="flex flex-col gap-2 p-4 border border-[#E5E7EB] rounded-2xl bg-gray-50/30">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5">
                      Checklist Preview ({previewTasks.length} tasks)
                    </span>
                    <div className="flex flex-col gap-1.5 mt-1">
                      {previewTasks.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <span>{t.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 5 & 6: Documentation and Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <FormTextarea
                label="Notes / Instructions"
                placeholder="Additional instructions for the auditor..."
                maxLength={250}
                {...register('notes')}
              />

              <UploadArea label="Attachments" onFileSelect={setSelectedFile} />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="w-full sm:w-auto h-11 px-5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Save Draft
            </button>

            <button
              type="submit"
              form="new-audit-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-md shadow-[#7C3AED]/15"
            >
              Schedule Audit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
