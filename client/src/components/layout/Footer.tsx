import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter, Youtube, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold font-['Space_Grotesk'] text-primary">3D<span className="text-orange-500">Print</span><span className="text-teal-500">Wonders</span></span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-md">
              Bringing your ideas to life through innovative 3D printing technology. Customize, create, and collect unique 3D-printed products designed for modern living.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    All Products
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=tech-accessories">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Tech Accessories
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-decor">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Home Decor
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=collectibles">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Collectibles
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=gaming">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Gaming
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/customize">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Custom Designs
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Shipping & Returns
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/care">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Care Instructions
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/track-order">
                  <a className="text-muted-foreground hover:text-foreground transition-colors">
                    Track Your Order
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for exclusive deals, design inspiration, and early access to new products.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="w-full"
              />
              <Button className="w-full">Subscribe</Button>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 3D Print Wonders. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy">
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </Link>
            <Link href="/sitemap">
              <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sitemap
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
