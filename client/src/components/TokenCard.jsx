import React from 'react';
import { Ticket, Building2, User, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import QRDisplay from './QRDisplay';

function TokenCard({ token }) {
  if (!token) return null;

  return (
    <div className="token-card-glass glass-card">
      <div className="token-card-banner">
        <div className="banner-logo">
          <ShieldCheck size={20} className="shield-icon" />
          <span>CareQueue Digital Pass</span>
        </div>
        <span className={`status-badge ${token.status || 'waiting'}`}>
          {token.status || 'Waiting'}
        </span>
      </div>

      <div className="token-card-main">
        <div className="token-number-hero">
          <span className="hero-lbl">YOUR TOKEN NUMBER</span>
          <h2 className="hero-token-num">{token.tokenNumber}</h2>
        </div>

        <div className="token-meta-grid">
          <div className="meta-item">
            <User size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Patient</span>
              <strong className="meta-value">{token.patientName}</strong>
            </div>
          </div>

          <div className="meta-item">
            <Building2 size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Department</span>
              <strong className="meta-value">{token.department}</strong>
            </div>
          </div>

          <div className="meta-item">
            <Clock size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Est. Wait</span>
              <strong className="meta-value">~{token.estimatedWaitTime || 15} mins</strong>
            </div>
          </div>

          <div className="meta-item">
            <Ticket size={16} className="meta-icon" />
            <div>
              <span className="meta-label">Queue Position</span>
              <strong className="meta-value">#{token.position || 1}</strong>
            </div>
          </div>
        </div>

        <div className="token-qr-section">
          <QRDisplay tokenId={token._id} tokenNumber={token.tokenNumber} />
        </div>
      </div>

      <div className="token-card-footer">
        <CheckCircle2 size={16} className="text-teal" />
        <p>Please present this digital ticket or QR code when your number is called at the station counter.</p>
      </div>
    </div>
  );
}

export default TokenCard;

