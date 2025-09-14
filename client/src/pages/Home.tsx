import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="mt-8">
        <FeaturedProducts />
      </div>
    </div>
  );
}
