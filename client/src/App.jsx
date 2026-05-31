import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientBooking from './pages/PatientBooking';
import TokenStatus from './pages/TokenStatus';
import AdminDashboard from './pages/AdminDashboard';
import CheckTicket from './pages/CheckTicket';
import './App.css';

function Navigation() {
  const location = useLocation();

  // Hide navigation on role selection and dashboard pages
  const hideNavigation = [
    '/',
    '/patient-dashboard',
    '/doctor-dashboard',
  ].includes(location.pathname);

  if (hideNavigation) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/patient-dashboard" className="nav-logo">
          🏥 Hospital Queue
        </Link>
        <div className="nav-links">
          <Link
            to="/patient-booking"
            className={`nav-link ${isActive('/patient-booking') ? 'active' : ''}`}
          >
            Book Token
          </Link>
          <Link
            to="/check"
            className={`nav-link ${isActive('/check') ? 'active' : ''}`}
          >
            Check Ticket
          </Link>
          <Link
            to="/status"
            className={`nav-link ${isActive('/status') ? 'active' : ''}`}
          >
            Queue Status
          </Link>
          <Link
            to="/admin"
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          {/* Role Selection */}
          <Route path="/" element={<RoleSelection />} />

          {/* Patient Routes */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-booking" element={<PatientBooking />} />
          <Route path="/check" element={<CheckTicket />} />
          <Route path="/status" element={<TokenStatus />} />

          {/* Doctor/Admin Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
