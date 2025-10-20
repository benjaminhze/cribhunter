import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Map from '../components/Map';
import { HeartIcon, ArrowLeftIcon, BedIcon, BathIcon, SquareIcon, HomeIcon, PhoneIcon, MailIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon } from 'lucide-react';
const PropertyDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    getPropertyById,
    canEditProperty,
    canDeleteProperty
  } = useProperties();
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const property = getPropertyById(id || '');
  useEffect(() => {
    if (!property) {
      navigate('/');
    }
  }, [property, navigate]);
  if (!property) {
    return null;
  }
  const favorite = isFavorite(property.id);
  const isOwner = user?.userType === 'agent' && canEditProperty(property.id);
  const handleFavoriteToggle = () => {
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
  const nextImage = () => {
    setCurrentImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1);
  };
  const prevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1);
  };
  return <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : ''}`}>
      <button onClick={() => navigate('/')} className={`flex items-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-6 hover:text-blue-800`}>
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to listings
      </button>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        {/* Property Image Gallery */}
        <div className="relative h-96">
          <img src={property.images[currentImageIndex]} alt={property.title} className="w-full h-full object-cover" />
          {property.images.length > 1 && <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white">
                <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white">
                <ChevronRightIcon className="h-6 w-6 text-gray-800" />
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {property.images.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />)}
              </div>
            </>}
          <div className="absolute top-4 right-4 flex space-x-2">
            {user?.userType === 'hunter' && <button onClick={handleFavoriteToggle} className="flex items-center bg-white px-4 py-2 rounded-full shadow-md hover:bg-gray-100">
                <HeartIcon className={`h-5 w-5 mr-2 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                <span>{favorite ? 'Saved' : 'Save'}</span>
              </button>}
            {isOwner && <Link to={`/edit-listing/${property.id}`} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700">
                <EditIcon className="h-5 w-5 mr-2" />
                <span>Edit</span>
              </Link>}
          </div>
          <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-4 py-2 text-sm font-medium">
            {property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
                {property.title}
              </h1>
              <p className={theme === 'dark' ? 'text-gray-300 mb-2' : 'text-gray-600 mb-2'}>
                {property.address}
              </p>
              <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <HomeIcon className="h-4 w-4 mr-1" />
                <span className="capitalize">{property.propertyType}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>
          </div>
          <div className={`flex flex-wrap justify-between mb-8 p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
            <div className="flex items-center px-4 py-2">
              <BedIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
              <div>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                  {property.bedrooms}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Bedrooms
                </p>
              </div>
            </div>
            <div className="flex items-center px-4 py-2">
              <BathIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
              <div>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                  {property.bathrooms}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Bathrooms
                </p>
              </div>
            </div>
            <div className="flex items-center px-4 py-2">
              <SquareIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
              <div>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                  {property.size}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Sq. Ft.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-3`}>
              Description
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {property.description}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-3`}>
                Features
              </h2>
              <ul className="grid grid-cols-1 gap-2">
                {property.features.map((feature, index) => <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>)}
              </ul>
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-3`}>
                Amenities
              </h2>
              <ul className="grid grid-cols-1 gap-2">
                {property.amenities.map((amenity, index) => <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {amenity}
                    </span>
                  </li>)}
              </ul>
            </div>
          </div>
          <div className="mb-8">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-3`}>
              Location
            </h2>
            <div className="h-80 rounded-lg overflow-hidden">
              <Map lat={property.coordinates.lat} lng={property.coordinates.lng} address={property.address} />
            </div>
          </div>
          <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-8`}>
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>
              Contact Agent
            </h2>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
                {property.contactName}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <PhoneIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`} />
                  <a href={`tel:${property.contactPhone}`} className="text-blue-600 hover:underline">
                    {property.contactPhone}
                  </a>
                </div>
                <div className="flex items-center">
                  <MailIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`} />
                  <a href={`mailto:${property.contactEmail}`} className="text-blue-600 hover:underline">
                    {property.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PropertyDetail;