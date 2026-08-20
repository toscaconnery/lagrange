import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';

export default function FisheryFeedAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('sink');
  const [weight, setWeight] = useState(0);
  const [saving, setSaving] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [error, setError] = useState('');

  const handleWeightChange = (w) => {
    setWeight(w);
    setWeightError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    } 

    if (weight <= 0) {
      setWeightError('Masukkan berat pakan.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/v1/fishery/feed/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(),
          type: type,
          weight: weight
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Gagal menambahkan pakan.');
        return;
      }

      navigate('/fishery/feed');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    document.title = 'Tambah Pakan';
  }, [])
  return (
    <>
      <FisheryHeader backTo="/fishery/feed"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <div>
            <h1 style={{ marginTop: '8px' }}>Tambah Pakan</h1>
            <p>Tambahkan pakan baru untuk digunakan.</p>
          </div>
        </div>

        <form className="fishery-form" onSubmit={handleSubmit}>
          {error && <p className="fishery-error">{error}</p>}
          <div className="fishery-form-group">
            <label htmlFor="name">Nama pakan</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="fishery-form-group">
            <label htmlFor="type">Tipe</label>
            <select onChange={e => setType(e.target.value)}>
              <option value="sink">Tenggelam</option>
              <option value="float">Mengapung</option>
            </select>
          </div>
          <div className="fishery-form-group">
            <label htmlFor="weight">Berat (kg)</label>
            <input
              id="weight"
              type="number"
              value={weight}
              min={0}
              onChange={e => handleWeightChange(e.target.value)}
              required
            />
          </div>
          {weightError && <p className="fishery-error">{weightError}</p>}
          <div className="fishery-form-actions">
            <button type="button" className="fishery-btn-secondary" onClick={() => navigate('/fishery/feed')} disabled={saving}>
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