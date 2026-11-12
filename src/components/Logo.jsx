import { useState } from 'react';
import logoImg from '../assets/nexasphere-logo-icon.jpg';

export default function Logo({ size = 36, showText = true, className = '', textLight = false }) {
  const [imgError, setImgError] = useState(false);

  // Fallback path in case bundler URL fails
  const baseUrl = import.meta.env.BASE_URL || '/';
  const fallbackSrc = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}nexasphere-logo-icon.jpg`;

  return (
    <div className={`nexasphere-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>

      {/* NexaSphere sphere-network icon */}
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 0 16px rgba(0,180,216,0.55), 0 2px 8px rgba(0,0,0,0.35)',
        border: '1.5px solid rgba(0,180,216,0.4)',
        background: '#0a1228',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {!imgError ? (
          <img
            src={logoImg || fallbackSrc}
            alt="NexaSphere"
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <svg
            width={size * 0.72}
            height={size * 0.72}
            viewBox="0 0 24 24"
            fill="none"
            style={{ display: 'block' }}
          >
            <circle cx="12" cy="12" r="10" stroke="#00b4d8" strokeWidth="1.8" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" stroke="#38bdf8" strokeWidth="1.4" opacity="0.85" />
            <path d="M2 12h20" stroke="#0ea5e9" strokeWidth="1.4" opacity="0.85" />
            <circle cx="12" cy="12" r="2.8" fill="#00b4d8" />
            <circle cx="6" cy="9" r="1.2" fill="#38bdf8" />
            <circle cx="18" cy="15" r="1.2" fill="#38bdf8" />
          </svg>
        )}
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontSize: size * 0.46,
            fontWeight: 800,
            letterSpacing: '-0.4px',
            color: textLight ? '#ffffff' : '#0f172a',
            fontFamily: 'Inter, sans-serif',
          }}>
            Nexa<span style={{ color: '#00b4d8' }}>Sphere</span>
          </span>
          <span style={{
            fontSize: Math.max(9, size * 0.24),
            fontWeight: 600,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: textLight ? '#7dd3ea' : '#475569',
            fontFamily: 'Inter, sans-serif',
          }}>
            Enterprise Workforce Platform
          </span>
        </div>
      )}
    </div>
  );
}
