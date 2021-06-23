import { EXCHANGE_RATES_API_KEY } from "./keys";

const API_BASE = "http://api.exchangeratesapi.io/v1";

interface ExchangeRatesSuccessResponse {
  success: boolean;
  rates: Record<string, number>;
}

export const getExchangeRatesForCurrency = (
  fromCurrency: string,
  toCurrencies: string[],
  date: string = "latest"
): Promise<ExchangeRatesSuccessResponse> => {
  return fetch(
    `${API_BASE}/${date}?access_key=${EXCHANGE_RATES_API_KEY}&base=${fromCurrency}&symbols=${toCurrencies.join(
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
