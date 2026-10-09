import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Clock, CalendarCheck, AlertTriangle, CheckCircle2, Users, Search, PhoneCall, ArrowRight, ShieldAlert } from 'lucide-react';
import './Attendance.css';

const YEAR = 2026;
const MONTH = 9; // October (0-indexed)
const TODAY = 8;

const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const empMatches = (req, empName, empId) => {
  if (req.empId && empId && req.empId === empId) return true;
  if (!empName) return false;
  const firstName = empName.toLowerCase().split(' ')[0];
  return req.employeeName?.toLowerCase().includes(firstName);
};

const BASE_TEAM = [
  { name: 'Priya Sundaram', empId: 'EMP-2041', dept: 'Design & UX', in: '09:28 AM', status: 'Present' },
  { name: 'Arun Kumar', empId: 'EMP-1088', dept: 'Production', in: '—', status: 'Leave' },
  { name: 'Meena Ramesh', empId: 'EMP-1092', dept: 'Quality', in: '09:41 AM', status: 'Present' },
  { name: 'Vignesh M.', empId: 'EMP-1104', dept: 'Maintenance', in: '10:15 AM', status: 'Late' },
  { name: 'Aarav Sharma', empId: 'EMP-1042', dept: 'Engineering', in: '09:02 AM', status: 'Present' },
  { name: 'Suresh R.', empId: 'EMP-1150', dept: 'Operations', in: '—', status: 'Absent' },
];

export default function Attendance() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexa_auth')) || { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041' }; }
    catch { return { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041' }; }
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('nexa_leave_requests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleAuth = () => {
      try {
        const s = localStorage.getItem('nexa_auth');
        if (s) setUser(JSON.parse(s));
      } catch { /* ignore */ }
    };
    const handleLeaveUpdate = () => {
      try {
        const stored = localStorage.getItem('nexa_leave_requests');
        if (stored) setLeaveRequests(JSON.parse(stored));
      } catch { /* ignore */ }
    };

    window.addEventListener('nexa_role_change', handleAuth);
    window.addEventListener('storage', handleAuth);
    window.addEventListener('storage', handleLeaveUpdate);
    window.addEventListener('nexa_leave_updated', handleLeaveUpdate);

    return () => {
      window.removeEventListener('nexa_role_change', handleAuth);
      window.removeEventListener('storage', handleAuth);
      window.removeEventListener('storage', handleLeaveUpdate);
      window.removeEventListener('nexa_leave_updated', handleLeaveUpdate);
    };
  }, []);

  const isEmployee = user?.role === 'employee';
  const currentEmpId = user?.empId || 'EMP-2041';
  const currentEmpName = user?.name || 'Priya Sundaram';
  const key = `nexa_att_${currentEmpId}`;

  const [todayPunch, setTodayPunch] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || { in: null, out: null }; }
    catch { return { in: null, out: null }; }
  });

  useEffect(() => {
    try { setTodayPunch(JSON.parse(localStorage.getItem(key)) || { in: null, out: null }); }
    catch { setTodayPunch({ in: null, out: null }); }
  }, [key]);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const savePunch = (v) => {
    setTodayPunch(v);
    localStorage.setItem(key, JSON.stringify(v));
  };
  const checkIn = () => savePunch({ in: fmt(new Date()), out: null });
  const checkOut = () => savePunch({ ...todayPunch, out: fmt(new Date()) });

  // Helper to check if a specific calendar day in Oct 2026 has a leave request for an employee
  const getLeaveForDay = (day, empName, empId) => {
    const checkDate = new Date(YEAR, MONTH, day, 12, 0, 0);
    for (const req of leaveRequests) {
      if (empMatches(req, empName, empId)) {
        if (req.fromDate && req.toDate) {
          const from = new Date(req.fromDate);
          const to = new Date(req.toDate);
          from.setHours(0, 0, 0, 0);
          to.setHours(23, 59, 59, 999);
          if (checkDate >= from && checkDate <= to) {
            return req;
          }
        }
      }
    }
    return null;
  };

  // Build employee historical logs considering blocked/approved leaves
  const history = useMemo(() => {
    const rows = [];
    for (let day = 1; day < TODAY; day++) {
      const date = new Date(YEAR, MONTH, day);
      const dow = date.getDay();
      const leaveReq = getLeaveForDay(day, currentEmpName, currentEmpId);

      if (leaveReq) {
        if (leaveReq.status === 'Dates Blocked (Pending Regularisation)') {
          rows.push({
            day,
            date,
            status: 'Emergency Blocked',
            statusClass: 'blocked',
            in: '—',
            out: '—',
            hours: '—',
            note: 'Manager Blocked via Phone'
          });
        } else {
          rows.push({
            day,
            date,
            status: 'Leave',
            statusClass: 'leave',
            in: '—',
            out: '—',
            hours: '—',
            note: leaveReq.leaveType
          });
        }
      } else if (dow === 0 || dow === 6) {
        rows.push({ day, date, status: 'Weekend', statusClass: 'weekend', in: '—', out: '—', hours: '—' });
      } else if (day === 6) {
        rows.push({ day, date, status: 'Leave', statusClass: 'leave', in: '—', out: '—', hours: '—' });
      } else if (day === 3) {
        rows.push({ day, date, status: 'Late', statusClass: 'late', in: '10:12 AM', out: '06:41 PM', hours: '8h 29m' });
      } else {
        rows.push({ day, date, status: 'Present', statusClass: 'present', in: '09:28 AM', out: '06:34 PM', hours: '9h 06m' });
      }
    }
    return rows;
  }, [leaveRequests, currentEmpName, currentEmpId]);

  const [q, setQ] = useState('');

  // Check today's leave status for current employee
  const todayLeave = getLeaveForDay(TODAY, currentEmpName, currentEmpId);
  const isTodayBlocked = todayLeave?.status === 'Dates Blocked (Pending Regularisation)';
  const isTodayApprovedLeave = todayLeave && !isTodayBlocked;

  // Unregularised blocked leaves for banner
  const pendingBlockedLeaves = leaveRequests.filter(req =>
    empMatches(req, currentEmpName, currentEmpId) &&
    req.status === 'Dates Blocked (Pending Regularisation)' &&
    !req.regularised
  );

  const present = history.filter(r => r.status === 'Present' || r.status === 'Late').length + (todayPunch.in ? 1 : 0);
  const late = history.filter(r => r.status === 'Late').length;
  const leaves = history.filter(r => r.status === 'Leave').length + (isTodayApprovedLeave ? 1 : 0);
  const blockedDaysCount = history.filter(r => r.status === 'Emergency Blocked').length + (isTodayBlocked ? 1 : 0);

  // Calendar cells calculation
  const firstDow = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    let status = 'Upcoming';
    let statusClass = 'upcoming';

    const reqForDay = getLeaveForDay(d, currentEmpName, currentEmpId);

    if (reqForDay) {
      if (reqForDay.status === 'Dates Blocked (Pending Regularisation)') {
        status = 'Emergency Blocked';
        statusClass = 'blocked';
      } else {
        status = 'Leave';
        statusClass = 'leave';
      }
    } else if (d === TODAY) {
      status = todayPunch.in ? 'Present' : 'Today';
      statusClass = todayPunch.in ? 'present' : 'today';
    } else if (d < TODAY) {
      const hist = history[d - 1];
      status = hist?.status || 'Present';
      statusClass = hist?.statusClass || 'present';
    } else if (new Date(YEAR, MONTH, d).getDay() % 6 === 0) {
      status = 'Weekend';
      statusClass = 'weekend';
    }

    cells.push({ d, status, statusClass });
  }

  // ─── ADMIN / MANAGER VIEW ───
  if (!isEmployee) {
    const teamWithLeaves = BASE_TEAM.map(member => {
      const req = getLeaveForDay(TODAY, member.name, member.empId);
      if (req) {
        if (req.status === 'Dates Blocked (Pending Regularisation)') {
          return {
            ...member,
            in: '—',
            status: 'Emergency Blocked',
            statusClass: 'blocked',
            notes: `Blocked by ${req.blockedBy || 'Manager'} (Emergency Call)`
          };
        } else {
          return {
            ...member,
            in: '—',
            status: 'Leave',
            statusClass: 'leave',
            notes: req.leaveType
          };
        }
      }
      return { ...member, statusClass: member.status.toLowerCase(), notes: null };
    });

    const rows = teamWithLeaves.filter(t =>
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      t.dept.toLowerCase().includes(q.toLowerCase()) ||
      t.status.toLowerCase().includes(q.toLowerCase())
    );

    const count = (s) => teamWithLeaves.filter(t => t.status === s).length;

    return (
      <div className="att-page">
        <div className="att-stats">
          <Stat icon={Users} label="Total Staff" val={teamWithLeaves.length} color="#2563eb" bg="#eff6ff" />
          <Stat icon={CheckCircle2} label="Present" val={count('Present')} color="#10b981" bg="#ecfdf5" />
          <Stat icon={AlertTriangle} label="Late" val={count('Late')} color="#f59e0b" bg="#fffbeb" />
          <Stat icon={CalendarCheck} label="Emergency Blocked / Leave" val={count('Emergency Blocked') + count('Leave')} color="#d97706" bg="#fef3c7" />
        </div>

        <div className="att-card">
          <div className="att-card-head">
            <div>
              <h3>Today's Team Attendance · {TODAY} Oct 2026</h3>
              <p className="att-card-sub">Real-time presence synchronized with manager emergency leave bookings</p>
            </div>
            <div className="att-search">
              <Search size={14} />
              <input
                placeholder="Search employee, dept, or status"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>

          <table className="att-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Check-in</th>
                <th>Attendance Status</th>
                <th>Intake Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(t => (
                <tr key={t.name}>
                  <td>
                    <strong>{t.name}</strong>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{t.empId}</div>
                  </td>
                  <td>{t.dept}</td>
                  <td>{t.in}</td>
                  <td>
                    <span className={`att-pill att-${t.statusClass}`}>
                      {t.status === 'Emergency Blocked' ? '📞 Emergency Blocked' : t.status}
                    </span>
                  </td>
                  <td>
                    {t.notes ? (
                      <span className="att-intake-note">{t.notes}</span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 11.5 }}>Standard log</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="att-empty">No matching employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── EMPLOYEE VIEW ───
  return (
    <div className="att-page">
      {/* Emergency Blocked Alert Banner for Employee */}
      {pendingBlockedLeaves.length > 0 && (
        <div className="att-blocked-banner">
          <div className="att-blocked-banner-left">
            <div className="att-blocked-icon">
              <PhoneCall size={22} color="#b45309" />
            </div>
            <div>
              <div className="att-blocked-tag">Action Required · Emergency Leave Reservation</div>
              <h4 className="att-blocked-title">
                Manager Blocked Leave: {pendingBlockedLeaves[0].dates} ({pendingBlockedLeaves[0].days} {pendingBlockedLeaves[0].days === 1 ? 'Day' : 'Days'})
              </h4>
              <p className="att-blocked-desc">
                Your manager blocked these dates following your emergency phone call intake outside office premises.
                Now that you are in office, please regularise this absence in <strong>Leave Management</strong> with your formal reason and supporting medical/proof documents.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="att-btn-regularise"
            onClick={() => navigate('/leave')}
          >
            Regularise in Leave Management <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Check-in / Punch Card */}
      <div className="att-punch">
        <div>
          <p className="att-punch-label">{now.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <h2 className="att-punch-time"><Clock size={22} /> {fmt(now)}</h2>
          <p className="att-punch-sub">
            {isTodayBlocked ? (
              <span style={{ color: '#fed7aa', fontWeight: 700 }}>
                ⚠️ Today is marked as Emergency Blocked by your Manager.
              </span>
            ) : todayPunch.in ? (
              `Checked in at ${todayPunch.in}`
            ) : (
              'You have not checked in today'
            )}
            {todayPunch.out ? ` · Checked out at ${todayPunch.out}` : ''}
          </p>
        </div>
        <div className="att-punch-actions">
          <button
            className="att-btn att-btn--in"
            onClick={checkIn}
            disabled={!!todayPunch.in || isTodayBlocked}
            title={isTodayBlocked ? 'Cannot check in: dates blocked by manager' : 'Check in for today'}
          >
            <LogIn size={16} /> Check In
          </button>
          <button
            className="att-btn att-btn--out"
            onClick={checkOut}
            disabled={!todayPunch.in || !!todayPunch.out}
          >
            <LogOut size={16} /> Check Out
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="att-stats">
        <Stat icon={CheckCircle2} label="Days Present" val={present} color="#10b981" bg="#ecfdf5" />
        <Stat icon={AlertTriangle} label="Late Marks" val={late} color="#f59e0b" bg="#fffbeb" />
        <Stat icon={CalendarCheck} label="Leave Days" val={leaves} color="#2563eb" bg="#eff6ff" />
        <Stat icon={ShieldAlert} label="Emergency Blocked" val={blockedDaysCount} color="#d97706" bg="#fef3c7" />
      </div>

      <div className="att-grid">
        {/* Calendar View */}
        <div className="att-card">
          <div className="att-card-head">
            <h3>October 2026</h3>
          </div>
          <div className="att-cal">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="att-cal-h">{d}</div>
            ))}
            {cells.map((c, i) => c ? (
              <div
                key={i}
                className={`att-cal-c att-c-${c.statusClass}`}
                title={c.status}
              >
                {c.d}
              </div>
            ) : (
              <div key={i} />
            ))}
          </div>
          <div className="att-legend">
            <span><i className="att-c-present" /> Present</span>
            <span><i className="att-c-late" /> Late</span>
            <span><i className="att-c-leave" /> Leave</span>
            <span><i className="att-c-blocked" /> Emergency Blocked</span>
            <span><i className="att-c-weekend" /> Weekend</span>
          </div>
        </div>

        {/* Daily Log Table */}
        <div className="att-card">
          <div className="att-card-head">
            <h3>Daily Log</h3>
          </div>
          <div className="att-scroll">
            <table className="att-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Today row */}
                <tr>
                  <td>{TODAY} Oct (Today)</td>
                  <td>{todayPunch.in || '—'}</td>
                  <td>{todayPunch.out || '—'}</td>
                  <td>{todayPunch.in ? 'Active' : '—'}</td>
                  <td>
                    {isTodayBlocked ? (
                      <span className="att-pill att-blocked" title="Manager blocked via phone call">
                        📞 Emergency Blocked
                      </span>
                    ) : todayPunch.in ? (
                      <span className="att-pill att-present">Present</span>
                    ) : (
                      <span className="att-pill att-today">Pending Check-in</span>
                    )}
                  </td>
                </tr>

                {/* Historical rows */}
                {[...history].reverse().map(r => (
                  <tr key={r.day}>
                    <td>{r.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', weekday: 'short' })}</td>
                    <td>{r.in}</td>
                    <td>{r.out}</td>
                    <td>{r.hours}</td>
                    <td>
                      <span className={`att-pill att-${r.statusClass}`}>
                        {r.status === 'Emergency Blocked' ? '📞 Emergency Blocked' : r.status}
                      </span>
                    </td>
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
      <div className="att-stat-icon" style={{ background: bg, color }}>
        <Icon size={18} />
      </div>
      <div>
        <p className="att-stat-val" style={{ color }}>{val}</p>
        <p className="att-stat-label">{label}</p>
      </div>
    </div>
  );
}
