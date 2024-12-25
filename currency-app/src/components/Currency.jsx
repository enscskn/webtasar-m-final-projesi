import React, {useEffect, useState} from 'react'
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import axios from 'axios'

import '../css/Currency.css'

let BASE_URL = 'https://api.freecurrencyapi.com/v1/latest'
let API_KEY = "fca_live_xPKsJmFnOTPaik6depl00kRp8v1c8izNTxWT3tWh" // You can get your free API key from https://freecurrencyapi.com/

function Currency() {

    const[amount, setAmount] = useState(0)
    const[fromCurrency, setFromCurrency] = useState('USD')
    const[toCurrency, setToCurrency] = useState('TRY')
    const[result, setResult] = useState(0)
    const[currentRates, setCurrentRates] = useState({
        USD: 0,
        EUR: 0,
        TRY: 0
    })
    const [conversionHistory, setConversionHistory] = useState([]);

    useEffect(() => {
        const getRates = async () => {
            try {
                const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=TRY`);
                setCurrentRates({
                    USD: (1 / response.data.data.USD).toFixed(2),
                    EUR: (1 / response.data.data.EUR).toFixed(2)
                });
            } catch (error) {
                console.error('Döviz kurları alınamadı:', error);
            }
        };
        
        getRates();
    }, []);

    const exchange = async () => {
        const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=${fromCurrency}`);
        const data = response.data.data[toCurrency];
        const convertedAmount = (amount * data).toFixed(2);
        setResult(convertedAmount);
        
        const newTransaction = {
            id: Date.now(),
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            result: convertedAmount,
            date: new Date().toLocaleString()
        };
        
        setConversionHistory(prev => [newTransaction, ...prev]);
    };

    return (
        <div className='currency-div'>
            <div className='text'>
                <h3>Döviz Kuru Uygulaması</h3>
            </div>
            <div className='from-to-currency'>
            <input 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            type="number" 
            className='amount'/>
            <select 
            onChange={(e) => setFromCurrency(e.target.value)}
            className='from-currency-option'>
                <option>USD</option>
                <option>EUR</option>
                <option>TRY</option>
            </select>

            <FaRegArrowAltCircleRight className='arrow'/>

            <select 
            onChange={(e) => setToCurrency(e.target.value)}
            className='to-currency-option'>
                <option>TRY</option>
                <option>EUR</option>
                <option>USD</option>
            </select>

            <input
            value={result}
            onChange={(e) => setResult(e.target.value)}
            type="number" className='result'/>
            </div>
            
            <div className='button-div'>
                <button 
                onClick={exchange}
                className='button'>Çevir</button>
            </div>
            <div className='footer'>
                <p>Güncel Döviz Kurları: 1 USD = {currentRates.USD} TRY | 1 EUR = {currentRates.EUR} TRY</p>
            </div>
            <div className='log-container'>
                <h4 className='log-text'>Geçmiş İşlemler</h4>
                <div style={{overflowY: 'auto', maxHeight: '150px'}}>
                    {conversionHistory.map(item => (
                        <div key={item.id} style={{
                            borderBottom: '1px solid #ccc',
                            padding: '5px',
                            fontSize: '14px'
                        }}>
                            {item.date}: {item.amount} {item.from} = {item.result} {item.to}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Currency