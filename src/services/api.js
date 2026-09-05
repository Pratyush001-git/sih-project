/**
 * ThermalWatch GIS — Service & API Integration Layer
 * Connects the UI to FIRMS ingestion, OSM spatial buffers, and Decoupled ML Inference
 */
import { HOTSPOTS_DATA, INDUSTRIAL_CLUSTERS, PROJECT_FAQS } from '../data/hotspots';

/**
 * Fetch all thermal hotspots with optional client-side query filters
 */
export async function fetchHotspots(filters = {}) {
  // Simulate standard network latency
  await new Promise(resolve => setTimeout(resolve, 80));

  let results = [...HOTSPOTS_DATA];

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
    results = results.filter(h => h.context.nearest_industry_m <= 250);
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
  await new Promise(resolve => setTimeout(resolve, 50));
  const hotspot = HOTSPOTS_DATA.find(h => h.hotspot_id === id);
  if (!hotspot) {
    throw new Error(`Hotspot with ID "${id}" not found.`);
  }
  return hotspot;
}

/**
 * Fetch summary metrics for dashboard cards
 */
export async function fetchSummaryMetrics(hotspots = HOTSPOTS_DATA) {
  return {
    activeHotspots: hotspots.length,
    persistentSources: hotspots.filter(h => h.history.persistence >= 20).length,
    industrialCandidates: hotspots.filter(h => 
      h.classification.label.includes('Industrial') || h.context.nearest_industry_m <= 250
    ).length,
    highPriority: hotspots.filter(h => 
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
 * Demonstrates how the website sends feature vectors to the separate ML model
 */
export async function simulateModelInference(features) {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // Predict classification based on thermal & spatial vector
  let label = "Other Thermal Anomaly";
  let confidence = 82;

  if (features.frp > 70 && features.persistence < 10) {
    label = "Industrial Fire";
    confidence = 94;
  } else if (features.persistence >= 25 && features.nearest_industry_m < 300) {
    label = "Industrial Thermal Source";
    confidence = 92;
  } else if (features.ndvi > 0.45) {
    label = "Agricultural/Vegetation Fire";
    confidence = 90;
  }

  return {
    classification: label,
    confidence,
    status: "available",
    timestamp: new Date().toISOString()
  };
}
