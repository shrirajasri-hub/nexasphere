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
import './Sidebar.css';

const EMPLOYEE_NAV = [
  { icon: LayoutDashboard, label: 'My Dashboard',        to: '/dashboard' },
  { icon: CalendarDays,    label: 'Apply Leave',         to: '/leave', badge: 'Apply' },
  { icon: Clock,           label: 'My Attendance',       to: '/attendance' },
  { icon: FolderKanban,    label: 'My Projects',         to: '/projects' },
  { icon: CheckSquare,     label: 'My Tasks',            to: '/tasks' },
  { icon: User,            label: 'My Profile',          to: '/profile' },
  { icon: Bell,            label: 'Notifications',       to: '/notifications', badge: 3 },
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
      { icon: Users,      label: 'Employee Master',     to: '/masters/employees' },
      { icon: Building2,  label: 'Department Master',   to: '/masters/departments' },
      { icon: Briefcase,  label: 'Designation Master',  to: '/masters/designations' },
      { icon: Globe,      label: 'Branch / Location',   to: '/masters/branches' },
      { icon: BarChart3,   label: 'MIS Reports Config',  to: '/masters/reports-config' },
      { icon: CalendarDays, label: 'Leave Policy',      to: '/masters/leave-policy' },
      { icon: FileText,   label: 'Document Types',      to: '/masters/documents' },
      { icon: Shield,     label: 'Roles & Permissions', to: '/masters/roles' },
    ]
  },
  { icon: Settings,        label: 'Settings',         to: '/settings' },
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
  const navList = isEmployee ? EMPLOYEE_NAV : ADMIN_NAV;
  const { themeId } = useTheme();
  const isLightSidebar = themeId === 'white';

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isParentActive = (children) =>
    children?.some(c => location.pathname.startsWith(c.to));

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
          <span>{isEmployee ? 'Employee Self-Service' : 'Enterprise Admin'}</span>
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
                    {item.children.map(child => (
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
                    ))}
                  </div>
                )}
              </div>
            );
          }

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
