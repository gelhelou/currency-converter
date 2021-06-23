import React from "react";
import { render, fireEvent, getByText } from "@testing-library/react";
import { ConvertButton, Props } from "./ConvertButton";

const convertMock = jest.fn();

describe("ConvertButton", () => {
  const defaultProps: Props = {
    convert: convertMock,
  };
  const element = () => <ConvertButton {...defaultProps} />;
  it("should render a button and call convert on click", () => {
    const { getByRole, getByText } = render(element());

    expect(getByText("Convert")).toBeInTheDocument();

    const button = getByRole("button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(convertMock).toHaveBeenCalled();
  });
});
