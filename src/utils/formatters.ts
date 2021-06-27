export const formatMoney = (
  amount: number,
  fractionDigits: number = 2
): string => {
  return String(amount.toFixed(fractionDigits)).replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    "$1,"
  )
}

export const formatCurrencyLabel = (label: string): string =>
  label.length > 20 ? `${label.substring(0, 20)}...` : label

export const capitalize = (input?: string) =>
  input ? input.charAt(0).toUpperCase() + input.slice(1) : ""

export const formatDate = (date: Date) =>
  new Date(date.toLocaleDateString().substring(0, 10))
