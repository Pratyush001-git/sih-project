import { ShieldCheck, HelpCircle } from 'lucide-react';

export default function EvidencePanel({ hotspot }) {
  if (!hotspot) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Section 24: Evidence Breakdown */}
      <section>
        <h3 className="drawer-section-title">
          <ShieldCheck size={18} color="var(--priority-low)" />
          <span>Multi-Source Evidence Matrix</span>
        </h3>

        <div className="gis-card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Thermal Signal</div>
              <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.thermal}</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Persistence</div>
              <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.persistence}</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Industrial Prox.</div>
              <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.industrial_proximity}</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Settlement Prox.</div>
              <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.residential_proximity}</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence</div>
              <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.confidence}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Section 25: Explicit Uncertainty Reporting */}
      <section>
        <h3 className="drawer-section-title">
          <HelpCircle size={18} color="var(--text-muted)" />
          <span>Uncertainty & Data Completeness</span>
        </h3>

        <div className="gis-card" style={{ background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="text-sm">Evidence Quality:</span>
            <span className={`status-pill ${hotspot.uncertainty.quality === 'Good' ? 'low' : 'medium'}`}>
              {hotspot.uncertainty.quality} Quality
            </span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {hotspot.uncertainty.notes}
          </p>
        </div>
      </section>
    </div>
  );
}
