import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateIDN } from '../../../../api/src/utils/formatter';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function totalExpenses(expenses) {
  if (!expenses || expenses.length === 0) return 0;
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}

export default function FisheryCycleDetail() {
  const { id } = useParams();
  const [cycle, setCycle] = useState(null);
  const [pool, setPool] = useState(null);
  const [poolId, setPoolId] = useState(null);
  const [expenses] = useState([
    { id: 1, description: 'Pakan Pelet', expense_date: '2026-08-01', amount: 1500000 },
    { id: 2, description: 'Vitamin & Suplemen', expense_date: '2026-08-10', amount: 350000 },
    { id: 3, description: 'Listrik Aerator', expense_date: '2026-08-15', amount: 200000 },
    { id: 4, description: 'Tenaga Kerja', expense_date: '2026-08-18', amount: 750000 },
  ]);
//   const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetch(`/api/v1/fishery/cycle/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCycle(data.data);
          setPoolId(data.data.pool_id)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id])

  useEffect(() => {
    fetch(`/api/v1/fishery/pool/${poolId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPool(data.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [poolId])

  useEffect(() => {
    document.title = 'Detail Siklus Budidaya';
  }, [])


  return (
    <>
      <FisheryHeader backTo="/fishery/cycle"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <h2>{cycle?.label}</h2>
        </div>

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : cycle?.label ? (
          <>
            <div className="fishery-tabs">
              <button
                className={`fishery-tab ${activeTab === 'info' ? 'fishery-tab--active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Info
              </button>
              <button
                className={`fishery-tab ${activeTab === 'biaya' ? 'fishery-tab--active' : ''}`}
                onClick={() => setActiveTab('biaya')}
              >
                Biaya
              </button>
            </div>

            {activeTab === 'info' && (
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
            )}

            {activeTab === 'biaya' && (
            <div className="fishery-detail-section">
              <h2 className="fishery-detail-section-title">Biaya</h2>
              <div className="fishery-info-card">
                {expenses.length === 0 ? (
                  <div className="fishery-detail-row">
                    <span className="fishery-detail-label">Belum ada biaya tercatat.</span>
                  </div>
                ) : (
                  <>
                    {expenses.map(ex => (
                      <div key={ex.id} className="expense-row">
                        <div className="expense-row-info align-items-start">
                          <span className="expense-row-desc">{ex.description}</span>
                          <span className="expense-row-date">{formatDateIDN(ex.expense_date)}</span>
                        </div>
                        <div className="expense-row-right">
                          <span className="expense-row-amount">{formatCurrency(ex.amount)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="expense-total">
                      Total: {formatCurrency(totalExpenses(expenses))}
                    </div>
                  </>
                )}
              </div>
            </div>
            )}
          </>
        ) : (
          <p className="fishery-empty">Siklus tidak ditemukan.</p>
        )}
      </div>
    </>
  );
}
