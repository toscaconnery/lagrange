import { useState, useMemo, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);
import '../../css/expenseledger.css';

const initialExpenses = [
  { id: 1, person: 'You', productName: 'Indomie Goreng', price: 3500, quantity: 2, discount: 0, date: '2026-06-01' },
  { id: 2, person: 'You', productName: 'Kopi Kapal Api', price: 12000, quantity: 1, discount: 1000, date: '2026-06-02' },
  { id: 3, person: 'Friend', productName: 'Telur (1 kg)', price: 28000, quantity: 1, discount: 0, date: '2026-06-03' },
  { id: 4, person: 'Family', productName: 'Beras 5kg', price: 65000, quantity: 1, discount: 5000, date: '2026-06-05' },
  { id: 5, person: 'You', productName: 'Sabun Cuci Piring', price: 15000, quantity: 2, discount: 2000, date: '2026-06-07' },
];

/* Deterministic color from a person's name */
function stringToColor(str) {
    // FNV-1a hash — better bit avalanche than simple charCode shifting
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
        hash = hash >>> 0; // keep unsigned 32-bit
    }

    // Golden ratio conjugate (≈0.618) — maps any integer
    // to a hue that's always ~137.5° away from the previous one
    const GOLDEN_RATIO = 0.6180339887;
    const hue = Math.round((hash * GOLDEN_RATIO % 1) * 360);

    return `hsl(${hue}, 55%, 50%)`;
}

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

export default function ExpenseLedger () {
  useEffect(() => {
    document.title = 'Expense Ledger';
  }, []);

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
  const personTotals = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      if (!map[e.person]) {
        map[e.person] = { person: e.person, total: 0, count: 0 };
      }
      map[e.person].total += e.price * e.quantity - e.discount;
      map[e.person].count += 1;
    });
    return Object.values(map);
  }, [expenses]);

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
      person: '',
      productName: '',
      price: '',
      quantity: 1,
      discount: '',
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

  // Derive unique person names from expenses for dynamic filter / input
  const knownPersons = useMemo(() => {
    const set = new Set(expenses.map((e) => e.person));
    return Array.from(set).sort();
  }, [expenses]);

  /** Export a receipt PDF for the given person (or all filtered). */
  const handleExportReceiptPDF = (person) => {
    const targetPerson = person || personFilter;
    const items = targetPerson === 'All'
      ? expenses
      : expenses.filter((e) => e.person === targetPerson);

    if (items.length === 0) {
      alert('No expenses to export.');
      return;
    }

    const total = items.reduce((s, e) => s + (e.price * e.quantity - e.discount), 0);

    // Calculate the total content height so the PDF trims exactly to fit
    const lineHeight = 4.5;
    let contentHeight = 8; // start y

    // header
    contentHeight += lineHeight + (lineHeight - 0.5) + (targetPerson !== 'All' ? lineHeight - 0.5 : 0) + 1 + 3.5;
    // column header + dash
    contentHeight += 1.5 + 3.5;
    // items
    items.forEach((e) => {
      contentHeight += lineHeight;
      if (e.discount > 0) contentHeight += lineHeight;
    });
    // dashes + total + discount line + footer
    contentHeight += 1 + 4 + lineHeight + 1;
    if (items.reduce((s, e) => s + e.discount, 0) > 0) contentHeight += lineHeight;
    contentHeight += 5 + 5;

    contentHeight = Math.max(contentHeight, 50);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, Math.ceil(contentHeight)],
    });

    const pageWidth = 80;
    const marginX = 5;
    let y = 8;

    const dash = (yPos) => {
      doc.setDrawColor(80);
      doc.setLineWidth(0.2);
      doc.line(marginX, yPos, pageWidth - marginX, yPos);
    };

    const text = (str, xPos, yPos, opts = {}) => {
      doc.text(str, xPos, yPos, opts);
    };

    // ── Header ──────────────────────────────────────────
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    text('Expense Ledger', pageWidth / 2, y, { align: 'center' });
    y += lineHeight;

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit',
    });
    text(`${dateStr}  ${timeStr}`, pageWidth / 2, y, { align: 'center' });
    y += lineHeight - 0.5;

    if (targetPerson !== 'All') {
      text(`For: ${targetPerson}`, pageWidth / 2, y, { align: 'center' });
      y += lineHeight - 0.5;
    }

    y += 1;
    dash(y);
    y += 3.5;

    // ── Column header ────────────────────────────────────
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    text('ITEM', marginX, y);
    text('QTY', marginX + 35, y, { align: 'right' });
    text('HARGA', marginX + 50, y, { align: 'right' });
    text('SUBTOTAL', pageWidth - marginX, y, { align: 'right' });
    y += 1.5;
    dash(y);
    y += 3.5;

    // ── Items ────────────────────────────────────────────
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);

    items.forEach((e) => {
      const subtotal = e.price * e.quantity - e.discount;
      const nameMaxChars = 22;
      const displayName = e.productName.length > nameMaxChars
        ? e.productName.substring(0, nameMaxChars - 1) + '…'
        : e.productName;

      text(displayName.toUpperCase(), marginX, y);
      text(String(e.quantity), marginX + 35, y, { align: 'right' });
      text(Number(e.price).toLocaleString('id-ID'), marginX + 50, y, { align: 'right' });
      text(Number(subtotal).toLocaleString('id-ID'), pageWidth - marginX, y, { align: 'right' });
      y += lineHeight;

      if (e.discount > 0) {
        doc.setTextColor(120);
        text(`  DISCOUNT : (${Number(e.discount).toLocaleString('id-ID')})`, marginX, y);
        doc.setTextColor(0);
        y += lineHeight;
      }
    });

    y += 1;
    dash(y);
    y += 4;

    // ── Total ─────────────────────────────────────────────
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    text('TOTAL BELANJA :', marginX, y);
    text(Number(total).toLocaleString('id-ID'), pageWidth - marginX, y, { align: 'right' });
    y += lineHeight + 1;

    const totalDiscount = items.reduce((s, e) => s + e.discount, 0);
    if (totalDiscount > 0) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      text('ANDA HEMAT :', marginX, y);
      text(Number(totalDiscount).toLocaleString('id-ID'), pageWidth - marginX, y, { align: 'right' });
      y += lineHeight;
    }

    dash(y);
    y += 5;

    // ── Footer ────────────────────────────────────────────
    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(130);
    text('Terima kasih!', pageWidth / 2, y, { align: 'center' });

    const filename = targetPerson === 'All'
      ? `struk-all-${new Date().toISOString().split('T')[0]}.pdf`
      : `struk-${targetPerson.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    doc.save(filename);
};

  return (
    <div className="budgeting-page">
      <div className="budgeting-container">
        <header className="budgeting-hero">
          <h1>Expense Ledger</h1>
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
                className="person-stat-card"
                style={{ '--person-color': stringToColor(p.person) }}
              >
                <span className="person-name" style={{ color: stringToColor(p.person) }}>{p.person}</span>
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
                + Add Expense
              </button>
            </div>

            <div className="action-right">
              {personFilter !== 'All' && (
                <button
                  className="btn-receipt"
                  onClick={() => handleExportReceiptPDF(personFilter)}
                  title="Export receipt PDF"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                    <path d="M8 7h8" />
                    <path d="M8 11h8" />
                    <path d="M8 15h5" />
                  </svg>
                  {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg> */}
                  Print Receipt
                </button>
              )}
              <button
                className="btn-export"
                onClick={handleExportJSON}
                title="Export as JSON"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
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
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
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
                  {knownPersons.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Modal overlay for add expense ---- */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Expense</h2>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>
              <form className="expense-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label>
                    Person
                    <input
                      type="text"
                      name="person"
                      value={form.person}
                      onChange={handleChange}
                      placeholder="e.g. You"
                      required
                    />
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
            </div>
          </div>
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
                <div class="expense-person">Person</div>
                <div class="expense-product">Product</div>
                <div class="expense-price">Price</div>
                <div class="expense-qty">Qty</div>
                <div class="expense-discount">Discount</div>
                <div class="expense-subtotal">Subtotal</div>
                <div class="expense-date">Date</div>
                <div className="expense-actions col-actions"></div>
              </div>

              {filteredExpenses.map((expense) => {
                const subtotal = expense.price * expense.quantity - expense.discount;
                return (
                  <div key={expense.id} className="expense-row">
                    <div className="expense-person">
                      <span
                        className="person-badge"
                        style={{
                          backgroundColor: stringToColor(expense.person).replace('hsl', 'hsla').replace(')', ', 0.12)'),
                          color: stringToColor(expense.person),
                          borderColor: stringToColor(expense.person).replace('hsl', 'hsla').replace(')', ', 0.25)'),
                        }}
                      >
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