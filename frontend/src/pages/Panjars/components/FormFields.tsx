import React from 'react';
import CurrencyInput from 'react-currency-input-field';
import { UseFormReturn } from 'react-hook-form';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import Select from '../../../components/form/Select';
import { unitOptions } from '../utils/panjarHelpers';
import { formatCurrency, parseCurrencyInput } from '../utils/formUtils';
import { EditPanjarRealizationItemFormData } from '../schemas/editPanjarRealizationItemSchema';

interface FormFieldsProps {
  form: UseFormReturn<EditPanjarRealizationItemFormData>;
  isEditMode: boolean;
  onFieldChange: (field: string, value: string | number) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  form,
  isEditMode,
  onFieldChange,
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
        <Input
          id="item_name"
          type="text"
          value={formData.item_name || ""}
          onChange={(e) => onFieldChange('item_name', e.target.value)}
          disabled={!isEditMode}
          className={inputClassName}
        />
      </div>

      <div>
        <Label htmlFor="spesification">Spesifikasi</Label>
        <Input
          id="spesification"
          type="text"
          value={formData.spesification || ""}
          onChange={(e) => onFieldChange('spesification', e.target.value)}
          disabled={!isEditMode}
          className={inputClassName}
        />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Input
          id="description"
          type="text"
          value={formData.description || ""}
          onChange={(e) => onFieldChange('description', e.target.value)}
          disabled={!isEditMode}
          className={inputClassName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="text"
            value={isEditMode 
              ? (formData.quantity || 0).toString() 
              : formatCurrency(formData.quantity || 0)
            }
            onChange={(e) => onFieldChange('quantity', parseCurrencyInput(e.target.value))}
            disabled={!isEditMode}
            className={inputClassName}
          />
        </div>
        
        <div>
          <Label htmlFor="unit">Unit</Label>
          {isEditMode ? (
            <Select
              options={unitOptions}
              onChange={(value) => onFieldChange('unit', value)}
              placeholder="Pilih unit"
              value={formData.unit || ""}
            />
          ) : (
            <Input
              id="unit"
              type="text"
              value={formData.unit || ""}
              disabled
              className={inputClassName}
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="price">Harga Satuan</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            Rp
          </span>
          <CurrencyInput
            id="price"
            prefix='Rp'
            type="text"
            value={isEditMode 
              ? (formData.price === 0 ? "" : (formData.price || 0).toString())
              : formatCurrency(Number(formData.price) || 0)
            }
            onChange={(e) => onFieldChange('price', parseCurrencyInput(e.target.value))}
            disabled={!isEditMode}
            className={`pl-9 ${inputClassName}`}
          />
        </div>
      </div>

      <div>
        <Label>Total</Label>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            Rp {formatCurrency(Number(formData.total) || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
