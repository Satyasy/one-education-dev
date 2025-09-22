import React from 'react';
import { PanjarRealizationItemRequest, PanjarRealizationItemResponse } from '../../../types/panjarRealizationItem';
import Label from '../../../components/form/Label';
import FileInput from '../../../components/form/input/FileInput';
import Button from '../../../components/ui/button/Button';
import { ExternalLink, Download, Image, Receipt, X } from 'lucide-react';
import { isFileObject, getFileName, downloadFile } from '../utils/fileUtils';

interface EditFileUploadSectionProps {
  formData: PanjarRealizationItemRequest;
  existingData: PanjarRealizationItemResponse;
  isEditMode: boolean;
  onFileChange: (field: string, file: File | null) => void;
}

export const EditFileUploadSection: React.FC<EditFileUploadSectionProps> = ({
  formData,
  existingData,
  isEditMode,
  onFileChange,
}) => {
  const renderExistingFile = (
    fileUrl: string | undefined,
    newFile: File | undefined,
    fileType: 'receipt' | 'photo',
    label: string
  ) => {
    const hasNewFile = newFile && isFileObject(newFile);
    const hasExistingFile = fileUrl && typeof fileUrl === 'string';

    if (!hasNewFile && !hasExistingFile) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tidak ada file
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* Show new file if uploaded */}
        {hasNewFile && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  File Baru: {getFileName(newFile)}
                </span>
              </div>
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onFileChange(fileType === 'receipt' ? 'receipt_file' : 'item_photo', null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Show existing file if no new file */}
        {!hasNewFile && hasExistingFile && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              {fileType === 'photo' ? (
                <Image className="w-5 h-5 text-blue-600 mt-1" />
              ) : (
                <Receipt className="w-5 h-5 text-blue-600 mt-1" />
              )}
              <div className="flex-1">
                <span className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                  {label} Saat Ini
                </span>
                
                {/* Preview for photos */}
                {fileType === 'photo' && (
                  <div className="mt-2">
                    <div className="aspect-video w-full max-w-xs rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={fileUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => window.open(fileUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Lihat
              </Button>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => downloadFile(fileUrl, `${fileType}_${existingData.id}`)}
                className="flex-1"
              >
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFileStatus = (file: File | undefined) => {
    if (!file || !isFileObject(file)) return null;
    
    return (
      <p className="mt-1 text-sm text-green-600">
        ✓ File baru terpilih: {getFileName(file)}
      </p>
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
        
        {/* Show existing/new file */}
        {renderExistingFile(
          existingData.receipt_file,
          formData.receipt_file,
          'receipt',
          'Bukti Invoice'
        )}

        {/* File input for upload new file */}
        {isEditMode && (
          <div className="space-y-2">
            <FileInput
              onChange={(e) => onFileChange('receipt_file', e.target.files?.[0] || null)}
              className="custom-class"
            />
            {renderFileStatus(formData.receipt_file)}
            <p className="text-xs text-gray-500">
              Upload bukti pembayaran baru (PDF/JPG/PNG) - Opsional
            </p>
          </div>
        )}
      </div>

      {/* Item Photo Section */}
      <div className="space-y-3">
        <Label htmlFor="item_photo">Lampiran Bukti Foto</Label>
        
        {/* Show existing/new file */}
        {renderExistingFile(
          existingData.item_photo,
          formData.item_photo,
          'photo',
          'Foto Item'
        )}

        {/* File input for upload new file */}
        {isEditMode && (
          <div className="space-y-2">
            <FileInput
              onChange={(e) => onFileChange('item_photo', e.target.files?.[0] || null)}
              className="custom-class"
            />
            {renderFileStatus(formData.item_photo)}
            <p className="text-xs text-gray-500">
              Upload foto realisasi baru (JPG/PNG) - Opsional
            </p>
          </div>
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
