import { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  BookmarkCheck, 
  History, 
  Info, 
  HelpCircle, 
  Menu, 
  X,
  ArrowRightLeft
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  investigationCount,
  onOpenCompare
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header-bar">
      <div className="header-inner">
        <div 
          className="brand-section" 
          onClick={() => handleNavClick('dashboard')} 
          style={{ cursor: 'pointer' }}
          role="button"
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('dashboard')}
        >
          <div>
            <div className="brand-title">
              <Flame size={20} color="#dc2626" />
              <span>ThermalWatch GIS</span>
            </div>
            <span className="brand-subtitle">
              AI & Satellite Industrial Anomaly Decision Support
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <button 
                type="button"
                className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <MapPin size={16} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-link ${currentTab === 'explorer' ? 'active' : ''}`}
                onClick={() => handleNavClick('explorer')}
              >
                <span>Explore Hotspots</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-link ${currentTab === 'investigations' ? 'active' : ''}`}
                onClick={() => handleNavClick('investigations')}
              >
                <BookmarkCheck size={16} />
                <span>Investigation List</span>
                {investigationCount > 0 && (
                  <span className="badge-count" title={`${investigationCount} marked hotspots`}>
                    {investigationCount}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-link ${currentTab === 'history' ? 'active' : ''}`}
                onClick={() => handleNavClick('history')}
              >
                <History size={16} />
                <span>History</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-link ${currentTab === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                <Info size={16} />
                <span>About</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`nav-link ${currentTab === 'faq' ? 'active' : ''}`}
                onClick={() => handleNavClick('faq')}
              >
                <HelpCircle size={16} />
                <span>FAQ</span>
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={onOpenCompare}
                title="Compare two anomalies side-by-side"
                style={{ marginLeft: '0.35rem' }}
              >
                <ArrowRightLeft size={14} />
                <span>Compare</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button 
          type="button"
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer open">
          <button 
            type="button"
            className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <MapPin size={18} />
            <span>Dashboard</span>
          </button>
          <button 
            type="button"
            className={`nav-link ${currentTab === 'explorer' ? 'active' : ''}`}
            onClick={() => handleNavClick('explorer')}
          >
            <span>Explore Hotspots</span>
          </button>
          <button 
            type="button"
            className={`nav-link ${currentTab === 'investigations' ? 'active' : ''}`}
            onClick={() => handleNavClick('investigations')}
          >
            <BookmarkCheck size={18} />
            <span>Investigation List{investigationCount > 0 ? ` (${investigationCount})` : ''}</span>
          </button>
          <button 
            type="button"
            className={`nav-link ${currentTab === 'history' ? 'active' : ''}`}
            onClick={() => handleNavClick('history')}
          >
            <History size={18} />
            <span>History & Persistence</span>
          </button>
          <button 
            type="button"
            className={`nav-link ${currentTab === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            <Info size={18} />
            <span>About the System</span>
          </button>
          <button 
            type="button"
            className={`nav-link ${currentTab === 'faq' ? 'active' : ''}`}
            onClick={() => handleNavClick('faq')}
          >
            <HelpCircle size={18} />
            <span>FAQ (12 Key Answers)</span>
          </button>
          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => { setMobileMenuOpen(false); onOpenCompare(); }}
              style={{ width: '100%' }}
            >
              <ArrowRightLeft size={14} />
              <span>Compare Anomalies</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
