import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
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
    e.preventDefault();
    if (!tokenId.trim()) {
      setError('Please enter a token ID');
      return;
    }

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const result = await queueApi.getTokenStatus(tokenId);
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
          // Create canvas and context
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Decode QR code
          const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

          if (decodedQR && decodedQR.data) {
            const scannedTokenId = decodedQR.data;
            setTokenId(scannedTokenId);
            
            // Auto-search for the token
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return '#FF9800';
      case 'called':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return 'Waiting in Queue';
      case 'called':
        return 'Called to Counter';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="check-ticket">
      <div className="check-ticket-header">
        <h1>Check Your Ticket Status</h1>
        <p>Enter your token ID or scan the QR code to view your ticket information</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Enter Token ID (e.g., 0.123456789)"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="token-input"
          />
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="or-divider">OR</div>

        <div className="qr-upload">
          <label htmlFor="qr-file" className="qr-upload-label">
            {scanningQR ? '⏳ Scanning QR Code...' : '📱 Scan QR Code'}
          </label>
          <input
            ref={fileInputRef}
            id="qr-file"
            type="file"
            accept="image/*"
            onChange={handleQRScan}
            disabled={scanningQR}
            className="qr-file-input"
          />
          <p className="qr-hint">Upload a photo of the QR code or take a screenshot</p>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {ticket && (
        <div className="ticket-display">
          <div className="ticket-status-badge" style={{ borderColor: getStatusColor(ticket.status) }}>
            <div
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(ticket.status) }}
            />
            <span className="status-text">{getStatusText(ticket.status)}</span>
          </div>

          <div className="ticket-info-grid">
            <div className="ticket-info-item">
              <label>Token Number</label>
              <div className="ticket-value large">{ticket.tokenNumber}</div>
            </div>

            <div className="ticket-info-item">
              <label>Department</label>
              <div className="ticket-value">{ticket.department}</div>
            </div>

            <div className="ticket-info-item">
              <label>Patient Name</label>
              <div className="ticket-value">{ticket.patientName}</div>
            </div>

            <div className="ticket-info-item">
              <label>Position in Queue</label>
              <div className="ticket-value highlight">{ticket.position || 'N/A'}</div>
            </div>

            <div className="ticket-info-item">
              <label>Booked At</label>
              <div className="ticket-value">
                {new Date(ticket.bookedAt).toLocaleString()}
              </div>
            </div>

            {ticket.status === 'called' && (
              <div className="ticket-info-item alert">
                <label>⚠️ Alert</label>
                <div className="alert-text">Your token has been called! Please proceed to the counter.</div>
              </div>
            )}
          </div>

          <div className="ticket-actions">
            <button
              onClick={() => {
                setTicket(null);
                setTokenId('');
              }}
              className="reset-btn"
            >
              Check Another Token
            </button>
          </div>
        </div>
      )}

      {!ticket && !error && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <p>Enter a token ID or scan a QR code above to check your ticket status</p>
        </div>
      )}
    </div>
  );
}

export default CheckTicket;

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return '#FF9800';
      case 'called':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return 'Waiting in Queue';
      case 'called':
        return 'Called to Counter';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="check-ticket">
      <div className="check-ticket-header">
        <h1>Check Your Ticket Status</h1>
        <p>Enter your token ID or scan the QR code to view your ticket information</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Enter Token ID (e.g., token-123-45)"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="token-input"
          />
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="or-divider">OR</div>

        <div className="qr-upload">
          <label htmlFor="qr-file" className="qr-upload-label">
            📱 Scan QR Code
          </label>
          <input
            ref={fileInputRef}
            id="qr-file"
            type="file"
            accept="image/*"
            onChange={handleQRScan}
            className="qr-file-input"
          />
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {ticket && (
        <div className="ticket-display">
          <div className="ticket-status-badge" style={{ borderColor: getStatusColor(ticket.status) }}>
            <div
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(ticket.status) }}
            />
            <span className="status-text">{getStatusText(ticket.status)}</span>
          </div>

          <div className="ticket-info-grid">
            <div className="ticket-info-item">
              <label>Token Number</label>
              <div className="ticket-value large">{ticket.tokenNumber}</div>
            </div>

            <div className="ticket-info-item">
              <label>Department</label>
              <div className="ticket-value">{ticket.department}</div>
            </div>

            <div className="ticket-info-item">
              <label>Patient Name</label>
              <div className="ticket-value">{ticket.patientName}</div>
            </div>

            <div className="ticket-info-item">
              <label>Position in Queue</label>
              <div className="ticket-value highlight">{ticket.position || 'N/A'}</div>
            </div>

            <div className="ticket-info-item">
              <label>Booked At</label>
              <div className="ticket-value">
                {new Date(ticket.bookedAt).toLocaleString()}
              </div>
            </div>

            {ticket.status === 'called' && (
              <div className="ticket-info-item alert">
                <label>⚠️ Alert</label>
                <div className="alert-text">Your token has been called! Please proceed to the counter.</div>
              </div>
            )}
          </div>

          <div className="ticket-actions">
            <button
              onClick={() => {
                setTicket(null);
                setTokenId('');
              }}
              className="reset-btn"
            >
              Check Another Token
            </button>
          </div>
        </div>
      )}

      {!ticket && !error && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <p>Enter a token ID above to check your ticket status</p>
        </div>
      )}
    </div>
  );
}

export default CheckTicket;
