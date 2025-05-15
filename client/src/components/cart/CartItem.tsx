import { useState } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/context/CartContext';
// Import types until shared schema is properly connected
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

interface CartItemType {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  customizations?: Record<string, any>;
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Trash, 
  MinusCircle, 
  PlusCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface CartItemProps {
  item: CartItemType & { product?: Product };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // If product is missing
  if (!item.product) {
    return (
      <Card className="p-4 border">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Product not available</p>
        </div>
      </Card>
    );
  }

  // Handle quantity change with debounce
  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    
    setQuantity(value);
    
    setIsUpdating(true);
    updateItem(item.id, value).finally(() => {
      setIsUpdating(false);
    });
  };

  // Handle item removal
  const handleRemove = () => {
    setIsRemoving(true);
    removeItem(item.id).finally(() => {
      setIsRemoving(false);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0">
      {/* Product Image */}
      <div className="sm:w-24 h-24 bg-muted rounded-md overflow-hidden">
        <Link href={`/products/${item.product.slug}`}>
          {item.product.imageUrl ? (
            <img 
              src={item.product.imageUrl} 
              alt={item.product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-1">
        <div className="flex justify-between flex-wrap mb-1">
          <Link href={`/products/${item.product.slug}`}>
            <h3 className="font-medium text-lg hover:underline">
              {item.product.name}
            </h3>
          </Link>
          <div className="font-semibold">
            {formatPrice(item.product.price * quantity)}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {item.product.description?.substring(0, 120)}
          {item.product.description && item.product.description.length > 120 ? '...' : ''}
        </p>
        
        {/* Display customization details if any */}
        {item.customizations && Object.keys(item.customizations).length > 0 && (
          <div className="bg-muted/50 rounded-md p-2 mb-3">
            <p className="text-xs font-medium mb-1">Customizations:</p>
            <div className="text-xs text-muted-foreground">
              {Object.entries(item.customizations).map(([key, value]) => (
                <span key={key} className="inline-block mr-3">
                  <span className="font-medium capitalize">{key}:</span> {value}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              className="p-1 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <MinusCircle className="h-5 w-5" />
            </button>
            
            <Input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-14 text-center mx-2"
              disabled={isUpdating}
            />
            
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10 || isUpdating}
              className="p-1 disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {formatPrice(item.product.price)} each
            </p>
          </div>
          
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
              disabled={isRemoving}
              aria-label="Remove item"
            >
              {isRemoving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Trash className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}