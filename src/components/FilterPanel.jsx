import { useState } from 'react';
import { Search, Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterPanel({
  filters,
  setFilters,
  onResetFilters,
  totalHotspotsCount,
  filteredCount
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePriorityToggle = (priority) => {
    const current = filters.priorities || [];
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority];
    setFilters({ ...filters, priorities: updated });
  };

  const handleClassificationChange = (label) => {
    const current = filters.classifications || [];
    const updated = current.includes(label)
      ? current.filter(c => c !== label)
      : [...current, label];
    setFilters({ ...filters, classifications: updated });
  };

  return (
    <section className="filter-panel" aria-label="Hotspot Filters">
      <div className="filter-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Filter size={18} color="var(--brand-navy)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Filter & Search Hotspots</h2>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            (Showing {filteredCount} of {totalHotspotsCount})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onResetFilters}
            title="Reset all filters to default"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            title={isExpanded ? 'Collapse filter tray' : 'Expand filter tray'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{isExpanded ? 'Collapse' : 'Filters'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Row 1: Search & Study Region */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="filter-group">
              <label htmlFor="search-input" className="filter-label">Search</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
                <input
                  id="search-input"
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="Search Hotspot ID, area (e.g. Bawana, Okhla)..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="region-select" className="filter-label">Region</label>
              <select
                id="region-select"
                className="form-control"
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              >
                <option value="Northern Zone">Northern Zone — FIRMS Jan–Mar 2024</option>
                <option value="All Regions">All Monitored Corridors (Pan-India)</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="persistence-select" className="filter-label">Persistence Level</label>
              <select
                id="persistence-select"
                className="form-control"
                value={filters.persistenceLevel}
                onChange={(e) => setFilters({ ...filters, persistenceLevel: e.target.value })}
              >
                <option value="Any">Any Persistence (0-100%)</option>
                <option value="High">High (&ge; 25% detection days)</option>
                <option value="Medium">Medium (10% - 24%)</option>
                <option value="Low">Low (&lt; 10% isolated)</option>
              </select>
            </div>

            {/* Date Range: From / To */}
            <div className="filter-group">
              <label htmlFor="from-date" className="filter-label">From Date</label>
              <input
                id="from-date"
                type="date"
                className="form-control"
                value={filters.fromDate || ''}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="to-date" className="filter-label">To Date</label>
              <input
                id="to-date"
                type="date"
                className="form-control"
                value={filters.toDate || ''}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              />
            </div>

            <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
              <label className="filter-chip" style={{ width: 'fit-content', height: '38px' }}>
                <input
                  type="checkbox"
                  checked={filters.nearIndustryOnly}
                  onChange={(e) => setFilters({ ...filters, nearIndustryOnly: e.target.checked })}
                />
                <span>Near power source (&le; 5km)</span>
              </label>
            </div>
          </div>

          {/* Row 2: Priority & Classification Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            <div className="filter-group">
              <span className="filter-label">Priority Filter:</span>
              <div className="filter-checkbox-group">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => {
                  const isSelected = filters.priorities.includes(lvl);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      className={`filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handlePriorityToggle(lvl)}
                    >
                      <span className={`status-pill ${lvl.toLowerCase()}`} style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                        {lvl}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Classification Filter:</span>
              <div className="filter-checkbox-group">
                {[
                  'Agricultural Burn',
                  'Industrial Candidate',
                  'Other Thermal Anomaly',
                  'Vegetation Fire'
                ].map((cat) => {
                  const isSelected = filters.classifications.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleClassificationChange(cat)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {isSelected ? '✓ ' : ''}{cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
