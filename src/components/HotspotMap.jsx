import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Layers, RotateCcw } from 'lucide-react';
import { STUDY_AREA_CENTER, STUDY_AREA_ZOOM, INDUSTRIAL_CLUSTERS } from '../data/hotspots';

export default function HotspotMap({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot,
  searchQuery = ''
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterGroupRef = useRef(null);
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

  // Classification → color mapping (ML classes)
  const getClassColor = (label, priorityLevel) => {
    switch (priorityLevel) {
      case 'CRITICAL': return '#dc2626'; // Red
      case 'HIGH':     return '#ea580c'; // Orange
      case 'MEDIUM':   return '#d97706'; // Amber
      case 'LOW':      return '#16a34a'; // Green
      default:         return '#64748b';
    }
  };

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: STUDY_AREA_CENTER,
      zoom: STUDY_AREA_ZOOM,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Create layer groups
    const industrialGroup = L.layerGroup().addTo(map);
    const roadsGroup = L.layerGroup();
    const residentialGroup = L.layerGroup();

    industrialLayerRef.current = industrialGroup;
    roadsBufferLayerRef.current = roadsGroup;
    residentialBufferLayerRef.current = residentialGroup;

    // Create MarkerClusterGroup for performance with 31k markers
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 50,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = 'small';
        if (count > 500) sizeClass = 'large';
        else if (count > 100) sizeClass = 'medium';

        return L.divIcon({
          html: `<div class="cluster-icon cluster-icon-${sizeClass}"><span>${count > 9999 ? '9999+' : count}</span></div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      }
    }).addTo(map);

    clusterGroupRef.current = clusterGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      clusterGroupRef.current = null;
    };
  }, []);

  // Update Hotspot Markers when hotspots list or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !clusterGroupRef.current) return;
    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();

    if (!layers.hotspots || hotspots.length === 0) return;

    // Cap map rendering at 5000 markers max for browser safety
    // (filter panel should narrow this further)
    const renderList = hotspots.length > 5000 ? hotspots.slice(0, 5000) : hotspots;

    const markers = renderList.map((h) => {
      const color = getClassColor(h.classification.label, h.priority.level);
      const isSelected = selectedHotspot && selectedHotspot.hotspot_id === h.hotspot_id;

      const markerHtml = `
        <div class="custom-gis-marker" style="
          background-color: ${color};
          width: ${isSelected ? '32px' : '22px'};
          height: ${isSelected ? '32px' : '22px'};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 ${isSelected ? '3px #1e3a8a, 0 3px 8px rgba(0,0,0,0.4)' : '1px rgba(0,0,0,0.3)'};
          font-size: 9px;
          font-weight: 600;
        ">
          ${h.classification.label === 'Industrial Candidate' ? 'I' :
            h.classification.label === 'Agricultural Burn' ? 'A' :
            h.classification.label === 'Vegetation Fire' ? 'V' : 'O'}
        </div>
      `;

      const icon = L.divIcon({
        className: 'gis-map-div-icon',
        html: markerHtml,
        iconSize: [isSelected ? 32 : 22, isSelected ? 32 : 22],
        iconAnchor: [isSelected ? 16 : 11, isSelected ? 16 : 11]
      });

      const marker = L.marker([h.location.latitude, h.location.longitude], { icon });

      // Popup content
      const persistenceStr = h.history.persistent_3plus
        ? (h.history.highly_persistent_10plus ? 'Highly Persistent (≥10d)' : 'Persistent (≥3d)')
        : `${h.history.detection_days} day(s)`;

      const popupHtml = `
        <div class="hotspot-popup-card">
          <div class="hotspot-popup-header">
            <strong style="font-size: 0.9rem; color: #0f172a;">${h.hotspot_id}</strong>
            <span class="status-pill ${h.priority.level.toLowerCase()}" style="font-size: 0.65rem; padding: 2px 6px;">
              ${h.priority.level}
            </span>
          </div>
          <div class="hotspot-popup-body">
            <div><strong>Class:</strong> ${h.classification.label}</div>
            <div><strong>Confidence:</strong> ${h.classification.confidence}%</div>
            <div><strong>FRP:</strong> ${h.observation.frp} MW</div>
            <div><strong>Persistence:</strong> ${persistenceStr}</div>
            <div><strong>Date:</strong> ${h.observation.date}</div>
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

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${h.hotspot_id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectHotspot(h);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectHotspot(h);
      });

      return marker;
    });

    clusterGroup.addLayers(markers);
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

  // Roads Buffer Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !roadsBufferLayerRef.current) return;
    const group = roadsBufferLayerRef.current;
    group.clearLayers();

    if (layers.roads) {
      if (!mapInstanceRef.current.hasLayer(group)) {
        group.addTo(mapInstanceRef.current);
      }
      const corridors = [
        [[28.70, 77.05], [28.85, 77.10]],
        [[28.30, 76.90], [28.45, 77.05]],
        [[28.40, 77.30], [28.60, 77.30]],
        [[28.60, 77.30], [28.70, 77.40]]
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

  // Residential Buffer Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !residentialBufferLayerRef.current) return;
    const group = residentialBufferLayerRef.current;
    group.clearLayers();

    if (layers.residential) {
      if (!mapInstanceRef.current.hasLayer(group)) {
        group.addTo(mapInstanceRef.current);
      }

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

  // Pan to selected hotspot
  useEffect(() => {
    if (selectedHotspot && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedHotspot.location.latitude, selectedHotspot.location.longitude],
        14,
        { duration: 1.2 }
      );
    }
  }, [selectedHotspot]);

  // When an area or query is searched, focus on the map and zoom directly to that area
  const lastSearchQueryRef = useRef('');
  useEffect(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q || !mapInstanceRef.current) {
      lastSearchQueryRef.current = q;
      return;
    }
    if (q === lastSearchQueryRef.current) return;
    lastSearchQueryRef.current = q;

    // 1. Check if search query matches any known industrial cluster
    const cluster = INDUSTRIAL_CLUSTERS.find(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      q.includes(c.id.toLowerCase())
    );

    if (cluster) {
      mapInstanceRef.current.flyToBounds(cluster.bounds, {
        padding: [60, 60],
        maxZoom: 14,
        duration: 1.2
      });
      return;
    }

    // 2. Otherwise zoom to the bounding box of matching hotspots
    if (hotspots.length > 0) {
      const pts = hotspots.slice(0, 150).map(h => [h.location.latitude, h.location.longitude]);
      const bounds = L.latLngBounds(pts);
      if (bounds.isValid()) {
        mapInstanceRef.current.flyToBounds(bounds, {
          padding: [60, 60],
          maxZoom: 14,
          duration: 1.2
        });
      }
    }
  }, [searchQuery, hotspots]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(STUDY_AREA_CENTER, STUDY_AREA_ZOOM, { duration: 1 });
    }
  };

  const capNote = hotspots.length > 5000
    ? `(showing first 5,000 of ${hotspots.length.toLocaleString()} — apply filters to narrow down)`
    : '';

  return (
    <div className="map-container-wrapper">
      {/* Map Header & Layer Controls */}
      <div className="map-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Layers size={18} color="var(--brand-navy)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Thermal GIS Map</h2>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {capNote}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Layer Checkboxes */}
          <div className="map-layer-toggles">
            <label className="checkbox-label" title="Toggle ML prediction thermal anomaly markers">
              <input
                type="checkbox"
                checked={layers.hotspots}
                onChange={(e) => setLayers({ ...layers, hotspots: e.target.checked })}
              />
              <span>Hotspots ({hotspots.length})</span>
            </label>
            <label className="checkbox-label" title="Toggle OSM verified industrial cluster zones">
              <input
                type="checkbox"
                checked={layers.industrial}
                onChange={(e) => setLayers({ ...layers, industrial: e.target.checked })}
              />
              <span>OSM Industrial Zones</span>
            </label>
            <label className="checkbox-label" title="Toggle logistics transport corridor lines">
              <input
                type="checkbox"
                checked={layers.roads}
                onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
              />
              <span>Corridors</span>
            </label>
            <label className="checkbox-label" title="Toggle dense residential buffer zones">
              <input
                type="checkbox"
                checked={layers.residential}
                onChange={(e) => setLayers({ ...layers, residential: e.target.checked })}
              />
              <span>Settlements</span>
            </label>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetView}
            title="Reset map view to Northern Zone center"
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
    </div>
  );
}
