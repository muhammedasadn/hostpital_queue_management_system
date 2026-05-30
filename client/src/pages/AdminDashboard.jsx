import React, { useState, useEffect } from 'react';
import socket from '../socket';
import queueApi from '../api/queueApi';

function AdminDashboard() {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounters();

    socket.on('connect', () => {
      console.log('Admin connected to server');
    });

    socket.on('tokenCalled', (data) => {
      console.log('Token called in admin:', data);
      fetchCounters();
    });

    return () => {
      socket.off('tokenCalled');
    };
  }, []);

  const fetchCounters = async () => {
    try {
      const data = await queueApi.getCounterStatus();
      setCounters(data);
    } catch (error) {
      console.error('Error fetching counters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async (counterId) => {
    try {
      await queueApi.callNextToken(counterId);
      fetchCounters();
    } catch (error) {
      console.error('Error calling next token:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="counters-container">
        {counters.map((counter) => (
          <div key={counter._id} className="counter-card">
            <h3>Counter {counter.counterNumber}</h3>
            <p>Current Token: {counter.currentToken?.tokenNumber || 'None'}</p>
            <p>Patient: {counter.currentToken?.patientName || 'No patient'}</p>
            <p>Department: {counter.currentToken?.department || 'N/A'}</p>
            <button onClick={() => handleCallNext(counter._id)}>
              Call Next Token
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
