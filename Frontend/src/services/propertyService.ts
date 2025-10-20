/**
 * Property Service - Handles all property-related database operations
 * This service provides a clean interface for CRUD operations on properties
 */

import { createClient } from '@supabase/supabase-js';
import { Property } from '../data/propertyListings';

// Supabase configuration
const supabaseUrl = 'https://fqjuaftiullmryhpnvgt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxanVhZnRpdWxsbXJ5aHBudmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTIxMDksImV4cCI6MjA3NjQ2ODEwOX0.I2BELQBxwhb6-6PS_580t0uInmRmPE7BkP5aSvE56X4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for property data from database
interface PropertyFromDB {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  price: number;
  listing_type: 'rent' | 'sale';
  property_type: 'hdb' | 'condo' | 'landed';
  bedrooms: number;
  bathrooms: number;
  size: number;
  location: string;
  address: string;
  images: string[];
  features: string[];
  amenities: string[];
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Convert database property to frontend Property interface
const convertDbPropertyToProperty = (dbProperty: PropertyFromDB): Property => {
  return {
    id: dbProperty.id,
    title: dbProperty.title,
    description: dbProperty.description,
    price: dbProperty.price,
    listingType: dbProperty.listing_type,
    propertyType: dbProperty.property_type,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    size: dbProperty.size,
    location: dbProperty.location,
    address: dbProperty.address,
    images: dbProperty.images || [],
    features: dbProperty.features || [],
    amenities: dbProperty.amenities || [],
    contactName: dbProperty.contact_name,
    contactPhone: dbProperty.contact_phone,
    contactEmail: dbProperty.contact_email,
    ownerId: dbProperty.owner_id,
    coordinates: {
      lat: dbProperty.lat || 1.3521, // Default Singapore coordinates
      lng: dbProperty.lng || 103.8198
    }
  };
};

// Convert frontend Property to database format
const convertPropertyToDb = (property: Omit<Property, 'id'> & { ownerId: string }) => {
  return {
    owner_id: property.ownerId,
    title: property.title,
    description: property.description,
    price: property.price,
    listing_type: property.listingType,
    property_type: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    location: property.location,
    address: property.address,
    images: property.images || [],
    features: property.features || [],
    amenities: property.amenities || [],
    contact_name: property.contactName,
    contact_phone: property.contactPhone,
    contact_email: property.contactEmail,
    lat: property.coordinates?.lat || null,
    lng: property.coordinates?.lng || null,
    is_active: true
  };
};

export class PropertyService {
  /**
   * Get all active properties
   */
  static async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data ? data.map(convertDbPropertyToProperty) : [];
    } catch (error) {
      console.error('Error in getAllProperties:', error);
      throw error;
    }
  }

  /**
   * Get properties by owner ID
   */
  static async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties by owner:', error);
        throw error;
      }

      return data ? data.map(convertDbPropertyToProperty) : [];
    } catch (error) {
      console.error('Error in getPropertiesByOwner:', error);
      throw error;
    }
  }

  /**
   * Get a single property by ID
   */
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Property not found
        }
        console.error('Error fetching property by ID:', error);
        throw error;
      }

      return data ? convertDbPropertyToProperty(data) : null;
    } catch (error) {
      console.error('Error in getPropertyById:', error);
      throw error;
    }
  }

  /**
   * Create a new property
   */
  static async createProperty(property: Omit<Property, 'id'> & { ownerId: string }): Promise<Property> {
    try {
      const propertyData = convertPropertyToDb(property);

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        throw error;
      }

      return convertDbPropertyToProperty(data);
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  /**
   * Update an existing property
   */
  static async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    try {
      // Convert updates to database format
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.price) dbUpdates.price = updates.price;
      if (updates.listingType) dbUpdates.listing_type = updates.listingType;
      if (updates.propertyType) dbUpdates.property_type = updates.propertyType;
      if (updates.bedrooms) dbUpdates.bedrooms = updates.bedrooms;
      if (updates.bathrooms) dbUpdates.bathrooms = updates.bathrooms;
      if (updates.size) dbUpdates.size = updates.size;
      if (updates.location) dbUpdates.location = updates.location;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.images) dbUpdates.images = updates.images;
      if (updates.features) dbUpdates.features = updates.features;
      if (updates.amenities) dbUpdates.amenities = updates.amenities;
      if (updates.contactName) dbUpdates.contact_name = updates.contactName;
      if (updates.contactPhone) dbUpdates.contact_phone = updates.contactPhone;
      if (updates.contactEmail) dbUpdates.contact_email = updates.contactEmail;
      if (updates.coordinates) {
        dbUpdates.lat = updates.coordinates.lat;
        dbUpdates.lng = updates.coordinates.lng;
      }

      const { data, error } = await supabase
        .from('properties')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating property:', error);
        throw error;
      }

      return data ? convertDbPropertyToProperty(data) : null;
    } catch (error) {
      console.error('Error in updateProperty:', error);
      throw error;
    }
  }

  /**
   * Delete a property (soft delete by setting is_active to false)
   */
  static async deleteProperty(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting property:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      throw error;
    }
  }

  /**
   * Permanently delete a property (hard delete)
   */
  static async permanentlyDeleteProperty(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error permanently deleting property:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in permanentlyDeleteProperty:', error);
      throw error;
    }
  }

  /**
   * Search properties with filters
   */
  static async searchProperties(filters: {
    search?: string;
    listingType?: 'rent' | 'sale';
    propertyType?: 'hdb' | 'condo' | 'landed';
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minSize?: number;
    maxSize?: number;
    location?: string;
  }): Promise<Property[]> {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
      }

      if (filters.listingType) {
        query = query.eq('listing_type', filters.listingType);
      }

      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.minBedrooms !== undefined) {
        query = query.gte('bedrooms', filters.minBedrooms);
      }

      if (filters.maxBedrooms !== undefined) {
        query = query.lte('bedrooms', filters.maxBedrooms);
      }

      if (filters.minBathrooms !== undefined) {
        query = query.gte('bathrooms', filters.minBathrooms);
      }

      if (filters.maxBathrooms !== undefined) {
        query = query.lte('bathrooms', filters.maxBathrooms);
      }

      if (filters.minSize !== undefined) {
        query = query.gte('size', filters.minSize);
      }

      if (filters.maxSize !== undefined) {
        query = query.lte('size', filters.maxSize);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching properties:', error);
        throw error;
      }

      return data ? data.map(convertDbPropertyToProperty) : [];
    } catch (error) {
      console.error('Error in searchProperties:', error);
      throw error;
    }
  }
}

export default PropertyService;
