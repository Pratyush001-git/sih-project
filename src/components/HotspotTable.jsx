import { ExternalLink, Bookmark, Check, AlertCircle } from 'lucide-react';

export default function HotspotTable({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot,
  investigationIds = [],
  onToggleInvestigation
}) {
  if (hotspots.length === 0) {
    return (
      <div className="gis-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <AlertCircle size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>No hotspots found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1rem' }}>
          No thermal anomalies match your current filter selection.
        </p>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'left', display: 'inline-block' }}>
          <strong>Try:</strong>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
            <li>Clearing search keywords</li>
            <li>Selecting more priority categories</li>
            <li>Setting persistence filter to "Any"</li>
            <li>Disabling "Near industrial area only"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Hotspots List" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
          Monitored Hotspots Table ({hotspots.length})
        </h2>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Click row or "Inspect" to view comprehensive evidence & context
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="data-table-container">
        <table className="gis-table">
          <thead>
            <tr>
              <th>Hotspot ID</th>
              <th>Priority</th>
              <th>Classification</th>
              <th>Location / Area</th>
              <th>FRP (MW)</th>
              <th>Persistence</th>
              <th>Nearest Industry</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((h) => {
              const isSelected = selectedHotspot && selectedHotspot.hotspot_id === h.hotspot_id;
              const isInvestigating = investigationIds.includes(h.hotspot_id);

              return (
                <tr 
                  key={h.hotspot_id}
                  className={isSelected ? 'table-row-selected' : ''}
                  onClick={() => onSelectHotspot(h)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-navy)' }}>
                      #{h.hotspot_id}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${h.priority.level.toLowerCase()}`}>
                      {h.priority.level}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{h.classification.label}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block' }}>
                      Conf: {h.classification.confidence}%
                    </span>
                  </td>
                  <td>
                    <span>{h.location.area_name}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block' }}>
                      {h.location.sub_district}
                    </span>
                  </td>
                  <td>
                    <strong>{h.observation.frp}</strong>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}> MW</span>
                  </td>
                  <td>
                    <span>{h.history.persistence}%</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block' }}>
                      {h.history.detection_days} / {h.history.observation_days} days
                    </span>
                  </td>
                  <td>
                    <span>{h.context.nearest_industry_m} m</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.context.nearest_industry_name}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectHotspot(h)}
                        title="View complete evidence & satellite context"
                      >
                        <ExternalLink size={14} />
                        <span>Inspect</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${isInvestigating ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => onToggleInvestigation(h.hotspot_id)}
                        title={isInvestigating ? "Marked for investigation" : "Mark for investigation"}
                      >
                        {isInvestigating ? <Check size={14} /> : <Bookmark size={14} />}
                        <span>{isInvestigating ? "Investigating" : "Mark"}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (Section 33) */}
      <div className="hotspots-mobile-grid">
        {hotspots.map((h) => {
          const isInvestigating = investigationIds.includes(h.hotspot_id);
          return (
            <div key={h.hotspot_id} className="hotspot-mobile-card">
              <div className="hotspot-mobile-card-header">
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--brand-navy)' }}>
                  #{h.hotspot_id}
                </span>
                <span className={`status-pill ${h.priority.level.toLowerCase()}`}>
                  {h.priority.level}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>Class:</strong> {h.classification.label} (Conf: {h.classification.confidence}%)</div>
                <div><strong>Location:</strong> {h.location.area_name}</div>
                <div><strong>FRP:</strong> {h.observation.frp} MW | <strong>Persistence:</strong> {h.history.persistence}%</div>
                <div><strong>Industrial distance:</strong> {h.context.nearest_industry_m} m</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onSelectHotspot(h)}
                >
                  <ExternalLink size={14} />
                  <span>Inspect Details</span>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${isInvestigating ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onToggleInvestigation(h.hotspot_id)}
                >
                  {isInvestigating ? <Check size={14} /> : <Bookmark size={14} />}
                  <span>{isInvestigating ? "Marked" : "Mark"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
