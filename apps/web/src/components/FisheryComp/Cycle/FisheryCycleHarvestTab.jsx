import { useState } from 'react';
import { convertTimbangToKg } from '../../../../../api/src/utils/converter';

export default function FisheryCycleHarvestTab() {
  const [harvests, setHarvests] = useState([
    { id: 1, harvest_date: '2026-06-20', buyer: 'Daniel', weight_units: 6, weight_kg: 15 },
    { id: 2, harvest_date: '2026-06-20', buyer: 'Sijon', weight_units: 4, weight_kg: 20 },
    { id: 3, harvest_date: '2026-06-27', buyer: 'Eka', weight_units: 8, weight_kg: 10 },
    { id: 4, harvest_date: '2026-07-04', buyer: 'Daniel', weight_units: 5, weight_kg: 8 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    harvest_date: new Date().toISOString().split('T')[0],
    buyer: '',
    weight_units: '',
    weight_kg: '',
  });
  const [error, setError] = useState('');

  function openModal(existing) {
    setForm({
      harvest_date: existing ? existing.harvest_date : new Date().toISOString().split('T')[0],
      buyer: existing ? existing.buyer : '',
      weight_units: existing ? existing.weight_units : '',
      weight_kg: existing ? existing.weight_kg : '',
    });
    setEditId(existing ? existing.id : null);
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setError('');
    setEditId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.buyer || !form.weight_units || !form.weight_kg) {
      setError('Semua field harus diisi.');
      return;
    }

    if (editId) {
      setHarvests(prev =>
        prev.map(h => (h.id === editId ? {
          ...h,
          harvest_date: form.harvest_date,
          buyer: form.buyer,
          weight_units: Number(form.weight_units),
          weight_kg: Number(form.weight_kg),
        } : h))
      );
    } else {
      setHarvests(prev => [
        ...prev,
        {
          id: Date.now(),
          harvest_date: form.harvest_date,
          buyer: form.buyer,
          weight_units: Number(form.weight_units),
          weight_kg: Number(form.weight_kg),
        },
      ]);
    }
    closeModal();
  }

  function formatHarvestDay(dateStr) {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  function totalHarvestKg(h) {
    return convertTimbangToKg(Number(h.weight_units)) + Number(h.weight_kg);
  }

  return (
    <div className="fishery-detail-section">
      <div className="fishery-section-header">
        <h2 className="fishery-detail-section-title">Panen</h2>
        <button className="fishery-add-btn" onClick={openModal}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Pembeli
        </button>
      </div>
      <div className="fishery-info-card">
        {harvests.length === 0 ? (
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Belum ada panen tercatat.</span>
          </div>
        ) : (
          <div className="fishery-table-wrap">
            <table className="fishery-table">
              <thead>
                <tr>
                  <th>Hari/Tgl</th>
                  <th>Pembeli</th>
                  <th className="text-right">Jumlah timbang</th>
                  <th className="text-right">Jumlah KG</th>
                  <th className="text-right">Total KG</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map(h => (
                  <tr key={h.id} onClick={() => openModal(h)} style={{ cursor: 'pointer' }}>
                    <td>{formatHarvestDay(h.harvest_date)}</td>
                    <td>{h.buyer}</td>
                    <td className="text-right">{h.weight_units} Timbang</td>
                    <td className="text-right">{h.weight_kg} KG</td>
                    <td className="text-right fishery-table-total">{totalHarvestKg(h)} KG</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" className="text-right fishery-table-grand-label">Total</td>
                  <td className="text-right fishery-table-grand-total">
                    {harvests.reduce((sum, h) => sum + h.weight_units, 0)} Timbang
                  </td>
                  <td className="text-right fishery-table-grand-total">
                    {harvests.reduce((sum, h) => sum + h.weight_kg, 0)} KG
                  </td>
                  <td className="text-right fishery-table-grand-total">
                    {harvests.reduce((sum, h) => sum + totalHarvestKg(h), 0)} KG
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fishery-modal-overlay" onClick={closeModal}>
          <div className="fishery-modal" onClick={e => e.stopPropagation()}>
            <div className="fishery-modal-header">
              <h2>{editId ? 'Edit Pembeli' : 'Tambah Pembeli'}</h2>
              <button className="fishery-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form className="fishery-form" onSubmit={handleSubmit}>
              {error && <p className="fishery-error">{error}</p>}

              <div className="fishery-form-group">
                <label htmlFor="harvest-date">Hari/Tgl</label>
                <input
                  id="harvest-date"
                  type="date"
                  value={form.harvest_date}
                  onChange={e => setForm({ ...form, harvest_date: e.target.value })}
                  required
                />
              </div>

              <div className="fishery-form-group">
                <label htmlFor="harvest-buyer">Pembeli</label>
                <input
                  id="harvest-buyer"
                  type="text"
                  value={form.buyer}
                  onChange={e => setForm({ ...form, buyer: e.target.value })}
                  placeholder="mis. Daniel"
                  required
                />
              </div>

              <div className="fishery-form-row">
                <div className="fishery-form-group">
                  <label htmlFor="harvest-units">Jumlah timbang</label>
                  <input
                    id="harvest-units"
                    type="number"
                    min="0"
                    value={form.weight_units}
                    onChange={e => setForm({ ...form, weight_units: e.target.value })}
                    placeholder="mis. 6"
                    required
                  />
                </div>
                <div className="fishery-form-group">
                  <label htmlFor="harvest-kg">Jumlah KG</label>
                  <input
                    id="harvest-kg"
                    type="number"
                    min="0"
                    value={form.weight_kg}
                    onChange={e => setForm({ ...form, weight_kg: e.target.value })}
                    placeholder="mis. 15"
                    required
                  />
                </div>
              </div>

              <div className="fishery-form-actions">
                <button type="button" className="fishery-btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="fishery-add-btn">
                  {editId ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
