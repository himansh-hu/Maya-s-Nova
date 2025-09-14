// Path: C:\Projects\Maya's Nova 3D\client\src\pages\Home.tsx
import React from "react";
import Hero from "@/components/home/Hero";
import { Link } from "wouter";
import { ThreeViewer } from "@/components/ui/three-viewer";

// Static product data
const products = [
  { id: 1, name: "Gastly", slug: "gastly", category: "toys", price: 10, modelUrl: "/products/gastly.glb", featured: true },
  { id: 2, name: "Gengar", slug: "gengar", category: "toys", price: 12, modelUrl: "/products/gengar.glb", featured: true },
  { id: 3, name: "Ghost Pen Holder", slug: "ghost-pen-holder", category: "home-decor", price: 15, modelUrl: "/products/ghost pen holder.glb", featured: true },
  { id: 4, name: "Ghost Pen Holder 01", slug: "ghost-pen-holder-01", category: "home-decor", price: 16, modelUrl: "/products/ghost pen holder01.glb", featured: true },
  { id: 5, name: "Groot", slug: "groot", category: "collectibles", price: 18, modelUrl: "/products/groot.glb", featured: true },
  { id: 6, name: "Groot HONE Stand", slug: "groot-hone-stand", category: "gadgets", price: 14, modelUrl: "/products/grootHONE STAND.glb", featured: true },
  { id: 7, name: "Skull Cup", slug: "skull-cup", category: "home-decor", price: 20, modelUrl: "/products/skull cup.glb", featured: true },
  { id: 8, name: "Skull Headphone 03", slug: "skull-headphone-03", category: "gadgets", price: 22, modelUrl: "/products/skull headphone 03.glb", featured: true },
  { id: 9, name: "Skull Headphone Holder 02", slug: "skull-headphone-holder-02", category: "gadgets", price: 21, modelUrl: "/products/skull Headphone holder02.glb", featured: true },
  { id: 10, name: "Skull Headphone", slug: "skull-headphone", category: "gadgets", price: 19, modelUrl: "/products/skull headphone.glb", featured: true }
];

export default function Home() {
  // Only first 4 products for home
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      <Hero />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow">
            <Link href={`/products/${product.slug}`}>
              <a>
                <ThreeViewer modelUrl={product.modelUrl} />
                <h2 className="mt-2 text-lg font-bold">{product.name}</h2>
                <div className="text-sm text-gray-600">{product.category}</div>
                <div className="text-md font-semibold">${product.price}</div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
