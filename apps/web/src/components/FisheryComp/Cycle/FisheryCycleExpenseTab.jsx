import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import { convertTimbangToKg } from '../../../../../api/src/utils/converter';
import { formatDateShort } from '../../../../../api/src/utils/formatter';

export default function FisheryCycleExpenseTab({}) {
  const navigate = useNavigate();

  const [expenses] = useState([
    { id: 1, description: 'Pakan Pelet', expense_date: '2026-08-01', volume: 10, unit: 'sak', unit_price: 150000 },
    { id: 2, description: 'Vitamin & Suplemen', expense_date: '2026-08-10', volume: 5, unit: 'bungkus', unit_price: 70000 },
    { id: 3, description: 'Listrik Aerator', expense_date: '2026-08-15', volume: 1, unit: 'bulan', unit_price: 200000 },
    { id: 4, description: 'Tenaga Kerja', expense_date: '2026-08-18', volume: 1, unit: 'bulan', unit_price: 750000 },
    { id: 5, description: 'Listrik dan penyusutan mesin celup (Bulan)', expense_date: '2026-08-18', volume: 7, unit: 'bulan', unit_price: 1750000 },
  ]);

  function totalExpenses(expenses) {
    if (!expenses || expenses.length === 0) return 0;
    return expenses.reduce((sum, e) => sum + Number(e.volume) * Number(e.unit_price), 0);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="fishery-detail-section">
      <h2 className="fishery-detail-section-title">Biaya</h2>
      <div className="fishery-info-card">
        {expenses.length === 0 ? (
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
    </div>
  );
}