import { Layers } from 'lucide-react';

export default function ClassificationCard({ hotspot }) {
  if (!hotspot) return null;

  return (
    <section>
      <h3 className="drawer-section-title">
        <Layers size={18} color="var(--brand-navy)" />
        <span>Machine Learning Model Interface</span>
      </h3>

      <div className="gis-card" style={{ background: '#f8fafc', borderStyle: 'dashed' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Decoupled Inference Contract
            </div>
            <strong style={{ fontSize: '1rem', color: 'var(--brand-navy)' }}>
              {hotspot.classification.label}
            </strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="status-pill low" style={{ fontSize: '0.7rem' }}>Status: Connected</span>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Confidence: {hotspot.classification.confidence}%
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem' }}>
          <code>{`{ classification: "${hotspot.classification.label}", confidence: ${hotspot.classification.confidence}, status: "available" }`}</code>
        </div>
      </div>
    </section>
  );
}
