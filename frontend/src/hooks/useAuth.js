import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
  const [jwtToken, setJwtToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        setJwtToken(token);
        // Fetch user role from backend
        axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => setRole(res.data.role));
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return children({ isAuthenticated, user, jwtToken, role, loginWithRedirect, logout });
};