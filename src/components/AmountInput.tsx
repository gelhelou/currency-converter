import React from "react"
import "../styles/AmountInput.scss"
import { capitalize } from "../utils/formatters"
import { CombinedEvent } from "./CurrencyConverter"

export interface Props {
  amount?: number
  setFieldValue: (event: CombinedEvent) => void
  label: string
}

export const AmountInput: React.FC<Props> = ({
  amount,
  setFieldValue,
  label,
}) => (
  <div className="currency-converter-amount-form">
    <label htmlFor="amount">{capitalize(label)}</label>
    <input
      className="currency-converter-amount-form-input"
      id="amount"
      value={amount}
      onChange={setFieldValue}
    />
  </div>
)
