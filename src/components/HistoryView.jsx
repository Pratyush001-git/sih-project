import { History, TrendingUp, Calendar, Repeat, ExternalLink } from 'lucide-react';

export default function HistoryView({ hotspots = [], onSelectHotspot }) {
  // Compute aggregate metrics
  const highPersistence = hotspots.filter(h => h.history.persistence >= 25);
  const moderatePersistence = hotspots.filter(h => h.history.persistence >= 10 && h.history.persistence < 25);
  const transientAnomalies = hotspots.filter(h => h.history.persistence < 10);

  // Regional monthly FRP aggregate
  const monthlyTrends = [
    { month: 'November', avgFrp: 28, count: 42 },
    { month: 'December', avgFrp: 34, count: 58 },
    { month: 'January', avgFrp: 37, count: 64 },
    { month: 'February', avgFrp: 41, count: 72 },
    { month: 'March (Active)', avgFrp: 48, count: 86 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <History size={24} color="var(--brand-navy)" />
          <h1>Historical Thermal Activity & Persistence</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Longitudinal analysis of NASA FIRMS detections over 90-day multi-satellite observation cycles.
        </p>
      </div>

      {/* High-level Persistence Distribution */}
      <div className="summary-cards-grid">
        <div className="summary-card active-hotspots">
          <div className="summary-card-header">
            <span>Observation Window</span>
            <Calendar size={18} color="var(--brand-blue)" />
          </div>
          <div className="summary-card-value">90 Days</div>
          <div className="summary-card-subtext">VIIRS + MODIS Satellite Passes</div>
        </div>

        <div className="summary-card persistent-sources">
          <div className="summary-card-header">
            <span>Persistent Sources (&ge;25%)</span>
            <Repeat size={18} color="var(--priority-medium)" />
          </div>
          <div className="summary-card-value">{highPersistence.length}</div>
          <div className="summary-card-subtext">Furnaces, Kilns & Foundry Clusters</div>
        </div>

        <div className="summary-card industrial-candidates">
          <div className="summary-card-header">
            <span>Intermittent (10-24%)</span>
            <TrendingUp size={18} color="var(--brand-navy)" />
          </div>
          <div className="summary-card-value">{moderatePersistence.length}</div>
          <div className="summary-card-subtext">Batch Smelting & Shift Operations</div>
        </div>

        <div className="summary-card high-priority">
          <div className="summary-card-header">
            <span>Transient (&lt;10%)</span>
            <History size={18} color="var(--text-muted)" />
          </div>
          <div className="summary-card-value">{transientAnomalies.length}</div>
          <div className="summary-card-subtext">Acute Spikes or Single Burns</div>
        </div>
      </div>

      {/* Regional Thermal Power Trend Chart */}
      <div className="gis-card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Delhi NCR Regional Radiative Output Trend (5-Month Window)
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Repeated detections across the study area show an elevated thermal baseline in winter due to industrial furnace continuous cycles and brick manufacturing schedules.
        </p>

        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '2rem', borderBottom: '1px solid var(--border-strong)', paddingBottom: '0.5rem' }}>
            {monthlyTrends.map((t, idx) => {
              const heightPct = (t.avgFrp / 60) * 100;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-navy)', marginBottom: '6px' }}>
                    {t.avgFrp} MW avg
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: `${heightPct}%`,
                      backgroundColor: idx === monthlyTrends.length - 1 ? '#dc2626' : '#1e3a8a',
                      borderRadius: '4px 4px 0 0'
                    }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 500 }}>
                    {t.month}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    ({t.count} hits)
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <span>Source: NASA FIRMS VIIRS & MODIS Historical Ingestion Archive</span>
            <span>Study Area: Delhi NCR Industrial Corridors</span>
          </div>
        </div>
      </div>

      {/* Persistent Hotspots Roster */}
      <div className="gis-card">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Verified Persistent Thermal Sources
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Locations producing recurrent thermal anomalies across 25% or more of all orbital satellite passes over the past 90 days.
        </p>

        <div className="data-table-container">
          <table className="gis-table">
            <thead>
              <tr>
                <th>Hotspot ID</th>
                <th>Area / Cluster</th>
                <th>Persistence %</th>
                <th>Detection Days</th>
                <th>Nearest Facility</th>
                <th>Classification</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {highPersistence.map(h => (
                <tr key={h.hotspot_id}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-navy)' }}>
                      #{h.hotspot_id}
                    </strong>
                  </td>
                  <td>{h.location.area_name}</td>
                  <td>
                    <strong style={{ color: 'var(--priority-high)' }}>{h.history.persistence}%</strong>
                  </td>
                  <td>{h.history.detection_days} / {h.history.observation_days} passes</td>
                  <td>{h.context.nearest_industry_name} ({h.context.nearest_industry_m}m)</td>
                  <td>
                    <span className="status-pill low" style={{ fontSize: '0.7rem' }}>
                      {h.classification.label}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectHotspot(h)}
                    >
                      <ExternalLink size={14} />
                      <span>Examine</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
