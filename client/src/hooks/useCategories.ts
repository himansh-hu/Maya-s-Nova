import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
}

export function useCategory(slug: string | undefined) {
  return useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });
}
