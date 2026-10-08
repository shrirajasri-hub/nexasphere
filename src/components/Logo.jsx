export default function Logo({ size = 36, showText = true, className = '', textLight = false }) {
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
      }}>
        <img
          src="/nexasphere-logo-icon.jpg"
          alt="NexaSphere"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
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
