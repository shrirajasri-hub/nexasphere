import { useState, useEffect, useMemo } from 'react';
import { LogIn, LogOut, Clock, CalendarCheck, AlertTriangle, CheckCircle2, Users, Search } from 'lucide-react';
import './Attendance.css';

const YEAR = 2026;
const MONTH = 9; // October (0-indexed)
const TODAY = 8;

const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

// Deterministic sample history for days 1..TODAY-1
function buildHistory() {
  const rows = [];
  for (let day = 1; day < TODAY; day++) {
    const date = new Date(YEAR, MONTH, day);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) {
      rows.push({ day, date, status: 'Weekend', in: '—', out: '—', hours: '—' });
    } else if (day === 6) {
      rows.push({ day, date, status: 'Leave', in: '—', out: '—', hours: '—' });
    } else if (day === 3) {
      rows.push({ day, date, status: 'Late', in: '10:12 AM', out: '06:41 PM', hours: '8h 29m' });
    } else {
      rows.push({ day, date, status: 'Present', in: '09:28 AM', out: '06:34 PM', hours: '9h 06m' });
    }
  }
  return rows;
}

const TEAM = [
  { name: 'Priya Sundaram', dept: 'Design & UX', in: '09:28 AM', status: 'Present' },
  { name: 'Arun Kumar', dept: 'Production', in: '—', status: 'Leave' },
  { name: 'Meena Ramesh', dept: 'Quality', in: '09:41 AM', status: 'Present' },
  { name: 'Vignesh M.', dept: 'Maintenance', in: '10:15 AM', status: 'Late' },
  { name: 'Aarav Sharma', dept: 'Engineering', in: '09:02 AM', status: 'Present' },
  { name: 'Suresh R.', dept: 'Operations', in: '—', status: 'Absent' },
];

export default function Attendance() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexa_auth')) || { role: 'employee' }; }
    catch { return { role: 'employee' }; }
  });
  useEffect(() => {
    const h = () => { try { const s = localStorage.getItem('nexa_auth'); if (s) setUser(JSON.parse(s)); } catch { /* ignore */ } };
    window.addEventListener('nexa_role_change', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('nexa_role_change', h); window.removeEventListener('storage', h); };
  }, []);

  const isEmployee = user?.role === 'employee';
  const key = `nexa_att_${user?.empId || 'EMP-2041'}`;

  const [today, setToday] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || { in: null, out: null }; }
    catch { return { in: null, out: null }; }
  });
  useEffect(() => {
    try { setToday(JSON.parse(localStorage.getItem(key)) || { in: null, out: null }); }
    catch { setToday({ in: null, out: null }); }
  }, [key]);

  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  const save = (v) => { setToday(v); localStorage.setItem(key, JSON.stringify(v)); };
  const checkIn = () => save({ in: fmt(new Date()), out: null });
  const checkOut = () => save({ ...today, out: fmt(new Date()) });

  const history = useMemo(buildHistory, []);
  const [q, setQ] = useState('');

  const present = history.filter(r => r.status === 'Present' || r.status === 'Late').length + (today.in ? 1 : 0);
  const late = history.filter(r => r.status === 'Late').length;
  const leaves = history.filter(r => r.status === 'Leave').length;

  const firstDow = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    let status = 'Upcoming';
    if (d === TODAY) status = today.in ? 'Present' : 'Today';
    else if (d < TODAY) status = history[d - 1].status;
    else if (new Date(YEAR, MONTH, d).getDay() % 6 === 0) status = 'Weekend';
    cells.push({ d, status });
  }

  if (!isEmployee) {
    const rows = TEAM.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || t.dept.toLowerCase().includes(q.toLowerCase()));
    const count = (s) => TEAM.filter(t => t.status === s).length;
    return (
      <div className="att-page">
        <div className="att-stats">
          <Stat icon={Users} label="Total Staff" val={TEAM.length} color="#2563eb" bg="#eff6ff" />
          <Stat icon={CheckCircle2} label="Present" val={count('Present')} color="#10b981" bg="#ecfdf5" />
          <Stat icon={AlertTriangle} label="Late" val={count('Late')} color="#f59e0b" bg="#fffbeb" />
          <Stat icon={CalendarCheck} label="On Leave / Absent" val={count('Leave') + count('Absent')} color="#ef4444" bg="#fef2f2" />
        </div>
        <div className="att-card">
          <div className="att-card-head">
            <h3>Today's Team Attendance · {TODAY} Oct 2026</h3>
            <div className="att-search"><Search size={14} />
              <input placeholder="Search name or department" value={q} onChange={e => setQ(e.target.value)} />
            </div>
          </div>
          <table className="att-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Check-in</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map(t => (
                <tr key={t.name}>
                  <td><strong>{t.name}</strong></td><td>{t.dept}</td><td>{t.in}</td>
                  <td><span className={`att-pill att-${t.status.toLowerCase()}`}>{t.status}</span></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4} className="att-empty">No matching employees.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="att-page">
      <div className="att-punch">
        <div>
          <p className="att-punch-label">{now.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <h2 className="att-punch-time"><Clock size={22} /> {fmt(now)}</h2>
          <p className="att-punch-sub">
            {today.in ? `Checked in at ${today.in}` : 'You have not checked in today'}
            {today.out ? ` · Checked out at ${today.out}` : ''}
          </p>
        </div>
        <div className="att-punch-actions">
          <button className="att-btn att-btn--in" onClick={checkIn} disabled={!!today.in}><LogIn size={16} /> Check In</button>
          <button className="att-btn att-btn--out" onClick={checkOut} disabled={!today.in || !!today.out}><LogOut size={16} /> Check Out</button>
        </div>
      </div>

      <div className="att-stats">
        <Stat icon={CheckCircle2} label="Days Present" val={present} color="#10b981" bg="#ecfdf5" />
        <Stat icon={AlertTriangle} label="Late Marks" val={late} color="#f59e0b" bg="#fffbeb" />
        <Stat icon={CalendarCheck} label="Leave Days" val={leaves} color="#2563eb" bg="#eff6ff" />
        <Stat icon={Clock} label="Avg Hours / Day" val="9h 02m" color="#7c3aed" bg="#f5f3ff" />
      </div>

      <div className="att-grid">
        <div className="att-card">
          <div className="att-card-head"><h3>October 2026</h3></div>
          <div className="att-cal">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="att-cal-h">{d}</div>)}
            {cells.map((c, i) => c
              ? <div key={i} className={`att-cal-c att-c-${c.status.toLowerCase()}`} title={c.status}>{c.d}</div>
              : <div key={i} />)}
          </div>
          <div className="att-legend">
            <span><i className="att-c-present" /> Present</span><span><i className="att-c-late" /> Late</span>
            <span><i className="att-c-leave" /> Leave</span><span><i className="att-c-weekend" /> Weekend</span>
          </div>
        </div>

        <div className="att-card">
          <div className="att-card-head"><h3>Daily Log</h3></div>
          <div className="att-scroll">
            <table className="att-table">
              <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Status</th></tr></thead>
              <tbody>
                {today.in && (
                  <tr><td>{TODAY} Oct (Today)</td><td>{today.in}</td><td>{today.out || '—'}</td><td>—</td>
                    <td><span className="att-pill att-present">Present</span></td></tr>
                )}
                {[...history].reverse().map(r => (
                  <tr key={r.day}>
                    <td>{r.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', weekday: 'short' })}</td>
                    <td>{r.in}</td><td>{r.out}</td><td>{r.hours}</td>
                    <td><span className={`att-pill att-${r.status.toLowerCase()}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, val, color, bg }) {
  return (
    <div className="att-stat">
      <div className="att-stat-icon" style={{ background: bg, color }}><Icon size={18} /></div>
      <div><p className="att-stat-val" style={{ color }}>{val}</p><p className="att-stat-label">{label}</p></div>
    </div>
  );
}
