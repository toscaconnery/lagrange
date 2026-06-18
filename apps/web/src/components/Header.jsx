import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const navLinks = [
  { label: 'About', path: '/about' },
  { label: 'Link Shortener', path: '/linky/shorten' },
  { label: 'Linky List', path: '/linky/list' },
  { label: 'Expense Ledger', path: '/expense-ledger' },
  { label: 'My Plantations', path: '/farm' },
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
  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          Lagrange
        </Link>

        {/* Hamburger toggle */}
        <button
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav links + auth */}
        <div className={`navbar-right ${menuOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="navbar-link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-auth">
            {loggedIn ? (
              <div className="navbar-user">
                <span className="navbar-username">{userName}</span>
                <button onClick={() => { handleLogout(); closeMenu(); }} className="navbar-logout">
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-auth-links">
                <Link to="/auth/register" className="navbar-register" onClick={closeMenu}>
                  Register
                </Link>
                <Link to="/auth/login" className="navbar-login" onClick={closeMenu}>
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}