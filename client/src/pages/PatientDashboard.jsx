import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      console.log('Connected');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await queueApi.getQueues();
      // Ensure data is always an array
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
      setBookingMessage('❌ Please fill in all fields');
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
      setBookingMessage(`✅ Token booked! Token Number: ${response.tokenNumber}`);
      setBookingForm({ patientName: '', department: '' });
      
      setTimeout(() => setActiveTab('home'), 2000);
    } catch (error) {
      setBookingMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="patient-dashboard">
      {/* Header */}
      <header className="patient-header">
        <div className="header-content">
          <div className="header-left">
            <h1>👤 Patient Portal</h1>
            <p>Manage your appointments and queue status</p>
          </div>
          <div className="header-right">
            <button className="logout-btn" onClick={handleLogout}>
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="patient-nav">
        <button
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          🏠 Home
        </button>
        <button
          className={`nav-tab ${activeTab === 'book' ? 'active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          📝 Book Token
        </button>
        <button
          className={`nav-tab ${activeTab === 'check' ? 'active' : ''}`}
          onClick={() => setActiveTab('check')}
        >
          🔍 Check Status
        </button>
        <button
          className={`nav-tab ${activeTab === 'queues' ? 'active' : ''}`}
          onClick={() => setActiveTab('queues')}
        >
          📊 View Queues
        </button>
      </nav>

      {/* Main Content */}
      <main className="patient-content">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="tab-content">
            <div className="welcome-section">
              <h2>Welcome to Hospital Queue Management System</h2>
              <p>Manage your appointments efficiently without waiting in physical lines.</p>
            </div>

            {recentToken ? (
              <div className="recent-token-card">
                <h3>📋 Your Recent Token</h3>
                <div className="token-info">
                  <div className="info-row">
                    <span className="label">Token Number:</span>
                    <span className="value">{recentToken.tokenNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Department:</span>
                    <span className="value">{recentToken.department}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Position:</span>
                    <span className="value">{recentToken.position}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className={`value status-${recentToken.status}`}>
                      {recentToken.status}
                    </span>
                  </div>
                </div>
                <button className="btn-primary">View Details</button>
              </div>
            ) : (
              <div className="no-token-card">
                <div className="empty-icon">🎫</div>
                <h3>No Active Token</h3>
                <p>Book a new token to get started</p>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab('book')}
                >
                  Book Your First Token
                </button>
              </div>
            )}

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h4>Total Queues</h4>
                  <p>{queues.length} Departments</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <h4>Avg Wait Time</h4>
                  <p>~15 minutes</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h4>Service Rate</h4>
                  <p>95% on-time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book Token Tab */}
        {activeTab === 'book' && (
          <div className="tab-content">
            <div className="booking-section">
              <h2>📝 Book Your Appointment Token</h2>
              <form onSubmit={handleBookToken} className="booking-form">
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name *</label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    placeholder="Enter your full name"
                    value={bookingForm.patientName}
                    onChange={handleBookingChange}
                    required
                    disabled={isBooking}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Department *</label>
                  <select
                    id="department"
                    name="department"
                    value={bookingForm.department}
                    onChange={handleBookingChange}
                    required
                    disabled={isBooking}
                  >
                    <option value="">Select a department</option>
                    <option value="General">General</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                  </select>
                </div>

                {bookingMessage && (
                  <div className={`booking-message ${bookingMessage.includes('✅') ? 'success' : 'error'}`}>
                    {bookingMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isBooking}
                >
                  {isBooking ? '⏳ Booking...' : '🎫 Book Token'}
                </button>
              </form>

              <div className="departments-info">
                <h3>Available Departments</h3>
                <div className="departments-list">
                  {Array.isArray(queues) && queues.map(queue => (
                    <div key={queue._id} className="dept-card">
                      <div className="dept-name">{queue.department}</div>
                      <div className="dept-waiting">Waiting: {queue.tokens.length}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Check Status Tab */}
        {activeTab === 'check' && (
          <div className="tab-content">
            <h2>🔍 Check Your Token Status</h2>
            <div className="check-section">
              <p>Go to Check Status page to scan QR code or enter token ID</p>
              <Link to="/check" className="btn-primary btn-link">
                Check Status →
              </Link>
            </div>
          </div>
        )}

        {/* View Queues Tab */}
        {activeTab === 'queues' && (
          <div className="tab-content">
            <h2>📊 View All Queues</h2>
            <div className="queues-grid">
              {Array.isArray(queues) && queues.map((queue) => (
                <div key={queue._id} className="queue-item">
                  <h3>{queue.department}</h3>
                  <div className="queue-stat">
                    <span className="stat-label">Waiting:</span>
                    <span className="stat-value">{queue.tokens.length}</span>
                  </div>
                  <div className="queue-stat">
                    <span className="stat-label">Avg Wait:</span>
                    <span className="stat-value">{queue.avgWaitTime}m</span>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('book')}
                  >
                    Book for This Department
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
