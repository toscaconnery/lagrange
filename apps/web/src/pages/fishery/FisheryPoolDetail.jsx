import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryPoolDetail() {
  const { id } = useParams();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/fishery/pool/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPool(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id])

  useEffect(() => {
    document.title = 'Detail Kolam';
  }, [])


  return (
    <>
      <FisheryHeader backTo="/fishery/pool"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <h1>{pool?.name}</h1>
        </div>

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : pool?.name ? (
          <div className="fishery-grid">
            <div className="fishery-card-detail">
              <div>{pool.status}</div>
            </div>
          </div>
        ) : (
          <p className="fishery-empty">Kolam tidak ditemukan.</p>
        )}

        <div style={{color:'red'}}>Todo: add cycle list here</div>
      </div>
    </>
  );
}
