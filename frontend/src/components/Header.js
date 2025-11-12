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
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg group-hover:from-primary-600 group-hover:to-primary-800 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Digital Guides
              </h1>
              <p className="text-sm text-neutral-600">Authentic Kenyan Experiences</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/experiences" 
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Experiences
            </Link>
            
            {isAuthenticated ? (
              <>
                {role === 'guide' && (
                  <Link 
                    to="/guide/dashboard" 
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                {role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-neutral-600">Welcome, {user?.name || user?.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/experiences')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
                >
                  Browse Tours
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-neutral-600">
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