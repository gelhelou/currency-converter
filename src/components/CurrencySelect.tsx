import React from "react"
import "../styles/CurrencySelect.scss"
import { currencies } from "../utils/currencies"
import { capitalize, formatCurrencyLabel } from "../utils/formatters"
import { CombinedEvent } from "./CurrencyConverter"

export interface Props {
  selectId: string
  currency: string
  position: number
  setFieldValue: (event: CombinedEvent) => void
  label?: string
}

export const CurrencySelect: React.FC<Props> = ({
  currency,
  selectId,
  setFieldValue,
  position,
  label,
}) => (
  <div className="currency-converter-dropdown-form">
    {label && <label htmlFor={label}>{capitalize(label)}</label>}
    <select
      className="currency-converter-dropdown-form-select"
      id={selectId}
      onChange={(e) => setFieldValue({ ...e, position })}
      value={currency}
      data-testid={`currency-converter-dropdown-form-select-${selectId}`}
    >
      {Object.keys(currencies).map((symbol, i) => (
        <option key={i} value={symbol}>{`${symbol} - ${formatCurrencyLabel(
          currencies[symbol]
        )}`}</option>
      ))}
    </select>
  </div>
)
