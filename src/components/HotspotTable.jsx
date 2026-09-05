import { useState } from 'react';
import { ExternalLink, Bookmark, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 50;

export default function HotspotTable({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot,
  investigationIds = [],
  onToggleInvestigation
}) {
  const [page, setPage] = useState(1);

  // Reset to page 1 when hotspots list changes (filter applied)
  // We do this lazily — if page > maxPage, render last page
  const totalPages = Math.max(1, Math.ceil(hotspots.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const visibleHotspots = hotspots.slice(pageStart, pageEnd);

  const goToPage = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

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
            <li>Disabling "Near power source only"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Hotspots List" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
          Monitored Hotspots Table ({hotspots.length.toLocaleString()})
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Showing {pageStart + 1}–{Math.min(pageEnd, hotspots.length)} of {hotspots.length.toLocaleString()}
          </span>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                style={{ padding: '0.25rem 0.5rem', minWidth: 'unset' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: '70px', textAlign: 'center' }}>
                Page {safePage} / {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                style={{ padding: '0.25rem 0.5rem', minWidth: 'unset' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="data-table-container">
        <table className="gis-table">
          <thead>
            <tr>
              <th>Hotspot ID</th>
              <th>Priority</th>
              <th>ML Classification</th>
              <th>Location / Area</th>
              <th>FRP (MW)</th>
              <th>Persistence</th>
              <th>Power Context</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleHotspots.map((h) => {
              const isSelected = selectedHotspot && selectedHotspot.hotspot_id === h.hotspot_id;
              const isInvestigating = investigationIds.includes(h.hotspot_id);
              const persistFlags = [];
              if (h.history.highly_persistent_10plus === 1) persistFlags.push('≥10d');
              else if (h.history.persistent_3plus === 1) persistFlags.push('≥3d');

              return (
                <tr
                  key={h.hotspot_id}
                  className={isSelected ? 'table-row-selected' : ''}
                  onClick={() => onSelectHotspot(h)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--brand-navy)', fontSize: '0.8rem' }}>
                      {h.hotspot_id}
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
                    <span style={{ fontSize: '0.8125rem' }}>{h.observation.date}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block' }}>
                      {h.observation.day_night} · {h.location.sub_district}
                    </span>
                  </td>
                  <td>
                    <strong>{h.observation.frp}</strong>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}> MW</span>
                  </td>
                  <td>
                    <span>{h.history.persistence}%</span>
                    {persistFlags.length > 0 && (
                      <span className="text-sm" style={{ color: '#d97706', display: 'block', fontWeight: 600 }}>
                        {persistFlags.join(', ')}
                      </span>
                    )}
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block' }}>
                      {h.history.detection_days} / {h.history.observation_days} days
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem' }}>
                      {h.context.industrial_feature_count > 0
                        ? <span style={{ color: '#dc2626', fontWeight: 600 }}>⚡ Within 5km</span>
                        : <span style={{ color: 'var(--text-muted)' }}>None within 5km</span>
                      }
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)', display: 'block', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.context.nearest_industry_m > 0 ? `${(h.context.nearest_industry_m / 1000).toFixed(1)} km` : 'Dist N/A'}
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

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => goToPage(1)} disabled={safePage === 1}>First</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
            Page {safePage} of {totalPages.toLocaleString()} · {hotspots.length.toLocaleString()} total records
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
            <ChevronRight size={14} />
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => goToPage(totalPages)} disabled={safePage === totalPages}>Last</button>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="hotspots-mobile-grid">
        {visibleHotspots.map((h) => {
          const isInvestigating = investigationIds.includes(h.hotspot_id);
          return (
            <div key={h.hotspot_id} className="hotspot-mobile-card">
              <div className="hotspot-mobile-card-header">
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--brand-navy)' }}>
                  {h.hotspot_id}
                </span>
                <span className={`status-pill ${h.priority.level.toLowerCase()}`}>
                  {h.priority.level}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>Class:</strong> {h.classification.label} (Conf: {h.classification.confidence}%)</div>
                <div><strong>Date:</strong> {h.observation.date} ({h.observation.day_night})</div>
                <div><strong>FRP:</strong> {h.observation.frp} MW | <strong>Persistence:</strong> {h.history.persistence}%</div>
                <div><strong>Power context:</strong> {h.context.industrial_feature_count > 0 ? 'Power within 5km' : 'No power within 5km'}</div>
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
