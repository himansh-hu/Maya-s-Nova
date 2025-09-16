import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Sun, Moon, Menu } from 'lucide-react';
import { ThreeViewer } from '@/components/ui/three-viewer';

// Updated product data with new model names and INR pricing
const products = [
  { id: 1, name: 'Model 1', slug: 'model-1', modelUrl: '/products/model_1.glb', price: 299, category: 'collectibles' },
  { id: 2, name: 'Model 2', slug: 'model-2', modelUrl: '/products/model_2.glb', price: 399, category: 'toys' },
  { id: 3, name: 'Model 3', slug: 'model-3', modelUrl: '/products/model_3.glb', price: 499, category: 'home-decor' },
  { id: 4, name: 'Model 4', slug: 'model-4', modelUrl: '/products/model_4.glb', price: 549, category: 'home-decor' },
  { id: 5, name: 'Model 5', slug: 'model-5', modelUrl: '/products/model_5.glb', price: 699, category: 'collectibles' },
  { id: 6, name: 'Model 6', slug: 'model-6', modelUrl: '/products/model_6.glb', price: 449, category: 'gadgets' },
  { id: 7, name: 'Model 7', slug: 'model-7', modelUrl: '/products/model_7.glb', price: 799, category: 'home-decor' },
  { id: 8, name: 'Model 8', slug: 'model-8', modelUrl: '/products/model_8.glb', price: 649, category: 'gadgets' },
  { id: 9, name: 'Model 9', slug: 'model-9', modelUrl: '/products/model_9.glb', price: 599, category: 'gadgets' },
  { id: 10, name: 'Model 10', slug: 'model-10', modelUrl: '/products/model_10.glb', price: 899, category: 'gadgets' },
];

const categories = ['all', 'collectibles', 'toys', 'home-decor', 'gadgets'];

// Currency conversion rates with INR as base currency
const currencies = {
  INR: { symbol: '₹', rate: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.010, name: 'Euro' },
  GBP: { symbol: '£', rate: 0.009, name: 'British Pound' },
  JPY: { symbol: '¥', rate: 1.8, name: 'Japanese Yen' }
};

export default function Products() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
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

  // Load saved currency preference, default to INR
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && currencies[savedCurrency as keyof typeof currencies]) {
      setSelectedCurrency(savedCurrency);
    } else {
      setSelectedCurrency('INR'); // Ensure INR is default
    }
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
    localStorage.setItem('selectedCurrency', currency);
  };

  // Format price with selected currency
  const formatPrice = (priceINR: number) => {
    const currency = currencies[selectedCurrency as keyof typeof currencies];
    const convertedPrice = priceINR * currency.rate;
    return `${currency.symbol}${convertedPrice.toFixed(currency.rate < 1 ? 2 : 0)}`;
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchInput.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
                  <div>• Each 3D model has individual controls</div>
                  <div>• Prices update automatically with currency</div>
                  <div>• Theme preference is saved</div>
                  <div>• Perfect mobile compatibility</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Our 3D Model Collection
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Discover our extensive collection of high-quality 3D printed models. 
            Each design is crafted with precision and attention to detail.
          </p>
        </div>

        {/* Filters and Search */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-sm p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              } h-4 w-4`} />
              <input 
                type="text"
                placeholder="Search products..."
                className={`w-full pl-10 pr-4 py-2 border ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } rounded-lg outline-none`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              } h-4 w-4`} />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } rounded-lg outline-none appearance-none`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } rounded-lg outline-none appearance-none`}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <Card key={product.id} className={`group ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-xl transition-shadow duration-300 overflow-hidden`}>
              <CardContent className="p-0">
                {/* 3D Model Viewer */}
                <div className="aspect-square">
                  <ThreeViewer 
                    modelUrl={product.modelUrl}
                    height="100%"
                    backgroundColor="transparent"
                    sensitivity={0.3}
                    showControls={true}
                    isDarkMode={isDarkMode}
                    productName={product.name}
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold text-lg ${
                      isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                    } transition-colors`}>
                      {product.name}
                    </h3>
                    <Badge variant={isDarkMode ? "outline" : "secondary"} className={`ml-2 ${
                      isDarkMode ? 'border-gray-600 text-gray-300' : ''
                    }`}>
                      {product.category.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  } mb-4`}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="px-6 pb-6 pt-0 space-x-3">
                <Link to={`/product/${product.slug}`}>
                  <Button variant="outline" className={`flex-1 ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : ''
                  }`}>
                    View Details
                  </Button>
                </Link>
                <Button className="flex-1">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              No products found
            </h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Page Features Information */}
        <div className="mt-12 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Use the menu button (top-right) to change theme, currency, and access page features. Each 3D model has individual sensitivity controls optimized for mobile.
          </p>
        </div>
      </div>
    </div>
  );
}