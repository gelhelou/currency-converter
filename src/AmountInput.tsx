import React from "react";
import "./AmountInput.css";

interface Props {
  amount?: number;
  setFieldValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AmountInput: React.FC<Props> = ({ amount, setFieldValue }) => (
  <input
    className="currency-converter-amount-input"
    type="number"
    id="amount"
    value={amount}
    onChange={setFieldValue}
  />
);
