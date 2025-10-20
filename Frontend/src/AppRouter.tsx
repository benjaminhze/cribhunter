import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import PropertyDetail from './pages/PropertyDetail';
import Profile from './pages/Profile';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Header from './components/Header';
// Protected route component
const ProtectedRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    isAuthenticated
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};
// Agent only route component
const AgentRoute = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    isAuthenticated,
    user
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (user?.userType !== 'agent') {
    return <Navigate to="/home" replace />;
  }
  return children;
};
export function AppRouter() {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return <BrowserRouter>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/home" replace /> : <Auth />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/home" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute>
              <Favorites />
            </ProtectedRoute>} />
        <Route path="/property/:id" element={<ProtectedRoute>
              <PropertyDetail />
            </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
        <Route path="/add-listing" element={<AgentRoute>
              <AddListing />
            </AgentRoute>} />
        <Route path="/edit-listing/:id" element={<AgentRoute>
              <EditListing />
            </AgentRoute>} />
      </Routes>
    </BrowserRouter>;
}