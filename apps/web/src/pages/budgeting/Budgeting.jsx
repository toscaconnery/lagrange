import { useState } from 'react';
import '../../css/budgeting.css';

const PERSONS = ['You', 'Friend', 'Family', 'Other'];

const initialExpenses = [
  { id: 1, person: 'You', productName: 'Indomie Goreng', price: 3500, quantity: 2, discount: 0, date: '2026-06-01' },
  { id: 2, person: 'You', productName: 'Kopi Kapal Api', price: 12000, quantity: 1, discount: 1000, date: '2026-06-02' },
  { id: 3, person: 'Friend', productName: 'Telur (1 kg)', price: 28000, quantity: 1, discount: 0, date: '2026-06-03' },
  { id: 4, person: 'Family', productName: 'Beras 5kg', price: 65000, quantity: 1, discount: 5000, date: '2026-06-05' },
  { id: 5, person: 'You', productName: 'Sabun Cuci Piring', price: 15000, quantity: 2, discount: 2000, date: '2026-06-07' },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default function Budgeting() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [personFilter, setPersonFilter] = useState('All');
  const [form, setForm] = useState({
    person: 'You',
    productName: '',
    price: '',
    quantity: 1,
    discount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = personFilter === 'All'
    ? expenses
    : expenses.filter((e) => e.person === personFilter);

  const totalSpent = filteredExpenses.reduce((sum, e) => {
    return sum + (e.price * e.quantity - e.discount);
  }, 0);

  // Per-person totals (always from all expenses, not filtered)
  const personTotals = PERSONS.map((p) => {
    const total = expenses
      .filter((e) => e.person === p)
      .reduce((sum, e) => sum + (e.price * e.quantity - e.discount), 0);
    const count = expenses.filter((e) => e.person === p).length;
    return { person: p, total, count };
  }).filter((p) => p.count > 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productName || !form.price) return;

    const newExpense = {
      id: Date.now(),
      person: form.person,
      productName: form.productName,
      price: Number(form.price),
      quantity: Number(form.quantity),
      discount: Number(form.discount) || 0,
      date: form.date,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setForm({
      person: 'You',
      productName: '',
      price: '',
      quantity: 1,
      discount: 0,
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budgeting-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) {
          alert('Invalid format: JSON must be an array of expense items.');
          return;
        }
        const validated = data.map((item, index) => ({
          id: item.id ?? Date.now() + index,
          person: item.person || 'You',
          productName: item.productName || '',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          discount: Number(item.discount) || 0,
          date: item.date || new Date().toISOString().split('T')[0],
        }));
        setExpenses(validated);
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be re-imported if needed
    e.target.value = '';
  };

  const personBadgeClass = (person) => {
    const colors = {
      'You': 'badge-you',
      'Friend': 'badge-friend',
      'Family': 'badge-family',
      'Other': 'badge-other',
    };
    return colors[person] || 'badge-other';
  };

  return (
    <div className="budgeting-page">
      <div className="budgeting-container">
        <header className="budgeting-hero">
          <h1>Budgeting</h1>
          <p>Record and track your expenses.</p>
        </header>

        <section className="budgeting-stats">
          <div className="stat-card">
            <span>
              {personFilter === 'All' ? 'Total Expenses' : `${personFilter}'s Items`}
            </span>
            <strong>{filteredExpenses.length}</strong>
          </div>
          <div className="stat-card">
            <span>
              {personFilter === 'All' ? 'Total Spent' : `${personFilter}'s Total`}
            </span>
            <strong>{formatCurrency(totalSpent)}</strong>
          </div>
        </section>

        {personTotals.length > 1 && (
          <section className="person-stats">
            {personTotals.map((p) => (
              <div
                key={p.person}
                className={`person-stat-card ${personBadgeClass(p.person)}`}
              >
                <span className="person-name">{p.person}</span>
                <strong className="person-total">{formatCurrency(p.total)}</strong>
                <span className="person-count">{p.count} item{p.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </section>
        )}

        <section className="budgeting-actions">
          <div className="action-bar">
            <div className="action-left">
              <button
                className="btn-add"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : '+ Add Expense'}
              </button>
            </div>

            <div className="action-right">
              <button
                className="btn-export"
                onClick={handleExportJSON}
                title="Export as JSON"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export JSON
              </button>

              <label className="btn-import-label">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJSON}
                  style={{ display: 'none' }}
                />
                <span className="btn-import" title="Import from JSON">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Import JSON
                </span>
              </label>

              <div className="filter-group">
                <select
                  id="personFilter"
                  value={personFilter}
                  onChange={(e) => setPersonFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  {PERSONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {showForm && (
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Person
                <select
                  name="person"
                  value={form.person}
                  onChange={handleChange}
                >
                  {PERSONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                Product Name
                <input
                  type="text"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="e.g. Indomie Goreng"
                  required
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 3500"
                  min="0"
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Quantity
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="1"
                />
              </label>
              <label>
                Discount
                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <button type="submit" className="btn-submit">Save</button>
          </form>
        )}

        <section className="expenses-section">
          <div className="section-header">
            <h2>Expense List</h2>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="empty-state">
              No expenses recorded yet. Add one above!
            </div>
          )}

          {filteredExpenses.length > 0 && (
            <div className="expense-table">
              <div className="expense-table-header">
                <div>Person</div>
                <div>Product</div>
                <div>Price</div>
                <div>Qty</div>
                <div>Discount</div>
                <div>Subtotal</div>
                <div>Date</div>
                <div className="col-actions"></div>
              </div>

              {filteredExpenses.map((expense) => {
                const subtotal = expense.price * expense.quantity - expense.discount;
                return (
                  <div key={expense.id} className="expense-row">
                    <div className="expense-person">
                      <span className={`person-badge ${personBadgeClass(expense.person)}`}>
                        {expense.person}
                      </span>
                    </div>
                    <div className="expense-product">{expense.productName}</div>
                    <div className="expense-price">{formatCurrency(expense.price)}</div>
                    <div className="expense-qty">{expense.quantity}</div>
                    <div className="expense-discount">
                      {expense.discount > 0 ? formatCurrency(expense.discount) : '-'}
                    </div>
                    <div className="expense-subtotal">{formatCurrency(subtotal)}</div>
                    <div className="expense-date">{expense.date}</div>
                    <div className="expense-actions">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(expense.id)}
                        title="Delete item"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}