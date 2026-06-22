import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/farm.css';
import FarmHeader from '../../components/FarmHeader';

export default function FarmList() {
  const navigate = useNavigate();
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/plantations')
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlantations(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = 'Plantation';
  }, [])

  return (
    <>
      <FarmHeader />
      <div className="farm-page">
        <div className="farm-header">
          <h1>Oil Palm Estates</h1>
          <button className="farm-add-btn" onClick={() => navigate('/farm/add')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Plantation
          </button>
        </div>

        {!loading && plantations.length > 0 && (
          <div className="farm-stats">
            <div className="farm-stat-card">
              <div className="stat-value">{plantations.length}</div>
              <div className="stat-label">Estates</div>
            </div>
            <div className="farm-stat-card">
              <div className="stat-value">{plantations.reduce((sum, p) => sum + Number(p.area_ha), 0).toLocaleString()} Ha</div>
              <div className="stat-label">Total Area</div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="farm-empty">Loading...</p>
        ) : plantations.length === 0 ? (
          <p className="farm-empty">No plantations yet. Add your first one!</p>
        ) : (
          <div className="farm-grid">
            {plantations.map(p => (
              <div key={p.id} className="farm-card" onClick={() => navigate(`/farm/${p.id}`)}>
                <h3 className="farm-card-title">{p.name}</h3>
                <div className="farm-card-area">{p.area_ha} Ha</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}