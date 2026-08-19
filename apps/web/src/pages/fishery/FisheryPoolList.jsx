import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryPoolList() {
  const navigate = useNavigate();
  const [fisheries, setFisheries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetch('/api/v1/fishery/pool/list')
      .then(res => res.json())
      .then(data => {
        if (data.success) setFisheries(data.data);
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

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/v1/fishery/${deleteTarget}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) {
        setDeleteError(data.message || 'Failed to delete fishery.');
        return;
      }

      // setFisheries(prev => prev.filter(p => p.id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast.success('Fishery deleted');
    } catch {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError('');
  }

  return (
    <>
      <FisheryHeader />
      <div className="fishery-page">
        <div className="fishery-header">
          <h1>Kolam Ikan</h1>
        </div>

        <div className="fishery-header-button">
          <button className="fishery-add-btn" onClick={() => navigate('/fishery/pool/add')}>
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

        {!loading && fisheries.length > 0 && (
          <div className="fishery-stats">
            <div className="fishery-stat-card">
              <div className="stat-value">{fisheries.length}</div>
              <div className="stat-label">Kolam</div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : fisheries.length === 0 ? (
          <p className="fishery-empty">Belum ada kolam. Silahkan tambah kolam baru.</p>
        ) : (
          <div className="fishery-grid">
            {fisheries.map(p => (
              <div key={p.id} className="fishery-card" onClick={() => navigate(`/fishery/pool/${p.id}`)}>
                <h3 className="fishery-card-title">{p.name}</h3>
                <div className="fishery-row-div">
                  {
                    !isEditing ? (
                      <div className="fishery-card-area">xxHa</div>
                    ) : <></>
                  }
                  {
                    isEditing ? (
                      <button className="fishery-mng-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/fishery/edit/${p.id}`);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </button>
                    ) : <></>
                  }
                  {
                    isEditing ? (
                      <button className="fishery-mng-btn fishery-mng-btn--danger" onClick={(e) => {
                        e.stopPropagation();
                        deleteFishery(p.id)
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    ) : <></>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fishery-modal-overlay" onClick={cancelDelete}>
          <div className="fishery-modal" onClick={e => e.stopPropagation()}>
            <div className="fishery-modal-header">
              <h2>Delete Fishery</h2>
              <button className="fishery-modal-close" onClick={cancelDelete}>&times;</button>
            </div>
            <p className="fishery-modal-text">Are you sure you want to delete this fishery? This action cannot be undone.</p>
            {deleteError && <p className="fishery-error">{deleteError}</p>}
            <div className="fishery-form-actions">
              <button type="button" className="fishery-btn-secondary" onClick={cancelDelete} disabled={deleting}>
                Cancel
              </button>
              <button type="button" className="fishery-add-btn fishery-btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
