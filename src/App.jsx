import { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ComparisonModal from './components/ComparisonModal';
import HotspotDetails from './components/HotspotDetails';
import InvestigationView from './components/InvestigationView';
import HistoryView from './components/HistoryView';

// Canonical Pages
import Dashboard from './pages/Dashboard';
import ExploreHotspots from './pages/ExploreHotspots';
import About from './pages/About';
import FAQ from './pages/FAQ';
import HotspotDetailsPage from './pages/HotspotDetailsPage';

import { loadHotspotsData, INDUSTRIAL_CLUSTERS } from './data/hotspots';

// ML class labels from XGBoost model
export const ML_CLASSES = [
  'Agricultural Burn',
  'Industrial Candidate',
  'Other Thermal Anomaly',
  'Vegetation Fire'
];

const INITIAL_FILTERS = {
  searchQuery: '',
  region: 'Northern Zone',
  priorities: [],       // Empty means all
  classifications: [],  // Empty means all
  persistenceLevel: 'Any',
  nearIndustryOnly: false,
  fromDate: '',
  toDate: ''
};

const VALID_TABS = [
  'dashboard',
  'explorer',
  'investigations',
  'history',
  'about',
  'faq',
  'details'
];

function getInitialTab() {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#[/]?/, '').split('?')[0].trim().toLowerCase();
    if (VALID_TABS.includes(hash)) {
      return hash;
    }
    try {
      const saved = localStorage.getItem('thermalwatch_active_tab');
      if (saved && VALID_TABS.includes(saved)) {
        return saved;
      }
    } catch {
      // Storage error fallback
    }
  }
  return 'dashboard';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState(getInitialTab);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Sync tab with URL hash and localStorage so refresh retains active page
  useEffect(() => {
    try {
      localStorage.setItem('thermalwatch_active_tab', currentTab);
    } catch {
      // Storage error fallback
    }
    const currentHash = window.location.hash.replace(/^#[/]?/, '').split('?')[0].trim().toLowerCase();
    if (currentHash !== currentTab) {
      window.location.hash = currentTab;
    }
  }, [currentTab]);

  // Support browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#[/]?/, '').split('?')[0].trim().toLowerCase();
      if (VALID_TABS.includes(hash)) {
        setCurrentTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // ML dataset state
  const [allHotspots, setAllHotspots] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Load ML predictions on mount
  useEffect(() => {
    setDataLoading(true);
    loadHotspotsData()
      .then(data => {
        setAllHotspots(data);
        setDataLoading(false);
      })
      .catch(err => {
        console.error('Failed to load ML hotspot data:', err);
        setDataError(err.message);
        setDataLoading(false);
      });
  }, []);

  // Investigation IDs saved in localStorage for analyst persistence
  const [investigationIds, setInvestigationIds] = useState(() => {
    try {
      const saved = localStorage.getItem('thermalwatch_investigation_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Purge any stale legacy mock IDs (e.g. H1041, H1024) once the dataset is loaded
  useEffect(() => {
    if (allHotspots.length > 0 && investigationIds.length > 0) {
      const validHotspotIds = new Set(allHotspots.map(h => h.hotspot_id));
      setInvestigationIds((prev) => {
        const cleaned = prev.filter((id) => validHotspotIds.has(id));
        return cleaned.length !== prev.length ? cleaned : prev;
      });
    }
  }, [allHotspots]);

  useEffect(() => {
    try {
      localStorage.setItem('thermalwatch_investigation_ids', JSON.stringify(investigationIds));
    } catch {
      // Storage error fallback
    }
  }, [investigationIds]);

  const handleSelectHotspot = (h) => {
    setSelectedHotspot(h);
    if (h?.hotspot_id) {
      try {
        localStorage.setItem('thermalwatch_selected_hotspot_id', h.hotspot_id);
      } catch {
        // Storage error fallback
      }
    }
  };

  const handleCloseHotspot = () => {
    setSelectedHotspot(null);
    try {
      localStorage.removeItem('thermalwatch_selected_hotspot_id');
    } catch {
      // Storage error fallback
    }
  };

  // Restore selected hotspot ONLY once on mount if user is on the dedicated details page
  const initialRestoreDone = useRef(false);
  useEffect(() => {
    if (allHotspots.length > 0 && !initialRestoreDone.current) {
      initialRestoreDone.current = true;
      try {
        const savedId = localStorage.getItem('thermalwatch_selected_hotspot_id');
        if (savedId && currentTab === 'details') {
          const found = allHotspots.find((h) => h.hotspot_id === savedId);
          if (found) setSelectedHotspot(found);
        }
      } catch {
        // Storage error fallback
      }
    }
  }, [allHotspots, currentTab]);

  // Compute number of actually marked hotspots present in the loaded dataset
  const validInvestigationCount = useMemo(() => {
    if (!allHotspots.length || !investigationIds.length) return 0;
    const idSet = new Set(investigationIds);
    return allHotspots.filter(h => idSet.has(h.hotspot_id)).length;
  }, [allHotspots, investigationIds]);

  const handleToggleInvestigation = (hotspotId) => {
    setInvestigationIds((prev) =>
      prev.includes(hotspotId)
        ? prev.filter((id) => id !== hotspotId)
        : [...prev, hotspotId]
    );
  };

  const handleClearAllInvestigations = () => {
    setInvestigationIds([]);
  };

  // Filter computation
  const filteredHotspots = useMemo(() => {
    if (!allHotspots.length) return [];

    return allHotspots.filter((h) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesId = h.hotspot_id.toLowerCase().includes(q);
        const matchesArea = h.location.area_name.toLowerCase().includes(q);
        const matchesSub = h.location.sub_district.toLowerCase().includes(q);
        const matchesIndustry = h.context.nearest_industry_name.toLowerCase().includes(q);
        const matchesClass = h.classification.label.toLowerCase().includes(q);

        // Also check if search query matches an industrial cluster by center distance
        let matchesCluster = false;
        for (const cluster of INDUSTRIAL_CLUSTERS) {
          if (
            cluster.name.toLowerCase().includes(q) ||
            cluster.id.toLowerCase().includes(q) ||
            q.includes(cluster.id.toLowerCase())
          ) {
            const dist = Math.sqrt(
              Math.pow(h.location.latitude - cluster.center[0], 2) +
              Math.pow(h.location.longitude - cluster.center[1], 2)
            );
            if (dist < 0.20) { // ~22 km radius around cluster
              matchesCluster = true;
              break;
            }
          }
        }

        if (!matchesId && !matchesArea && !matchesSub && !matchesIndustry && !matchesClass && !matchesCluster) {
          return false;
        }
      }

      // 2. Priority Filter
      if (filters.priorities.length > 0) {
        if (!filters.priorities.includes(h.priority.level)) {
          return false;
        }
      }

      // 3. Classification Filter (ML class labels)
      if (filters.classifications.length > 0) {
        if (!filters.classifications.includes(h.classification.label)) {
          return false;
        }
      }

      // 4. Persistence Filter (using days_detected / 90 = persistence%)
      if (filters.persistenceLevel === 'High' && h.history.persistence < 25) {
        return false;
      }
      if (filters.persistenceLevel === 'Medium' && (h.history.persistence < 10 || h.history.persistence >= 25)) {
        return false;
      }
      if (filters.persistenceLevel === 'Low' && h.history.persistence >= 10) {
        return false;
      }

      // 5. Near Industry Filter — uses power infrastructure distance as proxy
      // nearest_industry_m = distance_to_power_km * 1000
      if (filters.nearIndustryOnly && h.context.nearest_industry_m > 5000) {
        return false;
      }

      // 6. Observation Date Range
      if (filters.fromDate && h.observation.date < filters.fromDate) {
        return false;
      }
      if (filters.toDate && h.observation.date > filters.toDate) {
        return false;
      }

      return true;
    });
  }, [filters, allHotspots]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Loading / Error screen
  if (dataLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface)',
        gap: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{
            color: 'var(--brand-navy)',
            marginBottom: '0.5rem',
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            INTEGRATING WEBSITE...
          </h2>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface)',
        padding: '2rem'
      }}>
        <div className="gis-alert gis-alert-warning" style={{ maxWidth: '520px' }}>
          <strong>Failed to load ML prediction data</strong>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{dataError}</p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ marginTop: '1rem' }}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header with Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        investigationCount={validInvestigationCount}
        onOpenCompare={() => setShowCompareModal(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* VIEW 1: HOME / DASHBOARD */}
        {currentTab === 'dashboard' && (
          <Dashboard
            hotspots={filteredHotspots}
            allHotspotsCount={allHotspots.length}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            investigationIds={investigationIds}
            onToggleInvestigation={handleToggleInvestigation}
            onNavigateTab={setCurrentTab}
            onOpenCompare={() => setShowCompareModal(true)}
          />
        )}

        {/* VIEW 2: HOTSPOT EXPLORER */}
        {currentTab === 'explorer' && (
          <ExploreHotspots
            hotspots={filteredHotspots}
            allHotspotsCount={allHotspots.length}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            investigationIds={investigationIds}
            onToggleInvestigation={handleToggleInvestigation}
          />
        )}

        {/* VIEW 3: FIELD INVESTIGATION QUEUE */}
        {currentTab === 'investigations' && (
          <InvestigationView
            hotspots={allHotspots}
            investigationIds={investigationIds}
            onSelectHotspot={handleSelectHotspot}
            onToggleInvestigation={handleToggleInvestigation}
            onClearAllInvestigations={handleClearAllInvestigations}
          />
        )}

        {/* VIEW 4: HISTORY & PERSISTENCE */}
        {currentTab === 'history' && (
          <HistoryView
            hotspots={allHotspots}
            onSelectHotspot={handleSelectHotspot}
          />
        )}

        {/* VIEW 5: ABOUT THE SYSTEM */}
        {currentTab === 'about' && <About />}

        {/* VIEW 6: FAQ */}
        {currentTab === 'faq' && <FAQ />}

        {/* VIEW 7: DEDICATED HOTSPOT DETAILS PAGE */}
        {currentTab === 'details' && (
          <HotspotDetailsPage
            hotspot={selectedHotspot}
            onBack={() => {
              handleCloseHotspot();
              setCurrentTab('dashboard');
            }}
            investigationIds={investigationIds}
            onToggleInvestigation={handleToggleInvestigation}
          />
        )}
      </main>

      {/* Hotspot Inspection Modal / Drawer */}
      {selectedHotspot && (
        <HotspotDetails
          hotspot={selectedHotspot}
          onClose={handleCloseHotspot}
          isInvestigating={investigationIds.includes(selectedHotspot.hotspot_id)}
          onToggleInvestigation={handleToggleInvestigation}
        />
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <ComparisonModal
          hotspots={allHotspots}
          initialHotspotA={selectedHotspot || (allHotspots.length > 0 ? allHotspots[0] : null)}
          initialHotspotB={allHotspots.length > 1 ? (selectedHotspot && selectedHotspot.hotspot_id === allHotspots[0].hotspot_id ? allHotspots[1] : (allHotspots.find(h => h.classification?.label === 'Agricultural Burn') || allHotspots[1])) : null}
          onClose={() => setShowCompareModal(false)}
          onSelectHotspot={(h) => handleSelectHotspot(h)}
          isLoading={dataLoading}
          investigationIds={investigationIds}
          onToggleInvestigation={handleToggleInvestigation}
        />
      )}

      {/* Standard Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
