import { BadgeColor } from "../../../components/ui/badge/Badge";

export const formatCurrency = (amount: string) => {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fungsi untuk mendapatkan nilai enum BadgeColor
export const getStatusColor = (status: string): BadgeColor => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'verified':
      return 'info';
    case 'rejected':
      return 'error';
    case 'revision':
      return 'warning';
    case 'pending':
      return 'warning';
    case 'reported':
      return 'success';
    case 'submitted':
      return 'info';
    case 'not_reported':
      return 'error';
    default:
      return 'info';
  }
}; 

// Fungsi untuk mendapatkan class CSS berdasarkan status
export const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500';
    case 'verified':
      return 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500';
    case 'rejected':
      return 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500';
    case 'revision':
      return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400';
    case 'pending':
      return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400';
    case 'reported':
      return 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500';
    case 'submitted':
      return 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500';
    case 'not_reported':
      return 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500';
    default:
      return 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500';
  }
};

// Fungsi untuk mendapatkan class CSS untuk ikon berdasarkan status
export const getStatusIconColorClass = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-success-500 text-white';
    case 'verified':
      return 'bg-blue-light-500 text-white';
    case 'rejected':
      return 'bg-error-500 text-white';
    case 'revision':
      return 'bg-warning-500 text-white';
    case 'pending':
      return 'bg-warning-500 text-white';
    case 'reported':
      return 'bg-success-500 text-white';
    case 'submitted':
      return 'bg-blue-light-500 text-white';
    case 'not_reported':
      return 'bg-error-500 text-white';
    default:
      return 'bg-blue-light-500 text-white';
  }
}; 

export const unitOptions = [
  { value: "unit", label: "Unit" },
  { value: "pcs", label: "Pcs" },
  { value: "set", label: "Set" },
  { value: "paket", label: "Paket" },
  { value: "buah", label: "Buah" },
  { value: "roll", label: "Roll" },
  { value: "kg", label: "Kg" },
  { value: "hari", label: "Hari" },
  { value: "jam", label: "Jam" },
];