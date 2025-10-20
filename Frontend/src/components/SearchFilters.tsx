import React, { useEffect, useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { propertyTypes, listingTypes } from '../data/propertyListings';
import { SearchIcon, SlidersIcon, XIcon } from 'lucide-react';
// Singapore MRT stations list
const singaporeLocations = ['Admiralty', 'Aljunied', 'Ang Mo Kio', 'Bartley', 'Bayfront', 'Beauty World', 'Bedok', 'Bedok North', 'Bedok Reservoir', 'Bencoolen', 'Bendemeer', 'Bishan', 'Boon Keng', 'Boon Lay', 'Botanic Gardens', 'Braddell', 'Bras Basah', 'Buangkok', 'Bugis', 'Bukit Batok', 'Bukit Gombak', 'Bukit Panjang', 'Buona Vista', 'Caldecott', 'Canberra', 'Cashew', 'Changi Airport', 'Chinatown', 'Chinese Garden', 'Choa Chu Kang', 'City Hall', 'Clarke Quay', 'Clementi', 'Commonwealth', 'Dakota', 'Dhoby Ghaut', 'Dover', 'Downtown', 'Esplanade', 'Eunos', 'Expo', 'Farrer Park', 'Farrer Road', 'Fort Canning', 'Geylang Bahru', 'Gul Circle', 'HarbourFront', 'Haw Par Villa', 'Hillview', 'Holland Village', 'Hougang', 'Jalan Besar', 'Joo Koon', 'Jurong East', 'Kaki Bukit', 'Kallang', 'Kembangan', 'Kent Ridge', 'Khatib', 'King Albert Park', 'Kovan', 'Kranji', 'Labrador Park', 'Lakeside', 'Lavender', 'Little India', 'Lorong Chuan', 'MacPherson', 'Marina Bay', 'Marina South Pier', 'Marsiling', 'Marymount', 'Mattar', 'Maxwell', 'Mayflower', 'Newton', 'Nicoll Highway', 'Novena', 'Orchard', 'Outram Park', 'Pasir Panjang', 'Pasir Ris', 'Paya Lebar', 'Pioneer', 'Potong Pasir', 'Promenade', 'Punggol', 'Queenstown', 'Raffles Place', 'Redhill', 'Rochor', 'Sembawang', 'Sengkang', 'Serangoon', 'Simei', 'Sixth Avenue', 'Somerset', 'Stadium', 'Stevens', 'Tai Seng', 'Tampines', 'Tampines East', 'Tampines West', 'Tan Kah Kee', 'Tanah Merah', 'Tanjong Pagar', 'Telok Ayer', 'Telok Blangah', 'Tiong Bahru', 'Toa Payoh', 'Tuas Crescent', 'Tuas Link', 'Tuas West Road', 'Upper Changi', 'Upper Thomson', 'Woodlands', 'Woodleigh', 'Yew Tee', 'Yio Chu Kang', 'Yishun'];
const SearchFilters: React.FC = () => {
  const {
    filterOptions,
    updateFilterOptions,
    resetFilters
  } = useProperties();
  const {
    theme
  } = useTheme();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filterOptions.searchTerm);
  // Update searchTerm when filterOptions.searchTerm changes (e.g., after reset)
  useEffect(() => {
    setSearchTerm(filterOptions.searchTerm);
  }, [filterOptions.searchTerm]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilterOptions({
      searchTerm
    });
  };
  const handleListingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilterOptions({
      listingType: e.target.value
    });
  };
  const handlePropertyTypeChange = (type: string) => {
    const currentTypes = [...filterOptions.propertyType];
    const index = currentTypes.indexOf(type);
    if (index === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(index, 1);
    }
    updateFilterOptions({
      propertyType: currentTypes
    });
  };
  const handleLocationChange = (location: string) => {
    const currentLocations = [...filterOptions.locations];
    const index = currentLocations.indexOf(location);
    if (index === -1) {
      currentLocations.push(location);
    } else {
      currentLocations.splice(index, 1);
    }
    updateFilterOptions({
      locations: currentLocations
    });
  };
  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    updateFilterOptions({
      bedrooms: value
    });
  };
  const handleBathroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    updateFilterOptions({
      bathrooms: value
    });
  };
  const handlePriceChange = (type: 'min' | 'max', e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value);
    if (type === 'min') {
      updateFilterOptions({
        minPrice: value
      });
    } else {
      updateFilterOptions({
        maxPrice: value
      });
    }
  };
  const handleResetFilters = () => {
    resetFilters();
    setSearchTerm('');
  };
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  return <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-4 mb-6`}>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex">
          <div className="relative flex-grow">
            <input type="text" placeholder="Search by location, property name, or keyword" className={`w-full px-4 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Search
          </button>
        </div>
      </form>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex space-x-2">
          <button onClick={handleResetFilters} className="text-blue-600 text-sm font-medium hover:text-blue-800">
            Reset All
          </button>
          <button onClick={toggleFilters} className="flex items-center text-gray-600">
            {filtersOpen ? <XIcon className={`h-5 w-5 mr-1 ${theme === 'dark' ? 'text-gray-300' : ''}`} /> : <SlidersIcon className={`h-5 w-5 mr-1 ${theme === 'dark' ? 'text-gray-300' : ''}`} />}
            <span className={theme === 'dark' ? 'text-gray-300' : ''}>
              {filtersOpen ? 'Hide Filters' : 'Show Filters'}
            </span>
          </button>
        </div>
      </div>
      {filtersOpen && <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Listing Type
            </label>
            <select className={`w-full p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`} value={filterOptions.listingType} onChange={handleListingTypeChange}>
              {listingTypes.map(type => <option key={type.value} value={type.value}>
                  {type.label}
                </option>)}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map(type => <label key={type.value} className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" checked={filterOptions.propertyType.includes(type.value)} onChange={() => handlePropertyTypeChange(type.value)} />
                  <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                </label>)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Bedrooms
              </label>
              <select className={`w-full p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`} value={filterOptions.bedrooms === null ? '' : filterOptions.bedrooms} onChange={handleBedroomsChange}>
                <option value="">Any</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Bathrooms
              </label>
              <select className={`w-full p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`} value={filterOptions.bathrooms === null ? '' : filterOptions.bathrooms} onChange={handleBathroomsChange}>
                <option value="">Any</option>
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4 Bathrooms</option>
                <option value="5">5+ Bathrooms</option>
              </select>
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Location
            </label>
            <div className="max-h-48 overflow-y-auto p-2 border rounded-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {singaporeLocations.map(location => <label key={location} className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" checked={filterOptions.locations.includes(location)} onChange={() => handleLocationChange(location)} />
                  <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {location}
                  </span>
                </label>)}
            </div>
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input type="number" placeholder="Min Price" className={`w-full p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`} value={filterOptions.minPrice || ''} onChange={e => handlePriceChange('min', e)} />
              </div>
              <div>
                <input type="number" placeholder="Max Price" className={`w-full p-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`} value={filterOptions.maxPrice || ''} onChange={e => handlePriceChange('max', e)} />
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default SearchFilters;