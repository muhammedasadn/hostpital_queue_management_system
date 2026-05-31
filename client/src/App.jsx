import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PatientBooking from './pages/PatientBooking';
import TokenStatus from './pages/TokenStatus';
import AdminDashboard from './pages/AdminDashboard';
import CheckTicket from './pages/CheckTicket';
import './App.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏥 Hospital Queue
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
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
          <Route path="/" element={<PatientBooking />} />
          <Route path="/check" element={<CheckTicket />} />
          <Route path="/status" element={<TokenStatus />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
