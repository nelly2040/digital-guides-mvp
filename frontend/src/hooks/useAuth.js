import { createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
  const [jwtToken, setJwtToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && user) {
        try {
          const idToken = await getAccessTokenSilently();
          const res = await axios.post('http://localhost:5000/api/auth/verify', { id_token: idToken });
          localStorage.setItem('jwt_token', res.data.access_token);
          setJwtToken(res.data.access_token);
          setRole(res.data.user.role);
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    loginWithRedirect,
    logout: () => {
      localStorage.removeItem('jwt_token');
      logout({ returnTo: window.location.origin });
    },
    setRole
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};