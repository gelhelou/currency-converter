import React from "react";
import "./CurrencyConverter.css";
import { AmountInput } from "./AmountInput";
import { ConversionResult } from "./ConversionResult";
import { ConvertButton } from "./ConvertButton";
import { CurrencySelect } from "./CurrencySelect";
import { getExchangeRatesForCurrency } from "./utils/api";

interface Conversion {
  symbol: string;
  result: number;
}

interface State {
  amount: number;
  currencyFrom: string;
  currencyTo: string;
  conversion: Conversion[];
}

class CurrencyConverter extends React.Component<{}, State> {
  state: State = {
    amount: 1,
    currencyFrom: "EUR",
    currencyTo: "USD",
    conversion: [],
  };

  setFieldValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const {
      target: { id, value },
    } = event;
    this.setState({
      ...this.state,
      [id]: value ? (id === "amount" ? Number(value) : value) : "",
    });
    this.reset();
  };

  reset() {
    this.setState({ conversion: [] });
  }

  calculate = (rate: number, amount?: number) => (amount ? amount : 0) * rate;

  convert = async () => {
    const { amount, currencyFrom, currencyTo } = this.state;
    getExchangeRatesForCurrency(currencyFrom, [currencyTo])
      .then((data) => {
        if (data.success) {
          const conversion = Object.keys(data.rates).map((symbol) => ({
            symbol,
            result: this.calculate(data.rates[symbol], amount),
          }));
          this.setState({ conversion });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    console.log(this.state.conversion);
    return (
      <div className="currency-converter">
        <div className="currency-converter-upper">
          <AmountInput
            amount={this.state.amount}
            setFieldValue={this.setFieldValue}
          />
          <CurrencySelect
            selectId={"currencyFrom"}
            currency={this.state.currencyFrom}
            setFieldValue={this.setFieldValue}
          />
          <CurrencySelect
            selectId={"currencyTo"}
            currency={this.state.currencyTo}
            setFieldValue={this.setFieldValue}
          />
        </div>
        <div className="currency-converter-action">
          <ConvertButton convert={this.convert} />
        </div>
        <div className="currency-converter-result">
          {this.state.conversion.map((c) => (
            <ConversionResult
              from={this.state.currencyFrom}
              amount={this.state.amount}
              to={c.symbol}
              result={c.result}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
