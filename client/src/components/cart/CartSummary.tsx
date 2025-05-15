import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
// Define types locally until schema is properly connected
interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  inStock?: boolean;
}

interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  customizations?: Record<string, any>;
}
import { useCurrency } from '@/context/CurrencyContext';

interface CartSummaryProps {
  items: (CartItem & { product?: Product })[];
}

export default function CartSummary({ items }: CartSummaryProps) {
  const { formatPrice } = useCurrency();
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxRate, setTaxRate] = useState(0.08); // 8% tax rate
  const [calculating, setCalculating] = useState(true);

  useEffect(() => {
    // Simulate calculation delay
    setCalculating(true);
    const timer = setTimeout(() => {
      calculateTotals();
      setCalculating(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [items]);

  const calculateTotals = () => {
    // Calculate subtotal
    const newSubtotal = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    setSubtotal(newSubtotal);
    
    // Determine shipping cost - free over $75, otherwise $8.99
    setShippingCost(newSubtotal >= 75 ? 0 : 8.99);
  };

  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        {calculating ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600 dark:text-green-500">Free</span>
                ) : (
                  <span>{formatPrice(shippingCost)}</span>
                )}
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              {shippingCost > 0 && (
                <div className="text-sm text-muted-foreground bg-muted/60 p-2 rounded-md">
                  Add <strong>{formatPrice(75 - subtotal)}</strong> more to qualify for free shipping
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              * Shipping times may vary based on your location. Standard delivery is usually 5-7 business days.
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0 bg-muted/20">
        <div className="w-full flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Payment Methods</span>
            <div className="flex space-x-1">
              {/* Payment Icons */}
              <div className="w-8 h-5 bg-[#1434CB] rounded"></div>
              <div className="w-8 h-5 bg-[#FF5F00] rounded"></div>
              <div className="w-8 h-5 bg-[#6772E5] rounded"></div>
              <div className="w-8 h-5 bg-[#2790C3] rounded"></div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}