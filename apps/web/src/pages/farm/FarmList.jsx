import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/farm.css';
import FarmHeader from '../../components/FarmHeader';

export default function FarmList() {
  const navigate = useNavigate();
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  function toggleIsEditing() {
    const currentIsEditing = isEditing
    setIsEditing(!currentIsEditing)
  }

  function deletePlantation(id) {
    setDeleteTarget(id);
    setDeleteError('');
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/v1/plantations/${deleteTarget}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) {
        setDeleteError(data.message || 'Failed to delete plantation.');
        return;
      }

      setPlantations(prev => prev.filter(p => p.id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast.success('Plantation deleted');
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
      <FarmHeader />
      <div className="farm-page">
        <div className="farm-header">
          <h1>Oil Palm Estates</h1>
        </div>

        <div className="farm-header-button">
          <button className="farm-add-btn" onClick={() => navigate('/farm/add')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="farm-add-btn" onClick={() => toggleIsEditing()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
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
                <div className="farm-row-div">
                  {
                    !isEditing ? (
                      <div className="farm-card-area">{p.area_ha} Ha</div>
                    ) : <></>
                  }
                  {
                    isEditing ? (
                      <button className="farm-mng-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/farm/edit/${p.id}`);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </button>
                    ) : <></>
                  }
                  {
                    isEditing ? (
                      <button className="farm-mng-btn farm-mng-btn--danger" onClick={(e) => {
                        e.stopPropagation();
                        deletePlantation(p.id)
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
        <div className="farm-modal-overlay" onClick={cancelDelete}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <div className="farm-modal-header">
              <h2>Delete Plantation</h2>
              <button className="farm-modal-close" onClick={cancelDelete}>&times;</button>
            </div>
            <p className="farm-modal-text">Are you sure you want to delete this plantation? This action cannot be undone.</p>
            {deleteError && <p className="farm-error">{deleteError}</p>}
            <div className="farm-form-actions">
              <button type="button" className="farm-btn-secondary" onClick={cancelDelete} disabled={deleting}>
                Cancel
              </button>
              <button type="button" className="farm-add-btn farm-btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
