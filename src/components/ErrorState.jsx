import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorState({ 
  title = "Unable to load hotspot information", 
  message = "A problem occurred while retrieving spatial data or satellite observations. Please check your connectivity and try again.",
  onRetry 
}) {
  return (
    <div 
      className="gis-card" 
      style={{ 
        textAlign: 'center', 
        padding: '3rem 1.5rem',
        borderLeft: '4px solid var(--priority-critical)' 
      }}
      role="alert"
    >
      <AlertCircle size={40} color="var(--priority-critical)" style={{ margin: '0 auto 0.75rem' }} />
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
        {message}
      </p>
      {onRetry && (
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={onRetry}
        >
          <RotateCcw size={14} />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}
