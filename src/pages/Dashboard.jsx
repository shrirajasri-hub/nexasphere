import { useState, useEffect } from 'react';
import {
  Zap, UserPlus, CheckCircle2,
  AlertTriangle, SlidersHorizontal,
  Calendar, ArrowUpRight, Plus, Clock
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import './Dashboard.css';

/* ─── Chart Data ─── */
const ATTENDANCE_LINE_DATA = [
  { name: 'Mar', present: 1050, target: 1100 },
  { name: 'Apr', present: 1120, target: 1150 },
  { name: 'May', present: 1080, target: 1150 },
  { name: 'Jun', present: 1190, target: 1200 },
  { name: 'Jul', present: 1150, target: 1200 },
  { name: 'Aug', present: 1210, target: 1220 },
  { name: 'Sep', present: 1240, target: 1250 },
];

const EMP_ATTENDANCE_DATA = [
  { name: 'Mar', present: 21, target: 22 },
  { name: 'Apr', present: 22, target: 22 },
  { name: 'May', present: 20, target: 22 },
  { name: 'Jun', present: 22, target: 22 },
  { name: 'Jul', present: 21, target: 22 },
  { name: 'Aug', present: 22, target: 22 },
  { name: 'Sep', present: 22, target: 22 },
];

const GAUGE_DATA = [
  { name: 'Present', value: 95.2, color: '#10b981' },
  { name: 'Remaining', value: 4.8, color: '#e2e8f0' },
];

const EMP_GAUGE_DATA = [
  { name: 'Present', value: 96.4, color: '#10b981' },
  { name: 'Absence/Leave', value: 3.6, color: '#e2e8f0' },
];

const DEPT_BLOCKS = [
  { name: 'Engineering', pct: '38%', count: 470, color: '#2563eb', bg: '#eff6ff' },
  { name: 'Production',  pct: '26%', count: 320, color: '#0ea5e9', bg: '#f0f9ff' },
  { name: 'Quality',     pct: '20%', count: 248, color: '#10b981', bg: '#ecfdf5' },
  { name: 'Operations',  pct: '16%', count: 202, color: '#f59e0b', bg: '#fffbeb' },
];

const PROJECT_HEALTH = [
  { name: 'Automation Line A', progress: 85, status: 'On Track', color: '#10b981', lead: 'Priya S.', avatar: 'P' },
  { name: 'Vision Inspection System', progress: 62, status: 'At Risk', color: '#f59e0b', lead: 'Arun K.', avatar: 'A' },
  { name: 'Tool Life & Calibration Tracking', progress: 38, status: 'Overdue', color: '#ef4444', lead: 'Vignesh M.', avatar: 'V' },
  { name: 'Production MIS Dashboard', progress: 74, status: 'On Track', color: '#10b981', lead: 'Meena R.', avatar: 'M' },
];

const TEAM_LEAVES = [
  { name: 'Priya Sundaram', dept: 'Design & UX', type: 'Casual Leave', date: '26 Sep – 28 Sep', typeColor: '#2563eb', avatar: 'PS' },
  { name: 'Arun Kumar', dept: 'Production', type: 'Sick Leave', date: '26 Sep', typeColor: '#ef4444', avatar: 'AK' },
  { name: 'Meena Ramesh', dept: 'Quality Assurance', type: 'Casual Leave', date: '27 Sep', typeColor: '#2563eb', avatar: 'MR' },
  { name: 'Vignesh M.', dept: 'Maintenance', type: 'Earned Leave', date: '28 Sep – 02 Oct', typeColor: '#10b981', avatar: 'VM' },
];

const RECENT_TRANSACTIONS = [
  { title: 'Biometric Log Synced', sub: '1,182 attendance records updated', time: '10 mins ago', type: 'sync', icon: CheckCircle2, color: '#10b981' },
  { title: 'Leave Request Approved', sub: 'Priya S. — Casual Leave (3 days)', time: '42 mins ago', type: 'leave', icon: Calendar, color: '#2563eb' },
  { title: 'Task Milestone Overdue', sub: 'Tool Life UI Module delayed', time: '2 hours ago', type: 'alert', icon: AlertTriangle, color: '#ef4444' },
  { title: 'New Employee Onboarded', sub: 'Suresh R. joined Operations', time: '5 hours ago', type: 'user', icon: UserPlus, color: '#0ea5e9' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_auth');
      return saved ? JSON.parse(saved) : { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041', dept: 'Design & UX' };
    } catch {
      return { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041', dept: 'Design & UX' };
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem('nexa_auth');
        if (saved) setCurrentUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    };
    window.addEventListener('nexa_role_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('nexa_role_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const isEmployee = currentUser?.role === 'employee';

  return (
    <div className="dash-v2">
      {/* ─── Top Header Bar ─── */}
      <div className="dash-v2__header">
        <div className="dash-v2__header-left">
          {/* Pill Tab Bar */}
          <div className="dash-pills-nav">
            {['Overview', 'Workforce Analytics', 'Project Health'].map(tab => (
              <button
                key={tab}
                className={`dash-pill-btn ${activeTab === tab ? 'dash-pill-btn--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="dash-v2__title-group">
            <h1 className="dash-v2__welcome">
              {isEmployee
                ? `Welcome Back, ${currentUser?.name || 'Priya Sundaram'}`
                : 'Welcome Back, Enterprise Admin'
              }
            </h1>
            <span className="dash-v2__live-badge">
              <span className="dash-v2__pulse" />
              {isEmployee
                ? `Employee Self-Service · ID: ${currentUser?.empId || 'EMP-2041'} · ${currentUser?.dept || 'Design & UX'}`
                : 'System Live · Updated 2 mins ago'
              }
            </span>
          </div>
        </div>

        <div className="dash-v2__header-actions">
          {isEmployee ? (
            <>
              <Link to="/leave?action=apply" className="dash-btn-apply-emp">
                <Plus size={15} /> Apply For Leave
              </Link>
              <button className="dash-btn-ghost" title="Today's Biometric Status">
                <Clock size={14} /> Punched In: 08:55 AM
              </button>
            </>
          ) : (
            <>
              <Link to="/leave" className="dash-btn-ghost">
                <SlidersHorizontal size={14} /> Leave Hub
              </Link>
              <button className="dash-btn-dark">
                <Zap size={15} /> Quick Action
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── Grid Row 1: Hero Card + Attendance Flow + Gauge ─── */}
      <div className="dash-grid-top">
        
        {/* Card 1: Hero Card (Employee Leave Balance OR Admin Total Workforce) */}
        {isEmployee ? (
          <div className="dash-hero-card">
            <div className="dash-hero-card__bg-pattern" />
            <div className="dash-hero-card__top">
              <div>
                <span className="dash-hero-card__chip">Employee Self-Service</span>
                <h3 className="dash-hero-card__title">My Leave Balance</h3>
              </div>
              <Link
                to="/leave?action=apply"
                className="dash-hero-card__add"
                title="Apply for Leave"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </Link>
            </div>

            <div className="dash-emp-quota-grid">
              <div className="dash-emp-quota-item">
                <div className="dash-emp-quota-val" style={{ color: '#2563eb' }}>8 <span style={{ fontSize: 11, color: '#94a3b8' }}>/ 12</span></div>
                <div className="dash-emp-quota-lbl">Casual (CL)</div>
              </div>
              <div className="dash-emp-quota-item">
                <div className="dash-emp-quota-val" style={{ color: '#ef4444' }}>5 <span style={{ fontSize: 11, color: '#94a3b8' }}>/ 7</span></div>
                <div className="dash-emp-quota-lbl">Sick (SL)</div>
              </div>
              <div className="dash-emp-quota-item">
                <div className="dash-emp-quota-val" style={{ color: '#10b981' }}>12 <span style={{ fontSize: 11, color: '#94a3b8' }}>/ 18</span></div>
                <div className="dash-emp-quota-lbl">Earned (EL)</div>
              </div>
            </div>

            <div className="dash-hero-card__footer">
              <Link to="/leave?action=apply" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                <span>★ Apply Leave (Voice & Docs)</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="dash-hero-card">
            <div className="dash-hero-card__bg-pattern" />
            <div className="dash-hero-card__top">
              <div>
                <span className="dash-hero-card__chip">Global Operations</span>
                <h3 className="dash-hero-card__title">Total Workforce</h3>
              </div>
              <button className="dash-hero-card__add" title="Add Card">+</button>
            </div>

            <div className="dash-hero-card__stat">
              <span className="dash-hero-card__num">1,240</span>
              <span className="dash-hero-card__unit">Employees</span>
            </div>

            <div className="dash-hero-card__meter">
              <div className="dash-hero-card__meter-header">
                <span>Today's Attendance Limit</span>
                <strong>1,182 / 1,240</strong>
              </div>
              <div className="dash-hero-card__bar">
                <div className="dash-hero-card__bar-fill" style={{ width: '95.3%' }} />
              </div>
            </div>

            <div className="dash-hero-card__footer">
              <span className="dash-hero-card__subtext">★ 95.3% Attendance Target Reached</span>
              <ArrowUpRight size={16} />
            </div>
          </div>
        )}

        {/* Card 2: Attendance & Workforce Flow */}
        <div className="dash-card dash-card--flow">
          <div className="dash-card__header">
            <div>
              <h3 className="dash-card__title">{isEmployee ? 'My Attendance Flow' : 'Workforce Trend'}</h3>
              <p className="dash-card__sub">{isEmployee ? 'Monthly working days vs target' : 'Monthly present vs target headcount'}</p>
            </div>
            <div className="dash-card__actions">
              <div className="dash-legend-inline">
                <span className="dash-legend-dot" style={{ background: '#2563eb' }} /> Present
                <span className="dash-legend-dot" style={{ background: '#0ea5e9' }} /> Target
              </div>
              <select className="dash-dropdown-sm">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="dash-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={isEmployee ? EMP_ATTENDANCE_DATA : ATTENDANCE_LINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="target" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Attendance Gauge Donut Widget */}
        <div className="dash-card dash-card--gauge">
          <div className="dash-card__header">
            <div>
              <h3 className="dash-card__title">{isEmployee ? 'My On-Time Rate' : 'Attendance Rate'}</h3>
              <p className="dash-card__sub">{isEmployee ? 'Shift: 09:00 AM – 06:00 PM' : 'Real-time daily ratio'}</p>
            </div>
            <span className="dash-pill-tag dash-pill-tag--green">{isEmployee ? '96.4% Good' : '+2.4% vs last mo'}</span>
          </div>

          <div className="gauge-wrap">
            <div className="gauge-chart-box">
              <ResponsiveContainer width={160} height={130}>
                <PieChart>
                  <Pie
                    data={isEmployee ? EMP_GAUGE_DATA : GAUGE_DATA}
                    cx={75}
                    cy={75}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={52}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {(isEmployee ? EMP_GAUGE_DATA : GAUGE_DATA).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="gauge-center-val">
                <span className="gauge-big-num">{isEmployee ? '96.4%' : '95.2%'}</span>
                <span className="gauge-sub">{isEmployee ? 'On Time Ratio' : 'Present Today'}</span>
              </div>
            </div>
          </div>

          <div className="gauge-footer">
            <Link to="/attendance" className="dash-link-btn">{isEmployee ? 'View Punch Logs →' : 'See Full Analytics →'}</Link>
          </div>
        </div>

      </div>

      {/* ─── Grid Row 2: Department Distribution + Project Health ─── */}
      <div className="dash-grid-mid">
        
        {/* Department Distribution (Admin) OR Employee Active Deliverables (Employee) */}
        {isEmployee ? (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h3 className="dash-card__title">My Active Projects</h3>
                <p className="dash-card__sub">Projects and tasks assigned to Priya Sundaram</p>
              </div>
              <Link to="/projects" className="dash-link-btn">View My Projects →</Link>
            </div>

            <div className="ph-list">
              <div className="ph-item">
                <div className="ph-item__left">
                  <div className="ph-item__avatar" style={{ background: '#eff6ff', color: '#2563eb' }}>VI</div>
                  <div>
                    <span className="ph-item__name">Vision Inspection System</span>
                    <span className="ph-item__lead">Sprint 4 UX Wireframes & Interactive Spec</span>
                  </div>
                </div>
                <div className="ph-item__progress-wrap">
                  <div className="ph-item__bar-bg">
                    <div className="ph-item__bar-fill" style={{ width: '85%', background: '#10b981' }} />
                  </div>
                  <span className="ph-item__pct">85%</span>
                </div>
                <span className="ph-status-tag" style={{ color: '#10b981', background: '#ecfdf5' }}>
                  On Track
                </span>
              </div>

              <div className="ph-item">
                <div className="ph-item__left">
                  <div className="ph-item__avatar" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>DS</div>
                  <div>
                    <span className="ph-item__name">Design System Tokens</span>
                    <span className="ph-item__lead">Figma to React Component Guidelines</span>
                  </div>
                </div>
                <div className="ph-item__progress-wrap">
                  <div className="ph-item__bar-bg">
                    <div className="ph-item__bar-fill" style={{ width: '95%', background: '#2563eb' }} />
                  </div>
                  <span className="ph-item__pct">95%</span>
                </div>
                <span className="ph-status-tag" style={{ color: '#2563eb', background: '#eff6ff' }}>
                  Review
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h3 className="dash-card__title">Department Distribution</h3>
                <p className="dash-card__sub">Workforce headcount ratio across key divisions</p>
              </div>
              <select className="dash-dropdown-sm">
                <option>All Divisions</option>
              </select>
            </div>

            <div className="dept-blocks-row">
              {DEPT_BLOCKS.map(d => (
                <div key={d.name} className="dept-block" style={{ background: d.bg, borderColor: `${d.color}30` }}>
                  <div className="dept-block__pct" style={{ color: d.color }}>{d.pct}</div>
                  <div className="dept-block__name">{d.name}</div>
                  <div className="dept-block__count">{d.count} Members</div>
                  <div className="dept-block__bar" style={{ background: `${d.color}25` }}>
                    <div className="dept-block__bar-fill" style={{ width: d.pct, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Health & Milestones */}
        <div className="dash-card">
          <div className="dash-card__header">
            <div>
              <h3 className="dash-card__title">Project Health Tracker</h3>
              <p className="dash-card__sub">Overall status of active client deliverables</p>
            </div>
            <Link to="/projects" className="dash-link-btn">View All Projects →</Link>
          </div>

          <div className="ph-list">
            {PROJECT_HEALTH.map(p => (
              <div key={p.name} className="ph-item">
                <div className="ph-item__left">
                  <div className="ph-item__avatar">{p.avatar}</div>
                  <div>
                    <span className="ph-item__name">{p.name}</span>
                    <span className="ph-item__lead">Lead: {p.lead}</span>
                  </div>
                </div>

                <div className="ph-item__progress-wrap">
                  <div className="ph-item__bar-bg">
                    <div className="ph-item__bar-fill" style={{ width: `${p.progress}%`, background: p.color }} />
                  </div>
                  <span className="ph-item__pct">{p.progress}%</span>
                </div>

                <span className="ph-status-tag" style={{ color: p.color, background: `${p.color}15` }}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── Grid Row 3: Team Leave Calendar + Live System Feed ─── */}
      <div className="dash-grid-bottom">
        
        {/* Team Leaves Widget (Admin) OR My Leave Requests (Employee) */}
        {isEmployee ? (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h3 className="dash-card__title">My Submitted Leave Applications</h3>
                <p className="dash-card__sub">Real-time approval workflow status</p>
              </div>
              <Link to="/leave?action=apply" className="dash-btn-apply-emp" style={{ padding: '4px 10px', fontSize: 11 }}>
                <Plus size={12} /> Apply Leave
              </Link>
            </div>

            <div className="team-leave-list">
              <div className="team-leave-row">
                <div className="team-leave-avatar" style={{ background: '#eff6ff', color: '#2563eb' }}>LR</div>
                <div className="team-leave-info">
                  <span className="team-leave-name">Sick Leave (2 Days)</span>
                  <span className="team-leave-dept">Reason: Viral throat infection & fever</span>
                </div>
                <div className="team-leave-date">
                  <Calendar size={12} /> 14 Oct – 15 Oct
                </div>
                <span className="team-leave-badge" style={{ color: '#d97706', background: '#fef3c7' }}>
                  Pending Approval
                </span>
              </div>

              <div className="team-leave-row">
                <div className="team-leave-avatar" style={{ background: '#ecfdf5', color: '#10b981' }}>LR</div>
                <div className="team-leave-info">
                  <span className="team-leave-name">Casual Leave (3 Days)</span>
                  <span className="team-leave-dept">Reason: Family wedding ceremony</span>
                </div>
                <div className="team-leave-date">
                  <Calendar size={12} /> 26 Sep – 28 Sep
                </div>
                <span className="team-leave-badge" style={{ color: '#10b981', background: '#ecfdf5' }}>
                  Approved
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h3 className="dash-card__title">Upcoming Team Leaves</h3>
                <p className="dash-card__sub">Approved & pending workforce absences</p>
              </div>
              <Link to="/leave" className="dash-link-btn">Full Calendar →</Link>
            </div>

            <div className="team-leave-list">
              {TEAM_LEAVES.map(l => (
                <div key={l.name} className="team-leave-row">
                  <div className="team-leave-avatar">{l.avatar}</div>
                  <div className="team-leave-info">
                    <span className="team-leave-name">{l.name}</span>
                    <span className="team-leave-dept">{l.dept}</span>
                  </div>
                  <div className="team-leave-date">
                    <Calendar size={12} /> {l.date}
                  </div>
                  <span className="team-leave-badge" style={{ color: l.typeColor, background: `${l.typeColor}15` }}>
                    {l.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Transactions & Notifications */}
        <div className="dash-card">
          <div className="dash-card__header">
            <div>
              <h3 className="dash-card__title">Live System Activity</h3>
              <p className="dash-card__sub">Real-time audit & notification stream</p>
            </div>
            <button className="dash-link-btn">Audit Log →</button>
          </div>

          <div className="activity-stream">
            {RECENT_TRANSACTIONS.map((t, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: `${t.color}15`, color: t.color }}>
                  <t.icon size={15} />
                </div>
                <div className="activity-body">
                  <span className="activity-title">{t.title}</span>
                  <span className="activity-sub">{t.sub}</span>
                </div>
                <span className="activity-time">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
