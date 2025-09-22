import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Edit, X } from "lucide-react";
import { UpdatePanjarItemRequest } from "../../../types/panjarItem";
import { unitOptions } from "../utils/panjarHelpers";
import Select from "../../../components/form/Select";

interface EditPanjarItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdatePanjarItemRequest) => void;
  isLoading: boolean;
  initialData?: {
    id: number;
    item_name: string;
    spesification: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
    description: string;
    status: string;
    note: string;
  };
}

export default function EditPanjarItemModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  initialData 
}: EditPanjarItemModalProps) {
  const [formData, setFormData] = useState({
    item_name: "",
    spesification: "",
    quantity: 1,
    unit: "",
    price: 0,   
    total: 0,
    description: "",
    status: "",
    note: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form with initial data when modal opens
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        item_name: initialData.item_name || "",
        spesification: initialData.spesification || "",
        quantity: initialData.quantity || 1,
        unit: initialData.unit || "",
        price: initialData.price || 0,
        total: initialData.total || 0,
        description: initialData.description || "",
        status: initialData.status || "",
        note: initialData.note || ""
      });
    }
  }, [initialData, isOpen]);

  // Calculate total when quantity or price changes
  useEffect(() => {
    const total = formData.quantity * formData.price;
    setFormData(prev => ({ ...prev, total }));
  }, [formData.quantity, formData.price]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_name.trim()) {
      newErrors.item_name = "Nama item harus diisi";
    }

    if (!formData.spesification.trim()) {
      newErrors.spesification = "Spesifikasi harus diisi";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity harus lebih dari 0";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit harus diisi";
    }

    if (formData.price <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && initialData) {
      onSubmit(initialData.id, {
        ...formData,
        price: formData.price,
        total: formData.total,
        status: initialData.status,
        note: initialData.note
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      item_name: "",
      spesification: "",
      quantity: 1,
      unit: "",
      price: 0,
      total: 0,
      description: "",
      status: "",
      note: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-2xl p-5 lg:p-8 max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-3">
          <Edit className="w-6 h-6 text-blue-600" />
          Edit Item Panjar
        </h4>

        <div className="space-y-4">
          {/* Item Name */}
          <div>
            <Label htmlFor="item_name">Nama Item *</Label>
            <Input
              id="item_name"
              type="text"
              value={formData.item_name}
              onChange={(e) => handleInputChange('item_name', e.target.value)}
              placeholder="Contoh: Modul IoT Kit"
              error={!!errors.item_name}
            />
            {errors.item_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.item_name}
              </p>
            )}
          </div>

          {/* Specification */}
          <div>
            <Label htmlFor="spesification">Spesifikasi *</Label>
            <Input
              id="spesification"
              type="text"
              value={formData.spesification}
              onChange={(e) => handleInputChange('spesification', e.target.value)}
              placeholder="Contoh: Arduino, Kabel Jumper"
              error={!!errors.spesification}
            />
            {errors.spesification && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.spesification}
              </p>
            )}
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="text"
                value={formData.quantity === 0 ? "" : formData.quantity.toLocaleString('id-ID')}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '');
                  handleInputChange('quantity', numericValue ? parseInt(numericValue) : 0);
                }}
                placeholder="40"
                error={!!errors.quantity}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.quantity}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select
                options={unitOptions}
                onChange={(value) => handleInputChange('unit', value)}
                placeholder="Pilih unit"
                value={formData.unit}
              />
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.unit}
                </p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Harga Satuan *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                id="price"
                type="text"
                value={formData.price === 0 ? "" : formData.price.toLocaleString('id-ID')}
                onChange={(e) => {
                  // Remove non-numeric characters
                  const numericValue = e.target.value.replace(/\D/g, '');
                  handleInputChange('price', numericValue ? parseInt(numericValue) : 0);
                }}
                placeholder="150.000"
                className="pl-9"
                error={!!errors.price}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.price}
              </p>
            )}
          </div>

          {/* Total (Read-only) */}
          <div>
            <Label>Total (Otomatis)</Label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Rp {formData.total.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Deskripsi *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Contoh: Konsumsi peserta workshop"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleClose} 
            type="button"
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button 
            size="sm" 
            type="submit"
            disabled={isLoading}
            startIcon={isLoading ? undefined : <Edit className="w-4 h-4" />}
          >
            {isLoading ? "Mengupdate..." : "Update Item"}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 