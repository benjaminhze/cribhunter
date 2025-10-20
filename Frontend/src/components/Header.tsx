import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HomeIcon, HeartIcon, UserIcon, LogOutIcon, SunIcon, MoonIcon, PlusCircleIcon } from 'lucide-react';
const Header = () => {
  const {
    user,
    logout
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  return <header className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md py-4 px-6 sticky top-0 z-[9999]`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-blue-600">Crib</span>
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
            Hunter
          </span>
        </Link>
        {user && <div className="flex items-center space-x-6">
            <Link to="/" className={`flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
              <HomeIcon className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            {user.userType === 'hunter' && <Link to="/favourites" className={`flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
                <HeartIcon className="h-5 w-5 mr-1" />
                <span>Favourites</span>
              </Link>}
            {user.userType === 'agent' && <Link to="/add-listing" className={`flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
                <PlusCircleIcon className="h-5 w-5 mr-1" />
                <span>Add Listing</span>
              </Link>}
            <Link to="/profile" className={`flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`}>
              <UserIcon className="h-5 w-5 mr-1" />
              <span>Profile</span>
            </Link>
            <button onClick={toggleTheme} className={`flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-blue-600'}`} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button onClick={handleLogout} className={`flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'}`}>
              <LogOutIcon className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div>}
      </div>
    </header>;
};
export default Header;