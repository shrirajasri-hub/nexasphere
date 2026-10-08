import { useState } from 'react';
import { Link } from 'react-router-dom';

// Employees that have a full profile dossier (see pages/EmployeeProfile.jsx)
const PROFILE_IDS = ['EMP00101', 'EMP00102', 'EMP-2041'];
import {
  UserPlus, Search, Download, Upload,
  Edit2, Trash2, Eye, ChevronLeft, ChevronRight,
  X, Camera, Save, Users, UserCheck, UserX, Briefcase,
  Phone, Mail, MapPin, Building2, Shield,
  FileText, CreditCard, Clock, ChevronDown, CheckCircle2,
  AlertTriangle, Lock
} from 'lucide-react';
import './EmployeeMaster.css';

/* ─ Tabs for Add/Edit form ─ */
const FORM_TABS = [
  { id: 'personal',    label: 'Personal Info',    icon: UserCheck },
  { id: 'employment',  label: 'Employment',        icon: Briefcase },
  { id: 'contact',     label: 'Contact & Address', icon: MapPin },
  { id: 'bank',        label: 'Bank & Statutory',  icon: CreditCard },
  { id: 'documents',   label: 'Documents',         icon: FileText },
  { id: 'access',      label: 'Access & Role',     icon: Shield },
];

const STATUS_COLORS = {
  Active:     { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  Inactive:   { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
  Probation:  { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  Terminated: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const TABLE_COLUMNS = [
  'Emp ID', 'Employee Name', 'Designation', 'Department', 'Branch', 'Date of Join', 'Status', 'Actions'
];

/* ─ Department filter options ─ */
const DEPARTMENTS = ['All Departments', 'Engineering', 'HR', 'Finance', 'Sales', 'Operations', 'Quality', 'Maintenance', 'Design', 'Production'];
const STATUSES    = ['All Status', 'Active', 'Inactive', 'Probation', 'Terminated'];

const INITIAL_EMPLOYEES = [
  {
    id: 'EMP00101',
    firstName: 'Aarav',
    lastName: 'Sharma',
    fullName: 'Aarav Sharma',
    gender: 'Male',
    dob: '1992-06-15',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    nationality: 'Indian',
    designation: 'Senior Lead Architect',
    department: 'Engineering',
    branch: 'Headquarters (Bangalore)',
    doj: '2023-04-10',
    status: 'Active',
    workEmail: 'aarav.sharma@nexasphere.com',
    personalEmail: 'aarav.personal@gmail.com',
    phone: '+91 98450 12345',
    emergencyContactName: 'Ananya Sharma (Spouse)',
    emergencyPhone: '+91 98450 99881',
    currentAddress: '42, Indiranagar 100ft Road, Bangalore, Karnataka',
    bankName: 'HDFC Bank',
    branchName: 'Indiranagar Branch',
    accountNumber: '50100492819201',
    ifscCode: 'HDFC0001042',
    accountType: 'Savings',
    panNumber: 'ABCPS1234K',
    uanNumber: '100928374615',
    esiNumber: '310928374615001',
    role: 'Engineering Lead',
    portalAccess: 'Enabled',
    reportingManager: 'Vikram Malhotra (VP Tech)'
  },
  {
    id: 'EMP00102',
    firstName: 'Priya',
    lastName: 'Patel',
    fullName: 'Priya Patel',
    gender: 'Female',
    dob: '1995-11-20',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    designation: 'HR Operations Lead',
    department: 'HR',
    branch: 'Headquarters (Bangalore)',
    doj: '2024-01-15',
    status: 'Active',
    workEmail: 'priya.patel@nexasphere.com',
    personalEmail: 'priya.p@gmail.com',
    phone: '+91 98112 55443',
    emergencyContactName: 'Rajesh Patel (Father)',
    emergencyPhone: '+91 98112 99887',
    currentAddress: '78, Koramangala 4th Block, Bangalore, Karnataka',
    bankName: 'ICICI Bank',
    branchName: 'Koramangala Branch',
    accountNumber: '001205018294',
    ifscCode: 'ICIC0000012',
    accountType: 'Savings',
    panNumber: 'BKRPA9876M',
    uanNumber: '100874512984',
    esiNumber: '310874512984001',
    role: 'HR Manager',
    portalAccess: 'Enabled',
    reportingManager: 'Sarah Jenkins (Director)'
  }
];

const DEFAULT_FORM_DATA = {
  id: '',
  firstName: '',
  lastName: '',
  gender: 'Male',
  dob: '',
  bloodGroup: 'O+',
  maritalStatus: 'Single',
  nationality: 'Indian',
  designation: '',
  department: 'Engineering',
  branch: 'Headquarters (Bangalore)',
  doj: new Date().toISOString().split('T')[0],
  status: 'Active',
  workEmail: '',
  personalEmail: '',
  phone: '',
  emergencyContactName: '',
  emergencyPhone: '',
  currentAddress: '',
  bankName: '',
  branchName: '',
  accountNumber: '',
  ifscCode: '',
  accountType: 'Savings',
  panNumber: '',
  uanNumber: '',
  esiNumber: '',
  role: 'Employee',
  portalAccess: 'Enabled',
  reportingManager: ''
};

export default function EmployeeMaster() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [showForm, setShowForm]   = useState(false);
  const [formTab, setFormTab]     = useState('personal');
  const [searchQ, setSearchQ]     = useState('');
  const [dept,    setDept]        = useState('All Departments');
  const [status,  setStatus]      = useState('All Status');
  const [formMode, setFormMode]   = useState('add'); // 'add' | 'edit'
  const [viewMode, setViewMode]   = useState('table'); // 'table' | 'card'

  // Form State
  const [formData, setFormData]     = useState(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Full View State & Delete Logic State
  const [viewingEmployee, setViewingEmployee]   = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [confirmPermanent, setConfirmPermanent] = useState(false);
  const [toastMsg, setToastMsg]                 = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Open Add Form
  const openAdd = () => {
    const nextNum = employees.length + 101;
    const generatedId = `EMP00${nextNum}`;
    setFormData({ ...DEFAULT_FORM_DATA, id: generatedId });
    setFormErrors({});
    setFormMode('add');
    setFormTab('personal');
    setShowForm(true);
  };

  // Open Edit Form
  const openEdit = (emp) => {
    setFormData({ ...emp });
    setFormErrors({});
    setFormMode('edit');
    setFormTab('personal');
    setShowForm(true);
    if (viewingEmployee) {
      setViewingEmployee(null);
    }
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Save / Submit Form
  const handleSave = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last Name is required';
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.doj) errors.doj = 'Date of Joining is required';
    if (!formData.workEmail.trim()) errors.workEmail = 'Work Email is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Switch to tab with error
      if (errors.firstName || errors.lastName) setFormTab('personal');
      else if (errors.designation || errors.department || errors.doj) setFormTab('employment');
      else if (errors.workEmail) setFormTab('contact');
      return;
    }

    const compiledEmployee = {
      ...formData,
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`
    };

    if (formMode === 'add') {
      setEmployees([compiledEmployee, ...employees]);
      showToast(`Employee ${compiledEmployee.fullName} (${compiledEmployee.id}) added successfully!`);
    } else {
      setEmployees(employees.map(emp => emp.id === compiledEmployee.id ? compiledEmployee : emp));
      showToast(`Employee record for ${compiledEmployee.fullName} updated successfully!`);
    }

    setShowForm(false);
  };

  // Delete Logic Handlers
  const handleDeactivate = (empId) => {
    setEmployees(employees.map(emp => emp.id === empId ? { ...emp, status: 'Inactive' } : emp));
    showToast(`Employee ${deletingEmployee?.fullName} deactivated. Historical attendance & leave records preserved for audit compliance.`);
    setDeletingEmployee(null);
    setConfirmPermanent(false);
  };

  const handlePermanentDelete = (empId) => {
    setEmployees(employees.filter(emp => emp.id !== empId));
    showToast(`Employee ${deletingEmployee?.fullName} (${empId}) permanently removed from database.`);
    setDeletingEmployee(null);
    setConfirmPermanent(false);
  };

  // Filter Employees
  const filteredEmployees = employees.filter(e => {
    const q = searchQ.toLowerCase();
    const matchSearch = searchQ === '' ||
      e.fullName.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      (e.workEmail && e.workEmail.toLowerCase().includes(q));
    const matchDept = dept === 'All Departments' || e.department === dept;
    const matchStatus = status === 'All Status' || e.status === status;
    return matchSearch && matchDept && matchStatus;
  });

  // Dynamic Statistics
  const totalCount     = employees.length;
  const activeCount    = employees.filter(e => e.status === 'Active').length;
  const probationCount = employees.filter(e => e.status === 'Probation').length;
  const inactiveCount  = employees.filter(e => e.status === 'Inactive' || e.status === 'Terminated').length;

  const dynamicStats = [
    { icon: Users,     label: 'Total Employees', count: totalCount,     color: '#2563eb', bg: '#eff6ff' },
    { icon: UserCheck, label: 'Active',          count: activeCount,    color: '#10b981', bg: '#ecfdf5' },
    { icon: Clock,     label: 'On Probation',    count: probationCount, color: '#f59e0b', bg: '#fffbeb' },
    { icon: UserX,     label: 'Inactive',        count: inactiveCount,  color: '#64748b', bg: '#f1f5f9' },
  ];

  return (
    <div className="emp-master">
      {/* ── Toast Notification ── */}
      {toastMsg && (
        <div className="emp-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMsg}</span>
          <button className="emp-toast-close" onClick={() => setToastMsg('')}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Top Summary Stats ── */}
      <div className="emp-stats">
        {dynamicStats.map(s => (
          <div key={s.label} className="emp-stat-card">
            <div className="emp-stat-card__icon" style={{ background: s.bg, color: s.color }}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="emp-stat-card__val" style={{ color: s.color }}>{s.count}</p>
              <p className="emp-stat-card__label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="emp-toolbar">
        <div className="emp-toolbar__left">
          {/* Search */}
          <div className="emp-search-wrap">
            <Search size={14} className="emp-search-icon" />
            <input
              className="emp-search"
              placeholder="Search by name, ID, designation..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            {searchQ && (
              <button className="emp-search-clear" onClick={() => setSearchQ('')}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Department filter */}
          <div className="emp-select-wrap">
            <Building2 size={13} className="emp-select-icon" />
            <select className="emp-select" value={dept} onChange={e => setDept(e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={12} className="emp-select-chevron" />
          </div>

          {/* Status filter */}
          <div className="emp-select-wrap">
            <Shield size={13} className="emp-select-icon" />
            <select className="emp-select" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="emp-select-chevron" />
          </div>

          {(searchQ || dept !== 'All Departments' || status !== 'All Status') && (
            <button
              className="emp-btn emp-btn--ghost"
              onClick={() => { setSearchQ(''); setDept('All Departments'); setStatus('All Status'); }}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="emp-toolbar__right">
          {/* View toggle */}
          <div className="emp-view-toggle">
            <button
              className={`emp-view-btn ${viewMode === 'table' ? 'emp-view-btn--active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="0" y="5.5" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="0" y="11" width="14" height="3" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <button
              className={`emp-view-btn ${viewMode === 'card' ? 'emp-view-btn--active' : ''}`}
              onClick={() => setViewMode('card')}
              title="Card view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
                <rect x="8" y="0" width="6" height="6" rx="1.5" fill="currentColor"/>
                <rect x="0" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
                <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <button className="emp-btn emp-btn--ghost">
            <Upload size={14} /> Import
          </button>
          <button className="emp-btn emp-btn--ghost">
            <Download size={14} /> Export
          </button>
          <button className="emp-btn emp-btn--primary" onClick={openAdd}>
            <UserPlus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* ── Table / Card View ── */}
      {viewMode === 'table' ? (
        <div className="emp-table-card">
          <table className="emp-table">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                {TABLE_COLUMNS.map(c => <th key={c}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                /* Clean Empty State without any flashy skeleton lines */
                <tr className="emp-table__empty-row">
                  <td colSpan={TABLE_COLUMNS.length + 1}>
                    <div className="emp-empty-state">
                      <Users size={38} />
                      <h3>No employee records found</h3>
                      <p>
                        {employees.length === 0
                          ? 'No employees have been added to the master directory yet.'
                          : 'No employees matched your current search or filter criteria.'}
                      </p>
                      <button className="emp-btn emp-btn--primary" onClick={openAdd}>
                        <UserPlus size={15} /> Add New Employee
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const statusStyle = STATUS_COLORS[emp.status] || STATUS_COLORS.Active;
                  return (
                    <tr key={emp.id} className="emp-table__row">
                      <td><input type="checkbox" /></td>
                      <td>
                        <span className="emp-id-badge">{emp.id}</span>
                      </td>
                      <td>
                        <div className="emp-table__name-cell">
                          <div className="emp-table__avatar">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="emp-name-text">{emp.fullName}</div>
                            <div className="emp-email-sub">{emp.workEmail || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="emp-text-primary">{emp.designation}</span>
                      </td>
                      <td>
                        <span className="emp-dept-pill">{emp.department}</span>
                      </td>
                      <td>{emp.branch || 'Headquarters'}</td>
                      <td>{emp.doj || '—'}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`
                          }}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <div className="emp-table__actions">
                          <button
                            className="emp-action-btn"
                            title="Full View Profile"
                            onClick={() => setViewingEmployee(emp)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="emp-action-btn"
                            title="Edit Employee"
                            onClick={() => openEdit(emp)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="emp-action-btn emp-action-btn--danger"
                            title="Delete / Deactivate"
                            onClick={() => {
                              setDeletingEmployee(emp);
                              setConfirmPermanent(false);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="emp-pagination">
            <span className="emp-pagination__info">
              Showing {filteredEmployees.length} of {employees.length} employees
            </span>
            <div className="emp-pagination__controls">
              <span className="emp-pagination__page-size-label">Rows per page:</span>
              <select className="emp-pagination__size">
                <option>10</option><option>25</option><option>50</option>
              </select>
              <button className="emp-page-btn" disabled><ChevronLeft size={14} /></button>
              <span className="emp-page-info">Page 1 of 1</span>
              <button className="emp-page-btn" disabled><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="emp-card-grid-wrapper">
          {filteredEmployees.length === 0 ? (
            <div className="emp-empty-state-card-view">
              <Users size={38} />
              <h3>No employee records found</h3>
              <p>Click "Add Employee" to create an employee record.</p>
              <button className="emp-btn emp-btn--primary" onClick={openAdd}>
                <UserPlus size={15} /> Add Employee
              </button>
            </div>
          ) : (
            <div className="emp-card-grid">
              {filteredEmployees.map(emp => {
                const statusStyle = STATUS_COLORS[emp.status] || STATUS_COLORS.Active;
                return (
                  <div key={emp.id} className="emp-card">
                    <div className="emp-card__header">
                      <div className="emp-card__avatar">
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>
                      <div className="emp-card__header-info">
                        <div className="emp-card__name">{emp.fullName}</div>
                        <div className="emp-card__desig">{emp.designation}</div>
                        <div className="emp-card__id">{emp.id}</div>
                      </div>
                    </div>

                    <div className="emp-card__body">
                      <div className="emp-card__row">
                        <Building2 size={13} />
                        <span>{emp.department} • {emp.branch}</span>
                      </div>
                      <div className="emp-card__row">
                        <Mail size={13} />
                        <span>{emp.workEmail || '—'}</span>
                      </div>
                      <div className="emp-card__row">
                        <Phone size={13} />
                        <span>{emp.phone || '—'}</span>
                      </div>
                    </div>

                    <div className="emp-card__footer">
                      <span
                        className="status-pill"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`
                        }}
                      >
                        {emp.status}
                      </span>
                      <div style={{ display:'flex', gap: 6 }}>
                        <button
                          className="emp-action-btn"
                          title="Full View Profile"
                          onClick={() => setViewingEmployee(emp)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="emp-action-btn"
                          title="Edit Employee"
                          onClick={() => openEdit(emp)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="emp-action-btn emp-action-btn--danger"
                          title="Delete / Deactivate"
                          onClick={() => {
                            setDeletingEmployee(emp);
                            setConfirmPermanent(false);
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────
          FULL VIEW EMPLOYEE PROFILE MODAL
         ───────────────────────────────────────── */}
      {viewingEmployee && (
        <div className="emp-modal-overlay" onClick={() => setViewingEmployee(null)}>
          <div className="emp-view-modal" onClick={e => e.stopPropagation()}>
            <div className="emp-view-header">
              <div className="emp-view-header__left">
                <div className="emp-view-avatar">
                  {viewingEmployee.firstName.charAt(0)}{viewingEmployee.lastName.charAt(0)}
                </div>
                <div>
                  <div className="emp-view-name-row">
                    <h2 className="emp-view-name">{viewingEmployee.fullName}</h2>
                    <span
                      className="status-pill"
                      style={{
                        background: STATUS_COLORS[viewingEmployee.status]?.bg || '#ecfdf5',
                        color: STATUS_COLORS[viewingEmployee.status]?.color || '#10b981',
                        border: `1px solid ${STATUS_COLORS[viewingEmployee.status]?.border || '#a7f3d0'}`
                      }}
                    >
                      {viewingEmployee.status}
                    </span>
                  </div>
                  <p className="emp-view-desig">
                    {viewingEmployee.designation} • <span className="emp-view-dept">{viewingEmployee.department}</span>
                  </p>
                  <p className="emp-view-id">Employee ID: <strong>{viewingEmployee.id}</strong></p>
                </div>
              </div>
              <div className="emp-view-header__actions">
                {PROFILE_IDS.includes(viewingEmployee.id) && (
                  <Link className="emp-btn emp-btn--ghost" to={`/profile?id=${viewingEmployee.id}`}>
                    <Eye size={14} /> Open Full Profile
                  </Link>
                )}
                <button className="emp-btn emp-btn--primary" onClick={() => openEdit(viewingEmployee)}>
                  <Edit2 size={14} /> Edit Profile
                </button>
                <button className="emp-modal-close" onClick={() => setViewingEmployee(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="emp-view-body">
              {/* Section 1: Employment Details */}
              <div className="emp-view-section">
                <h4 className="emp-view-section-title">
                  <Briefcase size={15} /> Employment & Organization Details
                </h4>
                <div className="emp-view-grid">
                  <div className="emp-view-field">
                    <span className="label">Department</span>
                    <span className="val">{viewingEmployee.department}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Designation</span>
                    <span className="val">{viewingEmployee.designation}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Branch / Location</span>
                    <span className="val">{viewingEmployee.branch || 'Headquarters'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Date of Joining</span>
                    <span className="val">{viewingEmployee.doj || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Reporting Manager</span>
                    <span className="val">{viewingEmployee.reportingManager || 'Not Assigned'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Role Access</span>
                    <span className="val">{viewingEmployee.role || 'Employee'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Personal Details */}
              <div className="emp-view-section">
                <h4 className="emp-view-section-title">
                  <Phone size={15} /> Contact & Personal Details
                </h4>
                <div className="emp-view-grid">
                  <div className="emp-view-field">
                    <span className="label">Work Email</span>
                    <span className="val">{viewingEmployee.workEmail || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Phone Number</span>
                    <span className="val">{viewingEmployee.phone || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Personal Email</span>
                    <span className="val">{viewingEmployee.personalEmail || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Gender</span>
                    <span className="val">{viewingEmployee.gender || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Date of Birth</span>
                    <span className="val">{viewingEmployee.dob || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Blood Group</span>
                    <span className="val">{viewingEmployee.bloodGroup || '—'}</span>
                  </div>
                  <div className="emp-view-field" style={{ gridColumn: 'span 2' }}>
                    <span className="label">Current Residential Address</span>
                    <span className="val">{viewingEmployee.currentAddress || '—'}</span>
                  </div>
                  <div className="emp-view-field" style={{ gridColumn: 'span 2' }}>
                    <span className="label">Emergency Contact</span>
                    <span className="val">{viewingEmployee.emergencyContactName || '—'} ({viewingEmployee.emergencyPhone || '—'})</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Bank & Statutory Details */}
              <div className="emp-view-section">
                <h4 className="emp-view-section-title">
                  <CreditCard size={15} /> Bank & Statutory Identifiers
                </h4>
                <div className="emp-view-grid">
                  <div className="emp-view-field">
                    <span className="label">Bank Name</span>
                    <span className="val">{viewingEmployee.bankName || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Account Number</span>
                    <span className="val">{viewingEmployee.accountNumber ? `•••• •••• ${viewingEmployee.accountNumber.slice(-4)}` : '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">IFSC Code</span>
                    <span className="val">{viewingEmployee.ifscCode || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">PAN Number</span>
                    <span className="val">{viewingEmployee.panNumber || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">UAN / PF Number</span>
                    <span className="val">{viewingEmployee.uanNumber || '—'}</span>
                  </div>
                  <div className="emp-view-field">
                    <span className="label">Portal Access Status</span>
                    <span className="val">{viewingEmployee.portalAccess || 'Enabled'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="emp-view-footer">
              <button className="emp-btn emp-btn--ghost" onClick={() => setViewingEmployee(null)}>
                Close
              </button>
              <button className="emp-btn emp-btn--primary" onClick={() => openEdit(viewingEmployee)}>
                <Edit2 size={14} /> Edit This Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          THOUGHTFUL DELETE DECISION MODAL
         ───────────────────────────────────────── */}
      {deletingEmployee && (
        <div className="emp-modal-overlay" onClick={() => setDeletingEmployee(null)}>
          <div className="emp-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="emp-delete-modal__header">
              <div className="emp-delete-icon-wrap">
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <div>
                <h3 className="emp-delete-title">Employee Deletion Decision</h3>
                <p className="emp-delete-sub">
                  How should <strong>{deletingEmployee.fullName}</strong> ({deletingEmployee.id}) be handled?
                </p>
              </div>
            </div>

            <div className="emp-delete-notice">
              <Shield size={16} />
              <span>
                <strong>HR Compliance Advisory:</strong> Deleting an employee impacts historical audit trails, past biometric logs, and project deliverables. Enterprise best practice recommends <strong>Deactivating</strong> rather than permanent deletion.
              </span>
            </div>

            {/* Strategic Options */}
            <div className="emp-delete-strategies">
              {/* Option A: Soft Delete / Deactivate */}
              <div className="emp-delete-strategy-card emp-delete-strategy-card--recommended">
                <div className="strategy-top">
                  <span className="strategy-tag">Recommended (Safe)</span>
                  <h4 className="strategy-title">Option 1: Deactivate & Archive</h4>
                </div>
                <p className="strategy-desc">
                  Changes status to <strong>Inactive</strong>. Immediately revokes system access and hides employee from active rosters, while <strong>preserving all past attendance, leave records, and audit logs</strong> for legal compliance.
                </p>
                <button
                  className="emp-btn emp-btn--secondary"
                  onClick={() => handleDeactivate(deletingEmployee.id)}
                >
                  <Lock size={14} /> Deactivate Employee (Safe)
                </button>
              </div>

              {/* Option B: Permanent Hard Delete */}
              <div className="emp-delete-strategy-card emp-delete-strategy-card--danger">
                <div className="strategy-top">
                  <span className="strategy-tag strategy-tag--danger">Permanent Purge</span>
                  <h4 className="strategy-title">Option 2: Permanent Removal</h4>
                </div>
                <p className="strategy-desc">
                  Completely erases the employee profile and credentials from the database. <strong>This action cannot be undone.</strong>
                </p>
                <div className="strategy-confirm-check">
                  <label>
                    <input
                      type="checkbox"
                      checked={confirmPermanent}
                      onChange={e => setConfirmPermanent(e.target.checked)}
                    />
                    I understand this permanently removes all data for {deletingEmployee.id}
                  </label>
                </div>
                <button
                  className="emp-btn emp-btn--danger"
                  disabled={!confirmPermanent}
                  onClick={() => handlePermanentDelete(deletingEmployee.id)}
                >
                  <Trash2 size={14} /> Permanently Delete Record
                </button>
              </div>
            </div>

            <div className="emp-delete-modal__footer">
              <button
                className="emp-btn emp-btn--ghost"
                onClick={() => {
                  setDeletingEmployee(null);
                  setConfirmPermanent(false);
                }}
              >
                Cancel & Keep Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          ADD / EDIT EMPLOYEE FORM DRAWER
         ───────────────────────────────────────── */}
      {showForm && (
        <div className="emp-form-overlay">
          <div className="emp-form-drawer">
            {/* Drawer Header */}
            <div className="emp-form-drawer__header">
              <div>
                <h2 className="emp-form-drawer__title">
                  {formMode === 'add' ? 'Add New Employee' : `Edit Employee (${formData.id})`}
                </h2>
                <p className="emp-form-drawer__sub">
                  {formMode === 'add'
                    ? 'Fill in all required fields to create a new employee record.'
                    : 'Update employee details and save changes.'}
                </p>
              </div>
              <button className="emp-form-close" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {/* Photo + Employee ID banner */}
              <div className="emp-form-banner">
                <div className="emp-form-photo">
                  <div className="emp-form-photo__circle">
                    <Camera size={22} />
                  </div>
                  <button type="button" className="emp-form-photo__btn">Upload Photo</button>
                </div>
                <div className="emp-form-banner__ids">
                  <div className="emp-form-field emp-form-field--inline">
                    <label>Employee ID <span className="req">*</span></label>
                    <input
                      type="text"
                      className="emp-input"
                      value={formData.id}
                      onChange={e => updateField('id', e.target.value)}
                    />
                  </div>
                  <div className="emp-form-field emp-form-field--inline">
                    <label>Employment Status <span className="req">*</span></label>
                    <select
                      className="emp-input"
                      value={formData.status}
                      onChange={e => updateField('status', e.target.value)}
                    >
                      <option>Active</option>
                      <option>Probation</option>
                      <option>Inactive</option>
                      <option>Terminated</option>
                    </select>
                  </div>
                  <div className="emp-form-field emp-form-field--inline">
                    <label>Date of Joining <span className="req">*</span></label>
                    <input
                      type="date"
                      className={`emp-input ${formErrors.doj ? 'input-error' : ''}`}
                      value={formData.doj}
                      onChange={e => updateField('doj', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div className="emp-form-tabs">
                {FORM_TABS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`emp-form-tab ${formTab === t.id ? 'emp-form-tab--active' : ''}`}
                    onClick={() => setFormTab(t.id)}
                  >
                    <t.icon size={14} />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="emp-form-body">
                {formTab === 'personal' && (
                  <PersonalInfoTab
                    formData={formData}
                    updateField={updateField}
                    formErrors={formErrors}
                  />
                )}
                {formTab === 'employment' && (
                  <EmploymentTab
                    formData={formData}
                    updateField={updateField}
                    formErrors={formErrors}
                  />
                )}
                {formTab === 'contact' && (
                  <ContactTab
                    formData={formData}
                    updateField={updateField}
                    formErrors={formErrors}
                  />
                )}
                {formTab === 'bank' && (
                  <BankTab
                    formData={formData}
                    updateField={updateField}
                  />
                )}
                {formTab === 'documents' && <DocumentsTab />}
                {formTab === 'access' && (
                  <AccessTab
                    formData={formData}
                    updateField={updateField}
                  />
                )}
              </div>

              {/* Drawer Footer */}
              <div className="emp-form-footer">
                <button type="button" className="emp-btn emp-btn--ghost emp-btn--lg" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <div style={{ flex: 1 }} />
                <button type="submit" className="emp-btn emp-btn--primary emp-btn--lg">
                  <Save size={15} />
                  {formMode === 'add' ? 'Save Employee' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Tab Panels & Form Helpers
─────────────────────────────────────────── */
function FormSection({ title, children }) {
  return (
    <div className="form-section">
      <h4 className="form-section__title">{title}</h4>
      <div className="form-grid">{children}</div>
    </div>
  );
}

function Field({ label, required, children, span, error }) {
  return (
    <div className={`emp-form-field ${span ? `emp-form-field--span-${span}` : ''}`}>
      <label className="emp-label">
        {label} {required && <span className="req">*</span>}
      </label>
      {children}
      {error && <span className="emp-field-error">{error}</span>}
    </div>
  );
}

function PersonalInfoTab({ formData, updateField, formErrors }) {
  return (
    <div>
      <FormSection title="Basic Information">
        <Field label="First Name" required error={formErrors.firstName}>
          <input
            className={`emp-input ${formErrors.firstName ? 'input-error' : ''}`}
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={e => updateField('firstName', e.target.value)}
          />
        </Field>
        <Field label="Last Name" required error={formErrors.lastName}>
          <input
            className={`emp-input ${formErrors.lastName ? 'input-error' : ''}`}
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={e => updateField('lastName', e.target.value)}
          />
        </Field>
        <Field label="Date of Birth">
          <input
            className="emp-input"
            type="date"
            value={formData.dob}
            onChange={e => updateField('dob', e.target.value)}
          />
        </Field>
        <Field label="Gender">
          <select
            className="emp-input"
            value={formData.gender}
            onChange={e => updateField('gender', e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Blood Group">
          <select
            className="emp-input"
            value={formData.bloodGroup}
            onChange={e => updateField('bloodGroup', e.target.value)}
          >
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Marital Status">
          <select
            className="emp-input"
            value={formData.maritalStatus}
            onChange={e => updateField('maritalStatus', e.target.value)}
          >
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
          </select>
        </Field>
      </FormSection>

      <FormSection title="Emergency Contact">
        <Field label="Emergency Contact Person">
          <input
            className="emp-input"
            placeholder="e.g. Sibling, Spouse, Parent"
            value={formData.emergencyContactName}
            onChange={e => updateField('emergencyContactName', e.target.value)}
          />
        </Field>
        <Field label="Emergency Contact Phone">
          <input
            className="emp-input"
            placeholder="+91 XXXXX XXXXX"
            value={formData.emergencyPhone}
            onChange={e => updateField('emergencyPhone', e.target.value)}
          />
        </Field>
      </FormSection>
    </div>
  );
}

function EmploymentTab({ formData, updateField, formErrors }) {
  return (
    <div>
      <FormSection title="Position & Organization">
        <Field label="Department" required error={formErrors.department}>
          <select
            className={`emp-input ${formErrors.department ? 'input-error' : ''}`}
            value={formData.department}
            onChange={e => updateField('department', e.target.value)}
          >
            {['Engineering','HR','Finance','Sales','Operations','Quality','Maintenance','Design','Production'].map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Designation / Job Title" required error={formErrors.designation}>
          <input
            className={`emp-input ${formErrors.designation ? 'input-error' : ''}`}
            placeholder="e.g. Senior Software Engineer"
            value={formData.designation}
            onChange={e => updateField('designation', e.target.value)}
          />
        </Field>
        <Field label="Branch / Location">
          <select
            className="emp-input"
            value={formData.branch}
            onChange={e => updateField('branch', e.target.value)}
          >
            <option>Headquarters (Bangalore)</option>
            <option>Branch Mumbai</option>
            <option>Branch Delhi</option>
            <option>Remote</option>
          </select>
        </Field>
        <Field label="Reporting Manager">
          <input
            className="emp-input"
            placeholder="e.g. Sarah Jenkins"
            value={formData.reportingManager}
            onChange={e => updateField('reportingManager', e.target.value)}
          />
        </Field>
      </FormSection>
    </div>
  );
}

function ContactTab({ formData, updateField, formErrors }) {
  return (
    <div>
      <FormSection title="Contact Information">
        <Field label="Official Work Email" required error={formErrors.workEmail}>
          <input
            className={`emp-input ${formErrors.workEmail ? 'input-error' : ''}`}
            type="email"
            placeholder="employee@nexasphere.com"
            value={formData.workEmail}
            onChange={e => updateField('workEmail', e.target.value)}
          />
        </Field>
        <Field label="Mobile Phone Number">
          <input
            className="emp-input"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={formData.phone}
            onChange={e => updateField('phone', e.target.value)}
          />
        </Field>
        <Field label="Personal Email">
          <input
            className="emp-input"
            type="email"
            placeholder="personal@gmail.com"
            value={formData.personalEmail}
            onChange={e => updateField('personalEmail', e.target.value)}
          />
        </Field>
        <Field label="Current Residential Address" span={2}>
          <input
            className="emp-input"
            placeholder="House / Flat No., Street, City, State"
            value={formData.currentAddress}
            onChange={e => updateField('currentAddress', e.target.value)}
          />
        </Field>
      </FormSection>
    </div>
  );
}

function BankTab({ formData, updateField }) {
  return (
    <div>
      <FormSection title="Bank Details">
        <Field label="Bank Name">
          <input
            className="emp-input"
            placeholder="e.g. HDFC Bank, SBI, ICICI"
            value={formData.bankName}
            onChange={e => updateField('bankName', e.target.value)}
          />
        </Field>
        <Field label="Account Number">
          <input
            className="emp-input"
            placeholder="Account number"
            value={formData.accountNumber}
            onChange={e => updateField('accountNumber', e.target.value)}
          />
        </Field>
        <Field label="IFSC Code">
          <input
            className="emp-input"
            placeholder="IFSC Code"
            style={{ textTransform: 'uppercase' }}
            value={formData.ifscCode}
            onChange={e => updateField('ifscCode', e.target.value)}
          />
        </Field>
        <Field label="Account Type">
          <select
            className="emp-input"
            value={formData.accountType}
            onChange={e => updateField('accountType', e.target.value)}
          >
            <option>Savings</option>
            <option>Current</option>
          </select>
        </Field>
      </FormSection>

      <FormSection title="Statutory Identifiers">
        <Field label="PAN Card Number">
          <input
            className="emp-input"
            placeholder="PAN Number"
            style={{ textTransform: 'uppercase' }}
            value={formData.panNumber}
            onChange={e => updateField('panNumber', e.target.value)}
          />
        </Field>
        <Field label="UAN / PF Number">
          <input
            className="emp-input"
            placeholder="UAN Number"
            value={formData.uanNumber}
            onChange={e => updateField('uanNumber', e.target.value)}
          />
        </Field>
      </FormSection>
    </div>
  );
}

function DocumentsTab() {
  const DOC_TYPES = [
    'Offer Letter', 'Appointment Letter', 'Aadhaar Card',
    'PAN Card', 'Passport', 'Educational Certificate',
  ];
  return (
    <div>
      <div className="docs-info-box">
        <FileText size={16} />
        <span>Upload scanned copies or photographs of required documents (PDF, JPG, PNG max 5 MB).</span>
      </div>
      <div className="docs-grid">
        {DOC_TYPES.map(doc => (
          <div key={doc} className="doc-upload-card">
            <div className="doc-upload-card__icon">
              <FileText size={20} />
            </div>
            <div className="doc-upload-card__body">
              <p className="doc-upload-card__name">{doc}</p>
              <p className="doc-upload-card__status">No file uploaded</p>
            </div>
            <button type="button" className="doc-upload-card__btn">
              <Upload size={13} /> Upload
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccessTab({ formData, updateField }) {
  return (
    <div>
      <FormSection title="System Access">
        <Field label="Role / Permission Level">
          <select
            className="emp-input"
            value={formData.role}
            onChange={e => updateField('role', e.target.value)}
          >
            <option>Employee</option>
            <option>Manager</option>
            <option>HR Manager</option>
            <option>Super Admin</option>
          </select>
        </Field>
        <Field label="Self-Service Portal Access">
          <select
            className="emp-input"
            value={formData.portalAccess}
            onChange={e => updateField('portalAccess', e.target.value)}
          >
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </Field>
      </FormSection>
    </div>
  );
}
