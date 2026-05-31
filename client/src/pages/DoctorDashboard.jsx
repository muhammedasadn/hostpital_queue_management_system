import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import queueApi from '../api/queueApi';
import socket from '../socket';
import '../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    fetchData();

    socket.on('tokenBooked', (data) => {
      console.log('Token booked:', data);
      fetchData();
    });

    socket.on('tokenCalled', (data) => {
      console.log('Token called:', data);
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
      setQueues(queuesData);
      setCounters(countersData);
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="doctor-header">
        <div className="header-content">
          <div className="header-left">
            <h1>👨‍⚕️ Doctor / Admin Portal</h1>
            <p>Queue Management & Patient Flow Control</p>
          </div>
          <div className="header-right">
            <span className="user-role">Doctor</span>
            <button className="logout-btn" onClick={handleLogout}>
              ← Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Sidebar - Queue Overview */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>📊 Queue Overview</h3>
            <div className="queue-overview">
              {queues.map((queue) => (
                <div
                  key={queue._id}
                  className={`queue-badge ${selectedDept === queue._id ? 'active' : ''}`}
                  onClick={() => setSelectedDept(queue._id)}
                >
                  <div className="badge-name">{queue.department}</div>
                  <div className="badge-count">{queue.tokens.length} waiting</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>⚙️ Counters</h3>
            <div className="counters-list">
              {counters.map((counter) => (
                <div key={counter._id} className="counter-item">
                  <div className="counter-info">
                    <span className="counter-name">Counter {counter.counterNumber}</span>
                    <span className="counter-dept">{counter.department}</span>
                  </div>
                  {counter.currentToken ? (
                    <div className="counter-token">
                      Token #{counter.currentToken.tokenNumber}
                    </div>
                  ) : (
                    <div className="counter-idle">Idle</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-data">
                <h4>Total Waiting</h4>
                <p className="stat-value">
                  {queues.reduce((sum, q) => sum + q.tokens.length, 0)}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-data">
                <h4>Departments</h4>
                <p className="stat-value">{queues.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-data">
                <h4>Active Counters</h4>
                <p className="stat-value">
                  {counters.filter((c) => c.currentToken).length} / {counters.length}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-data">
                <h4>Avg Wait Time</h4>
                <p className="stat-value">15m</p>
              </div>
            </div>
          </div>

          {/* Queue Details */}
          <section className="queue-section">
            <h2>🏥 Department Queues</h2>
            <div className="queues-container">
              {queues.map((queue) => (
                <div key={queue._id} className="queue-card">
                  <div className="queue-header">
                    <h3>{queue.department}</h3>
                    <span className="queue-count">{queue.tokens.length} patients</span>
                  </div>

                  {queue.tokens.length > 0 ? (
                    <>
                      <div className="queue-list">
                        <div className="queue-list-header">
                          <span>Position</span>
                          <span>Token #</span>
                          <span>Patient Name</span>
                          <span>Status</span>
                        </div>
                        {queue.tokens.slice(0, 5).map((token, idx) => (
                          <div key={token._id} className="queue-row">
                            <span className="position">#{idx + 1}</span>
                            <span className="token-num">{token.tokenNumber}</span>
                            <span className="patient-name">{token.patientName}</span>
                            <span className={`status status-${token.status}`}>
                              {token.status}
                            </span>
                          </div>
                        ))}
                      </div>

                      {queue.tokens.length > 5 && (
                        <div className="more-patients">
                          +{queue.tokens.length - 5} more patients
                        </div>
                      )}

                      <button
                        className="btn-call-next"
                        onClick={() => {
                          const counter = counters.find(
                            (c) => c.department === queue.department
                          );
                          if (counter) handleCallNextToken(counter._id);
                        }}
                      >
                        📢 Call Next Patient
                      </button>
                    </>
                  ) : (
                    <div className="empty-queue">
                      <p>✅ No patients waiting</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Counter Management */}
          <section className="counter-section">
            <h2>🔢 Counter Management</h2>
            <div className="counters-grid">
              {counters.map((counter) => (
                <div key={counter._id} className="counter-card">
                  <div className="counter-header">
                    <h3>Counter {counter.counterNumber}</h3>
                    <span className="department-badge">{counter.department}</span>
                  </div>

                  {counter.currentToken ? (
                    <div className="current-token">
                      <p className="label">Currently Serving:</p>
                      <div className="token-display">
                        <h4>Token #{counter.currentToken.tokenNumber}</h4>
                        <p>{counter.currentToken.patientName}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="counter-idle-state">
                      <p>⚪ Idle</p>
                    </div>
                  )}

                  <button
                    className="btn-call-next btn-full"
                    onClick={() => handleCallNextToken(counter._id)}
                  >
                    Call Next Patient
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;
