import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Download, Copy, Check, QrCode as QrIcon } from 'lucide-react';

function QRDisplay({ tokenId, tokenNumber }) {
  const [copied, setCopied] = useState(false);
  const qrValue = tokenId || 'TOKEN_DEMO';

  const handleDownload = () => {
    const element = document.getElementById(`qr-code-${tokenNumber}`);
    if (!element) return;
    const canvas = element.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `carequeue-token-${tokenNumber}.png`;
    link.click();
  };

  const handleCopyId = () => {
    if (!tokenId) return;
    navigator.clipboard.writeText(tokenId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="qr-display-container">
      <div className="qr-header-title">
        <QrIcon size={18} className="qr-icon-accent" />
        <span>Verification Code</span>
      </div>
      
      <div className="qr-code-wrapper" id={`qr-code-${tokenNumber}`}>
        <QRCode 
          value={qrValue} 
          size={160} 
          level="H" 
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#0f172a"
        />
      </div>

      <div className="qr-id-bar">
        <span className="qr-id-label">ID: {tokenId ? `${tokenId.substring(0, 12)}...` : 'N/A'}</span>
        <button 
          type="button" 
          onClick={handleCopyId} 
          className="btn-copy-qr"
          title="Copy Token ID"
        >
          {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
        </button>
      </div>

      <button type="button" onClick={handleDownload} className="btn-download-qr">
        <Download size={15} /> Download Pass QR
      </button>
    </div>
  );
}

export default QRDisplay;

