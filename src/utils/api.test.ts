import axios from "axios"
import { mocked } from "ts-jest/utils"
import { getExchangeRatesForCurrency } from "./api"

jest.mock("axios")
const mockedAxios = mocked(axios, true)
const mockResponse = { success: true, rates: { USD: 1.23396 } }

describe("api", () => {
  describe("getExchangeRatesForCurrency - success", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockResponse,
      })
    })
    it("should return result when call is successful", () => {
      expect(getExchangeRatesForCurrency("EUR", ["USD"])).resolves.toEqual(
        mockResponse
      )
    })
  })

  describe("getExchangeRatesForCurrency - error", () => {
    beforeEach(() => {
      mockedAxios.get.mockImplementationOnce(() => {
        throw new Error("unable to fetch")
      })
    })
    it("should return error when call is not successful", () => {
      expect(getExchangeRatesForCurrency("EUR", ["USD"])).rejects.toEqual(
        new Error("unable to fetch")
      )
    })
  })
})
