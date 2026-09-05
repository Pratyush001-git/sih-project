import { Factory, Info } from 'lucide-react';

export default function GeographicContext({ hotspot }) {
  if (!hotspot) return null;

  return (
    <section>
      <h3 className="drawer-section-title">
        <Factory size={18} color="var(--brand-navy)" />
        <span>OpenStreetMap Spatial & Geographic Context</span>
      </h3>

      <div className="gis-card" style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Industrial Facility:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
              {hotspot.context.nearest_industry_m} meters
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {hotspot.context.nearest_industry_name}
            </div>
          </div>

          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Transport Road:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {hotspot.context.nearest_road_m} meters
            </div>
          </div>

          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Residential Area:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {hotspot.context.nearest_residential_m} meters
            </div>
          </div>

          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Facilities within 500m:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {hotspot.context.industrial_feature_count} units
            </div>
          </div>
        </div>

        {/* Strict Section 17 Non-Causal Disclaimer */}
        <div className="gis-alert gis-alert-uncertainty" style={{ marginTop: '0.85rem' }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Geospatial Notice:</strong> Industrial facility detected nearby in OpenStreetMap vector data. Note: Spatial proximity indicates geographic context and does not prove causality or origin of the anomaly.
          </span>
        </div>
      </div>
    </section>
  );
}
