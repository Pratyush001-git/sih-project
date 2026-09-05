import { Flame, Repeat, Factory, AlertTriangle } from 'lucide-react';

export default function SummaryCards({ hotspots = [] }) {
  // Compute key summary figures based on dataset
  const activeCount = hotspots.length;
  const persistentCount = hotspots.filter(h => h.history.persistence >= 20).length;
  const industrialCount = hotspots.filter(h => 
    h.classification.label.includes('Industrial') || (h.context.nearest_industry_m <= 250)
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
          ≥ 20% detection days (90d)
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
          Near OSM verified industrial zones
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
