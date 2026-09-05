import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PROJECT_FAQS } from '../data/hotspots';

export default function FAQ() {
  const [openIds, setOpenIds] = useState([1, 2]);

  const toggleQuestion = (id) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenIds(PROJECT_FAQS.map(f => f.id));
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <HelpCircle size={26} color="var(--brand-navy)" />
            <h1>Frequently Asked Questions</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Authoritative explanations on system methodologies, FIRMS thermal physics, and spatial uncertainty.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={expandAll}
          >
            Expand All
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={collapseAll}
          >
            Collapse All
          </button>
        </div>
      </div>

      <div role="region" aria-label="FAQ Accordion">
        {PROJECT_FAQS.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div key={faq.id} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleQuestion(faq.id)}
                aria-expanded={isOpen}
              >
                <span>
                  <strong>FAQ {faq.id}:</strong> {faq.question}
                </span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {isOpen && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
