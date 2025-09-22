export const formatCurrency = (amount: string | number): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const formatNumber = (amount: string | number): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  
  return new Intl.NumberFormat('id-ID').format(numericAmount);
};

export const parseCurrency = (formattedAmount: string): number => {
  return parseFloat(formattedAmount.replace(/[^\d]/g, '')) || 0;
};

export const formatCurrencyInput = (value: string): string => {
  const numeric = parseCurrency(value);
  if (numeric === 0) return '';
  return formatNumber(numeric);
}; 