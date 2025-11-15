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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experience/:id" element={<ExperienceDetail />} />
            <Route path="/safari-calculator" element={<SafariCalculator />} />
            <Route path="/guide-dashboard" element={<GuideDashboard />} />
            <Route path="/create-experience" element={<CreateExperience />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;