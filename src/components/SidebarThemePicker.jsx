import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './SidebarThemePicker.css';

export default function SidebarThemePicker({ collapsed }) {
  const { themeId, setThemeId, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const current = themes.find(t => t.id === themeId) || themes[0];

  return (
    <div className={`stp-wrap ${collapsed ? 'stp-wrap--collapsed' : ''}`}>
      {/* Trigger row */}
      {collapsed ? (
        /* Collapsed: just the palette icon */
        <button
          className="stp-icon-btn"
          onClick={() => setOpen(o => !o)}
          title="Change theme"
        >
          <Palette size={18} />
        </button>
      ) : (
        /* Expanded: full row showing current theme */
        <button
          className="stp-trigger-row"
          onClick={() => setOpen(o => !o)}
          title="Change theme"
        >
          <div className="stp-swatch-row">
            {current.preview.map((c, i) => (
              <span key={i} className="stp-swatch" style={{ background: c, border: current.id === 'white' && i === 0 ? '1px solid #cbd5e1' : 'none' }} />
            ))}
          </div>
          <span className="stp-label">
            {current.emoji} {current.name}
          </span>
          <Palette size={14} className="stp-icon" />
        </button>
      )}

      {/* Popup panel — always floats to the right of the sidebar */}
      {open && (
        <>
          <div className="stp-backdrop" onClick={() => setOpen(false)} />
          <div className="stp-panel">
            <div className="stp-panel-head">
              <Palette size={14} />
              <span>App Theme</span>
            </div>
            <div className="stp-grid">
              {themes.map(t => (
                <button
                  key={t.id}
                  className={`stp-card ${themeId === t.id ? 'stp-card--active' : ''}`}
                  onClick={() => { setThemeId(t.id); setOpen(false); }}
                  title={t.name}
                >
                  {/* Mini sidebar+content preview */}
                  <div className="stp-preview">
                    <div
                      className="stp-preview-sb"
                      style={{
                        background: t.preview[0],
                        borderRight: t.id === 'white' ? '1px solid #e2e8f0' : 'none'
                      }}
                    >
                      <div className="stp-sb-bar" style={{ background: t.preview[1] }} />
                      <div className="stp-sb-bar stp-sb-bar--s" style={{ background: t.preview[2], opacity: 0.6 }} />
                      <div className="stp-sb-bar stp-sb-bar--s" style={{ background: t.preview[2], opacity: 0.35 }} />
                      <div className="stp-sb-bar stp-sb-bar--s" style={{ background: t.preview[2], opacity: 0.2 }} />
                    </div>
                    <div className="stp-preview-content">
                      <div className="stp-pc-hdr" style={{ background: t.id === 'white' ? '#f8fafc' : '#fff' }} />
                      <div className="stp-pc-card" />
                      <div className="stp-pc-pill" style={{ background: t.preview[1] }} />
                    </div>
                    {themeId === t.id && (
                      <div className="stp-active-badge">
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                  <div className="stp-card-label">
                    <span className="stp-emoji">{t.emoji}</span>
                    <span className="stp-name">{t.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="stp-hint">Saved automatically</p>
          </div>
        </>
      )}
    </div>
  );
}
