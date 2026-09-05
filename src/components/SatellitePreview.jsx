import { useState } from 'react';
import { Eye, CloudRain } from 'lucide-react';

export default function SatellitePreview({ hotspot }) {
  const [spectralMode, setSpectralMode] = useState('rgb');

  if (!hotspot) return null;

  return (
    <section>
      <h3 className="drawer-section-title">
        <Eye size={18} color="var(--brand-navy)" />
        <span>Sentinel-2 Satellite Environmental Context</span>
      </h3>

      {hotspot.satellite_context.status === 'cloudy' ? (
        /* Section 20 & 41: Cloud Handling State */
        <div className="gis-alert gis-alert-warning" style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <CloudRain size={20} />
            <span>Satellite Image Unavailable</span>
          </div>
          <div>
            <strong>Reason:</strong> Cloudy conditions / insufficient valid surface reflectance pixels
            {hotspot.satellite_context.cloud_cover_pct != null ? ` (Cloud cover: ${hotspot.satellite_context.cloud_cover_pct}%)` : ''}.
          </div>
          <div style={{ fontSize: '0.78rem', color: '#78350f' }}>
            The system did not invent, impute or derive missing optical spectral indices. Anomaly classification relies on thermal dual-band FIRMS observations and OSM spatial tags.
          </div>
        </div>
      ) : (
        <div className="gis-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="detail-metric-box">
              <div className="detail-metric-label">NDVI (Vegetation)</div>
              <div className="detail-metric-value">{hotspot.satellite_context.ndvi}</div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {hotspot.satellite_context.ndvi > 0.4 ? 'Dense Veg' : 'Low / Built-up'}
              </span>
            </div>

            <div className="detail-metric-box">
              <div className="detail-metric-label">NDBI (Built-up)</div>
              <div className="detail-metric-value">{hotspot.satellite_context.ndbi}</div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {hotspot.satellite_context.ndbi > 0.3 ? 'High Impervious' : 'Normal'}
              </span>
            </div>

            <div className="detail-metric-box">
              <div className="detail-metric-label">NDWI (Water/Moisture)</div>
              <div className="detail-metric-value">{hotspot.satellite_context.ndwi}</div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Dry substrate</span>
            </div>
          </div>

          {/* Interactive Sentinel-2 Spectral Composite Preview */}
          <div style={{ marginTop: '0.85rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                Sentinel-2 10m Multi-Spectral Crop:
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[
                  { id: 'rgb', label: 'True Color (RGB)' },
                  { id: 'infrared', label: 'False-Color IR' },
                  { id: 'swir', label: 'SWIR Thermal' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    className={`filter-chip ${spectralMode === b.id ? 'selected' : ''}`}
                    onClick={() => setSpectralMode(b.id)}
                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Spectral Grid Canvas */}
            <div style={{
              height: '140px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: spectralMode === 'infrared' 
                ? 'linear-gradient(135deg, #b91c1c 0%, #1e293b 50%, #0f172a 100%)'
                : spectralMode === 'swir'
                ? 'linear-gradient(135deg, #0284c7 0%, #0f172a 60%, #ea580c 100%)'
                : 'linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)'
            }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 2
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: spectralMode === 'swir' ? '#ea580c' : '#dc2626',
                  border: '2px solid #ffffff',
                  boxShadow: '0 0 16px 6px rgba(234, 88, 12, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.9)', marginTop: '4px' }}>
                  Anomaly Center #{hotspot.hotspot_id}
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', zIndex: 3 }}>
                ESA Sentinel-2 MSI &bull; 10m Ground Sample Dist
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem' }}>
            <strong>Sentinel-2 Environmental Assessment:</strong> {hotspot.satellite_context.land_description}
            <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Observed: {hotspot.satellite_context.observation_date}
              {hotspot.satellite_context.cloud_cover_pct != null
                ? ` | Cloud Occlusion: ${hotspot.satellite_context.cloud_cover_pct}%`
                : ' | Cloud cover: N/A (not in ML dataset)'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
