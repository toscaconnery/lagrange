import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import { convertTimbangToKg } from '../../../../../api/src/utils/converter';

export default function FisheryCycleHarvestTab({}) {
  const navigate = useNavigate();

  const [harvests] = useState([
    { id: 1, harvest_date: '2026-06-20', buyer: 'Daniel', weight_units: 6, weight_kg: 15 },
    { id: 2, harvest_date: '2026-06-20', buyer: 'Sijon', weight_units: 4, weight_kg: 20 },
    { id: 3, harvest_date: '2026-06-27', buyer: 'Eka', weight_units: 8, weight_kg: 10 },
    { id: 4, harvest_date: '2026-07-04', buyer: 'Daniel', weight_units: 5, weight_kg: 8 },
  ]);

  function formatHarvestDay(dateStr) {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  function totalHarvestKg(h) {
    return convertTimbangToKg(Number(h.weight_units)) + Number(h.weight_kg);
  }

  return (
    <div className="fishery-detail-section">
      <h2 className="fishery-detail-section-title">Panen</h2>
      <div className="fishery-info-card">
        {harvests.length === 0 ? (
          <div className="fishery-detail-row">
            <span className="fishery-detail-label">Belum ada panen tercatat.</span>
          </div>
        ) : (
          <div className="fishery-table-wrap">
            <table className="fishery-table">
              <thead>
                <tr>
                  <th>Hari/Tgl</th>
                  <th>Pembeli</th>
                  <th className="text-right">Jumlah timbang</th>
                  <th className="text-right">Jumlah KG</th>
                  <th className="text-right">Total KG</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map(h => (
                  <tr key={h.id}>
                    <td>{formatHarvestDay(h.harvest_date)}</td>
                    <td>{h.buyer}</td>
                    <td className="text-right">{h.weight_units} timbang</td>
                    <td className="text-right">{h.weight_kg} KG</td>
                    <td className="text-right fishery-table-total">{totalHarvestKg(h)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right fishery-table-grand-label">Total</td>
                  <td className="text-right fishery-table-grand-total">
                    {harvests.reduce((sum, h) => sum + totalHarvestKg(h), 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}