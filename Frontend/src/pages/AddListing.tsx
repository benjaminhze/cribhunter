import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, HomeIcon, PlusIcon, XIcon, UploadIcon, ImageIcon } from 'lucide-react';
import { propertyTypes } from '../data/propertyListings';
import { singaporeLocations } from '../data/singaporeLocations';
const AddListing: React.FC = () => {
  const {
    addProperty
  } = useProperties();
  const {
    theme
  } = useTheme();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    listingType: 'sale',
    propertyType: 'hdb',
    bedrooms: '3',
    bathrooms: '2',
    size: '',
    location: 'Punggol',
    address: '',
    features: [''],
    amenities: [''],
    coordinates: {
      lat: 1.3521,
      lng: 103.8198
    }
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleArrayChange = (index: number, field: 'features' | 'amenities', value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };
  const addArrayItem = (field: 'features' | 'amenities') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };
  const removeArrayItem = (index: number, field: 'features' | 'amenities') => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    try {
      const newFiles = Array.from(files);
      const newUploadedImages = [...uploadedImages, ...newFiles];
      setUploadedImages(newUploadedImages);
      
      // Convert files to base64 data URLs for persistence
      const newPreviews = await Promise.all(
        newFiles.map(file => convertFileToBase64(file))
      );
      setImagePreviews([...imagePreviews, ...newPreviews]);
    } catch (error) {
      console.error('Error processing images:', error);
      setErrors({ images: 'Failed to process images. Please try again.' });
    } finally {
      setUploadingImages(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const removeImage = (index: number) => {
    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);
    const newPreviews = [...imagePreviews];
    // No need to revoke base64 URLs
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price))) newErrors.price = 'Price must be a number';
    if (!formData.size) newErrors.size = 'Size is required';
    if (isNaN(Number(formData.size))) newErrors.size = 'Size must be a number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (uploadedImages.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      // Use the base64 data URLs directly for persistence
      const imageUrls = imagePreviews.filter(preview => preview); // Filter out any empty previews
      
      const newProperty = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        size: Number(formData.size),
        listingType: formData.listingType as 'rent' | 'sale',
        propertyType: formData.propertyType as 'hdb' | 'condo' | 'landed',
        contactName: user?.name || 'Agent',
        contactPhone: user?.phone || '91234567',
        contactEmail: user?.email || 'agent@example.com',
        features: formData.features.filter(f => f.trim() !== ''),
        amenities: formData.amenities.filter(a => a.trim() !== ''),
        images: imageUrls,
        coordinates: formData.coordinates
      };
      
      const id = await addProperty(newProperty);
      navigate(`/property/${id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      setErrors({ submit: 'Failed to create property. Please try again.' });
    }
  };
  return <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-white' : ''}`}>
      <button onClick={() => navigate(-1)} className={`flex items-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-6 hover:underline`}>
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>
      <div className="flex items-center mb-6">
        <HomeIcon className={`h-6 w-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Add New Property Listing
        </h1>
      </div>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Property Title*
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : ''}`} placeholder="e.g. Modern 3-Bedroom HDB in Punggol" />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Description*
              </label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : ''}`} placeholder="Describe the property in detail..."></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>}
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Listing Type*
              </label>
              <select name="listingType" value={formData.listingType} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Price* {formData.listingType === 'rent' ? '(per month)' : ''}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    $
                  </span>
                </div>
                <input type="text" name="price" value={formData.price} onChange={handleChange} className={`w-full pl-7 px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : ''}`} placeholder={formData.listingType === 'rent' ? 'e.g. 2500' : 'e.g. 550000'} />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Property Type*
              </label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}>
                {propertyTypes.map(type => <option key={type.value} value={type.value}>
                    {type.label}
                  </option>)}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Location*
              </label>
              <select name="location" value={formData.location} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}>
                {singaporeLocations.map(location => <option key={location} value={location}>
                    {location}
                  </option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Bedrooms*
                </label>
                <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Bathrooms*
                </label>
                <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}>
                  <option value="1">1 Bathroom</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="3">3 Bathrooms</option>
                  <option value="4">4 Bathrooms</option>
                  <option value="5">5+ Bathrooms</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Size* (sqft)
                </label>
                <input type="text" name="size" value={formData.size} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.size ? 'border-red-500' : ''}`} placeholder="e.g. 1100" />
                {errors.size && <p className="mt-1 text-sm text-red-500">{errors.size}</p>}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Address*
              </label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.address ? 'border-red-500' : ''}`} placeholder="e.g. 123 Punggol Field, #12-34, Singapore 820123" />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Features
                </label>
                <button type="button" onClick={() => addArrayItem('features')} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => <div key={index} className="flex items-center">
                    <input type="text" value={feature} onChange={e => handleArrayChange(index, 'features', e.target.value)} className={`flex-1 px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder={`Feature ${index + 1}`} />
                    {formData.features.length > 1 && <button type="button" onClick={() => removeArrayItem(index, 'features')} className="ml-2 text-red-500 hover:text-red-700">
                        <XIcon className="h-5 w-5" />
                      </button>}
                  </div>)}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amenities
                </label>
                <button type="button" onClick={() => addArrayItem('amenities')} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Amenity
                </button>
              </div>
              <div className="space-y-2">
                {formData.amenities.map((amenity, index) => <div key={index} className="flex items-center">
                    <input type="text" value={amenity} onChange={e => handleArrayChange(index, 'amenities', e.target.value)} className={`flex-1 px-3 py-2 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`} placeholder={`Amenity ${index + 1}`} />
                    {formData.amenities.length > 1 && <button type="button" onClick={() => removeArrayItem(index, 'amenities')} className="ml-2 text-red-500 hover:text-red-700">
                        <XIcon className="h-5 w-5" />
                      </button>}
                  </div>)}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Property Images*
                </label>
              </div>
              <div className={`p-4 border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'} rounded-lg`}>
                <div className="text-center">
                  <ImageIcon className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div className="mt-2">
                    <label htmlFor="image-upload" className={`cursor-pointer rounded-md font-medium ${uploadingImages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-500'}`}>
                      <span>{uploadingImages ? 'Processing images...' : 'Upload images'}</span>
                      <input 
                        id="image-upload" 
                        name="images" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageUpload} 
                        disabled={uploadingImages}
                        className="sr-only" 
                      />
                    </label>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {imagePreviews.length > 0 && <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => <div key={index} className="relative group">
                        <div className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <img src={preview} alt={`Property preview ${index + 1}`} className="object-cover w-full h-24" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>)}
                    <div className="flex items-center justify-center h-24 rounded-lg border-2 border-dashed border-gray-300">
                      <label htmlFor="add-more-images" className={`cursor-pointer text-center p-2 ${uploadingImages ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <UploadIcon className={`mx-auto h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {uploadingImages ? 'Processing...' : 'Add more'}
                        </span>
                        <input 
                          id="add-more-images" 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleImageUpload} 
                          disabled={uploadingImages}
                          className="sr-only" 
                        />
                      </label>
                    </div>
                  </div>}
              </div>
              {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => navigate(-1)} className={`px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-md mr-3 hover:bg-gray-100`}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddListing;