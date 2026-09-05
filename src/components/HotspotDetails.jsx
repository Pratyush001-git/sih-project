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
      'Hotspot_ID', 'FIRMS_ID', 'Latitude', 'Longitude', 'Date', 'Time',
      'Satellite', 'Instrument', 'Day_Night',
      'FRP_MW', 'Brightness_Temp_K', 'FIRMS_Confidence',
      'ML_Classification', 'ML_Confidence_Pct',
      'Priority_Level', 'Priority_Score',
      'Detection_Days', 'Observation_Days', 'Persistence_Pct',
      'Persistent_3plus', 'Highly_Persistent_10plus',
      'Distance_to_Power_km', 'Power_Within_5km',
      'NDVI', 'NDBI', 'NDWI',
      'Prob_Agricultural_Burn', 'Prob_Industrial_Candidate',
      'Prob_Other_Thermal_Anomaly', 'Prob_Vegetation_Fire'
    ];

    const probs = hotspot.ml_probs || {};
    const row = [
      hotspot.hotspot_id,
      hotspot.firms_id || '',
      hotspot.location.latitude,
      hotspot.location.longitude,
      hotspot.observation.date,
      hotspot.observation.time,
      hotspot.observation.satellite,
      hotspot.observation.instrument,
      hotspot.observation.day_night,
      hotspot.observation.frp,
      hotspot.observation.brightness_temperature != null ? hotspot.observation.brightness_temperature : 'N/A',
      hotspot.observation.confidence,
      `"${hotspot.classification.label}"`,
      hotspot.classification.confidence,
      hotspot.priority.level,
      hotspot.priority.score,
      hotspot.history.detection_days,
      hotspot.history.observation_days,
      hotspot.history.persistence,
      hotspot.history.persistent_3plus,
      hotspot.history.highly_persistent_10plus,
      hotspot.context.nearest_industry_m > 0 ? (hotspot.context.nearest_industry_m / 1000).toFixed(3) : 'N/A',
      hotspot.context.industrial_feature_count,
      hotspot.satellite_context.ndvi != null ? hotspot.satellite_context.ndvi : 'N/A',
      hotspot.satellite_context.ndbi != null ? hotspot.satellite_context.ndbi : 'N/A',
      hotspot.satellite_context.ndwi != null ? hotspot.satellite_context.ndwi : 'N/A',
      probs.agricultural_burn != null ? probs.agricultural_burn : 'N/A',
      probs.industrial_candidate != null ? probs.industrial_candidate : 'N/A',
      probs.other_thermal_anomaly != null ? probs.other_thermal_anomaly : 'N/A',
      probs.vegetation_fire != null ? probs.vegetation_fire : 'N/A'
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ThermalWatch_Hotspot_${hotspot.hotspot_id}_Report.csv`);
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
