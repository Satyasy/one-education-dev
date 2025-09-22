import ComponentCard from "../../../components/common/ComponentCard";
import Badge, { BadgeColor } from "../../../components/ui/badge/Badge";
import { Panjar } from "../../../types/panjar";
import { formatCurrency, getStatusColor } from "../utils/panjarHelpers";

interface PanjarInfoCardProps {
  panjarData: Panjar;
}

export default function PanjarInfoCard({ panjarData }: PanjarInfoCardProps) {
  return (
    <ComponentCard title="Informasi Panjar">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nama Akun
          </label>
          <p className="text-gray-900 dark:text-white font-medium">
            {panjarData.budget_item?.name}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Anggaran Panjar
          </label>
          <p className="text-gray-900 dark:text-white font-bold text-lg">
            {formatCurrency(panjarData.total_amount || '0')}
          </p>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deskripsi Akun
          </label>
          <p className="text-gray-900 dark:text-white">
            {panjarData.budget_item?.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Realisasi Anggaran Akun
          </label>
          <p className="text-gray-900 dark:text-white font-bold text-lg">
            {formatCurrency(panjarData.budget_item?.realization_amount?.toString() || '0')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unit
          </label>
          <p className="text-gray-900 dark:text-white">
            {panjarData.unit?.name}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <Badge
            variant="light"
            color={getStatusColor(panjarData.status || '') as BadgeColor}
          >
            {panjarData.status}
          </Badge>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Report Status
          </label>
          <Badge
            variant="light"
            color={getStatusColor(panjarData.report_status || '') as BadgeColor}
          >
            {panjarData.report_status}
          </Badge>
        </div>

      </div>
    </ComponentCard>
  );
} 