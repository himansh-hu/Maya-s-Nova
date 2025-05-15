import { createContext, useState, useContext, useCallback, ReactNode } from 'react';

type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  exchangeRate: number;
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

const exchangeRates: Record<Currency, number> = {
  USD: 1.0,
  INR: 83.36, // 1 USD = 83.36 INR
  EUR: 0.93,  // 1 USD = 0.93 EUR
  GBP: 0.80,  // 1 USD = 0.80 GBP
  JPY: 154.41 // 1 USD = 154.41 JPY
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR'); // Default to INR as preferred

  const exchangeRate = exchangeRates[currency];

  const formatPrice = useCallback((price: number) => {
    const convertedPrice = price * exchangeRate;
    
    // Format based on currency
    switch(currency) {
      case 'USD':
        return `${currencySymbols.USD}${convertedPrice.toFixed(2)}`;
      case 'INR':
        return `${currencySymbols.INR}${convertedPrice.toFixed(2)}`;
      case 'EUR':
        return `${currencySymbols.EUR}${convertedPrice.toFixed(2)}`;
      case 'GBP':
        return `${currencySymbols.GBP}${convertedPrice.toFixed(2)}`;
      case 'JPY':
        // JPY doesn't typically use decimal places
        return `${currencySymbols.JPY}${Math.round(convertedPrice)}`;
      default:
        return `${currencySymbols.USD}${convertedPrice.toFixed(2)}`;
    }
  }, [currency, exchangeRate]);
  
  const value = {
    currency,
    setCurrency,
    formatPrice,
    exchangeRate
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}