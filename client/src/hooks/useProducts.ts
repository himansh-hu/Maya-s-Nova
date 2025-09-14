import { useQuery } from "@tanstack/react-query";
import type { Product } from "../../../shared/schema";

// Local fallback product list (used if backend is unavailable)
const localProducts: Product[] = [
  {
    id: "ghost-pan-stand",
    name: "Ghost Pan Stand",
    price: 129.99,
    image: "/products/ghost pan stand.obj",
    description: "A unique ghost-shaped pan stand for your kitchen.",
    category: "Kitchen",
    slug: "ghost-pan-stand",
    objPath: "/products/ghost pan stand.obj",
  },
  {
    id: "mikey-mouse-lamp",
    name: "Mikey Mouse Lamp",
    price: 199.99,
    image: "/products/mikey mouse lamp.obj",
    description: "A fun lamp inspired by a classic character.",
    category: "Lighting",
    slug: "mikey-mouse-lamp",
    objPath: "/products/mikey mouse lamp.obj",
  },
  {
    id: "skull-headphone-holder-01",
    name: "Skull Headphone Holder 01",
    price: 49.99,
    image: "/products/skull Hwadpphone holder 01.obj",
    description: "A skull-shaped headphone holder for your desk.",
    category: "Accessories",
    slug: "skull-headphone-holder-01",
    objPath: "/products/skull Hwadpphone holder 01.obj",
  },
  {
    id: "skull-headphone-holder-02",
    name: "Skull Headphone Holder 02",
    price: 59.99,
    image: "/products/skull Hwadpphone holder 02.obj",
    description: "Another variant of the skull headphone holder.",
    category: "Accessories",
    slug: "skull-headphone-holder-02",
    objPath: "/products/skull Hwadpphone holder 02.obj",
  },
  {
    id: "tripo-591f7c49",
    name: "Tripo Convert Model 1",
    price: 39.99,
    image: "/products/tripo_convert_591f7c49-cab4-4941-8ec3-010f9139d113.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-1",
    objPath: "/products/tripo_convert_591f7c49-cab4-4941-8ec3-010f9139d113.obj",
  },
  {
    id: "tripo-6ef86c7c",
    name: "Tripo Convert Model 2",
    price: 44.99,
    image: "/products/tripo_convert_6ef86c7c-d3ac-4b22-959a-d85e13c68046.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-2",
    objPath: "/products/tripo_convert_6ef86c7c-d3ac-4b22-959a-d85e13c68046.obj",
  },
  {
    id: "tripo-70bc283b",
    name: "Tripo Convert Model 3",
    price: 42.99,
    image: "/products/tripo_convert_70bc283b-f487-4b47-91b5-441e96e9b907.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-3",
    objPath: "/products/tripo_convert_70bc283b-f487-4b47-91b5-441e96e9b907.obj",
  },
  {
    id: "tripo-8005471e",
    name: "Tripo Convert Model 4",
    price: 43.99,
    image: "/products/tripo_convert_8005471e-703e-4291-8788-726a5c2c91b1.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-4",
    objPath: "/products/tripo_convert_8005471e-703e-4291-8788-726a5c2c91b1.obj",
  },
  {
    id: "tripo-b2e50100",
    name: "Tripo Convert Model 5",
    price: 39.99,
    image: "/products/tripo_convert_b2e50100-10ce-4c2c-b21d-c9c3cadcc654.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-5",
    objPath: "/products/tripo_convert_b2e50100-10ce-4c2c-b21d-c9c3cadcc654.obj",
  },
  {
    id: "tripo-d6ab6a80",
    name: "Tripo Convert Model 6",
    price: 39.99,
    image: "/products/tripo_convert_d6ab6a80-3c60-4a49-b54b-0dd781d80145.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-6",
    objPath: "/products/tripo_convert_d6ab6a80-3c60-4a49-b54b-0dd781d80145.obj",
  },
  {
    id: "tripo-dffad01f",
    name: "Tripo Convert Model 7",
    price: 39.99,
    image: "/products/tripo_convert_dffad01f-710c-4e8e-b9a2-bc40a24b27d6.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-7",
    objPath: "/products/tripo_convert_dffad01f-710c-4e8e-b9a2-bc40a24b27d6.obj",
  },
  {
    id: "tripo-e51d2b33",
    name: "Tripo Convert Model 8",
    price: 39.99,
    image: "/products/tripo_convert_e51d2b33-f08b-4d85-bedf-344133a7ac39.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-8",
    objPath: "/products/tripo_convert_e51d2b33-f08b-4d85-bedf-344133a7ac39.obj",
  },
  {
    id: "tripo-ed1224a7",
    name: "Tripo Convert Model 9",
    price: 39.99,
    image: "/products/tripo_convert_ed1224a7-3b34-4084-873f-d882e97f0cb0.obj",
    description: "A stylish 3D tripo model.",
    category: "Decor",
    slug: "tripo-convert-9",
    objPath: "/products/tripo_convert_ed1224a7-3b34-4084-873f-d882e97f0cb0.obj",
  },
  {
    id: "yourmesh-8",
    name: "YourMesh (8)",
    price: 29.99,
    image: "/products/yourMesh (8).obj",
    description: "A custom mesh model.",
    category: "Custom",
    slug: "yourmesh-8",
    objPath: "/products/yourMesh (8).obj",
  },
];

export type UseProductsParams = {
  limit?: number;
  offset?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  search?: string;
};

export type ProductsResponse = {
  products: Product[];
  pagination: { total: number; limit: number; offset: number };
};

function applyLocalFilters(data: Product[], params: UseProductsParams): Product[] {
  let out = [...data];
  if (params.category) {
    out = out.filter(p => p.category?.toLowerCase() === params.category!.toLowerCase());
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    out = out.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }
  if (params.minPrice !== undefined) out = out.filter(p => p.price >= params.minPrice!);
  if (params.maxPrice !== undefined) out = out.filter(p => p.price <= params.maxPrice!);
  if (params.sort === 'price_asc') out.sort((a,b)=>a.price-b.price);
  if (params.sort === 'price_desc') out.sort((a,b)=>b.price-a.price);
  return out;
}

export function useProducts(params: UseProductsParams) {
  const { limit = 12, offset = 0, category, minPrice, maxPrice, sort, search } = params || {};

  return useQuery<ProductsResponse>([
    "products",
    { limit, offset, category, minPrice, maxPrice, sort, search }
  ], async () => {
    try {
      const qs = new URLSearchParams();
      qs.set('limit', String(limit));
      qs.set('offset', String(offset));
      if (category) qs.set('category', category);
      if (minPrice !== undefined) qs.set('minPrice', String(minPrice));
      if (maxPrice !== undefined) qs.set('maxPrice', String(maxPrice));
      if (sort) qs.set('sort', sort);
      if (search) qs.set('search', search);

      const res = await fetch(`/api/products?${qs.toString()}`);
      if (!res.ok) throw new Error('api failed');
      const data = await res.json();
      return data as ProductsResponse;
    } catch {
      // Fallback to local list with client-side filters & pagination
      const filtered = applyLocalFilters(localProducts, { limit, offset, category, minPrice, maxPrice, sort, search });
      const total = filtered.length;
      const paged = filtered.slice(offset, offset + limit);
      return {
        products: paged,
        pagination: { total, limit, offset }
      };
    }
  }, {
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery<Product | null>(["product", slug], async () => {
    if (!slug) return null;
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error('api failed');
      return await res.json();
    } catch {
      return localProducts.find(p => p.slug === slug) || null;
    }
  }, { enabled: !!slug, staleTime: 5 * 60 * 1000 });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>(["featured-products"], async () => {
    try {
      const res = await fetch('/api/products/featured');
      if (!res.ok) throw new Error('api failed');
      return await res.json();
    } catch {
      return localProducts.slice(0, 6);
    }
  }, { staleTime: 5 * 60 * 1000 });
}
