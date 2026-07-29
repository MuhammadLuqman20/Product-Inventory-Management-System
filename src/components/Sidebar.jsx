import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  LogOut, 
  Boxes 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Boxes size={28} className="brand-icon" />
        <span className="brand-name">InvFlow</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/" end className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/products" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        
        <NavLink to="/categories" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Tags size={20} />
          <span>Categories</span>
        </NavLink>
        
        <NavLink to="/suppliers" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Suppliers</span>
        </NavLink>
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="user-info">
            <span className="user-name" title={user.name}>{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button onClick={logout} className="btn-logout" title="Log Out" aria-label="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
