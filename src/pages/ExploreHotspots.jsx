import FilterPanel from '../components/FilterPanel';
import HotspotTable from '../components/HotspotTable';

export default function ExploreHotspots({
  hotspots = [],
  allHotspotsCount = 0,
  filters,
  setFilters,
  onResetFilters,
  selectedHotspot,
  onSelectHotspot,
  investigationIds = [],
  onToggleInvestigation
}) {
  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-navy)' }}>Hotspot Explorer</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Search, filter, and inspect thermal anomaly records across the monitored region.
        </p>
      </div>

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        onResetFilters={onResetFilters}
        totalHotspotsCount={allHotspotsCount}
        filteredCount={hotspots.length}
      />

      <HotspotTable
        hotspots={hotspots}
        selectedHotspot={selectedHotspot}
        onSelectHotspot={onSelectHotspot}
        investigationIds={investigationIds}
        onToggleInvestigation={onToggleInvestigation}
      />
    </div>
  );
}
