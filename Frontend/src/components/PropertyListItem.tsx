import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../data/propertyListings';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { HeartIcon, BedIcon, BathIcon, SquareIcon } from 'lucide-react';
interface PropertyListItemProps {
  property: Property;
}
const PropertyListItem: React.FC<PropertyListItemProps> = ({
  property
}) => {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites
  } = useFavorites();
  const {
    theme
  } = useTheme();
  const {
    user
  } = useAuth();
  const favorite = isFavorite(property.id);
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(property.id);
    } else {
      addToFavorites(property.id);
    }
  };
  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `$${price.toLocaleString()} /month`;
    }
    return `$${price.toLocaleString()}`;
  };
  return <Link to={`/property/${property.id}`} className="block">
      <div className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-md overflow-hidden transition-all duration-300`}>
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <img src={property.images[0]} alt={property.title} className="w-full h-48 md:h-full object-cover" />
            {user?.userType === 'hunter' && <div className="absolute top-3 right-3 p-2 bg-white rounded-full shadow cursor-pointer" onClick={handleFavoriteToggle}>
                <HeartIcon className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </div>}
            <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
              {property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
            </div>
          </div>
          <div className="p-4 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1`}>
                  {property.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>
                  {property.address}
                </p>
              </div>
              <p className="text-blue-600 font-bold text-xl">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
              {property.description}
            </p>
            <div className="flex justify-between text-gray-600 text-sm">
              <div className="flex items-center">
                <BedIcon className={`h-4 w-4 mr-1 ${theme === 'dark' ? 'text-gray-400' : ''}`} />
                <span className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
              <div className="flex items-center">
                <BathIcon className={`h-4 w-4 mr-1 ${theme === 'dark' ? 'text-gray-400' : ''}`} />
                <span className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {property.bathrooms}{' '}
                  {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </div>
              <div className="flex items-center">
                <SquareIcon className={`h-4 w-4 mr-1 ${theme === 'dark' ? 'text-gray-400' : ''}`} />
                <span className={theme === 'dark' ? 'text-gray-300' : ''}>
                  {property.size} sqft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>;
};
export default PropertyListItem;