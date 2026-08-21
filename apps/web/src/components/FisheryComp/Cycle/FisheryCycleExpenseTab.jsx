import { useState, useEffect } from 'react';
import { formatDateShort } from '../../../../../api/src/utils/formatter';

export default function FisheryCycleExpenseTab({cycleId, expenses, onDataLoaded}) {

  const [loading, setLoading] = useState(expenses === null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    volume: '',
    unit: '',
    unit_price: '',
  });
  const [error, setError] = useState('');

  function openModal() {
    setForm({
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
      volume: '',
      unit: '',
      unit_price: '',
    });
    setError('');
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setError('');
  }

  useEffect(() => {
    // If we already have the data (even empty), no need to fetch again
    if (expenses !== null) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Fetch expenses data
        const expensesRes = await fetch(`/api/v1/fishery/cycle/expense/${cycleId}`);
        const expensesJson = await expensesRes.json();
        const fetchedExpenses = expensesJson.data;

        // Pass up to the parent so it can cache them ([] means "loaded, empty")
        onDataLoaded(fetchedExpenses || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [expenses, cycleId, onDataLoaded]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.description || !form.volume || !form.unit || !form.unit_price) {
      setError('Semua field harus diisi.');
      return;
    }

    try {
      const res = await fetch('/api/v1/fishery/cycle/expense/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pool_cycle_id: cycleId,
          description: form.description,
          expense_date: form.expense_date,
          volume: Number(form.volume),
          unit: form.unit,
          unit_price: Number(form.unit_price),
        }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || 'Gagal menyimpan biaya.');
        return;
      }

      // Append the new expense to the cached list
      const newExpense = {
        id: json.data.expenseId,
        description: form.description,
        expense_date: form.expense_date,
        volume: Number(form.volume),
        unit: form.unit,
        unit_price: Number(form.unit_price),
        amount: Number(form.volume) * Number(form.unit_price),
      };

      onDataLoaded([...(expenses || []), newExpense]);
      closeModal();
    } catch (error) {
      console.error(error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    }
  }

  function totalExpenses(expenses) {
    if (!expenses || expenses?.length === 0) return 0;
    return expenses.reduce((sum, e) => sum + Number(e.volume) * Number(e.unit_price), 0);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="fishery-detail-section">
      <div className="fishery-section-header">
        <h2 className="fishery-detail-section-title">Biaya</h2>
        <div>
          <button className="fishery-add-btn mr-10" onClick={openModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Pakan
          </button>
          <button className="fishery-add-btn" onClick={openModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Biaya
          </button>
        </div>
      </div>
      <div className="fishery-info-card">
        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : !expenses || expenses.length === 0 ? (
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Belum ada biaya tercatat.</span>
          </div>
        ) : (
          <div className="fishery-table-wrap">
            <table className="fishery-table">
              <thead>
                <tr>
                  <th>Keterangan</th>
                  <th>Jumlah</th>
                  <th className="text-right">Harga Satuan</th>
                  <th className="text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(ex => (
                  <tr key={ex.id}>
                    <td className="fishery-table-desc">
                      <div>{ex.description}</div>
                      <div className="fishery-table-date">{formatDateShort(ex.expense_date)}</div>
                    </td>
                    <td className="fishery-table-date">
                      <div>{ex.volume}</div>
                      <div>{ex.unit}</div>
                    </td>
                    <td className="text-right">{formatCurrency(ex.unit_price)}</td>
                    <td className="text-right fishery-table-total">{formatCurrency(ex.volume * ex.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right fishery-table-grand-label">Total</td>
                  <td className="text-right fishery-table-grand-total">{formatCurrency(totalExpenses(expenses))}</td>
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
              <h2>Tambah Biaya</h2>
              <button className="fishery-modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form className="fishery-form" onSubmit={handleSubmit}>
              {error && <p className="fishery-error">{error}</p>}

              <div className="fishery-form-group">
                <label htmlFor="expense-desc">Keterangan</label>
                <input
                  id="expense-desc"
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="mis. Pakan Pelet"
                  required
                />
              </div>

              <div className="fishery-form-group">
                <label htmlFor="expense-date">Tanggal</label>
                <input
                  id="expense-date"
                  type="date"
                  value={form.expense_date}
                  onChange={e => setForm({ ...form, expense_date: e.target.value })}
                  required
                />
              </div>

              <div className="fishery-form-row">
                <div className="fishery-form-group">
                  <label htmlFor="expense-volume">Volume</label>
                  <input
                    id="expense-volume"
                    type="number"
                    min="0"
                    value={form.volume}
                    onChange={e => setForm({ ...form, volume: e.target.value })}
                    placeholder="mis. 10"
                    required
                  />
                </div>
                <div className="fishery-form-group">
                  <label htmlFor="expense-unit">Satuan</label>
                  <input
                    id="expense-unit"
                    type="text"
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    placeholder="mis. sak, kg, bulan"
                    required
                  />
                </div>
              </div>

              <div className="fishery-form-group">
                <label htmlFor="expense-price">Harga Satuan</label>
                <input
                  id="expense-price"
                  type="number"
                  min="0"
                  value={form.unit_price}
                  onChange={e => setForm({ ...form, unit_price: e.target.value })}
                  placeholder="mis. 150000"
                  required
                />
              </div>

              <div className="fishery-form-actions">
                <button type="button" className="fishery-btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="fishery-add-btn">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}