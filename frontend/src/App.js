import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Homepage from './pages/Homepage';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Booking from './pages/Booking';
import GuideDashboard from './pages/GuideDashboard';
import CreateExperience from './pages/CreateExperience';
import AdminPanel from './pages/AdminPanel';
import './index.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experiences/:id" element={<ExperienceDetail />} />
        <Route path="/experiences/:id/book" element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/guide/dashboard" element={
          <ProtectedRoute requiredRole="guide">
            <GuideDashboard />
          </ProtectedRoute>
        } />
        <Route path="/guide/create" element={
          <ProtectedRoute requiredRole="guide">
            <CreateExperience />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      }}
    >
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </Auth0Provider>
  );
}

export default App;