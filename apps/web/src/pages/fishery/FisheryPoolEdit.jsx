import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';

export default function FisheryPoolEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/v1/fishery/pool/edit/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        console.log('--- data : ', data)
        setError(data.message || 'Gagal mengubah kolam.');
        return;
      }

      navigate('/fishery/pool');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetch(`/api/v1/fishery/pool/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setName(data.data.name);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id])

  useEffect(() => {
    document.title = 'Edit kolam';
  }, [])
  return (
    <>
      <FisheryHeader backTo="/fishery/pool"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <div>
            <h1 style={{ marginTop: '8px' }}>Edit Kolam</h1>
            <p>Edit data kolam yang dikelola.</p>
          </div>
        </div>

        <form className="fishery-form" onSubmit={handleSubmit}>
          {error && <p className="fishery-error">{error}</p>}
          <div className="fishery-form-group">
            <label htmlFor="name">Nama kolam</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="fishery-form-actions">
            <button type="button" className="fishery-btn-secondary" onClick={() => navigate('/fishery/pool')} disabled={saving}>
              Batal
            </button>
            <button type="submit" className="fishery-add-btn" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}