import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { ThreeViewer } from '@/components/ui/three-viewer';

const products = [
  { id: 1, name: 'Gastly', slug: 'gastly', modelUrl: '/products/gastly.glb', price: 10, category: 'pokemon' },
  { id: 2, name: 'Gengar', slug: 'gengar', modelUrl: '/products/gengar.glb', price: 15, category: 'pokemon' },
  { id: 3, name: 'Ghost Pen Holder', slug: 'ghost-pen-holder', modelUrl: '/products/ghost pen holder.glb', price: 20, category: 'stationery' },
  { id: 4, name: 'Ghost Pen Holder 01', slug: 'ghost-pen-holder-01', modelUrl: '/products/ghost pen holder01.glb', price: 22, category: 'stationery' },
  { id: 5, name: 'Groot', slug: 'groot', modelUrl: '/products/groot.glb', price: 30, category: 'decor' },
  { id: 6, name: 'Groot HONE STAND', slug: 'groot-hone-stand', modelUrl: '/products/grootHONE STAND.glb', price: 12, category: 'gadgets' },
  { id: 7, name: 'Skull Cup', slug: 'skull-cup', modelUrl: '/products/skull cup.glb', price: 18, category: 'decor' },
  { id: 8, name: 'Skull Headphone 03', slug: 'skull-headphone-03', modelUrl: '/products/skull headphone 03.glb', price: 25, category: 'gadgets' },
  { id: 9, name: 'Skull Headphone Holder 02', slug: 'skull-headphone-holder-02', modelUrl: '/products/skull Headphone holder02.glb', price: 28, category: 'gadgets' },
  { id: 10, name: 'Skull Headphone', slug: 'skull-headphone', modelUrl: '/products/skull headphone.glb', price: 15, category: 'gadgets' },
];

export default function Products() {
  const [searchInput, setSearchInput] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <input 
        type="text"
        placeholder="Search products..."
        className="border rounded px-4 py-2 mb-6 w-full md:w-1/3"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden h-full border transition-all duration-200 hover:shadow-md">
            <Link href={`/products/${product.slug}`}>
              <div className="aspect-square relative overflow-hidden">
                <ThreeViewer modelUrl={product.modelUrl} />
              </div>
            </Link>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-primary font-semibold mt-1">${product.price.toFixed(2)}</p>
              <Badge variant="outline" className="capitalize">{product.category}</Badge>
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
  );
}
