import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormSelect from '../../assets/components/FormSelect';
import DatePicker from '../../assets/components/DatePicker';
import { assetService } from '../../assets/services/assetService';
import { organizationService } from '../../organization/services/organizationService';

import allocationData from '../data/data.json';

export default function AllocationForm({ onCancel, onSubmitSuccess }) {
  const [dbAssets, setDbAssets] = useState([]);
  const [dbEmployees, setDbEmployees] = useState([]);
  const [dbDepartments, setDbDepartments] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const assetsRes = await assetService.getAssets({ limit: 100 });
        setDbAssets(assetsRes.assets || assetsRes.data || []);
      } catch (err) {
        console.error("Failed to load assets for allocation form:", err);
      }
      try {
        const employeesRes = await organizationService.getEmployees({ limit: 100 });
        setDbEmployees(employeesRes.employees || employeesRes.data || []);
      } catch (err) {
        console.error("Failed to load employees for allocation form:", err);
      }
      try {
        const departmentsRes = await organizationService.getDepartments();
        setDbDepartments(departmentsRes || []);
      } catch (err) {
        console.error("Failed to load departments for allocation form:", err);
      }
    };
    loadFormData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      allocationType: 'Employee',
      assetId: '',
      employeeId: '',
      departmentName: '',
      allocationDate: '',
      dueDate: '',
    },
  });

  const allocationType = watch('allocationType');

  // Load assets options
  const assetOptions = useMemo(() => {
    if (dbAssets.length > 0) {
      return dbAssets.map((asset) => ({
        value: String(asset.id),
        label: `${asset.name} (${asset.assetTag})`,
      }));
    }
    return allocationData.assets.map((asset) => ({
      value: String(asset.id),
      label: `${asset.name} (${asset.code})`,
    }));
  }, [dbAssets]);

  // Load employees options
  const employeeOptions = useMemo(() => {
    if (dbEmployees.length > 0) {
      return dbEmployees.map((emp) => ({
        value: String(emp.id),
        label: `${emp.name} (${emp.email})`,
      }));
    }
    return allocationData.employees.map((emp) => ({
      value: String(emp.id),
      label: `${emp.name} - ${emp.role}`,
    }));
  }, [dbEmployees]);

  // Load departments options
  const departmentOptions = useMemo(() => {
    if (dbDepartments.length > 0) {
      return dbDepartments.map((dept) => ({
        value: String(dept.id),
        label: dept.name,
      }));
    }
    return allocationData.departments.map((dept) => ({
      value: dept,
      label: dept,
    }));
  }, [dbDepartments]);

  const handleFormSubmit = (data) => {
    onSubmitSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 w-full text-left">
      {/* Section 1: Asset and Assignee Details */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          1. Allocation Target
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allocation Type Radio Toggle */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider pl-0.5 select-none">
              Allocation Type
            </span>
            <div className="flex items-center gap-4 bg-gray-50 border border-[#E5E7EB] rounded-xl h-11 px-4 select-none">
              <label className="flex items-center gap-2 text-xs font-bold text-[#475569] cursor-pointer">
                <input
                  type="radio"
                  value="Employee"
                  className="w-4.5 h-4.5 text-[#7C3AED] focus:ring-[#7C3AED]/20 cursor-pointer"
                  {...register('allocationType')}
                />
                <span>Employee</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-[#475569] cursor-pointer">
                <input
                  type="radio"
                  value="Department"
                  className="w-4.5 h-4.5 text-[#7C3AED] focus:ring-[#7C3AED]/20 cursor-pointer"
                  {...register('allocationType')}
                />
                <span>Department</span>
              </label>
            </div>
          </div>

          {/* Searchable Asset select */}
          <FormSelect
            label="Select Asset"
            placeholder="Choose an asset"
            required
            options={assetOptions}
            error={errors.assetId}
            {...register('assetId', { required: 'Asset selection is required' })}
          />

          {/* Dynamic Employee vs Department selector */}
          {allocationType === 'Employee' ? (
            <FormSelect
              label="Assigned Employee"
              placeholder="Choose employee"
              required
              options={employeeOptions}
              error={errors.employeeId}
              {...register('employeeId', { required: 'Employee assignment is required' })}
            />
          ) : (
            <FormSelect
              label="Assigned Department"
              placeholder="Choose department"
              required
              options={departmentOptions}
              error={errors.departmentName}
              {...register('departmentName', { required: 'Department assignment is required' })}
            />
          )}
        </div>
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Section 2: Dates */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider select-none">
          2. Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Allocation Date"
            required
            error={errors.allocationDate}
            {...register('allocationDate', { required: 'Allocation Date is required' })}
          />

          <DatePicker
            label="Expected Return / Due Date"
            required
            error={errors.dueDate}
            {...register('dueDate', { required: 'Expected Return is required' })}
          />
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

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-11 px-6 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 select-none shadow-md shadow-[#7C3AED]/15"
          >
            Allocate Asset
          </button>
        </div>
      </div>
    </form>
  );
}
