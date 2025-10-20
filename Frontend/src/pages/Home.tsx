import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyListItem from '../components/PropertyListItem';
import SearchFilters from '../components/SearchFilters';
import { useProperties } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { BuildingIcon, LayoutGridIcon, ListIcon } from 'lucide-react';
const Home: React.FC = () => {
  const {
    filteredProperties,
    sortOption,
    setSortOption
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
  return <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        Find Your Dream Home in Singapore
      </h1>
      <SearchFilters />
      {filteredProperties.length > 0 ? <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
              {filteredProperties.length}{' '}
              {filteredProperties.length === 1 ? 'Property' : 'Properties'}{' '}
              Found
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`} aria-label="Grid view">
                <LayoutGridIcon className="h-5 w-5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`} aria-label="List view">
                <ListIcon className="h-5 w-5" />
              </button>
              <select
                className={`ml-2 p-2 rounded-md border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                aria-label="Sort listings"
              >
                <option value="none">Sort: Default</option>
                <option value="price-asc">Price: Ascending</option>
                <option value="price-desc">Price: Descending</option>
                <option value="size-asc">Size: Ascending</option>
                <option value="size-desc">Size: Descending</option>
              </select>
            </div>
          </div>
          {viewMode === 'grid' ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)}
            </div> : <div className="space-y-4">
              {filteredProperties.map(property => <PropertyListItem key={property.id} property={property} />)}
            </div>}
        </div> : <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
          <BuildingIcon className={`mx-auto h-16 w-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
          <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            No properties found
          </h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            Try adjusting your filters to see more results.
          </p>
        </div>}
    </div>;
};
export default Home;