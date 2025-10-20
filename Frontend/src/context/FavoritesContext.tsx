import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Property } from '../data/propertyListings';
interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (propertyId: string) => void;
  removeFromFavorites: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
export const FavoritesProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    user
  } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites-${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);
  const addToFavorites = (propertyId: string) => {
    if (!favorites.includes(propertyId)) {
      setFavorites([...favorites, propertyId]);
    }
  };
  const removeFromFavorites = (propertyId: string) => {
    setFavorites(favorites.filter(id => id !== propertyId));
  };
  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };
  return <FavoritesContext.Provider value={{
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }}>
      {children}
    </FavoritesContext.Provider>;
};