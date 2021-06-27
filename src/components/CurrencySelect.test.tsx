import React from "react"
import {
  getByLabelText,
  render,
  fireEvent,
  screen,
} from "@testing-library/react"
import { CurrencySelect, Props } from "./CurrencySelect"
import { capitalize } from "../utils/formatters"

const setFieldValueMock = jest.fn()

describe("CurrencySelect", () => {
  const defaultProps: Props = {
    currency: "EUR",
    selectId: "select-id",
    setFieldValue: setFieldValueMock,
    position: 1,
    label: "dummy-label",
  }
  const element = (props?: Partial<Props>) => (
    <CurrencySelect {...defaultProps} {...props} />
  )

  it("should not render a label when a label prop is not passed", () => {
    const { queryByText } = render(element({ label: undefined }))
    expect(queryByText(capitalize(defaultProps.label!))).not.toBeInTheDocument()
  })

  it("should render all options and respond to change", () => {
    const { getByText } = render(element())
    expect(getByText(capitalize(defaultProps.label!))).toBeInTheDocument()

    fireEvent.change(
      screen.getByTestId(
        `currency-converter-dropdown-form-select-${defaultProps.selectId}`
      ),
      {
        target: { value: "USD" },
      }
    )
    expect(setFieldValueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        position: defaultProps.position,
      })
    )
  })
})
