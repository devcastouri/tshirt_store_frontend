import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsResponse, usersResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getUsers()
        ]);

        setStats({
          totalProducts: productsResponse.data.products.length,
          totalUsers: usersResponse.data.users.length,
          recentProducts: productsResponse.data.products.slice(0, 5)
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-home">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="recent-products">
        <h2>Recent Products</h2>
        <div className="products-grid">
          {stats.recentProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 