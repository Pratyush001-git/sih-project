import { useState } from 'react';
import { Flame, Satellite, HelpCircle } from 'lucide-react';

export default function ThermalSummary({ hotspot }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!hotspot) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Basic NASA FIRMS Observation (Section 15) */}
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

        {hotspot.observation.scan != null && (
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

      {/* Thermal Signal Metrics (Section 16) */}
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
            <div className="detail-metric-value">
              {hotspot.observation.brightness_temperature != null
                ? <>{hotspot.observation.brightness_temperature} <small style={{ fontSize: '0.75rem' }}>K</small></>
                : <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>N/A</span>
              }
            </div>
          </div>

          <div className="detail-metric-box">
            <div className="detail-metric-label">Detection Confidence</div>
            <div className="detail-metric-value">{hotspot.observation.confidence}%</div>
          </div>
        </div>

        {/* Section 16 Tooltips */}
        {activeTooltip === 'frp' && (
          <div className="gis-alert gis-alert-info">
            <HelpCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Fire Radiative Power (FRP):</strong> FRP represents the estimated rate of radiative energy release in Megawatts (MW). It is an indicator of thermal intensity and should <em>not</em> be interpreted as exact physical fire size or exact danger level.
            </div>
          </div>
        )}

        {activeTooltip === 'brightness' && (
          <div className="gis-alert gis-alert-info">
            <HelpCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Brightness Temperature (Kelvin):</strong> Equivalent blackbody temperature radiating from the sub-pixel thermal emitter measured in the sensor's mid-infrared channel (e.g. VIIRS I4 3.74 µm).
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
