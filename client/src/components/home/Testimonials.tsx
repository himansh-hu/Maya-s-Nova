import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'AJ',
    role: 'Product Designer',
    content: "The quality of these 3D printed items is outstanding. I've ordered multiple pieces for my workspace and they're both functional and aesthetically pleasing.",
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: 'SC',
    role: 'Tech Enthusiast',
    content: "The customization options are incredible! I was able to create a completely personalized phone dock that matches my setup perfectly.",
    rating: 5
  },
  {
    id: 3,
    name: 'Marcus Williams',
    avatar: 'MW',
    role: 'Teacher',
    content: "I use these 3D models in my classroom to help students visualize complex concepts. The educational collection is a game-changer for hands-on learning.",
    rating: 4
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-background-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Hear from our satisfied customers about their experiences with our 3D printed products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-6 italic text-muted-foreground">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.id}`} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}