import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading thermal anomaly data..." }) {
  return (
    <div 
      className="gis-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        gap: '0.75rem'
      }}
      role="status"
      aria-live="polite"
    >
      <Loader2 size={36} color="var(--brand-navy)" className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        {message}
      </span>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Accessing NASA FIRMS & OpenStreetMap GIS layers...
      </span>
    </div>
  );
}
