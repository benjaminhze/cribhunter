export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: 'rent' | 'sale';
  propertyType: 'hdb' | 'condo' | 'landed';
  bedrooms: number;
  bathrooms: number;
  size: number; // in square feet
  location: string;
  address: string;
  images: string[];
  features: string[];
  amenities: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  ownerId: string; // ID of the agent who created this listing
  coordinates: {
    lat: number;
    lng: number;
  };
}
export const properties: Property[] = [{
  id: '1',
  title: 'Modern 3-Bedroom HDB in Punggol',
  description: 'Beautifully renovated 3-bedroom HDB flat with modern finishes. Bright and airy living spaces with a functional layout. Close to Punggol MRT station and Waterway Point mall.',
  price: 550000,
  listingType: 'sale',
  propertyType: 'hdb',
  bedrooms: 3,
  bathrooms: 2,
  size: 1100,
  location: 'Punggol',
  address: '123 Punggol Field, #12-34, Singapore 820123',
  images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
  features: ['Renovated in 2021', 'Smart home features', 'Built-in wardrobes', 'Kitchen island'],
  amenities: ['Playground', 'Covered parking', 'BBQ pits', 'Basketball court'],
  contactName: 'John Tan',
  contactPhone: '9123 4567',
  contactEmail: 'john.tan@example.com',
  ownerId: 'agent-1', // Mock agent ID
  coordinates: {
    lat: 1.4043,
    lng: 103.9092
  }
}, {
  id: '2',
  title: 'Luxurious Condo with City View',
  description: 'Stunning high-floor condo with panoramic city views. This 2-bedroom unit features premium finishes, a spacious balcony, and resort-style facilities. Walking distance to Orchard MRT.',
  price: 2800,
  listingType: 'rent',
  propertyType: 'condo',
  bedrooms: 2,
  bathrooms: 2,
  size: 950,
  location: 'Orchard',
  address: '456 Orchard Road, #18-05, Singapore 238877',
  images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
  features: ['Marble flooring', 'Floor-to-ceiling windows', 'Fully furnished', 'Smart home system'],
  amenities: ['Infinity pool', 'Gym', 'Tennis court', 'BBQ area', 'Concierge service'],
  contactName: 'Sarah Lim',
  contactPhone: '8765 4321',
  contactEmail: 'sarah.lim@example.com',
  ownerId: 'agent-2', // Mock agent ID
  coordinates: {
    lat: 1.3043,
    lng: 103.8318
  }
}, {
  id: '3',
  title: 'Spacious Landed House in Sengkang',
  description: 'Beautiful semi-detached house with a garden and private pool. This family home features 5 bedrooms, a modern kitchen, and a cozy living area. Perfect for large families.',
  price: 3500000,
  listingType: 'sale',
  propertyType: 'landed',
  bedrooms: 5,
  bathrooms: 4,
  size: 3200,
  location: 'Sengkang',
  address: '789 Sengkang East Road, Singapore 545789',
  images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
  features: ['Private swimming pool', 'Landscaped garden', 'Gourmet kitchen', 'Home theater', "Helper's quarters"],
  amenities: ['Private driveway', 'Security system', 'Outdoor dining area'],
  contactName: 'Michael Wong',
  contactPhone: '9876 5432',
  contactEmail: 'michael.wong@example.com',
  ownerId: 'agent-1', // Mock agent ID
  coordinates: {
    lat: 1.3868,
    lng: 103.8914
  }
}, {
  id: '4',
  title: 'Cozy 2-Room HDB in Yishun',
  description: 'Affordable and well-maintained 2-room HDB flat. Ideal for singles or young couples. Recently painted with new flooring. Near Yishun MRT and Northpoint City.',
  price: 280000,
  listingType: 'sale',
  propertyType: 'hdb',
  bedrooms: 1,
  bathrooms: 1,
  size: 450,
  location: 'Yishun',
  address: '101 Yishun Ring Road, #05-123, Singapore 760101',
  images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80', 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
  features: ['New flooring', 'Built-in wardrobe', 'Air conditioning', 'Water heater'],
  amenities: ['Playground', 'Fitness corner', 'Void deck'],
  contactName: 'Lisa Ng',
  contactPhone: '9234 5678',
  contactEmail: 'lisa.ng@example.com',
  ownerId: 'agent-2', // Mock agent ID
  coordinates: {
    lat: 1.4304,
    lng: 103.8354
  }
}, {
  id: '5',
  title: 'Executive Condo in Sengkang',
  description: 'Spacious executive condominium with excellent facilities. This 4-bedroom unit is perfect for families with children. Close to Sengkang MRT, bus interchange, and Compass One mall.',
  price: 1200000,
  listingType: 'sale',
  propertyType: 'condo',
  bedrooms: 4,
  bathrooms: 3,
  size: 1400,
  location: 'Sengkang',
  address: '222 Sengkang East Way, #10-11, Singapore 544222',
  images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80', 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'],
  features: ['Balcony', 'Study room', 'Wet and dry kitchen', 'Walk-in wardrobe'],
  amenities: ['Swimming pool', 'Tennis court', "Children's playground", 'Function room', 'BBQ pits'],
  contactName: 'David Tan',
  contactPhone: '8234 5678',
  contactEmail: 'david.tan@example.com',
  ownerId: 'agent-3', // Mock agent ID
  coordinates: {
    lat: 1.3868,
    lng: 103.8914
  }
}, {
  id: '6',
  title: 'Renovated 4-Room HDB in Punggol',
  description: 'Beautifully renovated 4-room HDB with premium finishes. Features an open-concept kitchen and custom cabinetry throughout. Located near Punggol Waterway and Punggol MRT.',
  price: 1600,
  listingType: 'rent',
  propertyType: 'hdb',
  bedrooms: 3,
  bathrooms: 2,
  size: 1000,
  location: 'Punggol',
  address: '456 Punggol Drive, #08-456, Singapore 820456',
  images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80'],
  features: ['Open-concept kitchen', 'Custom cabinetry', 'Air conditioning in all rooms', 'Utility room'],
  amenities: ['Playground', 'Fitness corner', 'Bicycle parking'],
  contactName: 'Rachel Lim',
  contactPhone: '9345 6789',
  contactEmail: 'rachel.lim@example.com',
  ownerId: 'agent-4', // Mock agent ID
  coordinates: {
    lat: 1.4043,
    lng: 103.9092
  }
}, {
  id: '7',
  title: 'Penthouse Condo with Private Roof Terrace',
  description: 'Exclusive penthouse with a private roof terrace offering panoramic city views. This 3-bedroom duplex features high ceilings, premium appliances, and luxurious finishes throughout.',
  price: 6500,
  listingType: 'rent',
  propertyType: 'condo',
  bedrooms: 3,
  bathrooms: 3,
  size: 2200,
  location: 'Orchard',
  address: '789 Orchard Boulevard, #30-01, Singapore 248789',
  images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
  features: ['Private roof terrace', 'Floor-to-ceiling windows', 'Designer kitchen', 'Wine cellar', 'Smart home system'],
  amenities: ['Infinity pool', 'Sky garden', 'Private gym', 'Concierge service', 'Private lift access'],
  contactName: 'Benjamin Koh',
  contactPhone: '8456 7890',
  contactEmail: 'benjamin.koh@example.com',
  ownerId: 'agent-5', // Mock agent ID
  coordinates: {
    lat: 1.3043,
    lng: 103.8318
  }
}, {
  id: '8',
  title: 'Corner Terrace House in Yishun',
  description: 'Charming corner terrace house with a spacious garden. Recently renovated with modern interiors while preserving its classic charm. Near to Yishun Park and amenities.',
  price: 2800000,
  listingType: 'sale',
  propertyType: 'landed',
  bedrooms: 4,
  bathrooms: 3,
  size: 2800,
  location: 'Yishun',
  address: '123 Yishun Avenue 1, Singapore 768123',
  images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'],
  features: ['Corner plot', 'Garden', 'Car porch for 2 cars', 'Renovated kitchen', 'Attic space'],
  amenities: ['Near park', 'Quiet neighborhood', 'Freehold'],
  contactName: 'Thomas Lee',
  contactPhone: '9567 8901',
  contactEmail: 'thomas.lee@example.com',
  ownerId: 'agent-6', // Mock agent ID
  coordinates: {
    lat: 1.4304,
    lng: 103.8354
  }
}];
export const locations = ['Punggol', 'Sengkang', 'Yishun', 'Orchard', 'Tampines', 'Bedok', 'Jurong', 'Woodlands', 'Ang Mo Kio', 'Bukit Timah'];
export const propertyTypes = [{
  value: 'hdb',
  label: 'HDB'
}, {
  value: 'condo',
  label: 'Condominium'
}, {
  value: 'landed',
  label: 'Landed'
}];
export const listingTypes = [{
  value: 'all',
  label: 'All'
}, {
  value: 'rent',
  label: 'For Rent'
}, {
  value: 'sale',
  label: 'For Sale'
}];