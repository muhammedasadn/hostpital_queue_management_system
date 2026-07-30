import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { 
  Search, 
  QrCode, 
  Ticket as TicketIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Building2, 
  User, 
  Calendar,
  Layers,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import queueApi from '../api/queueApi';
import socket from '../socket';
import '../styles/CheckTicket.css';

function CheckTicket() {
  const [tokenId, setTokenId] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanningQR, setScanningQR] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (ticket) {
      const unsubscribe = socket.on('tokenCalled', (data) => {
        if (data._id === ticket._id) {
          setTicket(data);
        }
      });

      return () => {
        socket.off('tokenCalled', unsubscribe);
      };
    }
  }, [ticket]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!tokenId.trim()) {
      setError('Please enter a token ID');
      return;
    }

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const result = await queueApi.getTokenStatus(tokenId.trim());
      setTicket(result);
    } catch (err) {
      setError('Token not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setScanningQR(true);
    setError('');

    try {
      const img = new Image();
      
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

          if (decodedQR && decodedQR.data) {
            const scannedTokenId = decodedQR.data;
            setTokenId(scannedTokenId);
            
            setLoading(true);
            try {
              const result = await queueApi.getTokenStatus(scannedTokenId);
              setTicket(result);
              setError('');
            } catch (err) {
              setError('Token not found. The QR code may be invalid.');
            } finally {
              setLoading(false);
            }
          } else {
            setError('Unable to read QR code. Please try another image or enter token ID manually.');
          }
        } catch (err) {
          setError('Failed to process QR code image. Please try again.');
          console.error('QR scan error:', err);
        } finally {
          setScanningQR(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load image. Please try a different file.');
        setScanningQR(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError('Error processing file. Please try again.');
      setScanningQR(false);
      console.error('File error:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return (
          <div className="status-badge-glass waiting">
            <Clock size={16} />
            <span>Waiting in Queue</span>
          </div>
        );
      case 'called':
        return (
          <div className="status-badge-glass called animate-pulse-glow">
            <Bell size={16} />
            <span>Called to Counter!</span>
          </div>
        );
      case 'completed':
        return (
          <div className="status-badge-glass completed">
            <CheckCircle2 size={16} />
            <span>Consultation Completed</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="status-badge-glass cancelled">
            <AlertTriangle size={16} />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="status-badge-glass default">
            <span>{status}</span>
          </div>
        );
    }
  };

  return (
    <div className="check-ticket-page">
      <div className="check-ticket-container">
        
        {/* Page Top Header */}
        <div className="check-ticket-topbar">
          <Link to="/" className="btn-back-link">
            <ArrowLeft size={18} /> Back to Gateway
          </Link>
          <div className="header-badge-tag">
            <Sparkles size={14} /> Live Verification
          </div>
        </div>

        <div className="check-hero-header">
          <h1>Track Digital Voucher</h1>
          <p>Scan your token QR code or enter your reference token ID to retrieve real-time status</p>
        </div>

        {/* Input & Search Glass Panel */}
        <div className="search-glass-card glass-card">
          <form onSubmit={handleSearch} className="search-form-modern">
            <div className="search-field-wrapper">
              <Search className="field-icon" size={20} />
              <input
                type="text"
                placeholder="Enter Token ID (e.g., 0.18274619)"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="modern-token-input"
              />
              <button type="submit" disabled={loading} className="modern-search-btn">
                {loading ? <RefreshCw className="spin-icon" size={18} /> : 'Track Token'}
              </button>
            </div>

            <div className="divider-glass">
              <span>OR</span>
            </div>

            <div className="qr-scan-wrapper">
              <label htmlFor="qr-file-input" className="qr-dropzone">
                <QrCode size={28} className="qr-icon" />
                <div className="dropzone-text">
                  <span className="primary-text">
                    {scanningQR ? 'Analyzing QR Code...' : 'Upload or Scan QR Code'}
                  </span>
                  <span className="sub-text">PNG, JPG, or Screenshots supported</span>
                </div>
              </label>
              <input
                ref={fileInputRef}
                id="qr-file-input"
                type="file"
                accept="image/*"
                onChange={handleQRScan}
                disabled={scanningQR}
                className="hidden-file-input"
              />
            </div>
          </form>

          {error && (
            <div className="search-error-banner">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Ticket Digital Pass Render */}
        {ticket && (
          <div className="ticket-voucher-wrapper fade-in">
            <div className="digital-voucher-card glass-card">
              
              {/* Ticket Top Notch */}
              <div className="voucher-header">
                <div className="voucher-brand">
                  <TicketIcon size={22} className="brand-icon" />
                  <span>Hospital Digital Pass</span>
                </div>
                {getStatusBadge(ticket.status)}
              </div>

              {ticket.status === 'called' && (
                <div className="urgent-call-alert">
                  <Bell className="shake-icon" size={20} />
                  <div>
                    <strong>Your Turn Now!</strong>
                    <p>Please proceed directly to the designated department counter.</p>
                  </div>
                </div>
              )}

              {/* Voucher Main Content */}
              <div className="voucher-body">
                <div className="token-hero-box">
                  <span className="hero-label">Token Number</span>
                  <div className="hero-number">{ticket.tokenNumber}</div>
                </div>

                <div className="voucher-details-grid">
                  <div className="voucher-detail-item">
                    <div className="detail-icon-wrap"><Building2 size={18} /></div>
                    <div>
                      <span className="detail-label">Department</span>
                      <strong className="detail-val">{ticket.department}</strong>
                    </div>
                  </div>

                  <div className="voucher-detail-item">
                    <div className="detail-icon-wrap"><User size={18} /></div>
                    <div>
                      <span className="detail-label">Patient Name</span>
                      <strong className="detail-val">{ticket.patientName}</strong>
                    </div>
                  </div>

                  <div className="voucher-detail-item">
                    <div className="detail-icon-wrap"><Layers size={18} /></div>
                    <div>
                      <span className="detail-label">Queue Position</span>
                      <strong className="detail-val highlight">{ticket.position || 'Active'}</strong>
                    </div>
                  </div>

                  <div className="voucher-detail-item">
                    <div className="detail-icon-wrap"><Calendar size={18} /></div>
                    <div>
                      <span className="detail-label">Booked Date</span>
                      <strong className="detail-val">
                        {new Date(ticket.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voucher Card Footer */}
              <div className="voucher-footer">
                <div className="ticket-id-tag">Reference: {ticket._id}</div>
                <button
                  onClick={() => {
                    setTicket(null);
                    setTokenId('');
                  }}
                  className="btn-reset-ticket"
                >
                  <RefreshCw size={16} /> Check Another Pass
                </button>
              </div>

            </div>
          </div>
        )}

        {!ticket && !error && !loading && (
          <div className="check-empty-state glass-card">
            <div className="empty-qr-placeholder">
              <QrCode size={48} />
            </div>
            <h3>Ready to Verify</h3>
            <p>Your ticket details and live queue status will be rendered here once scanned.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default CheckTicket;

