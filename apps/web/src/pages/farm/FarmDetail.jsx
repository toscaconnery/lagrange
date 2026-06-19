import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/farm.css';
import FarmHeader from '../../components/FarmHeader';

const activityIcons = {
  'fertilizer': '🌱',
  'herbicide': '🧪',
  'pesticide': '🔬',
  'pruning': '✂️',
  'harvest': '🌿',
  'irrigation': '💧',
  'planting': '🌰',
  'weeding': '🌾',
};

function getIcon(type) {
  return activityIcons[type] || '📋';
}

function formatUppercaseFirstLetter(text) {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateInput(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function isFutureDate(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate > today;
}

function isActiveNow(schedules) {
  if (!schedules || schedules.length === 0) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return schedules.some(s => {
    const start = new Date(s.start_date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(s.end_date);
    end.setHours(0, 0, 0, 0);
    return today >= start && today <= end;
  });
}

function getEarliestDate(schedules) {
  if (!schedules || schedules.length === 0) return null;
  return schedules.reduce((earliest, s) => s.start_date < earliest ? s.start_date : earliest, schedules[0].start_date);
}

function getLatestDate(schedules) {
  if (!schedules || schedules.length === 0) return null;
  return schedules.reduce((latest, s) => s.end_date > latest ? s.end_date : latest, schedules[0].end_date);
}

function totalDays(schedules) {
  if (!schedules || schedules.length === 0) return 0;
  return schedules.reduce((sum, s) => {
    const days = Math.ceil((new Date(s.end_date) - new Date(s.start_date)) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function totalExpenses(expenses) {
  if (!expenses || expenses.length === 0) return 0;
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

export default function FarmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plantation, setPlantation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Activity form state
  const [showModal, setShowModal] = useState(false);
  const [editActivity, setEditActivity] = useState(null);
  const [activityType, setActivityType] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [schedules, setSchedules] = useState([{ start_date: '', end_date: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Expense modal state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseActivity, setExpenseActivity] = useState(null);
  const [expenseId, setExpenseId] = useState(null); // null = adding, number = editing
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [savingExpense, setSavingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState('');

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

  const refreshPlantation = async () => {
    const res = await fetch(`/api/v1/plantations/${id}`);
    const data = await res.json();
    if (data.success) setPlantation(data.data);
  };

  const openAddModal = () => {
    setEditActivity(null);
    setActivityType('');
    setAmount('');
    setUnit('kg');
    setDescription('');
    setActivityDate('');
    setSchedules([{ start_date: '', end_date: '' }]);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (activity) => {
    setExpenseActivity(null);
    setEditActivity(activity);
    setActivityType(activity.activity_type);
    setAmount(activity.amount ?? '');
    setUnit(activity.unit || 'kg');
    setDescription(activity.description || '');
    setActivityDate(formatDateInput(activity.activity_date));
    setSchedules(
      activity.schedules && activity.schedules.length > 0
        ? activity.schedules.map(s => ({ start_date: formatDateInput(s.start_date), end_date: formatDateInput(s.end_date) }))
        : [{ start_date: formatDateInput(activity.activity_date), end_date: formatDateInput(activity.activity_date) }]
    );
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditActivity(null);
    setError('');
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = schedules.map((s, i) => i === index ? { ...s, [field]: value } : s);
    setSchedules(updated);
  };

  const addScheduleRow = () => {
    setSchedules([...schedules, { start_date: '', end_date: '' }]);
  };

  const removeScheduleRow = (index) => {
    if (schedules.length <= 1) return;
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activityType || !activityDate) return;

    const validSchedules = schedules.filter(s => s.start_date && s.end_date);
    if (validSchedules.length === 0) {
      setError('At least one date range is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const isEditing = editActivity !== null;
      const url = isEditing
        ? `/api/v1/plantations/activities/${editActivity.id}`
        : `/api/v1/plantations/${id}/activities`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: activityType,
          amount: amount ? Number(amount) : null,
          unit: unit || null,
          description: description.trim() || null,
          activity_date: activityDate,
          schedules: validSchedules,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to save activity.');
        return;
      }

      await refreshPlantation();
      closeModal();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- Expense handlers ---

  const openAddExpense = (activity, e) => {
    e.stopPropagation();
    setExpenseActivity(activity);
    setExpenseId(null);
    setExpenseDesc('');
    setExpenseAmount('');
    setExpenseDate('');
    setExpenseError('');
    setShowExpenseModal(true);
  };

  const openEditExpense = (expense, e) => {
    e.stopPropagation();
    setExpenseId(expense.id);
    setExpenseDesc(expense.description);
    setExpenseAmount(String(expense.amount));
    setExpenseDate(formatDateInput(expense.expense_date));
    setExpenseError('');
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setExpenseActivity(null);
    setExpenseId(null);
    setExpenseError('');
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmount || !expenseDate) return;

    setSavingExpense(true);
    setExpenseError('');

    try {
      const isEditing = expenseId !== null;
      const url = isEditing
        ? `/api/v1/plantations/expenses/${expenseId}`
        : `/api/v1/plantations/activities/${expenseActivity.id}/expenses`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: expenseDesc.trim(),
          amount: Number(expenseAmount),
          expense_date: expenseDate,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setExpenseError(data.message || 'Failed to save expense.');
        return;
      }

      await refreshPlantation();
      closeExpenseModal();
    } catch (err) {
      setExpenseError('Network error. Please try again.');
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseIdToDelete, e) => {
    e.stopPropagation();
    if (!confirm('Delete this expense?')) return;

    try {
      const res = await fetch(`/api/v1/plantations/expenses/${expenseIdToDelete}`, { method: 'DELETE' });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Failed to delete expense.');
        return;
      }

      await refreshPlantation();
      closeExpenseModal();
    } catch (err) {
      alert('Network error.');
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
          <button className="farm-add-btn" onClick={openAddModal}>
            + Add Activity
          </button>
        </div>

        {/* Activity Modal */}
        {showModal && (
          <div className="farm-modal-overlay" onClick={closeModal}>
            <div className="farm-modal" onClick={e => e.stopPropagation()}>
              <div className="farm-modal-header">
                <h2>{editActivity ? 'Edit Activity' : 'Add Activity'}</h2>
                <button className="farm-modal-close" onClick={closeModal}>&times;</button>
              </div>
              <form className="farm-form" onSubmit={handleSubmit}>
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
                    <option value="fertilizer">Fertilizer</option>
                    <option value="herbicide">Herbicide</option>
                    <option value="pesticide">Pesticide</option>
                    <option value="planting">Planting</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="pruning">Pruning</option>
                    <option value="weeding">Weeding</option>
                    <option value="harvest">Harvest</option>
                    <option value="other">Other</option>
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

                {/* Date Schedules */}
                <div className="farm-form-group">
                  <label>Date Ranges</label>
                  {schedules.map((s, idx) => (
                    <div key={idx} className="farm-schedule-row">
                      <div className="farm-schedule-fields">
                        <input
                          type="date"
                          value={s.start_date}
                          onChange={e => handleScheduleChange(idx, 'start_date', e.target.value)}
                          required
                          className="farm-schedule-input"
                        />
                        <span className="farm-schedule-sep">to</span>
                        <input
                          type="date"
                          value={s.end_date}
                          onChange={e => handleScheduleChange(idx, 'end_date', e.target.value)}
                          required
                          min={s.start_date || undefined}
                          className="farm-schedule-input"
                        />
                      </div>
                      {schedules.length > 1 && (
                        <button type="button" className="farm-schedule-remove" onClick={() => removeScheduleRow(idx)}>
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="farm-btn-secondary farm-schedule-add" onClick={addScheduleRow}>
                    + Add Range
                  </button>
                </div>

                <div className="farm-form-actions">
                  <button type="submit" className="farm-add-btn" disabled={saving}>
                    {saving ? 'Saving...' : editActivity ? 'Update Activity' : 'Save Activity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expense Modal */}
        {showExpenseModal && expenseActivity && (
          <div className="farm-modal-overlay" onClick={closeExpenseModal}>
            <div className="farm-modal" onClick={e => e.stopPropagation()}>
              <div className="farm-modal-header">
                <h2>{expenseId ? 'Edit Expense' : 'Add Expense'}</h2>
                <button className="farm-modal-close" onClick={closeExpenseModal}>&times;</button>
              </div>

              {/* Expense Form */}
              <form className="farm-form" onSubmit={handleExpenseSubmit} style={{ marginBottom: '20px' }}>
                {expenseError && <p className="farm-error">{expenseError}</p>}
                <div className="farm-form-group">
                  <label htmlFor="expenseDesc">Description</label>
                  <input
                    id="expenseDesc"
                    type="text"
                    placeholder="e.g. Labor cost, Seeds, Fertilizer"
                    value={expenseDesc}
                    onChange={e => setExpenseDesc(e.target.value)}
                    required
                  />
                </div>
                <div className="farm-form-row">
                  <div className="farm-form-group">
                    <label htmlFor="expenseAmount">Amount (Rp)</label>
                    <input
                      id="expenseAmount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={e => setExpenseAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="farm-form-group">
                    <label htmlFor="expenseDate">Date</label>
                    <input
                      id="expenseDate"
                      type="date"
                      value={expenseDate}
                      onChange={e => setExpenseDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="farm-add-btn" disabled={savingExpense} style={{ width: '100%' }}>
                  {savingExpense ? 'Saving...' : expenseId ? 'Update Expense' : 'Add Expense'}
                </button>
              </form>

              {/* Expense List */}
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px' }}>
                Expenses for {formatUppercaseFirstLetter(expenseActivity.activity_type)}
              </h3>
              {(!expenseActivity.expenses || expenseActivity.expenses.length === 0) ? (
                <p className="farm-empty" style={{ margin: 0, fontSize: '14px' }}>No expenses recorded yet.</p>
              ) : (
                <div>
                  {expenseActivity.expenses.map(ex => (
                    <div key={ex.id} className="expense-row" onClick={(e) => openEditExpense(ex, e)}>
                      <div className="expense-row-info">
                        <span className="expense-row-desc">{ex.description}</span>
                        <span className="expense-row-date">{formatDate(ex.expense_date)}</span>
                      </div>
                      <div className="expense-row-right">
                        <span className="expense-row-amount">{formatCurrency(ex.amount)}</span>
                        <button className="expense-row-delete" onClick={(e) => handleDeleteExpense(ex.id, e)}>
                          &times;
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="expense-total">
                    Total: {formatCurrency(totalExpenses(expenseActivity.expenses))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        {activities.length === 0 ? (
          <p className="farm-empty">No activities recorded yet. Add your first activity!</p>
        ) : (
          <div className="timeline">
            {activities.map((a, idx) => {
              const activeNow = isActiveNow(a.schedules);
              const earliest = getEarliestDate(a.schedules);
              const latest = getLatestDate(a.schedules);
              const future = earliest ? isFutureDate(earliest) : false;
              const totalWorkDays = totalDays(a.schedules);
              const hasMultipleRanges = a.schedules && a.schedules.length > 1;
              const expenseTotal = totalExpenses(a.expenses);

              let statusClass = '';
              if (activeNow) statusClass = ' timeline-item--active';
              else if (future) statusClass = ' timeline-item--future';

              return (
                <div
                  key={a.id}
                  className={`timeline-item${statusClass}`}
                >
                  <div className="timeline-marker">{getIcon(a.activity_type)}</div>
                  <div className="timeline-content">
                    <div className="timeline-header" onClick={() => openEditModal(a)} style={{ cursor: 'pointer' }}>
                      <span className="timeline-type">{formatUppercaseFirstLetter(a.activity_type)}</span>
                      <span className="timeline-date">
                        {future && <span className="timeline-upcoming-badge">Upcoming</span>}
                        {activeNow && <span className="timeline-active-badge">In Progress</span>}
                        {earliest && latest && earliest !== latest
                          ? `${formatDate(earliest)} — ${formatDate(latest)}`
                          : earliest ? formatDate(earliest) : ''}
                      </span>
                    </div>
                    <div onClick={() => openEditModal(a)} style={{ cursor: 'pointer' }}>
                      {a.description && (
                        <p className="timeline-desc">{a.description}</p>
                      )}
                      {a.amount && (
                        <p className="timeline-amount">{a.amount} {a.unit || ''}</p>
                      )}
                      {a.schedules && a.schedules.length > 0 && (
                        <p className="timeline-duration">{totalWorkDays} work day(s){hasMultipleRanges ? ` in ${a.schedules.length} range(s)` : ''}</p>
                      )}
                      {hasMultipleRanges && (
                        <div className="timeline-schedules">
                          {a.schedules.map((s, i) => (
                            <span key={i} className="timeline-schedule-chip">
                              {formatDate(s.start_date)} — {formatDate(s.end_date)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Expenses */}
                    <div className="timeline-expenses" onClick={(e) => e.stopPropagation()}>
                      <button className="timeline-expenses-btn" onClick={(e) => openAddExpense(a, e)}>
                        {expenseTotal > 0 ? (
                          <>{formatCurrency(expenseTotal)} <span className="timeline-expenses-add">+</span></>
                        ) : (
                          <>+ Add Expense</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}