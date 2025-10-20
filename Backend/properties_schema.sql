-- Create properties table for storing property listings
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('rent', 'sale')),
    property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('hdb', 'condo', 'landed')),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
    size DECIMAL(10, 2) NOT NULL CHECK (size > 0),
    location VARCHAR(100) NOT NULL,
    address VARCHAR(500) NOT NULL,
    images TEXT[] DEFAULT '{}', -- Array of image URLs
    features TEXT[] DEFAULT '{}', -- Array of features
    amenities TEXT[] DEFAULT '{}', -- Array of amenities
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(8) NOT NULL CHECK (contact_phone ~ '^[0-9]{8}$'),
    contact_email VARCHAR(255) NOT NULL,
    lat DECIMAL(10, 7), -- Latitude coordinate
    lng DECIMAL(10, 7), -- Longitude coordinate
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow everyone to read active properties
CREATE POLICY "Public properties are viewable by everyone" 
    ON properties FOR SELECT 
    USING (is_active = true);

-- Allow agents to create properties
CREATE POLICY "Agents can create properties" 
    ON properties FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = properties.owner_id 
            AND users.user_type = 'agent'
        )
    );

-- Allow property owners to update their own properties
CREATE POLICY "Property owners can update their own properties" 
    ON properties FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = properties.owner_id 
            AND users.id = auth.uid()
        )
    );

-- Allow property owners to delete their own properties
CREATE POLICY "Property owners can delete their own properties" 
    ON properties FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = properties.owner_id 
            AND users.id = auth.uid()
        )
    );

-- Allow property owners to view their own properties (including inactive ones)
CREATE POLICY "Property owners can view their own properties" 
    ON properties FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = properties.owner_id 
            AND users.id = auth.uid()
        )
    );
