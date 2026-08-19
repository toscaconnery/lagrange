import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryCycleList() {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/fishery/cycle/list')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCycles(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = 'Siklus Budidaya';
  }, [])

  return (
    <>
      <FisheryHeader />
      <div className="fishery-page">
        <div className="fishery-header">
          <h1>Siklus Budidaya Ikan</h1>
        </div>

        <div className="fishery-header-button">
          <button className="fishery-add-btn" onClick={() => navigate('/fishery/cycle/add')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : cycles.length === 0 ? (
          <p className="fishery-empty">Belum ada siklus budidaya. Silahkan tambah siklus budidaya baru.</p>
        ) : (
          <div className="fishery-grid">
            {cycles.map(c => (
              <div key={c.id} className="fishery-card" onClick={() => navigate(`/fishery/cycle/${c.id}`)}>
                <h3 className="fishery-card-title">{c.label}</h3>
                <div className="fishery-row-div">
                  <div className="fishery-card-area">{c.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
