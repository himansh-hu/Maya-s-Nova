import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown, FilterX, SlidersHorizontal } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

interface ProductFilterProps {
  categories: Category[];
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
  };
  onChange: (filters: any) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function ProductFilter({
  categories,
  filters,
  onChange,
  onClose,
  isMobile = false
}: ProductFilterProps) {
  const [activeFilters, setActiveFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000
  ]);
  const { formatPrice } = useCurrency();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  // Update price range when filters change
  useEffect(() => {
    setPriceRange([
      filters.minPrice || 0,
      filters.maxPrice || 1000
    ]);
    setActiveFilters(filters);
  }, [filters]);
  
  // Handle category change
  const handleCategoryChange = (category: string | undefined) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, category };
      onChange(newFilters);
      return newFilters;
    });
  };
  
  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };
  
  // Apply price range after sliding ends
  const applyPriceRange = () => {
    setActiveFilters(prev => {
      const newFilters = { 
        ...prev, 
        minPrice: priceRange[0], 
        maxPrice: priceRange[1] 
      };
      onChange(newFilters);
      return newFilters;
    });
  };
  
  // Handle sort change
  const handleSortChange = (sort: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, sort };
      onChange(newFilters);
      return newFilters;
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    const newFilters = {
      category: undefined,
      minPrice: 0,
      maxPrice: 1000,
      sort: 'featured'
    };
    
    setActiveFilters(newFilters);
    setPriceRange([0, 1000]);
    onChange(newFilters);
    
    if (onClose) {
      onClose();
    }
  };
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.minPrice && activeFilters.minPrice > 0) count++;
    if (activeFilters.maxPrice && activeFilters.maxPrice < 1000) count++;
    if (activeFilters.sort && activeFilters.sort !== 'featured') count++;
    return count;
  };
  
  // Get active category name
  const getActiveCategoryName = () => {
    if (!activeFilters.category) return null;
    const category = categories.find(c => c.slug === activeFilters.category);
    return category ? category.name : null;
  };
  
  // Filter content
  const filterContent = (
    <div className={isMobile ? 'pb-24' : ''}>
      {/* Filter Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          <h3 className="font-medium text-lg">Filters</h3>
        </div>
        {countActiveFilters() > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <FilterX className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
      
      {/* Active Filters */}
      {countActiveFilters() > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {getActiveCategoryName()}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1" 
                  onClick={() => handleCategoryChange(undefined)}
                >
                  <span className="sr-only">Remove</span>
                  <ChevronDown className="h-3 w-3 rotate-180" />
                </Button>
              </Badge>
            )}
            
            {(activeFilters.minPrice !== 0 || activeFilters.maxPrice !== 1000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: {formatPrice(activeFilters.minPrice || 0)} - {formatPrice(activeFilters.maxPrice || 1000)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    setActiveFilters(prev => {
                      const newFilters = { ...prev, minPrice: 0, maxPrice: 1000 };
                      onChange(newFilters);
                      return newFilters;
                    });
                  }}
                >
                  <span className="sr-only">Remove</span>
                  <ChevronDown className="h-3 w-3 rotate-180" />
                </Button>
              </Badge>
            )}
            
            {activeFilters.sort && activeFilters.sort !== 'featured' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sort: {activeFilters.sort.replace('-', ' ')}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleSortChange('featured')}
                >
                  <span className="sr-only">Remove</span>
                  <ChevronDown className="h-3 w-3 rotate-180" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <Accordion type="multiple" defaultValue={['categories', 'price', 'sort']} className="space-y-4">
        {/* Categories */}
        <AccordionItem value="categories" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <span className="font-medium">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-3">
            <div className="space-y-2">
              <div 
                className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer hover:bg-muted ${!activeFilters.category ? 'bg-muted' : ''}`}
                onClick={() => handleCategoryChange(undefined)}
              >
                <Label htmlFor="all-categories" className="cursor-pointer w-full">
                  All Categories
                </Label>
                <Badge variant="outline">{categories.reduce((sum, c) => sum + (c.count || 0), 0)}</Badge>
              </div>
              
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`flex items-center justify-between px-2 py-1 rounded-md cursor-pointer hover:bg-muted ${activeFilters.category === category.slug ? 'bg-muted' : ''}`}
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  <Label htmlFor={`category-${category.slug}`} className="cursor-pointer w-full capitalize">
                    {category.name}
                  </Label>
                  <Badge variant="outline">{category.count || 0}</Badge>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Price Range */}
        <AccordionItem value="price" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <span className="font-medium">Price Range</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-3">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {formatPrice(priceRange[0])}
                </div>
                <div className="font-medium">
                  {formatPrice(priceRange[1])}
                </div>
              </div>
              
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
                onValueCommit={applyPriceRange}
                className="py-4"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-price">Min Price</Label>
                  <Input
                    id="min-price"
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= priceRange[1]) {
                        handlePriceChange([value, priceRange[1]]);
                      }
                    }}
                    onBlur={applyPriceRange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-price">Max Price</Label>
                  <Input
                    id="max-price"
                    type="number"
                    min={priceRange[0]}
                    max={1000}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= priceRange[0] && value <= 1000) {
                        handlePriceChange([priceRange[0], value]);
                      }
                    }}
                    onBlur={applyPriceRange}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Sort By */}
        <AccordionItem value="sort" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3">
            <span className="font-medium">Sort By</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-3">
            <RadioGroup 
              value={activeFilters.sort || 'featured'} 
              onValueChange={handleSortChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="featured" id="sort-featured" />
                <Label htmlFor="sort-featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="sort-price-asc" />
                <Label htmlFor="sort-price-asc">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="sort-price-desc" />
                <Label htmlFor="sort-price-desc">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest">Newest First</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="sort-rating" />
                <Label htmlFor="sort-rating">Highest Rated</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
  
  return (
    <>
      {isMobile ? (
        <div className="mt-4 mb-6">
          {filterContent}
        </div>
      ) : (
        <div className="sticky top-20">
          {filterContent}
        </div>
      )}
    </>
  );
}