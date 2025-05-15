import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    id: 1,
    name: 'Gadgets',
    slug: 'gadgets',
    description: 'Tech accessories and smart device add-ons',
    imageUrl: 'https://placehold.co/300x200/2563EB/FFFFFF?text=Gadgets',
    count: 24
  },
  {
    id: 2,
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Decorative pieces and functional art',
    imageUrl: 'https://placehold.co/300x200/10B981/FFFFFF?text=Home+Decor',
    count: 31
  },
  {
    id: 3,
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Figurines, puzzles, and interactive toys',
    imageUrl: 'https://placehold.co/300x200/F59E0B/FFFFFF?text=Toys',
    count: 19
  },
  {
    id: 4,
    name: 'Educational',
    slug: 'educational',
    description: 'Learning tools and educational models',
    imageUrl: 'https://placehold.co/300x200/EC4899/FFFFFF?text=Educational',
    count: 15
  }
];

export default function Categories() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Browse Categories</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore our diverse range of 3D printed products organized into categories to help you find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}`}>
              <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md cursor-pointer">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${category.imageUrl})`,
                      backgroundSize: 'cover'
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}