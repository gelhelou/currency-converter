import React from "react"
import axios from "axios"

import { render, fireEvent } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import { currencies } from "../utils/currencies"
import { formatCurrencyLabel } from "../utils/formatters"
import { ConversionResult } from "./ConversionResult"
import CurrencyConverter from "./CurrencyConverter"

// Suppress logs
console.warn = jest.fn()

jest.mock("axios")
jest.mock("console")
const mockedAxios = mocked(axios, true)

const mockResponse = { success: true, rates: { USD: 1.23396 } }
const mockMultipleResponse = {
  success: true,
  rates: { EUR: 0.8104, GBP: 0.71481 },
}

jest.mock("./ConversionResult", () => ({
  ConversionResult: jest.fn(() => <div>{"[ConversionResult]"}</div>),
}))
const mockConversionResult = mocked(ConversionResult)

describe("CurrencyConverter", () => {
  const converter = () => <CurrencyConverter />

  describe("Functional", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockedAxios.get.mockResolvedValue({
        data: mockResponse,
      })
    })
    it("should initially render all visual elements correctly", async () => {
      const {
        getByAltText,
        queryByText,
        getByLabelText,
        queryAllByText,
        getByDisplayValue,
      } = render(converter())

      expect(
        getByDisplayValue(
          Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date())
        )
      ).toBeInTheDocument()
      expect(getByLabelText("Amount")).toBeInTheDocument()

      expect(
        queryAllByText(`EUR - ${formatCurrencyLabel(currencies["EUR"])}`)
      ).toHaveLength(2)
      expect(
        queryAllByText(`USD - ${formatCurrencyLabel(currencies["USD"])}`)
      ).toHaveLength(2)
      expect(getByAltText("swap-icon")).toBeInTheDocument()
      expect(queryByText("Add")).toBeInTheDocument()
      expect(queryByText("Convert")).toBeInTheDocument()

      expect(mockConversionResult).not.toHaveBeenCalled()
    })

    it("should calculate and display conversion result on click, and wipe result on change", async () => {
      const { queryByText, getByLabelText } = render(converter())
      const convertButton = queryByText("Convert")
      fireEvent.click(convertButton!)
      await new Promise((r) => setTimeout(r, 3000))
      expect(mockConversionResult).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 1,
          from: "EUR",
          result: mockResponse.rates.USD,
          to: "USD",
        }),
        {}
      )

      fireEvent.change(getByLabelText("Amount"), {
        target: { value: 50 },
      })
      expect(queryByText("[ConversionResult]")).not.toBeInTheDocument()
    })

    it("should add a new currency selector when add button is clicked", () => {
      const { queryByText, getAllByTestId } = render(converter())
      const addButton = queryByText("Add")
      fireEvent.click(addButton!)
      expect(
        getAllByTestId("currency-converter-dropdown-form-select-currenciesTo")
      ).toHaveLength(2)
    })

    it("should remove a currency selector when remove button is clicked", () => {
      const { queryByText, getAllByTestId } = render(converter())
      const addButton = queryByText("Add")
      fireEvent.click(addButton!)
      expect(
        getAllByTestId("currency-converter-dropdown-form-select-currenciesTo")
      ).toHaveLength(2)
      const removeButton = queryByText("Remove")
      fireEvent.click(removeButton!)
      expect(
        getAllByTestId("currency-converter-dropdown-form-select-currenciesTo")
      ).toHaveLength(1)
    })

    it("should swap from and to currency drop down values when swap button is clicked", () => {
      const { getByAltText, getByTestId } = render(converter())
      const swapButton = getByAltText("swap-icon")
      const fromPicker = getByTestId(
        "currency-converter-dropdown-form-select-currencyFrom"
      ) as HTMLSelectElement
      const toPicker = getByTestId(
        "currency-converter-dropdown-form-select-currenciesTo"
      ) as HTMLSelectElement
      expect(fromPicker.value).toEqual("EUR")
      expect(toPicker.value).toEqual("USD")
      fireEvent.click(swapButton)
      expect(fromPicker.value).toEqual("USD")
      expect(toPicker.value).toEqual("EUR")
    })

    it("should properly update the amount when empty input or alphanumeric input is passed", () => {
      const { getByLabelText, getByDisplayValue } = render(converter())
      fireEvent.change(getByLabelText("Amount"), {
        target: { value: "" },
      })
      expect(getByDisplayValue(0)).toBeInTheDocument()

      fireEvent.change(getByLabelText("Amount"), {
        target: { value: 100 },
      })
      fireEvent.change(getByLabelText("Amount"), {
        target: { value: "1a" },
      })
      expect(getByDisplayValue(100)).toBeInTheDocument()
    })
  })

  describe("Integration", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockedAxios.get.mockResolvedValue({
        data: mockMultipleResponse,
      })
    })
    it("should allow multiple conversions at the same time, then wipe result on change", async () => {
      const {
        queryByText,
        getByLabelText,
        getAllByTestId,
        getByTestId,
        getByDisplayValue,
        getByRole,
      } = render(converter())
      const amount = 50
      fireEvent.change(getByLabelText("Amount"), {
        target: { value: amount },
      })
      fireEvent.change(
        getByTestId("currency-converter-dropdown-form-select-currencyFrom"),
        {
          target: { value: "USD" },
        }
      )
      const addButton = queryByText("Add")
      fireEvent.click(addButton!)
      fireEvent.change(
        getAllByTestId(
          "currency-converter-dropdown-form-select-currenciesTo"
        )[0],
        {
          target: { value: "EUR" },
          position: 1,
        }
      )
      fireEvent.change(
        getAllByTestId(
          "currency-converter-dropdown-form-select-currenciesTo"
        )[1],
        {
          target: { value: "GBP" },
          position: 1,
        }
      )
      const convertButton = queryByText("Convert")
      fireEvent.click(convertButton!)
      await new Promise((r) => setTimeout(r, 1000))
      expect(mockConversionResult.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          amount,
          from: "USD",
          result: mockMultipleResponse.rates.EUR * amount,
          to: "EUR",
        })
      )
      expect(mockConversionResult.mock.calls[1][0]).toEqual(
        expect.objectContaining({
          amount,
          from: "USD",
          result: mockMultipleResponse.rates.GBP * amount,
          to: "GBP",
        })
      )
      fireEvent.click(
        getByDisplayValue(
          Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date())
        )
      )
      fireEvent.click(
        getByRole("button", { name: String(new Date().getDate()) })
      )
      expect(queryByText("[ConversionResult]")).not.toBeInTheDocument()
    })
  })

  describe("Error Handling", () => {
    const consoleSpy = jest.spyOn(console, "warn")
    beforeEach(() => {
      mockedAxios.get.mockImplementationOnce(() => {
        throw new Error("service unavailable")
      })
    })

    afterAll(consoleSpy.mockRestore)

    it("should warn that data cannot be fetched", async () => {
      const { getByText } = render(converter())
      const convertButton = getByText("Convert")
      fireEvent.click(convertButton)
      await new Promise((r) => setTimeout(r, 1000))
      expect(consoleSpy).toHaveBeenCalledWith(
        "Unable to fetch data due to Error: service unavailable"
      )
    })
  })
})
