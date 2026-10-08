import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle2, Zap } from 'lucide-react';
import Logo from '../components/Logo';
import './Login.css';

const DEMO_ROLES = [
  {
    key: 'employee',
    title: 'Employee Portal',
    sub: 'Apply Leave & Self-Service',
    icon: '👤',
    bg: '#fef3c7',
    color: '#d97706',
    email: 'priya.s@nexasphere.io',
    name: 'Priya Sundaram',
    role: 'employee',
    empId: 'EMP-2041',
    dept: 'Design & UX',
    designation: 'Senior Product Designer'
  },
  {
    key: 'admin',
    title: 'Super Admin',
    sub: 'Executive & Organization Hub',
    icon: '👑',
    bg: '#eff6ff',
    color: '#2563eb',
    email: 'admin@nexasphere.io',
    name: 'Enterprise Admin',
    role: 'admin',
    empId: 'ADM-0001',
    dept: 'Executive Management',
    designation: 'Platform Super Admin'
  },
  {
    key: 'hr',
    title: 'HR Operations',
    sub: 'Staff, Leave & Policy Control',
    icon: '👥',
    bg: '#ecfdf5',
    color: '#10b981',
    email: 'hr.operations@nexasphere.io',
    name: 'Sarah Jenkins',
    role: 'hr',
    empId: 'HR-1002',
    dept: 'Human Resources',
    designation: 'Director of HR & People'
  },
  {
    key: 'mis',
    title: 'MIS Analyst',
    sub: 'Reports, Compliance & Logs',
    icon: '📊',
    bg: '#f5f3ff',
    color: '#8b5cf6',
    email: 'mis.analyst@nexasphere.io',
    name: 'Meena Raman',
    role: 'mis',
    empId: 'MIS-3011',
    dept: 'Operations & MIS',
    designation: 'Lead MIS Architect'
  }
];

export default function Login() {
  const [email, setEmail]       = useState('priya.s@nexasphere.io');
  const [password, setPassword] = useState('employee123');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [activeRole, setActiveRole] = useState('employee');
  const navigate = useNavigate();

  const performLogin = (roleData) => {
    setLoading(true);
    const selectedRole = roleData || DEMO_ROLES.find(r => r.key === activeRole) || DEMO_ROLES[0];
    localStorage.setItem('nexa_auth', JSON.stringify({
      user: selectedRole.name,
      role: selectedRole.role,
      name: selectedRole.name,
      email: selectedRole.email,
      empId: selectedRole.empId,
      dept: selectedRole.dept,
      designation: selectedRole.designation,
      loggedInAt: new Date().toISOString()
    }));
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matched = DEMO_ROLES.find(r => r.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      performLogin(matched);
    } else {
      const isEmp = email.toLowerCase().includes('emp') || email.toLowerCase().includes('priya');
      performLogin(isEmp ? DEMO_ROLES[0] : DEMO_ROLES[1]);
    }
  };

  const handleRoleSelect = (roleObj) => {
    setActiveRole(roleObj.key);
    setEmail(roleObj.email);
    setPassword('demo123');
    performLogin(roleObj);
  };

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <div className="login-left__inner">
          <Link to="/" className="login-brand">
            <Logo size={36} showText={true} textLight={true} />
          </Link>

          <div className="login-left__content">
            <h2 className="login-left__heading">
              Enterprise Workforce<br />
              <span className="login-left__gradient">& Employee Portal</span>
            </h2>
            <p className="login-left__sub">
              Access your personal leave balances, submit voice-dictated requests,
              track biometric shifts, and view project deliverables.
            </p>

            <div className="login-features">
              {[
                { icon: '📅', text: 'Smart Leave Self-Service & Voice Mic Dictation' },
                { icon: '⏱️', text: 'Real-time biometric attendance & shift hours' },
                { icon: '📁', text: 'Personal deliverables & project tracking' },
                { icon: '🔒', text: 'Role-based access control & tenant isolation' },
              ].map((f, i) => (
                <div key={i} className="login-feature-item">
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="login-left__footer">
            <CheckCircle2 size={14} className="login-left__footer-icon" />
            <span>ISO 27001 · GDPR Ready · 99.9% Uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="login-right">
        <div className="login-form-wrap">
          {/* Mobile brand */}
          <div className="login-brand login-brand--mobile">
            <Logo size={32} showText={true} />
          </div>

          <div className="login-form-header">
            <h1 className="login-form-title">Welcome to NexaSphere</h1>
            <p className="login-form-sub">Select your role or enter credentials to continue</p>
          </div>

          {/* Quick 1-Click Role Login Selector */}
          <div className="login-quick-access">
            <div className="login-quick-head">
              <span className="login-quick-badge">
                <Zap size={13} /> 1-CLICK INSTANT LOGIN AS:
              </span>
              <span className="login-quick-hint">Click below to enter the portal immediately:</span>
            </div>
            <div className="login-roles-grid">
              {DEMO_ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className={`login-role-btn ${activeRole === r.key ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(r)}
                  disabled={loading}
                >
                  <div className="login-role-icon" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
                  <div className="login-role-info">
                    <strong>{r.title}</strong>
                    <span>{r.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="email">Work Email</label>
              <div className="login-input-wrap">
                <Mail size={16} className="login-input-icon" />
                <input
                  id="email"
                  type="text"
                  className="login-input"
                  placeholder="priya.s@nexasphere.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label" htmlFor="password">Password</label>
                <button type="button" className="login-forgot">Forgot password?</button>
              </div>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className="login-input login-input--pw"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPw(p => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="login-remember">
              <input type="checkbox" className="login-checkbox" defaultChecked />
              <span>Keep me signed in for 30 days</span>
            </label>

            {/* Submit Button */}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading
                ? <span className="login-spinner" />
                : <><span>Sign In to NexaSphere</span><ArrowRight size={16} /></>
              }
            </button>

            {/* Direct Dashboard Link */}
            <button
              type="button"
              className="login-direct-btn"
              onClick={() => performLogin(DEMO_ROLES[0])}
              disabled={loading}
            >
              <Zap size={14} /> 1-Click Direct Access as Employee (Priya Sundaram) →
            </button>

            {/* Divider */}
            <div className="login-divider"><span>or continue with</span></div>

            {/* SSO options */}
            <div className="login-sso">
              <button
                type="button"
                className="login-sso-btn"
                onClick={() => performLogin(DEMO_ROLES[0])}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google SSO
              </button>
              <button
                type="button"
                className="login-sso-btn"
                onClick={() => performLogin(DEMO_ROLES[0])}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 0C5.1 0 0 5.1 0 11.4c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.2 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.7 20.7 24 16.4 24 11.4 24 5.1 18.7 0 11.4 0z"/>
                </svg>
                Microsoft AD
              </button>
            </div>
          </form>

          <div className="login-security">
            <Shield size={12} />
            <span>256-bit SSL encrypted · Enterprise security</span>
          </div>

          <div className="login-back">
            <Link to="/">← Back to NexaSphere home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
