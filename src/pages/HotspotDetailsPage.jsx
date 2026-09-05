import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import HotspotDetails from '../components/HotspotDetails';
import { getHotspotsData } from '../data/hotspots';

export default function HotspotDetailsPage({
  hotspot,
  onBack,
  investigationIds = [],
  onToggleInvestigation
}) {
  // Use the in-memory cached dataset (loaded by App.jsx on mount)
  const allHotspots = getHotspotsData();

  const [selectedId, setSelectedId] = useState(
    hotspot ? hotspot.hotspot_id : (allHotspots[0] ? allHotspots[0].hotspot_id : '')
  );

  const activeHotspot = allHotspots.find(h => h.hotspot_id === selectedId)
    || hotspot
    || allHotspots[0]
    || null;

  if (!activeHotspot) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No hotspot selected. Go back to the dashboard and select one.</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  // Limit the select dropdown to first 500 records for performance
  const dropdownHotspots = allHotspots.slice(0, 500);

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
            {dropdownHotspots.map(h => (
              <option key={h.hotspot_id} value={h.hotspot_id}>
                {h.hotspot_id} — {h.classification.label} ({h.priority.level})
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            (first 500 shown)
          </span>
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
