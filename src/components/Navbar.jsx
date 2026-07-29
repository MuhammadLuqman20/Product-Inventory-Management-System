import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="top-bar">
      <div className="page-title">
        <h1>{title}</h1>
      </div>

      <div className="top-bar-actions">
        <ThemeToggle />

        {user && (
          <div className="role-badge">
            {user.role === 'Admin' ? (
              <ShieldCheck size={16} className="role-badge-icon admin" />
            ) : (
              <User size={16} className="role-badge-icon" />
            )}
            <span>{user.role} Account</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
