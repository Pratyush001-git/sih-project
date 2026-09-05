import { ExternalLink } from 'lucide-react';

export default function HotspotPopup({ hotspot, onSelect }) {
  if (!hotspot) return null;

  return (
    <div className="hotspot-popup-card">
      <div className="hotspot-popup-header">
        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
          Hotspot #{hotspot.hotspot_id}
        </strong>
        <span className={`status-pill ${hotspot.priority.level.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
          {hotspot.priority.level}
        </span>
      </div>
      <div className="hotspot-popup-body">
        <div><strong>Class:</strong> {hotspot.classification.label}</div>
        <div><strong>Persistence:</strong> {hotspot.history.persistence}% ({hotspot.history.detection_days}d / {hotspot.history.observation_days}d)</div>
        <div><strong>FRP:</strong> {hotspot.observation.frp} MW</div>
        <div><strong>Industry Dist:</strong> {hotspot.context.nearest_industry_m} m</div>
      </div>
      <button 
        type="button"
        className="btn btn-primary btn-sm" 
        style={{ width: '100%' }}
        onClick={() => onSelect && onSelect(hotspot)}
      >
        <ExternalLink size={13} />
        <span>View Details</span>
      </button>
    </div>
  );
}
