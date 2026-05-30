import React, { useState, useEffect } from 'react';
import socket from '../socket';
import queueApi from '../api/queueApi';
import QueueCard from '../components/QueueCard';

function TokenStatus() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueues();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('tokenCalled', (data) => {
      console.log('Token called:', data);
      fetchQueues();
    });

    socket.on('queueUpdated', (data) => {
      console.log('Queue updated:', data);
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
      console.error('Error fetching queues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="token-status">
      <h1>Queue Status</h1>
      <div className="queues-container">
        {queues.map((queue) => (
          <QueueCard key={queue._id} queue={queue} />
        ))}
      </div>
    </div>
  );
}

export default TokenStatus;
