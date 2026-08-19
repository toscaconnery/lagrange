import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDateIDN } from '../../../../api/src/utils/formatter';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryCycleDetail() {
  const { id } = useParams();
  const [cycle, setCycle] = useState(null);
  const [pool, setPool] = useState(null);
  const [poolId, setPoolId] = useState(null);
//   const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <FisheryHeader backTo="/fishery/cycle" />
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <h2>{cycle?.label}</h2>
        </div>

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : cycle?.label ? (
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
        ) : (
          <p className="fishery-empty">Siklus tidak ditemukan.</p>
        )}
      </div>
    </>
  );
}
