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
              <span className="text-2xl font-bold font-['Space_Grotesk']">
                <span className="bg-gradient-to-r from-[#6a11cb] via-[#a044ff] to-[#ff6fd8] bg-clip-text text-transparent">Maya</span>
                <span className="bg-gradient-to-r from-[#FFD700] via-[#FFC300] to-[#FFB347] bg-clip-text text-transparent">’s </span>
                <span className="bg-gradient-to-r from-[#00c6ff] via-[#0072ff] to-[#1e3c72] bg-clip-text text-transparent">Nova</span>
              </span>
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
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=tech-accessories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tech Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-decor" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home Decor
                </Link>
              </li>
              <li>
                <Link href="/products?category=collectibles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Collectibles
                </Link>
              </li>
              <li>
                <Link href="/products?category=gaming" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gaming
                </Link>
              </li>
              <li>
                <Link href="/customize" className="text-muted-foreground hover:text-foreground transition-colors">
                  Custom Designs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-muted-foreground hover:text-foreground transition-colors">
                  Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-muted-foreground hover:text-foreground transition-colors">
                  Track Your Order
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
            &copy; {new Date().getFullYear()} Maya’s Nova. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
