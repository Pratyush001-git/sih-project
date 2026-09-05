import { Info, ShieldAlert } from 'lucide-react';

export default function AboutView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Info size={26} color="var(--brand-navy)" />
          <h1>About the System</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '1.05rem' }}>
          AI-Based Detection & Classification of Industrial Fires and Persistent Thermal Sources
        </p>
      </div>

      {/* Section 1 — The Problem */}
      <section className="gis-card">
        <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-navy)', marginBottom: '0.75rem' }}>
          1. The Problem
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Satellites equipped with thermal infrared sensors (such as NASA VIIRS and MODIS) detect thousands of unusual thermal anomalies every day. However, <strong>a thermal anomaly does not automatically mean an industrial fire</strong>.
        </p>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>
          Thermal anomalies frequently originate from normal factory furnace exhausts, metal foundries, brick kilns, agricultural crop residue burning, gas flaring, sun-heated metal structures, or sensor noise. Without contextual intelligence, monitoring authorities are overwhelmed by raw fire alerts without knowing which ones represent acute hazards or unpermitted industrial emissions.
        </p>
      </section>

      {/* Section 2 — How It Works (Pipeline Diagram) */}
      <section className="gis-card">
        <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-navy)', marginBottom: '0.75rem' }}>
          2. How It Works (The 7-Step Pipeline)
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          ThermalWatch GIS integrates thermal observations with spatial context, multi-temporal persistence, and high-resolution environmental indices:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { step: "1", title: "NASA FIRMS Thermal Hotspot Detection", desc: "Ingests real-time NRT dual-band thermal infrared radiance from VIIRS (375m) and MODIS (1km) sensors." },
            { step: "2", title: "OpenStreetMap Spatial Context", desc: "Calculates buffer distances to nearby industrial zoning polygons, factories, primary roads, and residential settlement perimeters." },
            { step: "3", title: "Multi-Temporal Historical Persistence", desc: "Computes recurrence percentage across 90-day multi-satellite orbital passes to distinguish transient burns from operational facilities." },
            { step: "4", title: "Sentinel-2 Multi-Spectral Context", desc: "Derives 10m NDVI (vegetation), NDBI (impervious built-up surfaces), and NDWI (moisture) indices while screening for cloud occlusion." },
            { step: "5", title: "Machine Learning Classification", desc: "Evaluates anomaly feature vectors to classify the source (Industrial Fire, Industrial Thermal Source, Agricultural, or Unknown)." },
            { step: "6", title: "Risk & Priority Scoring", desc: "Calculates an actionable priority score (0-100) weighting energy output, recurrence, and residential population proximity." },
            { step: "7", title: "Decision-Support & Ground Action", desc: "Provides monitoring officers and field inspectors with an auditable evidence dossier and dispatch investigation roster." }
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand-navy)', color: 'white', fontWeight: 700, fontSize: '0.8125rem' }}>
                {item.step}
              </span>
              <div>
                <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{item.title}</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Data Sources */}
      <section className="gis-card">
        <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-navy)', marginBottom: '0.75rem' }}>
          3. Core Data Sources
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--brand-navy)' }}>NASA FIRMS</strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Near Real-Time Active Fire / Thermal Anomaly data from Suomi-NPP VIIRS, NOAA-20 VIIRS, and Terra/Aqua MODIS.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--brand-navy)' }}>OpenStreetMap (OSM)</strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Crowdsourced and validated geospatial vector layers for land use, industrial clusters, factories, and human settlements.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--brand-navy)' }}>ESA Sentinel-2</strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Multi-spectral 10m-20m optical imagery used to assess surface imperviousness (NDBI), vegetation vigor (NDVI), and burn scarring.
            </p>
          </div>

          <div style={{ border: '1px solid var(--border-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--brand-navy)' }}>Landsat 8/9</strong>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Thermal Infrared Sensor (TIRS) cross-validation and historical surface temperature baselines.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — Important Limitation Disclaimer */}
      <section className="gis-card" style={{ borderLeft: '5px solid #dc2626' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <ShieldAlert size={28} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <h2 style={{ fontSize: '1.125rem', color: '#dc2626', marginBottom: '0.35rem' }}>
              4. Important Operational Limitations
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>This is a satellite-assisted decision-support and prioritization system.</strong> It does not replace ground verification, municipal fire services, official emergency response mechanisms (e.g. 112), or official statutory inspections.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
              Spatial proximity to an industrial facility denotes geographic association, not confirmed legal causality. All classifications are probabilistic decision-support outputs accompanied by explicit data completeness ratings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
