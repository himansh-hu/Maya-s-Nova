import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailIcon, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real app, you would send this to your backend
      console.log('Subscribing email:', email);
      setSubmitted(true);
      setEmail('');
      
      // Reset the submitted state after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-3 bg-primary-foreground/10 rounded-full mb-6">
            <MailIcon className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Stay Updated on New Designs
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on new product releases, 
            special offers, and exclusive customization tips.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              variant="secondary" 
              size="lg"
              className="whitespace-nowrap"
              disabled={submitted}
            >
              {submitted ? 'Subscribed!' : (
                <>
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <p className="mt-4 text-sm text-primary-foreground/70">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}