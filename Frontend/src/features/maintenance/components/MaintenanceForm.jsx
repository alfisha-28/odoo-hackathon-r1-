import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../../assets/components/FormInput';
import FormSelect from '../../assets/components/FormSelect';
import FormTextarea from '../../assets/components/FormTextarea';
import DatePicker from '../../assets/components/DatePicker';
import UploadArea from './UploadArea';

import maintenanceData from '../data/data.json';

export default function MaintenanceForm({ onCancel, onSaveDraft, onSubmitSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      assetId: '',
      category: '',
      priority: '',
      title: '',
      description: '',
      reportedDate: '2025-05-15', // Default to mock today
      dueDate: '',
      technician: '',
      notes: '',
    },
  });

  // Extract unique assets list from the tickets data or create a default set
  const assetOptions = useMemo(() => {
    // Map ticket assets + additional known assets
    const uniqueAssets = [
      { value: 'AF-0001', label: 'Dell XPS 13 (AF-0001)' },
      { value: 'PR-0021', label: 'HP LaserJet Pro (PR-0021)' },
      { value: 'AC-0012', label: 'LG AC - 1.5 Ton (AC-0012)' },
      { value: 'RM-0003', label: 'Meeting Room A (RM-0003)' },
      { value: 'EG-0009', label: 'Generator G-34 (EG-0009)' },
      { value: 'AF-0089', label: 'MacBook Pro 16" (AF-0089)' },
      { value: 'AF-0088', label: 'iPad Pro 11" (AF-0088)' },
      { value: 'AF-0120', label: 'Conference Desk (AF-0120)' },
    ];
    return uniqueAssets;
  }, []);

  const categoryOptions = useMemo(() => {
    return maintenanceData.categories.map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, []);

  const priorityOptions = useMemo(() => {
    return maintenanceData.priorities.map((prio) => ({
      value: prio,
      label: prio,
    }));
  }, []);

  const technicianOptions = useMemo(() => {
    return maintenanceData.technicians.map((tech) => ({
      value: tech,
      label: tech,
    }));
  }, []);

  const handleSaveDraftClick = () => {
    const values = getValues();
    onSaveDraft({ ...values, attachment: selectedFile });
  };

  const handleFormSubmit = (data) => {
    // Locate Asset details
    const selectedAssetOpt = assetOptions.find((a) => a.value === data.assetId);
    const assetName = selectedAssetOpt ? selectedAssetOpt.label.split(' (')[0] : 'Unknown Asset';
    
    const submission = {
      ...data,
      asset: {
        name: assetName,
        code: data.assetId,
        image: '/assets/laptop.png', // Default placeholder
      },
      attachment: selectedFile,
    };
    onSubmitSuccess(submission);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 w-full text-left">
      {/* Section 1: Asset & Urgency */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          1. Asset & Urgency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Asset"
            placeholder="Select Asset"
            required
            options={assetOptions}
            error={errors.assetId}
            {...register('assetId', { required: 'Asset selection is required' })}
          />

          <FormSelect
            label="Category"
            placeholder="Select Category"
            required
            options={categoryOptions}
            error={errors.category}
            {...register('category', { required: 'Category is required' })}
          />

          <FormSelect
            label="Priority Level"
            placeholder="Select Priority"
            required
            options={priorityOptions}
            error={errors.priority}
            {...register('priority', { required: 'Priority is required' })}
          />
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 2: Issue details */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          2. Issue Details
        </h3>
        <div className="flex flex-col gap-4">
          <FormInput
            label="Issue Title"
            placeholder="e.g. Screen flickering, Keyboard error"
            required
            error={errors.title}
            {...register('title', { required: 'Issue title is required' })}
          />

          <FormTextarea
            label="Issue Description"
            placeholder="Describe the issue in detail..."
            required
            maxLength={300}
            error={errors.description}
            {...register('description', { required: 'Description is required' })}
          />
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 3 & 4: Date Schedule & Assignee */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          3. Schedule & Assignment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            label="Reported Date"
            required
            error={errors.reportedDate}
            {...register('reportedDate', { required: 'Reported date is required' })}
          />

          <DatePicker
            label="Expected Resolution"
            required
            error={errors.dueDate}
            {...register('dueDate', { required: 'Resolution date is required' })}
          />

          <FormSelect
            label="Assign Technician (Optional)"
            placeholder="Choose Technician"
            options={technicianOptions}
            error={errors.technician}
            {...register('technician')}
          />
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 5 & 6: Upload and Additional Notes */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          4. Documentation & Notes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <FormTextarea
            label="Additional Notes (Optional)"
            placeholder="Provide any additional info..."
            maxLength={200}
            {...register('notes')}
          />

          <UploadArea label="Upload Images / Documents" onFileSelect={setSelectedFile} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-[#E5E7EB] pt-5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none bg-gray-50/50 -mx-6 -mb-6 p-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto h-11 px-6 border border-[#E5E7EB] hover:bg-gray-100 text-[#475569] font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer text-center select-none"
        >
          Cancel
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="w-full sm:w-auto h-11 px-5 border border-[#7C3AED] hover:bg-[#F5F3FF] text-[#7C3AED] font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer select-none"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 select-none shadow-md shadow-[#7C3AED]/15"
          >
            Submit Request
          </button>
        </div>
      </div>
    </form>
  );
}
