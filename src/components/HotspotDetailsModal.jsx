import { useState } from 'react';
import { 
  X, 
  Flame, 
  Satellite, 
  Factory, 
  Repeat, 
  TrendingUp, 
  AlertTriangle, 
  HelpCircle, 
  Bookmark, 
  Check, 
  Download, 
  Printer, 
  CloudRain, 
  Eye, 
  Layers,
  Info
} from 'lucide-react';

export default function HotspotDetailsModal({
  hotspot,
  onClose,
  isInvestigating,
  onToggleInvestigation
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [spectralMode, setSpectralMode] = useState('rgb');

  if (!hotspot) return null;

  // Simple CSV export for this specific hotspot
  const handleExportCSV = () => {
    const headers = [
      'Hotspot_ID', 'Latitude', 'Longitude', 'Date', 'Time', 'Satellite', 'Instrument',
      'FRP_MW', 'Brightness_Temp_K', 'Confidence_Pct', 'Nearest_Industry_m',
      'Nearest_Road_m', 'Nearest_Residential_m', 'Persistence_Pct',
      'Classification', 'Classification_Confidence', 'Priority_Level', 'Priority_Score'
    ];

    const row = [
      hotspot.hotspot_id,
      hotspot.location.latitude,
      hotspot.location.longitude,
      hotspot.observation.date,
      hotspot.observation.time,
      hotspot.observation.satellite,
      hotspot.observation.instrument,
      hotspot.observation.frp,
      hotspot.observation.brightness_temperature,
      hotspot.observation.confidence,
      hotspot.context.nearest_industry_m,
      hotspot.context.nearest_road_m,
      hotspot.context.nearest_residential_m,
      hotspot.history.persistence,
      `"${hotspot.classification.label}"`,
      hotspot.classification.confidence,
      hotspot.priority.level,
      hotspot.priority.score
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SH26162_Hotspot_${hotspot.hotspot_id}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="details-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 id="modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Hotspot #{hotspot.hotspot_id}
              </h2>
              <span className={`status-pill ${hotspot.priority.level.toLowerCase()}`}>
                {hotspot.priority.level} PRIORITY
              </span>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {hotspot.location.area_name}, {hotspot.location.sub_district}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              aria-label="Back to Map"
            >
              <X size={18} />
              <span>Back to Map</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="drawer-content">
          {/* Quick Action Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${isInvestigating ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onToggleInvestigation(hotspot.hotspot_id)}
              >
                {isInvestigating ? <Check size={16} /> : <Bookmark size={16} />}
                <span>{isInvestigating ? "Marked for Investigation" : "Mark for Investigation"}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleExportCSV}
                title="Export Hotspot Data CSV"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handlePrint}
                title="Print Official Decision-Support Dossier"
              >
                <Printer size={14} />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Core Classification & Priority Overview Banner (Section 14) */}
          <div className="gis-card" style={{ borderLeft: `5px solid ${hotspot.priority.level === 'CRITICAL' ? '#dc2626' : hotspot.priority.level === 'HIGH' ? '#ea580c' : '#d97706'}` }}>
            <div className="details-metrics-row">
              <div className="detail-metric-box">
                <div className="detail-metric-label">Classification</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  {hotspot.classification.label}
                </div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Confidence: {hotspot.classification.confidence}%
                </span>
              </div>

              <div className="detail-metric-box">
                <div className="detail-metric-label">Persistence</div>
                <div className="detail-metric-value">{hotspot.history.persistence}%</div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {hotspot.history.detection_days} of {hotspot.history.observation_days} days
                </span>
              </div>

              <div className="detail-metric-box">
                <div className="detail-metric-label">Priority Score</div>
                <div className="detail-metric-value" style={{ color: hotspot.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
                  {hotspot.priority.score} / 100
                </div>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Level: {hotspot.priority.level}
                </span>
              </div>
            </div>
          </div>

          {/* Section 15: Basic NASA FIRMS Observation Information */}
          <section>
            <h3 className="drawer-section-title">
              <Satellite size={18} color="var(--brand-navy)" />
              <span>NASA FIRMS Thermal Observation</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="detail-metric-box" style={{ textAlign: 'left', padding: '0.65rem' }}>
                <span className="detail-metric-label" style={{ justifyContent: 'flex-start' }}>Date & Time</span>
                <strong>{hotspot.observation.date}</strong>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{hotspot.observation.time}</div>
              </div>
              <div className="detail-metric-box" style={{ textAlign: 'left', padding: '0.65rem' }}>
                <span className="detail-metric-label" style={{ justifyContent: 'flex-start' }}>Coordinates</span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{hotspot.location.latitude.toFixed(4)}°N</strong>
                <div className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {hotspot.location.longitude.toFixed(4)}°E
                </div>
              </div>
              <div className="detail-metric-box" style={{ textAlign: 'left', padding: '0.65rem' }}>
                <span className="detail-metric-label" style={{ justifyContent: 'flex-start' }}>Sensor Platform</span>
                <strong>{hotspot.observation.satellite}</strong>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Inst: {hotspot.observation.instrument} ({hotspot.observation.day_night})</div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}
            >
              {showTechnicalDetails ? "Hide Technical Details" : "Show Technical Details (Scan/Track/Sensor Geometry)"}
            </button>

            {showTechnicalDetails && (
              <div className="gis-card" style={{ background: '#f8fafc', fontSize: '0.8125rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  <div><strong>Scan Angle:</strong> {hotspot.observation.scan} km</div>
                  <div><strong>Track Resolution:</strong> {hotspot.observation.track} km</div>
                  <div><strong>Version:</strong> FIRMS VIIRS Collection 2.1</div>
                  <div><strong>Processing:</strong> NRT (Near Real-Time) Vector Ingestion</div>
                </div>
              </div>
            )}
          </section>

          {/* Section 16: Thermal Information & Explanatory Tooltips */}
          <section>
            <h3 className="drawer-section-title">
              <Flame size={18} color="#dc2626" />
              <span>Thermal Signal Metrics</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="detail-metric-box">
                <div className="detail-metric-label">
                  <span>Fire Radiative Power (FRP)</span>
                  <button 
                    type="button" 
                    className="help-tooltip-btn"
                    onClick={() => setActiveTooltip(activeTooltip === 'frp' ? null : 'frp')}
                    aria-label="What is FRP?"
                  >
                    ?
                  </button>
                </div>
                <div className="detail-metric-value">{hotspot.observation.frp} <small style={{ fontSize: '0.75rem' }}>MW</small></div>
              </div>

              <div className="detail-metric-box">
                <div className="detail-metric-label">
                  <span>Brightness Temp</span>
                  <button 
                    type="button" 
                    className="help-tooltip-btn"
                    onClick={() => setActiveTooltip(activeTooltip === 'brightness' ? null : 'brightness')}
                    aria-label="What is Brightness Temperature?"
                  >
                    ?
                  </button>
                </div>
                <div className="detail-metric-value">{hotspot.observation.brightness_temperature} <small style={{ fontSize: '0.75rem' }}>K</small></div>
              </div>

              <div className="detail-metric-box">
                <div className="detail-metric-label">Detection Confidence</div>
                <div className="detail-metric-value">{hotspot.observation.confidence}%</div>
              </div>
            </div>

            {/* Helper Tooltip Cards adhering to Section 16 */}
            {activeTooltip === 'frp' && (
              <div className="gis-alert gis-alert-info" style={{ marginBottom: '0.75rem' }}>
                <HelpCircle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Fire Radiative Power (FRP):</strong> FRP represents the estimated rate of radiative energy release in Megawatts (MW). It is an indicator of thermal intensity and should <em>not</em> be interpreted as exact physical fire size or exact danger level.
                </div>
              </div>
            )}

            {activeTooltip === 'brightness' && (
              <div className="gis-alert gis-alert-info" style={{ marginBottom: '0.75rem' }}>
                <HelpCircle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Brightness Temperature (Kelvin):</strong> Equivalent blackbody temperature radiating from the sub-pixel thermal emitter measured in the sensor's mid-infrared channel (e.g. VIIRS I4 3.74 µm).
                </div>
              </div>
            )}
          </section>

          {/* Section 17: OpenStreetMap Geographic Context (Strict Non-Causality Wording) */}
          <section>
            <h3 className="drawer-section-title">
              <Factory size={18} color="var(--brand-navy)" />
              <span>OpenStreetMap Spatial & Geographic Context</span>
            </h3>

            <div className="gis-card" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Industrial Facility:</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-navy)' }}>
                    {hotspot.context.nearest_industry_m} meters
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {hotspot.context.nearest_industry_name}
                  </div>
                </div>

                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Transport Road:</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {hotspot.context.nearest_road_m} meters
                  </div>
                </div>

                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Nearest Residential Area:</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {hotspot.context.nearest_residential_m} meters
                  </div>
                </div>

                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Facilities within 500m:</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {hotspot.context.industrial_feature_count} units
                  </div>
                </div>
              </div>

              {/* Section 17 Non-Causal Disclaimer */}
              <div className="gis-alert gis-alert-uncertainty" style={{ marginTop: '0.85rem' }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Geospatial Notice:</strong> Industrial facility detected nearby in OpenStreetMap vector data. Note: Spatial proximity indicates geographic context and does not prove causality or origin of the anomaly.
                </span>
              </div>
            </div>
          </section>

          {/* Section 18: Persistence Section */}
          <section>
            <h3 className="drawer-section-title">
              <Repeat size={18} color="var(--priority-medium)" />
              <span>Temporal Persistence Metric</span>
            </h3>

            <div className="gis-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {hotspot.history.persistence}%
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    ({hotspot.history.detection_days} detection days out of {hotspot.history.observation_days} observation passes)
                  </span>
                </div>
                <span className={`status-pill ${hotspot.history.persistence >= 25 ? 'high' : hotspot.history.persistence >= 10 ? 'medium' : 'low'}`}>
                  {hotspot.history.persistence >= 25 ? 'Persistent Source' : hotspot.history.persistence >= 10 ? 'Intermittent' : 'Transient / Isolated'}
                </span>
              </div>

              {/* Persistence Timeline Bar */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Observation Timeline Window (Recent 90-Day Satellite Passes):
              </div>
              <div className="timeline-strip" role="img" aria-label="Timeline of thermal detections">
                {Array.from({ length: 30 }).map((_, i) => {
                  const isHit = i % Math.max(1, Math.round(30 / (hotspot.history.detection_days || 1))) === 0;
                  return (
                    <div
                      key={i}
                      className={`timeline-cell ${isHit ? 'detected' : ''}`}
                      data-tooltip={`Day ${i * 3 + 1}: ${isHit ? 'Thermal Anomaly Detected' : 'No Anomaly'}`}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Day 1 (90 days ago)</span>
                <span>Day 45</span>
                <span>Day 90 (Today)</span>
              </div>
            </div>
          </section>

          {/* Section 19: Historical Activity Chart */}
          <section>
            <h3 className="drawer-section-title">
              <TrendingUp size={18} color="var(--brand-blue)" />
              <span>Historical Activity & FRP Trend</span>
            </h3>

            <div className="gis-card">
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {hotspot.history.trend_summary}
              </p>

              {/* Lightweight SVG FRP Bar / Line Chart */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-strong)' }}>
                  {hotspot.history.monthly_frp_trend.map((point, idx) => {
                    const maxFrp = 100;
                    const heightPct = Math.min(100, Math.max(8, (point.frp / maxFrp) * 100));
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--brand-navy)', marginBottom: '4px' }}>
                          {point.frp}M
                        </span>
                        <div
                          style={{
                            width: '100%',
                            maxWidth: '36px',
                            height: `${heightPct}%`,
                            backgroundColor: point.frp > 50 ? '#dc2626' : point.frp > 30 ? '#ea580c' : '#3b82f6',
                            borderRadius: '3px 3px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          {point.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  <span>Monthly Average Fire Radiative Power (MW)</span>
                  <span>NASA FIRMS Archive</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 20: Satellite Environmental Context & Cloud Handling */}
          <section>
            <h3 className="drawer-section-title">
              <Eye size={18} color="var(--brand-navy)" />
              <span>Sentinel-2 Satellite Environmental Context</span>
            </h3>

            {hotspot.satellite_context.status === 'cloudy' ? (
              /* Cloud Handling State strictly meeting Section 20 & 41 */
              <div className="gis-alert gis-alert-warning" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <CloudRain size={20} />
                  <span>Satellite Image Unavailable</span>
                </div>
                <div>
                  <strong>Reason:</strong> Cloudy conditions / insufficient valid surface reflectance pixels (Cloud cover: {hotspot.satellite_context.cloud_cover_pct}%).
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350f' }}>
                  The system did not invent, impute or derive missing optical spectral indices. Anomaly classification relies on thermal dual-band FIRMS observations and OSM spatial tags.
                </div>
              </div>
            ) : (
              <div className="gis-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="detail-metric-box">
                    <div className="detail-metric-label">NDVI (Vegetation)</div>
                    <div className="detail-metric-value">{hotspot.satellite_context.ndvi}</div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {hotspot.satellite_context.ndvi > 0.4 ? 'Dense Veg' : 'Low / Built-up'}
                    </span>
                  </div>

                  <div className="detail-metric-box">
                    <div className="detail-metric-label">NDBI (Built-up)</div>
                    <div className="detail-metric-value">{hotspot.satellite_context.ndbi}</div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {hotspot.satellite_context.ndbi > 0.3 ? 'High Impervious' : 'Normal'}
                    </span>
                  </div>

                  <div className="detail-metric-box">
                    <div className="detail-metric-label">NDWI (Water/Moisture)</div>
                    <div className="detail-metric-value">{hotspot.satellite_context.ndwi}</div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Dry substrate</span>
                  </div>
                </div>

                {/* Interactive Sentinel-2 Spectral Composite Preview */}
                <div style={{ marginTop: '0.85rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Sentinel-2 10m Multi-Spectral Crop:
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[
                        { id: 'rgb', label: 'True Color (RGB)' },
                        { id: 'infrared', label: 'False-Color IR' },
                        { id: 'swir', label: 'SWIR Thermal' }
                      ].map(b => (
                        <button
                          key={b.id}
                          type="button"
                          className={`filter-chip ${spectralMode === b.id ? 'selected' : ''}`}
                          onClick={() => setSpectralMode(b.id)}
                          style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Spectral Grid Canvas */}
                  <div style={{
                    height: '140px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: spectralMode === 'infrared' 
                      ? 'linear-gradient(135deg, #b91c1c 0%, #1e293b 50%, #0f172a 100%)'
                      : spectralMode === 'swir'
                      ? 'linear-gradient(135deg, #0284c7 0%, #0f172a 60%, #ea580c 100%)'
                      : 'linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)'
                  }}>
                    {/* Simulated urban/industrial grid lines */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    {/* Thermal Hotspot Emitter Reticle */}
                    <div style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: spectralMode === 'swir' ? '#ea580c' : '#dc2626',
                        border: '2px solid #ffffff',
                        boxShadow: '0 0 16px 6px rgba(234, 88, 12, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }}></div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.9)', marginTop: '4px' }}>
                        Anomaly Center #{hotspot.hotspot_id}
                      </span>
                    </div>

                    <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', zIndex: 3 }}>
                      ESA Sentinel-2 MSI &bull; 10m Ground Sample Dist
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginTop: '0.75rem' }}>
                  <strong>Sentinel-2 Environmental Assessment:</strong> {hotspot.satellite_context.land_description}
                  <div className="text-sm" style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Observed: {hotspot.satellite_context.observation_date} | Cloud Occlusion: {hotspot.satellite_context.cloud_cover_pct}%
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 21 & 22: Model Integration Boundary Placeholder */}
          <section>
            <h3 className="drawer-section-title">
              <Layers size={18} color="var(--brand-navy)" />
              <span>Machine Learning Model Interface</span>
            </h3>

            <div className="gis-card" style={{ background: '#f8fafc', borderStyle: 'dashed' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Decoupled Inference Contract
                  </div>
                  <strong style={{ fontSize: '1rem', color: 'var(--brand-navy)' }}>
                    {hotspot.classification.label}
                  </strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="status-pill low" style={{ fontSize: '0.7rem' }}>Status: Connected</span>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Confidence: {hotspot.classification.confidence}%
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem' }}>
                <code>{`{ classification: "${hotspot.classification.label}", confidence: ${hotspot.classification.confidence}, status: "available" }`}</code>
              </div>
            </div>
          </section>

          {/* Section 23 & 24: Priority Score & Evidence Explanation */}
          <section>
            <h3 className="drawer-section-title">
              <AlertTriangle size={18} color={hotspot.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c'} />
              <span>Priority & Evidence Rationale</span>
            </h3>

            <div className="gis-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Calculated Priority Score:</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: hotspot.priority.level === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
                    {hotspot.priority.score} / 100
                  </div>
                </div>
                <div className={`status-pill ${hotspot.priority.level.toLowerCase()}`} style={{ fontSize: '0.875rem' }}>
                  {hotspot.priority.level} PRIORITY
                </div>
              </div>

              {/* Why this location was prioritized */}
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.875rem' }}>Why is this location prioritized?</strong>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {hotspot.priority.why.map((reason, idx) => (
                    <li key={idx} style={{ marginBottom: '0.2rem' }}>{reason}</li>
                  ))}
                </ul>
              </div>

              {/* Evidence Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Thermal Signal</div>
                  <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.thermal}</strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Persistence</div>
                  <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.persistence}</strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Industrial Prox.</div>
                  <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.industrial_proximity}</strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Settlement Prox.</div>
                  <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.residential_proximity}</strong>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence</div>
                  <strong style={{ fontSize: '0.8125rem' }}>{hotspot.evidence.confidence}</strong>
                </div>
              </div>

              {/* Mandatory Section 23 Disclaimer */}
              <div className="gis-alert gis-alert-warning" style={{ marginTop: '0.85rem' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Important Disclaimer:</strong> Priority score is a project-defined prioritization score used to schedule inspection order. It is NOT a mathematical probability of danger.
                </span>
              </div>
            </div>
          </section>

          {/* Section 25: Explicit Uncertainty Reporting */}
          <section>
            <h3 className="drawer-section-title">
              <HelpCircle size={18} color="var(--text-muted)" />
              <span>Uncertainty & Data Completeness</span>
            </h3>

            <div className="gis-card" style={{ background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="text-sm">Evidence Quality:</span>
                <span className={`status-pill ${hotspot.uncertainty.quality === 'Good' ? 'low' : 'medium'}`}>
                  {hotspot.uncertainty.quality} Quality
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {hotspot.uncertainty.notes}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
