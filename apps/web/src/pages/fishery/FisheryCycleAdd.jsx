import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateIDN } from '../../../../api/src/utils/formatter';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';

export default function FisheryCycleAdd() {
  const navigate = useNavigate();
  const [poolName, setPoolName] = useState('');
  const [selectedPool, setSelectedPool] = useState(null);

  const [poolId, setPoolId] = useState('');
  const [label, setLabel] = useState('');
  const [seedDate, setSeedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [seedCount, setSeedCount] = useState('');
  const [seedPrice, setSeedPrice] = useState('');

  const [pools, setPools] = useState([]);

  const [seedCountError, setSeedCountError] = useState('');
  const [seedPriceError, setSeedPriceError] = useState('');

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [error, setError] = useState('');

  const handleSeedCountChange = (s) => {
    setSeedCount(s);
    setSeedCountError('');
  }

  const handleSeedPriceChange = (s) => {
    setSeedPrice(s);
    setSeedPriceError('');
  }

  const handlePoolChange = (p) => {
    const matchedPool = pools.find((f) => (p == f.id))
    console.log('--- selected pool: ', matchedPool)
    setSelectedPool(matchedPool)
    setPoolId(p)
    const newLabel = `${matchedPool.name}${seedDate ? ' - ' + formatDateIDN(seedDate) : ''}`
    console.log('label : ', newLabel)
    setLabel(newLabel)
  } 

  const handleSeedDateChange = (s) => {
    console.log('s1', s)
    console.log('s2', formatDateIDN(s))
    const newLabel = `${selectedPool ? selectedPool.name + ' - ' : ''}${formatDateIDN(s)}`
    setLabel(newLabel)
    setSeedDate(s)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!poolId) {
      setError('Kolam tidak boleh kosong.');
      return;
    }

    if (!seedDate) {
      setError('Tanggal masuk bibit tidak boleh kosong.');
      return;
    }

    if (!label) {
      setError('Label tidak boleh kosong.');
      return;
    }

    if (!seedCount) {
      setError('Jumlah bibit tidak boleh kosong.');
      return;
    }

    if (seedCount < 1) {
      setError('Jumlah bibit bermasalah.');
      return;
    }

    if (!seedPrice) {
      setError('Biaya bibit tidak boleh kosong.');
      return;
    }

    if (seedPrice < 0) {
      setError('Biaya bibit bermasalah.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/v1/fishery/cycle/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pool_id: poolId,
          seed_date: seedDate,
          label: label,
          seed_count: seedCount,
          seed_price: seedPrice
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Gagal menambahkan siklus.');
        return;
      }

      navigate('/fishery/cycle');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    document.title = 'Tambah Siklus Budidaya';
  }, [])

  useEffect(() => {
    fetch('/api/v1/fishery/pool/list?withNoCycle=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('..... ', data)
          const poolsOptions = data.data.map( (p) => ({
            'id': p.id,
            'name': p.name
          }))
          setPools(poolsOptions)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <FisheryHeader backTo="/fishery/feed" />
      <div className="fishery-page">
        <div className="fishery-header mb-20">
          <div>
            <h1 style={{ marginTop: '8px' }}>Tambah Siklus</h1>
            <p>Tambahkan siklus budidaya baru untuk digunakan.</p>
          </div>
        </div>

        {
          loading ? 
          (<p className="fishery-empty">Loading...</p>) 
          : 
          (<div>
                <form className="fishery-form" onSubmit={handleSubmit}>
              {error && <p className="fishery-error">{error}</p>}
              
              <div className="fishery-form-group">
                <label htmlFor="pool_id">Pilih Kolam</label>
                <select name="pool_id" onChange={e => handlePoolChange(e.target.value)}>
                  <option></option>
                  {
                    pools.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="fishery-form-group">
                <label htmlFor="seed_date">Tanggal masuk bibit</label>
                <input
                  id="seed_date"
                  type="date"
                  value={seedDate}
                  onChange={e => handleSeedDateChange(e.target.value)}
                  required
                />
              </div>

              <div className="fishery-form-group">
                <label htmlFor="label">Label</label>
                <input
                  id="label"
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  required
                />
              </div>

              <div className="fishery-form-group">
                <label htmlFor="seed_count">Jumlah bibit</label>
                <input
                  id="seed_count"
                  type="number"
                  value={seedCount}
                  min={0}
                  onChange={e => handleSeedCountChange(e.target.value)}
                  required
                />
              </div>
              {seedCountError && <p className="fishery-error">{seedCountError}</p>}

              <div className="fishery-form-group">
                <label htmlFor="seed_count">Biaya bibit</label>
                <input
                  id="seed_price"
                  type="number"
                  value={seedPrice}
                  min={0}
                  onChange={e => handleSeedPriceChange(e.target.value)}
                  required
                />
              </div>
              {seedPriceError && <p className="fishery-error">{seedPriceError}</p>}

              <div className="fishery-form-actions">
                <button type="button" className="fishery-btn-secondary" onClick={() => navigate('/fishery')} disabled={saving}>
                  Batal
                </button>
                <button type="submit" className="fishery-add-btn" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>)
        }
      </div>
    </>
  );
}