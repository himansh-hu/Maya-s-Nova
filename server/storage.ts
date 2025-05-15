import {
  users, User, InsertUser, 
  products, Product, InsertProduct,
  categories, Category, InsertCategory,
  cartItems, CartItem, InsertCartItem,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  reviews, Review, InsertReview
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(options?: { 
    limit?: number, 
    offset?: number, 
    categoryId?: number,
    featured?: boolean,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sort?: string 
  }): Promise<{ products: Product[], total: number }>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, cartItemData: Partial<InsertCartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Review operations
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  
  private currentUserIds: number;
  private currentCategoryIds: number;
  private currentProductIds: number;
  private currentCartItemIds: number;
  private currentOrderIds: number;
  private currentOrderItemIds: number;
  private currentReviewIds: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    
    this.currentUserIds = 1;
    this.currentCategoryIds = 1;
    this.currentProductIds = 1;
    this.currentCartItemIds = 1;
    this.currentOrderIds = 1;
    this.currentOrderItemIds = 1;
    this.currentReviewIds = 1;
    
    // Seed initial data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIds++;
    const user: User = { ...insertUser, id, wishlistIds: [], createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryIds++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product operations
  async getProducts(options: { 
    limit?: number, 
    offset?: number, 
    categoryId?: number,
    featured?: boolean,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sort?: string 
  } = {}): Promise<{ products: Product[], total: number }> {
    let filteredProducts = Array.from(this.products.values());
    
    // Apply filters
    if (options.categoryId !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === options.categoryId);
    }
    
    if (options.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === options.featured);
    }
    
    if (options.search !== undefined) {
      const searchTerm = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (options.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= options.minPrice!);
    }
    
    if (options.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= options.maxPrice!);
    }
    
    // Apply sorting
    if (options.sort) {
      switch (options.sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
    
    const total = filteredProducts.length;
    
    // Apply pagination
    if (options.offset !== undefined && options.limit !== undefined) {
      filteredProducts = filteredProducts.slice(options.offset, options.offset + options.limit);
    } else if (options.limit !== undefined) {
      filteredProducts = filteredProducts.slice(0, options.limit);
    }
    
    return { products: filteredProducts, total };
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductIds++;
    const product: Product = { 
      ...insertProduct, 
      id, 
      rating: 0,
      reviewCount: 0,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }
  
  async getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }
  
  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemIds++;
    const cartItem: CartItem = { ...insertCartItem, id, createdAt: new Date() };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItem(id: number, cartItemData: Partial<InsertCartItem>): Promise<CartItem | undefined> {
    const existingCartItem = await this.getCartItem(id);
    if (!existingCartItem) return undefined;
    
    const updatedCartItem = { ...existingCartItem, ...cartItemData };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = await this.getCartItems(userId);
    userCartItems.forEach(item => {
      this.cartItems.delete(item.id);
    });
    return true;
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderIds++;
    const order: Order = { ...insertOrder, id, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const existingOrder = await this.getOrder(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder = { ...existingOrder, ...orderData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemIds++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Review operations
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewIds++;
    const review: Review = { ...insertReview, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update product rating
    const product = await this.getProduct(review.productId);
    if (product) {
      const productReviews = await this.getReviews(product.id);
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = totalRating / productReviews.length;
      
      await this.updateProduct(product.id, {
        rating: parseFloat(newRating.toFixed(1)),
        reviewCount: productReviews.length
      });
    }
    
    return review;
  }

  // Seed initial data
  private seedData() {
    // Seed Categories
    const categories: InsertCategory[] = [
      {
        name: "Tech Accessories",
        slug: "tech-accessories",
        description: "Innovative 3D-printed accessories for your devices",
        imageUrl: "https://pixabay.com/get/gcc0a0a4b37a6bb42ea99035f894563628621c457eb9f835241fc178574fd789477fc5ee4906f4aecc16d88203ac43654a1fbd4333b5f9b99f989869e9d920a06_1280.jpg",
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        description: "Modern 3D-printed decorations for your home",
        imageUrl: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        name: "Collectibles",
        slug: "collectibles",
        description: "Unique 3D-printed collectibles and figurines",
        imageUrl: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400&q=80",
      },
      {
        name: "Gaming",
        slug: "gaming",
        description: "3D-printed gaming accessories and add-ons",
        imageUrl: "https://pixabay.com/get/g7718fd7526b3cf3e52816951a64ce59adf0bf03e283f1525c3e96c49f72a3056b437df99bede5e78681761f1865dda8b334c1d3dfa0aa0def30bbabcd9106795_1280.jpg",
      }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Seed Products
    const products: InsertProduct[] = [
      {
        name: "ModularStand Pro",
        slug: "modularstand-pro",
        description: "Adjustable phone & tablet stand with multiple viewing angles and cable management",
        price: 29.99,
        salePrice: 24.99,
        categoryId: 1, // Tech Accessories
        stock: 50,
        modelUrl: "/models/phone-stand.gltf",
        imageUrls: [
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
        ],
        tags: ["phone", "tablet", "stand", "desk"],
        attributes: {
          colors: ["black", "white", "blue"],
          materials: ["PLA", "ABS", "PETG"]
        },
        featured: true,
      },
      {
        name: "Hexa Organizer",
        slug: "hexa-organizer",
        description: "Geometric desk organizer with compartments for pens, cards, and small accessories",
        price: 24.99,
        categoryId: 2, // Home Decor
        stock: 35,
        modelUrl: "/models/organizer.gltf",
        imageUrls: [
          "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
        ],
        tags: ["desk", "organizer", "office"],
        attributes: {
          colors: ["teal", "purple", "gray"],
          materials: ["PLA", "PETG"]
        },
        featured: true,
      },
      {
        name: "DroneX Frame",
        slug: "dronex-frame",
        description: "Lightweight, durable drone body frame kit for DIY drone builders and hobbyists",
        price: 49.99,
        categoryId: 1, // Tech Accessories
        stock: 20,
        modelUrl: "/models/drone-frame.gltf",
        imageUrls: [
          "https://pixabay.com/get/gdc2e7745e3035dce1e02b7403dd1de7333d7331d4459d46cd76d423db1fd650282cd560f3f34b0c9d71341df27c70217a3d982a67ab106673833886b09424a90_1280.jpg"
        ],
        tags: ["drone", "DIY", "frame", "hobby"],
        attributes: {
          sizes: ["small", "medium", "large"],
          materials: ["PLA", "ABS", "Carbon Fiber"]
        },
        featured: true,
      },
      {
        name: "NeoGarden Smart Planter",
        slug: "neogarden-smart-planter",
        description: "Self-watering planter with integrated LED grow lights and modular design",
        price: 59.99,
        salePrice: 49.99,
        categoryId: 2, // Home Decor
        stock: 15,
        modelUrl: "/models/planter.gltf",
        imageUrls: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
        ],
        tags: ["planter", "garden", "LED", "home"],
        attributes: {
          colors: ["green", "blue", "pink"],
          sizes: ["small", "medium", "large"]
        },
        featured: true,
      },
      {
        name: "Geometric Wall Art",
        slug: "geometric-wall-art",
        description: "Modern 3D-printed geometric wall art that adds dimension to any space",
        price: 39.99,
        categoryId: 2, // Home Decor
        stock: 25,
        modelUrl: "/models/wall-art.gltf",
        imageUrls: [
          "https://images.unsplash.com/photo-1581092335397-9583eb92d232?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600"
        ],
        tags: ["art", "wall", "decoration", "geometric"],
        attributes: {
          colors: ["white", "black", "gold"],
          sizes: ["small", "medium", "large"]
        },
        featured: false,
      },
      {
        name: "MechFigure X-1",
        slug: "mechfigure-x1",
        description: "Highly detailed 3D-printed mecha collectible figure with posable joints",
        price: 79.99,
        categoryId: 3, // Collectibles
        stock: 10,
        modelUrl: "/models/mech-figure.gltf",
        imageUrls: [
          "https://pixabay.com/get/g1282f547137cbc9950a7f06e15d035ebd76bd794f10332ea913d168e93154b414d796502251b3913da8670baffa5c8b17debfb46ccfbc78feac26b526014ce34_1280.jpg"
        ],
        tags: ["figure", "collectible", "sci-fi", "mecha"],
        attributes: {
          colors: ["gray", "red", "blue"],
          materials: ["PLA", "Resin"]
        },
        featured: false,
      },
      {
        name: "Cable Management System",
        slug: "cable-management-system",
        description: "Modular 3D-printed cable management system for a clean desk setup",
        price: 19.99,
        categoryId: 1, // Tech Accessories
        stock: 40,
        modelUrl: "/models/cable-management.gltf",
        imageUrls: [
          "https://pixabay.com/get/gd58c56fb67b9db7c4a9a09661f1502d061850e3a0b8a993d86865179f17dd74db791d75be6a968ad97a1a2538aeef9d489d42edcbc8b0bcc2e113b8fab4a0316_1280.jpg"
        ],
        tags: ["cable", "management", "desk", "office"],
        attributes: {
          colors: ["black", "white", "transparent"],
          materials: ["PLA", "PETG"]
        },
        featured: false,
      },
      {
        name: "Gaming Controller Mount",
        slug: "gaming-controller-mount",
        description: "Wall mount for gaming controllers with integrated LED lighting",
        price: 34.99,
        categoryId: 4, // Gaming
        stock: 30,
        modelUrl: "/models/controller-mount.gltf",
        imageUrls: [
          "https://pixabay.com/get/g7718fd7526b3cf3e52816951a64ce59adf0bf03e283f1525c3e96c49f72a3056b437df99bede5e78681761f1865dda8b334c1d3dfa0aa0def30bbabcd9106795_1280.jpg"
        ],
        tags: ["gaming", "controller", "mount", "LED"],
        attributes: {
          colors: ["black", "blue", "red"],
          materials: ["PLA", "ABS"]
        },
        featured: false,
      }
    ];
    
    products.forEach(product => {
      this.createProduct(product);
    });
    
    // Seed User
    this.createUser({
      username: "demo",
      password: "password",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
      phone: "555-123-4567"
    });
    
    // Seed Reviews
    const reviews = [
      {
        userId: 1,
        productId: 1,
        rating: 5,
        comment: "The ModularStand Pro is incredibly versatile! I use it for both my phone and tablet, and it holds them securely at perfect viewing angles."
      },
      {
        userId: 1,
        productId: 2,
        rating: 4,
        comment: "Great desk organizer! The hexagonal design is attractive and it has just the right number of compartments."
      },
      {
        userId: 1,
        productId: 3,
        rating: 5,
        comment: "The DroneX Frame is amazingly lightweight yet durable. I've crashed my drone multiple times and the frame is still intact!"
      },
      {
        userId: 1,
        productId: 4,
        rating: 4,
        comment: "Love my NeoGarden planter! The integrated LED lights work great for growing herbs indoors."
      }
    ];
    
    reviews.forEach(review => {
      this.createReview(review);
    });
  }
}

export const storage = new MemStorage();
