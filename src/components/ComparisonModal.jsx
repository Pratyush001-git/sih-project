import { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';

export default function ComparisonModal({
  hotspots = [],
  initialHotspotA = null,
  initialHotspotB = null,
  onClose,
  onSelectHotspot
}) {
  // Default to #H1024 (Persistent Source) and #H1041 (Acute Industrial Fire) if not specified
  const [idA, setIdA] = useState(initialHotspotA ? initialHotspotA.hotspot_id : (hotspots[0]?.hotspot_id || 'H1024'));
  const [idB, setIdB] = useState(initialHotspotB ? initialHotspotB.hotspot_id : (hotspots[1]?.hotspot_id || 'H1041'));

  const hotspotA = hotspots.find(h => h.hotspot_id === idA) || hotspots[0];
  const hotspotB = hotspots.find(h => h.hotspot_id === idB) || hotspots[1];

  if (!hotspotA || !hotspotB) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="compare-title">
      <div 
        className="details-drawer" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '850px', width: '95%' }}
      >
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ArrowRightLeft size={22} color="var(--brand-navy)" />
            <div>
              <h2 id="compare-title" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Side-by-Side Anomaly Comparison
              </h2>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Compare thermal signatures, spatial context, persistence, and classification rationale
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            <X size={18} />
            <span>Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {/* Anomaly Selection Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <label htmlFor="select-a" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-navy)', display: 'block', marginBottom: '0.35rem' }}>
                Anomaly A:
              </label>
              <select
                id="select-a"
                className="form-control"
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
              >
                {hotspots.map(h => (
                  <option key={h.hotspot_id} value={h.hotspot_id}>
                    #{h.hotspot_id} — {h.classification.label} ({h.location.area_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-b" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-navy)', display: 'block', marginBottom: '0.35rem' }}>
                Anomaly B:
              </label>
              <select
                id="select-b"
                className="form-control"
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
              >
                {hotspots.map(h => (
                  <option key={h.hotspot_id} value={h.hotspot_id}>
                    #{h.hotspot_id} — {h.classification.label} ({h.location.area_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Demo Benchmarking Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="text-sm" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
              Benchmarking Presets:
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setIdA('H1024'); setIdB('H1041'); }}
              style={{ fontSize: '0.75rem' }}
            >
              Persistent Furnace vs Acute Chemical Fire
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setIdA('H1370'); setIdB('H1288'); }}
              style={{ fontSize: '0.75rem' }}
            >
              Brick Kiln vs Crop Stubble Burn
            </button>
          </div>

          {/* Comparison Matrix Table */}
          <div className="data-table-container">
            <table className="gis-table">
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Evaluation Metric</th>
                  <th style={{ width: '34%', backgroundColor: '#f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>#{hotspotA.hotspot_id}</span>
                      <span className={`status-pill ${hotspotA.priority.level.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                        {hotspotA.priority.level}
                      </span>
                    </div>
                  </th>
                  <th style={{ width: '34%', backgroundColor: '#f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>#{hotspotB.hotspot_id}</span>
                      <span className={`status-pill ${hotspotB.priority.level.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                        {hotspotB.priority.level}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Classification Label</strong></td>
                  <td>
                    <strong style={{ color: 'var(--brand-navy)' }}>{hotspotA.classification.label}</strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Confidence: {hotspotA.classification.confidence}%</div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--brand-navy)' }}>{hotspotB.classification.label}</strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Confidence: {hotspotB.classification.confidence}%</div>
                  </td>
                </tr>

                <tr>
                  <td><strong>Fire Radiative Power (FRP)</strong></td>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: hotspotA.observation.frp > 50 ? '#dc2626' : '#ea580c' }}>
                      {hotspotA.observation.frp} MW
                    </strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Brightness: {hotspotA.observation.brightness_temperature} K</div>
                  </td>
                  <td>
                    <strong style={{ fontSize: '1.05rem', color: hotspotB.observation.frp > 50 ? '#dc2626' : '#ea580c' }}>
                      {hotspotB.observation.frp} MW
                    </strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Brightness: {hotspotB.observation.brightness_temperature} K</div>
                  </td>
                </tr>

                <tr>
                  <td><strong>Persistence Metric (90d)</strong></td>
                  <td>
                    <strong>{hotspotA.history.persistence}%</strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {hotspotA.history.detection_days} / {hotspotA.history.observation_days} passes
                    </div>
                  </td>
                  <td>
                    <strong>{hotspotB.history.persistence}%</strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {hotspotB.history.detection_days} / {hotspotB.history.observation_days} passes
                    </div>
                  </td>
                </tr>

                <tr>
                  <td><strong>Nearest Industrial Unit (OSM)</strong></td>
                  <td>
                    <strong>{hotspotA.context.nearest_industry_m} meters</strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{hotspotA.context.nearest_industry_name}</div>
                  </td>
                  <td>
                    <strong>{hotspotB.context.nearest_industry_m} meters</strong>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{hotspotB.context.nearest_industry_name}</div>
                  </td>
                </tr>

                <tr>
                  <td><strong>Residential Settlement Buffer</strong></td>
                  <td>
                    <span>{hotspotA.context.nearest_residential_m} meters</span>
                  </td>
                  <td>
                    <span>{hotspotB.context.nearest_residential_m} meters</span>
                  </td>
                </tr>

                <tr>
                  <td><strong>Sentinel-2 Spectral Context</strong></td>
                  <td>
                    {hotspotA.satellite_context.status === 'cloudy' ? (
                      <span style={{ color: '#92400e' }}>Cloud Obscured</span>
                    ) : (
                      <span>NDBI: {hotspotA.satellite_context.ndbi} | NDVI: {hotspotA.satellite_context.ndvi}</span>
                    )}
                  </td>
                  <td>
                    {hotspotB.satellite_context.status === 'cloudy' ? (
                      <span style={{ color: '#92400e' }}>Cloud Obscured</span>
                    ) : (
                      <span>NDBI: {hotspotB.satellite_context.ndbi} | NDVI: {hotspotB.satellite_context.ndvi}</span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td><strong>Priority Score (0 - 100)</strong></td>
                  <td>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: hotspotA.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
                      {hotspotA.priority.score}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: hotspotB.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
                      {hotspotB.priority.score}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td><strong>Decision Rationale</strong></td>
                  <td>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {hotspotA.priority.why.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul style={{ paddingLeft: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {hotspotB.priority.why.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </td>
                </tr>

                <tr>
                  <td><strong>Detailed Inspection</strong></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => {
                        onClose();
                        onSelectHotspot(hotspotA);
                      }}
                    >
                      Inspect #{hotspotA.hotspot_id}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => {
                        onClose();
                        onSelectHotspot(hotspotB);
                      }}
                    >
                      Inspect #{hotspotB.hotspot_id}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
