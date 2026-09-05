export default function Footer({ setCurrentTab }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--brand-navy)' }}>
              SIH SH26162 — ThermalWatch GIS
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Satellite-assisted industrial thermal anomaly and persistence monitoring
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Data Sources: NASA FIRMS (VIIRS / MODIS) &bull; OpenStreetMap (OSM) &bull; ESA Sentinel-2
            </div>
          </div>

          <div className="footer-links">
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Dashboard
            </button>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('explorer')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Explore Hotspots
            </button>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('investigations')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Investigation Queue
            </button>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('history')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              History
            </button>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('about')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              About
            </button>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('faq')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              FAQ
            </button>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <button 
              type="button" 
              className="btn-link footer-link" 
              onClick={() => setCurrentTab('privacy')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Privacy & Security
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
          <div>
            <strong>Operational Notice:</strong> This system is for decision support and prioritization. It does not replace official verification or emergency response systems.
          </div>
          <div>
            &copy; 2026 SIH Project Team SH26162. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
