import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/context/CurrencyContext';

// Define types locally until schema is properly connected
interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  categorySlug?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  inStock?: boolean;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  layout?: 'grid' | 'list';
  showCategory?: boolean;
}

export default function ProductGrid({
  products,
  loading = false,
  layout = 'grid',
  showCategory = true
}: ProductGridProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const [addingToCart, setAddingToCart] = useState<Record<number, boolean>>({});

  // Determine grid columns based on layout
  const gridCols = layout === 'grid' 
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
    : 'grid-cols-1';

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    if (addingToCart[product.id]) return;
    
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await addItem(product.id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading) {
    // Loading skeleton
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden h-full animate-pulse">
            <div className="aspect-square bg-muted"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-10 bg-muted rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No Products Found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or search criteria.
        </p>
        <Button variant="outline" asChild>
          <Link href="/products">Clear Filters</Link>
        </Button>
      </div>
    );
  }

  // Render products grid
  return (
    <div className={`grid ${gridCols} gap-6`}>
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="overflow-hidden h-full border transition-all duration-200 hover:shadow-md"
        >
          <div className="relative">
            <Link href={`/products/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden group">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ 
                    backgroundImage: product.imageUrl 
                      ? `url(${product.imageUrl})` 
                      : 'url(https://placehold.co/300x300/f1f5f9/64748b?text=No+Image)',
                    backgroundSize: 'cover'
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="secondary" size="sm" className="mx-1">
                    <Eye className="h-4 w-4 mr-2" /> Quick View
                  </Button>
                </div>
              </div>
            </Link>
            {product.featured && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-3 right-3">
                Out of Stock
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            {showCategory && product.category && (
              <Link href={`/products?category=${product.categorySlug || product.category.toLowerCase()}`}>
                <Badge variant="outline" className="mb-2 capitalize">
                  {product.category.replace('-', ' ')}
                </Badge>
              </Link>
            )}
            
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-medium text-lg hover:underline line-clamp-1">
                {product.name}
              </h3>
            </Link>
            
            {product.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <div className="font-semibold text-primary">
                {formatPrice(product.price)}
              </div>
              
              {product.rating && (
                <div className="flex items-center text-amber-500">
                  <Star className="fill-current h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  {product.reviewCount && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full" 
              disabled={!product.inStock || addingToCart[product.id]}
              onClick={() => handleAddToCart(product)}
            >
              {addingToCart[product.id] ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </div>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}