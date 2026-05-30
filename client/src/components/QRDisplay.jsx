import React from 'react';
import QRCode from 'qrcode.react';

function QRDisplay({ tokenId, tokenNumber }) {
  const qrValue = `token-${tokenId}-${tokenNumber}`;

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
      <div id="qr-code">
        <QRCode value={qrValue} size={200} level="H" includeMargin={true} />
      </div>
      <button onClick={handleDownload}>Download QR Code</button>
    </div>
  );
}

export default QRDisplay;
