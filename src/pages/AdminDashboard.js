import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={`nav-item ${location.pathname === '/admin/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/admin/users" 
            className={`nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}
          >
            Users
          </Link>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard; 