import { Factory, Info, Zap } from 'lucide-react';

export default function GeographicContext({ hotspot }) {
  if (!hotspot) return null;

  const distKm = hotspot.context.nearest_industry_m > 0
    ? (hotspot.context.nearest_industry_m / 1000).toFixed(1)
    : null;

  return (
    <section>
      <h3 className="drawer-section-title">
        <Factory size={18} color="var(--brand-navy)" />
        <span>OSM Power & Geographic Context</span>
      </h3>

      <div className="gis-card" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Zap size={12} /> Distance to Power Source (OSM):
            </span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
              {distKm !== null ? `${distKm} km` : 'N/A'}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {hotspot.context.nearest_industry_name}
            </div>
          </div>

          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Power Within 5 km:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {hotspot.context.industrial_feature_count > 0
                ? <span style={{ color: '#dc2626' }}>Yes</span>
                : <span style={{ color: '#64748b' }}>No</span>
              }
            </div>
          </div>

          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Transport Road:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              N/A
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Not in ML dataset</div>
          </div>

          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Residential Area:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              N/A
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Not in ML dataset</div>
          </div>
        </div>

        {/* Section 17 Non-Causal Disclaimer */}
        <div className="gis-alert gis-alert-uncertainty" style={{ marginTop: '0.85rem' }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Geospatial Notice:</strong> Power infrastructure context from OpenStreetMap. Spatial proximity indicates geographic context and does not prove causality or origin of the anomaly.
          </span>
        </div>
      </div>
    </section>
  );
}
