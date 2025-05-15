import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertProductSchema,
  insertCategorySchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  const apiRouter = "/api";

  // Auth Routes
  app.post(`${apiRouter}/auth/register`, async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't return the password
      const { password, ...userWithoutPassword } = newUser;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post(`${apiRouter}/auth/login`, async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  });

  // Category Routes
  app.get(`${apiRouter}/categories`, async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get(`${apiRouter}/categories/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Product Routes
  app.get(`${apiRouter}/products`, async (req: Request, res: Response) => {
    try {
      const { 
        limit = "12", 
        offset = "0", 
        category, 
        featured, 
        search,
        minPrice,
        maxPrice,
        sort 
      } = req.query;
      
      const options: {
        limit?: number;
        offset?: number;
        categoryId?: number;
        featured?: boolean;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: string;
      } = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      };
      
      // Add optional filters if provided
      if (category) {
        const categoryObj = await storage.getCategoryBySlug(category as string);
        if (categoryObj) {
          options.categoryId = categoryObj.id;
        }
      }
      
      if (featured !== undefined) {
        options.featured = featured === 'true';
      }
      
      if (search) {
        options.search = search as string;
      }
      
      if (minPrice) {
        options.minPrice = parseFloat(minPrice as string);
      }
      
      if (maxPrice) {
        options.maxPrice = parseFloat(maxPrice as string);
      }
      
      if (sort) {
        options.sort = sort as string;
      }
      
      const { products, total } = await storage.getProducts(options);
      
      return res.status(200).json({
        products,
        pagination: {
          total,
          limit: options.limit,
          offset: options.offset
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(`${apiRouter}/products/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Featured Products
  app.get(`${apiRouter}/products/featured`, async (_req: Request, res: Response) => {
    try {
      const { products } = await storage.getProducts({ featured: true, limit: 8 });
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Product Reviews
  app.get(`${apiRouter}/products/:id/reviews`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const reviews = await storage.getReviews(productId);
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post(`${apiRouter}/products/:id/reviews`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId
      });
      
      const newReview = await storage.createReview(reviewData);
      return res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Cart Routes
  app.get(`${apiRouter}/cart/:userId`, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userIdNum = parseInt(userId);
      
      if (isNaN(userIdNum)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userIdNum);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const cartItems = await storage.getCartItems(userIdNum);
      
      // Get product details for each cart item
      const cartItemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      return res.status(200).json(cartItemsWithDetails);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post(`${apiRouter}/cart`, async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(cartItemData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if product is in stock
      if (product.stock < cartItemData.quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      // Check if item already in cart
      const existingItem = await storage.getCartItemByUserAndProduct(
        cartItemData.userId,
        cartItemData.productId
      );
      
      if (existingItem) {
        // Update quantity
        const updatedItem = await storage.updateCartItem(
          existingItem.id,
          { quantity: existingItem.quantity + cartItemData.quantity }
        );
        
        return res.status(200).json(updatedItem);
      } else {
        // Create new cart item
        const newCartItem = await storage.createCartItem(cartItemData);
        return res.status(201).json(newCartItem);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put(`${apiRouter}/cart/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cartItemId = parseInt(id);
      
      if (isNaN(cartItemId)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      
      const cartItem = await storage.getCartItem(cartItemId);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Check if product has enough stock
      const product = await storage.getProduct(cartItem.productId);
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      const updatedCartItem = await storage.updateCartItem(cartItemId, { quantity });
      return res.status(200).json(updatedCartItem);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete(`${apiRouter}/cart/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cartItemId = parseInt(id);
      
      if (isNaN(cartItemId)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const cartItem = await storage.getCartItem(cartItemId);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      await storage.deleteCartItem(cartItemId);
      return res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete(`${apiRouter}/cart/user/:userId`, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userIdNum = parseInt(userId);
      
      if (isNaN(userIdNum)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userIdNum);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.clearCart(userIdNum);
      return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order Routes
  app.get(`${apiRouter}/orders/:userId`, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userIdNum = parseInt(userId);
      
      if (isNaN(userIdNum)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userIdNum);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const orders = await storage.getOrders(userIdNum);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items
          };
        })
      );
      
      return res.status(200).json(ordersWithItems);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get(`${apiRouter}/orders/:userId/:orderId`, async (req: Request, res: Response) => {
    try {
      const { userId, orderId } = req.params;
      const userIdNum = parseInt(userId);
      const orderIdNum = parseInt(orderId);
      
      if (isNaN(userIdNum) || isNaN(orderIdNum)) {
        return res.status(400).json({ message: "Invalid user ID or order ID" });
      }
      
      const user = await storage.getUser(userIdNum);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const order = await storage.getOrder(orderIdNum);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      if (order.userId !== userIdNum) {
        return res.status(403).json({ message: "Unauthorized access to order" });
      }
      
      const orderItems = await storage.getOrderItems(orderIdNum);
      
      // Get product details for each order item
      const orderItemsWithDetails = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      return res.status(200).json({
        ...order,
        items: orderItemsWithDetails
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post(`${apiRouter}/orders`, async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(orderData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItems(orderData.userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Validate cart items and calculate total
      let total = 0;
      const validatedItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          
          if (product.stock < item.quantity) {
            throw new Error(`Not enough stock for ${product.name}`);
          }
          
          const price = product.salePrice || product.price;
          total += price * item.quantity;
          
          return {
            productId: item.productId,
            quantity: item.quantity,
            price,
            customizations: item.customizations
          };
        })
      );
      
      // Create order
      const newOrder = await storage.createOrder({
        ...orderData,
        total,
        status: "pending"
      });
      
      // Create order items
      const orderItems = await Promise.all(
        validatedItems.map(item => 
          storage.createOrderItem({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customizations: item.customizations
          })
        )
      );
      
      // Update product stock
      await Promise.all(
        validatedItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (product) {
            await storage.updateProduct(product.id, {
              stock: product.stock - item.quantity
            });
          }
        })
      );
      
      // Clear cart
      await storage.clearCart(orderData.userId);
      
      return res.status(201).json({
        ...newOrder,
        items: orderItems
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Setup HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
