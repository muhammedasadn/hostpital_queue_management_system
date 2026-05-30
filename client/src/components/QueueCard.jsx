import React from 'react';

function QueueCard({ queue }) {
  return (
    <div className="queue-card">
      <h3>{queue.department}</h3>
      <div className="queue-info">
        <p>
          <strong>Queue Length:</strong> {queue.tokens?.length || 0}
        </p>
        <p>
          <strong>Average Wait Time:</strong> {queue.avgWaitTime || 'N/A'} mins
        </p>
        <div className="tokens-list">
          <h4>Waiting Tokens:</h4>
          <ul>
            {queue.tokens?.slice(0, 5).map((token, idx) => (
              <li key={token._id || idx}>
                {token.tokenNumber} - {token.patientName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QueueCard;
