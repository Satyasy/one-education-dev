import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Edit, CheckLine as CheckLineIcon } from "lucide-react";
import { PanjarItem } from "../../../types/panjar";
import { unitOptions } from "../utils/panjarHelpers";
import Select from "../../../components/form/Select";
import TextArea from "../../../components/form/input/TextArea";
import { formatCurrency, parseCurrency, formatCurrencyInput } from "../../../utils/currency";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingItem: PanjarItem | null;
  editPriceDisplay: string;
  handleEditItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditItemUnitChange: (value: string) => void;
  handleEditPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setEditingItem: (item: PanjarItem | null) => void;
}

export default function EditItemModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
  editPriceDisplay,
  handleEditItemChange,
  handleEditItemUnitChange,
  handleEditPriceChange,
  setEditingItem
}: EditItemModalProps) {
  if (!editingItem) return null;

  const handleDescriptionChange = (value: string) => {
    setEditingItem({ ...editingItem, description: value });
  };

  const handleSpesificationChange = (value: string) => {
    setEditingItem({ ...editingItem, spesification: value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-5 lg:p-8 max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
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
              name="item_name"
              value={editingItem.item_name}
              onChange={handleEditItemChange}
              placeholder="Contoh: Modul IoT Kit"
            />
          </div>

          {/* Specification */}
          <div>
            <Label htmlFor="spesification">Spesifikasi *</Label>
            <TextArea
              value={editingItem.spesification}
              onChange={handleSpesificationChange}
              placeholder="Contoh: Arduino, Kabel Jumper"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <TextArea
              value={editingItem.description || ""}
              onChange={handleDescriptionChange}
              placeholder="Deskripsi item"
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                name="quantity"
                value={editingItem.quantity}
                onChange={handleEditItemChange}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="unit">Satuan *</Label>
              <Select
                options={unitOptions}
                placeholder="Pilih satuan"
                onChange={handleEditItemUnitChange}
                defaultValue={editingItem.unit}
              />
            </div>
          </div>

          {/* Price and Total */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga Satuan *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                  Rp
                </span>
                <Input
                  id="price"
                  type="text"
                  value={editPriceDisplay}
                  onChange={handleEditPriceChange}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="total">Total</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                  Rp
                </span>
                <Input
                  id="total"
                  type="text"
                  value={formatCurrency(editingItem.total)}
                  disabled
                  className="pl-8 bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onClose} 
            type="button"
          >
            Batal
          </Button>
          <Button 
            size="sm" 
            type="submit"
            startIcon={<CheckLineIcon className="w-4 h-4" />}
          >
            Update Item
          </Button>
        </div>
      </form>
    </Modal>
  );
}