import { PanjarRealizationItem } from "../../../types/panjarRealizationItem";
import { useGetAllPanjarRealizationItemsQuery, useDeletePanjarRealizationItemMutation, useUpdateReportStatusPanjarRealizationItemMutation } from "../../../api/panjarRealizationItemApi";
import ComponentCard from "../../../components/common/ComponentCard";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table/index.tsx";
import SpinnerOne from "../../../components/ui/spinner/SpinnerOne";
import Badge, { BadgeColor } from "../../../components/ui/badge/Badge";
import { formatCurrency, getStatusColor } from "../utils/panjarHelpers";
import { Edit3, Eye, Trash, MoreHorizontal, Check, X, RotateCcw } from "lucide-react";
import Button from "../../../components/ui/button/Button";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { toast } from "react-hot-toast";

interface PanjarRealizationItemsTableProps {
    panjarRequestId: string;
}

export default function PanjarRealizationItemsTable({ panjarRequestId }: PanjarRealizationItemsTableProps) {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<PanjarRealizationItem | null>(null);
    const [openKebabMenuId, setOpenKebabMenuId] = useState<number | null>(null);
    
    const { data: realizationItems, isLoading } = useGetAllPanjarRealizationItemsQuery({
        panjar_request_id: Number(panjarRequestId)
    });
    const [deleteItem, { isLoading: isDeleting }] = useDeletePanjarRealizationItemMutation();
    const [updateReportStatus, { isLoading: isUpdatingStatus }] = useUpdateReportStatusPanjarRealizationItemMutation();

    const openDeleteModal = (item: PanjarRealizationItem) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete?.id) return;
        
        try {
            await deleteItem({ panjar_realization_item_id: itemToDelete.id }).unwrap();
            toast.success('Item berhasil dihapus');
            closeDeleteModal();
        } catch (error) {
            toast.error('Gagal menghapus item');
            console.error('Delete error:', error);
        }
    };

    const toggleKebabMenu = (itemId: number) => {
        setOpenKebabMenuId(openKebabMenuId === itemId ? null : itemId);
    };

    const handleUpdateReportStatus = async (itemId: number, status: 'approved' | 'revision' | 'rejected' | 'verified') => {
        try {
            await updateReportStatus({ 
                panjar_realization_item_id: itemId, 
                report_status: status 
            }).unwrap();
            toast.success(`Status berhasil diubah menjadi ${status}`);
            setOpenKebabMenuId(null);
        } catch (error) {
            toast.error('Gagal mengubah status');
            console.error('Update status error:', error);
        }
    };

    // Close kebab menu when clicking outside
    const handleOutsideClick = () => {
        setOpenKebabMenuId(null);
    };

    if (isLoading) {
        return <SpinnerOne />;
    }


    return (
        <div onClick={handleOutsideClick}>
            <ComponentCard title="Daftar Realisasi Panjar" className="mb-4">
                <div className="flex justify-end mb-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/panjar-realization-items/create/${panjarRequestId}`)}
                    >
                        + Tambah Realisasi Panjar
                    </Button>
                </div>
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
                        {/* Data rows will be populated here */}
                        {realizationItems && realizationItems.length > 0 ? (
                            realizationItems.map((item: PanjarRealizationItem) => (
                                <TableRow key={item.id}>
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
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                            {formatCurrency(String(item.price))}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                            {formatCurrency(String(item.total))}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                                        <Badge
                                            variant="light"
                                            color={getStatusColor(item.report_status || '') as BadgeColor}
                                        >
                                            {item.report_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 border border-gray-100 dark:border-white/[0.05] whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/panjar-realization-items/edit/${item.id}`)}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/panjar-realization-items/${item.id}`)}
                                                title="Lihat Item"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => item.id && openDeleteModal(item)}
                                                title="Hapus Item"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                            
                                            {/* Kebab Menu for Report Status */}
                                            <div className="relative">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        item.id && toggleKebabMenu(item.id);
                                                    }}
                                                    title="Update Status"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                                
                                                {openKebabMenuId === item.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    item.id && handleUpdateReportStatus(item.id, 'approved');
                                                                }}
                                                                disabled={isUpdatingStatus}
                                                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    item.id && handleUpdateReportStatus(item.id, 'verified');
                                                                }}
                                                                disabled={isUpdatingStatus}
                                                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                                Verifikasi
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    item.id && handleUpdateReportStatus(item.id, 'revision');
                                                                }}
                                                                disabled={isUpdatingStatus}
                                                                className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                                Revision
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    item.id && handleUpdateReportStatus(item.id, 'rejected');
                                                                }}
                                                                disabled={isUpdatingStatus}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 disabled:opacity-50"
                                                            >
                                                                <X className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>

                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center px-4 py-3 border border-gray-100 dark:border-white/[0.05]">
                                    <p className="text-gray-500">Tidak ada data realisasi panjar.</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ComponentCard>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                showCloseButton={false}
                className="max-w-[507px] p-6 lg:p-10"
            >
                <div className="text-center">
                    <div className="mb-4">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <Trash className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        Konfirmasi Hapus Item
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Apakah Anda yakin ingin menghapus item "<strong>{itemToDelete?.item_name}</strong>"? 
                        Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={closeDeleteModal}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button 
                            size="sm" 
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Menghapus..." : "Hapus"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}