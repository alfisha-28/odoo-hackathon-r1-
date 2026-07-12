import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Check } from 'lucide-react';
import FormInput from '../../assets/components/FormInput';
import FormSelect from '../../assets/components/FormSelect';
import FormTextarea from '../../assets/components/FormTextarea';
import DatePicker from '../../assets/components/DatePicker';

export default function ScheduleReportModal({
  isOpen,
  onClose,
  reportTypes = [],
  frequencies = [],
  recipientsList = []
}) {
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      reportName: '',
      reportType: '',
      frequency: '',
      deliveryTime: '08:00',
      startDate: '2025-05-19',
      formats: {
        pdf: true,
        excel: false,
        csv: false,
      },
      includeCharts: true,
      includeSummary: true,
      emailSubject: '',
      notes: '',
    },
  });

  const watchReportName = watch('reportName');
  const watchReportType = watch('reportType');

  // Sync email subject with report name automatically for better UX
  useEffect(() => {
    if (watchReportName) {
      setValue('emailSubject', `Automated Report: ${watchReportName}`);
    } else if (watchReportType) {
      setValue('emailSubject', `Automated Report: ${watchReportType}`);
    }
  }, [watchReportName, watchReportType, setValue]);

  // Prevent background scroll when open
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedRecipients([]);
      setShowRecipientDropdown(false);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleRecipientToggle = (email) => {
    if (selectedRecipients.includes(email)) {
      setSelectedRecipients(selectedRecipients.filter((r) => r !== email));
    } else {
      setSelectedRecipients([...selectedRecipients, email]);
    }
  };

  const handleFormSubmit = (data) => {
    if (selectedRecipients.length === 0) {
      alert('Error: Please select at least one recipient.');
      return;
    }
    const submissionData = {
      ...data,
      recipients: selectedRecipients,
      scheduledAt: new Date().toISOString(),
      status: 'Active',
    };
    console.log('Successfully scheduled automated report:', submissionData);
    alert(`Success: Report "${data.reportName}" scheduled successfully! Check console for full details.`);
    onClose();
  };

  const handleSaveDraft = () => {
    const data = watch();
    const draftData = {
      ...data,
      recipients: selectedRecipients,
      status: 'Draft',
    };
    console.log('Saved report configuration draft:', draftData);
    alert(`Success: Report configuration draft saved! Check console for full details.`);
    onClose();
  };

  const typeOptions = reportTypes.map((t) => ({ value: t, label: t }));
  const freqOptions = frequencies.map((f) => ({ value: f, label: f }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box (width 760px) */}
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-[760px] max-h-[90vh] flex flex-col relative z-10 overflow-hidden transform transition-all scale-100 duration-300 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-4.5 bg-gray-50/50">
          <div className="flex flex-col gap-0.5 select-none text-left">
            <h2 className="text-base font-black text-[#111827]">Schedule Automated Report</h2>
            <p className="text-xs font-semibold text-[#6B7280]">
              Generate reports automatically and deliver them via email.
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

        {/* Scrollable Form Body */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin text-left">
          <form id="schedule-report-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
            
            {/* Section 1: Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Report Name"
                placeholder="e.g. Weekly Asset Allocation Summary"
                required
                error={errors.reportName}
                {...register('reportName', { required: 'Report name is required' })}
              />

              <FormSelect
                label="Report Type"
                placeholder="Select Report Type"
                required
                options={typeOptions}
                error={errors.reportType}
                {...register('reportType', { required: 'Report type is required' })}
              />
            </div>

            {/* Section 2: Frequency & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                label="Frequency"
                placeholder="Select Frequency"
                required
                options={freqOptions}
                error={errors.frequency}
                {...register('frequency', { required: 'Frequency is required' })}
              />

              <div className="flex flex-col gap-1 w-full text-left">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
                  Delivery Time
                </span>
                <input
                  type="time"
                  className="w-full h-11 bg-white border border-[#E5E7EB] rounded-xl px-3.5 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-colors cursor-pointer"
                  {...register('deliveryTime', { required: 'Delivery time is required' })}
                />
              </div>

              <DatePicker
                label="Start Date"
                required
                error={errors.startDate}
                {...register('startDate', { required: 'Start date is required' })}
              />
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 3: Recipients (Custom Multi-select dropdown with badges) */}
            <div className="flex flex-col gap-1 w-full relative">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
                Recipients <span className="text-red-500">*</span>
              </span>
              
              {/* Trigger Input Box displaying Badges */}
              <div
                onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                className="min-h-11 w-full bg-white border border-[#E5E7EB] rounded-xl p-2 flex flex-wrap gap-1.5 items-center cursor-pointer hover:border-gray-300 transition-colors"
              >
                {selectedRecipients.length === 0 ? (
                  <span className="text-xs text-[#9CA3AF] pl-1.5">Select email recipients...</span>
                ) : (
                  selectedRecipients.map((email) => (
                    <span
                      key={email}
                      className="bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE] text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1.5 transition-all hover:bg-[#EDE9FE]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecipientToggle(email);
                      }}
                    >
                      {email}
                      <X className="w-3 h-3 hover:text-red-500 cursor-pointer" />
                    </span>
                  ))
                )}
              </div>

              {/* Dropdown Options overlay */}
              {showRecipientDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {recipientsList.map((email) => {
                    const isSelected = selectedRecipients.includes(email);
                    return (
                      <button
                        key={email}
                        type="button"
                        onClick={() => handleRecipientToggle(email)}
                        className={`w-full text-left py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer
                          ${isSelected ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'hover:bg-gray-50 text-[#475569]'}
                        `}
                      >
                        <span>{email}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#7C3AED]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 4: Formatting Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
                  Format Options
                </span>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('formats.pdf')}
                    />
                    <span>PDF Document</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('formats.excel')}
                    />
                    <span>Excel Spreadsheet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('formats.csv')}
                    />
                    <span>CSV File</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
                  Inclusions
                </span>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('includeCharts')}
                    />
                    <span>Include Charts</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#475569]">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                      {...register('includeSummary')}
                    />
                    <span>Include Summary</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F3F4F6] w-full" />

            {/* Section 5: Email Settings & Notes */}
            <FormInput
              label="Email Subject Line"
              placeholder="Enter subject for automated email dispatch"
              required
              error={errors.emailSubject}
              {...register('emailSubject', { required: 'Email subject is required' })}
            />

            <FormTextarea
              label="Cover Note / Instructions"
              placeholder="Provide a cover message or description that should accompany the report..."
              maxLength={250}
              {...register('notes')}
            />

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
              onClick={handleSaveDraft}
              className="w-full sm:w-auto h-11 px-5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Save Draft
            </button>

            <button
              type="submit"
              form="schedule-report-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 shadow-md shadow-[#7C3AED]/15"
            >
              Schedule Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
