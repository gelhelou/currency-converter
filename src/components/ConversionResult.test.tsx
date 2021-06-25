import React from "react";
import { render } from "@testing-library/react";
import { ConversionResult, Props } from "./ConversionResult";
import { currencies } from "../utils/currencies";
import { formatMoney } from "../utils/formatters";

describe("ConversionResult", () => {
  const defaultProps: Props = {
    from: "EUR",
    amount: 100,
    to: "USD",
    result: 120,
  };
  const element = () => <ConversionResult {...defaultProps} />;
  it("should render the correct conversion result", () => {
    const { getByText } = render(element());
    expect(
      getByText(
        `${formatMoney(defaultProps.amount)} ${
          currencies[defaultProps.from]
        } = ${formatMoney(defaultProps.result, 2)} ${
          currencies[defaultProps.to]
        }`
      )
    ).toBeInTheDocument();
  });
});
