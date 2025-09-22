import { PanjarRealizationItemRequest } from '../../../types/panjarRealizationItem';
import { FORM_FIELDS, DEFAULT_STATUS } from '../constants/realizationConstants';

export const createFormData = (
  formData: PanjarRealizationItemRequest,
  panjarId: string,
  itemId: string
): FormData => {
  const submitData = new FormData();

  // Add text fields
  const textFields = [
    [FORM_FIELDS.PANJAR_REQUEST_ID, String(formData.panjar_request_id || panjarId)],
    [FORM_FIELDS.PANJAR_ITEM_ID, String(itemId)],
    [FORM_FIELDS.ITEM_NAME, formData.item_name || ''],
    [FORM_FIELDS.SPECIFICATION, formData.spesification || ''],
    [FORM_FIELDS.DESCRIPTION, formData.description || ''],
    [FORM_FIELDS.QUANTITY, String(formData.quantity || 0)],
    [FORM_FIELDS.UNIT, formData.unit || ''],
    [FORM_FIELDS.PRICE, String(formData.price || 0)],
    [FORM_FIELDS.TOTAL, String(formData.total || 0)],
    [FORM_FIELDS.REPORT_STATUS, formData.report_status || DEFAULT_STATUS],
  ] as const;

  textFields.forEach(([key, value]) => {
    submitData.append(key, value);
  });

  // Add files
  if (formData.receipt_file) {
    submitData.append(FORM_FIELDS.RECEIPT_FILE, formData.receipt_file);
  }
  
  if (formData.item_photo) {
    submitData.append(FORM_FIELDS.ITEM_PHOTO, formData.item_photo);
  }

  return submitData;
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString('id-ID');
};

export const parseCurrencyInput = (value: string): number => {
  const numericValue = value.replace(/\D/g, '');
  return numericValue ? parseInt(numericValue) : 0;
};
