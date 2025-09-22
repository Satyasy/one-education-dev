import { useState, useEffect } from 'react';
import { PanjarRealizationItemRequest, PanjarRealizationItemResponse } from '../../../types/panjarRealizationItem';
import { DEFAULT_STATUS } from '../constants/realizationConstants';

interface UseFormDataParams {
  panjarId: string;
  apiData?: PanjarRealizationItemResponse[];
}

export const useFormData = ({ panjarId, apiData }: UseFormDataParams) => {
  const [formData, setFormData] = useState<PanjarRealizationItemRequest>({
    panjar_request_id: Number(panjarId),
    item_name: "",
    spesification: "",
    description: "",
    quantity: 0,
    unit: "",
    price: 0,
    total: 0,
    report_status: DEFAULT_STATUS,
    receipt_file: undefined,
    item_photo: undefined
  });

  // Initialize form data when API data is loaded
  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const item = apiData[0];
      setFormData({
        ...item,
        panjar_request_id: Number(panjarId),
        receipt_file: undefined, // Reset to File type for form
        item_photo: undefined,   // Reset to File type for form
      });
    }
  }, [apiData, panjarId]);

  // Calculate total when quantity or price changes
  useEffect(() => {
    const total = Number(formData.quantity || 0) * Number(formData.price || 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.quantity, formData.price]);

  const updateFormData = (field: string, value: string | number | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateFormData,
  };
};
