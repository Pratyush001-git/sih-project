/**
 * ThermalWatch GIS — Service & API Integration Layer
 * Connects the UI to FIRMS ingestion, OSM spatial buffers, and Decoupled ML Inference
 *
 * NOTE: With ML data loaded asynchronously in App.jsx, most filtering now happens
 * in App.jsx's useMemo. This service layer is kept for any direct query needs.
 */
import { getHotspotsData, INDUSTRIAL_CLUSTERS, PROJECT_FAQS } from '../data/hotspots';

/**
 * Fetch all thermal hotspots with optional client-side query filters
 */
export async function fetchHotspots(filters = {}) {
  const allData = getHotspotsData();
  let results = [...allData];

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.toLowerCase();
    results = results.filter(h =>
      h.hotspot_id.toLowerCase().includes(q) ||
      h.location.area_name.toLowerCase().includes(q) ||
      h.location.sub_district.toLowerCase().includes(q) ||
      h.context.nearest_industry_name.toLowerCase().includes(q) ||
      h.classification.label.toLowerCase().includes(q)
    );
  }

  if (filters.priorities?.length > 0) {
    results = results.filter(h => filters.priorities.includes(h.priority.level));
  }

  if (filters.classifications?.length > 0) {
    results = results.filter(h => filters.classifications.includes(h.classification.label));
  }

  if (filters.persistenceLevel === 'High') {
    results = results.filter(h => h.history.persistence >= 25);
  } else if (filters.persistenceLevel === 'Medium') {
    results = results.filter(h => h.history.persistence >= 10 && h.history.persistence < 25);
  } else if (filters.persistenceLevel === 'Low') {
    results = results.filter(h => h.history.persistence < 10);
  }

  if (filters.nearIndustryOnly) {
    // Uses power infrastructure distance as proxy (distance_to_power_km * 1000)
    results = results.filter(h => h.context.nearest_industry_m > 0 && h.context.nearest_industry_m <= 5000);
  }

  if (filters.fromDate) {
    results = results.filter(h => h.observation.date >= filters.fromDate);
  }

  if (filters.toDate) {
    results = results.filter(h => h.observation.date <= filters.toDate);
  }

  return results;
}

/**
 * Fetch a single hotspot by ID
 */
export async function fetchHotspotById(id) {
  const allData = getHotspotsData();
  const hotspot = allData.find(h => h.hotspot_id === id);
  if (!hotspot) {
    throw new Error(`Hotspot with ID "${id}" not found.`);
  }
  return hotspot;
}

/**
 * Fetch summary metrics for dashboard cards
 */
export async function fetchSummaryMetrics(hotspots) {
  const data = hotspots || getHotspotsData();
  return {
    activeHotspots: data.length,
    persistentSources: data.filter(h =>
      h.history.persistent_3plus === 1 || h.history.persistent_3plus === '1'
    ).length,
    industrialCandidates: data.filter(h =>
      h.classification.label === 'Industrial Candidate'
    ).length,
    highPriority: data.filter(h =>
      h.priority.level === 'CRITICAL' || h.priority.level === 'HIGH'
    ).length
  };
}

/**
 * Fetch verified industrial clusters
 */
export async function fetchIndustrialClusters() {
  return INDUSTRIAL_CLUSTERS;
}

/**
 * Fetch project FAQs
 */
export async function fetchFAQs() {
  return PROJECT_FAQS;
}

/**
 * Model API Boundary Contract (Section 21 & 22)
 * Demonstrates how the website sends feature vectors to the separate ML model.
 * In production this would call the actual XGBoost inference endpoint.
 * For the Monday MVP, predictions are pre-computed in the CSV.
 */
export async function simulateModelInference(features) {
  await new Promise(resolve => setTimeout(resolve, 150));

  // Route to XGBoost ML classes
  let label = "Other Thermal Anomaly";
  let confidence = 82;

  if (features.frp > 50 && features.persistence >= 10 && features.power_within_5km) {
    label = "Industrial Candidate";
    confidence = 92;
  } else if (features.ndvi > 0.45 && features.frp < 30) {
    label = "Agricultural Burn";
    confidence = 87;
  } else if (features.ndvi > 0.35) {
    label = "Vegetation Fire";
    confidence = 84;
  }

  return {
    classification: label,
    confidence,
    status: "available",
    timestamp: new Date().toISOString()
  };
}
