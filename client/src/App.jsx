import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, CalendarPlus, Search, ListFilter, ShieldCheck, Home, Stethoscope } from 'lucide-react';
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

  // Hide global navigation on splash role selection page
  const hideNavigation = ['/'].includes(location.pathname);

  if (hideNavigation) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <nav className="nav-container">
        <Link to="/patient-dashboard" className="nav-brand">
          <div className="brand-icon-box">
            <Activity className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">CareQueue</span>
            <span className="brand-sub">Smart Hospital Portal</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link
            to="/patient-dashboard"
            className={`nav-link ${isActive('/patient-dashboard') ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/patient-booking"
            className={`nav-link ${isActive('/patient-booking') ? 'active' : ''}`}
          >
            <CalendarPlus size={18} />
            <span>Book Token</span>
          </Link>
          <Link
            to="/check"
            className={`nav-link ${isActive('/check') ? 'active' : ''}`}
          >
            <Search size={18} />
            <span>Check Ticket</span>
          </Link>
          <Link
            to="/status"
            className={`nav-link ${isActive('/status') ? 'active' : ''}`}
          >
            <ListFilter size={18} />
            <span>Live Queues</span>
          </Link>
          <Link
            to="/doctor-dashboard"
            className={`nav-link doctor-pill ${isActive('/doctor-dashboard') ? 'active' : ''}`}
          >
            <Stethoscope size={18} />
            <span>Doctor Portal</span>
          </Link>
          <Link
            to="/admin"
            className={`nav-link admin-pill ${isActive('/admin') ? 'active' : ''}`}
          >
            <ShieldCheck size={18} />
            <span>Admin</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-viewport">
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
        </main>
      </div>
    </Router>
  );
}

export default App;

