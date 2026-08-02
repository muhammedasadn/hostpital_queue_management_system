import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  PhoneCall, 
  Building2, 
  RefreshCw, 
  CheckCircle2, 
  LogOut,
  Sliders,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import queueApi from '../api/queueApi';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callingCounterId, setCallingCounterId] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCounters();

    socket.on('tokenCalled', () => {
      fetchCounters();
    });

    socket.on('queueUpdated', () => {
      fetchCounters();
    });

    return () => {
      socket.off('tokenCalled');
      socket.off('queueUpdated');
    };
  }, []);

  const fetchCounters = async () => {
    try {
      const data = await queueApi.getCounterStatus();
      setCounters(data);
    } catch (error) {
      console.error('Error fetching counters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async (counterId) => {
    setCallingCounterId(counterId);
    try {
      await queueApi.callNextToken(counterId);
      await fetchCounters();
    } catch (error) {
      console.error('Error calling next token:', error);
    } finally {
      setCallingCounterId(null);
    }
  };

  const handleResetQueues = async () => {
    if (!window.confirm('⚠️ WARNING: Are you sure you want to reset all hospital patient queues? This will clear all active tokens!')) {
      return;
    }

    try {
      setResetting(true);
      await queueApi.resetQueues();
      setMessage('All hospital queues and counters have been reset successfully.');
      await fetchCounters();
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Error resetting queues:', error);
      setMessage('Failed to reset system queues.');
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeCounterCount = counters.filter(c => c.currentToken).length;

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <RefreshCw className="spin-icon" size={32} />
        <p>Loading Admin Counter Systems...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        
        {/* Navigation & Header */}
        <div className="admin-topbar">
          <div className="admin-badge">
            <ShieldCheck size={16} /> Hospital System Administrator Hub
          </div>
          <button className="btn-back-link" onClick={handleLogout} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <LogOut size={18} /> Sign Out ({user?.name || 'Admin'})
          </button>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={20} />
            <span>{message}</span>
          </div>
        )}

        <div className="admin-hero">
          <div className="hero-titles">
            <h1>Enterprise Admin Management</h1>
            <p>Control station counters, monitor dispatch queues, and execute system-wide OPD queue resets.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={fetchCounters} className="btn-refresh-admin">
              <RefreshCw size={16} /> Sync Status
            </button>
            <button
              onClick={handleResetQueues}
              disabled={resetting}
              className="btn-refresh-admin"
              style={{ backgroundColor: '#ef4444', borderColor: '#dc2626', color: 'white' }}
            >
              <RotateCcw size={16} /> {resetting ? 'Resetting...' : 'Reset All Queues'}
            </button>
          </div>
        </div>

        {/* Live Admin Metrics */}
        <div className="admin-metrics-grid">
          <div className="admin-metric-card glass-card">
            <div className="metric-icon-wrap blue">
              <Sliders size={22} />
            </div>
            <div>
              <span className="metric-label">Total Counters</span>
              <strong className="metric-number">{counters.length}</strong>
            </div>
          </div>

          <div className="admin-metric-card glass-card">
            <div className="metric-icon-wrap teal">
              <Activity size={22} />
            </div>
            <div>
              <span className="metric-label">Active Servicing</span>
              <strong className="metric-number">{activeCounterCount}</strong>
            </div>
          </div>

          <div className="admin-metric-card glass-card">
            <div className="metric-icon-wrap green">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="metric-label">Security Shield</span>
              <strong className="metric-number">JWT Active</strong>
            </div>
          </div>
        </div>

        {/* Counters Control Grid */}
        <div className="counters-section">
          <div className="section-title-wrap">
            <h2>Active Station Counters</h2>
            <span className="counter-count-tag">{counters.length} Counters Online</span>
          </div>

          <div className="counters-cards-grid">
            {counters.map((counter) => {
              const isServing = !!counter.currentToken;
              const isCallingThis = callingCounterId === counter._id;

              return (
                <div key={counter._id} className="counter-glass-card glass-card">
                  <div className="counter-card-header">
                    <div className="counter-title">
                      <Building2 size={20} className="counter-icon" />
                      <h3>Counter #{counter.counterNumber}</h3>
                    </div>
                    <span className={`counter-status-tag ${isServing ? 'serving' : 'idle'}`}>
                      {isServing ? 'Servicing' : 'Idle'}
                    </span>
                  </div>

                  <div className="counter-card-body">
                    {counter.currentToken ? (
                      <div className="active-token-box">
                        <span className="active-label">Now Serving Token</span>
                        <div className="token-hero-num">{counter.currentToken.tokenNumber}</div>
                        <div className="token-details-mini">
                          <p><strong>Patient:</strong> {counter.currentToken.patientName}</p>
                          <p><strong>Dept:</strong> {counter.currentToken.department}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="idle-counter-box">
                        <Clock size={32} className="idle-icon" />
                        <p>No active token at counter</p>
                      </div>
                    )}
                  </div>

                  <div className="counter-card-footer">
                    <button 
                      onClick={() => handleCallNext(counter._id)}
                      disabled={isCallingThis}
                      className="btn-call-next"
                    >
                      {isCallingThis ? (
                        <>
                          <RefreshCw size={16} className="spin-icon" /> Dispatching...
                        </>
                      ) : (
                        <>
                          <PhoneCall size={16} /> Dispatch Next Patient
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
