import React from "react"
import "../styles/ConversionResult.scss"
import { currencies } from "../utils/currencies"
import { formatMoney } from "../utils/formatters"

export interface Props {
  position?: number
  from: string
  amount: number
  to: string
  result: number
}

export const ConversionResult: React.FC<Props> = ({
  position = 0,
  from,
  amount,
  to,
  result,
}) => (
  <div
    className="currency-converter-conversion-result"
    test-id="currency-converter-conversion-result"
    style={{ color: position % 2 === 0 ? "blueviolet" : "white" }}
  >
    {`${formatMoney(amount)} ${currencies[from]} = ${formatMoney(result, 2)} ${
      currencies[to]
    }`}
  </div>
)
