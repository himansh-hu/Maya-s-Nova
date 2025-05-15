import { Helmet } from 'react-helmet';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>3D Print Wonders | Next-Gen 3D Printed Gadgets</title>
        <meta 
          name="description" 
          content="Shop innovative 3D-printed gadgets, tech accessories, and collectibles with customization options and interactive 3D previews."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Features />
        <Testimonials />
        <Newsletter />
      </div>
    </>
  );
}
