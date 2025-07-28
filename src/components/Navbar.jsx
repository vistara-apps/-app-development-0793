import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            Niche Site Builder
          </Link>
          
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/research" className="nav-link">Research</Link>
                <Link to="/content" className="nav-link">Content</Link>
                <Link to="/builder" className="nav-link">Builder</Link>
                <Link to="/analytics" className="nav-link">Analytics</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="nav-link">
                    <User size={16} />
                    {user.name}
                  </span>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/pricing" className="nav-link">Pricing</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;