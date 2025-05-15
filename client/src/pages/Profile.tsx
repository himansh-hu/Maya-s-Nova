import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Package, Heart, Clock, Settings, LogOut } from 'lucide-react';

export default function Profile() {
  const [_, navigate] = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Handle profile save
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    navigate('/login');
    return null;
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <div className="flex-1 space-y-8">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>My Profile | 3D Print Wonders</title>
        <meta name="description" content="Manage your account, view orders, and track your 3D Print Wonders purchases." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="md:w-64">
              <Card>
                <CardHeader className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <UserCircle className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-center">{user?.username || 'User'}</CardTitle>
                    <CardDescription className="text-center">
                      {user?.email || 'user@example.com'}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto rounded-none border-r bg-card w-full">
                      <TabsTrigger 
                        value="profile" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-l-primary" 
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="orders" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-l-primary"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </TabsTrigger>
                      <TabsTrigger 
                        value="wishlist" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-l-primary"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="justify-start px-4 py-3 rounded-none border-l-2 border-transparent data-[state=active]:border-l-primary"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="p-4">
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="profile">
                {/* Profile Tab */}
                <TabsContent value="profile" className="m-0">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>
                            Manage your personal information and address
                          </CardDescription>
                        </div>
                        <Button 
                          variant={isEditing ? "outline" : "default"}
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              defaultValue={user?.firstName || ''} 
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              defaultValue={user?.lastName || ''} 
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            defaultValue={user?.email || ''} 
                            readOnly={!isEditing}
                            className={!isEditing ? 'bg-muted' : ''}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            defaultValue={user?.phone || ''} 
                            readOnly={!isEditing}
                            className={!isEditing ? 'bg-muted' : ''}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            defaultValue={user?.address || ''} 
                            readOnly={!isEditing}
                            className={!isEditing ? 'bg-muted' : ''}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                              id="city" 
                              defaultValue={user?.city || ''} 
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input 
                              id="state" 
                              defaultValue={user?.state || ''} 
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input 
                              id="zipCode" 
                              defaultValue={user?.zipCode || ''} 
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-muted' : ''}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input 
                            id="country" 
                            defaultValue={user?.country || ''} 
                            readOnly={!isEditing}
                            className={!isEditing ? 'bg-muted' : ''}
                          />
                        </div>
                        
                        {isEditing && (
                          <div className="flex justify-end">
                            <Button onClick={handleSaveProfile}>
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>
                        View and track your recent orders
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-center py-10">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't placed any orders yet. Browse our products to get started!
                        </p>
                        <Button asChild>
                          <a href="/products">Shop Now</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Wishlist Tab */}
                <TabsContent value="wishlist" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                      <CardDescription>
                        Products you've saved for later
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-center py-10">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your Wishlist is Empty</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't added any products to your wishlist yet. Click the heart icon on products you love!
                        </p>
                        <Button asChild>
                          <a href="/products">Explore Products</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences and security
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Password</h3>
                          <p className="text-sm text-muted-foreground">
                            Change your account password
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input id="currentPassword" type="password" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input id="newPassword" type="password" />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button>Update Password</Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Email Preferences</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage your email notifications
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id="marketing-emails" 
                                className="rounded text-primary focus:ring-primary"
                                defaultChecked
                              />
                              <Label htmlFor="marketing-emails" className="text-sm font-normal">
                                Receive marketing emails and special offers
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              <input 
                                type="checkbox" 
                                id="order-updates" 
                                className="rounded text-primary focus:ring-primary"
                                defaultChecked
                              />
                              <Label htmlFor="order-updates" className="text-sm font-normal">
                                Receive order status updates
                              </Label>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button>Save Preferences</Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                          <div className="mt-2">
                            <Button variant="destructive">Delete Account</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
