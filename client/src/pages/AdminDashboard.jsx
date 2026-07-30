import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  PhoneCall, 
  Building2, 
  RefreshCw, 
  CheckCircle2, 
  ArrowLeft,
  Sliders,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import socket from '../socket';
import queueApi from '../api/queueApi';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callingCounterId, setCallingCounterId] = useState(null);

  useEffect(() => {
    fetchCounters();

    socket.on('connect', () => {
      console.log('Admin connected to server');
    });

    socket.on('tokenCalled', (data) => {
      console.log('Token called in admin:', data);
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
          <Link to="/" className="btn-back-link">
            <ArrowLeft size={18} /> Exit Admin Panel
          </Link>
          <div className="admin-badge">
            <ShieldCheck size={16} /> Hospital Operations Hub
          </div>
        </div>

        <div className="admin-hero">
          <div className="hero-titles">
            <h1>Counter Management Panel</h1>
            <p>Control station counters, monitor dispatch queues, and trigger live token calls across hospital counters.</p>
          </div>
          <button onClick={fetchCounters} className="btn-refresh-admin">
            <RefreshCw size={16} /> Sync Status
          </button>
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
              <span className="metric-label">System Readiness</span>
              <strong className="metric-number">100%</strong>
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

