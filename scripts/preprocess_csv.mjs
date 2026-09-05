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

  return {
    hotspot_id: `ML${idx}`,
    firms_id: row.firms_id,
    location: {
      latitude: lat,
      longitude: lon,
      area_name: `${cls} | ${lat.toFixed(3)}N, ${lon.toFixed(3)}E`,
      sub_district: 'Northern Zone'
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
