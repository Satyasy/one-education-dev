/**
 * Type guards dan utility functions untuk handling file types
 */

// Type guard untuk memeriksa apakah nilai adalah File object
export const isFileObject = (value: any): value is File => {
  return value instanceof File;
};

// Type guard untuk memeriksa apakah nilai adalah string URL
export const isFileUrl = (value: any): value is string => {
  return typeof value === 'string' && value.length > 0;
};

// Utility untuk mendapatkan file name dari File object atau URL
export const getFileName = (file: File | string | undefined): string => {
  if (!file) return '';
  
  if (isFileObject(file)) {
    return file.name;
  }
  
  if (isFileUrl(file)) {
    // Extract filename from URL
    const url = new URL(file);
    const pathname = url.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  }
  
  return '';
};

// Utility untuk mendapatkan file size dari File object
export const getFileSize = (file: File | string | undefined): number => {
  if (!file || !isFileObject(file)) return 0;
  return file.size;
};

// Utility untuk format file size ke human readable
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility untuk download file dari URL
export const downloadFile = (url: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || getFileName(url);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
