import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/farm.css';
import FarmHeader from '../../components/FarmHeader';

const activityIcons = {
  'Fertilizer': '🌱',
  'Herbicide': '🧪',
  'Pesticide': '🔬',
  'Pruning': '✂️',
  'Harvest': '🌿',
  'Irrigation': '💧',
  'Planting': '🌰',
  'Weeding': '🌾',
};

function getIcon(type) {
  return activityIcons[type] || '📋';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function FarmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantation, setPlantation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add activity form
  const [showForm, setShowForm] = useState(false);
  const [activityType, setActivityType] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/v1/plantations/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlantation(data.data);
        else navigate('/farm');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!activityType || !activityDate) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/v1/plantations/${id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: activityType,
          amount: amount ? Number(amount) : null,
          unit: unit || null,
          description: description.trim() || null,
          activity_date: activityDate,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to save activity.');
        return;
      }

      // Refresh plantation data
      const refresh = await fetch(`/api/v1/plantations/${id}`);
      const refreshData = await refresh.json();
      if (refreshData.success) setPlantation(refreshData.data);

      // Reset form
      setActivityType('');
      setAmount('');
      setUnit('kg');
      setDescription('');
      setActivityDate('');
      setShowForm(false);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <FarmHeader />
        <div className="farm-page">
          <p className="farm-empty">Loading...</p>
        </div>
      </>
    );
  }

  const activities = plantation?.activities || [];

  return (
    <>
      <FarmHeader />
      <div className="farm-page">
        <div className="farm-header">
          <div>
            <button className="farm-back-btn" onClick={() => navigate('/farm')}>
              ← Back
            </button>
            <h1 style={{ marginTop: '8px' }}>{plantation?.name}</h1>
            <p>{plantation?.area_ha} Ha</p>
          </div>
          <button className="farm-add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>
        </div>

        {/* Add Activity Form */}
        {showForm && (
          <form className="farm-form" onSubmit={handleAddActivity} style={{ marginBottom: '32px' }}>
            {error && <p className="farm-error">{error}</p>}
            <div className="farm-form-group">
              <label htmlFor="activityType">Activity Type</label>
              <select
                id="activityType"
                value={activityType}
                onChange={e => setActivityType(e.target.value)}
                required
                className="farm-select"
              >
                <option value="">Select type...</option>
                <option value="Fertilizer">Fertilizer</option>
                <option value="Herbicide">Herbicide</option>
                <option value="Pesticide">Pesticide</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Pruning">Pruning</option>
                <option value="Weeding">Weeding</option>
                <option value="Harvest">Harvest</option>
                <option value="Planting">Planting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="farm-form-row">
              <div className="farm-form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 50"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="farm-form-group">
                <label htmlFor="unit">Unit</label>
                <input
                  id="unit"
                  type="text"
                  placeholder="kg, L, etc."
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                />
              </div>
            </div>
            <div className="farm-form-group">
              <label htmlFor="desc">Description (optional)</label>
              <input
                id="desc"
                type="text"
                placeholder="e.g. NPK 15-15-15"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="farm-form-group">
              <label htmlFor="activityDate">Date</label>
              <input
                id="activityDate"
                type="date"
                value={activityDate}
                onChange={e => setActivityDate(e.target.value)}
                required
              />
            </div>
            <div className="farm-form-actions">
              <button type="submit" className="farm-add-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Activity'}
              </button>
            </div>
          </form>
        )}

        {/* Timeline */}
        {activities.length === 0 ? (
          <p className="farm-empty">No activities recorded yet. Add your first activity!</p>
        ) : (
          <div className="timeline">
            {activities.map((a, idx) => (
              <div key={a.id} className="timeline-item">
                <div className="timeline-marker">{getIcon(a.activity_type)}</div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-type">{a.activity_type}</span>
                    <span className="timeline-date">{formatDate(a.activity_date)}</span>
                  </div>
                  {a.description && (
                    <p className="timeline-desc">{a.description}</p>
                  )}
                  {a.amount && (
                    <p className="timeline-amount">{a.amount} {a.unit || ''}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}