import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    KES: 150, // Approximate rate
    EUR: 0.85,
    GBP: 0.75
  });

  const convertPrice = (price) => {
    const rate = exchangeRates[currency];
    return price * rate;
  };

  const formatPrice = (price) => {
    const converted = convertPrice(price);
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return formatter.format(converted);
  };

  const getCurrencySymbol = () => {
    return {
      USD: '$',
      KES: 'KSh',
      EUR: '€',
      GBP: '£'
    }[currency];
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      getCurrencySymbol,
      exchangeRates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};