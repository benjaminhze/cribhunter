import React, { useEffect, useState, createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { properties as defaultProperties, Property } from '../data/propertyListings';
import PropertyService from '../services/propertyService';

interface FilterOptions {
  listingType: string;
  propertyType: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  locations: string[];
  minPrice: number | null;
  maxPrice: number | null;
  searchTerm: string;
}

type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'size-asc'
  | 'size-desc'
  | 'none';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  filterOptions: FilterOptions;
  updateFilterOptions: (options: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  getPropertyById: (id: string) => Property | undefined;
  addProperty: (property: Omit<Property, 'id' | 'ownerId'>) => Promise<string>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<boolean>;
  getUserProperties: () => Property[];
  canEditProperty: (propertyId: string) => boolean;
  canDeleteProperty: (propertyId: string) => boolean;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  loading: boolean;
  error: string | null;
  refreshProperties: () => Promise<void>;
}

const initialFilterOptions: FilterOptions = {
  listingType: 'all',
  propertyType: [],
  bedrooms: null,
  bathrooms: null,
  locations: [],
  minPrice: null,
  maxPrice: null,
  searchTerm: '',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(initialFilterOptions);
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load properties from database on initial load
  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load default properties (for demo purposes)
      const defaultProps = defaultProperties;
      console.log('PropertyContext: Loaded default properties:', defaultProps.length);
      
      // Load properties from database
      const dbProperties = await PropertyService.getAllProperties();
      console.log('PropertyContext: Loaded database properties:', dbProperties.length);
      
      // Combine default and database properties
      const allProperties = [...defaultProps, ...dbProperties];
      console.log('PropertyContext: Total properties loaded:', allProperties.length);
      setProperties(allProperties);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
      // Fallback to default properties only
      setProperties(defaultProperties);
    } finally {
      setLoading(false);
    }
  };

  // Load properties on mount
  useEffect(() => {
    loadProperties();
  }, []);

  // Refresh properties function
  const refreshProperties = async () => {
    await loadProperties();
  };

  const updateFilterOptions = (options: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...options,
    }));
  };

  const resetFilters = () => {
    setFilterOptions(initialFilterOptions);
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
  };

  // Add a new property (for agents) - now uses database
  const addProperty = async (propertyData: Omit<Property, 'id' | 'ownerId'>): Promise<string> => {
    if (!user) {
      throw new Error('User must be logged in to create properties');
    }

    setLoading(true);
    setError(null);

    try {
      const newProperty = await PropertyService.createProperty({
        ...propertyData,
        ownerId: user.id,
      });

      // Update local state
      setProperties(prev => [newProperty, ...prev]);
      
      return newProperty.id;
    } catch (err) {
      console.error('Error creating property:', err);
      setError('Failed to create property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a property (for agents) - now uses database
  const updateProperty = async (id: string, updates: Partial<Property>): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be logged in to update properties');
    }

    const property = properties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Check if user owns this property
    if (property.ownerId && property.ownerId !== user.id) {
      throw new Error('You can only update your own properties');
    }

    // For legacy properties without ownerId, allow updating if it's a custom property
    if (!property.ownerId && !id.startsWith('custom-')) {
      throw new Error('Cannot update default properties');
    }

    setLoading(true);
    setError(null);

    try {
      // If it's a database property, update in database
      if (!id.startsWith('custom-')) {
        const updatedProperty = await PropertyService.updateProperty(id, updates);
        if (updatedProperty) {
          setProperties(prev => 
            prev.map(p => p.id === id ? updatedProperty : p)
          );
        }
      } else {
        // For legacy custom properties, update locally
        const updatedProperties = properties.map(p => 
          p.id === id ? { ...p, ...updates } : p
        );
        setProperties(updatedProperties);
        
        // Save to localStorage for legacy support
        const customProperties = updatedProperties.filter(p => p.id.startsWith('custom-'));
        localStorage.setItem('properties', JSON.stringify(customProperties));
      }

      return true;
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a property (for agents) - now uses database
  const deleteProperty = async (id: string): Promise<boolean> => {
    if (!user) {
      throw new Error('User must be logged in to delete properties');
    }

    const property = properties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Check if user owns this property
    if (property.ownerId && property.ownerId !== user.id) {
      throw new Error('You can only delete your own properties');
    }

    // For legacy properties without ownerId, allow deletion if it's a custom property
    if (!property.ownerId && !id.startsWith('custom-')) {
      throw new Error('Cannot delete default properties');
    }

    setLoading(true);
    setError(null);

    try {
      // If it's a database property, delete from database
      if (!id.startsWith('custom-')) {
        await PropertyService.deleteProperty(id);
      }

      // Remove from local state
      setProperties(prev => prev.filter(p => p.id !== id));

      // For legacy custom properties, also remove from localStorage
      if (id.startsWith('custom-')) {
        const storedProperties = localStorage.getItem('properties');
        if (storedProperties) {
          const customProperties = JSON.parse(storedProperties);
          const updatedCustomProperties = customProperties.filter((p: Property) => p.id !== id);
          localStorage.setItem('properties', JSON.stringify(updatedCustomProperties));
        }
      }

      return true;
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get properties created by the current user
  const getUserProperties = () => {
    if (!user) return [];
    return properties.filter(p => p.ownerId === user.id);
  };

  // Check if current user can edit a property
  const canEditProperty = (propertyId: string) => {
    console.log('canEditProperty: Checking property ID:', propertyId);
    console.log('canEditProperty: Current user:', user);
    console.log('canEditProperty: Total properties:', properties.length);
    
    if (!user) {
      console.log('canEditProperty: No user logged in');
      return false;
    }
    
    const property = properties.find(p => p.id === propertyId);
    console.log('canEditProperty: Found property:', property);
    
    if (!property) {
      console.log('canEditProperty: Property not found');
      return false;
    }
    
    // For properties with ownerId, check ownership
    if (property.ownerId) {
      const canEdit = property.ownerId === user.id;
      console.log('canEditProperty: Database property - ownerId:', property.ownerId, 'user.id:', user.id, 'canEdit:', canEdit);
      return canEdit;
    }
    
    // For legacy properties without ownerId, allow editing if it's a custom property
    const canEdit = propertyId.startsWith('custom-');
    console.log('canEditProperty: Legacy property - starts with custom-:', canEdit);
    return canEdit;
  };

  // Check if current user can delete a property
  const canDeleteProperty = (propertyId: string) => {
    if (!user) return false;
    const property = properties.find(p => p.id === propertyId);
    if (!property) return false;
    
    // For properties with ownerId, check ownership
    if (property.ownerId) {
      return property.ownerId === user.id;
    }
    
    // For legacy properties without ownerId, allow deletion if it's a custom property
    return propertyId.startsWith('custom-');
  };

  // Apply filters to properties
  const filteredProperties = useMemo(() => {
    let currentProperties = properties.filter(property => {
      // Filter by listing type
      if (filterOptions.listingType !== 'all' && property.listingType !== filterOptions.listingType) {
        return false;
      }

      // Filter by property type
      if (filterOptions.propertyType.length > 0 && !filterOptions.propertyType.includes(property.propertyType)) {
        return false;
      }

      // Filter by bedrooms
      if (filterOptions.bedrooms !== null && property.bedrooms < filterOptions.bedrooms) {
        return false;
      }

      // Filter by bathrooms
      if (filterOptions.bathrooms !== null && property.bathrooms < filterOptions.bathrooms) {
        return false;
      }

      // Filter by location
      if (filterOptions.locations.length > 0 && !filterOptions.locations.includes(property.location)) {
        return false;
      }

      // Filter by price range
      if (filterOptions.minPrice !== null && property.price < filterOptions.minPrice) {
        return false;
      }
      if (filterOptions.maxPrice !== null && property.price > filterOptions.maxPrice) {
        return false;
      }

      // Filter by search term
      if (filterOptions.searchTerm) {
        const searchLower = filterOptions.searchTerm.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(searchLower);
        const matchesDescription = property.description.toLowerCase().includes(searchLower);
        const matchesAddress = property.address.toLowerCase().includes(searchLower);
        const matchesLocation = property.location.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesAddress && !matchesLocation) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        currentProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        currentProperties.sort((a, b) => b.price - a.price);
        break;
      case 'size-asc':
        currentProperties.sort((a, b) => a.size - b.size);
        break;
      case 'size-desc':
        currentProperties.sort((a, b) => b.size - a.size);
        break;
      case 'none':
      default:
        // No specific sorting, maintain original order
        break;
    }

    return currentProperties;
  }, [properties, filterOptions, sortOption]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        filterOptions,
        updateFilterOptions,
        resetFilters,
        getPropertyById,
        addProperty,
        updateProperty,
        deleteProperty,
        getUserProperties,
        canEditProperty,
        canDeleteProperty,
        sortOption,
        setSortOption,
        loading,
        error,
        refreshProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};