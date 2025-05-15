import { useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  ChevronRight, 
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertCircle, 
  PackageX 
} from 'lucide-react';
import CartSummary from '@/components/cart/CartSummary';

const checkoutSchema = z.object({
  // Shipping Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  
  // Payment Information
  paymentMethod: z.enum(["creditCard", "paypal"]),
  savePaymentInfo: z.boolean().optional(),
  
  // Additional Information
  notes: z.string().optional(),
  createAccount: z.boolean().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define shipping cost
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;
  
  // Set default form values based on user data
  const defaultValues: Partial<CheckoutFormValues> = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'US',
    paymentMethod: 'creditCard',
    agreeToTerms: false,
    savePaymentInfo: false,
    createAccount: false,
  };
  
  // Form definition
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });
  
  // Handle form submission
  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some products before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare order data
      const orderData = {
        userId: user!.id,
        total,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
      };
      
      // Submit order
      const response = await apiRequest('POST', '/api/orders', orderData);
      const order = await response.json();
      
      // Order success
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id} has been placed. Thank you for your purchase!`,
      });
      
      // Clear cart
      clearCart();
      
      // Redirect to order confirmation page
      navigate(`/profile/orders`);
    } catch (error) {
      console.error('Order failed:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Guard for empty cart or unauthenticated users
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Helmet>
          <title>Checkout | 3D Print Wonders</title>
          <meta name="description" content="Complete your purchase of 3D-printed products." />
        </Helmet>
        
        <div className="rounded-lg bg-muted p-8 text-center my-8 max-w-2xl mx-auto">
          <PackageX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Your Cart is Empty</h3>
          <p className="text-muted-foreground mb-6">
            You can't proceed to checkout with an empty cart.
            Add some products first!
          </p>
          <Button asChild>
            <a href="/products">Browse Products</a>
          </Button>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Helmet>
          <title>Checkout | 3D Print Wonders</title>
          <meta name="description" content="Complete your purchase of 3D-printed products." />
        </Helmet>
        
        <div className="rounded-lg bg-muted p-8 text-center my-8 max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">Sign In Required</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to your account to complete checkout.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register">Create Account</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | 3D Print Wonders</title>
        <meta name="description" content="Complete your purchase of 3D-printed products." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        {/* Checkout Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <ShoppingBag className="mr-3 h-7 w-7" /> Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your purchase of {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <Button variant="ghost" size="sm" className="mt-4 md:mt-0" asChild>
            <a href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping Information */}
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Shipping Information</h2>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Special delivery instructions or notes about your order" 
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Payment Information */}
                <div className="bg-card rounded-lg border p-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-4"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground">
                              <RadioGroupItem value="creditCard" id="creditCard" />
                              <Label htmlFor="creditCard" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="w-8 h-5 mr-2 bg-primary/20 rounded flex items-center justify-center">
                                    <CreditCard className="h-3 w-3 text-primary" />
                                  </div>
                                  Credit / Debit Card
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Secure payment with credit or debit card
                                </p>
                              </Label>
                              <div className="flex space-x-1">
                                <div className="w-8 h-5 bg-blue-600 rounded"></div>
                                <div className="w-8 h-5 bg-red-600 rounded"></div>
                                <div className="w-8 h-5 bg-yellow-600 rounded"></div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                <div className="flex items-center">
                                  <div className="w-8 h-5 mr-2 bg-blue-500/20 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-blue-600">P</span>
                                  </div>
                                  PayPal
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Fast and secure payment with PayPal
                                </p>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Save Payment Information */}
                  <FormField
                    control={form.control}
                    name="savePaymentInfo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Save my payment information for future purchases
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {/* Simulated Payment Form (Credit Card) */}
                  {form.watch("paymentMethod") === "creditCard" && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" disabled={isSubmitting} />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" disabled={isSubmitting} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" disabled={isSubmitting} />
                        </div>
                        
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" type="password" disabled={isSubmitting} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Terms and Conditions */}
                <div className="bg-card rounded-lg border p-6">
                  <div className="space-y-4">
                    {/* For new users */}
                    {!isAuthenticated && (
                      <FormField
                        control={form.control}
                        name="createAccount"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                Create an account for faster checkout in the future
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {/* Terms and Conditions */}
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              I agree to the <a href="/terms" className="text-primary hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {/* Secure Checkout Notice */}
                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                      Your personal data will be used to process your order, support your experience, and for other purposes described in our privacy policy.
                    </div>
                  </div>
                </div>
                
                {/* Place Order Button (Mobile) */}
                <div className="lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full text-lg" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Place Order 
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border shadow-sm sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <Separator className="mb-4" />
                
                <CartSummary 
                  items={items} 
                  showItemList={true}
                  showCheckoutButton={false}
                />
                
                {/* Place Order Button (Desktop) */}
                <div className="hidden lg:block mt-6">
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full text-lg" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Place Order 
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
                
                {/* Secure Checkout Badge */}
                <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-green-500" />
                  Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
