import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('darkledger_token', data.token);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-shell">
      <form onSubmit={handleSubmit} className="card login-card">
        <div className="card-header"><div className="card-title">DarkLedger — Sign in</div></div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mono" />
          <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mono" />
          {error && <div style={{ color: 'var(--accent-critical)', fontSize: 12 }}>{error}</div>}
          <button type="submit" className="export-btn">Sign in</button>
        </div>
      </form>
    </div>
  );
}