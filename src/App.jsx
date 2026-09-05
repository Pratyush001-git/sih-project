import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ComparisonModal from './components/ComparisonModal';
import HotspotDetails from './components/HotspotDetails';
import InvestigationView from './components/InvestigationView';
import HistoryView from './components/HistoryView';
import PrivacyView from './components/PrivacyView';

// Canonical Pages
import Dashboard from './pages/Dashboard';
import ExploreHotspots from './pages/ExploreHotspots';
import About from './pages/About';
import FAQ from './pages/FAQ';
import HotspotDetailsPage from './pages/HotspotDetailsPage';

import { loadHotspotsData } from './data/hotspots';

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

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  useEffect(() => {
    try {
      localStorage.setItem('thermalwatch_investigation_ids', JSON.stringify(investigationIds));
    } catch {
      // Storage error fallback
    }
  }, [investigationIds]);

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
        const q = filters.searchQuery.toLowerCase();
        const matchesId = h.hotspot_id.toLowerCase().includes(q);
        const matchesArea = h.location.area_name.toLowerCase().includes(q);
        const matchesSub = h.location.sub_district.toLowerCase().includes(q);
        const matchesIndustry = h.context.nearest_industry_name.toLowerCase().includes(q);
        const matchesClass = h.classification.label.toLowerCase().includes(q);

        if (!matchesId && !matchesArea && !matchesSub && !matchesIndustry && !matchesClass) {
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
          <h2 style={{ color: 'var(--brand-navy)', marginBottom: '0.5rem' }}>
            Loading ML Prediction Dataset
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Fetching 31,422 FIRMS thermal anomaly predictions (Northern Zone, Jan–Mar 2024)...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
            XGBoost model · Sentinel-2 + FIRMS · ~91% accuracy
          </p>
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
        investigationCount={investigationIds.length}
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
            onSelectHotspot={setSelectedHotspot}
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
            onSelectHotspot={setSelectedHotspot}
            investigationIds={investigationIds}
            onToggleInvestigation={handleToggleInvestigation}
          />
        )}

        {/* VIEW 3: FIELD INVESTIGATION QUEUE */}
        {currentTab === 'investigations' && (
          <InvestigationView
            hotspots={allHotspots}
            investigationIds={investigationIds}
            onSelectHotspot={setSelectedHotspot}
            onToggleInvestigation={handleToggleInvestigation}
            onClearAllInvestigations={handleClearAllInvestigations}
          />
        )}

        {/* VIEW 4: HISTORY & PERSISTENCE */}
        {currentTab === 'history' && (
          <HistoryView
            hotspots={allHotspots}
            onSelectHotspot={setSelectedHotspot}
          />
        )}

        {/* VIEW 5: ABOUT THE SYSTEM */}
        {currentTab === 'about' && <About />}

        {/* VIEW 6: FAQ */}
        {currentTab === 'faq' && <FAQ />}

        {/* VIEW 7: SECURITY & PRIVACY */}
        {currentTab === 'privacy' && <PrivacyView />}

        {/* VIEW 8: DEDICATED HOTSPOT DETAILS PAGE */}
        {currentTab === 'details' && (
          <HotspotDetailsPage
            hotspot={selectedHotspot}
            onBack={() => setCurrentTab('dashboard')}
            investigationIds={investigationIds}
            onToggleInvestigation={handleToggleInvestigation}
          />
        )}
      </main>

      {/* Hotspot Inspection Modal / Drawer */}
      {selectedHotspot && (
        <HotspotDetails
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
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
          onSelectHotspot={(h) => setSelectedHotspot(h)}
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
