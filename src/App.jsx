import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Loader from './components/Loader';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';

import './App.css';

// Component to dynamically set topbar header title based on route location
const MainLayout = ({ children }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Stock Dashboard Overview';
    if (path.startsWith('/products/')) return 'Product Ledger & Stock History';
    if (path === '/products') return 'Product Inventory Directory';
    if (path === '/categories') return 'Product Category Management';
    if (path === '/suppliers') return 'Supplier Registry Management';
    return 'Inventory Control';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title={getPageTitle()} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

// Route wrapper to protect admin/staff pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)' 
      }}>
        <Loader message="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Router layout with auth switch
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        backgroundColor: 'var(--bg-main)' 
      }}>
        <Loader message="Loading application..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Login Route */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products" 
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/products/:id" 
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/categories" 
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/suppliers" 
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        } 
      />

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
