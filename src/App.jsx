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

import { HOTSPOTS_DATA } from './data/hotspots';

const INITIAL_FILTERS = {
  searchQuery: '',
  region: 'Delhi NCR',
  priorities: [], // Empty means all
  classifications: [], // Empty means all
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

  // Investigation IDs saved in localStorage for analyst persistence
  const [investigationIds, setInvestigationIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sih_investigation_ids');
      return saved ? JSON.parse(saved) : ['H1041', 'H1024'];
    } catch {
      return ['H1041', 'H1024'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sih_investigation_ids', JSON.stringify(investigationIds));
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
    return HOTSPOTS_DATA.filter((h) => {
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

      // 3. Classification Filter
      if (filters.classifications.length > 0) {
        if (!filters.classifications.includes(h.classification.label)) {
          return false;
        }
      }

      // 4. Persistence Filter
      if (filters.persistenceLevel === 'High' && h.history.persistence < 25) {
        return false;
      }
      if (filters.persistenceLevel === 'Medium' && (h.history.persistence < 10 || h.history.persistence >= 25)) {
        return false;
      }
      if (filters.persistenceLevel === 'Low' && h.history.persistence >= 10) {
        return false;
      }

      // 5. Near Industry Filter
      if (filters.nearIndustryOnly && h.context.nearest_industry_m > 250) {
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
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

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
        {/* VIEW 1: HOME / DASHBOARD (Sections 6-13) */}
        {currentTab === 'dashboard' && (
          <Dashboard
            hotspots={filteredHotspots}
            allHotspotsCount={HOTSPOTS_DATA.length}
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

        {/* VIEW 2: HOTSPOT EXPLORER (Section 4) */}
        {currentTab === 'explorer' && (
          <ExploreHotspots
            hotspots={filteredHotspots}
            allHotspotsCount={HOTSPOTS_DATA.length}
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            investigationIds={investigationIds}
            onToggleInvestigation={handleToggleInvestigation}
          />
        )}

        {/* VIEW 3: FIELD INVESTIGATION QUEUE (Sections 26, 27, 28) */}
        {currentTab === 'investigations' && (
          <InvestigationView
            hotspots={HOTSPOTS_DATA}
            investigationIds={investigationIds}
            onSelectHotspot={setSelectedHotspot}
            onToggleInvestigation={handleToggleInvestigation}
            onClearAllInvestigations={handleClearAllInvestigations}
          />
        )}

        {/* VIEW 4: HISTORY & PERSISTENCE (Section 19) */}
        {currentTab === 'history' && (
          <HistoryView
            hotspots={HOTSPOTS_DATA}
            onSelectHotspot={setSelectedHotspot}
          />
        )}

        {/* VIEW 5: ABOUT THE SYSTEM (Section 29) */}
        {currentTab === 'about' && <About />}

        {/* VIEW 6: FAQ (Section 30) */}
        {currentTab === 'faq' && <FAQ />}

        {/* VIEW 7: SECURITY & PRIVACY (Sections 43-53) */}
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

      {/* Hotspot Inspection Modal / Drawer (Sections 14-28) */}
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
          hotspots={HOTSPOTS_DATA}
          initialHotspotA={selectedHotspot || HOTSPOTS_DATA[0]}
          initialHotspotB={HOTSPOTS_DATA[1]}
          onClose={() => setShowCompareModal(false)}
          onSelectHotspot={(h) => setSelectedHotspot(h)}
        />
      )}

      {/* Standard Footer (Section 62) */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
