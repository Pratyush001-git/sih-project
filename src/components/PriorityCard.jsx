import { AlertTriangle } from 'lucide-react';

export default function PriorityCard({ hotspot }) {
  if (!hotspot) return null;

  return (
    <section>
      <h3 className="drawer-section-title">
        <AlertTriangle size={18} color={hotspot.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c'} />
        <span>Priority & Risk Evaluation</span>
      </h3>

      <div className="gis-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Calculated Priority Score:</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: hotspot.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
              {hotspot.priority.score} / 100
            </div>
          </div>
          <div className={`status-pill ${hotspot.priority.level.toLowerCase()}`} style={{ fontSize: '0.875rem' }}>
            {hotspot.priority.level} PRIORITY
          </div>
        </div>

        {/* Why this location was prioritized */}
        <div style={{ marginBottom: '0.75rem' }}>
          <strong style={{ fontSize: '0.875rem' }}>Why is this location prioritized?</strong>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {hotspot.priority.why.map((reason, idx) => (
              <li key={idx} style={{ marginBottom: '0.2rem' }}>{reason}</li>
            ))}
          </ul>
        </div>

        {/* Mandatory Section 23 Disclaimer */}
        <div className="gis-alert gis-alert-warning" style={{ marginTop: '0.85rem' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong>Important Disclaimer:</strong> Priority score is a project-defined prioritization score used to schedule inspection order. It is NOT a mathematical probability of danger.
          </span>
        </div>
      </div>
    </section>
  );
}
