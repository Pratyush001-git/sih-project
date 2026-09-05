/**
 * ThermalWatch GIS — Data Layer
 * Exports ML-processed hotspot data loaded from /public/ml_hotspots.json
 * The HOTSPOTS_DATA export is now populated asynchronously via loadHotspotsData().
 * Components that need all-time data should call loadHotspotsData() once (in App.jsx).
 */

// ── Geographic constants ────────────────────────────────────────────────────
// Centroid of the Northern Zone coverage area (FIRMS Jan-Mar 2024)
export const STUDY_AREA_CENTER = [28.0, 77.5]; // Northern India centroid
export const STUDY_AREA_ZOOM = 6;

// Industrial cluster overlays (OSM reference zones — kept as context layers)
export const INDUSTRIAL_CLUSTERS = [
  {
    id: "bawana",
    name: "Bawana Industrial Area",
    type: "Manufacturing & Plastics Cluster",
    bounds: [[28.785, 77.030], [28.815, 77.075]],
    center: [28.800, 77.052],
    facility_count: 420
  },
  {
    id: "okhla",
    name: "Okhla Industrial Area Phase I-III",
    type: "Light Engineering & Fabrication",
    bounds: [[28.515, 77.265], [28.545, 77.300]],
    center: [28.530, 77.282],
    facility_count: 650
  },
  {
    id: "sahibabad",
    name: "Sahibabad Industrial Area Site IV",
    type: "Heavy Glass, Foundries & Chemicals",
    bounds: [[28.650, 77.335], [28.680, 77.375]],
    center: [28.665, 77.355],
    facility_count: 380
  },
  {
    id: "mayapuri",
    name: "Mayapuri Industrial Area",
    type: "Metal Recycling & Machinery",
    bounds: [[28.625, 77.110], [28.648, 77.140]],
    center: [28.636, 77.125],
    facility_count: 290
  },
  {
    id: "faridabad_sec24",
    name: "Faridabad Sector 24 Industrial Belt",
    type: "Automotive Components & Foundries",
    bounds: [[28.360, 77.305], [28.395, 77.345]],
    center: [28.378, 77.325],
    facility_count: 510
  },
  {
    id: "wazirpur",
    name: "Wazirpur Industrial Area",
    type: "Steel Rolling & Utensil Pickling",
    bounds: [[28.690, 77.155], [28.715, 77.185]],
    center: [28.702, 77.170],
    facility_count: 340
  },
  {
    id: "manesar",
    name: "IMT Manesar Phase 1-5",
    type: "Automotive & Precision Engineering",
    bounds: [[28.335, 76.910], [28.375, 76.960]],
    center: [28.355, 76.935],
    facility_count: 480
  }
];

// ── ML Hotspots data ─────────────────────────────────────────────────────────

// In-memory cache once loaded
let _cachedHotspots = null;
let _loadPromise = null;

/**
 * Load ML hotspot data from /ml_hotspots.json (served from public/).
 * Returns the cached result on subsequent calls.
 * @returns {Promise<Array>}
 */
export async function loadHotspotsData() {
  if (_cachedHotspots) return _cachedHotspots;
  if (_loadPromise) return _loadPromise;

  _loadPromise = fetch('/ml_hotspots.json')
    .then(r => {
      if (!r.ok) throw new Error(`Failed to fetch ml_hotspots.json: ${r.status}`);
      return r.json();
    })
    .then(data => {
      _cachedHotspots = data;
      return data;
    });

  return _loadPromise;
}

/**
 * Synchronous accessor — only valid after loadHotspotsData() has resolved.
 * Used by components that receive hotspots as props from App.jsx.
 */
export function getHotspotsData() {
  return _cachedHotspots || [];
}

// ── Legacy HOTSPOTS_DATA export for backward compatibility ───────────────────
// This is a live reference — starts empty, populated after load.
// App.jsx sets its own state from loadHotspotsData(), so components
// always get data via props, not this export.
export const HOTSPOTS_DATA = [];

// ── GeoJSON export utility ───────────────────────────────────────────────────
export function exportToGeoJSON(hotspots, filename = "thermalwatch_hotspots.geojson") {
  const geojson = {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    features: hotspots.map(h => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [h.location.longitude, h.location.latitude]
      },
      properties: {
        hotspot_id: h.hotspot_id,
        firms_id: h.firms_id || null,
        area_name: h.location.area_name,
        sub_district: h.location.sub_district,
        observation_date: h.observation.date,
        observation_time: h.observation.time,
        satellite: h.observation.satellite,
        instrument: h.observation.instrument,
        frp_mw: h.observation.frp,
        brightness_temp_k: h.observation.brightness_temperature,
        confidence_pct: h.observation.confidence,
        days_detected: h.history.detection_days,
        persistent_3plus: h.history.persistent_3plus,
        highly_persistent_10plus: h.history.highly_persistent_10plus,
        distance_to_power_km: h.context.nearest_industry_m > 0 ? (h.context.nearest_industry_m / 1000).toFixed(2) : null,
        power_within_5km: h.context.industrial_feature_count > 0 ? 1 : 0,
        ndvi: h.satellite_context.ndvi,
        ndbi: h.satellite_context.ndbi,
        ndwi: h.satellite_context.ndwi,
        persistence_pct: h.history.persistence,
        classification_label: h.classification.label,
        model_confidence: (h.classification.confidence / 100).toFixed(4),
        priority_level: h.priority.level,
        priority_score: h.priority.score,
        evidence_quality: h.uncertainty.quality,
        prob_agricultural_burn: h.ml_probs ? h.ml_probs.agricultural_burn : null,
        prob_industrial_candidate: h.ml_probs ? h.ml_probs.industrial_candidate : null,
        prob_other_thermal_anomaly: h.ml_probs ? h.ml_probs.other_thermal_anomaly : null,
        prob_vegetation_fire: h.ml_probs ? h.ml_probs.vegetation_fire : null
      }
    }))
  };

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// ── Project FAQs ─────────────────────────────────────────────────────────────
export const PROJECT_FAQS = [
  {
    id: 1,
    question: "Is every hotspot a fire?",
    answer: "No. A thermal anomaly can have multiple causes, including fire, agricultural burning, industrial furnaces, gas flares, sun-heated metal surfaces, intense industrial activity, or sensor-related anomalies. Satellite sensors flag thermal contrast against the surrounding background, not combustion per se."
  },
  {
    id: 2,
    question: "Is every detected fire an industrial fire?",
    answer: "No. NASA FIRMS provides satellite-derived thermal and active-fire observations. The system synthesizes geographic context (OpenStreetMap), multi-temporal persistence (historical recurrence), and high-resolution Sentinel-2 environmental data before producing an informed classification."
  },
  {
    id: 3,
    question: "Why do you use OpenStreetMap?",
    answer: "OSM provides geographic context such as industrial facility boundaries, factory polygons, roads, and residential settlements near a hotspot. This spatial proximity helps distinguish isolated agricultural burns from industrial cluster activities."
  },
  {
    id: 4,
    question: "What is persistence?",
    answer: "Persistence measures how repeatedly a similar geographic location produces thermal detections over an extended observation window (e.g., 27 detection days out of 90 total observation passes = 30% persistence). It distinguishes transient fires from continuously operating industrial thermal processes."
  },
  {
    id: 5,
    question: "Does high persistence prove an industrial source?",
    answer: "No. Repeated activity indicates a persistent thermal source, but it does not by itself prove the source is industrial. Other phenomena like persistent landfill gas emissions or recurring seasonal burn spots also require human/contextual review."
  },
  {
    id: 6,
    question: "Is the priority score a probability?",
    answer: "No. The priority score is a project-defined prioritization score used to rank locations for inspection workflow. It is NOT a mathematical probability of danger or fire occurrence."
  },
  {
    id: 7,
    question: "What if OSM does not show a factory?",
    answer: "The system does not assume the factory does not exist. OSM can be incomplete or outdated. The system explicitly preserves uncertainty (flagging evidence quality as 'Limited') and utilizes other available evidence such as NDBI (built-up index) and thermal persistence."
  },
  {
    id: 8,
    question: "What happens when satellite imagery is cloudy?",
    answer: "The system flags the imagery as unusable or unavailable and relies on the nearest valid observation where possible. It NEVER invents, imputes, or estimates missing satellite values."
  },
  {
    id: 9,
    question: "Can the system detect every industrial fire?",
    answer: "No. Satellite revisit timing (typically 2-4 satellite passes per 24 hours), spatial resolution limits (375m VIIRS, 1km MODIS), heavy cloud cover, detection thresholds, and missing geographic data can affect detection."
  },
  {
    id: 10,
    question: "Is this an emergency response system?",
    answer: "No. It is a satellite-assisted decision-support and prioritization system designed for monitoring agencies, analysts, and researchers. It does not replace official 112/emergency response or ground verification."
  },
  {
    id: 11,
    question: "Why is the website showing uncertainty?",
    answer: "Because no single dataset is perfect. Showing explicit evidence quality prevents overconfident conclusions and ensures monitoring officers know when data is limited."
  },
  {
    id: 12,
    question: "Can this scale to India?",
    answer: "Yes. The project architecture is designed around modular region-based processing. While Northern Zone (Jan-Mar 2024) serves as the primary dataset, the FIRMS and OSM ingestion pipelines scale nationally across all industrial corridors."
  }
];
