import { useParams, useNavigate } from 'react-router';
import { useGetPanjarRealizationItemsByIdQuery } from '../../api/panjarRealizationItemApi';
import ComponentCard from '../../components/common/ComponentCard';
import SpinnerOne from '../../components/ui/spinner/SpinnerOne';
import Button from '../../components/ui/button/Button';
import Badge from '../../components/ui/badge/Badge';
import { 
    ArrowLeft, 
    Package, 
    DollarSign, 
    Hash, 
    FileText, 
    Calendar,
    Image,
    Receipt,
    Building2,
    User,
    Download,
    ExternalLink
} from 'lucide-react';
import { formatCurrency } from './utils/panjarHelpers';
import { downloadFile } from './utils/fileUtils';

export default function DetailPanjarRealizationItem() {
    const { panjarRealizationItemId } = useParams();
    const navigate = useNavigate();
    
    const { data: realizationItem, isLoading, error } = useGetPanjarRealizationItemsByIdQuery({
        panjar_realization_item_id: Number(panjarRealizationItemId)
    });

    if (isLoading) {
        return <SpinnerOne />;
    }

    if (error || !realizationItem) {
        return (
            <ComponentCard title="Error" className="mb-4">
                <div className="text-center py-8">
                    <p className="text-red-500">Data tidak ditemukan atau terjadi kesalahan.</p>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(-1)}
                        className="mt-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                </div>
            </ComponentCard>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detail Realisasi Panjar
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            ID: #{realizationItem.id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Item Information */}
                    <ComponentCard title="Informasi Item" className="p-6">
                        <div className="space-y-6">
                            {/* Item Name */}
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-blue-600 mt-1" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {realizationItem.item_name}
                                    </h3>
                                    <Badge color="info" variant="light" size="sm">
                                        {realizationItem.unit}
                                    </Badge>
                                </div>
                            </div>

                            {/* Specification */}
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-gray-600 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Spesifikasi
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {realizationItem.spesification}
                                    </p>
                                </div>
                            </div>

                            {/* Quantity and Price */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Hash className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Quantity
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                        {realizationItem.quantity?.toLocaleString('id-ID')}
                                    </p>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                            Harga Satuan
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-green-900 dark:text-green-100">
                                        {formatCurrency(realizationItem.price?.toString() || '0')}
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                            Total
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                                        {formatCurrency(realizationItem.total?.toString() || '0')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ComponentCard>

                    {/* Budget Information */}
                    {realizationItem.panjar_request && (
                        <ComponentCard title="Informasi Anggaran" className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Building2 className="w-5 h-5 text-orange-600 mt-1" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Unit Kerja
                                        </h4>
                                        <p className="text-gray-900 dark:text-white font-semibold">
                                            {realizationItem.panjar_request.unit}
                                        </p>
                                    </div>
                                </div>

                                {realizationItem.panjar_request.budget_item && (
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-indigo-600 mt-1" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Item Anggaran
                                            </h4>
                                            <p className="text-gray-900 dark:text-white font-semibold mb-1">
                                                {realizationItem.panjar_request.budget_item.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {realizationItem.panjar_request.budget_item.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-green-600 mt-1" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Total Anggaran Panjar
                                        </h4>
                                        <p className="text-lg font-bold text-green-600">
                                            {formatCurrency(realizationItem.panjar_request.total_amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ComponentCard>
                    )}
                </div>

                {/* Right Column - Files and Meta */}
                <div className="space-y-6">
                    {/* Files */}
                    <ComponentCard title="Dokumen" className="p-6">
                        <div className="space-y-4">
                            {/* Receipt File */}
                            {realizationItem.receipt_file && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Receipt className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Bukti Pembayaran
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => window.open(realizationItem.receipt_file, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Lihat File
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => downloadFile(
                                                realizationItem.receipt_file!, 
                                                `receipt_${realizationItem.id}.jpg`
                                            )}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Item Photo */}
                            {realizationItem.item_photo && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Image className="w-5 h-5 text-green-600" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Foto Item
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <img 
                                                src={realizationItem.item_photo}
                                                alt="Foto Item"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full"
                                            onClick={() => window.open(realizationItem.item_photo, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Lihat Ukuran Penuh
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ComponentCard>

                    {/* Meta Information */}
                    <ComponentCard title="Informasi Tambahan" className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <div>
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tanggal Dibuat
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(realizationItem.created_at!)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Hash className="w-5 h-5 text-gray-600" />
                                <div>
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        ID Realisasi
                                    </h4>
                                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                        #{realizationItem.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}