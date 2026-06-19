import { Link, useNavigate } from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';

export default function FarmHeader({ backTo }) {
  const navigate = useNavigate();

  return (
    <nav className="farm-navbar">
      <div className="farm-navbar-inner">
        {backTo && (
          <button className="farm-navbar-back" onClick={() => navigate(backTo)}>
            <ArrowLeft />
          </button>
        )}
        <Link to="/farm" className="farm-navbar-brand">
          🌴 Plantations
        </Link>
        {/* <div className="farm-navbar-links">
          <button className="farm-navbar-link" onClick={() => navigate('/farm')}>
            List
          </button>
          <button className="farm-navbar-link" onClick={() => navigate('/farm/add')}>
            + Add
          </button>
        </div> */}
      </div>
    </nav>
  );
}