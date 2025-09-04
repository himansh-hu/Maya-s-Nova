# 3D Print Wonders E-commerce Platform

## Overview

3D Print Wonders is a modern, full-stack e-commerce web application dedicated to selling next-generation 3D-printed gadgets, tech accessories, home decor, and collectibles. The platform emphasizes customization and interactivity, featuring 3D product visualization, real-time customization tools, and a sleek user experience designed for tech enthusiasts, hobbyists, and collectors.

The application provides a comprehensive shopping experience with features like interactive 3D product viewers, customization studios, user authentication, shopping cart management, and a responsive design optimized for all devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Tailwind CSS with ShadCN/UI components for consistent, modern design
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **State Management**: React Context API for global state (Auth, Cart, Currency, Theme)
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **3D Visualization**: Three.js integration for interactive 3D product viewers
- **Styling**: CSS custom properties for theming with dark/light mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with structured error handling and logging middleware
- **Development Setup**: Vite middleware integration for seamless dev experience

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema**: Comprehensive e-commerce schema including users, products, categories, cart items, orders, and reviews
- **Migrations**: Drizzle Kit for database schema migrations
- **Type Safety**: Shared schema definitions between frontend and backend using Drizzle Zod

### Authentication and Authorization
- **User Management**: Email/password authentication with user profiles
- **Session Handling**: Context-based authentication state management
- **Registration/Login**: Secure user registration and login flows
- **Protected Routes**: Authentication checks for user-specific features

### Key Design Patterns
- **Monorepo Structure**: Organized into `client/`, `server/`, and `shared/` directories
- **Shared Types**: Common schema and type definitions in `shared/` for consistency
- **Component Composition**: Reusable UI components with proper separation of concerns
- **Context Providers**: Global state management for auth, cart, currency, and theme
- **Custom Hooks**: Reusable hooks for data fetching and state management
- **Error Boundaries**: Comprehensive error handling throughout the application

### Development Features
- **Hot Reload**: Vite HMR for instant development feedback
- **Type Safety**: End-to-end TypeScript with strict mode enabled
- **Code Quality**: ESLint and Prettier integration
- **Path Aliases**: Clean import paths using TypeScript path mapping
- **Environment Config**: Environment-based configuration management

## External Dependencies

### Core Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Helmet for SEO
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Forms**: React Hook Form, Hookform Resolvers
- **Validation**: Zod for schema validation
- **State Management**: TanStack React Query
- **Routing**: Wouter for lightweight routing
- **3D Graphics**: Three.js (configured for future integration)
- **Utilities**: Class Variance Authority, clsx, date-fns

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full TypeScript setup with strict configuration
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Replit Integration**: Replit-specific plugins for development environment

### Third-Party Services
- **Database Hosting**: Neon (serverless PostgreSQL)
- **Development Environment**: Replit with custom configuration
- **CDN**: Configured for external asset delivery
- **Payment Processing**: Stripe integration (configured for future implementation)

The application is designed to be scalable and maintainable, with a clear separation between frontend and backend concerns, comprehensive type safety, and modern development practices throughout the stack.