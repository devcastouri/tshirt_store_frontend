import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ProductList.css';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await apiService.getProducts();
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await apiService.deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Product Management</h2>
        <button 
          className="add-product-btn"
          onClick={() => onEdit(null)}
        >
          Add New Product
        </button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image_url} alt={product.name} />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">${product.price}</p>
              <div className="product-meta">
                <p>Sizes: {product.sizes.join(', ')}</p>
                <p>Colors: {product.colors.join(', ')}</p>
              </div>
              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(product)}
                >
                  Edit
                </button>
                {deleteConfirm === product.id ? (
                  <div className="delete-confirmation">
                    <p>Are you sure?</p>
                    <button 
                      className="confirm-delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Yes, Delete
                    </button>
                    <button 
                      className="cancel-delete-btn"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    className="delete-btn"
                    onClick={() => setDeleteConfirm(product.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 