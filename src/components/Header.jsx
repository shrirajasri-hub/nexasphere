import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, Search, ChevronDown, Calendar,
  User, LogOut, Settings, HelpCircle, Shield, CheckCircle2
} from 'lucide-react';
import './Header.css';

const PAGE_TITLES = {
  '/dashboard':          { title: 'Dashboard',       sub: "NexaSphere Enterprise Operations & Self-Service Overview" },
  '/employees':          { title: 'Employees',        sub: 'Manage your global workforce' },
  '/attendance':         { title: 'Attendance',       sub: 'Check in/out, monthly calendar and daily log' },
  '/leave':              { title: 'Leave Management', sub: 'Submit leave requests, voice dictation & approvals' },
  '/projects':           { title: 'Projects & Milestones', sub: 'Portfolio view, milestone roadmap, and team delivery tracker' },
  '/tasks':              { title: 'Tasks Board',            sub: 'Kanban workflow, subtask checklists, and progress notes' },
  '/timesheets':         { title: 'Timesheets',       sub: 'Review and approve project timesheets' },
  '/reports':            { title: 'Reports & MIS',    sub: 'Executive analytics and workforce insights' },
  '/masters/employees':  { title: 'Employee Master',  sub: 'Add, view and manage enterprise employee records' },
  '/masters/departments':{ title: 'Department Master',sub: 'Manage departments and organizational hierarchy' },
  '/profile':            { title: 'Employee Profile', sub: 'Employee personal dossier, organization hierarchy & self-service' },
};

const ROLES_LIST = [
  {
    role: 'admin',
    name: 'Sarah Jenkins',
    email: 'admin@nexasphere.io',
    dept: 'Executive Board',
    empId: 'ADM-0001',
    designation: 'Platform Super Admin',
    user: 'Sarah Jenkins',
    title: 'Super Admin',
    badge: '👑 Role: Super Admin',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe'
  },
  {
    role: 'supervisor',
    name: 'Vikram Malhotra',
    email: 'vikram.m@nexasphere.io',
    dept: 'Engineering & Technology',
    empId: 'EMP-1002',
    designation: 'VP Technology & Team Supervisor',
    user: 'Vikram Malhotra',
    title: 'Team Supervisor',
    badge: '🛡️ Role: Supervisor',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0'
  },
  {
    role: 'employee',
    name: 'Priya Sundaram',
    email: 'priya.s@nexasphere.io',
    dept: 'Design & UX',
    empId: 'EMP-2041',
    designation: 'Senior Product Designer',
    user: 'Priya Sundaram',
    title: 'Employee Portal',
    badge: '👤 Role: Employee',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a'
  },
  {
    role: 'hr',
    name: 'Priya Patel',
    email: 'priya.patel@nexasphere.io',
    dept: 'Human Resources',
    empId: 'EMP00102',
    designation: 'HR Executive',
    user: 'Priya Patel',
    title: 'HR Operations',
    badge: '👥 Role: HR Ops',
    color: '#0d9488',
    bg: '#f0fdfa',
    border: '#99f6e4'
  }
];

export default function Header({ onToggleSidebar, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const [authData, setAuthData] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_auth');
      return saved ? JSON.parse(saved) : {
        role: 'employee',
        name: 'Priya Sundaram',
        email: 'priya.s@nexasphere.io',
        dept: 'Design & UX',
        empId: 'EMP-2041',
        designation: 'Senior Product Designer'
      };
    } catch {
      return {
        role: 'employee',
        name: 'Priya Sundaram',
        email: 'priya.s@nexasphere.io',
        dept: 'Design & UX',
        empId: 'EMP-2041'
      };
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem('nexa_auth');
        if (saved) setAuthData(JSON.parse(saved));
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

  const currentRoleMeta = ROLES_LIST.find(r => r.role === authData?.role) || ROLES_LIST[0];

  const handleSelectRole = (r) => {
    const newRole = {
      role: r.role,
      name: r.name,
      email: r.email,
      dept: r.dept,
      empId: r.empId,
      designation: r.designation,
      user: r.name
    };
    localStorage.setItem('nexa_auth', JSON.stringify(newRole));
    setAuthData(newRole);
    setRoleMenuOpen(false);
    window.dispatchEvent(new Event('nexa_role_change'));
  };

  const handleSignOut = () => {
    localStorage.removeItem('nexa_auth');
    setProfileOpen(false);
    navigate('/login');
  };

  const page = PAGE_TITLES[location.pathname] || { title: 'NexaSphere', sub: 'Enterprise Workforce Platform' };

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <header className={`header ${collapsed ? 'header--collapsed' : ''}`}>
      {/* Left */}
      <div className="header__left">
        <button className="header__toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div className="header__page-info">
          <h1 className="header__title">{page.title}</h1>
          <p className="header__sub">{page.sub}</p>
        </div>
      </div>

      {/* Right */}
      <div className="header__right">
        {/* Search */}
        <div className="header__search">
          <Search size={14} className="header__search-icon" />
          <input placeholder="Search employees, projects, masters..." className="header__search-input" />
        </div>

        {/* 1-Click Multi-Role Switcher Pill */}
        <div className="header__role-wrap" style={{ position: 'relative' }}>
          <button
            className="header__pill"
            onClick={() => { setRoleMenuOpen(o => !o); setProfileOpen(false); setNotiOpen(false); }}
            title="Click to switch active role (Admin, Supervisor, Employee, HR)"
            style={{
              cursor: 'pointer',
              background: currentRoleMeta.bg,
              border: `1.5px solid ${currentRoleMeta.color}`,
              color: currentRoleMeta.color,
              fontWeight: 700,
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <span>{currentRoleMeta.badge}</span>
            <span style={{
              fontSize: 10,
              background: 'rgba(0,0,0,0.06)',
              padding: '2px 6px',
              borderRadius: 4,
              fontWeight: 800
            }}>
              ⇄ Switch
            </span>
          </button>

          {roleMenuOpen && (
            <div className="header__dropdown" style={{ minWidth: 260, padding: '8px 0', right: 0 }}>
              <div style={{ padding: '8px 14px 6px', borderBottom: '1px solid var(--gray-200)', fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Switch Active Role
              </div>
              {ROLES_LIST.map((r) => {
                const isActive = authData?.role === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isActive ? 'var(--gray-50)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? 'var(--gray-50)' : 'transparent'; }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.badge}</span>
                        {isActive && (
                          <span style={{ fontSize: 9.5, background: '#10b981', color: '#fff', padding: '1px 5px', borderRadius: 10, fontWeight: 700 }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-800)', fontWeight: 600, marginTop: 2 }}>{r.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--gray-500)' }}>{r.designation}</div>
                    </div>
                    {isActive && <CheckCircle2 size={16} color="#10b981" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Date */}
        <button className="header__pill header__pill--ghost">
          <Calendar size={14} />
          <span>{today}</span>
        </button>

        {/* Notifications */}
        <div className="header__notif-wrap">
          <button
            className="header__icon-btn"
            onClick={() => { setNotiOpen(o => !o); setProfileOpen(false); }}
          >
            <Bell size={18} />
            <span className="header__notif-dot">5</span>
          </button>
          {notiOpen && (
            <div className="header__dropdown header__notif-panel">
              <div className="header__dropdown-head">
                <span>Notifications</span>
                <button className="header__mark-read">Mark all read</button>
              </div>
              {[
                { icon: '🕐', msg: 'Timesheet pending approval', time: '10:30 AM', dot: 'blue' },
                { icon: '📅', msg: 'Leave request awaiting approval', time: '09:15 AM', dot: 'orange' },
                { icon: '⚠️', msg: 'Task overdue: Dashboard UI', time: 'Yesterday', dot: 'red' },
                { icon: '✅', msg: 'New employee record created', time: '24 Sep', dot: 'green' },
              ].map((n, i) => (
                <div key={i} className="header__notif-item">
                  <span className="header__notif-icon">{n.icon}</span>
                  <div>
                    <p className="header__notif-msg">{n.msg}</p>
                    <span className="header__notif-time">{n.time}</span>
                  </div>
                  <span className={`header__notif-dot-sm header__notif-dot-sm--${n.dot}`} />
                </div>
              ))}
              <div className="header__dropdown-foot">View all notifications →</div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="header__profile-wrap">
          <button
            className="header__profile"
            onClick={() => { setProfileOpen(o => !o); setNotiOpen(false); }}
          >
            <div className="header__avatar" style={{ background: currentRoleMeta.color }}>
              {(authData?.name || 'User').split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="header__profile-info">
              <span className="header__profile-name">{authData?.name || 'User'}</span>
              <span className="header__profile-role">{currentRoleMeta.title}</span>
            </div>
            <ChevronDown size={12} />
          </button>
          {profileOpen && (
            <div className="header__dropdown header__profile-menu">
              <div className="header__dropdown-head">
                <div className="header__avatar header__avatar--lg" style={{ background: currentRoleMeta.color }}>
                  {(authData?.name || 'User').split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{authData?.name || 'User'}</p>
                  <p style={{ fontSize: 11, color: 'var(--gray-500)' }}>{authData?.email || 'user@nexasphere.io'}</p>
                  <p style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 600, marginTop: 2 }}>{authData?.empId || 'EMP'} · {authData?.dept || 'Operations'}</p>
                </div>
              </div>
              {[
                { icon: User,     label: 'My Profile', onClick: () => { setProfileOpen(false); navigate('/profile'); } },
                { icon: Settings, label: 'Account Settings', onClick: () => { setProfileOpen(false); navigate('/profile'); } },
                { icon: HelpCircle, label: 'Help & Support', onClick: () => { setProfileOpen(false); } },
              ].map(({ icon: Icon, label, onClick }) => (
                <button key={label} className="header__menu-item" onClick={onClick}>
                  <Icon size={14} /> {label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: 4 }} />
              <button className="header__menu-item" onClick={() => { setProfileOpen(false); setRoleMenuOpen(true); }}>
                <Shield size={14} /> Switch Active Role ({currentRoleMeta.title})
              </button>
              <button className="header__menu-item header__menu-item--danger" onClick={handleSignOut}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
