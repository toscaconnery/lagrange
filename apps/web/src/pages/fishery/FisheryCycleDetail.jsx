import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryCycleDetail() {
  const { id } = useParams();
  const [cycle, setCycle] = useState(null);
  const [pool, setPool] = useState(null);
//   const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/fishery/cycle/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCycle(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id])

  useEffect(() => {
    document.title = 'Detail Siklus Budidaya';
  }, [])


  return (
    <>
      <FisheryHeader backTo="/fishery/cycle" />
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <h1>{cycle?.label}</h1>
        </div>

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : cycle?.label ? (
          <div className="fishery-grid">
            <div className="fishery-card-detail">
              <div>ABC</div>
              <div>EFG</div>
            </div>
          </div>
        ) : (
          <p className="fishery-empty">Pakan tidak ditemukan.</p>
        )}
      </div>
    </>
  );
}
