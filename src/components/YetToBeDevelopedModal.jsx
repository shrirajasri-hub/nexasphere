import { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Clock } from 'lucide-react';
import './YetToBeDevelopedModal.css';

// Reusable trigger helper for any button, menu, or link
export function triggerPlannedFeatureModal(featureName = 'This Module') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('nexa_planned_feature', { detail: { feature: featureName } })
    );
  }
}

export default function YetToBeDevelopedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [featureName, setFeatureName] = useState('');

  useEffect(() => {
    const handleTrigger = (e) => {
      setFeatureName(e.detail?.feature || 'This Module');
      setIsOpen(true);
    };

    window.addEventListener('nexa_planned_feature', handleTrigger);
    return () => window.removeEventListener('nexa_planned_feature', handleTrigger);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dev-modal-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="dev-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dev-modal-title"
      >
        <button
          className="dev-modal-close"
          onClick={() => setIsOpen(false)}
          title="Close dialog"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="dev-modal-badge">
          <Clock size={13} />
          <span>Development Roadmap · Scope Control</span>
        </div>

        <div className="dev-modal-icon-wrap">
          <span className="dev-modal-icon-emoji">🚧</span>
        </div>

        <h3 id="dev-modal-title" className="dev-modal-title">
          Yet to be developed
        </h3>

        {featureName && (
          <div className="dev-modal-feature-pill">
            <span>Feature:</span> <strong>{featureName}</strong>
          </div>
        )}

        <p className="dev-modal-desc">
          This feature is planned for an upcoming development phase. Please check back later.
        </p>

        <div className="dev-modal-actions">
          <button
            type="button"
            className="dev-modal-btn-primary"
            onClick={() => setIsOpen(false)}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
