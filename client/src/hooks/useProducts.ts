import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';

interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface ProductsOptions {
  limit?: number;
  offset?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export function useProducts(options: ProductsOptions = {}) {
  const queryParams = new URLSearchParams();
  
  if (options.limit !== undefined) {
    queryParams.append('limit', options.limit.toString());
  }
  
  if (options.offset !== undefined) {
    queryParams.append('offset', options.offset.toString());
  }
  
  if (options.category) {
    queryParams.append('category', options.category);
  }
  
  if (options.featured !== undefined) {
    queryParams.append('featured', options.featured.toString());
  }
  
  if (options.search) {
    queryParams.append('search', options.search);
  }
  
  if (options.minPrice !== undefined) {
    queryParams.append('minPrice', options.minPrice.toString());
  }
  
  if (options.maxPrice !== undefined) {
    queryParams.append('maxPrice', options.maxPrice.toString());
  }
  
  if (options.sort) {
    queryParams.append('sort', options.sort);
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

  return useQuery<ProductsResponse>({
    queryKey: [endpoint],
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });
}
