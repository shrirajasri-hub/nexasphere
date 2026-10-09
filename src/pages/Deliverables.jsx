import { useState, useEffect, useMemo } from 'react';
import { FolderKanban, CheckCircle2, Clock, AlertTriangle, Search, X, Plus, MessageSquare, Calendar } from 'lucide-react';
import './Deliverables.css';

const STATUSES = ['Not Started', 'In Progress', 'In Review', 'Completed'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const TODAY = new Date('2026-10-08');

const SEED = [
  { id: 'DL-101', title: 'Automation Line A – UI Screens', project: 'Automation Line A', owner: 'Priya Sundaram', empId: 'EMP-2041', due: '2026-10-14', priority: 'High', status: 'In Progress', progress: 70, notes: [{ t: '05 Oct', m: 'Operator dashboard wireframes approved.' }] },
  { id: 'DL-102', title: 'Design System v2 Component Library', project: 'Production MIS Dashboard', owner: 'Priya Sundaram', empId: 'EMP-2041', due: '2026-10-20', priority: 'Medium', status: 'In Progress', progress: 45, notes: [] },
  { id: 'DL-103', title: 'Vision Inspection – Result Screen Mockups', project: 'Vision Inspection System', owner: 'Priya Sundaram', empId: 'EMP-2041', due: '2026-10-05', priority: 'High', status: 'In Review', progress: 95, notes: [{ t: '07 Oct', m: 'Submitted to Arun K. for review.' }] },
  { id: 'DL-104', title: 'Tool Life Tracking – Alert Flow UX', project: 'Tool Life & Calibration Tracking', owner: 'Priya Sundaram', empId: 'EMP-2041', due: '2026-10-03', priority: 'High', status: 'In Progress', progress: 38, notes: [] },
  { id: 'DL-105', title: 'Accessibility Audit (WCAG 2.1)', project: 'Production MIS Dashboard', owner: 'Priya Sundaram', empId: 'EMP-2041', due: '2026-09-28', priority: 'Low', status: 'Completed', progress: 100, notes: [{ t: '28 Sep', m: 'Audit report shared with engineering.' }] },
  { id: 'DL-106', title: 'PLC Integration Test Plan', project: 'Automation Line A', owner: 'Aarav Sharma', empId: 'EMP00101', due: '2026-10-18', priority: 'Medium', status: 'In Progress', progress: 55, notes: [] },
  { id: 'DL-107', title: 'Calibration Report Template', project: 'Tool Life & Calibration Tracking', owner: 'Meena Ramesh', empId: 'EMP-3012', due: '2026-10-12', priority: 'Medium', status: 'Not Started', progress: 0, notes: [] },
];

const isOverdue = (d) => d.status !== 'Completed' && new Date(d.due) < TODAY;
const fmtDate = (s) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Deliverables() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexa_auth')) || { role: 'employee', empId: 'EMP-2041', name: 'Priya Sundaram' }; }
    catch { return { role: 'employee', empId: 'EMP-2041', name: 'Priya Sundaram' }; }
  });
  useEffect(() => {
    const h = () => { try { const s = localStorage.getItem('nexa_auth'); if (s) setUser(JSON.parse(s)); } catch { /* ignore */ } };
    window.addEventListener('nexa_role_change', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('nexa_role_change', h); window.removeEventListener('storage', h); };
  }, []);

  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexa_deliverables')) || SEED; } catch { return SEED; }
  });
  const persist = (next) => { setItems(next); localStorage.setItem('nexa_deliverables', JSON.stringify(next)); };

  const isEmployee = user?.role === 'employee';
  const mine = useMemo(
    () => (isEmployee ? items.filter(d => d.empId === (user.empId || 'EMP-2041')) : items),
    [items, isEmployee, user]
  );

  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [active, setActive] = useState(null);
  const [note, setNote] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ title: '', project: '', due: '', priority: 'Medium' });

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const list = mine.filter(d =>
    (filter === 'All' || (filter === 'Overdue' ? isOverdue(d) : d.status === filter)) &&
    (d.title + d.project + d.owner).toLowerCase().includes(q.toLowerCase())
  );

  const total = mine.length;
  const done = mine.filter(d => d.status === 'Completed').length;
  const inProg = mine.filter(d => d.status === 'In Progress' || d.status === 'In Review').length;
  const overdue = mine.filter(isOverdue).length;

  const update = (id, patch) => {
    const next = items.map(d => d.id === id ? { ...d, ...patch } : d);
    persist(next);
    setActive(next.find(d => d.id === id));
  };

  const setStatus = (d, status) => {
    const progress = status === 'Completed' ? 100 : status === 'Not Started' ? 0 : Math.min(Math.max(d.progress, status === 'In Review' ? 90 : 5), status === 'In Review' ? 99 : 95);
    update(d.id, { status, progress });
    flash(`"${d.title}" moved to ${status}`);
  };

  const addNote = (d) => {
    if (!note.trim()) return;
    const t = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    update(d.id, { notes: [{ t, m: note.trim() }, ...d.notes] });
    setNote('');
  };

  const createItem = (e) => {
    e.preventDefault();
    const nextNum = 101 + items.length;
    const item = {
      id: `DL-${nextNum}`, title: form.title.trim(), project: form.project.trim() || 'General',
      owner: user.name || 'Priya Sundaram', empId: user.empId || 'EMP-2041',
      due: form.due, priority: form.priority, status: 'Not Started', progress: 0, notes: [],
    };
    persist([item, ...items]);
    setShowNew(false);
    setForm({ title: '', project: '', due: '', priority: 'Medium' });
    flash('Project added');
  };

  return (
    <div className="dl-page">
      {toast && <div className="dl-toast"><CheckCircle2 size={16} color="#10b981" /> {toast}</div>}

      <div className="dl-stats">
        <Stat icon={FolderKanban} label={isEmployee ? 'My Projects' : 'All Projects'} val={total} color="#2563eb" bg="#eff6ff" />
        <Stat icon={Clock} label="In Progress / Review" val={inProg} color="#f59e0b" bg="#fffbeb" />
        <Stat icon={CheckCircle2} label="Completed" val={done} color="#10b981" bg="#ecfdf5" />
        <Stat icon={AlertTriangle} label="Overdue" val={overdue} color="#ef4444" bg="#fef2f2" />
      </div>

      <div className="dl-card">
        <div className="dl-toolbar">
          <div className="dl-chips">
            {['All', ...STATUSES, 'Overdue'].map(s => (
              <button key={s} className={`dl-chip ${filter === s ? 'dl-chip--on' : ''}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
          <div className="dl-tools-right">
            <div className="dl-search"><Search size={14} />
              <input placeholder="Search project or task" value={q} onChange={e => setQ(e.target.value)} />
            </div>
            {isEmployee && <button className="dl-btn" onClick={() => setShowNew(true)}><Plus size={14} /> Add Project Item</button>}
          </div>
        </div>

        <div className="dl-scroll">
          <table className="dl-table">
            <thead>
              <tr>
                <th>Project Task</th>{!isEmployee && <th>Owner</th>}<th>Project</th><th>Due</th>
                <th>Priority</th><th>Progress</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={8} className="dl-empty">No projects match this view.</td></tr>}
              {list.map(d => (
                <tr key={d.id}>
                  <td><div className="dl-title">{d.title}</div><div className="dl-id">{d.id}</div></td>
                  {!isEmployee && <td>{d.owner}</td>}
                  <td>{d.project}</td>
                  <td className={isOverdue(d) ? 'dl-late' : ''}>
                    <Calendar size={12} /> {fmtDate(d.due)}{isOverdue(d) && <span className="dl-late-tag">Overdue</span>}
                  </td>
                  <td><span className={`dl-pri dl-pri--${d.priority.toLowerCase()}`}>{d.priority}</span></td>
                  <td>
                    <div className="dl-bar"><div style={{ width: `${d.progress}%` }} /></div>
                    <span className="dl-pct">{d.progress}%</span>
                  </td>
                  <td><span className={`dl-status dl-s-${d.status.replace(/\s/g, '').toLowerCase()}`}>{d.status}</span></td>
                  <td><button className="dl-link" onClick={() => { setActive(d); setNote(''); }}>{isEmployee ? 'Update' : 'View'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {active && (
        <div className="dl-overlay" onClick={() => setActive(null)}>
          <div className="dl-modal" onClick={e => e.stopPropagation()}>
            <div className="dl-modal-head">
              <div>
                <span className={`dl-status dl-s-${active.status.replace(/\s/g, '').toLowerCase()}`}>{active.status}</span>
                <h3>{active.title}</h3>
                <p>{active.id} · {active.project} · Due {fmtDate(active.due)}</p>
              </div>
              <button className="dl-x" onClick={() => setActive(null)}><X size={18} /></button>
            </div>

            <div className="dl-modal-body">
              <label className="dl-lbl">Progress: {active.progress}%</label>
              <input type="range" min="0" max="100" step="5" value={active.progress}
                disabled={!isEmployee || active.status === 'Completed'}
                onChange={e => update(active.id, { progress: +e.target.value, status: +e.target.value === 0 ? 'Not Started' : active.status === 'Not Started' ? 'In Progress' : active.status })}
                className="dl-range" />

              {isEmployee && (
                <>
                  <label className="dl-lbl" style={{ marginTop: 14 }}>Update Status</label>
                  <div className="dl-chips">
                    {STATUSES.map(s => (
                      <button key={s} className={`dl-chip ${active.status === s ? 'dl-chip--on' : ''}`} onClick={() => setStatus(active, s)}>{s}</button>
                    ))}
                  </div>
                </>
              )}

              <label className="dl-lbl" style={{ marginTop: 14 }}><MessageSquare size={12} /> Progress Notes</label>
              {isEmployee && (
                <div className="dl-note-row">
                  <input className="dl-input" placeholder="Add a progress update..." value={note}
                    onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote(active)} />
                  <button className="dl-btn" onClick={() => addNote(active)}>Add</button>
                </div>
              )}
              <ul className="dl-notes">
                {active.notes.length === 0 && <li className="dl-empty">No notes yet.</li>}
                {active.notes.map((n, i) => <li key={i}><b>{n.t}</b> — {n.m}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="dl-overlay" onClick={() => setShowNew(false)}>
          <form className="dl-modal" onClick={e => e.stopPropagation()} onSubmit={createItem}>
            <div className="dl-modal-head"><div><h3>Add Project Task</h3><p>Track a new project deliverable or task assigned to you.</p></div>
              <button type="button" className="dl-x" onClick={() => setShowNew(false)}><X size={18} /></button></div>
            <div className="dl-modal-body">
              <label className="dl-lbl">Title *</label>
              <input className="dl-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <label className="dl-lbl" style={{ marginTop: 12 }}>Project</label>
              <input className="dl-input" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} />
              <div className="dl-two">
                <div><label className="dl-lbl">Due Date *</label>
                  <input type="date" className="dl-input" required value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} /></div>
                <div><label className="dl-lbl">Priority</label>
                  <select className="dl-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select></div>
              </div>
              <div className="dl-foot"><button type="submit" className="dl-btn">Save Project Item</button></div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, val, color, bg }) {
  return (
    <div className="dl-stat">
      <div className="dl-stat-icon" style={{ background: bg, color }}><Icon size={18} /></div>
      <div><p className="dl-stat-val" style={{ color }}>{val}</p><p className="dl-stat-label">{label}</p></div>
    </div>
  );
}
