import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  RefreshCw, 
  Clock, 
  Users, 
  Building2, 
  ArrowLeft,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import socket from '../socket';
import queueApi from '../api/queueApi';
import QueueCard from '../components/QueueCard';
import '../styles/TokenStatus.css';

function TokenStatus() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    fetchQueues();

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('tokenCalled', () => {
      fetchQueues();
    });

    socket.on('queueUpdated', () => {
      fetchQueues();
    });

    return () => {
      socket.off('tokenCalled');
      socket.off('queueUpdated');
    };
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await queueApi.getQueues();
      setQueues(data);
    } catch (error) {
      console.error('Error fetching live queues:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalWaiting = queues.reduce((acc, q) => acc + (q.tokens?.length || 0), 0);
  const totalDepartments = queues.length;

  const filteredQueues = queues.filter((queue) => {
    const matchesDept = selectedDept === 'ALL' || queue.department?.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch = !searchTerm || queue.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      queue.tokens?.some(t => t.tokenNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="token-status-page">
      <div className="status-container">
        
        {/* Navigation & Header */}
        <div className="status-topbar">
          <Link to="/patient-dashboard" className="btn-back-link">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="status-badge-live">
            <Radio size={14} className="spin-icon text-cyan" /> Socket Live Updates
          </div>
        </div>

        <div className="status-hero">
          <div className="hero-title-group">
            <h1>Hospital Queue Monitor</h1>
            <p>Real-time queue tracking across all clinical OPD departments and patient counters.</p>
          </div>
          <button onClick={fetchQueues} className="btn-refresh-status">
            <RefreshCw size={16} /> Sync Queues
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="status-metrics-grid">
          <div className="status-metric-card glass-card">
            <div className="metric-icon-wrap blue">
              <Users size={22} />
            </div>
            <div>
              <span className="metric-lbl">Total Waiting Patients</span>
              <strong className="metric-val">{totalWaiting}</strong>
            </div>
          </div>

          <div className="status-metric-card glass-card">
            <div className="metric-icon-wrap teal">
              <Building2 size={22} />
            </div>
            <div>
              <span className="metric-lbl">Active OPD Departments</span>
              <strong className="metric-val">{totalDepartments}</strong>
            </div>
          </div>

          <div className="status-metric-card glass-card">
            <div className="metric-icon-wrap green">
              <Clock size={22} />
            </div>
            <div>
              <span className="metric-lbl">Average Turnaround</span>
              <strong className="metric-val">~12 Mins</strong>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="status-controls-row">
          <div className="search-box-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by department, token or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="dept-filter-tabs">
            <button 
              className={`filter-chip ${selectedDept === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedDept('ALL')}
            >
              All Departments
            </button>
            {queues.map(q => (
              <button 
                key={q._id || q.department} 
                className={`filter-chip ${selectedDept === q.department ? 'active' : ''}`}
                onClick={() => setSelectedDept(q.department)}
              >
                {q.department}
              </button>
            ))}
          </div>
        </div>

        {/* Queues Display Grid */}
        {loading ? (
          <div className="status-loading">
            <RefreshCw className="spin-icon" size={32} />
            <p>Fetching real-time hospital queues...</p>
          </div>
        ) : filteredQueues.length > 0 ? (
          <div className="queues-display-grid">
            {filteredQueues.map((queue) => (
              <QueueCard key={queue._id || queue.department} queue={queue} />
            ))}
          </div>
        ) : (
          <div className="status-empty-card glass-card">
            <Activity size={48} className="empty-icon" />
            <h3>No Queues Match Your Search</h3>
            <p>Try clearing your search query or selecting a different department filter.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedDept('ALL'); }} className="btn-secondary">
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default TokenStatus;
