import { Modal } from "../../../components/ui/modal";
import Badge, { BadgeColor } from "../../../components/ui/badge/Badge";
import { formatCurrency, getStatusColor } from "../utils/panjarHelpers";
import { PanjarItem } from "../../../types/panjar";
import { X } from "lucide-react";
import Button from "../../../components/ui/button/Button";

interface PanjarItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PanjarItem | null;
}

export default function PanjarItemDetailModal({ 
  isOpen, 
  onClose, 
  item 
}: PanjarItemDetailModalProps) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-2xl max-h-5/6 p-0"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detail Item Panjar
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Item
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium">
                {item.item_name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <Badge
                variant="light"
                color={getStatusColor(item.status || '') as BadgeColor}
              >
                {item.status}
              </Badge>
            </div>
          </div>

          {/* Specification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Spesifikasi
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {item.spesification || '-'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi
            </label>
            <p className="text-base text-gray-900 dark:text-white">
              {item.description || '-'}
            </p>
          </div>

          {/* Quantity and Price Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <p className="text-base text-gray-900 dark:text-white">
                {item.quantity} {item.unit}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Satuan
              </label>
              <p className="text-base text-gray-900 dark:text-white font-medium">
                {formatCurrency(item.price)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Harga
              </label>
              <p className="text-lg text-gray-900 dark:text-white font-bold">
                {formatCurrency(item.total)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="primary"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
