import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-kenya-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-safari-gold p-2 rounded-lg">
              <svg className="w-8 h-8 text-kenya-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-safari">Digital Guides</h1>
              <p className="text-sm text-savanna-tan">Authentic Kenyan Experiences</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-safari-gold transition duration-200">Home</Link>
            <Link to="/experiences" className="hover:text-safari-gold transition duration-200">Browse Experiences</Link>
            
            {isAuthenticated ? (
              <>
                {role === 'guide' && (
                  <Link to="/guide/dashboard" className="hover:text-safari-gold transition duration-200">Dashboard</Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin" className="hover:text-safari-gold transition duration-200">Admin</Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-savanna-tan">Welcome, {user?.name || user?.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-kenya-red hover:bg-red-700 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/experiences')}
                  className="bg-safari-gold text-kenya-green hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Browse Tours
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;