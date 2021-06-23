export const formatMoney = (amount?: number): string => {
  return String(amount?.toFixed(2)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const formatCurrencyLabel = (label: string): string =>
  label.length > 20 ? `${label.substring(0, 20)}...` : label;
