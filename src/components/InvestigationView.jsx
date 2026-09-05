import { useState, useEffect } from 'react';
import { 
  BookmarkCheck, 
  Trash2, 
  ExternalLink, 
  Download, 
  Printer, 
  AlertCircle,
  FileCode,
  Edit3
} from 'lucide-react';
import { exportToGeoJSON } from '../data/mockHotspots';

export default function InvestigationView({
  hotspots = [],
  investigationIds = [],
  onSelectHotspot,
  onToggleInvestigation,
  onClearAllInvestigations
}) {
  const markedHotspots = hotspots.filter(h => investigationIds.includes(h.hotspot_id));

  // Officer notes & dispatch status state stored in localStorage
  const [investigationData, setInvestigationData] = useState(() => {
    try {
      const saved = localStorage.getItem('sih_investigation_metadata');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sih_investigation_metadata', JSON.stringify(investigationData));
    } catch {
      // ignore
    }
  }, [investigationData]);

  const handleStatusChange = (id, status) => {
    setInvestigationData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        status
      }
    }));
  };

  const handleNotesChange = (id, notes) => {
    setInvestigationData(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        notes
      }
    }));
  };

  // Batch CSV Export
  const handleExportAllCSV = () => {
    if (markedHotspots.length === 0) return;

    const headers = [
      'Hotspot_ID', 'Priority', 'Classification', 'Area_Name', 'Sub_District',
      'Latitude', 'Longitude', 'FRP_MW', 'Persistence_Pct', 'Nearest_Industry_m',
      'Nearest_Industry_Name', 'Nearest_Residential_m', 'Evidence_Quality',
      'Dispatch_Status', 'Analyst_Notes'
    ];

    const rows = markedHotspots.map(h => {
      const meta = investigationData[h.hotspot_id] || {};
      return [
        h.hotspot_id,
        h.priority.level,
        `"${h.classification.label}"`,
        `"${h.location.area_name}"`,
        `"${h.location.sub_district}"`,
        h.location.latitude,
        h.location.longitude,
        h.observation.frp,
        h.history.persistence,
        h.context.nearest_industry_m,
        `"${h.context.nearest_industry_name}"`,
        h.context.nearest_residential_m,
        h.uncertainty.quality,
        `"${meta.status || 'Pending Dispatch'}"`,
        `"${(meta.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SH26162_Investigation_Queue_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch GeoJSON Export for GIS Mapping Teams
  const handleExportGeoJSON = () => {
    if (markedHotspots.length === 0) return;
    exportToGeoJSON(markedHotspots, `SH26162_Investigation_GIS_${new Date().toISOString().split('T')[0]}.geojson`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <BookmarkCheck size={24} color="var(--brand-navy)" />
            <h1>Field Investigation Queue</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Priority-ranked thermal anomalies designated for ground reconnaissance, regulatory inspection, and field verification.
          </p>
        </div>

        {markedHotspots.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleExportAllCSV}
              title="Export complete queue as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handleExportGeoJSON}
              title="Export as GeoJSON for QGIS / ArcGIS"
            >
              <FileCode size={14} />
              <span>Export GeoJSON</span>
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
              title="Print official dispatch dossier"
            >
              <Printer size={14} />
              <span>Print Dossier</span>
            </button>
            <button 
              type="button" 
              className="btn btn-danger btn-sm"
              onClick={onClearAllInvestigations}
            >
              <Trash2 size={14} />
              <span>Clear Queue</span>
            </button>
          </div>
        )}
      </div>

      {markedHotspots.length === 0 ? (
        <div className="gis-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <AlertCircle size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No hotspots marked for investigation</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0.5rem auto 1.5rem' }}>
            While browsing the Dashboard or Hotspot Explorer, click <strong>"Mark for Investigation"</strong> on any anomaly to assemble an active field dispatch queue.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="gis-alert gis-alert-info">
            <span>
              <strong>Active Dispatch Roster:</strong> {markedHotspots.length} target location(s) currently marked. Inspector status and field notes are auto-persisted.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {markedHotspots.map(h => {
              const meta = investigationData[h.hotspot_id] || { status: 'Pending Dispatch', notes: '' };
              return (
                <div key={h.hotspot_id} className="gis-card" style={{ borderLeft: `5px solid ${h.priority.level === 'CRITICAL' ? '#dc2626' : h.priority.level === 'HIGH' ? '#ea580c' : '#d97706'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--brand-navy)' }}>
                        #{h.hotspot_id}
                      </strong>
                      <span className={`status-pill ${h.priority.level.toLowerCase()}`}>
                        {h.priority.level} PRIORITY
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {h.classification.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectHotspot(h)}
                      >
                        <ExternalLink size={14} />
                        <span>Inspect Evidence</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onToggleInvestigation(h.hotspot_id)}
                        title="Remove from queue"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                    <div><strong>Area:</strong> {h.location.area_name}</div>
                    <div><strong>FRP:</strong> {h.observation.frp} MW (Brightness: {h.observation.brightness_temperature} K)</div>
                    <div><strong>Persistence:</strong> {h.history.persistence}% ({h.history.detection_days} passes)</div>
                    <div><strong>Nearest Industry:</strong> {h.context.nearest_industry_m}m ({h.context.nearest_industry_name})</div>
                  </div>

                  {/* Dispatch Status & Field Notes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
                    <div>
                      <label htmlFor={`status-${h.hotspot_id}`} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                        Reconnaissance Status:
                      </label>
                      <select
                        id={`status-${h.hotspot_id}`}
                        className="form-control"
                        value={meta.status}
                        onChange={(e) => handleStatusChange(h.hotspot_id, e.target.value)}
                        style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem' }}
                      >
                        <option value="Pending Dispatch">⏳ Pending Dispatch</option>
                        <option value="Dispatched / En Route">🚨 Dispatched / Ground Team En Route</option>
                        <option value="Verified Operational Facility">🏭 Verified Operational Facility (Normal)</option>
                        <option value="Confirmed Incident (Action Taken)">🔥 Confirmed Incident (Action Taken)</option>
                        <option value="False Positive (Sun Glint / Sensor)">❌ False Positive (Sun Glint / Sensor)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor={`notes-${h.hotspot_id}`} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.2rem' }}>
                        <Edit3 size={12} />
                        <span>Analyst / Inspector Field Notes:</span>
                      </label>
                      <input
                        id={`notes-${h.hotspot_id}`}
                        type="text"
                        className="form-control"
                        placeholder="Add inspection notes, team ref, or observations..."
                        value={meta.notes}
                        onChange={(e) => handleNotesChange(h.hotspot_id, e.target.value)}
                        style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
