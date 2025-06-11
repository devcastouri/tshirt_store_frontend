import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isAuthenticated, userRole, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">T-Shirt Store</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        
        {isAuthenticated ? (
          <>
            {userRole === 'admin' && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/users">Manage Users</Link>
              </>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 