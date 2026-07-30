import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  Ticket,
  Activity,
  Clock,
  Megaphone,
  LogOut,
  CheckCircle,
  Building2,
  Sparkles,
  Volume2
} from 'lucide-react';
import queueApi from '../api/queueApi';
import socket from '../socket';
import '../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [calledAlert, setCalledAlert] = useState(null);

  useEffect(() => {
    fetchData();

    socket.on('tokenBooked', (data) => {
      console.log('Token booked:', data);
      fetchData();
    });

    socket.on('tokenCalled', (data) => {
      console.log('Token called:', data);
      setCalledAlert(`Token #${data.tokenNumber} called for ${data.patientName} (${data.department})`);
      setTimeout(() => setCalledAlert(null), 4000);
      fetchData();
    });

    return () => {
      socket.off('tokenBooked');
      socket.off('tokenCalled');
    };
  }, []);

  const fetchData = async () => {
    try {
      const [queuesData, countersData] = await Promise.all([
        queueApi.getQueues(),
        queueApi.getCounterStatus()
      ]);
      setQueues(Array.isArray(queuesData) ? queuesData : []);
      setCounters(Array.isArray(countersData) ? countersData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCallNextToken = async (counterId) => {
    try {
      await queueApi.callNextToken(counterId);
      fetchData();
    } catch (error) {
      console.error('Error calling next token:', error);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const filteredQueues = selectedDept === 'ALL' 
    ? queues 
    : queues.filter(q => q._id === selectedDept || q.department === selectedDept);

  const totalWaiting = queues.reduce((sum, q) => sum + (q.tokens?.length || 0), 0);
  const activeCountersCount = counters.filter((c) => c.currentToken).length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Activity className="loading-spinner" size={36} />
        <p>Loading CareQueue Doctor Workspace...</p>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-layout">
      {/* Called Patient Toast Banner */}
      {calledAlert && (
        <div className="called-toast-banner">
          <Volume2 size={20} className="toast-icon" />
          <span>{calledAlert}</span>
        </div>
      )}

      {/* Doctor Header */}
      <header className="doctor-header-bar">
        <div className="header-inner">
          <div className="header-brand-title">
            <div className="portal-icon-badge">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1>Doctor & Staff Dispatch Portal</h1>
              <p>Real-Time Patient Flow Management • Counter Dispatch Console</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="doctor-profile-chip">
              <span className="online-indicator"></span>
              <span className="doc-role">On-Duty Staff</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="doctor-content-container">
        {/* Quick Stats Grid */}
        <section className="stats-summary-grid">
          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper blue">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Waiting Patients</span>
              <h3 className="stat-number">{totalWaiting}</h3>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper teal">
              <Building2 size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Active Departments</span>
              <h3 className="stat-number">{queues.length}</h3>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper green">
              <Activity size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Counters Serving</span>
              <h3 className="stat-number">{activeCountersCount} / {counters.length}</h3>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-wrapper amber">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <span className="stat-label">Estimated Wait</span>
              <h3 className="stat-number">~15 mins</h3>
            </div>
          </div>
        </section>

        {/* Dashboard Main Workspace Layout */}
        <div className="workspace-columns">
          {/* Main Queue & Counter Management */}
          <main className="primary-workspace">
            {/* Department Quick Filter */}
            <div className="filter-pill-bar glass-card">
              <span className="filter-title">Filter Department:</span>
              <button
                className={`filter-chip ${selectedDept === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedDept('ALL')}
              >
                All ({queues.length})
              </button>
              {queues.map((q) => (
                <button
                  key={q._id}
                  className={`filter-chip ${selectedDept === q._id ? 'active' : ''}`}
                  onClick={() => setSelectedDept(q._id)}
                >
                  {q.department} ({q.tokens?.length || 0})
                </button>
              ))}
            </div>

            {/* Counter Control Section */}
            <section className="section-block">
              <div className="section-title-row">
                <h2>
                  <Megaphone size={20} />
                  <span>Dispatch Counters & Call Control</span>
                </h2>
                <span className="badge-count-pill">{counters.length} Counters Configured</span>
              </div>

              <div className="counters-card-grid">
                {counters.map((counter) => (
                  <div key={counter._id} className={`counter-panel-card glass-card ${counter.currentToken ? 'serving-active' : ''}`}>
                    <div className="counter-card-header">
                      <div className="counter-num-badge">Counter {counter.counterNumber}</div>
                      <span className="counter-dept-tag">{counter.department}</span>
                    </div>

                    {counter.currentToken ? (
                      <div className="counter-active-token">
                        <div className="pulse-serving-indicator">
                          <span className="dot"></span>
                          <span>Currently Serving</span>
                        </div>
                        <h3 className="token-huge-num">#{counter.currentToken.tokenNumber}</h3>
                        <p className="patient-name-display">{counter.currentToken.patientName}</p>
                      </div>
                    ) : (
                      <div className="counter-idle-state">
                        <CheckCircle size={28} className="idle-icon" />
                        <p className="idle-text">Counter Available</p>
                        <span className="idle-subtext">Click below to dispatch next patient</span>
                      </div>
                    )}

                    <button
                      className="btn-call-next-huge"
                      onClick={() => handleCallNextToken(counter._id)}
                    >
                      <Megaphone size={18} />
                      <span>Call Next Patient</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Queues Detail Section */}
            <section className="section-block">
              <div className="section-title-row">
                <h2>
                  <Ticket size={20} />
                  <span>Live Department Patient Queues</span>
                </h2>
              </div>

              <div className="department-queues-list">
                {filteredQueues.map((queue) => (
                  <div key={queue._id} className="dept-queue-card glass-card">
                    <div className="dept-card-header">
                      <div>
                        <h3>{queue.department} Department</h3>
                        <span className="queue-wait-subtitle">
                          {queue.tokens?.length || 0} patient(s) in line
                        </span>
                      </div>
                      <button
                        className="btn-call-dept-direct"
                        onClick={() => {
                          const counter = counters.find((c) => c.department === queue.department);
                          if (counter) handleCallNextToken(counter._id);
                        }}
                      >
                        <Megaphone size={16} />
                        <span>Dispatch Next</span>
                      </button>
                    </div>

                    {queue.tokens && queue.tokens.length > 0 ? (
                      <div className="queue-table-wrapper">
                        <table className="queue-table">
                          <thead>
                            <tr>
                              <th>Queue Pos</th>
                              <th>Token #</th>
                              <th>Patient Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {queue.tokens.map((token, idx) => (
                              <tr key={token._id || idx} className={idx === 0 ? 'next-up-row' : ''}>
                                <td className="pos-col">
                                  <span className="pos-badge">#{idx + 1}</span>
                                </td>
                                <td className="token-col">{token.tokenNumber}</td>
                                <td className="name-col">{token.patientName}</td>
                                <td className="status-col">
                                  <span className={`status-badge ${token.status}`}>
                                    {token.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-queue-notice">
                        <Sparkles size={24} className="empty-icon" />
                        <p>No waiting patients in {queue.department} department.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;

