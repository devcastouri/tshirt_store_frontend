import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import ProductForm from '../components/ProductForm';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      try {
        // Get current user data including role
        const userResponse = await apiService.getCurrentUser();
        const userData = userResponse.data.user;
        setUserRole(userData.role);

        if (userData.role === 'admin') {
          // Only fetch products if user is admin
          const productsResponse = await apiService.getProducts();
          setProducts(productsResponse.data.products);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        await apiService.updateProduct(selectedProduct.id, formData);
      } else {
        await apiService.createProduct(formData);
      }
      setShowForm(false);
      setSelectedProduct(null);
      const response = await apiService.getProducts();
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to save product');
      console.error('Error saving product:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (userRole !== 'admin') {
    return (
      <div className="product-management">
        <h2>Admin Access Required</h2>
        <p>Please log in as an admin to manage products.</p>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="product-header">
        <h1>Product Management</h1>
        <button 
          className="add-product-button"
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
        >
          Add New Product
        </button>
      </div>

      {showForm ? (
        <div className="product-form-container">
          <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <ProductForm 
            product={selectedProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="products-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Sizes</th>
                <th>Colors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.sizes.join(', ')}</td>
                  <td>{product.colors.join(', ')}</td>
                  <td>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 