import { Link, useNavigate } from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';

export default function FisheryHeader({ backTo }) {
  const navigate = useNavigate();

  return (
    <nav className="fishery-navbar">
      <div className="fishery-navbar-inner">
        {backTo && (
          <button className="fishery-navbar-back" onClick={() => navigate(backTo)}>
            <ArrowLeft />
          </button>
        )}
        <Link to="/fishery/pool" className="fishery-navbar-brand">
          🐟 Fishery
        </Link>
        <div className="fishery-navbar-links">
          <button className="fishery-navbar-link" onClick={() => navigate('/fishery/pool')}>
            Kolam
          </button>
          <button className="fishery-navbar-link" onClick={() => navigate('/fishery/feed')}>
            Pakan
          </button>
          <button className="fishery-navbar-link" onClick={() => navigate('/fishery')}>
            Biaya
          </button>
          <button className="fishery-navbar-link" onClick={() => navigate('/fishery')}>
            Panen
          </button>
        </div>
      </div>
    </nav>
  );
}