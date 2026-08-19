import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function FisheryFeedDetail() {
  const { id } = useParams();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/fishery/feed/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFeed(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id])

  useEffect(() => {
    document.title = 'Pakan';
  }, [])

  function feedTypeTranslator(type) {
    console.log(type)
    if (type === 'sink') return 'tenggelam';
    else if (type === 'float') return 'apung';
  }


  return (
    <>
      <FisheryHeader backTo="/fishery/feed"/>
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <h1>{feed?.name}</h1>
        </div>

        {loading ? (
          <p className="fishery-empty">Loading...</p>
        ) : feed?.name ? (
          <div className="fishery-grid">
            <div className="fishery-card-detail">
              <div>Tipe: {feedTypeTranslator(feed.type)}</div>
              <div>Berat: {feed.weight}</div>
            </div>
          </div>
        ) : (
          <p className="fishery-empty">Pakan tidak ditemukan.</p>
        )}
      </div>
    </>
  );
}
