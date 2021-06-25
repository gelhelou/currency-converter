import React from "react";
import { DatePicker } from "react-rainbow-components";
import "../styles/CurrencyConverter.css";
import { formatDate } from "../utils/formatters";
import { AmountInput } from "./AmountInput";
import { ConversionResult } from "./ConversionResult";
import { ConvertButton } from "./ConvertButton";
import { CurrencySelect } from "./CurrencySelect";
import { getExchangeRatesForCurrency } from "../utils/api";
import { currencies } from "../utils/currencies";
import swapIcon from "../icons/swap-icon.png";

export const MAX_CONVERSIONS = 5;

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
  conversions: Conversion[];
  date: Date;
}

export type CombinedEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement
> & { position?: number };

class CurrencyConverter extends React.Component<{}, State> {
  state: State = {
    amount: 1,
    currencyFrom: "EUR",
    currenciesTo: ["USD"],
    conversions: [],
    date: new Date(),
  };

  setFieldValue = (event: CombinedEvent): void => {
    const {
      target: { id, value },
      position = -1,
    } = event;
    switch (id) {
      case "amount":
        this.setState({ amount: Number(value) });
        break;
      case "currencyFrom":
        this.setState({ currencyFrom: value });
        break;
      case "currenciesTo":
        const { currenciesTo } = this.state;
        currenciesTo[position] = value;
        this.setState({ currenciesTo });
        break;
    }
    this.reset();
  };

  setDate = (date: Date): void => {
    this.setState({ date });
    this.reset();
  };

  reset = (): void => {
    this.setState({ conversions: [] });
  };

  calculate = (rate: number, amount: number) => amount * rate;

  convert = async (): Promise<void> => {
    const { amount, currencyFrom, currenciesTo, date } = this.state;
    const targetDate = date?.toISOString().substring(0, 10);
    getExchangeRatesForCurrency(currencyFrom, currenciesTo, targetDate)
      .then((data) => {
        const conversions = Object.keys(data.rates).map((symbol) => ({
          from: currencyFrom,
          amount,
          to: symbol,
          result: this.calculate(data.rates[symbol], amount),
        }));
        this.setState({ conversions });
      })
      .catch((error) => {
        console.warn(`Unable to fetch data due to ${error}`);
      });
  };

  addConversion = (): void => {
    const { currenciesTo } = this.state;
    currenciesTo.push(Object.keys(currencies)[0]);
    this.setState({ currenciesTo });
  };

  removeConversion = (position: number): void => {
    const { currenciesTo } = this.state;
    currenciesTo.splice(position, 1);
    this.setState({ currenciesTo });
  };

  swap = (): void => {
    let { currencyFrom, currenciesTo } = this.state;
    const temp = currenciesTo[0];
    currenciesTo[0] = currencyFrom;
    currencyFrom = temp;
    this.setState({ currencyFrom, currenciesTo });
  };

  render() {
    return (
      <div className="currency-converter">
        <div className="currency-converter-date-picker-wrapper">
          <DatePicker
            onChange={this.setDate}
            value={formatDate(this.state.date)}
            formatStyle="large"
            label={<label>Conversion Day</label>}
            labelAlignment="left"
            maxDate={formatDate(new Date())}
            minDate={formatDate(new Date("1999-01-01"))}
          />
        </div>
        <div className="currency-converter-body">
          <div className="currency-converter-source">
            <AmountInput
              amount={this.state.amount}
              setFieldValue={this.setFieldValue}
              label="amount"
            />
            <CurrencySelect
              position={-1}
              selectId={"currencyFrom"}
              currency={this.state.currencyFrom}
              setFieldValue={this.setFieldValue}
              label="from"
            />
            <img
              src={swapIcon}
              className="currency-converter-swap-icon"
              onClick={this.swap}
              alt="swap-icon"
            />
          </div>
          <div className="currency-converter-target">
            {this.state.currenciesTo.map((currency, i) => (
              <div
                key={i}
                className={
                  i === 0
                    ? "currency-converter-target-main"
                    : "currency-converter-target-other"
                }
              >
                <CurrencySelect
                  position={i}
                  selectId={"currenciesTo"}
                  currency={currency}
                  setFieldValue={this.setFieldValue}
                  label={i === 0 ? "to" : ""}
                />
                <button
                  className={
                    i === 0
                      ? "currency-converter-add-button"
                      : "currency-converter-remove-button"
                  }
                  onClick={() =>
                    i === 0 ? this.addConversion() : this.removeConversion(i)
                  }
                  disabled={
                    i === 0
                      ? this.state.currenciesTo.length >= MAX_CONVERSIONS
                      : false
                  }
                >
                  {i === 0 ? "Add" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="currency-converter-action">
          <ConvertButton convert={this.convert} />
        </div>
        <div className="currency-converter-result">
          {this.state.conversions.map((c, i) => (
            <ConversionResult key={i} {...c} position={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
