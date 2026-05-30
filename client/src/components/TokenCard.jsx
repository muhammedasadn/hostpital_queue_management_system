import React from 'react';
import QRDisplay from './QRDisplay';

function TokenCard({ token }) {
  return (
    <div className="token-card">
      <h3>Your Token</h3>
      <div className="token-info">
        <p className="token-number">Token: {token.tokenNumber}</p>
        <p>
          <strong>Department:</strong> {token.department}
        </p>
        <p>
          <strong>Patient Name:</strong> {token.patientName}
        </p>
        <p>
          <strong>Position in Queue:</strong> {token.position || 'Calculating...'}
        </p>
        <QRDisplay tokenId={token._id} tokenNumber={token.tokenNumber} />
      </div>
      <p className="info-text">
        Please keep your token number safe. You can check your status at the
        counter.
      </p>
    </div>
  );
}

export default TokenCard;
