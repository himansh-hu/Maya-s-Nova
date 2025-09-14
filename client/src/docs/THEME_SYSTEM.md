# Theme System Documentation

## Overview

This project uses a custom theme system built specifically for Vite + React, replacing the Next.js-only `next-themes` library. The system provides:

- **Light/Dark mode toggle** with system preference detection
- **TailwindCSS class strategy** for optimal performance
- **localStorage persistence** for consistent theme across sessions
- **System theme detection** that automatically follows OS preferences
- **TypeScript support** with full type safety

## Features

### Theme Modes
- **Light**: Always use light theme
- **Dark**: Always use dark theme  
- **System**: Follow OS preference (default)

### Theme Toggle Behavior
The theme toggle cycles through: Dark → Light → System → Dark...

## Usage

### Basic Theme Toggle
```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Simple icon button
<ThemeToggle />

// With label
<ThemeToggle showLabel={true} />

// Custom styling
<ThemeToggle 
  variant="outline" 
  size="lg" 
  className="w-full justify-between" 
/>
```

### Using Theme Context
```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  // theme: 'dark' | 'light' | 'system' (user's choice)
  // resolvedTheme: 'dark' | 'light' (actual theme being applied)
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Implementation Details

### ThemeProvider
Located in `client/src/context/ThemeContext.tsx`, this provides:
- Theme state management
- localStorage persistence
- System theme detection
- Automatic class management on document root

### TailwindCSS Integration
The system uses Tailwind's `darkMode: ["class"]` strategy:
- Adds/removes `dark` class on `<html>` element
- All dark mode styles use `dark:` prefix
- No flash of wrong theme on page load

### Theme Toggle Component
Located in `client/src/components/ui/theme-toggle.tsx`, provides:
- Consistent theme toggle UI
- Proper accessibility labels
- Icon changes based on current theme
- Support for different variants and sizes

## Migration from next-themes

The migration was seamless because:
1. The existing ThemeContext was already well-implemented
2. Only removed the unnecessary next-themes wrapper
3. Enhanced with system theme detection
4. Added reusable ThemeToggle component

## Browser Support

- **localStorage**: All modern browsers
- **System theme detection**: All modern browsers via `prefers-color-scheme`
- **Class manipulation**: All browsers supporting ES6+

## Performance

- **Zero runtime dependencies** (removed next-themes)
- **Minimal bundle size** impact
- **No hydration issues** (Vite + React compatible)
- **Instant theme switching** with CSS classes
