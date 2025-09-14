import React from "react";
import { useParams } from "wouter";
import { useProducts } from "@/hooks/useProducts";
import { ThreeViewer } from "@/components/ui/three-viewer";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: products } = useProducts();
  const product = products?.find((p) => p.slug === slug);

  if (!product) return <div>Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <ThreeViewer objPath={product.objPath} />
      <p className="mt-4">{product.description}</p>
      <div className="mt-2 text-lg font-semibold">${product.price.toFixed(2)}</div>
      {/* Add to cart button, etc. */}
    </div>
  );
}

