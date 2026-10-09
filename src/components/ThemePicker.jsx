import { useState } from 'react';
import { Palette, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemePicker.css';

export default function ThemePicker() {
  const { themeId, setThemeId, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="tp-wrap">
      <button
        className="tp-trigger"
        onClick={() => setOpen(o => !o)}
        title="Change app theme"
        aria-label="Theme picker"
      >
        <Palette size={17} />
        <span className="tp-trigger-label">Theme</span>
      </button>

      {open && (
        <>
          <div className="tp-backdrop" onClick={() => setOpen(false)} />
          <div className="tp-panel">
            <div className="tp-panel-head">
              <span>Choose Theme</span>
              <button className="tp-close" onClick={() => setOpen(false)}><X size={15} /></button>
            </div>
            <div className="tp-grid">
              {themes.map(t => (
                <button
                  key={t.id}
                  className={`tp-card ${themeId === t.id ? 'tp-card--active' : ''}`}
                  onClick={() => { setThemeId(t.id); setOpen(false); }}
                  title={t.name}
                >
                  {/* Mini preview of sidebar + content */}
                  <div className="tp-preview">
                    <div className="tp-preview-sidebar" style={{ background: t.preview[0], borderRight: t.id === 'white' ? '1px solid #e2e8f0' : 'none' }}>
                      <div className="tp-ps-bar" style={{ background: t.preview[1] }} />
                      <div className="tp-ps-bar tp-ps-bar--short" style={{ background: t.preview[2], opacity: 0.6 }} />
                      <div className="tp-ps-bar tp-ps-bar--short" style={{ background: t.preview[2], opacity: 0.35 }} />
                    </div>
                    <div className="tp-preview-content">
                      <div className="tp-pc-header" style={{ background: t.id === 'white' ? '#f8fafc' : '#fff' }} />
                      <div className="tp-pc-card" />
                      <div className="tp-pc-pill" style={{ background: t.preview[1] }} />
                    </div>
                  </div>
                  <div className="tp-meta">
                    <span className="tp-emoji">{t.emoji}</span>
                    <span className="tp-name">{t.name}</span>
                    {themeId === t.id && <Check size={13} className="tp-check" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="tp-hint">Theme is saved automatically across sessions.</p>
          </div>
        </>
      )}
    </div>
  );
}
