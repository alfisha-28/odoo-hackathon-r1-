import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ScanLine } from 'lucide-react';
import AssetStepper from '../components/AssetStepper';
import FormSection from '../components/FormSection';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import DatePicker from '../components/DatePicker';
import UploadCard from '../components/UploadCard';
import FormActions from '../components/FormActions';

import assetData from '../data/data.json';

export default function RegisterAssetPage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      tag: '',
      category: '',
      subCategory: '',
      brand: '',
      model: '',
      serialNumber: '',
      barcode: '',
      purchaseDate: '',
      purchaseCost: '',
      warrantyUntil: '',
      invoiceNumber: '',
      description: '',
    },
  });

  // Watch category to dynamically load subCategories options
  const selectedCategoryName = watch('category');
  const watchedDescription = watch('description') || '';

  const subCategoryOptions = useMemo(() => {
    if (!selectedCategoryName) return [];
    const cat = assetData.categories.find((c) => c.name === selectedCategoryName);
    return cat ? cat.subCategories : [];
  }, [selectedCategoryName]);

  const handleCancel = () => {
    navigate('/assets/directory');
  };

  const handleSaveDraft = () => {
    const currentValues = getValues();
    console.log('Saved Draft Asset Data:', { ...currentValues, imageFile });
    alert('Asset successfully saved as draft! Check console logs.');
  };

  const onSubmit = (data) => {
    console.log('Submitted Asset Information (Step 1):', { ...data, imageFile });
    alert('Validation passed for Step 1! Form data logged to console. Ready to proceed to Step 2.');
  };

  return (
    <>
      {/* Title & Breadcrumbs header */}
      <div className="flex flex-col gap-1 select-none">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            title="Back to Assets"
            className="w-9 h-9 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 flex items-center justify-center text-[#475569] hover:text-[#111827] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
            Register New Asset
          </h1>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] pl-12">
          <span>Dashboard</span>
          <span className="text-gray-300">/</span>
          <span>Assets</span>
          <span className="text-gray-300">/</span>
          <span className="text-[#7C3AED]">Register New Asset</span>
        </div>
      </div>

      {/* Multistep Progress indicator */}
      <section>
        <AssetStepper currentStep={1} />
      </section>

      {/* Main card */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Two-column layout: Form vs Upload Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left form fields */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              <FormSection
                title="Asset Information"
                description="Enter the basic information about the asset."
              >
                <div className="flex flex-col gap-5 w-full">
                  {/* Row 1: Name, Tag, Category, SubCategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <FormInput
                      label="Asset Name"
                      placeholder="Enter asset name"
                      required
                      error={errors.name}
                      {...register('name', { required: 'Asset Name is required' })}
                    />

                    <FormInput
                      label="Asset Tag / ID"
                      placeholder="Enter unique tag or ID"
                      required
                      error={errors.tag}
                      {...register('tag', { required: 'Asset Tag / ID is required' })}
                    />

                    <FormSelect
                      label="Category"
                      placeholder="Select category"
                      required
                      options={assetData.categories.map((c) => c.name)}
                      error={errors.category}
                      {...register('category', { required: 'Category is required' })}
                    />

                    <FormSelect
                      label="Sub Category"
                      placeholder={selectedCategoryName ? 'Select sub category' : 'Select category first'}
                      options={subCategoryOptions}
                      disabled={!selectedCategoryName}
                      error={errors.subCategory}
                      {...register('subCategory')}
                    />
                  </div>

                  {/* Row 2: Brand, Model, Serial Number, Barcode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <FormInput
                      label="Brand"
                      placeholder="Enter brand"
                      error={errors.brand}
                      {...register('brand')}
                    />

                    <FormInput
                      label="Model"
                      placeholder="Enter model"
                      error={errors.model}
                      {...register('model')}
                    />

                    <FormInput
                      label="Serial Number"
                      placeholder="Enter serial number"
                      error={errors.serialNumber}
                      {...register('serialNumber')}
                    />

                    <FormInput
                      label="Barcode / QR (Optional)"
                      placeholder="Scan or enter barcode"
                      suffixIcon={<ScanLine className="w-4.5 h-4.5" />}
                      error={errors.barcode}
                      {...register('barcode')}
                    />
                  </div>

                  {/* Row 3: Purchase Date, Cost, Warranty, Invoice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <DatePicker
                      label="Purchase Date"
                      required
                      error={errors.purchaseDate}
                      {...register('purchaseDate', { required: 'Purchase Date is required' })}
                    />

                    <FormInput
                      label="Purchase Cost ($)"
                      type="number"
                      step="0.01"
                      placeholder="Enter purchase cost"
                      required
                      error={errors.purchaseCost}
                      {...register('purchaseCost', { required: 'Purchase Cost is required' })}
                    />

                    <DatePicker
                      label="Warranty Upto"
                      error={errors.warrantyUntil}
                      {...register('warrantyUntil')}
                    />

                    <FormInput
                      label="Invoice Number"
                      placeholder="Enter invoice number"
                      error={errors.invoiceNumber}
                      {...register('invoiceNumber')}
                    />
                  </div>

                  {/* Row 4: Description */}
                  <div className="w-full">
                    <FormTextarea
                      label="Description"
                      placeholder="Enter a short description about the asset."
                      maxLength={500}
                      value={watchedDescription}
                      error={errors.description}
                      {...register('description')}
                    />
                  </div>
                </div>
              </FormSection>
            </div>

            {/* Right upload card */}
            <div className="lg:col-span-3 w-full self-stretch lg:border-l lg:border-[#E5E7EB] lg:pl-8 flex flex-col items-center">
              <UploadCard label="Upload Asset Image" onFileSelect={setImageFile} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <FormActions
          onCancel={handleCancel}
          onSaveDraft={handleSaveDraft}
          isSubmitting={isSubmitting}
        />
      </form>
    </>
  );
}
