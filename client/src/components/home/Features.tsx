import { 
  Package, 
  Truck, 
  CreditCard, 
  PencilRuler, 
  RotateCcw, 
  ShieldCheck
} from 'lucide-react';

const features = [
  {
    icon: <Package className="h-10 w-10 text-primary" />,
    title: '3D Visualization',
    description: 'Interactive 3D models let you see every detail before purchasing.'
  },
  {
    icon: <PencilRuler className="h-10 w-10 text-primary" />,
    title: 'Custom Designs',
    description: 'Personalize products with our easy-to-use customization tools.'
  },
  {
    icon: <Truck className="h-10 w-10 text-primary" />,
    title: 'Fast Shipping',
    description: 'Quick production and delivery to your doorstep within days.'
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Quality Materials',
    description: 'Premium, eco-friendly materials for durability and sustainability.'
  },
  {
    icon: <CreditCard className="h-10 w-10 text-primary" />,
    title: 'Secure Payments',
    description: 'Shop with confidence using our encrypted payment processing.'
  },
  {
    icon: <RotateCcw className="h-10 w-10 text-primary" />,
    title: '30-Day Returns',
    description: 'Not satisfied? Return within 30 days for a full refund.'
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Why Choose Us</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We're committed to providing the best 3D printing experience with these key features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start p-6 bg-card rounded-lg border shadow-sm">
              <div className="rounded-full p-3 bg-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}