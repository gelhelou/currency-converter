import React from "react";
import "../styles/ConversionResult.css";
import { currencies } from "../utils/currencies";
import { formatMoney } from "../utils/formatters";

export interface Props {
  from: string;
  amount: number;
  to: string;
  result: number;
}

export const ConversionResult: React.FC<Props> = ({
  from,
  amount,
  to,
  result,
}) => (
  <div className="currency-converter-conversion-result">
    {`${formatMoney(amount)} ${currencies[from]} = ${formatMoney(result, 2)} ${
      currencies[to]
    }`}
  </div>
);
