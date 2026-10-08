import { useState } from 'react';
import {
  Calendar, CreditCard, Users, UserCheck, BarChart2, CheckCircle2,
  ChevronRight, MoreHorizontal, MapPin, Check, Clock, UserSearch, FileText
} from 'lucide-react';
import './WorkforceHubDiagram.css';

export default function WorkforceHubDiagram() {
  const [activeCard, setActiveCard] = useState('center');

  return (
    <div className="hub-diagram-wrapper">
      <div className="hub-diagram-container">
        
        {/* SVG Curved Dotted Connector Lines with Crisp Visible Stroke & Endpoint Dots */}
        <svg className="hub-connectors-svg" viewBox="0 0 1000 660" preserveAspectRatio="none">
          {/* Top-Left (Attendance) to Center Top-Left */}
          <path
            d="M 280, 110 C 370, 110 440, 75 440, 100"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="280" cy="110" r="4.5" fill="#1e3a6e" />
          <circle cx="440" cy="100" r="4.5" fill="#1e3a6e" />

          {/* Mid-Left (Leave) to Center Middle-Left */}
          <path
            d="M 280, 330 L 360, 330"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="280" cy="330" r="4.5" fill="#1e3a6e" />
          <circle cx="360" cy="330" r="4.5" fill="#1e3a6e" />

          {/* Bottom-Left (Employee Records) to Center Bottom-Left */}
          <path
            d="M 280, 550 C 370, 550 440, 585 440, 560"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="280" cy="550" r="4.5" fill="#1e3a6e" />
          <circle cx="440" cy="560" r="4.5" fill="#1e3a6e" />

          {/* Top-Right (Reports Dashboard) to Center Top-Right */}
          <path
            d="M 720, 110 C 630, 110 560, 75 560, 100"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="720" cy="110" r="4.5" fill="#1e3a6e" />
          <circle cx="560" cy="100" r="4.5" fill="#1e3a6e" />

          {/* Mid-Right (MIS Analytics) to Center Middle-Right */}
          <path
            d="M 720, 330 L 640, 330"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="720" cy="330" r="4.5" fill="#1e3a6e" />
          <circle cx="640" cy="330" r="4.5" fill="#1e3a6e" />

          {/* Bottom-Right (Reports) to Center Bottom-Right */}
          <path
            d="M 720, 550 C 630, 550 560, 585 560, 560"
            fill="none"
            stroke="#1e3a6e"
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
          <circle cx="720" cy="550" r="4.5" fill="#1e3a6e" />
          <circle cx="560" cy="560" r="4.5" fill="#1e3a6e" />
        </svg>

        {/* ─── 3 Columns Grid Layout ─── */}
        <div className="hub-grid">
          
          {/* Left Column (3 Cards) */}
          <div className="hub-col hub-col--left">
            
            {/* Card 1: Attendance */}
            <div className="hub-card" onClick={() => setActiveCard('attendance')}>
              <div className="hub-card__head">
                <div className="hub-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162b57" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M9 16l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="hub-card__title">Attendance</h4>
                  <span className="hub-card__sub">This Month</span>
                </div>
              </div>
              <div className="hub-card__val">95%</div>
              <span className="hub-card__unit">Present</span>

              {/* Sparkline Bar Chart */}
              <div className="hub-sparkline-bars">
                {[45, 65, 95, 75, 90, 60, 95, 85].map((h, i) => (
                  <div key={i} className="hub-spark-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Card 2: Leave */}
            <div className="hub-card" onClick={() => setActiveCard('leave')}>
              <div className="hub-card__head">
                <div className="hub-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162b57" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="16" cy="16" r="3" />
                    <path d="M16 15v1.5l1 .5" />
                  </svg>
                </div>
                <div>
                  <h4 className="hub-card__title">Leave</h4>
                  <span className="hub-card__sub">Available Leave</span>
                </div>
              </div>
              <div className="hub-card__val">18.5</div>
              <span className="hub-card__unit">Days</span>

              {/* Dot Matrix Visual */}
              <div className="hub-dot-matrix">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className={`hub-matrix-dot ${i === 18 ? 'hub-matrix-dot--active' : ''}`} />
                ))}
              </div>
            </div>

            {/* Card 3: Employee Records */}
            <div className="hub-card" onClick={() => setActiveCard('employees')}>
              <div className="hub-card__head">
                <div className="hub-icon-box">
                  <Users size={22} color="#162b57" />
                </div>
                <div>
                  <h4 className="hub-card__title">Employee Records</h4>
                  <span className="hub-card__sub">Total Employees</span>
                </div>
              </div>
              <div className="hub-card__val">256</div>
              <span className="hub-card__unit">Employees</span>

              {/* Avatar Stack */}
              <div className="hub-avatar-stack">
                <div className="hub-stack-avatar" style={{ background: '#162b57' }}>P</div>
                <div className="hub-stack-avatar" style={{ background: '#2563eb' }}>A</div>
                <div className="hub-stack-avatar" style={{ background: '#0ea5e9' }}>M</div>
                <div className="hub-stack-avatar" style={{ background: '#10b981' }}>V</div>
                <div className="hub-stack-plus">+12</div>
              </div>
            </div>

          </div>

          {/* Center Column — Center Profile Card */}
          <div className="hub-col hub-col--center">
            <div className="hub-center-card">
              <div className="hub-center-card__top">
                <span className="hub-center-card__heading">Employee Overview</span>
                <button className="hub-center-card__more"><MoreHorizontal size={18} /></button>
              </div>

              <div className="hub-center-card__avatar">
                <div className="hub-avatar-img">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <circle cx="28" cy="28" r="28" fill="#e0ebf9" />
                    <circle cx="28" cy="22" r="11" fill="#162b57" />
                    <path d="M12 48 C12 36 20 34 28 34 C36 34 44 36 44 48" fill="#162b57" />
                  </svg>
                </div>
              </div>

              <h3 className="hub-center-card__name">Product Designer</h3>
              <p className="hub-center-card__dept">Design</p>
              
              <div className="hub-center-card__loc">
                <MapPin size={13} /> Bengaluru, India
              </div>

              <div className="hub-center-card__info-row">
                <div>
                  <span className="hub-info-label">Employee ID</span>
                  <span className="hub-info-val">EMP00125</span>
                </div>
                <div className="hub-info-divider" />
                <div>
                  <span className="hub-info-label">Department</span>
                  <span className="hub-info-val">Design</span>
                </div>
              </div>

              <button className="hub-center-card__link">
                View Full Profile <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Column (3 Cards) */}
          <div className="hub-col hub-col--right">
            
            {/* Card 4: Reports Dashboard */}
            <div className="hub-card" onClick={() => setActiveCard('reports-dashboard')}>
              <div className="hub-card__head">
                <div className="hub-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162b57" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </div>
                <div>
                  <h4 className="hub-card__title">Reports Dashboard</h4>
                  <span className="hub-card__sub">Workforce Analytics</span>
                </div>
              </div>
              <div className="hub-card__val">48+</div>
              <span className="hub-card__unit">Automated Reports</span>

              <div className="hub-card-badge hub-card-badge--green">
                <CheckCircle2 size={13} /> Real-Time Sync
              </div>
            </div>

            {/* Card 5: MIS Analytics */}
            <div className="hub-card" onClick={() => setActiveCard('mis-analytics')}>
              <div className="hub-card__head">
                <div className="hub-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162b57" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <path d="M4 20h16" />
                  </svg>
                </div>
                <div>
                  <h4 className="hub-card__title">MIS Analytics</h4>
                  <span className="hub-card__sub">Executive Insights</span>
                </div>
              </div>
              <div className="hub-card__val">99.4%</div>
              <span className="hub-card__unit">Compliance Accuracy</span>

              <div className="hub-card-badge hub-card-badge--green">
                <CheckCircle2 size={13} /> ISO & Audit Ready
              </div>
            </div>

            {/* Card 6: Project Deliverables */}
            <div className="hub-card" onClick={() => setActiveCard('deliverables')}>
              <div className="hub-card__head">
                <div className="hub-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162b57" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="8" y1="18" x2="8" y2="14" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="16" y1="18" x2="16" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="hub-card__title">Deliverables</h4>
                  <span className="hub-card__sub">Milestones & Tasks</span>
                </div>
              </div>
              <div className="hub-card__val">24</div>
              <span className="hub-card__unit">Active Milestones</span>

              {/* Wave Graph Graphic */}
              <div className="hub-wave-graph">
                <svg viewBox="0 0 220 45" preserveAspectRatio="none">
                  <path
                    d="M0 35 Q55 10, 110 28 T220 15 L220 45 L0 45 Z"
                    fill="url(#waveGradientBlue)"
                  />
                  <path
                    d="M0 35 Q55 10, 110 28 T220 15"
                    fill="none"
                    stroke="#162b57"
                    strokeWidth="2.5"
                  />
                  <defs>
                    <linearGradient id="waveGradientBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a6e" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#1e3a6e" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
