import React from "react";
import "./CurrencySelect.css";
import { currencies } from "./utils/currencies";
import { formatCurrencyLabel } from "./utils/formatters";

interface Props {
  selectId: string;
  currency: string;
  setFieldValue: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CurrencySelect: React.FC<Props> = ({
  currency,
  selectId,
  setFieldValue,
}) => (
  <div className="currency-converter-select">
    <select
      className="currency-converter-select"
      id={selectId}
      onChange={setFieldValue}
      value={currency}
    >
      {Object.keys(currencies).map((symbol) => (
        <option value={symbol}>{`${symbol} - ${formatCurrencyLabel(
          currencies[symbol]
        )}`}</option>
      ))}
    </select>
  </div>
);
