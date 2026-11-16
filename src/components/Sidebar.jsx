import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, User, Clock, CalendarDays, FolderKanban,
  CheckSquare, Timer, BarChart3, Bell, BookOpen, Settings,
  ChevronDown, ChevronRight, Shield, Globe, Database,
  Briefcase, Building2, FileText, UserCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import SidebarThemePicker from './SidebarThemePicker';
import { useTheme } from '../context/ThemeContext';
import { triggerPlannedFeatureModal } from './YetToBeDevelopedModal';
import './Sidebar.css';

// ─── Active scope paths (Phase 2 approved only) ───
const ACTIVE_PATHS = ['/dashboard', '/leave', '/profile', '/masters/employees'];

const isInScope = (to) => ACTIVE_PATHS.some(p => to === p || to.startsWith(p));

const EMPLOYEE_NAV = [
  { icon: LayoutDashboard, label: 'My Dashboard',    to: '/dashboard' },
  { icon: CalendarDays,    label: 'Apply Leave',     to: '/leave', badge: 'Apply' },
  { icon: Clock,           label: 'My Attendance',   to: '/attendance' },
  { icon: FolderKanban,    label: 'My Projects',     to: '/projects' },
  { icon: CheckSquare,     label: 'My Tasks',        to: '/tasks' },
  { icon: User,            label: 'My Profile',      to: '/profile' },
  { icon: Bell,            label: 'Notifications',   to: '/notifications', badge: 3 },
];

const SUPERVISOR_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',           to: '/dashboard' },
  { icon: CalendarDays,    label: 'Team Leave Approvals', to: '/leave' },
  { icon: User,            label: 'My Profile',           to: '/profile' },
  { icon: Bell,            label: 'Notifications',        to: '/notifications', badge: 2 },
];

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',        to: '/dashboard' },
  { icon: Users,           label: 'Employees',        to: '/employees' },
  { icon: Clock,           label: 'Attendance',       to: '/attendance' },
  { icon: CalendarDays,    label: 'Leave Management', to: '/leave' },
  { icon: FolderKanban,    label: 'Projects',         to: '/projects' },
  { icon: CheckSquare,     label: 'Tasks',            to: '/tasks' },
  { icon: Timer,           label: 'Timesheets',       to: '/timesheets' },
  { icon: BarChart3,       label: 'Reports & MIS',    to: '/reports' },
  { icon: Bell,            label: 'Notifications',    to: '/notifications', badge: 5 },
  {
    icon: BookOpen, label: 'Masters', to: '/masters',
    children: [
      { icon: Users,        label: 'Employee Master',    to: '/masters/employees' },
      { icon: Building2,    label: 'Department Master',  to: '/masters/departments' },
      { icon: Briefcase,    label: 'Designation Master', to: '/masters/designations' },
      { icon: Globe,        label: 'Branch / Location',  to: '/masters/branches' },
      { icon: BarChart3,    label: 'MIS Reports Config', to: '/masters/reports-config' },
      { icon: CalendarDays, label: 'Leave Policy',       to: '/masters/leave-policy' },
      { icon: FileText,     label: 'Document Types',     to: '/masters/documents' },
      { icon: Shield,       label: 'Roles & Permissions',to: '/masters/roles' },
    ]
  },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({ '/masters': true });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_auth');
      return saved ? JSON.parse(saved) : { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041' };
    } catch {
      return { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041' };
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
  const isSupervisor = currentUser?.role === 'supervisor' || currentUser?.role === 'manager';

  const navList = isEmployee
    ? EMPLOYEE_NAV
    : isSupervisor
    ? SUPERVISOR_NAV
    : ADMIN_NAV;

  const { themeId } = useTheme();
  const isLightSidebar = themeId === 'white';

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isParentActive = (children) =>
    children?.some(c => location.pathname.startsWith(c.to));

  // ─── Handle click on a nav item — block out-of-scope items ───
  const handleNavClick = (e, item) => {
    if (!isInScope(item.to)) {
      e.preventDefault();
      triggerPlannedFeatureModal(item.label);
    }
  };

  const handleSubClick = (e, child) => {
    if (!isInScope(child.to)) {
      e.preventDefault();
      triggerPlannedFeatureModal(child.label);
    }
  };

  // Role label for sidebar tag
  const roleLabel = isEmployee
    ? 'Employee Self-Service'
    : isSupervisor
    ? 'Supervisor – Team Oversight'
    : 'Enterprise Admin';

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <Logo size={34} showText={!collapsed} textLight={!isLightSidebar} />
      </div>

      {/* Role Tag when expanded */}
      {!collapsed && (
        <div className={`sidebar__role-tag ${isLightSidebar ? 'sidebar__role-tag--light' : ''}`}>
          <UserCheck size={13} />
          <span>{roleLabel}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar__nav">
        {navList.map((item) => {
          if (item.children) {
            const open = openMenus[item.to];
            const parentActive = isParentActive(item.children);
            return (
              <div key={item.to} className="sidebar__group">
                <button
                  className={`sidebar__item sidebar__item--parent ${parentActive ? 'sidebar__item--active' : ''}`}
                  onClick={() => toggleMenu(item.to)}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="sidebar__icon" />
                  {!collapsed && (
                    <>
                      <span className="sidebar__label">{item.label}</span>
                      {open
                        ? <ChevronDown size={14} className="sidebar__chevron" />
                        : <ChevronRight size={14} className="sidebar__chevron" />
                      }
                    </>
                  )}
                </button>
                {!collapsed && open && (
                  <div className="sidebar__submenu">
                    {item.children.map(child => {
                      const inScope = isInScope(child.to);
                      return inScope ? (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `sidebar__subitem ${isActive ? 'sidebar__subitem--active' : ''}`
                          }
                        >
                          <child.icon size={14} />
                          <span>{child.label}</span>
                        </NavLink>
                      ) : (
                        <button
                          key={child.to}
                          type="button"
                          className="sidebar__subitem sidebar__subitem--disabled"
                          onClick={(e) => handleSubClick(e, child)}
                          title={`${child.label} — Yet to be developed`}
                        >
                          <child.icon size={14} />
                          <span>{child.label}</span>
                          <span className="sidebar__planned-pill">Planned</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const inScope = isInScope(item.to);

          if (inScope) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                }
              >
                <item.icon size={18} className="sidebar__icon" />
                {!collapsed && (
                  <>
                    <span className="sidebar__label">{item.label}</span>
                    {item.badge && (
                      <span className="sidebar__badge" style={item.badge === 'Apply' ? { background: '#10b981', color: '#fff' } : undefined}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          }

          // Out-of-scope: render disabled button
          return (
            <button
              key={item.to}
              type="button"
              title={collapsed ? `${item.label} (Planned)` : undefined}
              className="sidebar__item sidebar__item--disabled"
              onClick={(e) => handleNavClick(e, item)}
            >
              <item.icon size={18} className="sidebar__icon" />
              {!collapsed && (
                <>
                  <span className="sidebar__label">{item.label}</span>
                  {item.badge && typeof item.badge === 'number' && (
                    <span className="sidebar__badge">{item.badge}</span>
                  )}
                  <span className="sidebar__planned-pill">Planned</span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Picker + Footer */}
      <SidebarThemePicker collapsed={collapsed} />

      {!collapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__footer-tag">
            {isEmployee ? (
              <>
                <UserCheck size={12} style={{ color: '#38bdf8' }} />
                <span>Portal: {currentUser?.empId || 'EMP-2041'}</span>
              </>
            ) : isSupervisor ? (
              <>
                <Shield size={12} style={{ color: '#4ade80' }} />
                <span>Supervisor Portal</span>
              </>
            ) : (
              <>
                <Database size={12} />
                <span>Multi-Tenant Enterprise SaaS</span>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
