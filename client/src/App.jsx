import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Activity, CalendarPlus, Search, ListFilter, Home, Stethoscope, LogIn, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelection from './pages/RoleSelection';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientBooking from './pages/PatientBooking';
import TokenStatus from './pages/TokenStatus';
import AdminDashboard from './pages/AdminDashboard';
import CheckTicket from './pages/CheckTicket';
import Login from './pages/Login';
import './App.css';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();

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

          {user ? (
            <button
              onClick={logout}
              className="nav-link"
              style={{
                border: 'none',
                background: '#f1f5f9',
                color: '#475569',
                cursor: 'pointer',
                borderRadius: '50px',
                padding: '0.4rem 0.9rem',
                fontWeight: 600
              }}
            >
              <LogOut size={16} />
              <span>Logout ({user.name.split(' ')[0]})</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                borderRadius: '50px',
                padding: '0.4rem 0.9rem',
                fontWeight: 600
              }}
            >
              <LogIn size={16} />
              <span>Staff Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-viewport">
            <Routes>
              {/* Role Selection Landing Page */}
              <Route path="/" element={<RoleSelection />} />

              {/* Public Patient Routes */}
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/patient-booking" element={<PatientBooking />} />
              <Route path="/check" element={<CheckTicket />} />
              <Route path="/status" element={<TokenStatus />} />

              {/* Staff Auth Route */}
              <Route path="/login" element={<Login />} />

              {/* Guarded Doctor Portal Route */}
              <Route
                path="/doctor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin', 'reception']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Single Permanent Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Redirect legacy /admin-dashboard to permanent /admin route */}
              <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
