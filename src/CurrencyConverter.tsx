import React from "react";
import "./CurrencyConverter.css";
import { AmountInput } from "./AmountInput";
import { ConversionResult } from "./ConversionResult";
import { ConvertButton } from "./ConvertButton";
import { CurrencySelect } from "./CurrencySelect";
import { getExchangeRatesForCurrency } from "./utils/api";

interface Conversion {
  from: string;
  amount: number;
  to: string;
  result: number;
}

interface State {
  amount: number;
  currencyFrom: string;
  currencyTo: string;
  conversion: Conversion[];
  otherConversions: number;
}

class CurrencyConverter extends React.Component<{}, State> {
  state: State = {
    amount: 1,
    currencyFrom: "EUR",
    currencyTo: "USD",
    conversion: [],
    otherConversions: 1,
  };

  setFieldValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const {
      target: { id, value },
    } = event;
    this.setState({
      ...this.state,
      [id]: value && (id === "amount" ? Number(value) : value),
    });
    this.reset();
  };

  reset = (): void => {
    this.setState({ conversion: [] });
  };

  calculate = (rate: number, amount?: number) => (amount ? amount : 0) * rate;

  convert = async (): Promise<void> => {
    const { amount, currencyFrom, currencyTo } = this.state;
    getExchangeRatesForCurrency(currencyFrom, [currencyTo])
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
    const { otherConversions } = this.state;
    const newNumber = otherConversions >= 2 ? 2 : otherConversions + 1;
    this.setState({ otherConversions: newNumber });
  };

  removeConversion = (): void => {
    const { otherConversions } = this.state;
    const newNumber = otherConversions < 1 ? 0 : otherConversions - 1;
    this.setState({ otherConversions: newNumber });
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
              selectId={"currencyFrom"}
              currency={this.state.currencyFrom}
              setFieldValue={this.setFieldValue}
            />
            <CurrencySelect
              selectId={"currencyTo"}
              currency={this.state.currencyTo}
              setFieldValue={this.setFieldValue}
            />
            <button
              className="currency-converter-button"
              onClick={this.addConversion}
              disabled={this.state.otherConversions >= 2}
            >
              Add
            </button>
          </div>
          <div className="currency-converter-other-conversions">
            {[...Array(this.state.otherConversions)].map((_) => (
              <div className="currency-converter-other-conversion-to">
                <CurrencySelect
                  selectId={"currencyTo"}
                  currency={this.state.currencyTo}
                  setFieldValue={this.setFieldValue}
                />
                <button
                  className="currency-converter-button"
                  onClick={this.removeConversion}
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
