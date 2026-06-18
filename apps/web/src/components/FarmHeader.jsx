import { Link, useNavigate } from 'react-router-dom';

export default function FarmHeader() {
  const navigate = useNavigate();

  return (
    <nav className="farm-navbar">
      <div className="farm-navbar-inner">
        <Link to="/farm" className="farm-navbar-brand">
          🌴 Plantations
        </Link>
        <div className="farm-navbar-links">
          <button className="farm-navbar-link" onClick={() => navigate('/farm')}>
            List
          </button>
          <button className="farm-navbar-link" onClick={() => navigate('/farm/add')}>
            + Add
          </button>
        </div>
      </div>
    </nav>
  );
}