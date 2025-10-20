import React from 'react';
import { AppRouter } from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { PropertyProvider } from './context/PropertyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ScrollToTop from './components/ScrollToTop';

const AppRouterWrapper = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <AppRouter />
      <ScrollToTop />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <PropertyProvider>
            <AppRouterWrapper />
          </PropertyProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}