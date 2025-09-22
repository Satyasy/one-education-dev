import React from 'react';
import Label from '../../../components/form/Label';
import FileInput from '../../../components/form/input/FileInput';

interface FileUploadSectionNewProps {
  form: any; // Simplified type
  onFileChange?: (field: string, file: File | null) => void;
}

export const FileUploadSectionNew: React.FC<FileUploadSectionNewProps> = ({
  form,
  onFileChange,
}) => {
  const { setValue } = form;

  const handleFileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setValue(field, file);
    onFileChange?.(field, file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
        File Upload
      </h3>

      {/* Receipt File */}
      <div className="space-y-2">
        <Label htmlFor="receipt_file">
          Receipt File *
        </Label>
        <FileInput
          onChange={handleFileChange('receipt_file')}
          className="w-full"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload receipt file (Images, PDF, Word documents)
        </p>
      </div>

      {/* Item Photo */}
      <div className="space-y-2">
        <Label htmlFor="item_photo">
          Item Photo
        </Label>
        <FileInput
          onChange={handleFileChange('item_photo')}
          className="w-full"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload item photo (Images only)
        </p>
      </div>
    </div>
  );
};
