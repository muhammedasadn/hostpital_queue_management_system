import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelection.css';

function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setTimeout(() => {
      if (role === 'patient') {
        navigate('/patient-dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor-dashboard');
      }
    }, 300);
  };

  return (
    <div className="role-selection">
      <div className="role-container">
        <div className="role-header">
          <h1>🏥 Hospital Queue Management System</h1>
          <p>Select your role to continue</p>
        </div>

        <div className="role-cards">
          <div
            className={`role-card patient-card ${selectedRole === 'patient' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('patient')}
          >
            <div className="role-icon">👤</div>
            <h2>Patient</h2>
            <p>Book tokens, check queue status, and view your ticket information</p>
            <ul className="role-features">
              <li>✓ Book appointment tokens</li>
              <li>✓ Check real-time queue status</li>
              <li>✓ Scan QR code tickets</li>
              <li>✓ Get instant notifications</li>
            </ul>
            <button className="role-btn">Continue as Patient</button>
          </div>

          <div
            className={`role-card doctor-card ${selectedRole === 'doctor' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('doctor')}
          >
            <div className="role-icon">👨‍⚕️</div>
            <h2>Doctor / Staff</h2>
            <p>Manage queues, call patients, and monitor department workflows</p>
            <ul className="role-features">
              <li>✓ Call next patient</li>
              <li>✓ View department queues</li>
              <li>✓ Manage patient flow</li>
              <li>✓ Real-time queue monitoring</li>
            </ul>
            <button className="role-btn">Continue as Doctor</button>
          </div>
        </div>

        <div className="role-footer">
          <p>© 2026 Hospital Queue Management System</p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
