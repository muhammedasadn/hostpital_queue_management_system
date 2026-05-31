import React from 'react';
import QRCode from 'qrcode.react';

function QRDisplay({ tokenId, tokenNumber }) {
  // Encode the token ID in the QR code so it can be scanned and used to check status
  const qrValue = tokenId;

  const handleDownload = () => {
    const element = document.getElementById('qr-code');
    const canvas = element.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `token-${tokenNumber}.png`;
    link.click();
  };

  return (
    <div className="qr-display">
      <h4>QR Code</h4>
      <p className="qr-instruction">Scan this code to check your ticket status</p>
      <div id="qr-code">
        <QRCode value={qrValue} size={200} level="H" includeMargin={true} />
      </div>
      <div className="qr-text">Token ID: {tokenId}</div>
      <button onClick={handleDownload}>Download QR Code</button>
    </div>
  );
}

export default QRDisplay;
