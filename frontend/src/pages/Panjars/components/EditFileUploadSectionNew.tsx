import React from 'react';
import { PanjarRealizationItemResponse } from '../../../types/panjarRealizationItem';
import Label from '../../../components/form/Label';
import FileInput from '../../../components/form/input/FileInput';
import Button from '../../../components/ui/button/Button';
import { ExternalLink, Download, Image, Receipt, X } from 'lucide-react';
import { isFileObject, getFileName, downloadFile } from '../utils/fileUtils';

interface EditFileUploadSectionProps {
  form: any; // Simplified type
  existingData: PanjarRealizationItemResponse;
  isEditMode: boolean;
  onFileChange?: (field: string, file: File | null) => void;
}

export const EditFileUploadSection: React.FC<EditFileUploadSectionProps> = ({
  form,
  existingData,
  isEditMode,
  onFileChange,
}) => {
  const { watch, setValue } = form;
  const formData = watch();

  const handleFileChange = (field: string, file: File | null) => {
    setValue(field as any, file);
    if (onFileChange) {
      onFileChange(field, file);
    }
  };

  const renderExistingFile = (
    fileUrl: string | undefined,
    newFile: File | undefined,
    fileType: 'receipt' | 'photo',
    label: string
  ) => {
    const hasNewFile = newFile && isFileObject(newFile);
    const hasExistingFile = fileUrl && typeof fileUrl === 'string';

    return (
      <div className="space-y-3">
        {/* Existing file display */}
        {hasExistingFile && !hasNewFile && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {fileType === 'receipt' ? (
                  <Receipt className="w-4 h-4 text-blue-600" />
                ) : (
                  <Image className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {label} tersedia
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(fileUrl, `${fileType}_${existingData.id}`)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileUrl, '_blank')}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* New file display */}
        {hasNewFile && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {fileType === 'receipt' ? (
                  <Receipt className="w-4 h-4 text-green-600" />
                ) : (
                  <Image className="w-4 h-4 text-green-600" />
                )}
                <span className="text-sm text-green-700 dark:text-green-300">
                  File baru: {getFileName(newFile)}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFileChange(fileType === 'receipt' ? 'receipt_file' : 'item_photo', null)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* File input for edit mode */}
        {isEditMode && (
          <div>
            <FileInput
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                handleFileChange(fileType === 'receipt' ? 'receipt_file' : 'item_photo', file);
              }}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              {fileType === 'receipt' 
                ? 'Upload bukti invoice baru (PDF/JPG/PNG) - Opsional'
                : 'Upload foto realisasi baru (JPG/PNG) - Opsional'
              }
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Lampiran Realisasi
      </h3>

      {/* Receipt File Section */}
      <div className="space-y-3">
        <Label htmlFor="receipt_file">Lampiran Bukti Invoice</Label>
        
        {renderExistingFile(
          existingData.receipt_file,
          formData.receipt_file,
          'receipt',
          'Bukti Invoice'
        )}
      </div>

      {/* Item Photo Section */}
      <div className="space-y-3">
        <Label htmlFor="item_photo">Foto Barang/Item</Label>
        
        {renderExistingFile(
          existingData.item_photo,
          formData.item_photo,
          'photo',
          'Foto Item'
        )}
      </div>

      {/* Info box */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Info:</strong> File yang sudah ada akan tetap digunakan jika tidak ada file baru yang diunggah.
        </p>
      </div>
    </div>
  );
};

export default EditFileUploadSection;
