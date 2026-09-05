import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Search, 
  Check, 
  ExternalLink, 
  Bookmark, 
  Flame, 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  MapPin, 
  Gauge, 
  Activity, 
  Radio 
} from 'lucide-react';

// Representative curated benchmarking presets from active ML dataset
const BENCHMARK_PRESETS = [
  {
    id: 'preset-1',
    label: 'Critical Industrial vs Agricultural Burn',
    desc: 'Contrasts a high-risk persistent industrial candidate against an open crop stubble burn.',
    idA: 'ML620',
    idB: 'ML22867'
  },
  {
    id: 'preset-2',
    label: 'Near-Industry vs Vegetation Fire',
    desc: 'Contrasts an anomaly 169m from an industrial zone against a forest/vegetation wildfire.',
    idA: 'ML215',
    idB: 'ML3898'
  },
  {
    id: 'preset-3',
    label: 'Critical Alert vs Baseline Anomaly',
    desc: 'Compares a critical priority alert against a low-intensity isolated thermal detection.',
    idA: 'ML30526',
    idB: 'ML0'
  }
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'industrial', label: '🏭 Industrial' },
  { id: 'critical', label: '🚨 Critical / High' },
  { id: 'agricultural', label: '🌾 Agricultural' },
  { id: 'vegetation', label: '🌲 Vegetation' }
];

/**
 * Smart, ultra-fast searchable selector for 30,000+ items.
 * Instead of 31k <option> elements, renders a compact card and an on-demand
 * popover capped at top 25 matches with early-exit loop (< 1ms execution).
 */
function SmartHotspotSelector({
  side,
  label,
  selectedHotspot,
  onSelect,
  hotspots = [],
  excludeId = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const searchInputRef = useRef(null);
  const popoverRef = useRef(null);

  // Focus input when popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close popover
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Lightning-fast search with max 25 items for 60fps rendering without freezing
  const searchResults = useMemo(() => {
    if (!isOpen || !hotspots.length) return [];

    const query = searchQuery.trim().toLowerCase();
    const results = [];
    const MAX_RESULTS = 25;

    for (let i = 0; i < hotspots.length; i++) {
      const h = hotspots[i];
      if (excludeId && h.hotspot_id === excludeId) continue;

      // Category filter
      if (categoryFilter === 'industrial' && h.classification?.label !== 'Industrial Candidate') continue;
      if (categoryFilter === 'agricultural' && h.classification?.label !== 'Agricultural Burn') continue;
      if (categoryFilter === 'vegetation' && h.classification?.label !== 'Vegetation Fire') continue;
      if (categoryFilter === 'critical' && h.priority?.level !== 'CRITICAL' && h.priority?.level !== 'HIGH') continue;

      if (!query) {
        results.push(h);
        if (results.length >= MAX_RESULTS) break;
        continue;
      }

      const matchId = h.hotspot_id?.toLowerCase().includes(query);
      const matchArea = h.location?.area_name?.toLowerCase().includes(query);
      const matchClass = h.classification?.label?.toLowerCase().includes(query);
      const matchPriority = h.priority?.level?.toLowerCase().includes(query);

      if (matchId || matchArea || matchClass || matchPriority) {
        results.push(h);
        if (results.length >= MAX_RESULTS) break;
      }
    }

    return results;
  }, [isOpen, hotspots, searchQuery, categoryFilter, excludeId]);

  if (!selectedHotspot) return null;

  return (
    <div 
      className={`compare-card ${side === 'A' ? 'compare-card-side-a' : 'compare-card-side-b'}`} 
      ref={popoverRef}
    >
      {/* Header bar */}
      <div className="compare-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: side === 'A' ? 'var(--brand-navy)' : '#6366f1',
              background: side === 'A' ? 'var(--brand-navy-light)' : '#eef2ff',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {label}
          </span>
          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            #{selectedHotspot.hotspot_id}
          </strong>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <Search size={13} style={{ marginRight: '0.25rem' }} />
          <span>{isOpen ? 'Close' : 'Change'}</span>
        </button>
      </div>

      {/* Selected hotspot snippet */}
      <div className="compare-card-body">
        <div className="compare-card-badges" style={{ marginBottom: '0.4rem' }}>
          <span 
            className={`status-pill ${selectedHotspot.priority.level.toLowerCase()}`}
            style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}
          >
            {selectedHotspot.priority.level} PRIORITY
          </span>
          <span 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--brand-navy)',
              background: '#f1f5f9',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px'
            }}
          >
            {selectedHotspot.classification.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <MapPin size={13} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedHotspot.location.area_name}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span><strong>FRP:</strong> {selectedHotspot.observation.frp} MW</span>
          <span>•</span>
          <span><strong>Conf:</strong> {selectedHotspot.classification.confidence}%</span>
          <span>•</span>
          <span><strong>Score:</strong> {selectedHotspot.priority.score}/100</span>
        </div>
      </div>

      {/* Search & Select Popover Panel */}
      {isOpen && (
        <div className="compare-picker-popover" role="dialog" aria-label={`Select ${label}`}>
          <div className="compare-search-box">
            <Search size={14} className="compare-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by ID (e.g. ML620), Area, Class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="compare-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="compare-filter-chips">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`compare-chip ${categoryFilter === cat.id ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Showing top {searchResults.length} matches</span>
            <span>Select one to compare</span>
          </div>

          {/* Scrollable Results List */}
          <div className="compare-results-list">
            {searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                No anomalies match your search criteria.
              </div>
            ) : (
              searchResults.map((item) => {
                const isCurrent = item.hotspot_id === selectedHotspot.hotspot_id;
                return (
                  <button
                    key={item.hotspot_id}
                    type="button"
                    className={`compare-result-item ${isCurrent ? 'selected' : ''}`}
                    onClick={() => {
                      onSelect(item.hotspot_id);
                      setIsOpen(false);
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <strong>#{item.hotspot_id}</strong>
                        <span 
                          className={`status-pill ${item.priority.level.toLowerCase()}`} 
                          style={{ fontSize: '0.625rem', padding: '1px 5px' }}
                        >
                          {item.priority.level}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--brand-navy)' }}>
                          {item.classification.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {item.location.area_name}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--priority-high)' }}>
                        {item.observation.frp} MW
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Score: {item.priority.score}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparisonModal({
  hotspots = [],
  initialHotspotA = null,
  initialHotspotB = null,
  onClose,
  onSelectHotspot,
  isLoading = false,
  investigationIds = [],
  onToggleInvestigation
}) {
  // Ultra-fast O(1) in-memory Map lookup
  const hotspotsMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < hotspots.length; i++) {
      map.set(hotspots[i].hotspot_id, hotspots[i]);
    }
    return map;
  }, [hotspots]);

  // Safe defaults using active ML dataset IDs
  const defaultIdA = initialHotspotA?.hotspot_id || (hotspotsMap.has('ML620') ? 'ML620' : hotspots[0]?.hotspot_id || '');
  const defaultIdB = initialHotspotB?.hotspot_id || (hotspotsMap.has('ML22867') ? 'ML22867' : hotspots[1]?.hotspot_id || '');

  const [idA, setIdA] = useState(defaultIdA);
  const [idB, setIdB] = useState(defaultIdB);

  // Sync if initial props change
  useEffect(() => {
    if (initialHotspotA?.hotspot_id) setIdA(initialHotspotA.hotspot_id);
  }, [initialHotspotA]);

  useEffect(() => {
    if (initialHotspotB?.hotspot_id) setIdB(initialHotspotB.hotspot_id);
  }, [initialHotspotB]);

  // Handle keyboard navigation & body scroll locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // Instant Swap Sides
  const handleSwap = () => {
    const temp = idA;
    setIdA(idB);
    setIdB(temp);
  };

  const handleApplyPreset = (preset) => {
    if (hotspotsMap.has(preset.idA)) setIdA(preset.idA);
    if (hotspotsMap.has(preset.idB)) setIdB(preset.idB);
  };

  const hotspotA = hotspotsMap.get(idA) || hotspots[0] || null;
  const hotspotB = hotspotsMap.get(idB) || (hotspots[1] && hotspots[1].hotspot_id !== idA ? hotspots[1] : hotspots[0]) || null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="compare-title"
    >
      <div 
        className="details-drawer compare-modal-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div 
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--brand-navy-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--brand-navy)'
              }}
            >
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 id="compare-title" style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                Side-by-Side Anomaly Comparison
              </h2>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Compare thermal signatures, spatial context, persistence, and classification rationale
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            aria-label="Close Comparison"
          >
            <X size={18} />
            <span>Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="drawer-content">
          {isLoading || !hotspotA || !hotspotB ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.125rem', color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>
                Loading Thermal Anomaly Dataset...
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Preparing records for side-by-side comparative inspection.
              </p>
            </div>
          ) : (
            <>
              {/* Presets & Actions Toolbar */}
              <div className="compare-top-toolbar">
                <div className="compare-preset-group">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Benchmarking Presets:
                  </span>
                  {BENCHMARK_PRESETS.map((preset) => {
                    const isActive = idA === preset.idA && idB === preset.idB;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                        onClick={() => handleApplyPreset(preset)}
                        title={preset.desc}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleSwap}
                  title="Swap Anomaly A and Anomaly B"
                  style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ArrowRightLeft size={13} />
                  <span>Swap A ⇄ B</span>
                </button>
              </div>

              {/* Anomaly Selection Cards Grid */}
              <div className="compare-selectors-grid">
                <SmartHotspotSelector
                  side="A"
                  label="Anomaly A"
                  selectedHotspot={hotspotA}
                  onSelect={(newId) => setIdA(newId)}
                  hotspots={hotspots}
                  excludeId={idB}
                />

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="compare-swap-btn"
                    onClick={handleSwap}
                    title="Swap Sides"
                    aria-label="Swap Anomaly A and B"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </div>

                <SmartHotspotSelector
                  side="B"
                  label="Anomaly B"
                  selectedHotspot={hotspotB}
                  onSelect={(newId) => setIdB(newId)}
                  hotspots={hotspots}
                  excludeId={idA}
                />
              </div>

              {/* Comparison Matrix Table */}
              <div className="data-table-container" style={{ marginTop: '0.5rem' }}>
                <table className="gis-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Evaluation Metric</th>
                      <th style={{ width: '35%', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>
                            #{hotspotA.hotspot_id} (Side A)
                          </span>
                          <span className={`status-pill ${hotspotA.priority.level.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                            {hotspotA.priority.level}
                          </span>
                        </div>
                      </th>
                      <th style={{ width: '35%', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, color: '#4338ca' }}>
                            #{hotspotB.hotspot_id} (Side B)
                          </span>
                          <span className={`status-pill ${hotspotB.priority.level.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                            {hotspotB.priority.level}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Classification */}
                    <tr>
                      <td>
                        <strong>Classification & Confidence</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          XGBoost ML model inference
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--brand-navy)', fontSize: '0.9375rem' }}>
                          {hotspotA.classification.label}
                        </strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                          Confidence: <strong>{hotspotA.classification.confidence}%</strong>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--brand-navy)', fontSize: '0.9375rem' }}>
                          {hotspotB.classification.label}
                        </strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                          Confidence: <strong>{hotspotB.classification.confidence}%</strong>
                        </div>
                      </td>
                    </tr>

                    {/* Priority Score */}
                    <tr>
                      <td>
                        <strong>Priority Score (0 - 100)</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          Multi-criteria dispatch priority
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span 
                            style={{ 
                              fontSize: '1.35rem', 
                              fontWeight: 800, 
                              color: hotspotA.priority.level === 'CRITICAL' ? '#dc2626' : hotspotA.priority.level === 'HIGH' ? '#ea580c' : '#0284c7' 
                            }}
                          >
                            {hotspotA.priority.score}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${Math.min(100, hotspotA.priority.score)}%`, 
                              height: '100%', 
                              background: hotspotA.priority.level === 'CRITICAL' ? '#dc2626' : hotspotA.priority.level === 'HIGH' ? '#ea580c' : '#0284c7' 
                            }} 
                          />
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span 
                            style={{ 
                              fontSize: '1.35rem', 
                              fontWeight: 800, 
                              color: hotspotB.priority.level === 'CRITICAL' ? '#dc2626' : hotspotB.priority.level === 'HIGH' ? '#ea580c' : '#0284c7' 
                            }}
                          >
                            {hotspotB.priority.score}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 100</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${Math.min(100, hotspotB.priority.score)}%`, 
                              height: '100%', 
                              background: hotspotB.priority.level === 'CRITICAL' ? '#dc2626' : hotspotB.priority.level === 'HIGH' ? '#ea580c' : '#0284c7' 
                            }} 
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Fire Radiative Power */}
                    <tr>
                      <td>
                        <strong>Fire Radiative Power (FRP)</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          Thermal output intensity (MW)
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong 
                            style={{ 
                              fontSize: '1.1rem', 
                              color: hotspotA.observation.frp > 50 ? '#dc2626' : '#ea580c' 
                            }}
                          >
                            {hotspotA.observation.frp} MW
                          </strong>
                          {hotspotA.observation.frp > hotspotB.observation.frp && (
                            <span className="compare-metric-diff-badge higher">
                              Higher (+{(hotspotA.observation.frp - hotspotB.observation.frp).toFixed(1)} MW)
                            </span>
                          )}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                          Brightness: {hotspotA.observation.brightness_temperature} K
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <strong 
                            style={{ 
                              fontSize: '1.1rem', 
                              color: hotspotB.observation.frp > 50 ? '#dc2626' : '#ea580c' 
                            }}
                          >
                            {hotspotB.observation.frp} MW
                          </strong>
                          {hotspotB.observation.frp > hotspotA.observation.frp && (
                            <span className="compare-metric-diff-badge higher">
                              Higher (+{(hotspotB.observation.frp - hotspotA.observation.frp).toFixed(1)} MW)
                            </span>
                          )}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                          Brightness: {hotspotB.observation.brightness_temperature} K
                        </div>
                      </td>
                    </tr>

                    {/* Persistence */}
                    <tr>
                      <td>
                        <strong>Persistence Metric (90d)</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          Recurrence over Jan-Mar 2024
                        </div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1rem', color: hotspotA.history.persistence >= 20 ? '#dc2626' : 'inherit' }}>
                          {hotspotA.history.persistence}%
                        </strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {hotspotA.history.detection_days} / {hotspotA.history.observation_days} passes
                        </div>
                        {hotspotA.history.persistent_3plus === 1 && (
                          <span style={{ display: 'inline-block', fontSize: '0.6875rem', background: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: '3px', marginTop: '3px' }}>
                            3+ Days Persistent
                          </span>
                        )}
                      </td>
                      <td>
                        <strong style={{ fontSize: '1rem', color: hotspotB.history.persistence >= 20 ? '#dc2626' : 'inherit' }}>
                          {hotspotB.history.persistence}%
                        </strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {hotspotB.history.detection_days} / {hotspotB.history.observation_days} passes
                        </div>
                        {hotspotB.history.persistent_3plus === 1 && (
                          <span style={{ display: 'inline-block', fontSize: '0.6875rem', background: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: '3px', marginTop: '3px' }}>
                            3+ Days Persistent
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Nearest Industrial Unit */}
                    <tr>
                      <td>
                        <strong>Nearest Industrial Unit (OSM)</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          Spatial distance to industrial facility
                        </div>
                      </td>
                      <td>
                        <strong>
                          {hotspotA.context.nearest_industry_m >= 0 
                            ? `${hotspotA.context.nearest_industry_m.toLocaleString()} meters` 
                            : 'N/A'}
                        </strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                          {hotspotA.context.nearest_industry_name}
                        </div>
                      </td>
                      <td>
                        <strong>
                          {hotspotB.context.nearest_industry_m >= 0 
                            ? `${hotspotB.context.nearest_industry_m.toLocaleString()} meters` 
                            : 'N/A'}
                        </strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                          {hotspotB.context.nearest_industry_name}
                        </div>
                      </td>
                    </tr>

                    {/* Residential Settlement Buffer */}
                    <tr>
                      <td>
                        <strong>Residential Buffer</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          Proximity to residential settlements
                        </div>
                      </td>
                      <td>
                        <span>
                          {hotspotA.context.nearest_residential_m > 0 
                            ? `${hotspotA.context.nearest_residential_m} meters` 
                            : 'Outside mapped residential zone'}
                        </span>
                      </td>
                      <td>
                        <span>
                          {hotspotB.context.nearest_residential_m > 0 
                            ? `${hotspotB.context.nearest_residential_m} meters` 
                            : 'Outside mapped residential zone'}
                        </span>
                      </td>
                    </tr>

                    {/* Sentinel-2 Spectral Context */}
                    <tr>
                      <td>
                        <strong>Sentinel-2 Spectral Context</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          NDBI (Built-up) & NDVI (Vegetation)
                        </div>
                      </td>
                      <td>
                        {hotspotA.satellite_context?.status === 'cloudy' ? (
                          <span style={{ color: '#92400e', fontWeight: 600 }}>Cloud Obscured</span>
                        ) : (
                          <div>
                            <div>
                              <strong>NDBI:</strong> {hotspotA.satellite_context?.ndbi ?? 'N/A'} | <strong>NDVI:</strong> {hotspotA.satellite_context?.ndvi ?? 'N/A'}
                            </div>
                            {hotspotA.satellite_context?.land_description && (
                              <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                                {hotspotA.satellite_context.land_description}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {hotspotB.satellite_context?.status === 'cloudy' ? (
                          <span style={{ color: '#92400e', fontWeight: 600 }}>Cloud Obscured</span>
                        ) : (
                          <div>
                            <div>
                              <strong>NDBI:</strong> {hotspotB.satellite_context?.ndbi ?? 'N/A'} | <strong>NDVI:</strong> {hotspotB.satellite_context?.ndvi ?? 'N/A'}
                            </div>
                            {hotspotB.satellite_context?.land_description && (
                              <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                                {hotspotB.satellite_context.land_description}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* ML Probabilities Breakdown */}
                    {(hotspotA.ml_probs || hotspotB.ml_probs) && (
                      <tr>
                        <td>
                          <strong>ML Class Probabilities</strong>
                          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            Multi-class soft probability distribution
                          </div>
                        </td>
                        <td>
                          {hotspotA.ml_probs ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Industrial:</span>
                                <strong>{((hotspotA.ml_probs.industrial_candidate || 0) * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Agricultural:</span>
                                <strong>{((hotspotA.ml_probs.agricultural_burn || 0) * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Vegetation:</span>
                                <strong>{((hotspotA.ml_probs.vegetation_fire || 0) * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Other:</span>
                                <strong>{((hotspotA.ml_probs.other_thermal_anomaly || 0) * 100).toFixed(1)}%</strong>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Not available</span>
                          )}
                        </td>
                        <td>
                          {hotspotB.ml_probs ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Industrial:</span>
                                <strong>{((hotspotB.ml_probs.industrial_candidate || 0) * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Agricultural:</span>
                                <strong>{((hotspotB.ml_probs.agricultural_burn || 0) * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Vegetation:</span>
                                <strong>{((hotspotB.ml_probs.vegetation_fire || 0) * 100).toFixed(1)}%</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Other:</span>
                                <strong>{((hotspotB.ml_probs.other_thermal_anomaly || 0) * 100).toFixed(1)}%</strong>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Not available</span>
                          )}
                        </td>
                      </tr>
                    )}

                    {/* Decision Rationale */}
                    <tr>
                      <td>
                        <strong>Decision Rationale</strong>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          Evidence-based scoring factors
                        </div>
                      </td>
                      <td>
                        <ul style={{ paddingLeft: '1.1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                          {hotspotA.priority.why?.map((w, i) => (
                            <li key={i} style={{ marginBottom: '2px' }}>{w}</li>
                          )) || <li>No criteria documented</li>}
                        </ul>
                      </td>
                      <td>
                        <ul style={{ paddingLeft: '1.1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                          {hotspotB.priority.why?.map((w, i) => (
                            <li key={i} style={{ marginBottom: '2px' }}>{w}</li>
                          )) || <li>No criteria documented</li>}
                        </ul>
                      </td>
                    </tr>

                    {/* Actions */}
                    <tr>
                      <td><strong>Inspection Actions</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', fontSize: '0.8125rem' }}
                            onClick={() => {
                              onClose();
                              if (onSelectHotspot) onSelectHotspot(hotspotA);
                            }}
                          >
                            <ExternalLink size={14} style={{ marginRight: '0.35rem' }} />
                            <span>Inspect #{hotspotA.hotspot_id}</span>
                          </button>
                          {onToggleInvestigation && (
                            <button
                              type="button"
                              className={`btn btn-sm ${investigationIds.includes(hotspotA.hotspot_id) ? 'btn-secondary' : 'btn-secondary'}`}
                              style={{ 
                                width: '100%', 
                                fontSize: '0.75rem',
                                color: investigationIds.includes(hotspotA.hotspot_id) ? '#16a34a' : 'inherit'
                              }}
                              onClick={() => onToggleInvestigation(hotspotA.hotspot_id)}
                            >
                              <Bookmark size={13} style={{ marginRight: '0.25rem' }} />
                              <span>
                                {investigationIds.includes(hotspotA.hotspot_id) ? 'Bookmarked for Investigation' : 'Add to Investigation'}
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', fontSize: '0.8125rem' }}
                            onClick={() => {
                              onClose();
                              if (onSelectHotspot) onSelectHotspot(hotspotB);
                            }}
                          >
                            <ExternalLink size={14} style={{ marginRight: '0.35rem' }} />
                            <span>Inspect #{hotspotB.hotspot_id}</span>
                          </button>
                          {onToggleInvestigation && (
                            <button
                              type="button"
                              className={`btn btn-sm ${investigationIds.includes(hotspotB.hotspot_id) ? 'btn-secondary' : 'btn-secondary'}`}
                              style={{ 
                                width: '100%', 
                                fontSize: '0.75rem',
                                color: investigationIds.includes(hotspotB.hotspot_id) ? '#16a34a' : 'inherit'
                              }}
                              onClick={() => onToggleInvestigation(hotspotB.hotspot_id)}
                            >
                              <Bookmark size={13} style={{ marginRight: '0.25rem' }} />
                              <span>
                                {investigationIds.includes(hotspotB.hotspot_id) ? 'Bookmarked for Investigation' : 'Add to Investigation'}
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
