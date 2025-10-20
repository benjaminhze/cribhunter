import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../data/propertyListings';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { HeartIcon, BedIcon, BathIcon, SquareIcon } from 'lucide-react';
interface PropertyCardProps {
  property: Property;
}
const PropertyCard: React.FC<PropertyCardProps> = ({
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
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 h-[420px] flex flex-col`}>
        <div className="relative h-56 flex-shrink-0">
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
          {user?.userType === 'hunter' && <div className="absolute top-3 right-3 p-2 bg-white rounded-full shadow cursor-pointer" onClick={handleFavoriteToggle}>
              <HeartIcon className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </div>}
          <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium">
            {property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className={`text-lg leading-6 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1 h-12 overflow-hidden`}>
            {property.title}
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm leading-5 h-5 overflow-hidden whitespace-nowrap text-ellipsis mb-2`}>
            {property.address}
          </p>
          <p className="text-blue-600 font-bold text-xl mb-3">
            {formatPrice(property.price, property.listingType)}
          </p>
          <div className={`flex justify-between ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            <div className="flex items-center">
              <BedIcon className="h-4 w-4 mr-1" />
              <span>
                {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
            </div>
            <div className="flex items-center">
              <BathIcon className="h-4 w-4 mr-1" />
              <span>
                {property.bathrooms}{' '}
                {property.bathrooms === 1 ? 'Bath' : 'Baths'}
              </span>
            </div>
            <div className="flex items-center">
              <SquareIcon className="h-4 w-4 mr-1" />
              <span>{property.size} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>;
};
export default PropertyCard;