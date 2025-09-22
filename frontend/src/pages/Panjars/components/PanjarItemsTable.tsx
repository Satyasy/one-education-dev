import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Badge, { BadgeColor } from "../../../components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table/index.tsx";
import { useModal } from "../../../hooks/useModal";
import { useUpdateStatusPanjarItemMutation } from "../../../api/panjarItemApi";
import { PanjarItemRequest } from "../../../types/panjarItem";
import { formatCurrency, getStatusColor } from "../utils/panjarHelpers";
import { DropdownState, NotesState, CurrentEditingItem, CurrentHistoryItem } from "../types/panjarTypes";
import { Panjar } from "../../../types/panjar";
import NoteModal from "./NoteModal";
import HistoryModal from "./HistoryModal";
import { 
  CheckIcon, 
  MoreHorizontal, 
  X, 
  RefreshCw, 
  MessageSquare, 
  Edit3, 
  History,
  Plus,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router";
import PanjarItemDetailModal from "./PanjarItemDetailModal";

interface PanjarItemsTableProps {
  panjarData: Panjar;
  canVerify: boolean;
  canApprove: boolean;
  refetch: () => void;
  setIsAddPanjarItemModalOpen: (isOpen: boolean) => void;
  canCreate: boolean;
  onEditItem?: (item: any) => void;
}

export default function PanjarItemsTable({ 
  panjarData, 
  canVerify, 
  canApprove, 
  refetch,
  setIsAddPanjarItemModalOpen,
  canCreate,
  onEditItem
}: PanjarItemsTableProps) {
  const [updateStatusPanjarItem, { isLoading: isUpdating }] = useUpdateStatusPanjarItemMutation();
  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});
  const [itemNotes, setItemNotes] = useState<NotesState>({});
  const [currentEditingItem, setCurrentEditingItem] = useState<CurrentEditingItem | null>(null);
  const [currentHistoryItem, setCurrentHistoryItem] = useState<CurrentHistoryItem | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<any | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { isOpen: isNoteModalOpen, openModal: openNoteModal, closeModal: closeNoteModal } = useModal();
  const { isOpen: isHistoryModalOpen, openModal: openHistoryModal, closeModal: closeHistoryModal } = useModal();
  const { isOpen: isDetailModalOpen, openModal: openDetailModal, closeModal: closeDetailModal } = useModal();
  const navigate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = dropdownRefs.current.every(
        ref => ref && !ref.contains(event.target as Node)
      );
      if (isOutside) {
        setDropdownOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (itemId: number) => {
    setDropdownOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleOpenNoteModal = (itemId: number, itemName: string) => {
    setCurrentEditingItem({
      id: itemId,
      name: itemName,
      note: itemNotes[itemId] || ''
    });
    openNoteModal();
  };

  const handleSaveNote = () => {
    if (currentEditingItem) {
      setItemNotes(prev => ({
        ...prev,
        [currentEditingItem.id]: currentEditingItem.note
      }));
    }
    closeNoteModal();
    setCurrentEditingItem(null);
  };

  const handleCancelNote = () => {
    closeNoteModal();
    setCurrentEditingItem(null);
  };

  const handleNoteChange = (note: string) => {
    setCurrentEditingItem(prev => 
      prev ? { ...prev, note } : null
    );
  };

  const handleOpenHistoryModal = (itemId: number, itemName: string, histories: any[]) => {
    setCurrentHistoryItem({
      id: itemId,
      name: itemName,
      histories: histories || []
    });
    openHistoryModal();
  };

  const handleCloseHistoryModal = () => {
    closeHistoryModal();
    setCurrentHistoryItem(null);
  };

  const handleOpenDetailModal = (item: any) => {
    setSelectedItemForDetail(item);
    openDetailModal();
  };

  const handleCloseDetailModal = () => {
    closeDetailModal();
    setSelectedItemForDetail(null);
  };

  const handleUpdateStatusPanjarItem = async (panjar_item_id: number, status: string) => {
    const note = itemNotes[panjar_item_id] || '';
    const data: PanjarItemRequest = { 
      status, 
      note: note.trim() || `Item telah di-${status}` 
    };

    try {
      const result = await updateStatusPanjarItem({ panjar_item_id, data });
      
      if (result.error) {
        console.error('Update error:', result.error);
        toast.error('Gagal mengubah status panjar item');
      } else {
        toast.success(`Status panjar item berhasil di-${status}`);
        setDropdownOpen(prev => ({ ...prev, [panjar_item_id]: false }));
        refetch();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Gagal mengubah status panjar item');
    }
  };

  return (
    <>
      <ComponentCard title="Daftar Item Panjar">
        {canCreate && (panjarData.status === 'pending' || panjarData.status === 'revision') && (
        <div className="flex justify-end mb-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddPanjarItemModalOpen(true)}
          >
            + Tambah Item Panjar
          </Button>
        </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Nama Item
                  </p>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Quantity
                  </p>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Harga Satuan
                  </p>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Total
                  </p>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Status
                  </p>
                </TableCell>
                <TableCell isHeader className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                  <p className="font-medium text-gray-700 text-theme-xs dark:text-gray-400">
                    Aksi
                  </p>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panjarData && (panjarData.panjar_items?.length ?? 0) > 0 ? (
              panjarData.panjar_items?.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {item.item_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                    <span className="text-gray-800 dark:text-white/90">
                      {item.quantity} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                    <span className="text-gray-800 dark:text-white/90">
                      {formatCurrency(item.price)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {formatCurrency(item.total)}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                    <Badge
                      variant="light"
                      color={getStatusColor(item.status || '') as BadgeColor}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {canApprove && item.status === 'verified' && (
                      <div className="relative inline-block" ref={el => { dropdownRefs.current[item.id!] = el; }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(item.id!);
                          }}
                          className="flex items-center gap-1"
                          disabled={isUpdating}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        
                        {dropdownOpen[item.id!] && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusPanjarItem(item.id!, 'approved');
                                  }}
                                  disabled={isUpdating}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <CheckIcon className="w-4 h-4 text-green-600" />
                                  Setujui
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusPanjarItem(item.id!, 'revision');
                                  }}
                                  disabled={isUpdating}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <RefreshCw className="w-4 h-4 text-yellow-600" />
                                  Revisi
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusPanjarItem(item.id!, 'rejected');
                                  }}
                                  disabled={isUpdating}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                  Tolak
                                </button>
                            </div>
                          </div>
                        )}
                        </div>
                    )}
                    {canVerify && (item.status === 'pending' || item.status === 'revision') && (
                      <div className="relative inline-block" ref={el => { dropdownRefs.current[item.id!] = el; }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownToggle(item.id!);
                          }}
                          className="flex items-center gap-1"
                          disabled={isUpdating}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        
                        {dropdownOpen[item.id!] && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <div className="py-1">
                              {(item.status === 'pending' || item.status === 'revision') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusPanjarItem(item.id!, 'verified');
                                  }}
                                  disabled={isUpdating}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <CheckIcon className="w-4 h-4 text-green-600" />
                                  Verifikasi
                                </button>
                              )}
                              {item.status === 'pending' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusPanjarItem(item.id!, 'revision');
                                  }}
                                  disabled={isUpdating}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <RefreshCw className="w-4 h-4 text-yellow-600" />
                                  Revisi
                                </button>
                              )}
                              {item.status === 'pending' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatusPanjarItem(item.id!, 'rejected');
                                  }}
                                  disabled={isUpdating}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                  Tolak
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {canVerify && item.status === 'pending' || canApprove && item.status === 'verified' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNoteModal(item.id!, item.item_name);
                      }}
                      className={`p-1 h-auto transition-colors ${
                        itemNotes[item.id!]?.trim()
                          ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {itemNotes[item.id!]?.trim() ? (
                        <Edit3 className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </Button>
                    )}
                    {onEditItem && item.status === 'revision' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(item);
                        }}
                        className="p-1 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetailModal(item);
                      }}
                      className="p-1 h-auto text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {canCreate && item.status === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/panjars/${panjarData.id}/realization/item/${item.id}`);
                      }}
                      className="p-1 h-auto text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      title="Tambah Realisasi Item"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenHistoryModal(item.id!, item.item_name, item.panjar_item_histories || []);
                      }}
                      className="p-1 h-auto text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Lihat Riwayat"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                    <p className="text-gray-500">Tidak ada item panjar.</p>
                  </TableCell>
                </TableRow>
              )
              }
            </TableBody>
          </Table>
          <div className="text-right mt-4">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Total Keseluruhan: {formatCurrency(panjarData.total_amount || '0')}
            </p>
          </div>
        </div>
        
        
      </ComponentCard>

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        currentEditingItem={currentEditingItem}
        onSave={handleSaveNote}
        onCancel={handleCancelNote}
        onNoteChange={handleNoteChange}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        currentHistoryItem={currentHistoryItem}
      />

      {/* Detail Modal */}
      <PanjarItemDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        item={selectedItemForDetail}
      />
    </>
  );
}