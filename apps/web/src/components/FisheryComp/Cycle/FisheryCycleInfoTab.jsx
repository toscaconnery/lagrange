import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import { convertTimbangToKg } from '../../../../../api/src/utils/converter';
import { formatDateShort, formatDateIDN } from '../../../../../api/src/utils/formatter';

export default function FisheryCycleInfoTab({cycle, pool}) {
  const navigate = useNavigate();

  const [expenses] = useState([
    { id: 1, description: 'Pakan Pelet', expense_date: '2026-08-01', volume: 10, unit: 'sak', unit_price: 150000 },
    { id: 2, description: 'Vitamin & Suplemen', expense_date: '2026-08-10', volume: 5, unit: 'bungkus', unit_price: 70000 },
    { id: 3, description: 'Listrik Aerator', expense_date: '2026-08-15', volume: 1, unit: 'bulan', unit_price: 200000 },
    { id: 4, description: 'Tenaga Kerja', expense_date: '2026-08-18', volume: 1, unit: 'bulan', unit_price: 750000 },
    { id: 4, description: 'Listrik dan penyusutan mesin celup (Bulan)', expense_date: '2026-08-18', volume: 7, unit: 'bulan', unit_price: 1750000 },
  ]);

  function totalExpenses(expenses) {
    if (!expenses || expenses.length === 0) return 0;
    return expenses.reduce((sum, e) => sum + Number(e.volume) * Number(e.unit_price), 0);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <>
      {/* <div className="fishery-stats-cycle">
        <div className="fishery-stat-card fishery-stat-cycle-card">
          <div className="stat-value">12 ton</div>
          <div className="stat-label">Pakan</div>
        </div>
        <div className="fishery-stat-card fishery-stat-cycle-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Bulan</div>
        </div>
        <div className="fishery-stat-card fishery-stat-cycle-card">
          <div className="stat-value">10.000</div>
          <div className="stat-label">Ekor</div>
        </div>
      </div>

      <div className="fishery-stats-cycle">
        <div className="fishery-stat-card fishery-stat-cycle-card">
          <div className="stat-value">11 ton</div>
          <div className="stat-cycle-label"> ikan</div>
        </div>
        <div className="fishery-stat-card fishery-stat-cycle-card">
          <div className="stat-value">70%</div>
          <div className="stat-cycle-label">FCR</div>
        </div>
        <div className="fishery-stat-card fishery-stat-cycle-card">
          <div className="stat-value">102.6JT</div>
          <div className="stat-cycle-label">Penjualan</div>
        </div>
      </div> */}

      <div className="fishery-detail-section">
        <h2 className="fishery-detail-section-title">Info Siklus</h2>
        <div className="fishery-info-card">
          {/* <div className="fishery-detail-row">
            <span className="fishery-detail-label">Label</span>
            <span className="fishery-detail-value">{cycle.label}</span>
          </div> */}
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Tanggal Masuk Bibit</span>
            <span className="fishery-detail-value">{formatDateIDN(cycle.seed_date)}</span>
          </div>
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Jumlah Bibit</span>
            <span className="fishery-detail-value">{cycle.seed_count} ekor</span>
          </div>
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Biaya Bibit</span>
            <span className="fishery-detail-value">Rp {Number(cycle.seed_price).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="fishery-detail-section">
        <h2 className="fishery-detail-section-title">Info Kolam</h2>
        <div className="fishery-info-card">
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Nama Kolam</span>
            <span className="fishery-detail-value">{pool?.name || '-'}</span>
          </div>
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Status Kolam</span>
            <span className="fishery-detail-value">{pool?.status || '-'}</span>
          </div>
        </div>
      </div>
                  
    </>
  );
}