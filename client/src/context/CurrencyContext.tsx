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
  isLoadingRates: boolean;
  lastUpdated?: number;
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

// Default fallback exchange rates if API not available
const fallbackRates: Record<Currency, number> = {
  USD: 1.0,
  INR: 83.36,
  EUR: 0.93,
  GBP: 0.80,
  JPY: 154.41,
  AUD: 1.52,
  CAD: 1.37
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number | undefined>(undefined);

  // Load saved currency
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && Object.keys(currencySymbols).includes(savedCurrency)) {
      setCurrency(savedCurrency as Currency);
    }
  }, []);

  // Persist currency
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
  }, [currency]);

  const fetchRates = useCallback(async () => {
    try {
      setIsLoadingRates(true);
      const res = await fetch('/api/exchange-rates');
      if (!res.ok) throw new Error('Failed to fetch exchange rates');
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        setLastUpdated(data.timestamp ? data.timestamp * 1000 : Date.now());
      }
    } catch (err) {
      // Keep fallback rates on error
      console.error('Exchange rates fetch failed, using fallback rates');
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  // Fetch on mount and every 1 hour
  useEffect(() => {
    fetchRates();
    const id = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchRates]);

  const exchangeRate = (rates[currency] as number) || 1;
  const currencySymbol = currencySymbols[currency];

  const convertPrice = useCallback((price: number): number => {
    return price * exchangeRate;
  }, [exchangeRate]);

  const formatPrice = useCallback((price: number) => {
    const value = price * exchangeRate;
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
    } catch {
      // Fallback if Intl doesn't support the exact currency code
      return `${currencySymbol}${value.toFixed(2)}`;
    }
  }, [currency, currencySymbol, exchangeRate]);

  const availableCurrencies = Object.keys(currencySymbols).map((code) => ({
    code: code as Currency,
    symbol: currencySymbols[code as Currency],
    name: currencyNames[code as Currency]
  }));

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    formatPrice,
    convertPrice,
    exchangeRate,
    currencySymbol,
    availableCurrencies,
    isLoadingRates,
    lastUpdated,
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