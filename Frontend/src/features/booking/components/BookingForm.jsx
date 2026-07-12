import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormSelect from '../../assets/components/FormSelect';
import FormTextarea from '../../assets/components/FormTextarea';
import DatePicker from '../../assets/components/DatePicker';
import UploadArea from './UploadArea';
import TimeSlotPicker from './TimeSlotPicker';
import ResourceAvailability from './ResourceAvailability';

import bookingData from '../data/data.json';

export default function BookingForm({ prefilledType, onCancel, onSaveDraft, onSubmitSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      resourceType: prefilledType || '',
      resourceId: '',
      bookingFor: 'Self',
      employeeId: '',
      departmentName: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      purpose: '',
      priority: '',
      notes: '',
    },
  });

  const resourceType = watch('resourceType');
  const resourceId = watch('resourceId');
  const bookingFor = watch('bookingFor');

  // Prefill resourceType if prop updates
  useEffect(() => {
    if (prefilledType) {
      setValue('resourceType', prefilledType);
      setValue('resourceId', ''); // Reset selected resource when type changes
    }
  }, [prefilledType, setValue]);

  // Load resource types options
  const resourceTypeOptions = useMemo(() => {
    return bookingData.resourceTypes.map((type) => ({
      value: type,
      label: type,
    }));
  }, []);

  // Fetch bookable assets from API
  const [bookableAssets, setBookableAssets] = useState([]);
  
  useEffect(() => {
    import('../../assets/services/assetService').then(({ assetService }) => {
      assetService.getAssets({ isBookable: true })
        .then(data => setBookableAssets(data.assets || data.data || []))
        .catch(err => console.error('Failed to fetch bookable assets:', err));
    });
  }, []);

  // Filter resources based on selected type
  const filteredResourceOptions = useMemo(() => {
    if (!resourceType) return [];
    
    // Attempt to map from fetched API assets first, fallback to static if empty
    const assetsSource = bookableAssets.length > 0 
      ? bookableAssets.filter(a => a.category === resourceType || a.name.includes(resourceType)) // basic fallback matching
      : bookingData.resources.filter((res) => res.type === resourceType);
      
    return assetsSource.map((res) => ({
        value: res.id,
        label: `${res.name} (${res.location || 'Unknown'})`,
      }));
  }, [resourceType, bookableAssets]);

  // Load employees options
  const employeeOptions = useMemo(() => {
    return bookingData.employees.map((emp) => ({
      value: emp.id,
      label: `${emp.name} - ${emp.department}`,
    }));
  }, []);

  // Load departments options
  const departmentOptions = useMemo(() => {
    return bookingData.departments.map((dept) => ({
      value: dept,
      label: dept,
    }));
  }, []);

  // Get active availability record
  const selectedResourceAvailability = useMemo(() => {
    if (!resourceId) return null;
    const resource = bookingData.resources.find((r) => r.id === resourceId);
    const avail = bookingData.availability.find((a) => a.resourceId === resourceId);
    return {
      resourceName: resource?.name || 'Selected Resource',
      avail: avail || { availableToday: false, timeSlots: [] },
    };
  }, [resourceId]);

  const handleSaveDraftClick = async () => {
    // Save draft log - optional validation, but we can trigger it
    const values = getValues();
    onSaveDraft({ ...values, attachment: selectedFile });
  };

  const handleFormSubmit = (data) => {
    // Find Resource Meta
    const resMeta = bookingData.resources.find((r) => r.id === data.resourceId);
    // Find Employee/Dept details
    let empDetails = {
      name: 'John Doe',
      department: 'Operations & IT',
      avatar: '/avatars/john.png',
    };

    if (data.bookingFor === 'Employee') {
      const emp = bookingData.employees.find((e) => e.id === data.employeeId);
      if (emp) {
        empDetails = {
          name: emp.name,
          department: emp.department,
          avatar: emp.avatar,
        };
      }
    } else if (data.bookingFor === 'Department') {
      empDetails = {
        name: `${data.departmentName} Group`,
        department: data.departmentName,
        avatar: '',
      };
    }

    const submission = {
      ...data,
      resource: resMeta
        ? { id: resMeta.id, name: resMeta.name, type: resMeta.type, image: resMeta.image, location: resMeta.location }
        : null,
      employee: empDetails,
      attachment: selectedFile,
    };

    onSubmitSuccess(submission);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 w-full text-left">
      {/* Section 1: Resource Type and Assignee */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          1. Resource & Target
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resource Type */}
          <FormSelect
            label="Resource Type"
            placeholder="Select Resource Type"
            required
            options={resourceTypeOptions}
            error={errors.resourceType}
            {...register('resourceType', { required: 'Resource type is required' })}
          />

          {/* Resource Select */}
          <FormSelect
            label="Resource"
            placeholder={resourceType ? 'Choose Resource' : 'Select Resource Type first'}
            required
            options={filteredResourceOptions}
            error={errors.resourceId}
            disabled={!resourceType}
            {...register('resourceId', { required: 'Resource is required' })}
          />
        </div>

        {/* Availability sub-card */}
        {selectedResourceAvailability && (
          <ResourceAvailability
            resourceName={selectedResourceAvailability.resourceName}
            availability={selectedResourceAvailability.avail}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {/* Booking For Radio Toggles */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
              Booking For
            </span>
            <div className="flex items-center gap-4 bg-gray-50 border border-[#E5E7EB] rounded-xl h-11 px-4 select-none">
              <label className="flex items-center gap-2 text-xs font-bold text-[#475569] cursor-pointer">
                <input
                  type="radio"
                  value="Self"
                  className="w-4.5 h-4.5 text-[#7C3AED] focus:ring-[#7C3AED]/20 cursor-pointer"
                  {...register('bookingFor')}
                />
                <span>Self</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-[#475569] cursor-pointer">
                <input
                  type="radio"
                  value="Employee"
                  className="w-4.5 h-4.5 text-[#7C3AED] focus:ring-[#7C3AED]/20 cursor-pointer"
                  {...register('bookingFor')}
                />
                <span>Employee</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-[#475569] cursor-pointer">
                <input
                  type="radio"
                  value="Department"
                  className="w-4.5 h-4.5 text-[#7C3AED] focus:ring-[#7C3AED]/20 cursor-pointer"
                  {...register('bookingFor')}
                />
                <span>Department</span>
              </label>
            </div>
          </div>

          {/* Conditional Select Lists */}
          {bookingFor === 'Employee' && (
            <FormSelect
              label="Select Employee"
              placeholder="Choose employee"
              required
              options={employeeOptions}
              error={errors.employeeId}
              {...register('employeeId', { required: 'Employee is required' })}
            />
          )}

          {bookingFor === 'Department' && (
            <FormSelect
              label="Select Department"
              placeholder="Choose department"
              required
              options={departmentOptions}
              error={errors.departmentName}
              {...register('departmentName', { required: 'Department is required' })}
            />
          )}
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 2: Dates and Times */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          2. Date & Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <DatePicker
            label="Booking Date"
            required
            error={errors.bookingDate}
            {...register('bookingDate', { required: 'Booking date is required' })}
          />

          <TimeSlotPicker register={register} watch={watch} errors={errors} />
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 3: Purpose & Priority */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          3. Details & Urgency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextarea
            label="Purpose"
            placeholder="Reason for booking this resource..."
            required
            maxLength={200}
            error={errors.purpose}
            {...register('purpose', { required: 'Purpose is required' })}
          />

          <FormSelect
            label="Priority Level"
            placeholder="Select Priority"
            required
            options={['Low', 'Medium', 'High', 'Urgent']}
            error={errors.priority}
            {...register('priority', { required: 'Priority is required' })}
          />
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 4: Notes and Attachments */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          4. Documentation (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          <FormTextarea
            label="Internal Notes"
            placeholder="Add any additional notes..."
            maxLength={200}
            {...register('notes')}
          />

          <UploadArea label="Attachment" onFileSelect={setSelectedFile} />
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
            Confirm Booking
          </button>
        </div>
      </div>
    </form>
  );
}
