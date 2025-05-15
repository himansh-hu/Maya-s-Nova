import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useProduct } from '@/hooks/useProducts';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ThreeViewer } from '@/components/ui/three-viewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Share2, Star, Clock, Truck, Check, AlertCircle, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ProductCustomization {
  color?: string;
  material?: string;
  size?: string;
  text?: string;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [customization, setCustomization] = useState<ProductCustomization>({
    color: undefined,
    material: undefined,
    size: undefined,
    text: '',
  });

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 10));
    setQuantity(newQuantity);
  };

  const handleColorChange = (color: string) => {
    setCustomization(prev => ({ ...prev, color }));
  };

  const handleMaterialChange = (material: string) => {
    setCustomization(prev => ({ ...prev, material }));
  };

  const handleSizeChange = (size: string) => {
    setCustomization(prev => ({ ...prev, size }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomization(prev => ({ ...prev, text: e.target.value }));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addItem(
        product.id, 
        quantity, 
        Object.keys(customization).length ? customization : undefined
      );
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Helper to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Calculate stock status
  const getStockStatus = (stock: number) => {
    if (stock > 20) return { text: 'In Stock', color: 'text-green-500' };
    if (stock > 0) return { text: `Only ${stock} left`, color: 'text-amber-500' };
    return { text: 'Out of Stock', color: 'text-red-500' };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the product you're looking for.
        </p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const showSalePrice = product.salePrice !== null && product.salePrice < product.price;
  const productPrice = showSalePrice ? product.salePrice! : product.price;
  const discount = showSalePrice ? Math.round((1 - product.salePrice! / product.price) * 100) : 0;
  const attributes = product.attributes as any || {};
  const images = product.imageUrls || [];

  return (
    <>
      <Helmet>
        <title>{`${product.name} | 3D Print Wonders`}</title>
        <meta name="description" content={product.description || `Shop the ${product.name} - a premium 3D printed product from 3D Print Wonders.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images and 3D Viewer */}
          <div className="space-y-4">
            <div className="relative h-96 bg-card rounded-lg overflow-hidden border">
              {/* Show 3D model if available, otherwise show image */}
              {product.modelUrl ? (
                <ThreeViewer 
                  modelUrl={product.modelUrl} 
                  height="100%" 
                  customizations={{
                    color: customization.color,
                    material: customization.material,
                    scale: 1
                  }}
                />
              ) : (
                <img 
                  src={images[activeImageIndex] || ''} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4"
                />
              )}
              
              {/* Sale badge */}
              {showSalePrice && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="text-sm font-semibold">
                    {discount}% OFF
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`rounded-md overflow-hidden border transition ${
                      index === activeImageIndex 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-16 object-cover" />
                  </button>
                ))}
                
                {/* Add 3D View button if model is available */}
                {product.modelUrl && (
                  <button
                    className={`rounded-md overflow-hidden border flex items-center justify-center bg-primary/10 transition hover:bg-primary/20 text-primary`}
                    onClick={() => setActiveImageIndex(-1)}
                  >
                    <span className="text-xs font-medium">3D View</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mt-2 mb-4">
                <div className="flex text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline">
                {showSalePrice ? (
                  <>
                    <span className="text-2xl font-bold text-primary">{formatPrice(product.salePrice!)}</span>
                    <span className="ml-2 text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
            </div>
            
            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>
            
            {/* Availability */}
            <div className="flex items-center">
              <span className={`font-medium ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
              {product.stock > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  Usually ships in 2-3 business days
                </span>
              )}
            </div>
            
            <Separator />
            
            {/* Customization Options */}
            <div className="space-y-4">
              {/* Colors */}
              {attributes.colors && attributes.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {attributes.colors.map((color: string) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full transition ${
                          customization.color === color 
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                            : 'ring-1 ring-border hover:ring-primary/50'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Materials */}
              {attributes.materials && attributes.materials.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Material</label>
                  <div className="flex flex-wrap gap-2">
                    {attributes.materials.map((material: string) => (
                      <Button
                        key={material}
                        variant={customization.material === material ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMaterialChange(material)}
                      >
                        {material}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sizes */}
              {attributes.sizes && attributes.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {attributes.sizes.map((size: string) => (
                      <Button
                        key={size}
                        variant={customization.size === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Custom Text Engraving */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Custom Text (Optional)</label>
                <Input
                  type="text"
                  placeholder="Add custom text or initials"
                  maxLength={30}
                  value={customization.text}
                  onChange={handleTextChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max 30 characters. Will be engraved on the product.
                </p>
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex border rounded-md max-w-[120px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="border-0 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                <Button 
                  size="lg" 
                  className="w-full flex items-center gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="sm:h-12 sm:w-12"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Product Information Tabs */}
            <div className="mt-10">
              <Tabs defaultValue="details">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Print Material</h3>
                      <p className="text-sm text-muted-foreground">
                        {attributes.materials?.join(', ') || 'PLA, ABS, PETG'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Dimensions</h3>
                      <p className="text-sm text-muted-foreground">
                        {attributes.dimensions || 'Varies by customization'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Print Time</h3>
                      <p className="text-sm text-muted-foreground">
                        {attributes.printTime || 'Approximately 4-6 hours'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Care Instructions</h3>
                      <p className="text-sm text-muted-foreground">
                        Clean with damp cloth. Avoid direct sunlight.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Product Tags</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shipping" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Truck className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium">Free Shipping</h3>
                        <p className="text-sm text-muted-foreground">
                          On orders over $50. Otherwise, flat rate of $5.99.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium">Production Time</h3>
                        <p className="text-sm text-muted-foreground">
                          Each item is 3D printed on demand, which takes 1-2 business days.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium">Returns</h3>
                        <p className="text-sm text-muted-foreground">
                          30-day money-back guarantee for undamaged items. Customized items cannot be returned.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Reviews are coming soon! Be the first to review this product.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Share */}
            <div className="flex items-center pt-4 border-t">
              <Button variant="ghost" size="sm" className="text-sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share This Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
