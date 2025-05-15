import { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';

type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
  exchangeRate: number;
  currencySymbol: string;
  availableCurrencies: Array<{code: Currency, symbol: string, name: string}>;
}

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$'
};

const currencyNames: Record<Currency, string> = {
  USD: 'US Dollar',
  INR: 'Indian Rupee',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar'
};

const exchangeRates: Record<Currency, number> = {
  USD: 1.0,
  INR: 83.36, // 1 USD = 83.36 INR
  EUR: 0.93,  // 1 USD = 0.93 EUR
  GBP: 0.80,  // 1 USD = 0.80 GBP
  JPY: 154.41, // 1 USD = 154.41 JPY
  AUD: 1.52, // 1 USD = 1.52 AUD
  CAD: 1.37  // 1 USD = 1.37 CAD
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Default to INR as preferred currency
  const [currency, setCurrency] = useState<Currency>('INR');
  
  // Set default currency from localStorage on initial load
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && Object.keys(currencySymbols).includes(savedCurrency)) {
      setCurrency(savedCurrency as Currency);
    }
  }, []);
  
  // Save currency preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);
  
  const exchangeRate = exchangeRates[currency];
  const currencySymbol = currencySymbols[currency];
  
  // Convert price from USD to selected currency
  const convertPrice = useCallback((price: number): number => {
    return price * exchangeRate;
  }, [exchangeRate]);
  
  // Format price according to currency conventions
  const formatPrice = useCallback((price: number) => {
    const convertedPrice = price * exchangeRate;
    
    // Japanese Yen doesn't use decimal places
    if (currency === 'JPY') {
      return `${currencySymbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    // Indian format uses different thousands separators
    if (currency === 'INR') {
      // Convert to Indian numbering system (lakhs, crores)
      const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
      });
      return formatter.format(convertedPrice);
    }
    
    // Default formatting for other currencies
    return `${currencySymbol}${convertedPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }, [currency, exchangeRate, currencySymbol]);
  
  // Create array of available currencies for dropdown
  const availableCurrencies = Object.keys(currencySymbols).map((code) => ({
    code: code as Currency,
    symbol: currencySymbols[code as Currency],
    name: currencyNames[code as Currency]
  }));
  
  const value = {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    exchangeRate,
    currencySymbol,
    availableCurrencies
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