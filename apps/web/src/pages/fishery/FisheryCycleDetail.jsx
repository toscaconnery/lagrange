import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';
import FisheryCycleInfoTab from '../../components/FisheryComp/Cycle/FisheryCycleInfoTab';
import FisheryCycleHarvestTab from '../../components/FisheryComp/Cycle/FisheryCycleHarvestTab';
import FisheryCycleExpenseTab from '../../components/FisheryComp/Cycle/FisheryCycleExpenseTab';

export default function FisheryCycleDetail() {
  const { id } = useParams();
  const [cycle, setCycle] = useState(null);
  const [pool, setPool] = useState(null);
  const [poolId, setPoolId] = useState(null);

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
                Biaya Operasional
              </button>
              <button
                className={`fishery-tab ${activeTab === 'panen' ? 'fishery-tab--active' : ''}`}
                onClick={() => setActiveTab('panen')}
              >
                Panen
              </button>
            </div>

            {activeTab === 'info' && (<FisheryCycleInfoTab cycle={cycle} pool={pool}/>)}

            {activeTab === 'panen' && (<FisheryCycleHarvestTab />)}

            {activeTab === 'biaya' && (<FisheryCycleExpenseTab />)}
          </>
        ) : (
          <p className="fishery-empty">Siklus tidak ditemukan.</p>
        )}
      </div>
    </>
  );
}
