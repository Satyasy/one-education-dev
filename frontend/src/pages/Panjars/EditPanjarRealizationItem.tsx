import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

import { useGetPanjarRealizationItemsByIdQuery, useUpdatePanjarRealizationItemMutation } from '../../api/panjarRealizationItemApi';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import SpinnerOne from '../../components/ui/spinner/SpinnerOne';
import Button from '../../components/ui/button/Button';

import { FormFieldsNew } from './components/FormFieldsNew';
import EditFileUploadSection from './components/EditFileUploadSectionNew.tsx';
import { editPanjarRealizationItemSchema } from './schemas/editPanjarRealizationItemSchema';

export default function EditPanjarRealizationItem() {
  const { panjarRealizationItemId } = useParams<{ panjarRealizationItemId: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(editPanjarRealizationItemSchema),
    defaultValues: {
      panjar_request_id: 0,
      item_name: "",
      spesification: "",
      description: "",
      quantity: 0,
      unit: "",
      price: 0,
      total: 0,
      report_status: "pending",
      receipt_file: undefined,
      item_photo: undefined
    }
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = form;

  // API calls
  const { data: panjarRealizationItem, isLoading, error } = useGetPanjarRealizationItemsByIdQuery({
    panjar_realization_item_id: Number(panjarRealizationItemId)
  });

  const [updatePanjarRealizationItem, { isLoading: isUpdating }] = useUpdatePanjarRealizationItemMutation();

  // Initialize form data when API data is loaded
  useEffect(() => {
    if (panjarRealizationItem) {
      const formValues = {
        panjar_request_id: panjarRealizationItem.panjar_request_id || 0,
        item_name: panjarRealizationItem.item_name || "",
        spesification: panjarRealizationItem.spesification || "",
        description: panjarRealizationItem.description || "",
        quantity: panjarRealizationItem.quantity || 0,
        unit: panjarRealizationItem.unit || "",
        price: Number(panjarRealizationItem.price) || 0,
        total: Number(panjarRealizationItem.total) || 0,
        report_status: panjarRealizationItem.report_status || "pending",
        receipt_file: undefined,
        item_photo: undefined,
      };        // Set all form values at once
        Object.entries(formValues).forEach(([key, value]) => {
          setValue(key as any, value);
        });
    }
  }, [panjarRealizationItem, setValue]);

  // Calculate total when quantity or price changes
  const quantity = watch('quantity');
  const price = watch('price');
  
  useEffect(() => {
    const total = (quantity || 0) * (price || 0);
    setValue('total', total);
  }, [quantity, price, setValue]);

  // Event handlers
  const handleFieldChange = (field: string, value: any) => {
    setValue(field as any, value);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // File validation helper
  const validateFiles = (receipt_file?: File, item_photo?: File): string | null => {
    if (receipt_file && receipt_file instanceof File) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(receipt_file.type)) {
        return 'File receipt harus berformat PDF, JPEG, JPG, atau PNG';
      }
      if (receipt_file.size > 5 * 1024 * 1024) { // 5MB
        return 'Ukuran file receipt tidak boleh lebih dari 5MB';
      }
    }

    if (item_photo && item_photo instanceof File) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(item_photo.type)) {
        return 'File foto harus berformat JPEG, JPG, atau PNG';
      }
      if (item_photo.size > 5 * 1024 * 1024) { // 5MB
        return 'Ukuran file foto tidak boleh lebih dari 5MB';
      }
    }

    return null;
  };

  // Submit handler
  const onSubmit = async (data: any) => {
    if (!panjarRealizationItemId) return;

    // Validate files
    const fileValidationError = validateFiles(data.receipt_file, data.item_photo);
    if (fileValidationError) {
      toast.error(fileValidationError, {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    const loadingToast = toast.loading('Mengupdate data...', {
      position: 'top-right',
    });

    try {
      // Create FormData for submission
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('panjar_request_id', String(data.panjar_request_id));
      submitData.append('item_name', data.item_name.trim());
      submitData.append('spesification', data.spesification || '');
      submitData.append('description', data.description || '');
      submitData.append('quantity', String(data.quantity));
      submitData.append('unit', data.unit.trim());
      submitData.append('price', String(data.price));
      submitData.append('total', String(data.total));
      submitData.append('report_status', data.report_status || 'pending');

      // Add files only if they are updated
      if (data.receipt_file instanceof File) {
        submitData.append('receipt_file', data.receipt_file);
      }
      if (data.item_photo instanceof File) {
        submitData.append('item_photo', data.item_photo);
      }

      await updatePanjarRealizationItem({
        panjar_realization_item_id: Number(panjarRealizationItemId),
        data: submitData
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success('Data berhasil diupdate!', {
        duration: 3000,
        position: 'top-right',
      });

      setTimeout(() => navigate(-1), 2000);
    } catch (error: any) {
      toast.dismiss(loadingToast);
      
      const errorMessage = error.status === 422 && error.data?.errors
        ? formatValidationErrors(error.data.errors)
        : error.data?.message || 'Terjadi kesalahan saat mengupdate data';
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const formatValidationErrors = (errors: Record<string, string[]>): string => {
    let errorMessage = 'Validation Error:\n';
    Object.entries(errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        errorMessage += `${field}: ${messages.join(', ')}\n`;
      }
    });
    return errorMessage;
  };

  // Loading and error states
  if (isLoading) {
    return <SpinnerOne />;
  }

  if (error || !panjarRealizationItem) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading data. Please try again.
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Panjar Realization Item" />

      <ComponentCard 
        title="Form Edit Panjar Realization Item" 
        className="space-y-5 sm:space-y-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mode: {isEditMode ? "Edit" : "Read Only"}
            </span>
          </div>
          <Button
            type="button"
            variant={isEditMode ? "outline" : "primary"}
            onClick={toggleEditMode}
          >
            {isEditMode ? "Cancel Edit" : "Enable Edit"}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Form Fields */}
            <FormFieldsNew
              form={form}
              isEditMode={isEditMode}
              onFieldChange={handleFieldChange}
            />

            {/* Right column - File Upload with existing files display */}
            <EditFileUploadSection
              form={form}
              existingData={panjarRealizationItem}
              isEditMode={isEditMode}
              onFileChange={handleFieldChange}
            />
          </div>

          {/* Form Errors Display */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-medium mb-2">Validation Errors:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field}: {error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Invalid value'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
              disabled={isUpdating}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isUpdating || !isEditMode}
            >
              {isUpdating ? "Mengupdate..." : "Update Realisasi"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
