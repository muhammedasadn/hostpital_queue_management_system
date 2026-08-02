import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/doctor-dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const user = await login(email, password);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/doctor-dashboard' : from);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Authentication failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">
            <ShieldCheck size={16} />
            <span>Staff Portal Security</span>
          </div>
          <h1>Hospital Portal Login</h1>
          <p>Sign in to access medical counter dispatch and queue administration</p>
        </div>

        {error && (
          <div className="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="staff-email">Hospital Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="staff-email"
                type="email"
                className="form-input"
                placeholder="doctor.cardio@carequeue.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="staff-password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="staff-password"
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={submitting}
          >
            <LogIn size={18} />
            <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
          </button>
        </form>

        <div className="demo-login-divider">
          <span>Quick Demo Access</span>
        </div>

        <div className="demo-quick-buttons">
          <button
            type="button"
            className="btn-demo-quick"
            onClick={() => handleDemoLogin('admin@carequeue.com', 'Admin@123456')}
          >
            <span className="demo-role-title">🔑 Hospital Admin</span>
            <span className="demo-role-desc">Full System Reset & Stats</span>
          </button>

          <button
            type="button"
            className="btn-demo-quick"
            onClick={() => handleDemoLogin('doctor.cardio@carequeue.com', 'Doctor@123456')}
          >
            <span className="demo-role-title">👩‍⚕️ Doctor (Cardiology)</span>
            <span className="demo-role-desc">Counter 2 OPD Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
