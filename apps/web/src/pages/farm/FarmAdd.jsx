import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/farm.css';
import FarmHeader from '../../components/FarmHeader';

export default function FarmAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/v1/plantations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), area_ha: Number(area) }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to save plantation.');
        return;
      }

      navigate('/farm');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    document.title = 'Plantation - Add';
  }, [])
  return (
    <>
      <FarmHeader backTo="/farm" />
      <div className="farm-page">
        <div className="farm-header">
          <div>
            <h1 style={{ marginTop: '8px' }}>Add Plantation</h1>
            <p>Register a new oil palm estate</p>
          </div>
        </div>

        <form className="farm-form" onSubmit={handleSubmit}>
          {error && <p className="farm-error">{error}</p>}
          <div className="farm-form-group">
            <label htmlFor="name">Plantation Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Green Valley Estate"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="farm-form-group">
            <label htmlFor="area">Area (Hectares)</label>
            <input
              id="area"
              type="number"
              min="1"
              placeholder="e.g. 150"
              value={area}
              onChange={e => setArea(e.target.value)}
              required
            />
          </div>
          <div className="farm-form-actions">
            <button type="button" className="farm-btn-secondary" onClick={() => navigate('/farm')} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="farm-add-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Plantation'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}