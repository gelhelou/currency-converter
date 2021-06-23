export const formatAmount = (amount?: number): string => {
  return amount ? amount.toFixed(2) : "";
};

export const formatCurrencyLabel = (label: string): string =>
  label.length > 20 ? `${label.substring(0, 20)}...` : label;
