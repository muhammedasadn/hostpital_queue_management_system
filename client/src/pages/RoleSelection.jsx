import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Stethoscope, ShieldCheck, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      } else if (role === 'admin') {
        navigate('/admin');
      }
    }, 250);
  };

  return (
    <div className="role-selection-wrapper">
      <div className="role-hero-bg">
        <div className="hero-shape shape-1"></div>
        <div className="hero-shape shape-2"></div>
      </div>

      <div className="role-container">
        <header className="role-header">
          <div className="badge-pill">
            <Activity size={16} />
            <span>Smart Queue Management</span>
          </div>
          <h1>Hospital CareQueue Portal</h1>
          <p>Streamlined hospital appointment tokens, live queue tracking, and counter dispatch</p>
        </header>

        <div className="role-cards-grid">
          {/* Patient Card */}
          <div
            className={`role-card patient-theme ${selectedRole === 'patient' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('patient')}
          >
            <div className="role-badge">For Patients</div>
            <div className="icon-container">
              <UserCheck size={36} />
            </div>
            <h2>Patient Portal</h2>
            <p>Book instant appointment tokens, track queue status in real time, and download QR tickets.</p>
            
            <ul className="role-features">
              <li><CheckCircle2 size={16} /> Instant token booking & department queueing</li>
              <li><CheckCircle2 size={16} /> Live position & wait time tracking</li>
              <li><CheckCircle2 size={16} /> Digital QR code voucher generation</li>
            </ul>

            <button className="role-action-btn">
              <span>Enter Patient Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Doctor / Staff Card */}
          <div
            className={`role-card doctor-theme ${selectedRole === 'doctor' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('doctor')}
          >
            <div className="role-badge">For Doctors & Staff</div>
            <div className="icon-container">
              <Stethoscope size={36} />
            </div>
            <h2>Doctor / Staff Portal</h2>
            <p>Call next token, view department queues, dispatch patient calls, and manage counter flow.</p>

            <ul className="role-features">
              <li><CheckCircle2 size={16} /> One-click "Call Next Patient" dispatch</li>
              <li><CheckCircle2 size={16} /> Department queue summary & live status</li>
              <li><CheckCircle2 size={16} /> Counter workload distribution</li>
            </ul>

            <button className="role-action-btn">
              <span>Enter Doctor Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Admin Card */}
          <div
            className={`role-card admin-theme ${selectedRole === 'admin' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('admin')}
          >
            <div className="role-badge">For Administrators</div>
            <div className="icon-container">
              <ShieldCheck size={36} />
            </div>
            <h2>Admin Dashboard</h2>
            <p>Monitor all active hospital counters, system health, and token assignments.</p>

            <ul className="role-features">
              <li><CheckCircle2 size={16} /> Full counter assignment control</li>
              <li><CheckCircle2 size={16} /> Real-time system socket monitoring</li>
              <li><CheckCircle2 size={16} /> Queue throughput statistics</li>
            </ul>

            <button className="role-action-btn">
              <span>Enter Admin Console</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <footer className="role-footer">
          <p>© 2026 CareQueue Hospital Management System • Real-Time Socket.IO Active</p>
        </footer>
      </div>
    </div>
  );
}

export default RoleSelection;

