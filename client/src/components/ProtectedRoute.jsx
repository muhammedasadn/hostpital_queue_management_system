import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        color: '#3b82f6'
      }}>
        <Loader2 size={40} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1e293b' }}>Authenticating Hospital Staff Session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '4rem auto',
        padding: '2.5rem',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        textAlign: 'center',
        border: '1px solid #fee2e2'
      }}>
        <ShieldAlert size={56} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Access Restricted</h2>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          Your staff role (<strong>{user.role}</strong>) does not have authorization to view this panel.
        </p>
        <Navigate to="/login" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
