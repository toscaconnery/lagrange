import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateIDN, formatDateShort } from '../../../../api/src/utils/formatter';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function totalExpenses(expenses) {
  if (!expenses || expenses.length === 0) return 0;
  return expenses.reduce((sum, e) => sum + Number(e.volume) * Number(e.unit_price), 0);
}

export default function FisheryCycleDetail() {
  const { id } = useParams();
  const [cycle, setCycle] = useState(null);
  const [pool, setPool] = useState(null);
  const [poolId, setPoolId] = useState(null);
  const [expenses] = useState([
    { id: 1, description: 'Pakan Pelet', expense_date: '2026-08-01', volume: 10, unit: 'sak', unit_price: 150000 },
    { id: 2, description: 'Vitamin & Suplemen', expense_date: '2026-08-10', volume: 5, unit: 'bungkus', unit_price: 70000 },
    { id: 3, description: 'Listrik Aerator', expense_date: '2026-08-15', volume: 1, unit: 'bulan', unit_price: 200000 },
    { id: 4, description: 'Tenaga Kerja', expense_date: '2026-08-18', volume: 1, unit: 'bulan', unit_price: 750000 },
    { id: 4, description: 'Listrik dan penyusutan mesin celup (Bulan)', expense_date: '2026-08-18', volume: 7, unit: 'bulan', unit_price: 1750000 },
    
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
                  <div className="fishery-table-wrap">
                    <table className="fishery-table">
                      <thead>
                        <tr>
                          <th>Keterangan</th>
                          <th>Jumlah</th>
                          {/* <th className="text-right">Volume</th> */}
                          {/* <th>Satuan</th> */}
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
                            {/* <td className="text-right">{ex.volume}</td> */}
                            {/* <td>{ex.unit}</td> */}
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
            )}
          </>
        ) : (
          <p className="fishery-empty">Siklus tidak ditemukan.</p>
        )}
      </div>
    </>
  );
}
