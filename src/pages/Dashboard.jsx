import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Loader from '../components/Loader';
import CategoryStockChart from '../components/CategoryStockChart';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingDown, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });
  const [chartData, setChartData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch a large page size to calculate true totals
        const productsRes = await api.getProducts({ pageSize: 1000 });
        const categoriesRes = await api.getCategories();
        
        const products = productsRes.data || [];
        const categories = categoriesRes.data || [];

        // 1. Calculate stats
        let totalVal = 0;
        let lowStock = 0;
        let outOfStock = 0;
        const lowStockItems = [];

        products.forEach(p => {
          totalVal += (p.unitPrice * p.quantityInStock);
          if (p.quantityInStock === 0) {
            outOfStock++;
            lowStockItems.push(p);
          } else if (p.quantityInStock < 10) {
            lowStock++;
            lowStockItems.push(p);
          }
        });

        setStats({
          totalProducts: productsRes.pagination?.totalItems || products.length,
          totalStockValue: totalVal,
          lowStockCount: lowStock,
          outOfStockCount: outOfStock
        });

        // Sort low stock items so out of stock are first
        setLowStockProducts(lowStockItems.sort((a, b) => a.quantityInStock - b.quantityInStock).slice(0, 5));

        // 2. Calculate stock by category for chart
        const categoryMap = {};
        categories.forEach(c => {
          categoryMap[c._id] = { label: c.name, value: 0 };
        });

        products.forEach(p => {
          const catId = p.category?._id || p.category;
          if (categoryMap[catId]) {
            categoryMap[catId].value += p.quantityInStock;
          }
        });

        setChartData(Object.values(categoryMap).filter(item => item.value > 0));
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader message="Analyzing stock metrics..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {error && (
        <div className="alert-banner danger">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Inventory Value</span>
            <span className="stat-value">${stats.totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Low Stock Items</span>
            <span className="stat-value">{stats.lowStockCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">
            <TrendingDown size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Out of Stock</span>
            <span className="stat-value">{stats.outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Details Section */}
      <div className="dashboard-details">
        {/* Left Side: Custom Chart */}
        <div className="card-panel">
          <div className="card-header">
            <h2>Stock Volume by Category</h2>
          </div>
          <div style={{ padding: '10px 0 20px' }}>
            <CategoryStockChart data={chartData} />
          </div>
        </div>

        {/* Right Side: Low Stock Alert List */}
        <div className="card-panel">
          <div className="card-header">
            <h2>Stock Alerts</h2>
            <Link to="/products?status=low-stock" className="card-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          {lowStockProducts.length === 0 ? (
            <div className="empty-state">
              All items are fully stocked.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lowStockProducts.map(product => (
                <div key={product._id} className="alert-item">
                  <div className="alert-item-info">
                    <span className="alert-item-name">{product.name}</span>
                    <span className="alert-item-sku">SKU: {product.sku}</span>
                  </div>
                  
                  <span className={`badge ${product.quantityInStock === 0 ? 'out-of-stock' : 'low-stock'}`}>
                    {product.quantityInStock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
