import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <CustomThemeProvider>
        {children}
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}
