import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import config from './config/environment';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    // Test backend connection
    const testConnection = async () => {
      try {
        const response = await apiService.healthCheck();
        setBackendStatus('Connected');
        console.log('Backend connected:', response.data);
      } catch (err) {
        setBackendStatus('Disconnected');
        console.error('Backend connection failed:', err);
      }
    };

    // Fetch products
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', apiService.getProducts.toString());
        const response = await apiService.getProducts();
        console.log('Products fetched:', response.data);
        if (!response.data || !response.data.products) {
          console.error('Invalid response format:', response.data);
          setError('Invalid response format from server');
          return;
        }
        setProducts(response.data.products);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
    fetchProducts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>T-Shirt Store</h1>
        <div className="status-info">
          <p>Environment: {config.environment}</p>
        <p>API URL: {config.apiUrl}</p>
          <p>Backend Status: 
            <span className={`status ${backendStatus?.toLowerCase()}`}>
              {backendStatus || 'Checking...'}
            </span>
          </p>
        </div>
      </header>

      <main className="main-content">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
        <div className="products-grid">
            <h2>Our T-Shirts</h2>
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">${product.price}</p>
              <p>Sizes: {product.sizes.join(', ')}</p>
              <p>Colors: {product.colors.join(', ')}</p>
            </div>
          ))}
        </div>
        )}
      </main>
    </div>
  );
}

export default App;