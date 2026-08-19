import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';

export default function FisheryPoolAdd() {
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
      const res = await fetch('/api/v1/fishery/pool/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Gagal menambahkan kolam.');
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
    document.title = 'Tambah kolam';
  }, [])
  return (
    <>
      <FisheryHeader backTo="/fishery/pool"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <div>
            <h1 style={{ marginTop: '8px' }}>Tambah Kolam</h1>
            <p>Tambahkan kolam baru untuk dikelola.</p>
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
            <button type="button" className="fishery-btn-secondary" onClick={() => navigate('/fishery')} disabled={saving}>
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