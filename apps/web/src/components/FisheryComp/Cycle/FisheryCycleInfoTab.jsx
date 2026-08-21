import { useState, useEffect } from 'react';
import { formatDateIDN } from '../../../../../api/src/utils/formatter';

export default function FisheryCycleInfoTab({cycleId, cycle, pool, onDataLoaded}) {

  const [loading, setLoading] = useState(!(cycle && pool));

  useEffect(() => {
    // If we already have the data, no need to fetch again
    if (cycle && pool) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Fetch cycle data
        const cycleRes = await fetch(`/api/v1/fishery/cycle/${cycleId}`);
        const cycleJson = await cycleRes.json();
        const fetchedCycle = cycleJson.data;

        console.log('C : ', fetchedCycle)

        // Fetch pool data using the cycle's pool_id
        const poolRes = await fetch(`/api/v1/fishery/pool/${fetchedCycle.pool_id}`);
        const poolJson = await poolRes.json();
        const fetchedPool = poolJson.data;

        console.log('P : ', fetchedPool)

        // Pass both up to the parent so it can cache them
        onDataLoaded({
          cycle: fetchedCycle,
          pool: fetchedPool,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cycle, pool, cycleId, onDataLoaded]);

  if (loading) {
    return <p className="fishery-empty">Loading...</p>;
  }

  return (
    <>
      {
        cycle ? (
          <>
            <div className="fishery-stats-cycle">
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

            <div className="fishery-detail-section">
              <h2 className="fishery-detail-section-title">Info Siklus</h2>
              <div className="fishery-info-card">
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
          <></>
        )
      }
    </>
  );
}