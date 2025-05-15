import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencySelector() {
  const { 
    currency, 
    setCurrency, 
    availableCurrencies 
  } = useCurrency();

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={currency}
        onValueChange={(value) => setCurrency(value as any)}
      >
        <SelectTrigger className="w-[110px] h-9">
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <div className="flex items-center">
                <span className="mr-2">{curr.symbol}</span>
                <span>{curr.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}