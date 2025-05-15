import { useCurrency } from '@/context/CurrencyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  
  const handleCurrencyChange = (currencyCode: string) => {
    setCurrency(currencyCode as 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY');
  };
  
  const currentCurrency = currencies.find(c => c.code === currency);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-muted">
          <span className="font-bold">{currentCurrency?.symbol}</span>
          <span>{currentCurrency?.code}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            className={`flex items-center gap-2 ${currency === c.code ? 'bg-accent' : ''}`}
            onClick={() => handleCurrencyChange(c.code)}
          >
            <span className="font-bold">{c.symbol}</span>
            <span>{c.code}</span>
            <span className="text-muted-foreground ml-1">- {c.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}