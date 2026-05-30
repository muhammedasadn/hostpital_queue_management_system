import React, { useState } from 'react';
import queueApi from '../api/queueApi';
import TokenCard from '../components/TokenCard';

function PatientBooking() {
  const [patientName, setPatientName] = useState('');
  const [department, setDepartment] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await queueApi.bookToken({
        patientName,
        department
      });
      setToken(result);
      setPatientName('');
      setDepartment('');
    } catch (err) {
      setError('Failed to book token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-booking">
      <h1>Hospital Queue Management</h1>
      <h2>Patient Token Booking</h2>

      <form onSubmit={handleBooking}>
        <div className="form-group">
          <label>Patient Name:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            <option value="General">General</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Token'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {token && <TokenCard token={token} />}
    </div>
  );
}

export default PatientBooking;
