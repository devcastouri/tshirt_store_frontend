import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.getProducts();
        // Check if response.data is an array, if not, try to access the correct property
        const productsData = Array.isArray(response.data) 
          ? response.data 
          : response.data?.products || [];
        
        console.log('Received products data:', productsData); // Debug log
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="products-container">
        <div className="no-products">No products available</div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <div className="product-details">
                <div className="sizes">
                  <strong>Sizes:</strong> {Array.isArray(product.sizes) ? product.sizes.join(', ') : 'N/A'}
                </div>
                <div className="colors">
                  <strong>Colors:</strong> {Array.isArray(product.colors) ? product.colors.join(', ') : 'N/A'}
                </div>
              </div>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products; 