import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientBooking from './pages/PatientBooking';
import TokenStatus from './pages/TokenStatus';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PatientBooking />} />
          <Route path="/status" element={<TokenStatus />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
