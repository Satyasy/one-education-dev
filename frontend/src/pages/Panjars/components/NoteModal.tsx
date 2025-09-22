import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import Label from "../../../components/form/Label";
import { MessageSquare } from "lucide-react";
import { CurrentEditingItem } from "../types/panjarTypes";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEditingItem: CurrentEditingItem | null;
  onSave: () => void;
  onCancel: () => void;
  onNoteChange: (note: string) => void;
}

export default function NoteModal({ 
  isOpen, 
  onClose, 
  currentEditingItem, 
  onSave, 
  onCancel, 
  onNoteChange 
}: NoteModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form onSubmit={handleSubmit}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Tambah Catatan Item
        </h4>

        <div className="space-y-4">
          <div>
            <Label>Nama Item</Label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {currentEditingItem?.name}
              </p>
            </div>
          </div>

          <div>
            <Label>Catatan</Label>
            <textarea
              value={currentEditingItem?.note || ''}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Tambahkan catatan untuk item ini..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onCancel} type="button">
            Batal
          </Button>
          <Button size="sm" type="submit">
            Simpan Catatan
          </Button>
        </div>
      </form>
    </Modal>
  );
} 