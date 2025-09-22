// Constants for panjar realization
export const FILE_TYPES = {
  RECEIPT: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  PHOTO: ['image/jpeg', 'image/jpg', 'image/png'],
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_RECEIPT: 'Lampiran bukti invoice harus diupload',
  REQUIRED_PHOTO: 'Lampiran bukti foto harus diupload',
  INVALID_RECEIPT_TYPE: 'File invoice harus berformat PDF, JPG, JPEG, atau PNG',
  INVALID_PHOTO_TYPE: 'File foto harus berformat JPG, JPEG, atau PNG',
  SUBMIT_SUCCESS: 'Data berhasil disimpan!',
  SUBMIT_ERROR: 'Terjadi kesalahan saat menyimpan data',
  VALIDATION_ERROR: 'Terjadi kesalahan validasi:',
} as const;

export const FORM_FIELDS = {
  PANJAR_REQUEST_ID: 'panjar_request_id',
  PANJAR_ITEM_ID: 'panjar_item_id',
  ITEM_NAME: 'item_name',
  SPECIFICATION: 'spesification',
  DESCRIPTION: 'description',
  QUANTITY: 'quantity',
  UNIT: 'unit',
  PRICE: 'price',
  TOTAL: 'total',
  REPORT_STATUS: 'report_status',
  RECEIPT_FILE: 'receipt_file',
  ITEM_PHOTO: 'item_photo',
} as const;

export const DEFAULT_STATUS = 'submitted';
