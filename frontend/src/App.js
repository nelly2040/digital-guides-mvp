import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CurrencyProvider } from './hooks/useCurrency';
import Header from './components/Header';
import Homepage from './pages/Homepage';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import Booking from './pages/Booking';
import GuideDashboard from './pages/GuideDashboard';
import CreateExperience from './pages/CreateExperience';
import AdminPanel from './pages/AdminPanel';
import SafariCalculator from './pages/SafariCalculator';
import './index.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experiences/:id" element={<ExperienceDetail />} />
        <Route path="/safari-calculator" element={<SafariCalculator />} />
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
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <AppContent />
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;