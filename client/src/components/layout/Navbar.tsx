import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencySelector from '@/components/currency/CurrencySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Package
} from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { currency } = useCurrency();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full ${
      isScrolled ? 
      'bg-background/80 backdrop-blur-md border-b' : 
      'bg-background'
    } transition-all duration-200`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold font-['Space_Grotesk'] text-primary">3D<span className="text-orange-500">Print</span><span className="text-teal-500">Wonders</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className={`text-sm font-medium ${
                location === '/' 
                ? 'text-foreground border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground transition-colors'
              } px-2 py-1`}>
                Home
            </Link>
            <Link href="/products" className={`text-sm font-medium ${
                location === '/products' 
                ? 'text-foreground border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground transition-colors'
              } px-2 py-1`}>
                Products
            </Link>
            <Link href="/customize" className={`text-sm font-medium ${
                location === '/customize' 
                ? 'text-foreground border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground transition-colors'
              } px-2 py-1`}>
                Customize
            </Link>
          </nav>
          
          {/* Search, Cart, and Account - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search */}
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="w-64 pl-10 rounded-full h-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* Currency Selector */}
            <CurrencySelector />
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Cart */}
            <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            
            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders">
                      <div className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log Out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
          
          {/* Mobile menu buttons */}
          <div className="flex items-center md:hidden space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="flex items-center">
                      <span className="text-xl font-bold font-['Space_Grotesk'] text-primary">3D<span className="text-orange-500">Print</span><span className="text-teal-500">Wonders</span></span>
                    </Link>
                  </div>
                  
                  {/* Mobile Search */}
                  <div className="relative mb-6">
                    <Input 
                      type="text" 
                      placeholder="Search products..." 
                      className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <nav className="flex flex-col space-y-4">
                    <Link href="/" className="text-base font-medium hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/products" className="text-base font-medium hover:text-primary transition-colors">
                      Products
                    </Link>
                    <Link href="/customize" className="text-base font-medium hover:text-primary transition-colors">
                      Customize
                    </Link>
                    <Link href="/wishlist" className="text-base font-medium hover:text-primary transition-colors">
                      Wishlist
                    </Link>
                  </nav>
                  
                  <Separator className="my-6" />
                  
                  {/* Account Section */}
                  {isAuthenticated ? (
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.username}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/profile/orders">
                            <Package className="mr-2 h-4 w-4" />
                            Orders
                          </Link>
                        </Button>
                        <Button variant="destructive" className="w-full justify-start" onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto space-y-3">
                      <Button variant="default" className="w-full" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/register">Create Account</Link>
                      </Button>
                    </div>
                  )}
                  
                  {/* Currency and Theme - Mobile */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Select Currency</span>
                      <CurrencySelector />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between" 
                      onClick={toggleTheme}
                    >
                      <span>Toggle Theme</span>
                      {theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
