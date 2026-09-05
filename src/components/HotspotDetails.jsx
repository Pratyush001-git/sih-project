import { 
  X, 
  Bookmark, 
  Check, 
  Download, 
  Printer 
} from 'lucide-react';
import ThermalSummary from './ThermalSummary';
import GeographicContext from './GeographicContext';
import PersistenceChart from './PersistenceChart';
import SatellitePreview from './SatellitePreview';
import ClassificationCard from './ClassificationCard';
import PriorityCard from './PriorityCard';
import EvidencePanel from './EvidencePanel';

export default function HotspotDetails({
  hotspot,
  onClose,
  isInvestigating,
  onToggleInvestigation
}) {
  if (!hotspot) return null;

  const handleExportCSV = () => {
    const headers = [
      'Hotspot_ID', 'Latitude', 'Longitude', 'Date', 'Time', 'Satellite', 'Instrument',
      'FRP_MW', 'Brightness_Temp_K', 'Confidence_Pct', 'Nearest_Industry_m',
      'Nearest_Road_m', 'Nearest_Residential_m', 'Persistence_Pct',
      'Classification', 'Classification_Confidence', 'Priority_Level', 'Priority_Score'
    ];

    const row = [
      hotspot.hotspot_id,
      hotspot.location.latitude,
      hotspot.location.longitude,
      hotspot.observation.date,
      hotspot.observation.time,
      hotspot.observation.satellite,
      hotspot.observation.instrument,
      hotspot.observation.frp,
      hotspot.observation.brightness_temperature,
      hotspot.observation.confidence,
      hotspot.context.nearest_industry_m,
      hotspot.context.nearest_road_m,
      hotspot.context.nearest_residential_m,
      hotspot.history.persistence,
      `"${hotspot.classification.label}"`,
      hotspot.classification.confidence,
      hotspot.priority.level,
      hotspot.priority.score
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SH26162_Hotspot_${hotspot.hotspot_id}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="hotspot-detail-title">
      <div className="details-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 id="hotspot-detail-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Hotspot #{hotspot.hotspot_id}
              </h2>
              <span className={`status-pill ${hotspot.priority.level.toLowerCase()}`}>
                {hotspot.priority.level} PRIORITY
              </span>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {hotspot.location.area_name}, {hotspot.location.sub_district}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            aria-label="Back to Map"
          >
            <X size={18} />
            <span>Back to Map</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="drawer-content">
          {/* Quick Action Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className={`btn btn-sm ${isInvestigating ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onToggleInvestigation(hotspot.hotspot_id)}
            >
              {isInvestigating ? <Check size={16} /> : <Bookmark size={16} />}
              <span>{isInvestigating ? "Marked for Investigation" : "Mark for Investigation"}</span>
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleExportCSV}
                title="Export Hotspot Data CSV"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handlePrint}
                title="Print Official Decision-Support Dossier"
              >
                <Printer size={14} />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Core Classification & Priority Overview Banner (Section 14) */}
          <div className="gis-card" style={{ borderLeft: `5px solid ${hotspot.priority.level === 'CRITICAL' ? '#dc2626' : hotspot.priority.level === 'HIGH' ? '#ea580c' : '#d97706'}` }}>
            <div className="details-metrics-row">
              <div className="detail-metric-box">
                <div className="detail-metric-label">Classification</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  {hotspot.classification.label}
                </div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Confidence: {hotspot.classification.confidence}%
                </span>
              </div>

              <div className="detail-metric-box">
                <div className="detail-metric-label">Persistence</div>
                <div className="detail-metric-value">{hotspot.history.persistence}%</div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {hotspot.history.detection_days} of {hotspot.history.observation_days} days
                </span>
              </div>

              <div className="detail-metric-box">
                <div className="detail-metric-label">Priority Score</div>
                <div className="detail-metric-value" style={{ color: hotspot.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
                  {hotspot.priority.score} / 100
                </div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Level: {hotspot.priority.level}
                </span>
              </div>
            </div>
          </div>

          {/* Modular subcomponents fulfilling Sections 15-25 */}
          <ThermalSummary hotspot={hotspot} />
          <GeographicContext hotspot={hotspot} />
          <PersistenceChart hotspot={hotspot} />
          <SatellitePreview hotspot={hotspot} />
          <ClassificationCard hotspot={hotspot} />
          <PriorityCard hotspot={hotspot} />
          <EvidencePanel hotspot={hotspot} />
        </div>
      </div>
    </div>
  );
}
