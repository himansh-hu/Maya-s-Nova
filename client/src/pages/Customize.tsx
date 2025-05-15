import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ThreeViewer } from '@/components/ui/three-viewer';
import CustomizerControls from '@/components/customize/CustomizerControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Upload, Clock, Loader2, CheckCircle, ShoppingCart, CloudUpload } from 'lucide-react';

interface CustomizationOptions {
  model: string;
  material: string;
  color: string;
  scale: number;
  text: string;
}

export default function Customize() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('customize');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    model: '/models/phone-stand.gltf', // Default model
    material: 'PLA',
    color: '#6D28D9', // Default to primary color
    scale: 1,
    text: '',
  });
  
  // Sample predefined models
  const predefinedModels = [
    { id: 'phone-stand', name: 'Phone Stand', model: '/models/phone-stand.gltf', price: 24.99 },
    { id: 'desk-organizer', name: 'Desk Organizer', model: '/models/organizer.gltf', price: 34.99 },
    { id: 'planter', name: 'Planter Pot', model: '/models/planter.gltf', price: 29.99 },
  ];
  
  // Handle customization changes
  const handleCustomizationChange = (key: keyof CustomizationOptions, value: any) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle model change
  const handleModelChange = (modelId: string) => {
    const model = predefinedModels.find(m => m.id === modelId);
    if (model) {
      handleCustomizationChange('model', model.model);
    }
  };
  
  // Handle file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 50MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Check file extension
    const validExtensions = ['.stl', '.obj', '.gltf', '.glb'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an STL, OBJ, GLTF, or GLB file.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} has been uploaded and is ready for customization.`,
      });
    }, 2000);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your custom design.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Custom Design Added",
      description: "Your custom design has been added to your cart.",
    });
  };
  
  // Calculate estimated price based on options
  const calculatePrice = () => {
    let basePrice = 29.99;
    
    // Add material cost
    if (customization.material === 'ABS') basePrice += 5;
    if (customization.material === 'PETG') basePrice += 8;
    if (customization.material === 'Resin') basePrice += 15;
    
    // Add scale cost
    basePrice *= customization.scale;
    
    // Add text engraving cost
    if (customization.text.trim().length > 0) {
      basePrice += 5;
    }
    
    return basePrice.toFixed(2);
  };
  
  // Calculate estimated print time
  const calculatePrintTime = () => {
    let baseHours = 3;
    
    // Material affects print time
    if (customization.material === 'ABS') baseHours += 1;
    if (customization.material === 'Resin') baseHours += 2;
    
    // Scale affects print time exponentially
    baseHours *= customization.scale * 1.5;
    
    const hours = Math.floor(baseHours);
    const minutes = Math.round((baseHours - hours) * 60);
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
  };
  
  return (
    <>
      <Helmet>
        <title>Custom 3D Design Studio | 3D Print Wonders</title>
        <meta name="description" content="Create your own custom 3D-printed products. Choose from predefined models or upload your own design." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">3D Customization Studio</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Design your perfect 3D-printed product by customizing our templates or uploading your own 3D model.
            Personalize with different materials, colors, and custom text engraving.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="customize" className="flex-1">Customize Templates</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">Upload Your Design</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="customize" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 3D Model Viewer */}
              <div className="lg:order-2">
                <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                  <ThreeViewer
                    modelUrl={customization.model}
                    height="400px"
                    className="w-full"
                    backgroundColor="transparent"
                    customizations={{
                      color: customization.color,
                      material: customization.material,
                      scale: customization.scale,
                    }}
                  />
                </div>
                
                {/* Estimated Production Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Clock className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Print Time</p>
                        <p className="font-semibold">{calculatePrintTime()}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                        <span className="font-bold">$</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Price</p>
                        <p className="font-semibold">${calculatePrice()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Customization Controls */}
              <div className="lg:order-1">
                <CustomizerControls
                  customization={customization}
                  models={predefinedModels} 
                  onCustomizationChange={handleCustomizationChange}
                  onModelChange={handleModelChange}
                />
                
                <div className="mt-6">
                  <Button 
                    className="w-full flex items-center justify-center gap-2" 
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add Custom Design to Cart
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Upload Your Own 3D Model</h2>
                
                <p className="text-muted-foreground mb-6">
                  Have a 3D model ready? Upload your STL, OBJ, or GLTF file and we'll print it for you!
                  Our experts will review your design to ensure it can be printed with high quality.
                </p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <CloudUpload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  
                  {isUploading ? (
                    <div className="space-y-2">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="text-sm">Uploading your file...</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                      <p className="text-sm">Upload successful!</p>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4">Drag and drop your 3D file here or</p>
                      <label className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300">
                        <Upload className="h-4 w-4 mr-2" />
                        Browse Files
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".stl,.obj,.gltf,.glb"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: STL, OBJ, GLTF, GLB. Maximum file size: 50MB
                      </p>
                    </>
                  )}
                </div>
                
                <Separator className="my-8" />
                
                <h3 className="text-lg font-medium mb-4">Design Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <select 
                      id="material" 
                      className="w-full rounded-md border border-input bg-transparent p-2"
                    >
                      <option value="PLA">PLA Standard</option>
                      <option value="PLA-Premium">PLA Premium</option>
                      <option value="ABS">ABS Durable</option>
                      <option value="PETG">PETG Flexible</option>
                      <option value="Resin">High-Detail Resin</option>
                      <option value="Eco-PLA">Eco-Friendly PLA</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="finish">Surface Finish</Label>
                    <select 
                      id="finish" 
                      className="w-full rounded-md border border-input bg-transparent p-2"
                    >
                      <option value="standard">Standard (120 micron)</option>
                      <option value="smooth">Smooth (60 micron)</option>
                      <option value="ultra">Ultra-Detail (20 micron)</option>
                      <option value="polished">Polished</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <Label htmlFor="scale">Scale Factor</Label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="range" 
                      id="scale" 
                      min="0.5" 
                      max="2" 
                      step="0.1" 
                      defaultValue="1"
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <span className="min-w-12 text-center">1.0x</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adjust scale to change the size of your model
                  </p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <Label htmlFor="notes">Special Instructions</Label>
                  <textarea 
                    id="notes" 
                    rows={3}
                    placeholder="Add any special instructions or requirements for your design"
                    className="w-full rounded-md border border-input bg-transparent p-3 resize-none"
                  ></textarea>
                </div>
                
                <div className="rounded-lg bg-muted p-4 mb-6 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Design Review Process</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will review your model for printability within 24 hours. You may be contacted if any adjustments are needed.
                    </p>
                  </div>
                </div>
                
                <Button className="w-full" size="lg">
                  Request Quote for Custom Design
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Upload</h3>
                    <p className="text-sm text-muted-foreground">Submit your 3D model file</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-1">Review</h3>
                    <p className="text-sm text-muted-foreground">Our experts check printability</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-1">Approve</h3>
                    <p className="text-sm text-muted-foreground">Confirm quote and begin printing</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
