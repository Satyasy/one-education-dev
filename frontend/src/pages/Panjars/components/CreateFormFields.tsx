import React from 'react';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/input/InputField';
import { unitOptions } from '../utils/panjarHelpers';
import { formatCurrency } from '../utils/formUtils';
import CurrencyInput from 'react-currency-input-field';

interface CreateFormFieldsProps {
  form: any; // Simplified type
}

export const CreateFormFields: React.FC<CreateFormFieldsProps> = ({
  form,
}) => {
  const { register, watch, setValue, formState: { errors } } = form;

  // Watch values for calculations
  const quantity = watch('quantity') || 0;
  const price = watch('price') || 0;
  const total = quantity * price;

  // Auto-calculate total when quantity or price changes
  React.useEffect(() => {
    setValue('total', total);
  }, [quantity, price, total, setValue]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Item Information
      </h3>

      {/* Item Name */}
      <div className="space-y-2">
        <Label htmlFor="item_name">
          Item Name *
        </Label>
        <input
          {...register('item_name', { required: 'Item name is required' })}
          id="item_name"
          name="item_name"
          type="text"
          placeholder="Enter item name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        {errors.item_name && (
          <p className="text-sm text-red-500">{errors.item_name.message}</p>
        )}
      </div>

      {/* Specification */}
      <div className="space-y-2">
        <Label htmlFor="spesification">
          Specification
        </Label>
        <Input
          {...register('spesification')}
          id="spesification"
          placeholder="Enter item specification"
          className="w-full"
        />
        {errors.spesification && (
          <p className="text-sm text-red-500">{errors.spesification.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description *
        </Label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          id="description"
          name="description"
          placeholder="Enter item description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Unit */}
      <div className="space-y-2">
        <Label htmlFor="unit">
          Unit *
        </Label>
        <select
          {...register('unit', { required: 'Unit is required' })}
          id="unit"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select Unit</option>
          {unitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.unit && (
          <p className="text-sm text-red-500">{errors.unit.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="quantity">
          Quantity *
        </Label>
        <Input
          {...register('quantity', { 
            valueAsNumber: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const value = parseInt(e.target.value);
              setValue('quantity', isNaN(value) ? 0 : value, { shouldValidate: true });
            }
          })}
          id="quantity"
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          className="w-full"
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Unit Price *
        </Label>
        <CurrencyInput
          id="price"
          placeholder="Rp 0"
          allowDecimals={true}
          decimalsLimit={2}
          prefix="Rp "
          groupSeparator="."
          decimalSeparator=","
          value={price}
          onValueChange={(value) => {
            const numericValue = parseFloat(value || '0');
            setValue('price', numericValue, { shouldValidate: true });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* Total (Read-only, auto-calculated) */}
      <div className="space-y-2">
        <Label htmlFor="total">
          Total Amount
        </Label>
        <Input
          value={`Rp ${formatCurrency(total)}`}
          disabled
          className="w-full bg-gray-50 dark:bg-gray-700"
        />
      </div>
    </div>
  );
};
