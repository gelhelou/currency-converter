import React from "react";
import "./ConversionResult.css";
import { currencies } from "./utils/currencies";

interface Props {
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
    {`${amount} ${currencies[from]} = ${result} ${currencies[to]}`}{" "}
  </div>
);
