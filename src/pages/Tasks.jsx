import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckSquare, Plus, Search, Filter, Calendar, Flag,
  Clock, CheckCircle2, AlertTriangle, X, ChevronRight,
  ChevronLeft, ArrowRight, User, Layers, MessageSquare,
  ListFilter, LayoutGrid, Check, MoreVertical
} from 'lucide-react';
import {
  getStoredProjects, saveStoredProjects,
  getStoredTasks, saveStoredTasks,
  recalculateProjectMetrics
} from '../utils/projectTaskStore';
import './Tasks.css';

const TODAY = new Date('2026-10-15');
const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
};

const COLUMNS = [
  { id: 'To Do',       title: 'To Do',       icon: CheckSquare,   color: '#64748b', bg: '#f1f5f9' },
  { id: 'In Progress', title: 'In Progress', icon: Clock,         color: '#0284c7', bg: '#e0f2fe' },
  { id: 'In Review',   title: 'In Review',   icon: AlertTriangle, color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'Completed',   title: 'Completed',   icon: CheckCircle2,  color: '#059669', bg: '#d1fae5' },
];

const PRIORITIES = ['All', 'Urgent', 'High', 'Medium', 'Low'];

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProjectFilter = searchParams.get('project') || 'All';
  const initialMilestoneFilter = searchParams.get('milestone') || 'All';

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexa_auth')) || { role: 'employee', empId: 'EMP-2041', name: 'Priya Sundaram' };
    } catch {
      return { role: 'employee', empId: 'EMP-2041', name: 'Priya Sundaram' };
    }
  });

  const [tasks, setTasks] = useState(() => getStoredTasks());
  const [projects, setProjects] = useState(() => getStoredProjects());

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQ, setSearchQ] = useState('');
  const [selectedProject, setSelectedProject] = useState(initialProjectFilter);
  const [selectedMilestone, setSelectedMilestone] = useState(initialMilestoneFilter);
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filterMyTasksOnly, setFilterMyTasksOnly] = useState(currentUser?.role === 'employee');

  const [activeTask, setActiveTask] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [newNoteInput, setNewNoteInput] = useState('');
  const [toast, setToast] = useState('');

  const isEmployee = currentUser?.role === 'employee';

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Sync auth and storage
  useEffect(() => {
    const handleAuth = () => {
      try {
        const s = localStorage.getItem('nexa_auth');
        if (s) {
          const parsed = JSON.parse(s);
          setCurrentUser(parsed);
          setFilterMyTasksOnly(parsed.role === 'employee');
        }
      } catch (e) {
        console.error(e);
      }
    };
    const handleTasksUpdate = () => setTasks(getStoredTasks());
    const handleProjectsUpdate = () => setProjects(getStoredProjects());

    window.addEventListener('nexa_role_change', handleAuth);
    window.addEventListener('nexa_tasks_updated', handleTasksUpdate);
    window.addEventListener('nexa_projects_updated', handleProjectsUpdate);
    window.addEventListener('storage', handleAuth);

    return () => {
      window.removeEventListener('nexa_role_change', handleAuth);
      window.removeEventListener('nexa_tasks_updated', handleTasksUpdate);
      window.removeEventListener('nexa_projects_updated', handleProjectsUpdate);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesScope = !filterMyTasksOnly || t.assigneeEmpId === currentUser.empId || t.assignee === currentUser.name;
      const matchesPrj = selectedProject === 'All' || t.projectId === selectedProject;
      const matchesMs = selectedMilestone === 'All' || t.milestoneId === selectedMilestone;
      const matchesPri = selectedPriority === 'All' || t.priority === selectedPriority;
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

      const q = searchQ.toLowerCase().trim();
      const matchesSearch = !q || (
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q)
      );

      return matchesScope && matchesPrj && matchesMs && matchesPri && matchesStatus && matchesSearch;
    });
  }, [tasks, filterMyTasksOnly, currentUser, selectedProject, selectedMilestone, selectedPriority, statusFilter, searchQ]);

  // Overall KPIs
  const totalCount = filteredTasks.length;
  const inProgressCount = filteredTasks.filter(t => t.status === 'In Progress').length;
  const inReviewCount = filteredTasks.filter(t => t.status === 'In Review').length;
  const completedCount = filteredTasks.filter(t => t.status === 'Completed').length;

  // Persist tasks & recalculate project progress
  const updateTasksState = (updatedTasks) => {
    saveStoredTasks(updatedTasks);
    setTasks(updatedTasks);

    // Sync project metrics
    let currentProjects = getStoredProjects();
    const affectedProjects = [...new Set(updatedTasks.map(t => t.projectId))];
    affectedProjects.forEach(pid => {
      currentProjects = recalculateProjectMetrics(pid, currentProjects, updatedTasks);
    });
    saveStoredProjects(currentProjects);
    setProjects(currentProjects);
  };

  // Move task to next or previous status in Kanban
  const moveTask = (task, direction) => {
    const statusOrder = ['To Do', 'In Progress', 'In Review', 'Completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= statusOrder.length) return;
    const nextStatus = statusOrder[nextIndex];
    const nextProgress = nextStatus === 'Completed' ? 100 : nextStatus === 'To Do' ? 0 : Math.max(task.progress, 25);

    const updated = tasks.map(t => t.id === task.id ? { ...t, status: nextStatus, progress: nextProgress } : t);
    updateTasksState(updated);
    if (activeTask?.id === task.id) {
      setActiveTask({ ...activeTask, status: nextStatus, progress: nextProgress });
    }
    flash(`Task moved to ${nextStatus}`);
  };

  // Toggle checklist subtask
  const toggleSubtask = (taskId, subtaskId) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const subtasks = (t.subtasks || []).map(st => st.id === subtaskId ? { ...st, done: !st.done } : st);
      const doneCount = subtasks.filter(st => st.done).length;
      const computedProgress = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : t.progress;
      const computedStatus = computedProgress === 100 ? 'Completed' : (t.status === 'Completed' ? 'In Progress' : t.status);

      return {
        ...t,
        subtasks,
        progress: computedProgress,
        status: computedStatus
      };
    });

    updateTasksState(updated);
    if (activeTask?.id === taskId) {
      setActiveTask(updated.find(t => t.id === taskId));
    }
  };

  // Add new subtask to active task
  const addSubtaskToActive = () => {
    if (!newSubtaskInput.trim() || !activeTask) return;
    const newSubtask = {
      id: Date.now(),
      title: newSubtaskInput.trim(),
      done: false
    };

    const updated = tasks.map(t => {
      if (t.id !== activeTask.id) return t;
      const subtasks = [...(t.subtasks || []), newSubtask];
      const doneCount = subtasks.filter(st => st.done).length;
      const computedProgress = Math.round((doneCount / subtasks.length) * 100);
      return { ...t, subtasks, progress: computedProgress };
    });

    updateTasksState(updated);
    setActiveTask(updated.find(t => t.id === activeTask.id));
    setNewSubtaskInput('');
    flash('Subtask added.');
  };

  // Add note to active task
  const addNoteToActive = () => {
    if (!newNoteInput.trim() || !activeTask) return;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const noteObj = { t: dateStr, m: newNoteInput.trim(), author: currentUser.name };

    const updated = tasks.map(t => {
      if (t.id !== activeTask.id) return t;
      return {
        ...t,
        notes: [noteObj, ...(t.notes || [])]
      };
    });

    updateTasksState(updated);
    setActiveTask(updated.find(t => t.id === activeTask.id));
    setNewNoteInput('');
    flash('Progress note posted.');
  };

  // Create new task
  const handleCreateTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.tTitle.value.trim();
    const projectId = form.tProject.value;
    const milestoneId = form.tMilestone.value;
    const assignee = form.tAssignee.value;
    const priority = form.tPriority.value;
    const due = form.tDue.value;
    const description = form.tDesc.value.trim();

    if (!title || !projectId || !due) return;

    const prjObj = projects.find(p => p.id === projectId);
    const msObj = prjObj?.milestones?.find(m => m.id === milestoneId);

    const nextId = `TSK-${100 + tasks.length + 1}`;
    const newTask = {
      id: nextId,
      title,
      projectId,
      projectName: prjObj?.name || 'General Project',
      milestoneId: milestoneId || (prjObj?.milestones?.[0]?.id || 'MS-GEN'),
      milestoneName: msObj ? `${msObj.code}: ${msObj.title}` : 'Phase Milestone',
      assignee,
      assigneeEmpId: assignee === 'Priya Sundaram' ? 'EMP-2041' : assignee === 'Aarav Sharma' ? 'EMP00101' : 'EMP-1082',
      assigneeAvatar: assignee.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      priority,
      status: 'To Do',
      due,
      description: description || 'New task deliverable.',
      progress: 0,
      subtasks: [
        { id: 1, title: 'Initial technical discovery & requirement alignment', done: false }
      ],
      notes: [
        { t: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), m: 'Task initiated.', author: currentUser.name }
      ]
    };

    const updated = [newTask, ...tasks];
    updateTasksState(updated);
    setShowNewTaskModal(false);
    flash(`Task "${title}" created.`);
  };

  // Project selector for form (to update milestone options dynamically)
  const [formSelectedProject, setFormSelectedProject] = useState(projects[0]?.id || 'PRJ-101');
  const formMilestones = useMemo(() => {
    const prj = projects.find(p => p.id === formSelectedProject);
    return prj?.milestones || [];
  }, [projects, formSelectedProject]);

  return (
    <div className="tsk-page">
      {toast && (
        <div className="tsk-toast">
          <CheckCircle2 size={16} color="#10b981" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="tsk-header-row">
        <div>
          <h2 className="tsk-heading">
            {isEmployee && filterMyTasksOnly ? 'My Tasks & Execution' : 'Cross-Functional Task Board'}
          </h2>
          <p className="tsk-subheading">
            Coordinate sprints, deliverables, engineering checklists, and milestone linkage
          </p>
        </div>

        <div className="tsk-header-actions">
          <Link to="/projects" className="tsk-btn-ghost">
            <Flag size={14} /> View Milestones & Projects →
          </Link>
          <button className="tsk-btn-primary" onClick={() => setShowNewTaskModal(true)}>
            <Plus size={15} /> Create Task
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="tsk-stats-grid">
        <div className="tsk-stat-card">
          <div className="tsk-stat-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <span className="tsk-stat-label">Total Assigned Tasks</span>
            <span className="tsk-stat-val">{totalCount}</span>
          </div>
        </div>

        <div className="tsk-stat-card">
          <div className="tsk-stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Clock size={20} />
          </div>
          <div>
            <span className="tsk-stat-label">In Progress</span>
            <span className="tsk-stat-val">{inProgressCount}</span>
          </div>
        </div>

        <div className="tsk-stat-card">
          <div className="tsk-stat-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="tsk-stat-label">In QA / Review</span>
            <span className="tsk-stat-val">{inReviewCount}</span>
          </div>
        </div>

        <div className="tsk-stat-card">
          <div className="tsk-stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="tsk-stat-label">Completed</span>
            <span className="tsk-stat-val">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="tsk-toolbar">
        <div className="tsk-toolbar-left">
          {/* Search Box */}
          <div className="tsk-search-box">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search tasks, ID, or assignee..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            {searchQ && (
              <button className="tsk-clear-btn" onClick={() => setSearchQ('')}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Project Filter */}
          <select
            className="tsk-select"
            value={selectedProject}
            onChange={e => {
              setSelectedProject(e.target.value);
              setSelectedMilestone('All');
            }}
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            className="tsk-select"
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
          >
            {PRIORITIES.map(pri => (
              <option key={pri} value={pri}>{pri === 'All' ? 'All Priorities' : `${pri} Priority`}</option>
            ))}
          </select>

          {/* Role Filter Toggle (for employees) */}
          {isEmployee && (
            <div className="tsk-role-toggle">
              <button
                className={`tsk-toggle-btn ${filterMyTasksOnly ? 'tsk-toggle-btn--active' : ''}`}
                onClick={() => setFilterMyTasksOnly(true)}
              >
                My Tasks
              </button>
              <button
                className={`tsk-toggle-btn ${!filterMyTasksOnly ? 'tsk-toggle-btn--active' : ''}`}
                onClick={() => setFilterMyTasksOnly(false)}
              >
                All Team Tasks
              </button>
            </div>
          )}
        </div>

        <div className="tsk-toolbar-right">
          <div className="tsk-view-switch">
            <button
              className={`tsk-switch-btn ${viewMode === 'kanban' ? 'tsk-switch-btn--active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <LayoutGrid size={15} /> Kanban
            </button>
            <button
              className={`tsk-switch-btn ${viewMode === 'list' ? 'tsk-switch-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <ListFilter size={15} /> List
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="tsk-kanban-board">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div key={col.id} className="tsk-kanban-column">
                <div className="tsk-col-head">
                  <div className="tsk-col-head-left">
                    <span className="tsk-col-dot" style={{ background: col.color }} />
                    <h4 className="tsk-col-title">{col.title}</h4>
                  </div>
                  <span className="tsk-col-count">{colTasks.length}</span>
                </div>

                <div className="tsk-col-body">
                  {colTasks.length === 0 ? (
                    <div className="tsk-col-empty">No tasks in {col.title}</div>
                  ) : (
                    colTasks.map(task => {
                      const isPastDue = task.status !== 'Completed' && new Date(task.due) < TODAY;
                      const subtasks = task.subtasks || [];
                      const completedSubtasks = subtasks.filter(st => st.done).length;

                      return (
                        <div
                          key={task.id}
                          className="tsk-card"
                          onClick={() => setActiveTask(task)}
                        >
                          <div className="tsk-card-top">
                            <span className="tsk-card-id">{task.id}</span>
                            <span className={`tsk-pri-badge tsk-pri--${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                          </div>

                          <h5 className="tsk-card-title">{task.title}</h5>

                          <div className="tsk-card-project-tag">
                            <span className="tsk-tag-bullet">▪</span>
                            <span className="tsk-tag-pname">{task.projectName}</span>
                          </div>

                          {task.milestoneName && (
                            <div className="tsk-card-ms-tag">
                              <Flag size={11} />
                              <span>{task.milestoneName}</span>
                            </div>
                          )}

                          {/* Subtasks Progress */}
                          {subtasks.length > 0 && (
                            <div className="tsk-card-checklist-bar">
                              <div className="tsk-card-checklist-info">
                                <span className="tsk-card-cl-label">
                                  <CheckSquare size={11} /> {completedSubtasks}/{subtasks.length} subtasks
                                </span>
                                <span className="tsk-card-cl-pct">{task.progress}%</span>
                              </div>
                              <div className="tsk-bar-bg">
                                <div className="tsk-bar-fill" style={{ width: `${task.progress}%` }} />
                              </div>
                            </div>
                          )}

                          {/* Footer: Due date & Assignee */}
                          <div className="tsk-card-foot">
                            <div className={`tsk-card-due ${isPastDue ? 'tsk-card-due--overdue' : ''}`}>
                              <Calendar size={11} />
                              <span>{fmtDate(task.due)}</span>
                              {isPastDue && <span className="tsk-due-tag">Late</span>}
                            </div>

                            <div className="tsk-card-assignee" title={`Assigned to ${task.assignee}`}>
                              <div className="tsk-sm-avatar">{task.assigneeAvatar || 'EM'}</div>
                            </div>
                          </div>

                          {/* Fast Move Buttons */}
                          <div className="tsk-card-actions" onClick={e => e.stopPropagation()}>
                            {col.id !== 'To Do' && (
                              <button
                                className="tsk-move-btn"
                                onClick={() => moveTask(task, 'prev')}
                                title="Move to previous column"
                              >
                                <ChevronLeft size={13} />
                              </button>
                            )}
                            <button
                              className="tsk-card-manage-link"
                              onClick={() => setActiveTask(task)}
                            >
                              Manage
                            </button>
                            {col.id !== 'Completed' && (
                              <button
                                className="tsk-move-btn"
                                onClick={() => moveTask(task, 'next')}
                                title="Move to next column"
                              >
                                <ChevronRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST / TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="tsk-table-wrap">
          <table className="tsk-table">
            <thead>
              <tr>
                <th>Task ID & Title</th>
                <th>Project</th>
                <th>Milestone</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Checklist / Progress</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="tsk-table-empty">
                    No tasks found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => {
                  const isPastDue = task.status !== 'Completed' && new Date(task.due) < TODAY;
                  const subtasks = task.subtasks || [];
                  const completedSubtasks = subtasks.filter(st => st.done).length;

                  return (
                    <tr key={task.id}>
                      <td>
                        <div className="tsk-tbl-title">{task.title}</div>
                        <div className="tsk-tbl-id">{task.id}</div>
                      </td>
                      <td>{task.projectName}</td>
                      <td>
                        <span className="tsk-tbl-ms">
                          <Flag size={11} /> {task.milestoneName || '—'}
                        </span>
                      </td>
                      <td>
                        <div className="tsk-tbl-assignee">
                          <span className="tsk-sm-avatar">{task.assigneeAvatar || 'EM'}</span>
                          <span>{task.assignee}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`tsk-pri-badge tsk-pri--${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className={isPastDue ? 'tsk-cell-late' : ''}>
                        {fmtDate(task.due)}
                        {isPastDue && <span className="tsk-due-tag">Late</span>}
                      </td>
                      <td>
                        <div className="tsk-tbl-prog">
                          <div className="tsk-bar-bg" style={{ width: 60 }}>
                            <div className="tsk-bar-fill" style={{ width: `${task.progress}%` }} />
                          </div>
                          <span>{completedSubtasks}/{subtasks.length}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`tsk-status-pill tsk-sp--${task.status.toLowerCase().replace(/\s/g, '')}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="tsk-tbl-manage-btn"
                          onClick={() => setActiveTask(task)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: Task Details & Checklist Drawer */}
      {activeTask && (
        <div className="tsk-modal-overlay" onClick={() => setActiveTask(null)}>
          <div className="tsk-modal-content" onClick={e => e.stopPropagation()}>
            <div className="tsk-modal-head">
              <div>
                <div className="tsk-modal-breadcrumbs">
                  <span className="tsk-modal-pid">{activeTask.id}</span>
                  <span>·</span>
                  <span className="tsk-modal-pname">{activeTask.projectName}</span>
                  {activeTask.milestoneName && (
                    <>
                      <span>·</span>
                      <span className="tsk-modal-msname">{activeTask.milestoneName}</span>
                    </>
                  )}
                </div>
                <h3>{activeTask.title}</h3>
              </div>
              <button className="tsk-close-btn" onClick={() => setActiveTask(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="tsk-modal-body">
              {/* Quick Status Chips */}
              <div className="tsk-modal-section">
                <label className="tsk-lbl">Execution Status</label>
                <div className="tsk-status-selector">
                  {['To Do', 'In Progress', 'In Review', 'Completed'].map(st => (
                    <button
                      key={st}
                      className={`tsk-status-choice-btn ${activeTask.status === st ? 'tsk-choice-active' : ''}`}
                      onClick={() => {
                        const nextProg = st === 'Completed' ? 100 : st === 'To Do' ? 0 : activeTask.progress;
                        const updated = tasks.map(t => t.id === activeTask.id ? { ...t, status: st, progress: nextProg } : t);
                        updateTasksState(updated);
                        setActiveTask({ ...activeTask, status: st, progress: nextProg });
                        flash(`Status updated to ${st}`);
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta Grid */}
              <div className="tsk-modal-two-col">
                <div className="tsk-modal-meta-box">
                  <label className="tsk-lbl">Assignee</label>
                  <div className="tsk-meta-person">
                    <div className="tsk-sm-avatar">{activeTask.assigneeAvatar || 'EM'}</div>
                    <div>
                      <span className="tsk-meta-name">{activeTask.assignee}</span>
                      <span className="tsk-meta-sub">{activeTask.assigneeEmpId || 'Employee'}</span>
                    </div>
                  </div>
                </div>

                <div className="tsk-modal-meta-box">
                  <label className="tsk-lbl">Due Date & Priority</label>
                  <div className="tsk-meta-due-row">
                    <span className="tsk-meta-date">
                      <Calendar size={13} /> Due {fmtDate(activeTask.due)}
                    </span>
                    <span className={`tsk-pri-badge tsk-pri--${activeTask.priority.toLowerCase()}`}>
                      {activeTask.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {activeTask.description && (
                <div className="tsk-modal-section">
                  <label className="tsk-lbl">Scope & Details</label>
                  <p className="tsk-modal-desc">{activeTask.description}</p>
                </div>
              )}

              {/* Checklist / Subtasks Section */}
              <div className="tsk-modal-section">
                <div className="tsk-checklist-head">
                  <label className="tsk-lbl">
                    <CheckSquare size={13} /> Engineering Subtasks & Checkpoints
                  </label>
                  <span className="tsk-cl-pct">Progress: {activeTask.progress}%</span>
                </div>

                <div className="tsk-subtasks-list">
                  {(activeTask.subtasks || []).map(st => (
                    <label key={st.id} className="tsk-subtask-item">
                      <input
                        type="checkbox"
                        checked={st.done}
                        onChange={() => toggleSubtask(activeTask.id, st.id)}
                      />
                      <span className={`tsk-st-title ${st.done ? 'tsk-st-done' : ''}`}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Add new subtask row */}
                <div className="tsk-add-subtask-row">
                  <input
                    type="text"
                    className="tsk-input"
                    placeholder="Add a new checklist subtask..."
                    value={newSubtaskInput}
                    onChange={e => setNewSubtaskInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSubtaskToActive()}
                  />
                  <button className="tsk-btn-secondary" onClick={addSubtaskToActive}>
                    Add
                  </button>
                </div>
              </div>

              {/* Progress Notes / Activity Stream */}
              <div className="tsk-modal-section">
                <label className="tsk-lbl">
                  <MessageSquare size={13} /> Progress Updates & Engineering Notes
                </label>

                <div className="tsk-add-subtask-row">
                  <input
                    type="text"
                    className="tsk-input"
                    placeholder="Log a progress comment..."
                    value={newNoteInput}
                    onChange={e => setNewNoteInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addNoteToActive()}
                  />
                  <button className="tsk-btn-secondary" onClick={addNoteToActive}>
                    Post Note
                  </button>
                </div>

                <div className="tsk-notes-stream">
                  {(activeTask.notes || []).length === 0 ? (
                    <span className="tsk-notes-empty">No updates posted yet.</span>
                  ) : (
                    (activeTask.notes || []).map((n, i) => (
                      <div key={i} className="tsk-note-bubble">
                        <div className="tsk-note-meta">
                          <span className="tsk-note-author">{n.author || activeTask.assignee}</span>
                          <span className="tsk-note-time">{n.t}</span>
                        </div>
                        <p className="tsk-note-text">{n.m}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="tsk-modal-foot">
              <button className="tsk-btn-primary" onClick={() => setActiveTask(null)}>
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create New Task */}
      {showNewTaskModal && (
        <div className="tsk-modal-overlay" onClick={() => setShowNewTaskModal(false)}>
          <form className="tsk-modal-content" onClick={e => e.stopPropagation()} onSubmit={handleCreateTask}>
            <div className="tsk-modal-head">
              <div>
                <h3>Create New Project Task</h3>
                <p>Assign deliverables, milestones, and priority to team members</p>
              </div>
              <button type="button" className="tsk-close-btn" onClick={() => setShowNewTaskModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="tsk-modal-body">
              <label className="tsk-lbl">Task Title *</label>
              <input
                name="tTitle"
                className="tsk-input"
                placeholder="e.g. Calibrate optical inspection conveyor trigger"
                required
              />

              <div className="tsk-two-inputs" style={{ marginTop: 12 }}>
                <div>
                  <label className="tsk-lbl">Project *</label>
                  <select
                    name="tProject"
                    className="tsk-input"
                    value={formSelectedProject}
                    onChange={e => setFormSelectedProject(e.target.value)}
                    required
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="tsk-lbl">Milestone Linkage</label>
                  <select name="tMilestone" className="tsk-input">
                    {formMilestones.map(m => (
                      <option key={m.id} value={m.id}>{m.code}: {m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="tsk-two-inputs" style={{ marginTop: 12 }}>
                <div>
                  <label className="tsk-lbl">Assignee *</label>
                  <select name="tAssignee" className="tsk-input" defaultValue={currentUser.name}>
                    <option value="Priya Sundaram">Priya Sundaram (EMP-2041)</option>
                    <option value="Aarav Sharma">Aarav Sharma (EMP00101)</option>
                    <option value="Arun Kumar">Arun Kumar (EMP-1082)</option>
                    <option value="Meena Ramesh">Meena Ramesh (EMP-3012)</option>
                    <option value="Vignesh M.">Vignesh M. (EMP-2098)</option>
                  </select>
                </div>

                <div>
                  <label className="tsk-lbl">Priority</label>
                  <select name="tPriority" className="tsk-input" defaultValue="Medium">
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="tsk-two-inputs" style={{ marginTop: 12 }}>
                <div>
                  <label className="tsk-lbl">Due Date *</label>
                  <input name="tDue" type="date" className="tsk-input" required />
                </div>
              </div>

              <label className="tsk-lbl" style={{ marginTop: 12 }}>Task Description</label>
              <textarea
                name="tDesc"
                className="tsk-input"
                rows={3}
                placeholder="Technical specifications, requirements, or acceptance criteria..."
              />
            </div>

            <div className="tsk-modal-foot">
              <button type="submit" className="tsk-btn-primary">Create Task</button>
              <button type="button" className="tsk-btn-ghost" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
