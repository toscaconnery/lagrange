import { Link, useNavigate, useLocation } from 'react-router-dom';
import {ArrowLeft, Fish, FishSymbol, ChevronLeft, ArrowBigLeft} from 'lucide-react';

export default function FisheryHeader({ backTo, compact }) {
  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fishery-navbar">
      <div className="fishery-navbar-inner">
        {backTo && (
          <button className="fishery-navbar-icon" onClick={() => navigate(backTo)}>
            <ArrowBigLeft />
          </button>
        )}
        {!backTo && (
          <button className="fishery-navbar-icon" onClick={() => {}}>
            <FishSymbol />
          </button>
        )}
        <div className="fishery-navbar-links">
          <button 
            className={`fishery-navbar-link ${
              currentPath.startsWith('/fishery/pool') ? 'fishery-navbar-active' : ''
            }`} 
            onClick={() => navigate('/fishery/pool')}
          >
            Kolam
          </button>
          <button 
            className={`fishery-navbar-link ${
              currentPath.startsWith('/fishery/feed') ? 'fishery-navbar-active' : ''
            }`} 
            onClick={() => navigate('/fishery/feed')}
          >
            Pakan
          </button>
          <button 
            className={`fishery-navbar-link ${
              currentPath.startsWith('/fishery/cycle') ? 'fishery-navbar-active' : ''
            }`} 
            onClick={() => navigate('/fishery/cycle')}
          >
            Siklus
          </button>
        </div>
      </div>
    </nav>
  );
}