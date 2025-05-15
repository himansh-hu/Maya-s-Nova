import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Register form schema
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [location, navigate] = useLocation();
  const { register, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  // Form definition
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await register({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
      });

      if (success) {
        // Redirect after successful registration
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | 3D Print Wonders</title>
        <meta name="description" content="Create your 3D Print Wonders account to start shopping for innovative 3D-printed products." />
      </Helmet>

      <div className="container max-w-md mx-auto px-4 py-16">
        <Card className="border shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="johndoe" 
                          {...field} 
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="email@example.com" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            {...field} 
                            disabled={isSubmitting}
                          />
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
                        <FormLabel>Last Name (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25526 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.08L19.945 21.06C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.06L16.0804 18.08C15.0454 18.77 13.6954 19.2001 12.0004 19.2001C8.8704 19.2001 6.21537 17.09 5.2654 14.295L1.27539 17.39C3.25537 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                Google
              </Button>

              <Button variant="outline" type="button" disabled={isSubmitting}>
                <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current">
                  <path d="M16.365 1.43c0 1.14-.788 2.165-1.854 2.717.466 1.46 1.334 2.731 2.415 3.572.304-.14.688-.225 1.141-.225a4.18 4.18 0 0 1 1.343.224 8.337 8.337 0 0 1-1.76 3.826 6.413 6.413 0 0 1-1.856 1.562 10.161 10.161 0 0 1-2.732.799c-2.285.333-4.658-.254-6.53-1.644-1.73-1.29-2.876-3.18-3.261-5.288a6.783 6.783 0 0 1-.143-1.403A6.642 6.642 0 0 1 3.995 2.45c.493-.59 1.146-.902 1.852-.865.653.036 1.329.377 1.957.88h.01l.138.135a1.4 1.4 0 0 0 1.25.547 1.398 1.398 0 0 0 1.25-.546l.137-.136a4.63 4.63 0 0 1 1.096-.61 4.108 4.108 0 0 1 1.035-.26c.661-.077 1.29.011 1.801.261.661.324 1.108.836 1.253 1.481.145.645-.05 1.365-.536 2.094Zm-7.25 8.955a7.025 7.025 0 0 0-1.2-1.148 6.967 6.967 0 0 0-1.547-.75 7.027 7.027 0 0 0-1.158-.224 4.283 4.283 0 0 0-.363-.012c-.628 0-1.011.149-1.163.257a.389.389 0 0 0-.146.23.367.367 0 0 0 .12.33l.038.03c.051.04.133.094.248.147.32.147.842.323 1.588.323a5.548 5.548 0 0 0 1.692-.268 4.625 4.625 0 0 0 1.109-.54 4.841 4.841 0 0 0 .953-.83c-.08-.05-.163-.099-.247-.146a6.308 6.308 0 0 0-.924-.4Z" />
                </svg>
                Apple
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login">
                <a className="text-primary hover:underline">
                  Sign in
                </a>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}