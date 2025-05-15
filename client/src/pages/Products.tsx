import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Helmet } from 'react-helmet';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Home, Filter, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  search?: string;
}

export default function Products() {
  const [_, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sort: searchParams.get('sort') || undefined,
    search: searchParams.get('search') || undefined,
  }));
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const limit = 12;
  const offset = (page - 1) * limit;
  
  // Fetch products with filters
  const { data, isLoading, error } = useProducts({
    limit,
    offset,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
    search: filters.search
  });
  
  // Fetch categories for filter
  const { data: categoriesData } = useCategories();
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.search) params.set('search', filters.search);
    
    const queryString = params.toString();
    setLocation(`/products${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [filters, setLocation]);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPage(1); // Reset to first page on new search
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calculate total pages
  const totalPages = data ? Math.ceil(data.pagination.total / limit) : 0;
  
  // Get active category name
  const activeCategoryName = filters.category && categoriesData ? 
    categoriesData.find(c => c.slug === filters.category)?.name : 
    'All Products';
  
  return (
    <>
      <Helmet>
        <title>Shop 3D Printed Products | 3D Print Wonders</title>
        <meta 
          name="description" 
          content="Browse our collection of 3D printed gadgets, tech accessories, and collectibles. Filter by category, price, and more."
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          {filters.category && (
            <BreadcrumbItem>
              <BreadcrumbLink>{activeCategoryName}</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
        
        <div className="flex flex-col space-y-6">
          {/* Title and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold">
              {filters.search ? `Search: "${filters.search}"` : activeCategoryName || 'All Products'}
            </h1>
            
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full md:w-64 pl-10 rounded-full h-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </form>
          </div>
          
          {/* Mobile Filters Button */}
          <div className="md:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters & Sorting
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <ScrollArea className="h-[calc(100vh-5rem)] pr-4">
                  <div className="py-6">
                    <h3 className="text-lg font-semibold mb-6">Filters</h3>
                    <ProductFilter 
                      categories={categoriesData || []}
                      filters={filters}
                      onChange={handleFilterChange}
                      onClose={() => setIsFilterOpen(false)}
                    />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Layout with Sidebar */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-6">Filters</h3>
                <ProductFilter 
                  categories={categoriesData || []}
                  filters={filters}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Summary & Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <p className="text-muted-foreground mb-4 sm:mb-0">
                  {data ? 
                    `Showing ${data.products.length > 0 ? offset + 1 : 0}-${Math.min(offset + limit, data.pagination.total)} of ${data.pagination.total} products` : 
                    'Loading products...'}
                </p>
                
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <select 
                    className="bg-transparent border-none text-sm focus:outline-none focus:ring-0"
                    value={filters.sort || ''}
                    onChange={(e) => handleFilterChange({ sort: e.target.value || undefined })}
                  >
                    <option value="">Sort by: Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="rating">Best Rating</option>
                  </select>
                </div>
              </div>
              
              {/* Products */}
              <ProductGrid 
                products={data?.products || []}
                isLoading={isLoading}
                error={error ? 'Failed to load products' : undefined}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && handlePageChange(page - 1)}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show correct page numbers when total pages > 5
                      let pageNum = i + 1;
                      if (totalPages > 5) {
                        if (page > 3 && page < totalPages - 1) {
                          pageNum = page - 2 + i;
                        } else if (page >= totalPages - 1) {
                          pageNum = totalPages - 4 + i;
                        }
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={page === pageNum}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && handlePageChange(page + 1)}
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
