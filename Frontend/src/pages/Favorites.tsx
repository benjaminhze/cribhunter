import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import PropertyListItem from '../components/PropertyListItem';
import { useFavorites } from '../context/FavoritesContext';
import { useProperties } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { HeartIcon, HomeIcon, LayoutGridIcon, ListIcon } from 'lucide-react';
const Favorites: React.FC = () => {
  const {
    favorites
  } = useFavorites();
  const {
    properties
  } = useProperties();
  const {
    theme
  } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    // Get the saved view mode from localStorage or default to 'grid'
    const savedViewMode = localStorage.getItem('viewMode');
    return savedViewMode as 'grid' | 'list' || 'grid';
  });
  // Save the view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);
  const favoriteProperties = properties.filter(property => favorites.includes(property.id));
  return <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : ''}`}>
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-6`}>
        Your Favourite Properties
      </h1>
      {favoriteProperties.length > 0 ? <>
          <div className="flex justify-end mb-4">
            <div className="flex space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`} aria-label="Grid view">
                <LayoutGridIcon className="h-5 w-5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`} aria-label="List view">
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {viewMode === 'grid' ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map(property => <PropertyCard key={property.id} property={property} />)}
            </div> : <div className="space-y-4">
              {favoriteProperties.map(property => <PropertyListItem key={property.id} property={property} />)}
            </div>}
        </> : <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <HeartIcon className={`mx-auto h-16 w-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
          <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            No favourites yet
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
            Start adding properties to your favourites by clicking the heart
            icon.
          </p>
          <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <HomeIcon className="mr-2 h-5 w-5" />
            Browse Properties
          </Link>
        </div>}
    </div>;
};
export default Favorites;