import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Boxes, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (!result.success) {
      setError(result.message || 'Invalid credentials');
    }
  };

  const useDemoCredentials = () => {
    setEmail('testadmin@gmail.com');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className="auth-theme-toggle">
        <ThemeToggle />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Boxes size={32} />
          </div>
          <h1>Inventory Flow</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '8px 0 0' }}>
            Product Inventory Management System
          </p>
        </div>

        {error && (
          <div className="alert-banner danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)' 
              }} />
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)' 
              }} />
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '12px 18px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          paddingTop: '20px', 
          borderTop: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
            Want to test the app quickly?
          </p>
          <button 
            type="button" 
            onClick={useDemoCredentials}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            disabled={loading}
          >
            Use Demo Admin Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
