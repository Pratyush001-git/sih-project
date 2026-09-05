/**
 * SIH SH26162 — Thermal Data Model & Benchmarking Records
 * NASA FIRMS VIIRS & MODIS Thermal Observations with OSM & Sentinel-2 Attributes
 */

export const STUDY_AREA_CENTER = [28.6139, 77.2090]; // Delhi Center
export const STUDY_AREA_ZOOM = 11;

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

export const HOTSPOTS_DATA = [
  {
    hotspot_id: "H1024",
    location: {
      latitude: 28.7984,
      longitude: 77.0542,
      area_name: "Bawana Sector 3 Industrial Zone",
      sub_district: "North West Delhi"
    },
    observation: {
      date: "2026-03-02",
      time: "21:45 UTC",
      satellite: "NOAA-20",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 48.6,
      brightness_temperature: 342.8,
      confidence: 91,
      scan: 0.38,
      track: 0.36
    },
    context: {
      nearest_industry_m: 143,
      nearest_industry_name: "Metals & Polymers Processing Unit",
      nearest_road_m: 80,
      nearest_residential_m: 900,
      industrial_feature_count: 7,
      osm_status: "Complete"
    },
    history: {
      detection_days: 27,
      observation_days: 90,
      persistence: 30,
      trend_summary: "Repeated detections indicate that this location has shown thermal activity on multiple observation days.",
      recent_detections: [
        { date: "2026-03-02", frp: 48.6, confidence: 91 },
        { date: "2026-02-28", frp: 44.2, confidence: 89 },
        { date: "2026-02-24", frp: 52.0, confidence: 94 },
        { date: "2026-02-18", frp: 39.8, confidence: 86 },
        { date: "2026-02-11", frp: 46.1, confidence: 90 },
        { date: "2026-01-29", frp: 41.5, confidence: 87 },
        { date: "2026-01-15", frp: 49.3, confidence: 92 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 38 },
        { month: "Dec", frp: 44 },
        { month: "Jan", frp: 46 },
        { month: "Feb", frp: 47 },
        { month: "Mar", frp: 49 }
      ]
    },
    classification: {
      label: "Industrial Thermal Source",
      confidence: 91,
      status: "available",
      last_evaluated: "2026-03-03T04:12:00Z"
    },
    priority: {
      level: "HIGH",
      score: 87,
      why: [
        "Strong thermal signal (FRP: 48.6 MW, Brightness: 342.8 K)",
        "Repeated detections (30% persistence over 90 days)",
        "Close to industrial facility (143 m)",
        "Residential settlement buffer within 900 m"
      ]
    },
    evidence: {
      thermal: "HIGH",
      persistence: "HIGH",
      industrial_proximity: "HIGH",
      residential_proximity: "MEDIUM",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "OSM facility perimeter verified against land registry. Sentinel-2 cloud cover is low (3.8%). Observation conditions optimal."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 3.8,
      ndvi: 0.12,
      ndbi: 0.44,
      ndwi: -0.25,
      observation_date: "2026-03-01",
      land_description: "High impervious surface fraction with dense structural roofing typical of manufacturing units."
    }
  },
  {
    hotspot_id: "H1041",
    location: {
      latitude: 28.5321,
      longitude: 77.2798,
      area_name: "Okhla Industrial Phase II",
      sub_district: "South East Delhi"
    },
    observation: {
      date: "2026-03-03",
      time: "18:20 UTC",
      satellite: "Suomi-NPP",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 84.5,
      brightness_temperature: 368.2,
      confidence: 97,
      scan: 0.42,
      track: 0.39
    },
    context: {
      nearest_industry_m: 45,
      nearest_industry_name: "Chemical Packaging & Solvent Storage",
      nearest_road_m: 30,
      nearest_residential_m: 310,
      industrial_feature_count: 14,
      osm_status: "Complete"
    },
    history: {
      detection_days: 3,
      observation_days: 90,
      persistence: 3,
      trend_summary: "Acute sudden high-energy thermal signature with minimal historical recurrence, characteristic of sudden anomaly.",
      recent_detections: [
        { date: "2026-03-03", frp: 84.5, confidence: 97 },
        { date: "2026-03-02", frp: 72.1, confidence: 94 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 0 },
        { month: "Dec", frp: 0 },
        { month: "Jan", frp: 0 },
        { month: "Feb", frp: 5 },
        { month: "Mar", frp: 84 }
      ]
    },
    classification: {
      label: "Industrial Fire",
      confidence: 94,
      status: "available",
      last_evaluated: "2026-03-03T19:00:00Z"
    },
    priority: {
      level: "CRITICAL",
      score: 95,
      why: [
        "Extremely high Radiative Power (FRP: 84.5 MW)",
        "Sudden acute thermal anomaly without prior steady baseline",
        "Direct proximity to chemical solvent storage (45 m)",
        "Severe residential proximity risk (310 m buffer)"
      ]
    },
    evidence: {
      thermal: "CRITICAL",
      persistence: "LOW",
      industrial_proximity: "CRITICAL",
      residential_proximity: "HIGH",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "High confidence VIIRS dual-band detection with zero cloud occlusion. Urgent verification recommended."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 1.2,
      ndvi: 0.08,
      ndbi: 0.52,
      ndwi: -0.31,
      observation_date: "2026-03-02",
      land_description: "Densely packed commercial and light industrial warehouses with narrow access corridors."
    }
  },
  {
    hotspot_id: "H1102",
    location: {
      latitude: 28.6642,
      longitude: 77.3510,
      area_name: "Sahibabad Site IV Industrial Area",
      sub_district: "Ghaziabad, NCR"
    },
    observation: {
      date: "2026-03-01",
      time: "20:50 UTC",
      satellite: "NOAA-20",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 52.1,
      brightness_temperature: 348.0,
      confidence: 93,
      scan: 0.36,
      track: 0.35
    },
    context: {
      nearest_industry_m: 82,
      nearest_industry_name: "Specialty Glass & Melting Furnace",
      nearest_road_m: 65,
      nearest_residential_m: 1150,
      industrial_feature_count: 11,
      osm_status: "Complete"
    },
    history: {
      detection_days: 38,
      observation_days: 90,
      persistence: 42,
      trend_summary: "Consistently recurring thermal anomaly across observation cycles representing an operational persistent source.",
      recent_detections: [
        { date: "2026-03-01", frp: 52.1, confidence: 93 },
        { date: "2026-02-26", frp: 54.0, confidence: 91 },
        { date: "2026-02-20", frp: 49.8, confidence: 89 },
        { date: "2026-02-14", frp: 51.5, confidence: 92 },
        { date: "2026-02-05", frp: 48.0, confidence: 90 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 47 },
        { month: "Dec", frp: 50 },
        { month: "Jan", frp: 52 },
        { month: "Feb", frp: 53 },
        { month: "Mar", frp: 52 }
      ]
    },
    classification: {
      label: "Industrial Thermal Source",
      confidence: 92,
      status: "available",
      last_evaluated: "2026-03-02T01:10:00Z"
    },
    priority: {
      level: "HIGH",
      score: 84,
      why: [
        "Steady high thermal persistence (42% of 90 days)",
        "Proximity to recorded high-temperature glass melting furnace",
        "Moderate residential buffer separation (> 1 km)"
      ]
    },
    evidence: {
      thermal: "HIGH",
      persistence: "HIGH",
      industrial_proximity: "HIGH",
      residential_proximity: "LOW",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "OSM attribute tags identify glass works with continuous furnace chimney stack."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 2.5,
      ndvi: 0.10,
      ndbi: 0.48,
      ndwi: -0.28,
      observation_date: "2026-02-28",
      land_description: "Industrial zoning with heavy thermal containment structures."
    }
  },
  {
    hotspot_id: "H1135",
    location: {
      latitude: 28.3762,
      longitude: 77.3245,
      area_name: "Faridabad Sector 24 Industrial Cluster",
      sub_district: "Faridabad, NCR"
    },
    observation: {
      date: "2026-03-03",
      time: "13:10 UTC",
      satellite: "Aqua",
      instrument: "MODIS",
      day_night: "Day",
      frp: 68.3,
      brightness_temperature: 355.6,
      confidence: 88,
      scan: 1.1,
      track: 1.0
    },
    context: {
      nearest_industry_m: 110,
      nearest_industry_name: "Auto-Component Forging & Heat Treatment",
      nearest_road_m: 120,
      nearest_residential_m: 480,
      industrial_feature_count: 9,
      osm_status: "Complete"
    },
    history: {
      detection_days: 6,
      observation_days: 90,
      persistence: 7,
      trend_summary: "Elevated daytime emission with sudden step increase in radiative output.",
      recent_detections: [
        { date: "2026-03-03", frp: 68.3, confidence: 88 },
        { date: "2026-03-01", frp: 42.1, confidence: 84 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 12 },
        { month: "Dec", frp: 15 },
        { month: "Jan", frp: 10 },
        { month: "Feb", frp: 22 },
        { month: "Mar", frp: 68 }
      ]
    },
    classification: {
      label: "Industrial Fire",
      confidence: 86,
      status: "available",
      last_evaluated: "2026-03-03T14:40:00Z"
    },
    priority: {
      level: "CRITICAL",
      score: 91,
      why: [
        "High daytime radiative energy spike (68.3 MW)",
        "Close to high-density residential fringe (480 m)",
        "Near industrial forging and fuel oil storage"
      ]
    },
    evidence: {
      thermal: "HIGH",
      persistence: "LOW",
      industrial_proximity: "HIGH",
      residential_proximity: "HIGH",
      confidence: "MEDIUM"
    },
    uncertainty: {
      quality: "Good",
      notes: "MODIS 1km footprint covers adjoining facility boundary; daytime solar reflection filtered."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 6.0,
      ndvi: 0.14,
      ndbi: 0.46,
      ndwi: -0.22,
      observation_date: "2026-03-02",
      land_description: "Industrial grid layout bounded by expressway corridor."
    }
  },
  {
    hotspot_id: "H1158",
    location: {
      latitude: 28.6348,
      longitude: 77.1265,
      area_name: "Mayapuri Phase II Scrap Zone",
      sub_district: "West Delhi"
    },
    observation: {
      date: "2026-03-02",
      time: "22:15 UTC",
      satellite: "NOAA-20",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 28.4,
      brightness_temperature: 326.4,
      confidence: 84,
      scan: 0.37,
      track: 0.36
    },
    context: {
      nearest_industry_m: 95,
      nearest_industry_name: "Metal Scrap Ingot Casting Workshop",
      nearest_road_m: 45,
      nearest_residential_m: 620,
      industrial_feature_count: 5,
      osm_status: "Complete"
    },
    history: {
      detection_days: 16,
      observation_days: 90,
      persistence: 18,
      trend_summary: "Intermittent nocturnal thermal detections coinciding with batch metal smelting schedules.",
      recent_detections: [
        { date: "2026-03-02", frp: 28.4, confidence: 84 },
        { date: "2026-02-22", frp: 31.0, confidence: 85 },
        { date: "2026-02-12", frp: 26.5, confidence: 82 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 24 },
        { month: "Dec", frp: 29 },
        { month: "Jan", frp: 27 },
        { month: "Feb", frp: 30 },
        { month: "Mar", frp: 28 }
      ]
    },
    classification: {
      label: "Industrial Thermal Source",
      confidence: 88,
      status: "available",
      last_evaluated: "2026-03-03T02:00:00Z"
    },
    priority: {
      level: "MEDIUM",
      score: 68,
      why: [
        "Moderate thermal signature (FRP: 28.4 MW)",
        "Recurring intermittent batch operation (18% persistence)",
        "Industrial zoning with moderate residential separation"
      ]
    },
    evidence: {
      thermal: "MEDIUM",
      persistence: "MEDIUM",
      industrial_proximity: "HIGH",
      residential_proximity: "MEDIUM",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "Consistent nocturnal readings without smoke plume spread."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 4.8,
      ndvi: 0.11,
      ndbi: 0.49,
      ndwi: -0.27,
      observation_date: "2026-02-28",
      land_description: "Densely packed metal workshops and scrapyard yards."
    }
  },
  {
    hotspot_id: "H1204",
    location: {
      latitude: 28.3540,
      longitude: 76.9360,
      area_name: "IMT Manesar Sector 8",
      sub_district: "Gurugram, NCR"
    },
    observation: {
      date: "2026-03-01",
      time: "21:10 UTC",
      satellite: "Suomi-NPP",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 22.0,
      brightness_temperature: 321.5,
      confidence: 82,
      scan: 0.40,
      track: 0.38
    },
    context: {
      nearest_industry_m: 210,
      nearest_industry_name: "Electroplating & Thermal Coating Unit",
      nearest_road_m: 90,
      nearest_residential_m: 1400,
      industrial_feature_count: 4,
      osm_status: "Complete"
    },
    history: {
      detection_days: 13,
      observation_days: 90,
      persistence: 14,
      trend_summary: "Low-to-moderate recurrence matching organized factory shift cycles.",
      recent_detections: [
        { date: "2026-03-01", frp: 22.0, confidence: 82 },
        { date: "2026-02-18", frp: 24.5, confidence: 80 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 18 },
        { month: "Dec", frp: 20 },
        { month: "Jan", frp: 21 },
        { month: "Feb", frp: 23 },
        { month: "Mar", frp: 22 }
      ]
    },
    classification: {
      label: "Industrial Thermal Source",
      confidence: 84,
      status: "available",
      last_evaluated: "2026-03-02T03:30:00Z"
    },
    priority: {
      level: "MEDIUM",
      score: 62,
      why: [
        "Stable low-intensity thermal emission",
        "Planned industrial estate with wide buffer zones",
        "Residential areas well beyond 1 km"
      ]
    },
    evidence: {
      thermal: "MEDIUM",
      persistence: "MEDIUM",
      industrial_proximity: "MEDIUM",
      residential_proximity: "LOW",
      confidence: "MEDIUM"
    },
    uncertainty: {
      quality: "Good",
      notes: "Facility complies with master plan industrial setbacks."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 1.5,
      ndvi: 0.16,
      ndbi: 0.39,
      ndwi: -0.21,
      observation_date: "2026-02-27",
      land_description: "Organized planned industrial plots with asphalt internal roads."
    }
  },
  {
    hotspot_id: "H1240",
    location: {
      latitude: 28.8415,
      longitude: 77.0920,
      area_name: "Narela Industrial Estate Fringe",
      sub_district: "North Delhi"
    },
    observation: {
      date: "2026-02-28",
      time: "19:40 UTC",
      satellite: "NOAA-20",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 14.8,
      brightness_temperature: 312.4,
      confidence: 72,
      scan: 0.35,
      track: 0.34
    },
    context: {
      nearest_industry_m: 520,
      nearest_industry_name: "Grain Warehouse & Cold Storage",
      nearest_road_m: 140,
      nearest_residential_m: 1600,
      industrial_feature_count: 2,
      osm_status: "Complete"
    },
    history: {
      detection_days: 4,
      observation_days: 90,
      persistence: 4,
      trend_summary: "Infrequent low-energy thermal observation without persistent clustering.",
      recent_detections: [
        { date: "2026-02-28", frp: 14.8, confidence: 72 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 0 },
        { month: "Dec", frp: 10 },
        { month: "Jan", frp: 0 },
        { month: "Feb", frp: 14 },
        { month: "Mar", frp: 0 }
      ]
    },
    classification: {
      label: "Other Thermal Anomaly",
      confidence: 79,
      status: "available",
      last_evaluated: "2026-03-01T08:00:00Z"
    },
    priority: {
      level: "LOW",
      score: 34,
      why: [
        "Low Radiative Power (14.8 MW)",
        "Low persistence (4% over 90 days)",
        "Over 500m away from nearest industrial facility"
      ]
    },
    evidence: {
      thermal: "LOW",
      persistence: "LOW",
      industrial_proximity: "LOW",
      residential_proximity: "LOW",
      confidence: "MEDIUM"
    },
    uncertainty: {
      quality: "Good",
      notes: "Likely low-temperature waste or utility warming flare."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 5.0,
      ndvi: 0.28,
      ndbi: 0.21,
      ndwi: -0.15,
      observation_date: "2026-02-26",
      land_description: "Peri-urban transitional land with sparse storage yards and vacant plots."
    }
  },
  {
    hotspot_id: "H1288",
    location: {
      latitude: 28.8920,
      longitude: 77.2910,
      area_name: "Khekra Rural Belt",
      sub_district: "Baghpat, NCR"
    },
    observation: {
      date: "2026-03-03",
      time: "07:30 UTC",
      satellite: "Terra",
      instrument: "MODIS",
      day_night: "Day",
      frp: 35.2,
      brightness_temperature: 331.0,
      confidence: 85,
      scan: 1.0,
      track: 1.0
    },
    context: {
      nearest_industry_m: 1850,
      nearest_industry_name: "Grain Flour Mill",
      nearest_road_m: 350,
      nearest_residential_m: 850,
      industrial_feature_count: 0,
      osm_status: "Complete"
    },
    history: {
      detection_days: 2,
      observation_days: 90,
      persistence: 2,
      trend_summary: "Isolated daytime detection in agricultural land parcel during crop harvest window.",
      recent_detections: [
        { date: "2026-03-03", frp: 35.2, confidence: 85 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 45 },
        { month: "Dec", frp: 10 },
        { month: "Jan", frp: 0 },
        { month: "Feb", frp: 5 },
        { month: "Mar", frp: 35 }
      ]
    },
    classification: {
      label: "Agricultural/Vegetation Fire",
      confidence: 93,
      status: "available",
      last_evaluated: "2026-03-03T10:00:00Z"
    },
    priority: {
      level: "LOW",
      score: 38,
      why: [
        "Located in open croplands > 1.8 km from any industrial zoning",
        "High vegetative spectral reflectance index (NDVI: 0.62)",
        "Low persistence typical of single-event field clearing"
      ]
    },
    evidence: {
      thermal: "MEDIUM",
      persistence: "LOW",
      industrial_proximity: "LOW",
      residential_proximity: "MEDIUM",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "Clear agricultural crop phenology pattern confirmed via Sentinel-2 time series."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 2.1,
      ndvi: 0.62,
      ndbi: -0.15,
      ndwi: 0.12,
      observation_date: "2026-03-02",
      land_description: "Irrigated active crop fields with high chlorophyll signature."
    }
  },
  {
    hotspot_id: "H1310",
    location: {
      latitude: 28.7018,
      longitude: 77.1685,
      area_name: "Wazirpur Industrial Area",
      sub_district: "North West Delhi"
    },
    observation: {
      date: "2026-03-02",
      time: "23:05 UTC",
      satellite: "NOAA-20",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 56.4,
      brightness_temperature: 349.8,
      confidence: 93,
      scan: 0.38,
      track: 0.36
    },
    context: {
      nearest_industry_m: 65,
      nearest_industry_name: "Stainless Steel Re-Rolling Mill & Annealing",
      nearest_road_m: 40,
      nearest_residential_m: 510,
      industrial_feature_count: 12,
      osm_status: "Complete"
    },
    history: {
      detection_days: 34,
      observation_days: 90,
      persistence: 38,
      trend_summary: "High persistence signature matching continuous steel billet reheating and furnace chimney emissions.",
      recent_detections: [
        { date: "2026-03-02", frp: 56.4, confidence: 93 },
        { date: "2026-02-25", frp: 53.1, confidence: 90 },
        { date: "2026-02-17", frp: 58.0, confidence: 94 },
        { date: "2026-02-09", frp: 51.2, confidence: 91 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 52 },
        { month: "Dec", frp: 55 },
        { month: "Jan", frp: 54 },
        { month: "Feb", frp: 56 },
        { month: "Mar", frp: 56 }
      ]
    },
    classification: {
      label: "Industrial Thermal Source",
      confidence: 93,
      status: "available",
      last_evaluated: "2026-03-03T01:30:00Z"
    },
    priority: {
      level: "HIGH",
      score: 89,
      why: [
        "Consistent high-energy thermal signature (56.4 MW)",
        "38% persistence over 90 days",
        "Directly adjacent to heavy metallurgical facility (65 m)",
        "Residential community boundary at 510 m"
      ]
    },
    evidence: {
      thermal: "HIGH",
      persistence: "HIGH",
      industrial_proximity: "HIGH",
      residential_proximity: "MEDIUM",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "Facility is registered under continuous industrial furnace roster."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 3.1,
      ndvi: 0.09,
      ndbi: 0.51,
      ndwi: -0.29,
      observation_date: "2026-03-01",
      land_description: "Extremely dense industrial zoning with high roof metallic reflectance."
    }
  },
  {
    hotspot_id: "H1345",
    location: {
      latitude: 28.6780,
      longitude: 77.0150,
      area_name: "Mundka Outer Industrial Belt",
      sub_district: "West Delhi"
    },
    observation: {
      date: "2026-03-03",
      time: "19:15 UTC",
      satellite: "Suomi-NPP",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 31.0,
      brightness_temperature: 328.0,
      confidence: 68,
      scan: 0.44,
      track: 0.41
    },
    context: {
      nearest_industry_m: 290,
      nearest_industry_name: "Unclassified Warehouse Yard",
      nearest_road_m: 160,
      nearest_residential_m: 780,
      industrial_feature_count: 3,
      osm_status: "Incomplete"
    },
    history: {
      detection_days: 8,
      observation_days: 90,
      persistence: 9,
      trend_summary: "Intermittent thermal readings with incomplete spatial vector data.",
      recent_detections: [
        { date: "2026-03-03", frp: 31.0, confidence: 68 },
        { date: "2026-02-19", frp: 29.5, confidence: 71 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 15 },
        { month: "Dec", frp: 20 },
        { month: "Jan", frp: 18 },
        { month: "Feb", frp: 25 },
        { month: "Mar", frp: 31 }
      ]
    },
    classification: {
      label: "Unknown",
      confidence: 58,
      status: "available",
      last_evaluated: "2026-03-03T20:15:00Z"
    },
    priority: {
      level: "MEDIUM",
      score: 55,
      why: [
        "Thermal detection confirmed but confidence is moderate (68%)",
        "Geographic context partially incomplete in OpenStreetMap",
        "Satellite preview obstructed by cloud cover"
      ]
    },
    evidence: {
      thermal: "MEDIUM",
      persistence: "LOW",
      industrial_proximity: "MEDIUM",
      residential_proximity: "MEDIUM",
      confidence: "LOW"
    },
    uncertainty: {
      quality: "Limited",
      notes: "OpenStreetMap coverage is incomplete for this block; industrial tagging absent. Satellite context flagged as cloudy (82% cloud occlusion). The system preserves uncertainty rather than estimating unverified values."
    },
    satellite_context: {
      status: "cloudy",
      cloud_cover_pct: 82.4,
      ndvi: null,
      ndbi: null,
      ndwi: null,
      observation_date: "2026-03-02",
      land_description: "Cloud obscured. No optical spectral indices computed to avoid false proxy derivation."
    }
  },
  {
    hotspot_id: "H1370",
    location: {
      latitude: 28.5980,
      longitude: 76.8450,
      area_name: "Jhajjar Border Brick Kiln Cluster",
      sub_district: "Jhajjar, NCR"
    },
    observation: {
      date: "2026-03-02",
      time: "21:30 UTC",
      satellite: "NOAA-20",
      instrument: "VIIRS",
      day_night: "Night",
      frp: 44.0,
      brightness_temperature: 339.4,
      confidence: 90,
      scan: 0.38,
      track: 0.36
    },
    context: {
      nearest_industry_m: 90,
      nearest_industry_name: "Bull's Trench Brick Kiln (FCBK)",
      nearest_road_m: 110,
      nearest_residential_m: 1250,
      industrial_feature_count: 8,
      osm_status: "Complete"
    },
    history: {
      detection_days: 43,
      observation_days: 90,
      persistence: 48,
      trend_summary: "High persistence seasonal operational cycle consistent with brick kiln firing season.",
      recent_detections: [
        { date: "2026-03-02", frp: 44.0, confidence: 90 },
        { date: "2026-02-27", frp: 46.2, confidence: 92 },
        { date: "2026-02-21", frp: 43.8, confidence: 89 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 10 },
        { month: "Dec", frp: 35 },
        { month: "Jan", frp: 42 },
        { month: "Feb", frp: 45 },
        { month: "Mar", frp: 44 }
      ]
    },
    classification: {
      label: "Industrial Thermal Source",
      confidence: 92,
      status: "available",
      last_evaluated: "2026-03-03T03:00:00Z"
    },
    priority: {
      level: "HIGH",
      score: 82,
      why: [
        "Very high persistence (48% detection days)",
        "Direct overlap with registered brick kiln chimney cluster",
        "Moderate separation from human settlement centers"
      ]
    },
    evidence: {
      thermal: "HIGH",
      persistence: "HIGH",
      industrial_proximity: "HIGH",
      residential_proximity: "LOW",
      confidence: "HIGH"
    },
    uncertainty: {
      quality: "Good",
      notes: "OSM cluster tag confirms active brick production cluster; circular chimney signature matched."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 4.1,
      ndvi: 0.22,
      ndbi: 0.31,
      ndwi: -0.19,
      observation_date: "2026-03-01",
      land_description: "Unpaved clay earth extraction zones and circular kiln trenches."
    }
  },
  {
    hotspot_id: "H1402",
    location: {
      latitude: 28.4890,
      longitude: 77.4980,
      area_name: "Greater Noida Ecotech Extension",
      sub_district: "Gautam Buddha Nagar, NCR"
    },
    observation: {
      date: "2026-03-01",
      time: "14:20 UTC",
      satellite: "Aqua",
      instrument: "MODIS",
      day_night: "Day",
      frp: 16.5,
      brightness_temperature: 316.0,
      confidence: 65,
      scan: 1.2,
      track: 1.1
    },
    context: {
      nearest_industry_m: 680,
      nearest_industry_name: "Logistics Warehouse Construction",
      nearest_road_m: 190,
      nearest_residential_m: 1900,
      industrial_feature_count: 1,
      osm_status: "Complete"
    },
    history: {
      detection_days: 1,
      observation_days: 90,
      persistence: 1,
      trend_summary: "Single isolated daytime anomaly associated with hot bitumen/construction works.",
      recent_detections: [
        { date: "2026-03-01", frp: 16.5, confidence: 65 }
      ],
      monthly_frp_trend: [
        { month: "Nov", frp: 0 },
        { month: "Dec", frp: 0 },
        { month: "Jan", frp: 0 },
        { month: "Feb", frp: 0 },
        { month: "Mar", frp: 16 }
      ]
    },
    classification: {
      label: "Other Thermal Anomaly",
      confidence: 76,
      status: "available",
      last_evaluated: "2026-03-01T16:00:00Z"
    },
    priority: {
      level: "LOW",
      score: 28,
      why: [
        "Isolated single-event detection (1% persistence)",
        "FRP below 20 MW",
        "Large buffer distance from active industrial and residential zones"
      ]
    },
    evidence: {
      thermal: "LOW",
      persistence: "LOW",
      industrial_proximity: "LOW",
      residential_proximity: "LOW",
      confidence: "LOW"
    },
    uncertainty: {
      quality: "Good",
      notes: "Temporary road surfacing activity recorded near expressway expansion."
    },
    satellite_context: {
      status: "available",
      cloud_cover_pct: 3.5,
      ndvi: 0.19,
      ndbi: 0.28,
      ndwi: -0.16,
      observation_date: "2026-02-28",
      land_description: "Compacted earth, road expansion corridor, and open logistics plots."
    }
  }
];

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
    answer: "Yes. The project architecture is designed around modular region-based processing. While Delhi NCR serves as the primary benchmark study area, the FIRMS and OSM ingestion pipelines scale nationally across all industrial corridors."
  }
];

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
        area_name: h.location.area_name,
        sub_district: h.location.sub_district,
        observation_date: h.observation.date,
        observation_time: h.observation.time,
        satellite: h.observation.satellite,
        instrument: h.observation.instrument,
        frp_mw: h.observation.frp,
        brightness_temp_k: h.observation.brightness_temperature,
        confidence_pct: h.observation.confidence,
        nearest_industry_m: h.context.nearest_industry_m,
        nearest_industry_name: h.context.nearest_industry_name,
        persistence_pct: h.history.persistence,
        classification_label: h.classification.label,
        classification_confidence: h.classification.confidence,
        priority_level: h.priority.level,
        priority_score: h.priority.score,
        evidence_quality: h.uncertainty.quality
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
