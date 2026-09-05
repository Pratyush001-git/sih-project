import { Repeat, TrendingUp } from 'lucide-react';

export default function PersistenceChart({ hotspot }) {
  if (!hotspot) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Section 18: Persistence Section */}
      <section>
        <h3 className="drawer-section-title">
          <Repeat size={18} color="var(--priority-medium)" />
          <span>Temporal Persistence Metric</span>
        </h3>

        <div className="gis-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {hotspot.history.persistence}%
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                ({hotspot.history.detection_days} detection days out of {hotspot.history.observation_days} observation passes)
              </span>
            </div>
            <span className={`status-pill ${hotspot.history.persistence >= 25 ? 'high' : hotspot.history.persistence >= 10 ? 'medium' : 'low'}`}>
              {hotspot.history.persistence >= 25 ? 'Persistent Source' : hotspot.history.persistence >= 10 ? 'Intermittent' : 'Transient / Isolated'}
            </span>
          </div>

          {/* Timeline Strip */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Observation Timeline Window (Recent 90-Day Satellite Passes):
          </div>
          <div className="timeline-strip" role="img" aria-label="Timeline of thermal detections">
            {Array.from({ length: 30 }).map((_, i) => {
              const isHit = i % Math.max(1, Math.round(30 / (hotspot.history.detection_days || 1))) === 0;
              return (
                <div
                  key={i}
                  className={`timeline-cell ${isHit ? 'detected' : ''}`}
                  data-tooltip={`Day ${i * 3 + 1}: ${isHit ? 'Thermal Anomaly Detected' : 'No Anomaly'}`}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>Day 1 (90 days ago)</span>
            <span>Day 45</span>
            <span>Day 90 (Today)</span>
          </div>
        </div>
      </section>

      {/* Section 19: Historical Activity & FRP Trend Chart */}
      <section>
        <h3 className="drawer-section-title">
          <TrendingUp size={18} color="var(--brand-blue)" />
          <span>Historical Activity & FRP Trend</span>
        </h3>

        <div className="gis-card">
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            {hotspot.history.trend_summary}
          </p>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-strong)' }}>
              {hotspot.history.monthly_frp_trend.map((point, idx) => {
                const maxFrp = 100;
                const heightPct = Math.min(100, Math.max(8, (point.frp / maxFrp) * 100));
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--brand-navy)', marginBottom: '4px' }}>
                      {point.frp}M
                    </span>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '36px',
                        height: `${heightPct}%`,
                        backgroundColor: point.frp > 50 ? '#dc2626' : point.frp > 30 ? '#ea580c' : '#3b82f6',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease'
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {point.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span>Monthly Average Fire Radiative Power (MW)</span>
              <span>NASA FIRMS Archive</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
