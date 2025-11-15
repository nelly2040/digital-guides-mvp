import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showLoginModal = () => {
    setShowLogin(true);
    setMobileMenuOpen(false);
  };

  const showRegisterModal = () => {
    setShowRegister(true);
    setMobileMenuOpen(false);
  };

  // REMOVE THIS LINE: const showGuideRegistration = () => {
  //   setShowRegister(true);
  //   setMobileMenuOpen(false);
  // };

  const handleCloseLogin = () => setShowLogin(false);
  const handleCloseRegister = () => setShowRegister(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl group-hover:from-emerald-600 group-hover:to-green-700 transition-all duration-300 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-800 bg-clip-text text-transparent">
                  Digital Guides
                </h1>
                <p className="text-xs text-neutral-500 font-medium">Authentic Kenyan Experiences</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-neutral-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Home
              </Link>
              <Link 
                to="/experiences" 
                className="text-neutral-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Browse Tours
              </Link>
              <Link 
                to="/safari-calculator" 
                className="text-neutral-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Safari Calculator
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-6">
                  {user?.role === 'guide' && (
                    <Link 
                      to="/guide-dashboard" 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Guide Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center space-x-4 pl-4 border-l border-neutral-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-neutral-700 font-medium">Hi, {user?.name || 'User'}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={showLoginModal}
                    className="text-neutral-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:scale-105"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={showRegisterModal}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-neutral-600 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-neutral-100 pt-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/experiences" 
                  className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Tours
                </Link>
                <Link 
                  to="/safari-calculator" 
                  className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Safari Calculator
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {user?.role === 'guide' && (
                      <Link 
                        to="/guide-dashboard" 
                        className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Guide Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-neutral-700 font-medium">Hi, {user?.name || 'User'}</span>
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-neutral-100">
                    <button 
                      onClick={showLoginModal}
                      className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2 text-left"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={showRegisterModal}
                      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Join Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <LoginModal 
          isOpen={showLogin}
          onClose={handleCloseLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />

        <RegisterModal 
          isOpen={showRegister}
          onClose={handleCloseRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </header>
    </>
  );
};

export default Header;