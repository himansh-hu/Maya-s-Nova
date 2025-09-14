import { ReactNode } from 'react';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <CustomThemeProvider>
      {children}
    </CustomThemeProvider>
  );
}
