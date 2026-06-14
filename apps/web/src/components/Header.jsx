import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const navLinks = [
  { label: 'About', path: '/about' },
  { label: 'Link Shortener', path: '/linky/shorten' },
  { label: 'Linky List', path: '/linky/list' },
  { label: 'Expense Ledger', path: '/expense-ledger' },
];

function getUserName() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name || null;
  } catch {
    return null;
  }
}

export default function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState(getUserName());

  useEffect(() => {
    const handleAuth = () => {
      const hasToken = !!localStorage.getItem('token');
      setLoggedIn(hasToken);
      setUserName(getUserName());
    };
    window.addEventListener('authChanged', handleAuth);
    return () => window.removeEventListener('authChanged', handleAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChanged'));
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{
          fontWeight: 600,
          fontSize: '20px',
          textDecoration: 'none',
          color: 'var(--text-h)',
        }}>
          Lagrange
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: 'var(--text)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '15px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--text-h)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text)')}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        {loggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '14px',
              color: 'var(--text)',
              fontWeight: 500,
            }}>
              {userName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/auth/register"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: 'var(--text)',
                fontSize: '14px',
                marginRight: '8px',
              }}
            >
              Register
            </Link>
            <Link
              to="/auth/login"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '14px',
              }}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}