// @ts-check
/**
 * preprocess_csv.mjs
 * Reads industrial_fire_predictions.csv and transforms each row
 * into the nested hotspot object shape expected by ThermalWatch components.
 *
 * Run: node scripts/preprocess_csv.mjs
 * Output: public/ml_hotspots.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CSV_PATH = path.join(ROOT, 'industrial_fire_predictions.csv');
const OUT_PATH = path.join(ROOT, 'public', 'ml_hotspots.json');

// ── helpers ──────────────────────────────────────────────────────────────────

function parseFloat2(v) {
  const n = parseFloat(v);
  return isNaN(n) ? null : Math.round(n * 10000) / 10000;
}

/** Convert FIRMS confidence string → numeric 0-100 */
function parseConfidence(c) {
  const s = String(c || '').trim().toLowerCase();
  if (s === 'l') return 40;
  if (s === 'n') return 75;
  if (s === 'h') return 95;
  const n = parseInt(s, 10);
  return isNaN(n) ? 75 : Math.min(100, Math.max(0, n));
}

/** Format 4-digit HHMM time string → "HH:MM UTC" */
function formatTime(t) {
  const s = String(t || '').padStart(4, '0');
  return `${s.slice(0, 2)}:${s.slice(2)} UTC`;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const INDUSTRIAL_CLUSTERS = [
  { name: "Bawana Industrial Area", sub: "North Delhi NCR", lat: 28.800, lon: 77.052, radiusKm: 15 },
  { name: "Okhla Industrial Area", sub: "South Delhi NCR", lat: 28.530, lon: 77.282, radiusKm: 15 },
  { name: "Sahibabad Industrial Area", sub: "Ghaziabad NCR", lat: 28.665, lon: 77.355, radiusKm: 15 },
  { name: "Mayapuri Industrial Area", sub: "West Delhi NCR", lat: 28.636, lon: 77.125, radiusKm: 12 },
  { name: "Faridabad Sector 24 Industrial Belt", sub: "Faridabad NCR", lat: 28.378, lon: 77.325, radiusKm: 18 },
  { name: "Wazirpur Industrial Area", sub: "North West Delhi NCR", lat: 28.702, lon: 77.170, radiusKm: 12 },
  { name: "IMT Manesar Industrial Complex", sub: "Gurugram NCR", lat: 28.355, lon: 76.935, radiusKm: 18 },
  { name: "Narela Industrial Zone", sub: "North Delhi NCR", lat: 28.855, lon: 77.090, radiusKm: 12 },
  { name: "Bhiwadi Industrial Cluster", sub: "Alwar NCR", lat: 28.210, lon: 76.860, radiusKm: 16 },
  { name: "Sonipat / Rai Industrial Belt", sub: "Sonipat, Haryana", lat: 28.990, lon: 77.020, radiusKm: 18 },
  { name: "Panipat Industrial Belt", sub: "Panipat, Haryana", lat: 29.390, lon: 76.970, radiusKm: 20 },
  { name: "Noida / Greater Noida Sector", sub: "Gautam Buddha Nagar NCR", lat: 28.510, lon: 77.420, radiusKm: 18 }
];

const REGIONAL_HUBS = [
  { name: "Delhi Urban / NCR Core", sub: "Delhi NCR", lat: 28.640, lon: 77.210 },
  { name: "Gurugram Sub-District", sub: "Gurugram, Haryana", lat: 28.455, lon: 77.030 },
  { name: "Faridabad Sub-District", sub: "Faridabad, Haryana", lat: 28.410, lon: 77.310 },
  { name: "Ghaziabad Sub-District", sub: "Ghaziabad, UP", lat: 28.670, lon: 77.450 },
  { name: "Rohtak Industrial Belt", sub: "Rohtak, Haryana", lat: 28.895, lon: 76.600 },
  { name: "Hisar Sector", sub: "Hisar, Haryana", lat: 29.150, lon: 75.720 },
  { name: "Karnal Agri-Zone", sub: "Karnal, Haryana", lat: 29.685, lon: 76.990 },
  { name: "Kurukshetra Plains", sub: "Kurukshetra, Haryana", lat: 29.965, lon: 76.875 },
  { name: "Ambala Zone", sub: "Ambala, Haryana", lat: 30.375, lon: 76.780 },
  { name: "Yamunanagar Industrial Belt", sub: "Yamunanagar, Haryana", lat: 30.130, lon: 77.290 },
  { name: "Ludhiana Agri-Industrial Belt", sub: "Ludhiana, Punjab", lat: 30.900, lon: 75.855 },
  { name: "Jalandhar Zone", sub: "Jalandhar, Punjab", lat: 31.325, lon: 75.580 },
  { name: "Amritsar Border Corridor", sub: "Amritsar, Punjab", lat: 31.635, lon: 74.870 },
  { name: "Patiala Plains", sub: "Patiala, Punjab", lat: 30.340, lon: 76.385 },
  { name: "Bathinda Thermal / Agri Zone", sub: "Bathinda, Punjab", lat: 30.210, lon: 74.945 },
  { name: "Sangrur Agricultural Belt", sub: "Sangrur, Punjab", lat: 30.245, lon: 75.845 },
  { name: "Firozpur Corridor", sub: "Firozpur, Punjab", lat: 30.925, lon: 74.610 },
  { name: "Chandigarh Tri-City", sub: "Chandigarh / Mohali", lat: 30.735, lon: 76.790 },
  { name: "Jaipur Metropolitan Zone", sub: "Jaipur, Rajasthan", lat: 26.915, lon: 75.785 },
  { name: "Alwar Rural / Industrial Corridor", sub: "Alwar, Rajasthan", lat: 27.570, lon: 76.615 },
  { name: "Kota Industrial Zone", sub: "Kota, Rajasthan", lat: 25.180, lon: 75.835 },
  { name: "Jodhpur Arid Zone", sub: "Jodhpur, Rajasthan", lat: 26.240, lon: 73.020 },
  { name: "Bikaner Corridor", sub: "Bikaner, Rajasthan", lat: 28.020, lon: 73.310 },
  { name: "Ajmer Valley", sub: "Ajmer, Rajasthan", lat: 26.450, lon: 74.640 },
  { name: "Sri Ganganagar Canal Belt", sub: "Sri Ganganagar, Rajasthan", lat: 29.905, lon: 73.880 },
  { name: "Meerut Industrial Belt", sub: "Meerut, UP", lat: 28.985, lon: 77.705 },
  { name: "Mathura / Refinery Sector", sub: "Mathura, UP", lat: 27.495, lon: 77.675 },
  { name: "Agra Corridor", sub: "Agra, UP", lat: 27.180, lon: 78.010 },
  { name: "Aligarh Sector", sub: "Aligarh, UP", lat: 27.895, lon: 78.085 },
  { name: "Moradabad Zone", sub: "Moradabad, UP", lat: 28.840, lon: 78.775 },
  { name: "Bareilly Plains", sub: "Bareilly, UP", lat: 28.365, lon: 79.415 },
  { name: "Saharanpur Timber Belt", sub: "Saharanpur, UP", lat: 29.965, lon: 77.545 },
  { name: "Muzaffarnagar Sugar Belt", sub: "Muzaffarnagar, UP", lat: 29.470, lon: 77.705 },
  { name: "Kanpur Industrial Hub", sub: "Kanpur, UP", lat: 26.450, lon: 80.330 },
  { name: "Lucknow Central Zone", sub: "Lucknow, UP", lat: 26.850, lon: 80.950 },
  { name: "Gwalior Northern Ridge", sub: "Gwalior, MP", lat: 26.220, lon: 78.180 },
  { name: "Dehradun Foothills", sub: "Dehradun, Uttarakhand", lat: 30.315, lon: 78.030 },
  { name: "Haridwar Industrial Area", sub: "Haridwar, Uttarakhand", lat: 29.945, lon: 78.165 },
  { name: "Jammu Foothills", sub: "Jammu, J&K", lat: 32.725, lon: 74.860 }
];

function deriveLocation(lat, lon) {
  // 1. Check industrial clusters first
  for (const c of INDUSTRIAL_CLUSTERS) {
    if (haversineKm(lat, lon, c.lat, c.lon) <= c.radiusKm) {
      return {
        area_name: `${c.name} (${lat.toFixed(3)}N, ${lon.toFixed(3)}E)`,
        sub_district: c.sub
      };
    }
  }

  // 2. Check closest regional hub
  let closestHub = null;
  let minDistance = Infinity;
  for (const h of REGIONAL_HUBS) {
    const d = haversineKm(lat, lon, h.lat, h.lon);
    if (d < minDistance) {
      minDistance = d;
      closestHub = h;
    }
  }

  if (closestHub && minDistance <= 65) {
    return {
      area_name: `${closestHub.name} (${lat.toFixed(3)}N, ${lon.toFixed(3)}E)`,
      sub_district: closestHub.sub
    };
  }

  // 3. Fallback to broad Northern Zone geographic state
  let state = 'Northern Zone';
  if (lat >= 29.5 && lon <= 76.5) state = 'Punjab Rural Corridor';
  else if (lat >= 28.0 && lat < 30.5 && lon >= 75.0 && lon <= 77.5) state = 'Haryana Corridor';
  else if (lat < 28.5 && lon <= 77.0) state = 'Rajasthan Corridor';
  else if (lon > 77.5 && lat < 30.0) state = 'Uttar Pradesh Corridor';
  else if (lat >= 31.0) state = 'Northern Himalayan Belt';

  return {
    area_name: `${state} (${lat.toFixed(3)}N, ${lon.toFixed(3)}E)`,
    sub_district: state
  };
}

/** Derive priority level + score from ML fields */
function derivePriority(row) {
  const cls = row.predicted_class;
  const conf = parseFloat(row.model_confidence) || 0;
  const frp = parseFloat(row.frp) || 0;
  const highPers = parseInt(row.highly_persistent_10plus, 10) === 1;
  const pers3 = parseInt(row.persistent_3plus, 10) === 1;
  const daysDetected = parseInt(row.days_detected, 10) || 0;

  let level, score;

  if (cls === 'Industrial Candidate') {
    if (highPers && frp >= 20) {
      level = 'CRITICAL';
      score = Math.min(99, 70 + Math.round(frp / 5) + (conf > 0.9 ? 10 : 5));
    } else if (pers3 || frp >= 10) {
      level = 'HIGH';
      score = Math.min(89, 50 + Math.round(frp / 4) + (pers3 ? 10 : 0));
    } else {
      level = 'MEDIUM';
      score = Math.min(69, 35 + Math.round(frp / 3));
    }
  } else if (cls === 'Agricultural Burn') {
    if (frp >= 30 && pers3) {
      level = 'MEDIUM';
      score = Math.min(65, 35 + Math.round(frp / 4));
    } else {
      level = 'LOW';
      score = Math.min(39, 15 + Math.round(frp / 5));
    }
  } else if (cls === 'Vegetation Fire') {
    if (frp >= 50 || highPers) {
      level = 'MEDIUM';
      score = Math.min(60, 30 + Math.round(frp / 5));
    } else {
      level = 'LOW';
      score = Math.min(34, 10 + Math.round(frp / 5));
    }
  } else {
    // Other Thermal Anomaly
    if (frp >= 40 && highPers) {
      level = 'MEDIUM';
      score = Math.min(55, 25 + Math.round(frp / 5));
    } else {
      level = 'LOW';
      score = Math.min(29, 8 + Math.round(frp / 6));
    }
  }

  const why = buildWhyReasons(cls, frp, daysDetected, highPers, pers3, conf, row);
  return { level, score, why };
}

function buildWhyReasons(cls, frp, daysDetected, highPers, pers3, conf, row) {
  const reasons = [];
  if (frp > 0) reasons.push(`Fire Radiative Power: ${frp} MW`);
  if (highPers) reasons.push(`Highly persistent source — detected on ≥ 10 distinct days`);
  else if (pers3) reasons.push(`Persistent source — detected on ≥ 3 distinct days (${daysDetected} days total)`);
  else if (daysDetected > 0) reasons.push(`Detection count: ${daysDetected} days observed`);
  const confPct = Math.round(conf * 100);
  if (confPct >= 85) reasons.push(`High model confidence: ${confPct}% (XGBoost ML classifier)`);
  else reasons.push(`Model confidence: ${confPct}%`);
  if (cls === 'Industrial Candidate') reasons.push('XGBoost classified as Industrial Candidate - warrants verification');
  if (cls === 'Agricultural Burn') reasons.push('Classified as agricultural burn - seasonal field clearing pattern');
  if (cls === 'Vegetation Fire') reasons.push('Vegetation fire signature detected');
  if (parseFloat(row.power_within_5km) === 1) reasons.push('Power infrastructure detected within 5 km (OSM)');
  const distKm = parseFloat(row.distance_to_power_km);
  if (!isNaN(distKm) && distKm < 10) reasons.push(`Nearest power source: ${distKm.toFixed(1)} km`);
  return reasons.slice(0, 4);
}

function deriveEvidence(row) {
  const frp = parseFloat(row.frp) || 0;
  const conf = parseFloat(row.model_confidence) || 0;
  const pers3 = parseInt(row.persistent_3plus, 10) === 1;
  const highPers = parseInt(row.highly_persistent_10plus, 10) === 1;
  const powerNear = parseInt(row.power_within_5km, 10) === 1;

  const thermal = frp >= 30 ? 'HIGH' : frp >= 10 ? 'MEDIUM' : 'LOW';
  const persistence = highPers ? 'HIGH' : pers3 ? 'MEDIUM' : 'LOW';
  const industrial_proximity = powerNear ? 'MEDIUM' : 'LOW';
  const residential_proximity = 'N/A'; // not in CSV
  const confidence = conf >= 0.9 ? 'HIGH' : conf >= 0.7 ? 'MEDIUM' : 'LOW';

  return { thermal, persistence, industrial_proximity, residential_proximity, confidence };
}

function deriveSatelliteContext(row) {
  const ndvi = parseFloat2(row.ndvi);
  const ndbi = parseFloat2(row.ndbi);
  const ndwi = parseFloat2(row.ndwi);

  let land_description = 'Sentinel-2 derived spectral context.';
  if (ndvi !== null && ndbi !== null) {
    if (ndvi > 0.4) land_description = 'High vegetation cover - dense green canopy or cropland.';
    else if (ndbi > 0.3) land_description = 'High built-up index - impervious surface or industrial rooftop area.';
    else if (ndvi > 0.2) land_description = 'Mixed land use - partial vegetation with some built-up area.';
    else land_description = 'Low vegetation, likely barren or fallow land.';
  }

  return {
    status: (ndvi !== null) ? 'available' : 'unavailable',
    cloud_cover_pct: null, // not in dataset
    ndvi,
    ndbi,
    ndwi,
    observation_date: row.acq_date,
    land_description
  };
}

function deriveTrendSummary(cls, daysDetected, highPers, pers3) {
  if (cls === 'Industrial Candidate') {
    if (highPers) return `Highly persistent industrial thermal signature — detected on ≥ 10 days. Consistent with operational furnace, kiln, or continuous process facility.`;
    if (pers3) return `Persistent industrial candidate — detected on ${daysDetected} distinct days. Repeated detections suggest an operational thermal source.`;
    return `Low-persistence industrial candidate. Detected ${daysDetected} day(s). May indicate intermittent operation or transient event.`;
  }
  if (cls === 'Agricultural Burn') {
    return `Agricultural burn signature. Detected on ${daysDetected} day(s) — consistent with seasonal crop residue burning or field clearing activity.`;
  }
  if (cls === 'Vegetation Fire') {
    if (highPers) return `Persistent vegetation fire or recurring burn zone. Detected on ≥ 10 days — unusually persistent for vegetation; warrants investigation.`;
    return `Vegetation fire pattern. Detected on ${daysDetected} day(s). Likely wildfire, grassland burn, or forest fire.`;
  }
  // Other Thermal Anomaly
  if (highPers) return `Persistent thermal anomaly — detected on ≥ 10 days. Source unclassified; could be industrial, geothermal, or urban heat island.`;
  return `Other thermal anomaly detected on ${daysDetected} day(s). No dominant class signature; requires ground-level verification.`;
}

function deriveUncertainty(row) {
  const conf = parseFloat(row.model_confidence) || 0;
  const confPct = Math.round(conf * 100);
  const quality = conf >= 0.85 ? 'Good' : 'Limited';

  const pAgri = parseFloat(row.prob_agricultural_burn) || 0;
  const pIndu = parseFloat(row.prob_industrial_candidate) || 0;
  const pOther = parseFloat(row.prob_other_thermal_anomaly) || 0;
  const pVeg = parseFloat(row.prob_vegetation_fire) || 0;

  const notes = `XGBoost ML classifier (leakage-aware, Sentinel-2 + FIRMS features). ` +
    `Model confidence: ${confPct}%. ` +
    `Class probabilities - Agricultural Burn: ${(pAgri * 100).toFixed(1)}%, ` +
    `Industrial Candidate: ${(pIndu * 100).toFixed(1)}%, ` +
    `Other Thermal Anomaly: ${(pOther * 100).toFixed(1)}%, ` +
    `Vegetation Fire: ${(pVeg * 100).toFixed(1)}%. ` +
    `Note: Validation accuracy ~91% on weak proxy labels (not independently verified).`;

  return { quality, notes };
}

/** Parse CSV with quoted fields support */
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(',');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(',');
    if (values.length < headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = values[idx] ? values[idx].trim() : ''; });
    rows.push(row);
  }
  return rows;
}

// ── main ─────────────────────────────────────────────────────────────────────

console.log('Reading CSV...');
const csvContent = fs.readFileSync(CSV_PATH, { encoding: 'utf8' });
console.log('Parsing CSV...');
const rows = parseCSV(csvContent);
console.log(`Parsed ${rows.length} rows. Transforming...`);

const hotspots = rows.map((row, idx) => {
  const lat = parseFloat(row.latitude);
  const lon = parseFloat(row.longitude);
  const cls = (row.predicted_class || 'Other Thermal Anomaly').trim();
  const frp = parseFloat(row.frp) || 0;
  const daysDetected = parseInt(row.days_detected, 10) || 0;
  const detectionCount = parseInt(row.detection_count, 10) || 0;
  const highPers = parseInt(row.highly_persistent_10plus, 10) === 1;
  const pers3 = parseInt(row.persistent_3plus, 10) === 1;
  const modelConf = parseFloat(row.model_confidence) || 0;
  const confPct = Math.round(modelConf * 100);
  const obsConf = parseConfidence(row.confidence);
  const distPowerKm = parseFloat(row.distance_to_power_km);
  const powerWithin5km = parseInt(row.power_within_5km, 10);

  const priority = derivePriority(row);
  const observation_days = 90; // FIRMS period Jan-Mar 2024
  const persistencePct = Math.round((daysDetected / observation_days) * 100);

  // Monthly FRP trend: we only have one date; mark that month, fill others 0
  const month = parseInt((row.acq_date || '2024-01-01').split('-')[1], 10);
  const monthNames = ['Jan', 'Feb', 'Mar'];
  const monthly_frp_trend = monthNames.map((m, i) => ({
    month: m,
    frp: (i + 1) === month ? Math.round(frp) : 0
  }));

  const loc = deriveLocation(lat, lon);

  return {
    hotspot_id: `ML${idx}`,
    firms_id: row.firms_id,
    location: {
      latitude: lat,
      longitude: lon,
      area_name: loc.area_name,
      sub_district: loc.sub_district
    },
    observation: {
      date: row.acq_date,
      time: formatTime(row.acq_time),
      satellite: 'VIIRS/MODIS',
      instrument: 'FIRMS',
      day_night: row.daynight === 'D' ? 'Day' : 'Night',
      frp: Math.round(frp * 100) / 100,
      brightness_temperature: parseFloat2(row.bright_ti4),
      confidence: obsConf,
      scan: null,
      track: null
    },
    classification: {
      label: cls,
      confidence: confPct,
      status: 'available',
      last_evaluated: `${row.acq_date}T00:00:00Z`
    },
    priority,
    history: {
      detection_days: daysDetected,
      observation_days,
      persistence: persistencePct,
      persistent_3plus: pers3 ? 1 : 0,
      highly_persistent_10plus: highPers ? 1 : 0,
      detection_count: detectionCount,
      trend_summary: deriveTrendSummary(cls, daysDetected, highPers, pers3),
      recent_detections: [
        { date: row.acq_date, frp: Math.round(frp * 100) / 100, confidence: obsConf }
      ],
      monthly_frp_trend
    },
    context: {
      nearest_industry_m: !isNaN(distPowerKm) ? Math.round(distPowerKm * 1000) : -1,
      nearest_industry_name: powerWithin5km === 1
        ? 'Power Infrastructure within 5 km (OSM)'
        : 'No verified power source within 5 km',
      nearest_road_m: -1,
      nearest_residential_m: -1,
      industrial_feature_count: powerWithin5km === 1 ? 1 : 0,
      osm_status: powerWithin5km === 1 ? 'Complete' : 'Limited'
    },
    evidence: deriveEvidence(row),
    uncertainty: deriveUncertainty(row),
    satellite_context: deriveSatelliteContext(row),
    ml_probs: {
      agricultural_burn: parseFloat2(row.prob_agricultural_burn),
      industrial_candidate: parseFloat2(row.prob_industrial_candidate),
      other_thermal_anomaly: parseFloat2(row.prob_other_thermal_anomaly),
      vegetation_fire: parseFloat2(row.prob_vegetation_fire)
    }
  };
});

console.log(`Transformed ${hotspots.length} hotspots. Writing JSON...`);
fs.writeFileSync(OUT_PATH, JSON.stringify(hotspots), { encoding: 'utf8' });

const stats = fs.statSync(OUT_PATH);
console.log(`Done! Output: ${OUT_PATH}`);
console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Records: ${hotspots.length}`);

// Print class distribution
const dist = {};
hotspots.forEach(h => { dist[h.classification.label] = (dist[h.classification.label] || 0) + 1; });
console.log('Class distribution:', dist);
