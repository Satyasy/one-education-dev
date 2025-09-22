import React from 'react';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import { unitOptions } from '../utils/panjarHelpers';
import { formatCurrency } from '../utils/panjarHelpers';

interface FormFieldsProps {
  form: any; // Simplified type
  isEditMode: boolean;
  onFieldChange?: (field: string, value: string | number) => void;
}

export const FormFieldsNew: React.FC<FormFieldsProps> = ({
  form,
  isEditMode,
}) => {
  const { register, watch, formState: { errors } } = form;
  const inputClassName = !isEditMode ? "bg-gray-50 dark:bg-gray-800" : "";

  // Watch values for display
  const formData = watch();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Detail Item Panjar
      </h3>
      
      <div>
        <Label htmlFor="item_name">Nama Item</Label>
        <input
          id="item_name"
          type="text"
          {...register('item_name')}
          disabled={!isEditMode}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
        />
        {errors.item_name && (
          <p className="text-red-500 text-sm mt-1">{errors.item_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="spesification">Spesifikasi</Label>
        <input
          id="spesification"
          type="text"
          {...register('spesification')}
          disabled={!isEditMode}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <input
          id="description"
          type="text"
          {...register('description')}
          disabled={!isEditMode}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Jumlah</Label>
          <input
            id="quantity"
            type="number"
            step={1}
            min={0}
            {...register('quantity', { valueAsNumber: true })}
            disabled={!isEditMode}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="unit">Satuan</Label>
          <select
            id="unit"
            {...register('unit')}
            disabled={!isEditMode}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
          >
            <option value="">Pilih satuan</option>
            {unitOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.unit && (
            <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="price">Harga Satuan</Label>
        <input
          id="price"
          type="number"
          step={1}
          min={0}
          {...register('price', { valueAsNumber: true })}
          disabled={!isEditMode}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 ${inputClassName}`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="total">Total</Label>
        <Input
          id="total"
          type="text"
          value={formatCurrency(formData.total || 0)}
          disabled
          className="bg-gray-100 dark:bg-gray-700"
        />
      </div>
    </div>
  );
};
