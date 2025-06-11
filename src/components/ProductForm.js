import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: [],
    colors: [],
    image: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        image: null
      });
      setImagePreview(product.image_url);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    if (product && product.image_url) {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          throw new Error('Please log in to delete images');
        }

        // Delete the image
        await apiService.deleteProductImage(product.id, product.image_url);
        
        // Update local state
        setImagePreview(null);
        setFormData(prev => ({
          ...prev,
          image: null
        }));

        // Refresh the product data
        const updatedProduct = await apiService.getProductById(product.id);
        if (updatedProduct.data.product) {
          setImagePreview(updatedProduct.data.product.image_url);
        }
      } catch (err) {
        console.error('Error deleting image:', err);
        if (err.message.includes('token') || err.message.includes('authentication')) {
          setError('Your session has expired. Please log in again.');
          setIsAuthenticated(false);
        } else {
          setError('Failed to delete image: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        image: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name) throw new Error('Product name is required');
      if (!formData.description) throw new Error('Product description is required');
      if (!formData.price) throw new Error('Product price is required');
      if (!formData.sizes.length) throw new Error('At least one size is required');
      if (!formData.colors.length) throw new Error('At least one color is required');
      if (!product && !formData.image) throw new Error('Product image is required');

      // Validate image if provided
      if (formData.image) {
        if (!formData.image.type.startsWith('image/')) {
          throw new Error('File must be an image');
        }
        if (formData.image.size > 5 * 1024 * 1024) {
          throw new Error('Image size must be less than 5MB');
        }
      }

      // Create FormData object
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('sizes', JSON.stringify(formData.sizes));
      submitData.append('colors', JSON.stringify(formData.colors));
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      console.log('Submitting form data:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        sizes: formData.sizes,
        colors: formData.colors,
        hasImage: !!formData.image
      });

      // Call the onSubmit prop with the form data
      await onSubmit(submitData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        price: '',
        sizes: [],
        colors: [],
        image: null
      });
      setImagePreview(null);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sizes">Sizes (comma-separated):</label>
        <input
          type="text"
          id="sizes"
          name="sizes"
          value={formData.sizes.join(', ')}
          onChange={handleArrayInputChange}
          placeholder="S, M, L, XL"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="colors">Colors (comma-separated):</label>
        <input
          type="text"
          id="colors"
          name="colors"
          value={formData.colors.join(', ')}
          onChange={handleArrayInputChange}
          placeholder="Red, Blue, Black"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Product Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          required={!product}
        />
        {/* Debug output for authentication */}
        <div style={{ fontSize: '12px', color: '#888', margin: '4px 0' }}>
          Authenticated: {isAuthenticated ? 'Yes' : 'No'}<br />
          Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
        </div>
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            {isAuthenticated && (
              <button
                type="button"
                className="delete-image-button"
                onClick={handleDeleteImage}
                title="Delete image"
                disabled={loading}
              >
                {loading ? '...' : '×'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 