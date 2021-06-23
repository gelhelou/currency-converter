import React from "react";
import "./CurrencyConverter.css";
import { AmountInput } from "./AmountInput";
import { ConversionResult } from "./ConversionResult";
import { ConvertButton } from "./ConvertButton";
import { CurrencySelect } from "./CurrencySelect";
import { getExchangeRatesForCurrency } from "./utils/api";
import { currencies } from "./utils/currencies";

const MAX_CONVERSIONS = 5;

interface Conversion {
  from: string;
  amount: number;
  to: string;
  result: number;
}

interface State {
  amount: number;
  currencyFrom: string;
  currenciesTo: string[];
  conversion: Conversion[];
}

class CurrencyConverter extends React.Component<{}, State> {
  state: State = {
    amount: 1,
    currencyFrom: "EUR",
    currenciesTo: ["USD"],
    conversion: [],
  };

  setFieldValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    position?: number
  ): void => {
    const {
      target: { id, value },
    } = event;
    if (id === "amount") {
      this.setState({ amount: Number(value) });
    } else if (id === "currencyFrom") {
      this.setState({ currencyFrom: value });
    } else if (id === "currenciesTo") {
      if (position) {
        const { currenciesTo } = this.state;
        currenciesTo[position] = value;
        this.setState({ currenciesTo });
      }
    }
    this.reset();
  };

  reset = (): void => {
    this.setState({ conversion: [] });
  };

  calculate = (rate: number, amount?: number) => (amount ? amount : 0) * rate;

  convert = async (): Promise<void> => {
    const { amount, currencyFrom, currenciesTo } = this.state;
    getExchangeRatesForCurrency(currencyFrom, currenciesTo)
      .then((data) => {
        if (data.success) {
          const conversion = Object.keys(data.rates).map((symbol) => ({
            from: currencyFrom,
            amount,
            to: symbol,
            result: this.calculate(data.rates[symbol], amount),
          }));
          this.setState({ conversion });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  addConversion = (): void => {
    const { currenciesTo } = this.state;
    if (currenciesTo.length >= MAX_CONVERSIONS) {
      return;
    }
    currenciesTo.push(Object.keys(currencies)[0]);
    this.setState({ currenciesTo });
  };

  removeConversion = (position: number): void => {
    const { currenciesTo } = this.state;
    currenciesTo.splice(position, 1);
    this.setState({ currenciesTo });
  };

  render() {
    return (
      <div className="currency-converter">
        <div className="conversion-converter-block">
          <div className="currency-converter-upper">
            <AmountInput
              amount={this.state.amount}
              setFieldValue={this.setFieldValue}
            />
            <CurrencySelect
              position={-1}
              selectId={"currencyFrom"}
              currency={this.state.currencyFrom}
              setFieldValue={this.setFieldValue}
            />
            <CurrencySelect
              position={0}
              selectId={"currenciesTo"}
              currency={this.state.currenciesTo[0]}
              setFieldValue={this.setFieldValue}
            />
            <button
              className="currency-converter-button"
              onClick={this.addConversion}
              disabled={this.state.currenciesTo.length >= MAX_CONVERSIONS}
            >
              Add
            </button>
          </div>
          <div className="currency-converter-other-conversions">
            {this.state.currenciesTo.slice(1).map((currency, i) => (
              <div key={i} className="currency-converter-other-conversion-to">
                <CurrencySelect
                  position={i + 1}
                  selectId={"currenciesTo"}
                  currency={currency}
                  setFieldValue={this.setFieldValue}
                />
                <button
                  className="currency-converter-button"
                  onClick={() => this.removeConversion(i + 1)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="currency-converter-action">
          <ConvertButton convert={this.convert} />
        </div>
        <div className="currency-converter-result">
          {this.state.conversion.map((c, i) => (
            <ConversionResult key={i} {...c} />
          ))}
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
