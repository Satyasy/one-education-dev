import { useParams } from 'react-router'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCard from '../../components/common/ComponentCard'
import PageMeta from '../../components/common/PageMeta'
import { useGetBudgetByIdQuery } from '../../api/budgetApi'
import Badge from '../../components/ui/badge/Badge'
import { Card } from '../../components/ui/card'
import { formatCurrency } from '../../utils/currency'
import SpinnerOne from '../../components/ui/spinner/SpinnerOne'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table/index.tsx";

function DetailBudget() {
    const { id } = useParams<{ id: string }>()
    const { data: budgetData, error, isLoading, refetch } = useGetBudgetByIdQuery(Number(id))

    // Calculate total budget amount
    const totalAmount = budgetData?.budget_items?.reduce((sum, item) => {
        const amount = typeof item.amount_allocation === 'string' ? parseFloat(item.amount_allocation) : item.amount_allocation || 0
        return sum + amount
    }, 0) || 0

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <SpinnerOne />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Gagal memuat data anggaran. Silakan coba lagi.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        )
    }

    if (!budgetData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Tidak Ditemukan</h3>
                    <p className="text-gray-600 dark:text-gray-400">Anggaran dengan ID #{id} tidak ditemukan.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <PageMeta 
                title={`Detail Budget - ${budgetData.unit?.name || ''} | TailAdmin`} 
                description="Halaman detail anggaran dan item." 
            />
            <PageBreadcrumb pageTitle="Detail Budget" />
            
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header Section with enhanced styling */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Detail Budget #{id}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Informasi lengkap anggaran dan alokasi item
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="light">
                                {budgetData.budget_items?.length || 0} Items
                            </Badge>
                            <Badge variant="light">
                                Q{budgetData.quarterly}
                            </Badge>
                        </div>
                    </div>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <ComponentCard
                            title="Ringkasan Anggaran">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {budgetData.budget_year?.year || '-'}
                                    </p>
                                </div>
                            </div>
                        </ComponentCard>

                        <ComponentCard title="Unit Kerja">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold text-green-900 dark:text-green-100 line-clamp-2">
                                        {budgetData.unit?.name || '-'}
                                    </p>
                                </div>
                            </div>
                        </ComponentCard>

                        <ComponentCard title="Triwulan">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                        Q{budgetData.quarterly || '-'}
                                    </p>
                                </div>
                            </div>
                        </ComponentCard>

                        <ComponentCard title="Total Anggaran">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </ComponentCard>
                    </div>
                </div>

                {/* Budget Items Section with enhanced table */}
                <ComponentCard title="Daftar Item Anggaran">
                    <div className="p-2">
                        {budgetData.budget_items && budgetData.budget_items.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-t border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >No.</TableCell>
                                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >Nama Item</TableCell>
                                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >Alokasi Anggaran</TableCell>
                                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >Persentase</TableCell>
                                            <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >Keterangan</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                        {(budgetData.budget_items || []).map((item, index) => {
                                            const percentage = totalAmount > 0 ? ((item.amount_allocation / totalAmount) * 100) : 0
                                            return (
                                                <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >
                                                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            {formatCurrency(item.amount_allocation)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 border border-gray-100 dark:border-white/[0.05]" >
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                                                                <div 
                                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                                {percentage.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Belum Ada Item Anggaran
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                                    Anggaran ini belum memiliki item yang dialokasikan. Tambahkan item anggaran untuk melihat detail alokasi.
                                </p>
                            </div>
                        )}
                    </div>
                </ComponentCard>
            </div>
        </>
    )
}

export default DetailBudget