import { FILE_TYPES } from '../constants/realizationConstants';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (
  file: File | null | undefined,
  allowedTypes: readonly string[],
  errorMessage: string
): FileValidationResult => {
  if (!file || !(file instanceof File)) {
    return { isValid: false, error: errorMessage };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: errorMessage };
  }

  return { isValid: true };
};

export const validateReceiptFile = (file: File | null | undefined): FileValidationResult => {
  return validateFile(
    file,
    FILE_TYPES.RECEIPT,
    'File invoice harus berformat PDF, JPG, JPEG, atau PNG'
  );
};

export const validatePhotoFile = (file: File | null | undefined): FileValidationResult => {
  return validateFile(
    file,
    FILE_TYPES.PHOTO,
    'File foto harus berformat JPG, JPEG, atau PNG'
  );
};

export const validateRequiredFile = (
  file: File | null | undefined,
  errorMessage: string
): FileValidationResult => {
  if (!file || !(file instanceof File)) {
    return { isValid: false, error: errorMessage };
  }
  return { isValid: true };
};
