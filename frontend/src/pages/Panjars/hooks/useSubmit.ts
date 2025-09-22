import { useAddPanjarRealizationItemMutation } from '../../../api/panjarRealizationItemApi';
import { PanjarRealizationItemRequest } from '../../../types/panjarRealizationItem';
import { validateRequiredFile, validateReceiptFile, validatePhotoFile } from '../utils/validationUtils';
import { createFormData } from '../utils/formUtils';
import { ERROR_MESSAGES } from '../constants/realizationConstants';
import { toast } from 'react-hot-toast';

interface UseSubmitParams {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const useSubmit = ({ onSuccess, onError }: UseSubmitParams = {}) => {
  const [addPanjarRealizationItem, { isLoading }] = useAddPanjarRealizationItemMutation();

  const validateFiles = (formData: PanjarRealizationItemRequest): string | null => {
    // Validate required files
    const receiptValidation = validateRequiredFile(formData.receipt_file, ERROR_MESSAGES.REQUIRED_RECEIPT);
    if (!receiptValidation.isValid) {
      return receiptValidation.error!;
    }

    const photoValidation = validateRequiredFile(formData.item_photo, ERROR_MESSAGES.REQUIRED_PHOTO);
    if (!photoValidation.isValid) {
      return photoValidation.error!;
    }

    // Validate file types
    const receiptTypeValidation = validateReceiptFile(formData.receipt_file);
    if (!receiptTypeValidation.isValid) {
      return receiptTypeValidation.error!;
    }

    const photoTypeValidation = validatePhotoFile(formData.item_photo);
    if (!photoTypeValidation.isValid) {
      return photoTypeValidation.error!;
    }

    return null;
  };

  const submitForm = async (
    formData: PanjarRealizationItemRequest,
    panjarId: string,
    itemId: string
  ): Promise<void> => {
    const validationError = validateFiles(formData);
    if (validationError) {
      if (onError) {
        onError(validationError);
      } else {
        toast.error(validationError, {
          duration: 4000,
          position: 'top-right',
        });
      }
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Menyimpan data...', {
      position: 'top-right',
    });

    try {
      const submitData = createFormData(formData, panjarId, itemId);
      
      await addPanjarRealizationItem({
        data: submitData
      }).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (onSuccess) {
        onSuccess();
      } else {
        toast.success(ERROR_MESSAGES.SUBMIT_SUCCESS, {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error: any) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      const errorMessage = error.status === 422 && error.data?.errors
        ? formatValidationErrors(error.data.errors)
        : ERROR_MESSAGES.SUBMIT_ERROR;
      
      if (onError) {
        onError(errorMessage);
      } else {
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
        });
      }
    }
  };

  const formatValidationErrors = (errors: Record<string, string[]>): string => {
    let errorMessage = ERROR_MESSAGES.VALIDATION_ERROR + '\n';
    Object.entries(errors).forEach(([field, messages]) => {
      if (Array.isArray(messages)) {
        errorMessage += `${field}: ${messages.join(', ')}\n`;
      }
    });
    return errorMessage;
  };

  return {
    submitForm,
    isSubmitting: isLoading,
  };
};
