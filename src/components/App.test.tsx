import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("./CurrencyConverter", () => jest.fn(() => "[CurrencyConverter]"));

describe("App", () => {
  const { getByText } = render(<App />);
  it("should render a currency converter", () => {
    expect(getByText("[CurrencyConverter]")).toBeInTheDocument();
  });
});
