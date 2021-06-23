import React from "react";
import "./ConvertButton.css";

interface Props {
  convert: () => void;
}

export const ConvertButton: React.FC<Props> = ({ convert }) => (
  <button className="currency-converter-convert-button" onClick={convert}>
    Convert
  </button>
);
