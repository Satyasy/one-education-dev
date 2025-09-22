import { Modal } from "../../../components/ui/modal";
import Button from "../../../components/ui/button/Button";
import { History, CheckIcon, X, RefreshCw, Clock, User } from "lucide-react";
import { CurrentHistoryItem } from "../types/panjarTypes";
import { formatDate, getStatusColorClass, getStatusIconColorClass } from "../utils/panjarHelpers";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHistoryItem: CurrentHistoryItem | null;
}

export default function HistoryModal({ 
  isOpen, 
  onClose, 
  currentHistoryItem 
}: HistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl max-h-[90vh] p-5 lg:p-8"
    >
      <div>
        <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-3">
          <History className="w-6 h-6 text-blue-600" />
          Riwayat Item
        </h4>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Nama Item</h5>
          <p className="text-blue-800 dark:text-blue-200">{currentHistoryItem?.name}</p>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {currentHistoryItem?.histories && currentHistoryItem.histories.length > 0 ? (
            <div className="space-y-4">
              {currentHistoryItem.histories.map((history, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index !== currentHistoryItem.histories.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusIconColorClass(history.status)}`}>
                      {history.status === 'approved' && <CheckIcon className="w-5 h-5" />}
                      {history.status === 'verified' && <CheckIcon className="w-5 h-5" />}
                      {history.status === 'rejected' && <X className="w-5 h-5" />}
                      {history.status === 'revision' && <RefreshCw className="w-5 h-5" />}
                      {history.status === 'pending' && <Clock className="w-5 h-5" />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColorClass(history.status)}`}>
                            {history.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(history.created_at)}
                          </span>
                        </div>
                        
                        {history.note && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                            "{history.note}"
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <User className="w-3 h-3" />
                          <span>Oleh: {history?.reviewed_by || 'System'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Belum Ada Riwayat
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Riwayat perubahan status akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
} 