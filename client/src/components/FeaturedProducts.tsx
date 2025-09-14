import React from "react";
import { Link } from "wouter";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useCurrency } from "@/context/CurrencyContext";
import { ThreeViewer } from "@/components/ui/three-viewer";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();
  const { formatPrice } = useCurrency();

  if (isLoading) return <div>Loading...</div>;
  if (!Array.isArray(products)) return <div>No featured products available.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow">
          <Link href={`/products/${product.slug}`}>
            <a>
              <ThreeViewer modelUrl={product.modelUrl || ""} />
              <h2 className="mt-2 text-lg font-bold">{product.name}</h2>
              <div className="text-sm text-gray-600">{product.category}</div>
              <div className="text-md font-semibold">{formatPrice(product.price)}</div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}

