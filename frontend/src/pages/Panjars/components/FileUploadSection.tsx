import React from 'react';
import { PanjarRealizationItemRequest } from '../../../types/panjarRealizationItem';
import Label from '../../../components/form/Label';
import FileInput from '../../../components/form/input/FileInput';
import { isFileObject, getFileName } from '../utils/fileUtils';

interface FileUploadSectionProps {
  formData: PanjarRealizationItemRequest;
  onFileChange: (field: string, file: File | null) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  formData,
  onFileChange,
}) => {
  const renderFileStatus = (file: File | undefined) => {
    if (!file) return null;
    
    if (isFileObject(file)) {
      return (
        <p className="mt-1 text-sm text-green-600">
          ✓ File terpilih: {getFileName(file)}
        </p>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Lampiran Realisasi
      </h3>

      <div>
        <Label htmlFor="receipt_file">Lampiran Bukti Invoice *</Label>
        <FileInput
          onChange={(e) => onFileChange('receipt_file', e.target.files?.[0] || null)}
          className="custom-class"
        />
        {renderFileStatus(formData.receipt_file)}
        <p className="mt-1 text-sm text-gray-500">
          Upload bukti pembayaran (PDF/JPG/PNG)
        </p>
      </div>

      <div>
        <Label htmlFor="item_photo">Lampiran Bukti Foto *</Label>
        <FileInput
          onChange={(e) => onFileChange('item_photo', e.target.files?.[0] || null)}
          className="custom-class"
        />
        {renderFileStatus(formData.item_photo)}
        <p className="mt-1 text-sm text-gray-500">
          Upload foto realisasi (JPG/PNG)
        </p>
      </div>
    </div>
  );
};
