import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';
import FisheryCycleInfoTab from '../../components/FisheryComp/Cycle/FisheryCycleInfoTab';
import FisheryCycleHarvestTab from '../../components/FisheryComp/Cycle/FisheryCycleHarvestTab';
import FisheryCycleExpenseTab from '../../components/FisheryComp/Cycle/FisheryCycleExpenseTab';

export default function FisheryCycleDetail() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('info');

  const [tabData, setTabData] = useState({
    info: {
      cycle: null,
      pool: null,
    },
    expenses: null,
    harvest: null,
  });

  useEffect(() => {
    document.title = 'Detail Siklus Budidaya';
  }, [])

  const updateTabData = useCallback((tab, data) => {
    setTabData(prev => ({
      ...prev,
      [tab]: data,
    }));
  }, []);

  const handleInfoDataLoaded = useCallback((data) => {
    updateTabData('info', data);
  }, [updateTabData]);

  const handleExpensesDataLoaded = useCallback((data) => {
    updateTabData('expenses', data)
  }, [updateTabData])

  return (
    <>
      <FisheryHeader backTo="/fishery/cycle"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <h2>{tabData.info.cycle?.label}</h2>
        </div>

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

        {activeTab === 'info' && (
          <>
            <div>To do: start a new cycle button, end cycle button.</div>
            <div>End cycle button should be on harvest tab.</div>
            <FisheryCycleInfoTab
              cycleId={id}
              pool={tabData.info.pool}
              cycle={tabData.info.cycle}
              onDataLoaded={handleInfoDataLoaded}
            />
          </>
        )}

        {activeTab === 'biaya' && (
          <>
            <FisheryCycleExpenseTab
              cycleId={id}
              expenses={tabData.expenses}
              onDataLoaded={handleExpensesDataLoaded}
            />
          </>
        )}

        {activeTab === 'panen' && (<FisheryCycleHarvestTab />)}

      </div>
    </>
  );
}