import React from "react";
import "../styles/CurrencySelect.css";
import { currencies } from "../utils/currencies";
import { capitalize, formatCurrencyLabel } from "../utils/formatters";

interface Props {
  selectId: string;
  currency: string;
  position: number;
  setFieldValue: (
    event: React.ChangeEvent<HTMLSelectElement>,
    position?: number
  ) => void;
  label?: string;
}

export const CurrencySelect: React.FC<Props> = ({
  currency,
  selectId,
  setFieldValue,
  position,
  label,
}) => (
  <div className="currency-converter-select-form">
    {label && <label htmlFor={label}>{capitalize(label)}</label>}
    <select
      className="currency-converter-select"
      id={selectId}
      onChange={(e) => setFieldValue(e, position)}
      value={currency}
    >
      {Object.keys(currencies).map((symbol, i) => (
        <option key={i} value={symbol}>{`${symbol} - ${formatCurrencyLabel(
          currencies[symbol]
        )}`}</option>
      ))}
    </select>
  </div>
);