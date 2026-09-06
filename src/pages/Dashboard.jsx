import { ArrowRight, HelpCircle, ArrowRightLeft } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import HotspotMap from '../components/HotspotMap';
import FilterPanel from '../components/FilterPanel';
import HotspotTable from '../components/HotspotTable';

export default function Dashboard({
  hotspots = [],
  allHotspotsCount = 0,
  filters,
  setFilters,
  onResetFilters,
  selectedHotspot,
  onSelectHotspot,
  investigationIds = [],
  onToggleInvestigation,
  onNavigateTab,
  onOpenCompare
}) {
  return (
    <div>
      {/* Project Hero Header (Sections 7 & 61) */}
      <section className="hero-intro-bar" style={{ borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-navy)', marginBottom: '0.35rem' }}>
              Industrial Thermal Anomaly & Persistence Monitoring
            </h1>
            <p className="hero-tagline">
              <strong>Detect. Understand. Prioritize.</strong> Satellite observations reveal unusual thermal activity, but a hotspot does not automatically identify its source. This system combines NASA FIRMS thermal observations with OpenStreetMap geographic context, historical persistence, and Sentinel-2 satellite data to identify locations requiring priority investigation.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onOpenCompare}
              title="Compare two thermal anomalies side-by-side"
            >
              <ArrowRightLeft size={16} />
              <span>Compare</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigateTab('explorer')}
            >
              <span>Explore Hotspots</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Summary Cards (Section 8) */}
      <SummaryCards hotspots={hotspots} />

      {/* Main Interactive Map (Section 9, 10, 13) */}
      <HotspotMap
        hotspots={hotspots}
        selectedHotspot={selectedHotspot}
        onSelectHotspot={onSelectHotspot}
        searchQuery={filters.searchQuery}
      />

      {/* Hotspot Filters (Section 11, 12) */}
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        onResetFilters={onResetFilters}
        totalHotspotsCount={allHotspotsCount}
        filteredCount={hotspots.length}
      />

      {/* Priority Hotspots Table & Cards (Section 31, 33) */}
      <HotspotTable
        hotspots={hotspots}
        selectedHotspot={selectedHotspot}
        onSelectHotspot={onSelectHotspot}
        investigationIds={investigationIds}
        onToggleInvestigation={onToggleInvestigation}
      />

      {/* Analytical Workflow (Section 6, 29, 61) */}
      <section className="gis-card" style={{ marginTop: '2rem', background: '#f8fafc' }}>
        <h2 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--brand-navy)' }}>
          Decision-Support Analytical Workflow
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600, color: 'var(--brand-navy)' }}>Thermal Anomaly</span>
          <span>&rarr;</span>
          <span style={{ fontWeight: 600, color: 'var(--brand-navy)' }}>Geographic Context (OSM)</span>
          <span>&rarr;</span>
          <span style={{ fontWeight: 600, color: 'var(--brand-navy)' }}>Historical Persistence</span>
          <span>&rarr;</span>
          <span style={{ fontWeight: 600, color: 'var(--brand-navy)' }}>Satellite Verification</span>
          <span>&rarr;</span>
          <span style={{ fontWeight: 600, color: 'var(--brand-navy)' }}>Classification & Prioritization</span>
          <span>&rarr;</span>
          <span style={{ fontWeight: 600, color: '#dc2626' }}>Field Investigation</span>
        </div>
      </section>

      {/* FAQ Preview (Section 6, 30) */}
      <section style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            Essential Project Clarifications
          </h2>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateTab('faq')}
          >
            <HelpCircle size={14} />
            <span>View All 12 FAQs</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="gis-card">
            <strong style={{ fontSize: '0.9375rem', color: 'var(--brand-navy)' }}>
              Is every hotspot a fire?
            </strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              No. A thermal anomaly can have multiple causes including industrial furnaces, gas flares, sun-heated metal roofs, agricultural burning, or sensor anomalies.
            </p>
          </div>

          <div className="gis-card">
            <strong style={{ fontSize: '0.9375rem', color: 'var(--brand-navy)' }}>
              Is the priority score a probability?
            </strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              No. It is a project-defined prioritization score used to schedule inspection order. It is not a mathematical probability of danger.
            </p>
          </div>

          <div className="gis-card">
            <strong style={{ fontSize: '0.9375rem', color: 'var(--brand-navy)' }}>
              What happens when satellite imagery is cloudy?
            </strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              The system explicitly flags the imagery as cloudy and unusable. It preserves uncertainty and never invents or imputes missing values.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
