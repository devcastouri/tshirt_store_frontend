import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductManagement from './pages/ProductManagement';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';
import apiService from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await apiService.getCurrentUser();
        setIsAuthenticated(true);
        setUserRole(response.data.user.role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('token', response.data.session.access_token);
      await checkAuth(); // Refresh auth state after login
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navigation 
          isAuthenticated={isAuthenticated} 
          userRole={userRole}
          onLogout={handleLogout} 
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/admin" replace /> : 
              <Login onLogin={handleLogin} />
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;