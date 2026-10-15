import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban, Flag, CheckCircle2, Clock, AlertTriangle, Search,
  Plus, X, Calendar, User, Users, ChevronRight, LayoutGrid, ListFilter,
  Check, ArrowRight, Layers, BarChart2, ShieldCheck, Tag
} from 'lucide-react';
import {
  getStoredProjects, saveStoredProjects,
  getStoredTasks, saveStoredTasks,
  recalculateProjectMetrics
} from '../utils/projectTaskStore';
import './Projects.css';

const TODAY = new Date('2026-10-15');
const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
};

const DEPARTMENTS = [
  'All Departments',
  'Automation & Robotics',
  'Quality Assurance',
  'Maintenance & Operations',
  'Production & IT',
  'Logistics & Supply'
];

export default function Projects() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexa_auth')) || { role: 'employee', empId: 'EMP-2041', name: 'Priya Sundaram' };
    } catch {
      return { role: 'employee', empId: 'EMP-2041', name: 'Priya Sundaram' };
    }
  });

  const [projects, setProjects] = useState(() => getStoredProjects());
  const [tasks, setTasks] = useState(() => getStoredTasks());
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'milestones'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQ, setSearchQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectModalTab, setProjectModalTab] = useState('overview'); // 'overview' | 'milestones' | 'tasks'
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState(false);
  const [toast, setToast] = useState('');

  const isEmployee = currentUser?.role === 'employee';

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Sync auth & storage updates
  useEffect(() => {
    const handleAuth = () => {
      try {
        const s = localStorage.getItem('nexa_auth');
        if (s) setCurrentUser(JSON.parse(s));
      } catch (e) {
        console.error(e);
      }
    };
    const handleProjectsUpdate = () => setProjects(getStoredProjects());
    const handleTasksUpdate = () => setTasks(getStoredTasks());

    window.addEventListener('nexa_role_change', handleAuth);
    window.addEventListener('nexa_projects_updated', handleProjectsUpdate);
    window.addEventListener('nexa_tasks_updated', handleTasksUpdate);
    window.addEventListener('storage', handleAuth);

    return () => {
      window.removeEventListener('nexa_role_change', handleAuth);
      window.removeEventListener('nexa_projects_updated', handleProjectsUpdate);
      window.removeEventListener('nexa_tasks_updated', handleTasksUpdate);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Role scoping: In employee mode, show projects where employee is lead or on the team
      const matchesRole = !isEmployee || (
        p.leadEmpId === currentUser.empId ||
        p.team?.some(m => m.empId === currentUser.empId)
      );

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter || p.health === statusFilter;
      const matchesDept = deptFilter === 'All Departments' || p.dept === deptFilter;
      const q = searchQ.toLowerCase().trim();
      const matchesSearch = !q || (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.lead.toLowerCase().includes(q) ||
        p.dept.toLowerCase().includes(q)
      );

      return matchesRole && matchesStatus && matchesDept && matchesSearch;
    });
  }, [projects, isEmployee, currentUser, statusFilter, deptFilter, searchQ]);

  // All milestones flattened for roadmap view
  const allMilestones = useMemo(() => {
    const list = [];
    projects.forEach(p => {
      (p.milestones || []).forEach(m => {
        list.push({
          ...m,
          projectId: p.id,
          projectName: p.name,
          projectCode: p.code,
          projectHealth: p.health,
          dept: p.dept,
          lead: p.lead
        });
      });
    });
    return list;
  }, [projects]);

  const filteredMilestones = useMemo(() => {
    return allMilestones.filter(m => {
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
      const matchesDept = deptFilter === 'All Departments' || m.dept === deptFilter;
      const q = searchQ.toLowerCase().trim();
      const matchesSearch = !q || (
        m.title.toLowerCase().includes(q) ||
        m.projectName.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.deliverable.toLowerCase().includes(q)
      );
      return matchesStatus && matchesDept && matchesSearch;
    });
  }, [allMilestones, statusFilter, deptFilter, searchQ]);

  // Overall KPIs
  const totalProjects = filteredProjects.length;
  const onTrackCount = filteredProjects.filter(p => p.health === 'On Track').length;
  const atRiskCount = filteredProjects.filter(p => p.health === 'At Risk' || p.health === 'Delayed').length;
  
  const totalMilestonesCount = allMilestones.length;
  const achievedMilestonesCount = allMilestones.filter(m => m.status === 'Completed').length;

  // Milestone checkoff toggle
  const toggleMilestoneStatus = (projectId, milestoneId) => {
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = (p.milestones || []).map(m => {
        if (m.id !== milestoneId) return m;
        const nextStatus = m.status === 'Completed' ? 'In Progress' : 'Completed';
        const nextCompletedDate = nextStatus === 'Completed' ? '2026-10-15' : null;
        return { ...m, status: nextStatus, completedDate: nextCompletedDate };
      });
      return { ...p, milestones: updatedMilestones };
    });

    saveStoredProjects(updated);
    setProjects(updated);
    if (selectedProject?.id === projectId) {
      setSelectedProject(updated.find(p => p.id === projectId));
    }
    flash('Milestone status updated successfully.');
  };

  // Add new milestone to active project
  const handleAddMilestone = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.mTitle.value.trim();
    const dueDate = form.mDueDate.value;
    const deliverable = form.mDeliverable.value.trim();
    const code = form.mCode.value.trim() || `M${(selectedProject.milestones?.length || 0) + 1}`;

    if (!title || !dueDate) return;

    const newMilestone = {
      id: `MS-${Date.now().toString().slice(-4)}`,
      code,
      title,
      dueDate,
      status: 'Upcoming',
      deliverable: deliverable || 'Technical deliverables and validation signoff'
    };

    const updated = projects.map(p => {
      if (p.id !== selectedProject.id) return p;
      return {
        ...p,
        milestones: [...(p.milestones || []), newMilestone]
      };
    });

    saveStoredProjects(updated);
    setProjects(updated);
    setSelectedProject(updated.find(p => p.id === selectedProject.id));
    setShowNewMilestoneModal(false);
    flash(`Milestone "${title}" added to ${selectedProject.name}`);
  };

  // Create new project
  const handleCreateProject = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.pName.value.trim();
    const code = form.pCode.value.trim() || `PRJ-${100 + projects.length + 1}`;
    const dept = form.pDept.value;
    const lead = form.pLead.value;
    const startDate = form.pStartDate.value;
    const dueDate = form.pDueDate.value;
    const description = form.pDesc.value.trim();

    if (!name || !startDate || !dueDate) return;

    const newPrj = {
      id: `PRJ-${100 + projects.length + 1}`,
      code,
      name,
      dept,
      lead,
      leadEmpId: lead === 'Priya Sundaram' ? 'EMP-2041' : 'EMP-1082',
      leadAvatar: lead.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      team: [
        { name: lead, empId: 'EMP-2041', role: 'Project Lead', avatar: lead.slice(0, 2).toUpperCase() },
        { name: 'Aarav Sharma', empId: 'EMP00101', role: 'Systems Engineer', avatar: 'AS' }
      ],
      startDate,
      dueDate,
      status: 'Active',
      health: 'On Track',
      progress: 10,
      budgetHours: 350,
      loggedHours: 35,
      description: description || 'New enterprise production and systems deliverable.',
      milestones: [
        {
          id: `MS-${Date.now().toString().slice(-4)}`,
          code: 'M1',
          title: 'Initial Discovery & Specifications',
          dueDate: dueDate,
          status: 'In Progress',
          deliverable: 'Scope documentation and stakeholder approval'
        }
      ]
    };

    const updated = [newPrj, ...projects];
    saveStoredProjects(updated);
    setProjects(updated);
    setShowNewProjectModal(false);
    flash(`Project "${name}" created successfully.`);
  };

  return (
    <div className="prj-page">
      {toast && (
        <div className="prj-toast">
          <CheckCircle2 size={16} color="#10b981" /> {toast}
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="prj-header-row">
        <div>
          <h2 className="prj-heading">
            {isEmployee ? 'My Projects & Milestones' : 'Enterprise Project Portfolio'}
          </h2>
          <p className="prj-subheading">
            Monitor client deliverables, phases, team ownership, and completion milestones
          </p>
        </div>

        <div className="prj-header-actions">
          <Link to="/tasks" className="prj-btn-ghost">
            <Layers size={14} /> Go to Tasks Board →
          </Link>
          <button className="prj-btn-primary" onClick={() => setShowNewProjectModal(true)}>
            <Plus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="prj-stats-grid">
        <div className="prj-stat-card">
          <div className="prj-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <FolderKanban size={20} />
          </div>
          <div className="prj-stat-content">
            <span className="prj-stat-label">{isEmployee ? 'My Active Projects' : 'Total Projects'}</span>
            <span className="prj-stat-val">{totalProjects}</span>
          </div>
        </div>

        <div className="prj-stat-card">
          <div className="prj-stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <ShieldCheck size={20} />
          </div>
          <div className="prj-stat-content">
            <span className="prj-stat-label">On Track Delivery</span>
            <span className="prj-stat-val">{onTrackCount}</span>
          </div>
        </div>

        <div className="prj-stat-card">
          <div className="prj-stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="prj-stat-content">
            <span className="prj-stat-label">At Risk / Review</span>
            <span className="prj-stat-val">{atRiskCount}</span>
          </div>
        </div>

        <div className="prj-stat-card">
          <div className="prj-stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <Flag size={20} />
          </div>
          <div className="prj-stat-content">
            <span className="prj-stat-label">Milestones Achieved</span>
            <span className="prj-stat-val">
              {achievedMilestonesCount} <span className="prj-stat-sub">/ {totalMilestonesCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="prj-nav-tabs">
        <button
          className={`prj-tab-btn ${activeTab === 'portfolio' ? 'prj-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <FolderKanban size={15} /> Projects Portfolio ({filteredProjects.length})
        </button>
        <button
          className={`prj-tab-btn ${activeTab === 'milestones' ? 'prj-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <Flag size={15} /> Milestones Roadmap ({filteredMilestones.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="prj-toolbar">
        <div className="prj-toolbar-left">
          <div className="prj-search-box">
            <Search size={14} />
            <input
              type="text"
              placeholder={activeTab === 'portfolio' ? "Search by project, code, or lead..." : "Search milestone or deliverable..."}
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            {searchQ && (
              <button className="prj-clear-btn" onClick={() => setSearchQ('')}>
                <X size={13} />
              </button>
            )}
          </div>

          <div className="prj-status-chips">
            {['All', 'Active', 'On Track', 'At Risk', 'Completed'].map(status => (
              <button
                key={status}
                className={`prj-chip ${statusFilter === status ? 'prj-chip--active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="prj-toolbar-right">
          <select
            className="prj-select"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {activeTab === 'portfolio' && (
            <div className="prj-view-switch">
              <button
                className={`prj-switch-btn ${viewMode === 'grid' ? 'prj-switch-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`prj-switch-btn ${viewMode === 'table' ? 'prj-switch-btn--active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Compact Table View"
              >
                <ListFilter size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: Projects Portfolio */}
      {activeTab === 'portfolio' && (
        <>
          {filteredProjects.length === 0 ? (
            <div className="prj-empty-state">
              <FolderKanban size={42} strokeWidth={1.5} color="#94a3b8" />
              <h3>No projects match your current filter</h3>
              <p>Try resetting your search query or department filter.</p>
              <button
                className="prj-btn-ghost"
                onClick={() => { setSearchQ(''); setStatusFilter('All'); setDeptFilter('All Departments'); }}
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Card Grid View */
            <div className="prj-cards-grid">
              {filteredProjects.map(project => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
                const totalTasks = projectTasks.length;
                const milestonesCount = project.milestones?.length || 0;
                const completedMilestones = project.milestones?.filter(m => m.status === 'Completed').length || 0;

                return (
                  <div key={project.id} className="prj-card">
                    {/* Card Top */}
                    <div className="prj-card-head">
                      <div className="prj-card-code-dept">
                        <span className="prj-code-pill">{project.code}</span>
                        <span className="prj-dept-name">{project.dept}</span>
                      </div>
                      <span className={`prj-health-tag prj-health--${project.health.toLowerCase().replace(/\s/g, '')}`}>
                        {project.health}
                      </span>
                    </div>

                    {/* Card Title & Desc */}
                    <h3 className="prj-card-title">{project.name}</h3>
                    <p className="prj-card-desc">{project.description}</p>

                    {/* Progress Bar */}
                    <div className="prj-progress-wrap">
                      <div className="prj-progress-labels">
                        <span className="prj-prog-title">Overall Progress</span>
                        <span className="prj-prog-pct">{project.progress}%</span>
                      </div>
                      <div className="prj-bar-bg">
                        <div
                          className="prj-bar-fill"
                          style={{
                            width: `${project.progress}%`,
                            background: project.health === 'On Track' ? '#10b981' : project.health === 'At Risk' ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>

                    {/* Milestones Mini Tracker */}
                    <div className="prj-mini-milestones">
                      <div className="prj-mini-ms-head">
                        <span className="prj-ms-label">
                          <Flag size={12} /> Milestones ({completedMilestones}/{milestonesCount})
                        </span>
                        <span className="prj-ms-pct">
                          {milestonesCount > 0 ? Math.round((completedMilestones / milestonesCount) * 100) : 0}% Reached
                        </span>
                      </div>
                      <div className="prj-ms-dots-row">
                        {(project.milestones || []).map(m => (
                          <div
                            key={m.id}
                            className={`prj-ms-dot ${m.status === 'Completed' ? 'prj-ms-dot--done' : m.status === 'In Progress' ? 'prj-ms-dot--active' : 'prj-ms-dot--pending'}`}
                            title={`${m.code}: ${m.title} (${m.status})`}
                          >
                            <span>{m.code}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team & Meta */}
                    <div className="prj-card-meta">
                      <div className="prj-team-stack">
                        {(project.team || []).slice(0, 4).map((member, i) => (
                          <div key={i} className="prj-team-avatar" title={`${member.name} (${member.role})`}>
                            {member.avatar || member.name.slice(0, 2).toUpperCase()}
                          </div>
                        ))}
                        {(project.team?.length || 0) > 4 && (
                          <div className="prj-team-avatar prj-team-avatar--more">
                            +{(project.team.length - 4)}
                          </div>
                        )}
                      </div>

                      <div className="prj-date-target">
                        <Calendar size={12} />
                        <span>Due {fmtDate(project.dueDate)}</span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="prj-card-foot">
                      <button
                        className="prj-btn-outline"
                        onClick={() => {
                          setSelectedProject(project);
                          setProjectModalTab('milestones');
                        }}
                      >
                        <Flag size={13} /> Milestones & Details
                      </button>

                      <Link to={`/tasks?project=${project.id}`} className="prj-link-tasks">
                        Tasks ({completedTasks}/{totalTasks}) <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="prj-table-wrap">
              <table className="prj-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Department</th>
                    <th>Lead</th>
                    <th>Milestones</th>
                    <th>Tasks</th>
                    <th>Due Date</th>
                    <th>Progress</th>
                    <th>Health</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map(p => {
                    const projectTasks = tasks.filter(t => t.projectId === p.id);
                    const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
                    const milestonesCount = p.milestones?.length || 0;
                    const completedMilestones = p.milestones?.filter(m => m.status === 'Completed').length || 0;

                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="prj-tbl-name">{p.name}</div>
                          <div className="prj-tbl-code">{p.code}</div>
                        </td>
                        <td>{p.dept}</td>
                        <td>
                          <div className="prj-lead-row">
                            <span className="prj-sm-avatar">{p.leadAvatar || 'PL'}</span>
                            <span>{p.lead}</span>
                          </div>
                        </td>
                        <td>
                          <span className="prj-ms-badge">
                            <Flag size={11} /> {completedMilestones} of {milestonesCount}
                          </span>
                        </td>
                        <td>
                          <Link to={`/tasks?project=${p.id}`} className="prj-tbl-tasks-link">
                            {completedTasks} / {projectTasks.length} Done
                          </Link>
                        </td>
                        <td>{fmtDate(p.dueDate)}</td>
                        <td>
                          <div className="prj-tbl-prog">
                            <div className="prj-bar-bg" style={{ width: 80 }}>
                              <div className="prj-bar-fill" style={{ width: `${p.progress}%` }} />
                            </div>
                            <span className="prj-tbl-pct">{p.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`prj-health-tag prj-health--${p.health.toLowerCase().replace(/\s/g, '')}`}>
                            {p.health}
                          </span>
                        </td>
                        <td>
                          <button
                            className="prj-tbl-btn"
                            onClick={() => {
                              setSelectedProject(p);
                              setProjectModalTab('overview');
                            }}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* TAB 2: Milestones Roadmap */}
      {activeTab === 'milestones' && (
        <div className="prj-roadmap-container">
          <div className="prj-roadmap-header">
            <div>
              <h3>Milestone Delivery Timeline</h3>
              <p>Visual status of critical project checkpoints and engineering deliverables</p>
            </div>
            <div className="prj-roadmap-legend">
              <span className="prj-leg-item"><i className="prj-leg-dot prj-leg-done" /> Completed</span>
              <span className="prj-leg-item"><i className="prj-leg-dot prj-leg-active" /> In Progress</span>
              <span className="prj-leg-item"><i className="prj-leg-dot prj-leg-pending" /> Upcoming</span>
            </div>
          </div>

          <div className="prj-roadmap-list">
            {filteredMilestones.map((m) => {
              const isPastDue = m.status !== 'Completed' && new Date(m.dueDate) < TODAY;

              return (
                <div key={`${m.projectId}-${m.id}`} className={`prj-ms-card prj-ms-card--${m.status.toLowerCase().replace(/\s/g, '')}`}>
                  <div className="prj-ms-card-left">
                    <button
                      className={`prj-ms-check-btn ${m.status === 'Completed' ? 'prj-ms-check-btn--done' : ''}`}
                      onClick={() => toggleMilestoneStatus(m.projectId, m.id)}
                      title={m.status === 'Completed' ? "Mark as Incomplete" : "Mark as Achieved"}
                    >
                      <Check size={14} />
                    </button>
                    <div>
                      <div className="prj-ms-card-top-row">
                        <span className="prj-ms-code-badge">{m.code}</span>
                        <span className="prj-ms-project-badge">{m.projectName}</span>
                        <span className={`prj-ms-status-pill prj-ms-status--${m.status.toLowerCase().replace(/\s/g, '')}`}>
                          {m.status}
                        </span>
                        {isPastDue && <span className="prj-ms-overdue-tag">Overdue</span>}
                      </div>
                      <h4 className="prj-ms-title">{m.title}</h4>
                      <p className="prj-ms-deliverable">
                        <strong>Key Deliverable:</strong> {m.deliverable}
                      </p>
                    </div>
                  </div>

                  <div className="prj-ms-card-right">
                    <div className="prj-ms-due-info">
                      <span className="prj-ms-due-label">Target Signoff</span>
                      <span className="prj-ms-due-val">
                        <Calendar size={13} /> {fmtDate(m.dueDate)}
                      </span>
                      {m.completedDate && (
                        <span className="prj-ms-done-date">
                          Achieved on {fmtDate(m.completedDate)}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/tasks?project=${m.projectId}&milestone=${m.id}`}
                      className="prj-ms-view-tasks"
                    >
                      Linked Tasks <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: Project Details & Milestones Drawer */}
      {selectedProject && (
        <div className="prj-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="prj-modal-content" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="prj-modal-head">
              <div className="prj-modal-head-info">
                <div className="prj-modal-tags">
                  <span className="prj-code-pill">{selectedProject.code}</span>
                  <span className={`prj-health-tag prj-health--${selectedProject.health.toLowerCase().replace(/\s/g, '')}`}>
                    {selectedProject.health}
                  </span>
                  <span className="prj-dept-name">{selectedProject.dept}</span>
                </div>
                <h2>{selectedProject.name}</h2>
                <p>Project Lead: <strong>{selectedProject.lead}</strong> · Due {fmtDate(selectedProject.dueDate)}</p>
              </div>

              <button className="prj-close-btn" onClick={() => setSelectedProject(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div className="prj-modal-tabs">
              <button
                className={`prj-m-tab ${projectModalTab === 'overview' ? 'prj-m-tab--active' : ''}`}
                onClick={() => setProjectModalTab('overview')}
              >
                Overview & Specs
              </button>
              <button
                className={`prj-m-tab ${projectModalTab === 'milestones' ? 'prj-m-tab--active' : ''}`}
                onClick={() => setProjectModalTab('milestones')}
              >
                Milestones ({selectedProject.milestones?.length || 0})
              </button>
              <button
                className={`prj-m-tab ${projectModalTab === 'tasks' ? 'prj-m-tab--active' : ''}`}
                onClick={() => setProjectModalTab('tasks')}
              >
                Project Tasks ({tasks.filter(t => t.projectId === selectedProject.id).length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="prj-modal-body">
              {/* Tab 1: Overview */}
              {projectModalTab === 'overview' && (
                <div className="prj-m-overview">
                  <div className="prj-m-grid-two">
                    <div className="prj-m-box">
                      <label className="prj-lbl">Project Description & Scope</label>
                      <p className="prj-desc-full">{selectedProject.description}</p>
                    </div>

                    <div className="prj-m-box">
                      <label className="prj-lbl">Timeline & Resource Quotas</label>
                      <div className="prj-kpi-row">
                        <div>
                          <span className="prj-kpi-val">{fmtDate(selectedProject.startDate)}</span>
                          <span className="prj-kpi-lbl">Start Date</span>
                        </div>
                        <div>
                          <span className="prj-kpi-val">{fmtDate(selectedProject.dueDate)}</span>
                          <span className="prj-kpi-lbl">Target Delivery</span>
                        </div>
                        <div>
                          <span className="prj-kpi-val">{selectedProject.loggedHours} / {selectedProject.budgetHours} hrs</span>
                          <span className="prj-kpi-lbl">Hours Logged</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="prj-m-box" style={{ marginTop: 14 }}>
                    <label className="prj-lbl">Assigned Cross-Functional Team</label>
                    <div className="prj-team-roster">
                      {(selectedProject.team || []).map((m, idx) => (
                        <div key={idx} className="prj-roster-item">
                          <div className="prj-team-avatar">{m.avatar || m.name.slice(0, 2).toUpperCase()}</div>
                          <div>
                            <span className="prj-roster-name">{m.name}</span>
                            <span className="prj-roster-role">{m.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Milestones */}
              {projectModalTab === 'milestones' && (
                <div className="prj-m-milestones-tab">
                  <div className="prj-m-ms-head">
                    <div>
                      <h4>Engineering Milestones & Deliverables</h4>
                      <p>Check off milestones as factory validation signs off</p>
                    </div>
                    <button
                      className="prj-btn-primary prj-btn-sm"
                      onClick={() => setShowNewMilestoneModal(true)}
                    >
                      <Plus size={13} /> Add Milestone
                    </button>
                  </div>

                  <div className="prj-m-ms-list">
                    {(selectedProject.milestones || []).map(m => (
                      <div key={m.id} className="prj-m-ms-item">
                        <button
                          className={`prj-ms-check-btn ${m.status === 'Completed' ? 'prj-ms-check-btn--done' : ''}`}
                          onClick={() => toggleMilestoneStatus(selectedProject.id, m.id)}
                        >
                          <Check size={14} />
                        </button>

                        <div className="prj-m-ms-content">
                          <div className="prj-m-ms-top">
                            <span className="prj-ms-code-badge">{m.code}</span>
                            <h5 className="prj-m-ms-name">{m.title}</h5>
                            <span className={`prj-ms-status-pill prj-ms-status--${m.status.toLowerCase().replace(/\s/g, '')}`}>
                              {m.status}
                            </span>
                          </div>
                          <p className="prj-m-ms-deliv">{m.deliverable}</p>
                          <div className="prj-m-ms-date">
                            <Calendar size={12} /> Target Due: {fmtDate(m.dueDate)}
                            {m.completedDate && (
                              <span style={{ color: '#059669', marginLeft: 10 }}>
                                (Completed: {fmtDate(m.completedDate)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Project Tasks */}
              {projectModalTab === 'tasks' && (
                <div className="prj-m-tasks-tab">
                  <div className="prj-m-ms-head">
                    <div>
                      <h4>Tasks Linked to this Project</h4>
                      <p>Manage and track operational execution</p>
                    </div>
                    <Link to={`/tasks?project=${selectedProject.id}`} className="prj-btn-primary prj-btn-sm">
                      <Layers size={13} /> Open Tasks Board
                    </Link>
                  </div>

                  <div className="prj-m-tasks-list">
                    {tasks.filter(t => t.projectId === selectedProject.id).length === 0 ? (
                      <p className="prj-empty-text">No tasks logged for this project yet.</p>
                    ) : (
                      tasks.filter(t => t.projectId === selectedProject.id).map(task => (
                        <div key={task.id} className="prj-m-task-row">
                          <div>
                            <span className="prj-task-id">{task.id}</span>
                            <span className="prj-task-title">{task.title}</span>
                            <div className="prj-task-sub">
                              <span>Assignee: {task.assignee}</span> · <span>Due: {fmtDate(task.due)}</span>
                            </div>
                          </div>
                          <div className="prj-task-row-right">
                            <span className={`prj-pri-pill prj-pri--${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                            <span className={`prj-task-status-pill prj-ts--${task.status.toLowerCase().replace(/\s/g, '')}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="prj-modal-foot">
              <Link to={`/tasks?project=${selectedProject.id}`} className="prj-btn-primary">
                Open in Tasks Board →
              </Link>
              <button className="prj-btn-ghost" onClick={() => setSelectedProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Milestone Modal */}
      {showNewMilestoneModal && selectedProject && (
        <div className="prj-modal-overlay" onClick={() => setShowNewMilestoneModal(false)}>
          <form className="prj-modal-content prj-modal-sm" onClick={e => e.stopPropagation()} onSubmit={handleAddMilestone}>
            <div className="prj-modal-head">
              <div>
                <h3>Add Milestone</h3>
                <p>Add a new critical phase to <strong>{selectedProject.name}</strong></p>
              </div>
              <button type="button" className="prj-close-btn" onClick={() => setShowNewMilestoneModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="prj-modal-body">
              <div className="prj-two-inputs">
                <div>
                  <label className="prj-lbl">Milestone Code *</label>
                  <input
                    name="mCode"
                    className="prj-input"
                    defaultValue={`M${(selectedProject.milestones?.length || 0) + 1}`}
                    required
                  />
                </div>
                <div>
                  <label className="prj-lbl">Target Signoff Date *</label>
                  <input name="mDueDate" type="date" className="prj-input" required />
                </div>
              </div>

              <label className="prj-lbl" style={{ marginTop: 12 }}>Milestone Title *</label>
              <input
                name="mTitle"
                className="prj-input"
                placeholder="e.g. PLC & Sensor Bench Testing"
                required
              />

              <label className="prj-lbl" style={{ marginTop: 12 }}>Deliverable Description</label>
              <textarea
                name="mDeliverable"
                className="prj-input"
                rows={3}
                placeholder="Specific tangible outcome required to mark this milestone achieved..."
              />
            </div>

            <div className="prj-modal-foot">
              <button type="submit" className="prj-btn-primary">Add Milestone</button>
              <button type="button" className="prj-btn-ghost" onClick={() => setShowNewMilestoneModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Create Project Modal */}
      {showNewProjectModal && (
        <div className="prj-modal-overlay" onClick={() => setShowNewProjectModal(false)}>
          <form className="prj-modal-content" onClick={e => e.stopPropagation()} onSubmit={handleCreateProject}>
            <div className="prj-modal-head">
              <div>
                <h3>Create New Enterprise Project</h3>
                <p>Define project objectives, leadership, dates, and department ownership</p>
              </div>
              <button type="button" className="prj-close-btn" onClick={() => setShowNewProjectModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="prj-modal-body">
              <div className="prj-two-inputs">
                <div>
                  <label className="prj-lbl">Project Name *</label>
                  <input name="pName" className="prj-input" placeholder="e.g. Automated AGV Fleet Dispatch" required />
                </div>
                <div>
                  <label className="prj-lbl">Project Code</label>
                  <input name="pCode" className="prj-input" placeholder="e.g. AGV-2026" />
                </div>
              </div>

              <div className="prj-two-inputs" style={{ marginTop: 12 }}>
                <div>
                  <label className="prj-lbl">Department</label>
                  <select name="pDept" className="prj-input">
                    {DEPARTMENTS.filter(d => d !== 'All Departments').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="prj-lbl">Project Lead</label>
                  <select name="pLead" className="prj-input">
                    <option value="Priya Sundaram">Priya Sundaram (EMP-2041)</option>
                    <option value="Arun Kumar">Arun Kumar (EMP-1082)</option>
                    <option value="Meena Ramesh">Meena Ramesh (EMP-3012)</option>
                    <option value="Vignesh M.">Vignesh M. (EMP-2098)</option>
                    <option value="Aarav Sharma">Aarav Sharma (EMP00101)</option>
                  </select>
                </div>
              </div>

              <div className="prj-two-inputs" style={{ marginTop: 12 }}>
                <div>
                  <label className="prj-lbl">Start Date *</label>
                  <input name="pStartDate" type="date" className="prj-input" required />
                </div>
                <div>
                  <label className="prj-lbl">Target Completion Date *</label>
                  <input name="pDueDate" type="date" className="prj-input" required />
                </div>
              </div>

              <label className="prj-lbl" style={{ marginTop: 12 }}>Project Scope & Objectives</label>
              <textarea
                name="pDesc"
                className="prj-input"
                rows={3}
                placeholder="State the core deliverables, industrial standards, and plant floor requirements..."
              />
            </div>

            <div className="prj-modal-foot">
              <button type="submit" className="prj-btn-primary">Create Project</button>
              <button type="button" className="prj-btn-ghost" onClick={() => setShowNewProjectModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
