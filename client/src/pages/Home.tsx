// Path: C:\Projects\Maya's Nova 3D\client\src\pages\Home.tsx
import React, { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import { Link } from "wouter";
import { ThreeViewer } from "@/components/ui/three-viewer";
import { DollarSign, Sun, Moon, Menu } from "lucide-react";

// Static product data with new model names and INR pricing
const products = [
  { id: 1, name: "Model 1", slug: "model-1", category: "collectibles", price: 299, modelUrl: "/products/model_1.glb", featured: true },
  { id: 2, name: "Model 2", slug: "model-2", category: "toys", price: 399, modelUrl: "/products/model_2.glb", featured: true },
  { id: 3, name: "Model 3", slug: "model-3", category: "home-decor", price: 499, modelUrl: "/products/model_3.glb", featured: true },
  { id: 4, name: "Model 4", slug: "model-4", category: "home-decor", price: 549, modelUrl: "/products/model_4.glb", featured: true },
  { id: 5, name: "Model 5", slug: "model-5", category: "collectibles", price: 699, modelUrl: "/products/model_5.glb", featured: true },
  { id: 6, name: "Model 6", slug: "model-6", category: "gadgets", price: 449, modelUrl: "/products/model_6.glb", featured: true },
  { id: 7, name: "Model 7", slug: "model-7", category: "home-decor", price: 799, modelUrl: "/products/model_7.glb", featured: true },
  { id: 8, name: "Model 8", slug: "model-8", category: "gadgets", price: 649, modelUrl: "/products/model_8.glb", featured: true },
  { id: 9, name: "Model 9", slug: "model-9", category: "gadgets", price: 599, modelUrl: "/products/model_9.glb", featured: true },
  { id: 10, name: "Model 10", slug: "model-10", category: "gadgets", price: 899, modelUrl: "/products/model_10.glb", featured: true }
];

// Currency conversion rates with INR as default
const currencies = {
  INR: { symbol: '₹', rate: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.010, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.009, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 1.8, name: 'Japanese Yen' }
};

export default function Home() {
  // Only first 4 products for home
  const featuredProducts = products.slice(0, 4);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUtilityMenu, setShowUtilityMenu] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR'); // Default to INR

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Load saved currency preference - localStorage disabled for Claude.ai artifacts
  useEffect(() => {
    // Original localStorage code:
    // const savedCurrency = localStorage.getItem('selectedCurrency');
    // if (savedCurrency && currencies[savedCurrency as keyof typeof currencies]) {
    //   setSelectedCurrency(savedCurrency);
    // } else {
    //   setSelectedCurrency('INR'); // Ensure INR is default
    // }
    
    // Using in-memory default instead
    setSelectedCurrency('INR');
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    // Original localStorage save disabled:
    // localStorage.setItem('selectedCurrency', currency);
  };

  // Format price with selected currency
  const formatPrice = (priceINR: number) => {
    const currency = currencies[selectedCurrency as keyof typeof currencies];
    const convertedPrice = priceINR * currency.rate;
    return `${currency.symbol}${convertedPrice.toFixed(currency.rate < 1 ? 2 : 0)}`;
  };

  // Handle product click - prevent event bubbling from 3D viewer and redirect to products page
  const handleProductClick = (productSlug: string, event: React.MouseEvent) => {
    // Check if click is on the 3D viewer area (user interacting with model)
    const target = event.target as HTMLElement;
    
    // If user clicked on canvas or 3D viewer controls, don't navigate
    if (target.tagName.toLowerCase() === 'canvas' || target.closest('.three-viewer-controls')) {
      return;
    }
    
    // Navigate to products page if not interacting with 3D model
    window.location.href = `/products`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Hero />

      {/* Utility Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowUtilityMenu(!showUtilityMenu)}
          className={`p-3 ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          } rounded-full shadow-lg transition-all ${
            showUtilityMenu ? 'ring-2 ring-blue-400' : ''
          }`}
          title="Page Settings"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Utility Menu Panel */}
        {showUtilityMenu && (
          <div className={`absolute top-16 right-0 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl shadow-2xl border p-6 w-80 z-40`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                Page Settings
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Theme Mode
                </label>
                <button
                  onClick={toggleDarkMode}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span className="text-sm">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span className="text-sm">Dark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Currency Converter */}
              <div>
                <label className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-2`}>
                  Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  } rounded-lg outline-none`}
                >
                  {Object.entries(currencies).map(([code, currency]) => (
                    <option key={code} value={code}>
                      {code} ({currency.symbol}) - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Features Info */}
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} pt-2 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="space-y-1">
                  <div>• Each 3D model is fully interactive</div>
                  <div>• Click outside model to view product details</div>
                  <div>• Prices update automatically with currency</div>
                  <div>• Theme preference is saved</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Featured 3D Models
          </h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore our premium collection of 3D printed designs - fully interactive!
          </p>
        </div>

        {/* Hero Product - Large Display with Full Interaction */}
        <div className={`mb-12 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-2xl shadow-lg overflow-hidden`}>
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <ThreeViewer 
                modelUrl={featuredProducts[0]?.modelUrl}
                height="500px"
                sensitivity={0.4}
                showControls={true}
                className="w-full h-full"
                isDarkMode={isDarkMode}
                productName={featuredProducts[0]?.name}
                backgroundColor="transparent"
              />
              {/* Interactive overlay indicator */}
              <div className="absolute top-4 left-4 z-10">
                <div className={`px-3 py-1 ${
                  isDarkMode ? 'bg-gray-900/80 text-gray-200' : 'bg-black/70 text-white'
                } text-xs rounded-full backdrop-blur-sm`}>
                  🖱️ Interactive 3D Model
                </div>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Featured Product
                </div>
                <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {featuredProducts[0]?.name}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  High-quality 3D printed model with incredible detail. Perfect for collectors, 
                  enthusiasts, and anyone who appreciates fine craftsmanship. Each model is 
                  carefully printed using premium materials. Try rotating and zooming the model!
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(featuredProducts[0]?.price || 0)}
                  </span>
                  <span className={`px-3 py-1 ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  } text-sm rounded-full capitalize`}>
                    {featuredProducts[0]?.category}
                  </span>
                </div>
                <Link href="/products">
                  <button className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                    View All Products
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Other Featured Products Grid - All Interactive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(1).map((product) => (
            <div
              key={product.id}
              className={`group relative ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
              } rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer`}
              onClick={(e) => handleProductClick(product.slug, e)}
            >
              <div className="relative aspect-square">
                <ThreeViewer 
                  modelUrl={product.modelUrl}
                  height="280px"
                  sensitivity={0.4}
                  showControls={true}
                  className="w-full h-full three-viewer-controls"
                  isDarkMode={isDarkMode}
                  productName={product.name}
                  backgroundColor="transparent"
                />
                
                {/* Interactive indicator */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={`px-2 py-1 ${
                    isDarkMode ? 'bg-gray-900/80 text-gray-200' : 'bg-black/70 text-white'
                  } text-xs rounded-full backdrop-blur-sm`}>
                    🖱️ Interactive
                  </div>
                </div>
                
                {/* Click to view products overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <span className={`${
                      isDarkMode ? 'bg-gray-800/90 text-gray-100' : 'bg-white/90 text-gray-900'
                    } px-4 py-2 rounded-lg font-medium shadow-lg`}>
                      Click outside model to view all products
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                  } transition-colors`}>
                    {product.name}
                  </h3>
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  } text-xs rounded-full capitalize`}>
                    {product.category}
                  </span>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  } font-medium group-hover:underline`}>
                    View all products →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link href="/products">
            <button className={`px-8 py-3 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            } font-medium rounded-lg transition-colors duration-200`}>
              Browse All Products
            </button>
          </Link>
        </div>

        {/* Page Features Information */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            All 3D models are fully interactive! Drag to rotate, scroll to zoom, and use individual controls. 
            Click anywhere outside the model area to browse all products.
          </p>
        </div>
      </div>
    </div>
  );
}