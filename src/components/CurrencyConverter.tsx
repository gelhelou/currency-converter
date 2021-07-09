import React, { useEffect, useReducer } from 'react'
import useAxios from 'axios-hooks'
import { DatePicker } from "react-rainbow-components"
import { ClipLoader } from "react-spinners"

import { AmountInput } from "./AmountInput"
import { ConversionResult } from "./ConversionResult"
import { ConvertButton } from "./ConvertButton"
import { CurrencySelect } from "./CurrencySelect"

import swapIcon from "../images/swap-icon.png"
import { currencies } from "../utils/currencies"
import { formatDate } from "../utils/formatters"

const API_BASE = "https://api.exchangeratesapi.io/v1"
const EXCHANGE_RATES_API_KEY = "79e638ff69c2ccf75b93fe6964a41271"

export const MAX_CONVERSIONS = 5

export type CombinedEvent = React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
    > & { position?: number }

interface Conversion {
    from: string
    amount: number
    to: string
    result: number
}

const initialState = {
    amount: 1,
    currencyFrom: 'EUR',
    currenciesTo: ['USD'],
    conversions: [],
    date: new Date(),
    rates: null,
    lastFetchAt: 0
}

type reducerAction =
  | { type: 'amount', payload: number }
  | { type: 'currencyFrom', payload: string }
  | { type: 'currenciesTo', payload: string[] }
  | { type: 'conversions', payload: Conversion[] }
  | { type: 'date', payload: Date }
  | { type: 'rates', payload: Record<string, number> | null } | { type: 'lastFetchAt', payload: number }

type reducerState = {
    amount: number
    currencyFrom: string
    currenciesTo: string[]
    conversions: Conversion[]
    date: Date
    rates: Record<string, number> | null
    lastFetchAt: number
}

const reducer = (state: reducerState, action: reducerAction): reducerState => {
    switch (action.type) {
        case 'amount':
            return { ...state, amount: action.payload }
        case 'currencyFrom':
            return { ...state, currencyFrom: action.payload }
        case 'currenciesTo':
            return { ...state, currenciesTo: action.payload }
        case 'conversions':
            return { ...state, conversions: action.payload }
        case 'date':
            return { ...state, date: action.payload }
        case 'rates':
            return { ...state, rates: action.payload }
        case 'lastFetchAt':
            return { ...state, lastFetchAt: action.payload }
        default:
            return state
    }
}

const FETCH_WINDOW = 0.005 // number of hours

const CurrencyConverter = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { amount, currencyFrom, currenciesTo, conversions, date, rates, lastFetchAt } = state

    const [{ data, loading, error }, fetch] = useAxios(
        `${API_BASE}/${date?.toISOString().substring(0, 10) ?? 'latest'}?access_key=${EXCHANGE_RATES_API_KEY}&base=${currencyFrom}&symbols=${currenciesTo.join(
            ","
        )}`,
        {
            manual: true
        }
    )

    useEffect(() => {
        const shouldUseData = rates ? Object.keys(data.rates).length > Object.keys(rates).length : true

        if (rates && !shouldUseData) {
            dispatch({ type: 'conversions', payload: generateConversions(rates) })
            dispatch({ type: 'rates', payload: rates })
        } else if (data) {
            dispatch({ type: 'conversions', payload: generateConversions(data.rates) })
            dispatch({ type: 'rates', payload: data.rates })
        }
    }, [data, rates])

    const calculate = (rate: number, amount: number) => amount * rate

    if (error) {
        return <p>Error!</p>
    }

    const generateConversions = (rates: Record<string, number>) => Object.keys(rates).map((symbol) => ({
        from: currencyFrom,
        amount,
        to: symbol,
        result: calculate(rates[symbol], amount),
    }))

    const reset = () => {
        dispatch({ type: 'conversions', payload: [] })
    }

    const swap = (): void => {
        const temp = currenciesTo[0]
        currenciesTo[0] = currencyFrom
        dispatch({ type: 'currenciesTo', payload: currenciesTo })
        dispatch({ type: 'currencyFrom', payload: temp })

        if (rates) {
            const updatedRates: Record<string, number> = {}
            const currencyToWithRespectToFrom = 1 / rates[temp]
            updatedRates[currencyFrom] = currencyToWithRespectToFrom
            Object.keys(rates).filter(r => r !== temp).forEach(r => {
                updatedRates[r] = rates[r] * currencyToWithRespectToFrom
            })
            dispatch({ type: 'rates', payload: updatedRates })
        }
    }

    const setFieldValue = (event: CombinedEvent): void => {
        const {
            target: { id, value },
            position = -1,
        } = event
        switch (id) {
            case "amount":
                dispatch({ type: 'amount', payload: value.match(/^[0-9]+$/) || value === ""
                      ? Number(value)
                      : amount})
                break
            case "currencyFrom":
                dispatch({ type: 'currencyFrom', payload: value })
                break
            case "currenciesTo":
                currenciesTo[position] = value
                dispatch({ type: 'currenciesTo', payload: currenciesTo })
                break
        }
        reset()
    }

    const addConversion = (): void => {
        const newCurrenciesTo = [...currenciesTo, Object.keys(currencies)[0]]
        dispatch({ type: 'currenciesTo', payload: newCurrenciesTo })
        dispatch({ type: 'lastFetchAt', payload: 0 })
    }

    const removeConversion = (position: number): void => {
        const newCurrenciesTo = currenciesTo.filter((c, i) => i !== position)
        dispatch({ type: 'currenciesTo', payload: newCurrenciesTo })
    }

    const convert = () => {
        if (!rates || Date.now() - lastFetchAt > FETCH_WINDOW * 3600 * 1000) {
            fetch()
            dispatch({ type: 'lastFetchAt', payload: Date.now() })
        } else {
            dispatch({ type: 'conversions', payload: generateConversions(rates) })
        }
    }

    return (
        <div className="currency-converter">
            <div className="currency-converter-date-picker-wrapper">
                <DatePicker
                    onChange={(date) => dispatch({ type: 'date', payload: date })}
                    value={formatDate(date)}
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
                        amount={amount}
                        setFieldValue={setFieldValue}
                        label="amount"
                    />
                    <CurrencySelect
                        position={-1}
                        selectId={"currencyFrom"}
                        currency={currencyFrom}
                        setFieldValue={setFieldValue}
                        label="from"
                    />
                    <div className="currency-converter-swap">
                        <img
                            src={swapIcon}
                            className="currency-converter-swap-icon"
                            onClick={swap}
                            alt="swap-icon"
                        />
                    </div>
                </div>
                <div className="currency-converter-target">
                    {currenciesTo.map((currency, i) => (
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
                                setFieldValue={setFieldValue}
                                label={i === 0 ? "to" : ""}
                            />
                            <button
                                className={
                                    i === 0
                                        ? "currency-converter-add-button"
                                        : "currency-converter-remove-button"
                                }
                                onClick={() =>
                                    i === 0 ? addConversion() : removeConversion(i)
                                }
                                disabled={
                                    i === 0
                                        ? currenciesTo.length >= MAX_CONVERSIONS
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
                <ConvertButton convert={convert} />
                {loading && <ClipLoader color="blueviolet" size={25} />}
            </div>
            <div className="currency-converter-result">
                {conversions.map((c, i) => (
                    <ConversionResult key={i} {...c} position={i} />
                ))}
            </div>
        </div>
    )
}

export default CurrencyConverter