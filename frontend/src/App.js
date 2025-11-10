import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Homepage from './pages/Homepage';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Booking from './pages/Booking';
import GuideDashboard from './pages/GuideDashboard';
import CreateExperience from './pages/CreateExperience';
import { AuthProvider } from './hooks/useAuth';  // Custom hook below

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin }}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/experiences/:id" element={<ExperienceDetail />} />
              <Route path="/experiences/:id/book" element={<Booking />} />
              <Route path="/guide/dashboard" element={<GuideDashboard />} />
              <Route path="/guide/create" element={<CreateExperience />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;