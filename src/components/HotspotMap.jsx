import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, RotateCcw } from 'lucide-react';
import { STUDY_AREA_CENTER, STUDY_AREA_ZOOM, INDUSTRIAL_CLUSTERS } from '../data/mockHotspots';

export default function HotspotMap({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const industrialLayerRef = useRef(null);
  const roadsBufferLayerRef = useRef(null);
  const residentialBufferLayerRef = useRef(null);

  // Layer toggles
  const [layers, setLayers] = useState({
    hotspots: true,
    industrial: true,
    roads: false,
    residential: false
  });

  // Priority color lookup
  const getPriorityColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#dc2626'; // Red
      case 'HIGH': return '#ea580c';     // Orange
      case 'MEDIUM': return '#d97706';   // Amber
      case 'LOW': return '#16a34a';      // Green
      default: return '#64748b';
    }
  };

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: STUDY_AREA_CENTER,
      zoom: STUDY_AREA_ZOOM,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Clean OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Create Layer Groups
    const markersGroup = L.layerGroup().addTo(map);
    const industrialGroup = L.layerGroup().addTo(map);
    const roadsGroup = L.layerGroup();
    const residentialGroup = L.layerGroup();

    markersLayerRef.current = markersGroup;
    industrialLayerRef.current = industrialGroup;
    roadsBufferLayerRef.current = roadsGroup;
    residentialBufferLayerRef.current = residentialGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Hotspot Markers when hotspots list or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    if (!layers.hotspots) return;

    hotspots.forEach((h) => {
      const color = getPriorityColor(h.priority.level);
      const isSelected = selectedHotspot && selectedHotspot.hotspot_id === h.hotspot_id;

      // Custom marker HTML
      const markerHtml = `
        <div class="custom-gis-marker" style="
          background-color: ${color};
          width: ${isSelected ? '32px' : '26px'};
          height: ${isSelected ? '32px' : '26px'};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 ${isSelected ? '3px #1e3a8a, 0 3px 8px rgba(0,0,0,0.4)' : '1px rgba(0,0,0,0.3)'};
        ">
          ${h.hotspot_id.replace('H', '')}
        </div>
      `;

      const icon = L.divIcon({
        className: 'gis-map-div-icon',
        html: markerHtml,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13]
      });

      const marker = L.marker([h.location.latitude, h.location.longitude], { icon });

      // Popup adhering to Section 13
      const popupHtml = `
        <div class="hotspot-popup-card">
          <div class="hotspot-popup-header">
            <strong style="font-size: 0.95rem; color: #0f172a;">Hotspot #${h.hotspot_id}</strong>
            <span class="status-pill ${h.priority.level.toLowerCase()}" style="font-size: 0.65rem; padding: 2px 6px;">
              ${h.priority.level}
            </span>
          </div>
          <div class="hotspot-popup-body">
            <div><strong>Class:</strong> ${h.classification.label}</div>
            <div><strong>Persistence:</strong> ${h.history.persistence}% (${h.history.detection_days}d / ${h.history.observation_days}d)</div>
            <div><strong>FRP:</strong> ${h.observation.frp} MW</div>
            <div><strong>Industry Dist:</strong> ${h.context.nearest_industry_m} m</div>
          </div>
          <button 
            id="popup-btn-${h.hotspot_id}"
            class="btn btn-primary btn-sm" 
            style="width: 100%;"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      // Handle popup open to wire click event
      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${h.hotspot_id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectHotspot(h);
            marker.closePopup();
          };
        }
      });

      // Quick click also sets selection
      marker.on('click', () => {
        onSelectHotspot(h);
      });

      marker.addTo(markersGroup);
    });
  }, [hotspots, selectedHotspot, layers.hotspots, onSelectHotspot]);

  // Update Industrial Clusters Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !industrialLayerRef.current) return;
    const group = industrialLayerRef.current;
    group.clearLayers();

    if (!layers.industrial) return;

    INDUSTRIAL_CLUSTERS.forEach((cluster) => {
      const rect = L.rectangle(cluster.bounds, {
        color: '#1e3a8a',
        weight: 1.5,
        fillColor: '#3b82f6',
        fillOpacity: 0.12,
        dashArray: '4, 4'
      });

      rect.bindTooltip(`
        <strong>${cluster.name}</strong><br/>
        <span style="font-size: 0.75rem; color: #475569;">${cluster.type}</span><br/>
        <span style="font-size: 0.7rem;">${cluster.facility_count} registered facilities</span>
      `);

      rect.addTo(group);
    });
  }, [layers.industrial]);

  // Update Roads Buffer Layer (Simulated vector overlay)
  useEffect(() => {
    if (!mapInstanceRef.current || !roadsBufferLayerRef.current) return;
    const group = roadsBufferLayerRef.current;
    group.clearLayers();

    if (layers.roads) {
      if (!mapInstanceRef.current.hasLayer(group)) {
        group.addTo(mapInstanceRef.current);
      }
      // Sample major highway transport corridor corridor lines
      const corridors = [
        [[28.70, 77.05], [28.85, 77.10]], // NH44 North corridor
        [[28.30, 76.90], [28.45, 77.05]], // Delhi-Jaipur highway
        [[28.40, 77.30], [28.60, 77.30]], // Mathura road corridor
        [[28.60, 77.30], [28.70, 77.40]]  // Delhi-Meerut expressway
      ];

      corridors.forEach(coords => {
        L.polyline(coords, {
          color: '#f59e0b',
          weight: 3,
          opacity: 0.6,
          dashArray: '6, 6'
        }).bindTooltip('Major Logistics / Transport Corridor Buffer (OSM)').addTo(group);
      });
    } else {
      if (mapInstanceRef.current.hasLayer(group)) {
        group.removeFrom(mapInstanceRef.current);
      }
    }
  }, [layers.roads]);

  // Update Residential Settlement Buffer Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !residentialBufferLayerRef.current) return;
    const group = residentialBufferLayerRef.current;
    group.clearLayers();

    if (layers.residential) {
      if (!mapInstanceRef.current.hasLayer(group)) {
        group.addTo(mapInstanceRef.current);
      }

      // Sample residential proximity circles around major urban wards
      const settlements = [
        [28.770, 77.040, 800],
        [28.525, 77.290, 600],
        [28.650, 77.340, 900],
        [28.385, 77.310, 700]
      ];

      settlements.forEach(([lat, lng, radius]) => {
        L.circle([lat, lng], {
          radius,
          color: '#8b5cf6',
          weight: 1,
          fillColor: '#c084fc',
          fillOpacity: 0.15
        }).bindTooltip('Dense Residential Settlement Buffer (OSM)').addTo(group);
      });
    } else {
      if (mapInstanceRef.current.hasLayer(group)) {
        group.removeFrom(mapInstanceRef.current);
      }
    }
  }, [layers.residential]);

  // If a hotspot is selected from the list or outside, pan to it smoothly
  useEffect(() => {
    if (selectedHotspot && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedHotspot.location.latitude, selectedHotspot.location.longitude],
        14,
        { duration: 1.2 }
      );
    }
  }, [selectedHotspot]);

  // Reset view to Delhi NCR study area
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(STUDY_AREA_CENTER, STUDY_AREA_ZOOM, { duration: 1 });
    }
  };

  return (
    <div className="map-container-wrapper">
      {/* Map Header & Layer Controls (Section 10) */}
      <div className="map-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Layers size={18} color="var(--brand-navy)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
            Interactive Thermal GIS Map
          </h2>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            OpenStreetMap + NASA FIRMS Overlay
          </span>
        </div>

        <div className="map-layer-toggles">
          <label className="filter-chip">
            <input
              type="checkbox"
              checked={layers.hotspots}
              onChange={(e) => setLayers({ ...layers, hotspots: e.target.checked })}
            />
            <span>Hotspots</span>
          </label>

          <label className="filter-chip">
            <input
              type="checkbox"
              checked={layers.industrial}
              onChange={(e) => setLayers({ ...layers, industrial: e.target.checked })}
            />
            <span>Industrial Areas</span>
          </label>

          <label className="filter-chip">
            <input
              type="checkbox"
              checked={layers.roads}
              onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
            />
            <span>Roads Buffer</span>
          </label>

          <label className="filter-chip">
            <input
              type="checkbox"
              checked={layers.residential}
              onChange={(e) => setLayers({ ...layers, residential: e.target.checked })}
            />
            <span>Residential Areas</span>
          </label>

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleResetView}
            title="Reset Map to Delhi NCR Study Area"
          >
            <RotateCcw size={14} />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Canvas */}
      <div 
        ref={mapContainerRef} 
        className="map-viewport" 
        id="thermal-gis-map"
        tabIndex={0}
        aria-label="Leaflet GIS Map showing thermal hotspots"
      />

      {/* Map Legend Overlay */}
      <div className="map-legend-overlay">
        <div className="legend-title">Priority Legend</div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#dc2626' }}></span>
          <span>Critical Priority</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#ea580c' }}></span>
          <span>High Priority</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#d97706' }}></span>
          <span>Medium Priority</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#16a34a' }}></span>
          <span>Low Priority</span>
        </div>
        <div style={{ marginTop: '0.45rem', paddingTop: '0.45rem', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.7rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', border: '1px dashed #1e3a8a', backgroundColor: 'rgba(59,130,246,0.2)', marginRight: '4px' }}></span>
          <span>OSM Industrial Zone</span>
        </div>
      </div>
    </div>
  );
}
