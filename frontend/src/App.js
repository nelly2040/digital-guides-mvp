import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Homepage from './pages/Homepage';
import Experiences from './pages/Experiences';
import ExperienceDetail from './pages/ExperienceDetail';
import SafariCalculator from './pages/SafariCalculator';
import GuideDashboard from './pages/GuideDashboard';
import CreateExperience from './pages/CreateExperience';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/experience/:id" element={<ExperienceDetail />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/safari-calculator" element={<SafariCalculator />} />
              <Route path="/guide-dashboard" element={<GuideDashboard />} />
              <Route path="/create-experience" element={<CreateExperience />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;