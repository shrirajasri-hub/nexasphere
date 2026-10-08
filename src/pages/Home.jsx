import { Link } from 'react-router-dom';
import {
  Zap, CheckCircle2, ArrowRight, Lock, Shield, Sparkles, Building2
} from 'lucide-react';
import Logo from '../components/Logo';
import SmartLeaveInfographic from '../components/SmartLeaveInfographic';
import WorkforceHubDiagram from '../components/WorkforceHubDiagram';
import './Home.css';

const HIGHLIGHTS = [
  'Biometric device & hardware real-time API integration',
  'Automated WhatsApp Business & Email notifications',
  'Flexible custom fields & dynamic schemas per customer',
  'Docker Compose 1-click on-premises deployment',
  'Dedicated isolated database per tenant — zero data bleed',
  'Granular RBAC security & complete audit trail',
];

const STATS = [
  { value: '500+', label: 'Enterprise Customers' },
  { value: '99.9%', label: 'Guaranteed Uptime SLA' },
  { value: '100k+', label: 'Active Workforce Users' },
  { value: '4.9★', label: 'Platform Satisfaction' },
];

export default function Home() {
  return (
    <div className="home">
      
      {/* ─── CORPORATE HERO SECTION (HIGH IMPACT DIAGONAL LAYOUT) ─── */}
      <section className="corporate-hero">
        
        {/* Left Dark Polygon Panel */}
        <div className="corp-hero__left">
          {/* Top Nav inside Left Dark Panel */}
          <div className="corp-hero__nav">
            <a href="#workforce-hub" className="corp-nav__link">WORKFORCE HUB</a>
            <a href="#leave-architecture" className="corp-nav__link">SMART LEAVE</a>
            <a href="#highlights" className="corp-nav__link">WHY NEXASPHERE</a>
          </div>

          <div className="corp-hero__content">
            <div className="corp-hero__eyebrow">
              <Sparkles size={13} /> Enterprise Workforce & Project Intelligence
            </div>

            <h1 className="corp-hero__title">
              NEXASPHERE<br />
              <span className="corp-hero__cyan-text">ENTERPRISE WORKFORCE</span><br />
              PLATFORM
            </h1>

            <p className="corp-hero__desc">
              Streamline global workforce operations, biometric attendance, leave policies, employee records,
              and project deliverables into a unified enterprise platform designed to allure stakeholders and accelerate business performance.
            </p>

            <div className="corp-hero__cta-group">
              <Link to="/login" className="corp-btn-cyan">
                Sign In <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Translucent Chevron & High-Res Image Panel */}
        <div className="corp-hero__right">
          
          {/* High-Resolution Corporate Executive Team Background */}
          <div className="corp-hero__bg-img" />

          {/* Overlapping Cyan Translucent Geometric Ribbons */}
          <div className="corp-hero__ribbon corp-hero__ribbon--1" />
          <div className="corp-hero__ribbon corp-hero__ribbon--2" />
          <div className="corp-hero__ribbon corp-hero__ribbon--3" />

          {/* Brand Logo Top Right over Image Panel */}
          <div className="corp-hero__brand-corner">
            <Logo size={36} showText={true} textLight={false} />
          </div>

          {/* Live Floating Quick Metrics Badge */}
          <div className="corp-hero__floating-badge">
            <div className="corp-badge__val">95.2%</div>
            <div className="corp-badge__label">Real-Time Attendance Rate</div>
          </div>
        </div>

      </section>

      {/* ─── Stats ─── */}
      <section className="home-stats">
        <div className="home-stats__inner">
          {STATS.map(s => (
            <div key={s.label} className="home-stat">
              <div className="home-stat__val">{s.value}</div>
              <div className="home-stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── UNIFIED WORKFORCE & PROJECT HUB DIAGRAM ─── */}
      <section className="home-section" id="workforce-hub">
        <div className="home-section__inner" style={{ maxWidth: 1100 }}>
          <div className="home-section__badge">Unified Platform Architecture</div>
          <h2 className="home-section__h2">Single Source of Truth for HR, Projects & MIS</h2>
          <p className="home-section__sub">
            Connect Attendance, Leave, Employee Records, Deliverables, Reports Dashboard & MIS Analytics into one central hub.
          </p>
          <WorkforceHubDiagram />
        </div>
      </section>

      {/* ─── SMART LEAVE INFOGRAPHIC DIAGRAM SECTION ─── */}
      <section className="home-section home-section--alt" id="leave-architecture">
        <div className="home-section__inner" style={{ maxWidth: 1240 }}>
          <div className="home-section__badge">Workforce Automation Engine</div>
          <SmartLeaveInfographic />
        </div>
      </section>

      {/* ─── Why NexaSphere (Enhanced Enterprise Showcase) ─── */}
      <section className="home-section" id="highlights">
        <div className="home-section__inner home-why">
          <div className="home-why__left">
            <div className="home-section__badge">Why NexaSphere</div>
            <h2 className="home-section__h2" style={{ textAlign: 'left' }}>
              Enterprise grade security.<br />Intuitive experience.
            </h2>
            <p className="home-section__sub" style={{ textAlign: 'left' }}>
              NexaSphere offers complete database separation per tenant, guaranteeing total security and compliance for complex multi-company environments.
            </p>
            <ul className="home-why__list">
              {HIGHLIGHTS.map(h => (
                <li key={h}>
                  <CheckCircle2 size={16} className="home-why__check" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn-primary" style={{ marginTop: 28, alignSelf: 'flex-start', display:'inline-flex', gap:8, alignItems:'center' }}>
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
          <div className="home-why__right">
            <div className="why-card-stack">
              {[
                { icon: '🔒', title: 'Isolated Database Architecture', desc: 'Each tenant gets its own dedicated DB instance — zero data bleed' },
                { icon: '🌐', title: 'Docker Native Stack', desc: 'Pre-packaged docker-compose.yml for 1-click on-prem launch' },
                { icon: '⚡', title: 'Biometric & WhatsApp API Integration', desc: 'Hardware attendance sync and automated notifications' },
                { icon: '🔧', title: 'Flexible Custom Fields', desc: 'Dynamic customer-level schemas without code changes' },
                { icon: '📊', title: 'Executive MIS Dashboards', desc: 'Comprehensive real-time tracking for attendance, leave & projects' },
              ].map((w, i) => (
                <div key={i} className="why-card" style={{ '--delay': `${i * 0.05}s` }}>
                  <span className="why-card__icon">{w.icon}</span>
                  <div>
                    <div className="why-card__title">{w.title}</div>
                    <div className="why-card__desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="home-cta">
        <div className="home-cta__inner">
          <Lock size={32} className="home-cta__icon" />
          <h2 className="home-cta__heading">Ready to scale your workforce operations?</h2>
          <p className="home-cta__sub">
            Deploy NexaSphere across your enterprise with SaaS convenience or On-Prem control.
          </p>
          <div className="home-cta__btns">
            <Link to="/login" className="btn-white">
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <Logo size={28} showText={true} textLight={true} />
          </div>
          <p className="home-footer__copy">© 2026 NexaSphere. All rights reserved. Enterprise Workforce Platform.</p>
        </div>
      </footer>
    </div>
  );
}
