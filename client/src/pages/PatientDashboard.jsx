import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Home,
  PlusCircle,
  Search,
  ListFilter,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Ticket,
  Building2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import queueApi from '../api/queueApi';
import socket from '../socket';
import '../styles/PatientDashboard.css';

function PatientDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [queues, setQueues] = useState([]);
  const [recentToken, setRecentToken] = useState(null);
  const [bookingForm, setBookingForm] = useState({ patientName: '', department: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    fetchQueues();
    
    // Load recent token from localStorage
    const saved = localStorage.getItem('recentToken');
    if (saved) {
      setRecentToken(JSON.parse(saved));
    }

    socket.on('connect', () => {
      console.log('Connected to socket service');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await queueApi.getQueues();
      setQueues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching queues:', error);
      setQueues([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('recentToken');
    navigate('/');
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookToken = async (e) => {
    e.preventDefault();
    if (!bookingForm.patientName.trim() || !bookingForm.department) {
      setBookingMessage('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    setBookingMessage('');
    try {
      const response = await queueApi.bookToken({
        patientName: bookingForm.patientName,
        department: bookingForm.department
      });
      
      const token = {
        tokenNumber: response.tokenNumber,
        department: response.department,
        position: response.position,
        status: response.status
      };
      
      localStorage.setItem('recentToken', JSON.stringify(token));
      setRecentToken(token);
      setBookingMessage(`Token successfully issued! Number: ${response.tokenNumber}`);
      setBookingForm({ patientName: '', department: '' });
      
      setTimeout(() => setActiveTab('home'), 2200);
    } catch (error) {
      setBookingMessage(`Booking failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="patient-dashboard-container">
      {/* Top Header */}
      <header className="patient-header-bar">
        <div className="header-inner">
          <div className="patient-brand">
            <div className="patient-avatar">
              <User size={22} />
            </div>
            <div>
              <h1>Patient Care Portal</h1>
              <p>Digital Token & Queue Management Console</p>
            </div>
          </div>
          <button className="btn-back-home" onClick={handleLogout}>
            <ArrowLeft size={16} />
            <span>Back to Gateway</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation Pill Bar */}
      <nav className="patient-tabs-nav">
        <div className="tabs-nav-inner">
          <button
            className={`nav-pill-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'book' ? 'active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            <PlusCircle size={18} />
            <span>Book Token</span>
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'check' ? 'active' : ''}`}
            onClick={() => setActiveTab('check')}
          >
            <Search size={18} />
            <span>Check Status</span>
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'queues' ? 'active' : ''}`}
            onClick={() => setActiveTab('queues')}
          >
            <ListFilter size={18} />
            <span>Live Queues</span>
          </button>
        </div>
      </nav>

      {/* Main View Area */}
      <main className="patient-main-body">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="tab-pane fade-in">
            <div className="welcome-banner glass-card">
              <div className="banner-text">
                <h2>Welcome to CareQueue Patient Experience</h2>
                <p>Track your token status in real-time, view department queue lengths, and book new appointments without waiting in physical queues.</p>
              </div>
              <div className="banner-action">
                <button className="btn-accent-glow" onClick={() => setActiveTab('book')}>
                  <Ticket size={18} />
                  <span>Book New Token</span>
                </button>
              </div>
            </div>

            {/* Active Token Card Widget */}
            {recentToken ? (
              <div className="active-token-card glass-card">
                <div className="active-token-header">
                  <div className="token-badge-pill">
                    <Sparkles size={14} />
                    <span>Active Issued Token</span>
                  </div>
                  <span className="live-status-chip">{recentToken.status}</span>
                </div>

                <div className="token-content-grid">
                  <div className="token-num-display">
                    <span className="label">Token Number</span>
                    <h2 className="number-hero">#{recentToken.tokenNumber}</h2>
                  </div>
                  <div className="token-meta">
                    <div className="meta-item">
                      <Building2 size={16} className="meta-icon" />
                      <div>
                        <span className="meta-label">Department</span>
                        <p className="meta-val">{recentToken.department}</p>
                      </div>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} className="meta-icon" />
                      <div>
                        <span className="meta-label">Queue Position</span>
                        <p className="meta-val">#{recentToken.position}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="token-card-footer">
                  <Link to="/check" className="btn-link-action">
                    <span>Open QR Code & Full Ticket</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="empty-token-widget glass-card">
                <div className="empty-icon-circle">
                  <Ticket size={32} />
                </div>
                <h3>No Active Token Issued</h3>
                <p>Select a department below or click to generate your queue ticket.</p>
                <button className="btn-accent-glow" onClick={() => setActiveTab('book')}>
                  Book Appointment Now
                </button>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="patient-metrics-grid">
              <div className="metric-box glass-card">
                <div className="metric-icon blue">
                  <Building2 size={24} />
                </div>
                <div>
                  <span className="metric-lbl">Active Clinics</span>
                  <h4 className="metric-val">{queues.length} Departments</h4>
                </div>
              </div>
              <div className="metric-box glass-card">
                <div className="metric-icon teal">
                  <Clock size={24} />
                </div>
                <div>
                  <span className="metric-lbl">Avg Wait Time</span>
                  <h4 className="metric-val">~15 Minutes</h4>
                </div>
              </div>
              <div className="metric-box glass-card">
                <div className="metric-icon green">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="metric-lbl">Queue Efficiency</span>
                  <h4 className="metric-val">98% On-Time</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOK TOKEN TAB */}
        {activeTab === 'book' && (
          <div className="tab-pane fade-in">
            <div className="booking-layout-grid">
              <div className="booking-form-card glass-card">
                <div className="form-card-header">
                  <h2>
                    <PlusCircle size={22} className="accent-icon" />
                    <span>Generate Queue Token</span>
                  </h2>
                  <p>Provide your details to get assigned to an active department queue.</p>
                </div>

                <form onSubmit={handleBookToken} className="styled-booking-form">
                  <div className="input-group">
                    <label htmlFor="patientName">Full Name *</label>
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      placeholder="e.g. Sarah Jenkins"
                      value={bookingForm.patientName}
                      onChange={handleBookingChange}
                      required
                      disabled={isBooking}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="department">Target Department *</label>
                    <select
                      id="department"
                      name="department"
                      value={bookingForm.department}
                      onChange={handleBookingChange}
                      required
                      disabled={isBooking}
                    >
                      <option value="">Select Medical Department</option>
                      <option value="General">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </select>
                  </div>

                  {bookingMessage && (
                    <div className={`form-alert ${bookingMessage.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                      {bookingMessage.includes('successfully') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      <span>{bookingMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-submit-booking"
                    disabled={isBooking}
                  >
                    {isBooking ? 'Issuing Ticket...' : 'Generate Token & Voucher'}
                  </button>
                </form>
              </div>

              {/* Department Overview Panel */}
              <div className="dept-overview-panel glass-card">
                <h3>Live Department Status</h3>
                <p className="panel-sub">Current waiting list per clinic</p>
                <div className="dept-list-mini">
                  {queues.map((q) => (
                    <div key={q._id} className="dept-item-chip">
                      <div className="dept-chip-title">
                        <span className="dept-chip-name">{q.department}</span>
                        <span className="dept-chip-count">{q.tokens?.length || 0} Waiting</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${Math.min(((q.tokens?.length || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHECK STATUS TAB */}
        {activeTab === 'check' && (
          <div className="tab-pane fade-in">
            <div className="status-redirect-card glass-card">
              <Search size={48} className="search-hero-icon" />
              <h2>Ticket Lookup & QR Verification</h2>
              <p>Directly search your digital ticket status, view estimated call time, or scan your ticket QR code.</p>
              <Link to="/check" className="btn-accent-glow">
                <span>Launch QR Scanner & Status Tool</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {/* LIVE QUEUES TAB */}
        {activeTab === 'queues' && (
          <div className="tab-pane fade-in">
            <div className="section-head">
              <h2>All Active Department Queues</h2>
              <p>Real-time queue length across hospital wings</p>
            </div>
            <div className="queues-cards-grid">
              {queues.map((q) => (
                <div key={q._id} className="dept-stat-card glass-card">
                  <div className="dept-card-top">
                    <h3>{q.department}</h3>
                    <span className="dept-badge">{q.tokens?.length || 0} Patients</span>
                  </div>
                  <div className="dept-card-metrics">
                    <div className="sub-metric">
                      <span className="lbl">Est. Waiting Time</span>
                      <span className="val">{q.avgWaitTime || 15} minutes</span>
                    </div>
                  </div>
                  <button
                    className="btn-select-dept"
                    onClick={() => {
                      setBookingForm(prev => ({ ...prev, department: q.department }));
                      setActiveTab('book');
                    }}
                  >
                    <span>Book for {q.department}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PatientDashboard;

