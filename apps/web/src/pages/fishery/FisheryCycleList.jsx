import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryCycleList() {
  const navigate = useNavigate();
  const [fisheries, setFisheries] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetch('/api/v1/fishery/cycle/list')
      .then(res => res.json())
      .then(data => {
        if (data.success) setFeeds(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = 'Fishery';
  }, [])

  function toggleIsEditing() {
    const currentIsEditing = isEditing
    setIsEditing(!currentIsEditing)
  }

  function deleteFishery(id) {
    setDeleteTarget(id);
    setDeleteError('');
    setShowDeleteModal(true);
  }


  return (
    <>
      <FisheryHeader />
      <div className="fishery-page">
        <div className="fishery-header">
          <h1>Siklus Budidaya Ikan</h1>
        </div>

        <div className="fishery-header-button">
          <button className="fishery-add-btn" onClick={() => navigate('/fishery/feed/add')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="fishery-add-btn" onClick={() => toggleIsEditing()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
        </div>

        {!loading && feeds.length > 0 && (
          <div className="fishery-stats">
            <div className="fishery-stat-card">
              <div className="stat-value">{feeds.length}</div>
              <div className="stat-label">Pakan</div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : feeds.length === 0 ? (
          <p className="fishery-empty">Belum ada pakan. Silahkan tambah pakan baru.</p>
        ) : (
          <div className="fishery-grid">
            {feeds.map(p => (
              <div key={p.id} className="fishery-card" onClick={() => navigate(`/fishery/feed/${p.id}`)}>
                <h3 className="fishery-card-title">{p.name}</h3>
                <div className="fishery-row-div">
                  <div className="fishery-card-area">{p.weight}kg</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
