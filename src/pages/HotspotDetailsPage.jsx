import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HotspotDetails from '../components/HotspotDetails';
import { HOTSPOTS_DATA } from '../data/hotspots';

export default function HotspotDetailsPage({
  hotspot,
  onBack,
  investigationIds = [],
  onToggleInvestigation
}) {
  const [selectedId, setSelectedId] = useState(hotspot ? hotspot.hotspot_id : HOTSPOTS_DATA[0].hotspot_id);
  const activeHotspot = HOTSPOTS_DATA.find(h => h.hotspot_id === selectedId) || hotspot || HOTSPOTS_DATA[0];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="hotspot-picker" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Select Hotspot:
          </label>
          <select
            id="hotspot-picker"
            className="form-control"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
          >
            {HOTSPOTS_DATA.map(h => (
              <option key={h.hotspot_id} value={h.hotspot_id}>
                #{h.hotspot_id} — {h.classification.label} ({h.priority.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Renders the HotspotDetails inspector */}
      <HotspotDetails
        hotspot={activeHotspot}
        onClose={onBack}
        isInvestigating={investigationIds.includes(activeHotspot.hotspot_id)}
        onToggleInvestigation={onToggleInvestigation}
      />
    </div>
  );
}
