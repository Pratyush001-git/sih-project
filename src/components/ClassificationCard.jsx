import { Layers, Brain } from 'lucide-react';

export default function ClassificationCard({ hotspot }) {
  if (!hotspot) return null;

  const probs = hotspot.ml_probs || {};
  const classProbs = [
    { label: 'Industrial Candidate', key: 'industrial_candidate', color: '#ea580c' },
    { label: 'Agricultural Burn',    key: 'agricultural_burn',    color: '#d97706' },
    { label: 'Vegetation Fire',      key: 'vegetation_fire',      color: '#16a34a' },
    { label: 'Other Thermal Anomaly',key: 'other_thermal_anomaly',color: '#64748b' }
  ];

  return (
    <section>
      <h3 className="drawer-section-title">
        <Brain size={18} color="var(--brand-navy)" />
        <span>XGBoost ML Classification</span>
      </h3>

      <div className="gis-card" style={{ borderStyle: 'solid', borderColor: 'var(--border-subtle)' }}>
        {/* Classification result header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Predicted Class
            </div>
            <strong style={{ fontSize: '1.05rem', color: 'var(--brand-navy)' }}>
              {hotspot.classification.label}
            </strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Model Confidence</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: hotspot.classification.confidence >= 85 ? '#16a34a' : '#d97706' }}>
              {hotspot.classification.confidence}%
            </div>
          </div>
        </div>

        {/* Class probability bars */}
        {Object.keys(probs).length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Class Probabilities
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {classProbs.map(({ label, key, color }) => {
                const pct = Math.round((probs[key] || 0) * 100 * 10) / 10;
                const isWinner = label === hotspot.classification.label;
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                      <span style={{ fontWeight: isWinner ? 700 : 400, color: isWinner ? 'var(--brand-navy)' : 'var(--text-secondary)' }}>
                        {label}{isWinner ? ' ✓' : ''}
                      </span>
                      <span style={{ fontWeight: 600, color: isWinner ? color : 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(pct, 0.5)}%`,
                          backgroundColor: color,
                          borderRadius: '3px',
                          transition: 'width 0.4s ease',
                          opacity: isWinner ? 1 : 0.45
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Model metadata footer */}
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', marginTop: '0.85rem' }}>
          <code>
            {`{ class: "${hotspot.classification.label}", confidence: ${hotspot.classification.confidence}%, model: "XGBoost" }`}
          </code>
          <div style={{ marginTop: '0.25rem' }}>
            Algorithm: XGBoost Multiclass · Features: FIRMS + Sentinel-2 + OSM Power · Accuracy: ~91% (proxy labels)
          </div>
        </div>
      </div>
    </section>
  );
}
