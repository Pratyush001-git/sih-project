import { Flame, Repeat, Factory, AlertTriangle } from 'lucide-react';

export default function SummaryCards({ hotspots = [] }) {
  // Compute key summary figures based on ML dataset
  const activeCount = hotspots.length;

  // persistent_3plus flag = detected on ≥ 3 distinct days
  const persistentCount = hotspots.filter(h =>
    h.history.persistent_3plus === 1 || h.history.persistent_3plus === '1'
  ).length;

  // Industrial Candidate is the ML class for industrial-origin anomalies
  const industrialCount = hotspots.filter(h =>
    h.classification.label === 'Industrial Candidate'
  ).length;

  const highPriorityCount = hotspots.filter(h => 
    h.priority.level === 'CRITICAL' || h.priority.level === 'HIGH'
  ).length;

  return (
    <div className="summary-cards-grid" role="region" aria-label="Thermal Anomaly Summary">
      {/* 1. Active Hotspots */}
      <div className="summary-card active-hotspots">
        <div className="summary-card-header">
          <span>Active Hotspots</span>
          <Flame size={18} color="var(--brand-blue)" />
        </div>
        <div className="summary-card-value">{activeCount}</div>
        <div className="summary-card-subtext">
          NASA FIRMS VIIRS & MODIS
        </div>
      </div>

      {/* 2. Persistent Sources */}
      <div className="summary-card persistent-sources">
        <div className="summary-card-header">
          <span>Persistent Sources</span>
          <Repeat size={18} color="var(--priority-medium)" />
        </div>
        <div className="summary-card-value">{persistentCount}</div>
        <div className="summary-card-subtext">
          Detected on ≥ 3 distinct days (Jan–Mar 2024)
        </div>
      </div>

      {/* 3. Industrial Candidates */}
      <div className="summary-card industrial-candidates">
        <div className="summary-card-header">
          <span>Industrial Candidates</span>
          <Factory size={18} color="var(--brand-navy)" />
        </div>
        <div className="summary-card-value">{industrialCount}</div>
        <div className="summary-card-subtext">
          XGBoost ML class: Industrial Candidate
        </div>
      </div>

      {/* 4. High Priority */}
      <div className="summary-card high-priority">
        <div className="summary-card-header">
          <span>High / Critical Priority</span>
          <AlertTriangle size={18} color="var(--priority-critical)" />
        </div>
        <div className="summary-card-value">{highPriorityCount}</div>
        <div className="summary-card-subtext">
          Requires expedited investigation
        </div>
      </div>
    </div>
  );
}
