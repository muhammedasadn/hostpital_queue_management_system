import React from 'react';
import { Building2, Clock, Users, Ticket, Activity } from 'lucide-react';

function QueueCard({ queue }) {
  const waitingCount = queue.tokens?.length || 0;
  const avgWait = queue.avgWaitTime || 15;

  return (
    <div className="queue-card-glass glass-card">
      <div className="queue-card-header">
        <div className="dept-title-wrap">
          <div className="dept-icon-bg">
            <Building2 size={20} className="dept-icon" />
          </div>
          <div>
            <h3>{queue.department} Department</h3>
            <span className="queue-live-pulse">
              <span className="pulse-dot"></span> Live Queue Tracking
            </span>
          </div>
        </div>
        <span className="queue-count-badge">
          {waitingCount} {waitingCount === 1 ? 'Patient' : 'Patients'}
        </span>
      </div>

      <div className="queue-card-stats">
        <div className="stat-chip">
          <Clock size={16} className="text-cyan" />
          <div>
            <span className="chip-lbl">Avg Wait</span>
            <strong className="chip-val">~{avgWait} mins</strong>
          </div>
        </div>

        <div className="stat-chip">
          <Users size={16} className="text-teal" />
          <div>
            <span className="chip-lbl">In Line</span>
            <strong className="chip-val">{waitingCount}</strong>
          </div>
        </div>
      </div>

      <div className="waiting-tokens-block">
        <div className="block-title">
          <Ticket size={16} />
          <span>Next in Queue</span>
        </div>

        {waitingCount > 0 ? (
          <ul className="tokens-mini-list">
            {queue.tokens.slice(0, 5).map((token, idx) => (
              <li key={token._id || idx} className="token-mini-item">
                <span className="mini-num-badge">{token.tokenNumber}</span>
                <span className="mini-patient-name">{token.patientName}</span>
                <span className="mini-pos">#{idx + 1}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-queue-msg">
            <Activity size={24} className="empty-icon" />
            <p>No waiting tokens currently in line</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueCard;

