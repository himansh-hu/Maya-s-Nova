import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full bg-background pt-10 md:pt-0">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center py-12 md:py-24">
        {/* Left column text content */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-primary">3D Printed</span>{" "}
            <span className="block">Wonders for Your World</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
            Innovative, customizable 3D printed gadgets, accessories, and models
            with interactive previews and fast shipping to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/customize">
                Customize Your Design
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 justify-center md:justify-start text-sm">
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Premium Materials</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Warranty</span>
            </div>
          </div>
        </div>

        {/* Right column 3D visualization */}
        <div className="relative h-[400px] w-full rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 overflow-hidden shadow-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p>3D Model Viewer</p>
              <p className="text-sm">(Interactive 3D model would display here)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-background-muted"></path>
        </svg>
      </div>
    </div>
  );
}