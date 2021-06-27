import React from "react"
import { fireEvent, render } from "@testing-library/react"

import { AmountInput, Props } from "./AmountInput"

const setFieldValueMock = jest.fn()

describe("AmountInput", () => {
  const defaultProps: Props = {
    amount: 100,
    setFieldValue: setFieldValueMock,
    label: "from",
  }
  const element = () => <AmountInput {...defaultProps} />
  it("should render a label and an input", () => {
    const { getByText, getByLabelText, getByDisplayValue } = render(element())

    expect(getByText("From")).toBeInTheDocument()
    expect(getByDisplayValue("100")).toBeInTheDocument()

    const input = getByLabelText("From")
    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { value: 200 } })
    expect(setFieldValueMock).toHaveBeenCalled()
  })
})
