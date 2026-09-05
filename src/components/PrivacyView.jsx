import { ShieldCheck, Lock, EyeOff, FileCheck } from 'lucide-react';

export default function PrivacyView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '950px', margin: '0 auto' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={26} color="var(--brand-navy)" />
          <h1>Security & Privacy Architecture</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '1rem' }}>
          Strict security controls and privacy safeguards adhering to specifications Sections 43–53.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {/* Zero Client Secrets */}
        <div className="gis-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Lock size={18} color="var(--brand-navy)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Zero Frontend Secrets</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            No API secrets, satellite credentials, or database keys are bundled in client-side JavaScript. All FIRMS and Sentinel-2 connections utilize backend proxy routing with isolated environment variables.
          </p>
        </div>

        {/* Input Validation & XSS Defense */}
        <div className="gis-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <FileCheck size={18} color="var(--priority-low)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Strict Input Validation & XSS</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            All user inputs (coordinates bounded to <code>[-90, 90]</code> and <code>[-180, 180]</code>, date ISO strings, search queries) undergo sanitization and escape checks. No raw unchecked HTML injection is permitted.
          </p>
        </div>

        {/* Data Privacy & Minimal Footprint */}
        <div className="gis-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <EyeOff size={18} color="var(--brand-blue)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Zero Personal Tracking</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            The platform collects no telemetry or invasive user identifiers. Investigation queues are stored client-side in the officer's browser <code>localStorage</code>, eliminating unauthorized tracking.
          </p>
        </div>
      </div>

      {/* Production Deployment Security Standards */}
      <section className="gis-card">
        <h2 style={{ fontSize: '1.125rem', color: 'var(--brand-navy)', marginBottom: '0.75rem' }}>
          Production Security Configuration Standards (Sections 43–52)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong>43.1 HTTPS Enforcement:</strong> Production instances operate exclusively over TLS/HTTPS with HSTS headers enabled. Plain HTTP connections are permanently rejected.
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong>49 Rate Limiting:</strong> Geospatial tile queries, keyword search queries, and CSV exports are throttled at the ingress gateway to protect compute infrastructure against abusive volumetric requests.
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong>51 Privacy-Preserving Logging:</strong> System telemetry logs technical execution metrics (e.g. tile response times, FIRMS ingest timestamps, error codes) while omitting personal or credential strings.
          </div>

          <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <strong>52 Security Headers:</strong> Configured with <code>Content-Security-Policy</code>, <code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy: strict-origin-when-cross-origin</code>, and <code>Permissions-Policy</code>.
          </div>
        </div>
      </section>
    </div>
  );
}
