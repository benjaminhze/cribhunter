import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProperties } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { UserIcon, PlusCircleIcon, HomeIcon } from 'lucide-react';
const Profile: React.FC = () => {
  const {
    user,
    logout
  } = useAuth();
  const {
    favorites
  } = useFavorites();
  const {
    getUserProperties
  } = useProperties();
  const {
    theme
  } = useTheme();
  if (!user) return null;
  const userProperties = getUserProperties();
  return <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : ''}`}>
      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-6`}>
        Your Profile
      </h1>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-4 rounded-full mr-4`}>
              <UserIcon className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {user.name}
              </h2>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {user.email}
              </p>
              {user.userType === 'agent' && (
                <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 items-baseline">
                    {user.phone && <p>Phone Number: {user.phone}</p>}
                    {user.agentLicense && <p>Registration Number: {user.agentLicense}</p>}
                  </div>
                </div>
              )}
              <p className={`mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                {user.userType === 'hunter' ? 'Property Hunter' : 'Real Estate Agent'}
              </p>
            </div>
          </div>
          <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>
              Account Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.userType === 'hunter' ? <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Saved Properties
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {favorites.length}
                  </p>
                </div> : <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your Listings
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {userProperties.length}
                  </p>
                </div>}
              <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Member Since
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
                </p>
              </div>
            </div>
          </div>
          {user.userType === 'agent' && <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pt-6 mt-6`}>
              <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4`}>
                Your Listings
              </h3>
              {userProperties.length > 0 ? <div className="space-y-4">
                  {userProperties.map(property => <div key={property.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg flex justify-between items-center`}>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {property.title}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {property.listingType === 'rent' ? `For Rent: $${property.price}/month` : `For Sale: $${property.price}`}
                        </p>
                      </div>
                      <Link to={`/edit-listing/${property.id}`} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </Link>
                    </div>)}
                </div> : <div className={`text-center py-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <HomeIcon className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-3`} />
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    You haven't created any property listings yet.
                  </p>
                  <Link to="/add-listing" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Your First Listing
                  </Link>
                </div>}
            </div>}
          <div className="mt-8">
            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Profile;