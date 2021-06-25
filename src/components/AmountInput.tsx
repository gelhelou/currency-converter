import React from "react";
import "../styles/AmountInput.css";
import { capitalize } from "../utils/formatters";
import { CombinedEvent } from "./CurrencyConverter";

export interface Props {
  amount?: number;
  setFieldValue: (event: CombinedEvent) => void;
  label: string;
}

export const AmountInput: React.FC<Props> = ({
  amount,
  setFieldValue,
  label,
}) => (
  <div className="currency-converter-amount-form">
    <label htmlFor="amount">{capitalize(label)}</label>
    <input
      test-id="currency-converter-amount-input"
      className="currency-converter-amount-input"
      id="amount"
      value={amount}
      onChange={setFieldValue}
    />
  </div>
);
