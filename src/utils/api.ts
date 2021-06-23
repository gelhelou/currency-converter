import { EXCHANGE_RATES_API_KEY } from "./keys";

const API_BASE = "http://api.exchangeratesapi.io/v1/latest";

interface ExchangeRatesSuccessResponse {
  success: boolean;
  rates: Record<string, number>;
}

interface ExchangeRatesErrorResponse {
  code: string;
  message: string;
}

export const getExchangeRatesForCurrency = (
  fromCurrency: string,
  toCurrencies: string[]
): Promise<ExchangeRatesSuccessResponse> => {
  return fetch(
    `${API_BASE}?access_key=${EXCHANGE_RATES_API_KEY}&base=${fromCurrency}&symbols=${toCurrencies.join(
      ","
    )}`
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((e) => {
      return e;
    });
};
