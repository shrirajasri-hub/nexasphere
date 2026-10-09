import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, Search, ChevronDown, Calendar,
  User, LogOut, Settings, HelpCircle, UserCheck, Shield
} from 'lucide-react';
import './Header.css';

const PAGE_TITLES = {
  '/dashboard':          { title: 'Dashboard',       sub: "NexaSphere Enterprise Operations & Self-Service Overview" },
  '/employees':          { title: 'Employees',        sub: 'Manage your global workforce' },
  '/attendance':         { title: 'Attendance',       sub: 'Check in/out, monthly calendar and daily log' },
  '/leave':              { title: 'Leave Management', sub: 'Submit leave requests, voice dictation & approvals' },
  '/projects':           { title: 'My Projects',      sub: 'Track project milestones, tasks and progress' },
  '/tasks':              { title: 'Tasks',            sub: 'Manage and assign cross-functional team tasks' },
  '/timesheets':         { title: 'Timesheets',       sub: 'Review and approve project timesheets' },
  '/reports':            { title: 'Reports & MIS',    sub: 'Executive analytics and workforce insights' },
  '/masters/employees':  { title: 'Employee Master',  sub: 'Add, view and manage enterprise employee records' },
  '/masters/departments':{ title: 'Department Master',sub: 'Manage departments and organizational hierarchy' },
  '/profile':            { title: 'Employee Profile', sub: 'Employee personal dossier, organization hierarchy & self-service' },
};

export default function Header({ onToggleSidebar, collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

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

  const isEmployee = authData?.role === 'employee';

  const handleToggleRole = () => {
    const newRole = isEmployee ? {
      role: 'admin',
      name: 'Enterprise Admin',
      email: 'admin@nexasphere.io',
      dept: 'Executive Board',
      empId: 'ADM-0001',
      designation: 'Platform Super Admin',
      user: 'Enterprise Admin'
    } : {
      role: 'employee',
      name: 'Priya Sundaram',
      email: 'priya.s@nexasphere.io',
      dept: 'Design & UX',
      empId: 'EMP-2041',
      designation: 'Senior Product Designer',
      user: 'Priya Sundaram'
    };
    localStorage.setItem('nexa_auth', JSON.stringify(newRole));
    setAuthData(newRole);
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

        {/* 1-Click Role Switcher Pill */}
        <button
          className="header__pill"
          onClick={handleToggleRole}
          title="Click to toggle between Employee Self-Service and Admin view"
          style={{
            cursor: 'pointer',
            background: isEmployee ? '#fef3c7' : '#eff6ff',
            border: `1.5px solid ${isEmployee ? '#f59e0b' : '#3b82f6'}`,
            color: isEmployee ? '#92400e' : '#1d4ed8',
            fontWeight: 700,
            gap: 6,
            transition: 'all 0.2s ease'
          }}
        >
          {isEmployee ? <UserCheck size={14} /> : <Shield size={14} />}
          <span>{isEmployee ? '👤 Role: Employee' : '👑 Role: Super Admin'}</span>
          <span style={{
            fontSize: 10,
            background: isEmployee ? '#fde68a' : '#dbeafe',
            padding: '2px 5px',
            borderRadius: 4,
            fontWeight: 800
          }}>
            ⇄ Switch
          </span>
        </button>

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
            <div className="header__avatar" style={{ background: isEmployee ? '#d97706' : '#2563eb' }}>
              {isEmployee ? 'PS' : 'A'}
            </div>
            <div className="header__profile-info">
              <span className="header__profile-name">{authData?.name || (isEmployee ? 'Priya S.' : 'Admin')}</span>
              <span className="header__profile-role">{isEmployee ? 'Employee · Design' : 'Super Admin'}</span>
            </div>
            <ChevronDown size={12} />
          </button>
          {profileOpen && (
            <div className="header__dropdown header__profile-menu">
              <div className="header__dropdown-head">
                <div className="header__avatar header__avatar--lg" style={{ background: isEmployee ? '#d97706' : '#2563eb' }}>
                  {isEmployee ? 'PS' : 'A'}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{authData?.name || (isEmployee ? 'Priya Sundaram' : 'Enterprise Admin')}</p>
                  <p style={{ fontSize: 11, color: 'var(--gray-500)' }}>{authData?.email || (isEmployee ? 'priya.s@nexasphere.io' : 'admin@nexasphere.io')}</p>
                  <p style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 600, marginTop: 2 }}>{authData?.empId || 'EMP-2041'} · {authData?.dept || 'Design & UX'}</p>
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
              <button className="header__menu-item" onClick={handleToggleRole}>
                {isEmployee ? <Shield size={14} /> : <UserCheck size={14} />} Switch to {isEmployee ? 'Super Admin' : 'Employee'}
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
