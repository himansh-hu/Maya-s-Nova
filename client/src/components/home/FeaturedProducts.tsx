import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, ShoppingCart, Star } from 'lucide-react';

const featuredProducts = [
  {
    id: 1,
    name: 'Modular Phone Stand',
    slug: 'modular-phone-stand',
    price: 24.99,
    imageUrl: 'https://placehold.co/300x300/2563EB/FFFFFF?text=Phone+Stand',
    rating: 4.8,
    reviewCount: 32,
    category: 'gadgets',
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: 'Geometric Desk Organizer',
    slug: 'geometric-desk-organizer',
    price: 34.99,
    imageUrl: 'https://placehold.co/300x300/10B981/FFFFFF?text=Desk+Organizer',
    rating: 4.6,
    reviewCount: 28,
    category: 'home-decor',
    featured: true,
    inStock: true
  },
  {
    id: 3,
    name: 'Articulated Dragon Figure',
    slug: 'articulated-dragon-figure',
    price: 29.99,
    imageUrl: 'https://placehold.co/300x300/F59E0B/FFFFFF?text=Dragon+Figure',
    rating: 4.9,
    reviewCount: 47,
    category: 'toys-games',
    featured: true,
    inStock: true
  },
  {
    id: 4,
    name: 'Customizable Planter',
    slug: 'customizable-planter',
    price: 19.99,
    imageUrl: 'https://placehold.co/300x300/EC4899/FFFFFF?text=Planter',
    rating: 4.5,
    reviewCount: 23,
    category: 'home-decor',
    featured: true,
    inStock: true
  }
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-background-muted">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl">
              Our most popular and trending 3D printed creations that customers love.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden h-full border transition-all duration-200 hover:shadow-md">
              <div className="relative">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-square relative overflow-hidden group">
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        backgroundImage: `url(${product.imageUrl})`,
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
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <Link href={`/products?category=${product.category}`}>
                    <Badge variant="outline" className="capitalize">
                      {product.category.replace('-', ' ')}
                    </Badge>
                  </Link>
                  <div className="flex items-center text-amber-500">
                    <Star className="fill-current h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
                  </div>
                </div>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-medium text-lg hover:underline line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-primary font-semibold mt-1">${product.price.toFixed(2)}</p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button variant="default" className="w-full" asChild>
                  <Link href={`/products/${product.slug}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}