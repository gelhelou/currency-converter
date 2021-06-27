import axios from "axios"

const API_BASE = "https://api.exchangeratesapi.io/v1"
const EXCHANGE_RATES_API_KEY = "79e638ff69c2ccf75b93fe6964a41271"

interface ExchangeRatesSuccessResponse {
  success: boolean
  rates: Record<string, number>
}

export const getExchangeRatesForCurrency = async (
  fromCurrency: string,
  toCurrencies: string[],
  date: string = "latest"
): Promise<ExchangeRatesSuccessResponse> => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/${date}?access_key=${EXCHANGE_RATES_API_KEY}&base=${fromCurrency}&symbols=${toCurrencies.join(
        ","
      )}`
    )
    return Promise.resolve(data)
  } catch (e) {
    return Promise.reject(e)
  }
}
