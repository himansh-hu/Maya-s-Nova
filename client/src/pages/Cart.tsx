import { useState } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, AlertCircle, PackageX, ArrowRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Cart() {
  const { items, loading, error, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Handle clear cart confirmation
  const handleClearCart = () => {
    clearCart();
    setClearDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Your Cart | 3D Print Wonders</title>
        <meta name="description" content="Review and checkout your 3D-printed product selections." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" /> Your Cart
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-destructive/10 p-6 text-center my-8">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Cart</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-lg bg-muted p-8 text-center my-8 max-w-2xl mx-auto">
            <PackageX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">Sign In to View Your Cart</h3>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your cart and continue shopping for 3D-printed products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg bg-muted p-8 text-center my-8 max-w-2xl mx-auto">
            <PackageX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">Your Cart is Empty</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any 3D-printed products to your cart yet. 
              Start exploring our innovative designs or create your own custom piece!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/customize">Customize Your Design</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Cart Items ({items.length})
                    </h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setClearDialogOpen(true)}
                    >
                      Clear Cart
                    </Button>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="w-full" asChild>
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary items={items} />
              
              <div className="mt-4">
                <Button className="w-full flex items-center justify-center gap-2" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from your cart. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearCart}
              className="bg-destructive hover:bg-destructive/90"
            >
              Clear Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
