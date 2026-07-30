import React, { useState } from 'react';
import { 
  CalendarPlus, 
  User, 
  Phone, 
  Building2, 
  Sparkles, 
  Activity, 
  Heart, 
  Brain, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Clock,
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import queueApi from '../api/queueApi';
import TokenCard from '../components/TokenCard';
import '../styles/PatientBooking.css';

const DEPARTMENTS = [
  { id: 'General', name: 'General OPD', icon: Activity, color: '#38bdf8', wait: '~10m', doc: 'Dr. Sarah Jenkins' },
  { id: 'Cardiology', name: 'Cardiology', icon: Heart, color: '#f43f5e', wait: '~15m', doc: 'Dr. Michael Chen' },
  { id: 'Neurology', name: 'Neurology', icon: Brain, color: '#818cf8', wait: '~20m', doc: 'Dr. Elena Rostova' },
  { id: 'Orthopedics', name: 'Orthopedics', icon: Building2, color: '#34d399', wait: '~12m', doc: 'Dr. James Wilson' }
];

function PatientBooking() {
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('General');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter patient full name.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const result = await queueApi.bookToken({
        patientName,
        department,
        phoneNumber
      });
      setToken(result);
    } catch (err) {
      setError('Failed to book ticket token. Please verify backend server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setToken(null);
    setPatientName('');
    setPhoneNumber('');
    setDepartment('General');
    setError('');
  };

  const selectedDeptObj = DEPARTMENTS.find(d => d.id === department) || DEPARTMENTS[0];

  return (
    <div className="patient-booking-page">
      <div className="booking-container">
        
        {/* Navigation Topbar */}
        <div className="booking-topbar">
          <Link to="/patient-dashboard" className="btn-back-link">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="portal-badge">
            <ShieldCheck size={16} /> Instant Token Booking Portal
          </div>
        </div>

        {token ? (
          /* Success Screen with Token Pass */
          <div className="booking-success-view">
            <div className="success-banner glass-card">
              <div className="success-icon-wrap">
                <CheckCircle2 size={42} className="success-check" />
              </div>
              <h1>Token Booked Successfully!</h1>
              <p>Your digital voucher pass has been generated. Keep this pass open or save the QR code.</p>
              
              <div className="success-pass-wrapper">
                <TokenCard token={token} />
              </div>

              <div className="success-actions">
                <button onClick={handleReset} className="btn-primary">
                  <CalendarPlus size={18} /> Book Another Token
                </button>
                <Link to="/check" className="btn-secondary">
                  <Ticket size={18} /> Track My Pass
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Main Booking Form View */
          <div className="booking-hero-layout">
            
            <div className="booking-form-section glass-card">
              <div className="form-header-block">
                <div className="header-icon-box">
                  <CalendarPlus size={24} className="header-icon" />
                </div>
                <div>
                  <h1>Register Patient Token</h1>
                  <p>Select your department and generate an instant queue pass for OPD consultation.</p>
                </div>
              </div>

              {error && (
                <div className="booking-error-alert">
                  <ShieldCheck size={18} /> {error}
                </div>
              )}

              <form onSubmit={handleBooking} className="booking-form-grid">
                
                {/* Department Card Selector */}
                <div className="field-group">
                  <label className="field-label">Select Hospital Department</label>
                  <div className="dept-cards-grid">
                    {DEPARTMENTS.map((dept) => {
                      const IconComp = dept.icon;
                      const isSelected = department === dept.id;
                      return (
                        <div 
                          key={dept.id} 
                          className={`dept-selector-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setDepartment(dept.id)}
                        >
                          <div className="dept-icon-circle" style={{ color: dept.color, background: `${dept.color}20` }}>
                            <IconComp size={22} />
                          </div>
                          <div className="dept-text-info">
                            <strong>{dept.name}</strong>
                            <span className="dept-sub-info">Est. Wait {dept.wait}</span>
                          </div>
                          {isSelected && <CheckCircle2 size={18} className="dept-check" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Patient Name */}
                <div className="field-group">
                  <label className="field-label" htmlFor="patientNameInput">
                    <User size={16} /> Patient Full Name
                  </label>
                  <input
                    id="patientNameInput"
                    type="text"
                    className="styled-text-input"
                    placeholder="e.g. Alexander Wright"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="field-group">
                  <label className="field-label" htmlFor="phoneInput">
                    <Phone size={16} /> Contact Phone Number (SMS Ticket Alerts)
                  </label>
                  <input
                    id="phoneInput"
                    type="tel"
                    className="styled-text-input"
                    placeholder="e.g. +1 (555) 234-5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-submit-booking-pass" disabled={loading}>
                  {loading ? (
                    <>
                      <Sparkles size={20} className="spin-icon" /> Booking Pass...
                    </>
                  ) : (
                    <>
                      <CalendarPlus size={20} /> Generate Digital Ticket
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Live Pass Preview Panel */}
            <div className="booking-preview-sidebar glass-card">
              <div className="preview-header">
                <Sparkles size={18} className="text-cyan" />
                <span>Live Pass Voucher Preview</span>
              </div>

              <div className="preview-ticket-card">
                <div className="preview-ticket-header">
                  <div className="preview-brand">CareQueue Hospital</div>
                  <span className="preview-status-tag">Draft Pass</span>
                </div>

                <div className="preview-hero-number">
                  <span className="lbl">PROJECTED TOKEN</span>
                  <div className="preview-token-code">
                    {selectedDeptObj.id.substring(0, 3).toUpperCase()}-???
                  </div>
                </div>

                <div className="preview-meta-list">
                  <div className="preview-meta-row">
                    <span className="meta-k">Patient:</span>
                    <span className="meta-v">{patientName || 'Enter name...'}</span>
                  </div>
                  <div className="preview-meta-row">
                    <span className="meta-k">Department:</span>
                    <span className="meta-v">{selectedDeptObj.name}</span>
                  </div>
                  <div className="preview-meta-row">
                    <span className="meta-k">Est. Wait:</span>
                    <span className="meta-v">{selectedDeptObj.wait}</span>
                  </div>
                  <div className="preview-meta-row">
                    <span className="meta-k">Doctor:</span>
                    <span className="meta-v">{selectedDeptObj.doc}</span>
                  </div>
                </div>

                <div className="preview-footer-note">
                  <Clock size={14} />
                  <span>Real-time queue tracking active upon submission.</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default PatientBooking;
