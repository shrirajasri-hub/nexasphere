import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Building2, Briefcase,
  Calendar, Shield, CreditCard, FileText, CheckCircle2,
  Clock, Award, Download, Edit3, X, Save, AlertCircle,
  Eye, EyeOff, Camera, ArrowLeft, ExternalLink,
  Lock, RefreshCw, Sparkles, FolderKanban, CheckSquare
} from 'lucide-react';
import './EmployeeProfile.css';

// Master list of full employee profiles
const PROFILES_DATABASE = {
  'EMP-2041': {
    id: 'EMP-2041',
    fullName: 'Priya Sundaram',
    firstName: 'Priya',
    lastName: 'Sundaram',
    gender: 'Female',
    dob: '1994-08-14',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    designation: 'Senior Product Designer',
    department: 'Design & UX',
    branch: 'Bangalore Headquarters (Tower B, Fl 4)',
    doj: '2022-05-12',
    confirmationDate: '2022-11-12',
    employmentType: 'Full-Time Regular',
    grade: 'L4 · Senior Specialist',
    status: 'Active',
    workEmail: 'priya.s@nexasphere.io',
    personalEmail: 'priya.sundaram.design@gmail.com',
    phone: '+91 98450 67890',
    emergencyContactName: 'Kavitha Sundaram',
    emergencyRelation: 'Mother',
    emergencyPhone: '+91 98450 11223',
    currentAddress: 'Flat 402, Green Glen Layout, Bellandur, Bangalore, Karnataka 560103',
    permanentAddress: '18, Temple Ring Road, Alwarpet, Chennai, Tamil Nadu 600018',
    reportingManager: 'Vikram Malhotra (VP Technology)',
    shift: 'General Shift (09:30 AM – 06:30 PM IST)',
    role: 'Employee Self-Service',
    portalAccess: 'Enabled',
    bankName: 'HDFC Bank Ltd.',
    branchName: 'Koramangala 80ft Road Branch',
    accountNumber: '50100492819201',
    accountType: 'Corporate Salary Account',
    ifscCode: 'HDFC0001042',
    panNumber: 'ABCPS1234K',
    uanNumber: '100928374615',
    esiNumber: '310928374615001',
    taxRegime: 'New Tax Regime (FY 2026-27)',
    avatarBg: '#d97706',
    avatarInitials: 'PS',
    attendanceRate: '96.4%',
    presentDays: 22,
    totalWorkingDays: 22,
    deliverablesCompleted: 14,
    activeTasks: 4,
    leaveBalances: {
      casual: { total: 6, used: 2, available: 4 },
      sick: { total: 10, used: 2, available: 8 },
      earned: { total: 15, used: 3, available: 12 },
      compOff: { total: 2, used: 0, available: 2 }
    },
    skills: [
      'UI/UX Architecture', 'Design Systems', 'Figma',
      'React Components', 'User Research', 'Design Sprints',
      'WCAG 2.1 Accessibility'
    ],
    documents: [
      { id: 'doc-1', title: 'Offer & Appointment Letter', type: 'PDF', size: '1.4 MB', date: '12 May 2022', status: 'Verified' },
      { id: 'doc-2', title: 'PAN Card Copy', type: 'PDF', size: '420 KB', date: '14 May 2022', status: 'Verified' },
      { id: 'doc-3', title: 'Aadhaar Identity Proof', type: 'PDF', size: '610 KB', date: '14 May 2022', status: 'Verified' },
      { id: 'doc-4', title: 'Degree Certificate (B.Des)', type: 'PDF', size: '2.8 MB', date: '15 May 2022', status: 'Verified' },
      { id: 'doc-5', title: 'Signed NDA & IP Agreement', type: 'PDF', size: '850 KB', date: '12 May 2022', status: 'Verified' }
    ]
  },
  'EMP00101': {
    id: 'EMP00101',
    fullName: 'Aarav Sharma',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'Male',
    dob: '1992-06-15',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    nationality: 'Indian',
    designation: 'Senior Lead Architect',
    department: 'Engineering',
    branch: 'Headquarters (Bangalore)',
    doj: '2023-04-10',
    confirmationDate: '2023-10-10',
    employmentType: 'Full-Time Regular',
    grade: 'L5 · Principal Lead',
    status: 'Active',
    workEmail: 'aarav.sharma@nexasphere.com',
    personalEmail: 'aarav.personal@gmail.com',
    phone: '+91 98450 12345',
    emergencyContactName: 'Ananya Sharma',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 98450 99881',
    currentAddress: '42, Indiranagar 100ft Road, Bangalore, Karnataka 560038',
    permanentAddress: '42, Indiranagar 100ft Road, Bangalore, Karnataka 560038',
    reportingManager: 'Vikram Malhotra (VP Tech)',
    shift: 'General Shift (09:00 AM – 06:00 PM IST)',
    role: 'Engineering Lead',
    portalAccess: 'Enabled',
    bankName: 'HDFC Bank',
    branchName: 'Indiranagar Branch',
    accountNumber: '50100492819201',
    accountType: 'Corporate Salary Account',
    ifscCode: 'HDFC0001042',
    panNumber: 'ABCPS1234K',
    uanNumber: '100928374615',
    esiNumber: '310928374615001',
    taxRegime: 'New Tax Regime (FY 2026-27)',
    avatarBg: '#2563eb',
    avatarInitials: 'AS',
    attendanceRate: '98.1%',
    presentDays: 22,
    totalWorkingDays: 22,
    deliverablesCompleted: 21,
    activeTasks: 6,
    leaveBalances: {
      casual: { total: 6, used: 1, available: 5 },
      sick: { total: 10, used: 1, available: 9 },
      earned: { total: 15, used: 2, available: 13 },
      compOff: { total: 3, used: 0, available: 3 }
    },
    skills: ['System Architecture', 'Node.js', 'React', 'Cloud Infrastructure', 'Microservices'],
    documents: [
      { id: 'doc-1', title: 'Offer Letter', type: 'PDF', size: '1.2 MB', date: '10 Apr 2023', status: 'Verified' },
      { id: 'doc-2', title: 'PAN Card Copy', type: 'PDF', size: '390 KB', date: '10 Apr 2023', status: 'Verified' },
      { id: 'doc-3', title: 'Aadhaar Identity Proof', type: 'PDF', size: '550 KB', date: '10 Apr 2023', status: 'Verified' }
    ]
  },
  'EMP00102': {
    id: 'EMP00102',
    fullName: 'Priya Patel',
    firstName: 'Priya',
    lastName: 'Patel',
    gender: 'Female',
    dob: '1995-11-20',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    designation: 'HR Operations Lead',
    department: 'HR',
    branch: 'Headquarters (Bangalore)',
    doj: '2024-01-15',
    confirmationDate: '2024-07-15',
    employmentType: 'Full-Time Regular',
    grade: 'L3 · Lead Specialist',
    status: 'Active',
    workEmail: 'priya.patel@nexasphere.com',
    personalEmail: 'priya.p@gmail.com',
    phone: '+91 98112 55443',
    emergencyContactName: 'Rajesh Patel',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98112 99887',
    currentAddress: '78, Koramangala 4th Block, Bangalore, Karnataka 560034',
    permanentAddress: '15, Navrangpura, Ahmedabad, Gujarat 380009',
    reportingManager: 'Sarah Jenkins (Director HR)',
    shift: 'General Shift (09:00 AM – 06:00 PM IST)',
    role: 'HR Manager',
    portalAccess: 'Enabled',
    bankName: 'ICICI Bank',
    branchName: 'Koramangala Branch',
    accountNumber: '001205018294',
    accountType: 'Savings',
    ifscCode: 'ICIC0000012',
    panNumber: 'BKRPA9876M',
    uanNumber: '100874512984',
    esiNumber: '310874512984001',
    taxRegime: 'New Tax Regime (FY 2026-27)',
    avatarBg: '#059669',
    avatarInitials: 'PP',
    attendanceRate: '95.5%',
    presentDays: 21,
    totalWorkingDays: 22,
    deliverablesCompleted: 18,
    activeTasks: 3,
    leaveBalances: {
      casual: { total: 6, used: 2, available: 4 },
      sick: { total: 10, used: 3, available: 7 },
      earned: { total: 15, used: 4, available: 11 },
      compOff: { total: 1, used: 0, available: 1 }
    },
    skills: ['HR Operations', 'Workforce Compliance', 'Talent Acquisition', 'HRIS Audits'],
    documents: [
      { id: 'doc-1', title: 'Offer Letter', type: 'PDF', size: '1.1 MB', date: '15 Jan 2024', status: 'Verified' },
      { id: 'doc-2', title: 'PAN Card Copy', type: 'PDF', size: '410 KB', date: '15 Jan 2024', status: 'Verified' }
    ]
  }
};

export default function EmployeeProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Current session auth data
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_auth');
      return saved ? JSON.parse(saved) : {
        role: 'employee',
        name: 'Priya Sundaram',
        empId: 'EMP-2041',
        dept: 'Design & UX',
        email: 'priya.s@nexasphere.io',
        designation: 'Senior Product Designer'
      };
    } catch {
      return {
        role: 'employee',
        name: 'Priya Sundaram',
        empId: 'EMP-2041',
        dept: 'Design & UX',
        email: 'priya.s@nexasphere.io',
        designation: 'Senior Product Designer'
      };
    }
  });

  // Target employee ID: either from query param ?id=... or logged-in user's empId
  const queryEmpId = searchParams.get('id');
  const targetId = queryEmpId || currentUser.empId || 'EMP-2041';

  // Load employee profile state with persistence in localStorage
  const [profile, setProfile] = useState(() => {
    const storageKey = `nexa_profile_${targetId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Fallback to PROFILES_DATABASE or generate from currentUser
    if (PROFILES_DATABASE[targetId]) {
      return PROFILES_DATABASE[targetId];
    }
    // Dynamic fallback for any employee
    return {
      id: targetId,
      fullName: currentUser.name || 'Priya Sundaram',
      firstName: (currentUser.name || 'Priya').split(' ')[0],
      lastName: (currentUser.name || 'Sundaram').split(' ')[1] || '',
      gender: 'Female',
      dob: '1994-08-14',
      bloodGroup: 'O+',
      maritalStatus: 'Single',
      nationality: 'Indian',
      designation: currentUser.designation || 'Senior Product Designer',
      department: currentUser.dept || 'Design & UX',
      branch: 'Bangalore Headquarters',
      doj: '2022-05-12',
      employmentType: 'Full-Time Regular',
      grade: 'L4 · Specialist',
      status: 'Active',
      workEmail: currentUser.email || 'priya.s@nexasphere.io',
      personalEmail: 'priya.personal@gmail.com',
      phone: '+91 98450 67890',
      emergencyContactName: 'Kavitha Sundaram',
      emergencyRelation: 'Family',
      emergencyPhone: '+91 98450 11223',
      currentAddress: 'Flat 402, Green Glen Layout, Bellandur, Bangalore 560103',
      permanentAddress: '18, Temple Ring Road, Alwarpet, Chennai 600018',
      reportingManager: 'Vikram Malhotra (VP Technology)',
      shift: 'General Shift (09:30 AM – 06:30 PM)',
      role: 'Employee Self-Service',
      portalAccess: 'Enabled',
      bankName: 'HDFC Bank Ltd.',
      branchName: 'Koramangala Branch',
      accountNumber: '50100492819201',
      accountType: 'Salary Account',
      ifscCode: 'HDFC0001042',
      panNumber: 'ABCPS1234K',
      uanNumber: '100928374615',
      esiNumber: '310928374615001',
      taxRegime: 'New Tax Regime (FY 2026-27)',
      avatarBg: '#d97706',
      avatarInitials: 'PS',
      attendanceRate: '96.4%',
      presentDays: 22,
      totalWorkingDays: 22,
      deliverablesCompleted: 14,
      activeTasks: 4,
      leaveBalances: {
        casual: { total: 6, used: 2, available: 4 },
        sick: { total: 10, used: 2, available: 8 },
        earned: { total: 15, used: 3, available: 12 },
        compOff: { total: 2, used: 0, available: 2 }
      },
      skills: ['UI/UX', 'Design Systems', 'Figma', 'React UI'],
      documents: []
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Account Number Visibility Toggle
  const [showAccountNum, setShowAccountNum] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // New Document Upload State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFile, setNewDocFile] = useState(null);

  const isEmployee = currentUser.role === 'employee';
  const isOwnProfile = profile.id === currentUser.empId;
  // Employees view their profile read-only; master data is maintained by HR/Admin.
  const canEdit = !isEmployee;

  // Listen to role changes
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

  // Update profile if query param changes
  useEffect(() => {
    const storageKey = `nexa_profile_${targetId}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setProfile(JSON.parse(saved));
        return;
      }
    } catch {
      // ignore
    }
    if (PROFILES_DATABASE[targetId]) {
      setProfile(PROFILES_DATABASE[targetId]);
    }
  }, [targetId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Open Edit Modal
  const openEditModal = () => {
    setEditFormData({
      phone: profile.phone || '',
      personalEmail: profile.personalEmail || '',
      currentAddress: profile.currentAddress || '',
      emergencyContactName: profile.emergencyContactName || '',
      emergencyRelation: profile.emergencyRelation || '',
      emergencyPhone: profile.emergencyPhone || '',
      // Admin editable fields
      ...(currentUser.role === 'admin' ? {
        designation: profile.designation,
        department: profile.department,
        branch: profile.branch,
        reportingManager: profile.reportingManager,
        status: profile.status,
        shift: profile.shift,
        bankName: profile.bankName,
        accountNumber: profile.accountNumber,
        ifscCode: profile.ifscCode
      } : {})
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Form
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      ...editFormData
    };

    setProfile(updatedProfile);
    localStorage.setItem(`nexa_profile_${targetId}`, JSON.stringify(updatedProfile));

    // If updating own profile, also update nexa_auth if relevant
    if (isOwnProfile) {
      const updatedAuth = {
        ...currentUser,
        ...(editFormData.designation ? { designation: editFormData.designation } : {}),
        ...(editFormData.department ? { dept: editFormData.department } : {})
      };
      localStorage.setItem('nexa_auth', JSON.stringify(updatedAuth));
      window.dispatchEvent(new Event('nexa_role_change'));
    }

    setIsEditModalOpen(false);
    showToast('Employee profile details updated successfully!');
  };

  // Document Upload Handler
  const handleUploadDocument = (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) {
      alert('Please provide a document title.');
      return;
    }
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      type: newDocFile?.name?.endsWith('.pdf') ? 'PDF' : 'DOC',
      size: newDocFile ? `${(newDocFile.size / 1024).toFixed(0)} KB` : '450 KB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Submitted'
    };
    const updatedDocs = [newDoc, ...(profile.documents || [])];
    const updated = { ...profile, documents: updatedDocs };
    setProfile(updated);
    localStorage.setItem(`nexa_profile_${targetId}`, JSON.stringify(updated));
    setIsDocModalOpen(false);
    setNewDocTitle('');
    setNewDocFile(null);
    showToast(`Document "${newDoc.title}" uploaded successfully!`);
  };

  // Print Profile Handler
  const handlePrint = () => {
    window.print();
  };

  // Calculate total leave stats
  const totalLeaveAvailable = profile.leaveBalances
    ? Object.values(profile.leaveBalances).reduce((acc, curr) => acc + curr.available, 0)
    : 26;
  const totalLeaveAllotted = profile.leaveBalances
    ? Object.values(profile.leaveBalances).reduce((acc, curr) => acc + curr.total, 0)
    : 33;

  return (
    <div className="emp-profile-page">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="profile-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button className="profile-toast-close" onClick={() => setToastMessage('')}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Breadcrumb & Context Bar ── */}
      <div className="profile-context-bar">
        <div className="profile-breadcrumb">
          {!isEmployee && (
            <Link to="/masters/employees" className="profile-back-link">
              <ArrowLeft size={14} /> Back to Employee Master
            </Link>
          )}
          <span className="profile-crumb-active">
            {isEmployee ? 'My Self-Service Profile' : `Employee Dossier · ${profile.fullName}`}
          </span>
        </div>

        <div className="profile-top-actions">
          <button
            type="button"
            className="profile-btn profile-btn--outline"
            onClick={handlePrint}
            title="Download or Print Employee Dossier"
          >
            <Download size={14} /> Download PDF Dossier
          </button>
          <button
            type="button"
            className="profile-btn profile-btn--primary"
            onClick={openEditModal}
            hidden={!canEdit}
          >
            <Edit3 size={14} />
            Edit Employee Master
          </button>
        </div>
      </div>

      {/* ── Profile Hero Banner Card ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-cover">
          <div className="profile-hero-cover-pattern" />
          <span className="profile-badge-status">
            <span className="profile-pulse-dot" />
            {profile.status || 'Active'} · Full Time
          </span>
        </div>

        <div className="profile-hero-content">
          <div className="profile-avatar-wrapper">
            <div
              className="profile-avatar-circle"
              style={{ background: profile.avatarBg || '#d97706' }}
            >
              {profile.avatarInitials || (profile.firstName?.charAt(0) + profile.lastName?.charAt(0))}
            </div>
            <button
              className="profile-avatar-cam"
              hidden={!canEdit}
              title="Update Profile Photo"
              onClick={() => alert('Photo upload dialog: Choose a square PNG/JPG image up to 5MB.')}
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h1 className="profile-name">{profile.fullName}</h1>
              <span className="profile-empid-pill">{profile.id}</span>
              <span className="profile-grade-pill">{profile.grade || 'L4 Specialist'}</span>
            </div>
            <p className="profile-title-dept">
              <span className="desig-text">{profile.designation}</span>
              <span className="dot-divider">•</span>
              <span className="dept-tag-link">{profile.department}</span>
              <span className="dot-divider">•</span>
              <span className="location-text">
                <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                {profile.branch}
              </span>
            </p>

            <div className="profile-quick-contacts">
              <a href={`mailto:${profile.workEmail}`} className="quick-contact-link">
                <Mail size={13} /> {profile.workEmail}
              </a>
              <span className="pipe-sep">|</span>
              <a href={`tel:${profile.phone}`} className="quick-contact-link">
                <Phone size={13} /> {profile.phone}
              </a>
              <span className="pipe-sep">|</span>
              <span className="quick-contact-text">
                <Calendar size={13} /> Joined {profile.doj}
              </span>
            </div>
          </div>

          <div className="profile-hero-cta">
            <Link to="/leave" className="profile-cta-apply-leave">
              <Calendar size={15} />
              <span>Apply for Leave</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Vital Stats Bar ── */}
      <div className="profile-vitals-grid">
        <div className="vital-card">
          <div className="vital-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Calendar size={18} />
          </div>
          <div className="vital-info">
            <p className="vital-label">Leave Balance</p>
            <h3 className="vital-number">{totalLeaveAvailable} <span className="vital-sub">/ {totalLeaveAllotted} Days</span></h3>
            <span className="vital-note">
              {profile.leaveBalances?.casual?.available || 4} Casual · {profile.leaveBalances?.sick?.available || 8} Sick · {profile.leaveBalances?.earned?.available || 12} Earned
            </span>
          </div>
        </div>

        <div className="vital-card">
          <div className="vital-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Clock size={18} />
          </div>
          <div className="vital-info">
            <p className="vital-label">Monthly Attendance</p>
            <h3 className="vital-number">{profile.attendanceRate || '96.4%'}</h3>
            <span className="vital-note">22 Present · 0 Late Marks · 0 Unplanned</span>
          </div>
        </div>

        <div className="vital-card">
          <div className="vital-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <CheckSquare size={18} />
          </div>
          <div className="vital-info">
            <p className="vital-label">Active Deliverables</p>
            <h3 className="vital-number">{profile.activeTasks || 4} <span className="vital-sub">In Progress</span></h3>
            <span className="vital-note">{profile.deliverablesCompleted || 14} Tasks Delivered YTD</span>
          </div>
        </div>

        <div className="vital-card">
          <div className="vital-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Shield size={18} />
          </div>
          <div className="vital-info">
            <p className="vital-label">Reporting Manager</p>
            <h3 className="vital-manager-name">{profile.reportingManager?.split('(')[0] || 'Vikram Malhotra'}</h3>
            <span className="vital-note">{profile.reportingManager?.includes('(') ? profile.reportingManager.split('(')[1].replace(')', '') : 'VP Technology'}</span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Tabs ── */}
      <div className="profile-tabs-nav">
        <button
          className={`profile-tab-btn ${activeTab === 'overview' ? 'profile-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <User size={15} /> Overview & Identity
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'employment' ? 'profile-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('employment')}
        >
          <Briefcase size={15} /> Employment & Organization
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'bank' ? 'profile-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('bank')}
        >
          <CreditCard size={15} /> Bank & Statutory Identifiers
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'leave' ? 'profile-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          <Calendar size={15} /> Leave Quota & Policy
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'documents' ? 'profile-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={15} /> Official Documents ({profile.documents?.length || 5})
        </button>
      </div>

      {/* ── Tab Content Container ── */}
      <div className="profile-tab-content">
        {/* ──────── TAB 1: OVERVIEW & PERSONAL IDENTITY ──────── */}
        {activeTab === 'overview' && (
          <div className="profile-tab-pane">
            <div className="profile-sections-two-col">
              {/* Personal Information */}
              <div className="profile-info-section">
                <div className="section-head">
                  <div className="section-head-title">
                    <User size={16} />
                    <h3>Personal Information</h3>
                  </div>
                  <button className="section-action-btn" onClick={openEditModal} hidden={!canEdit}>
                    <Edit3 size={12} /> Edit
                  </button>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label>Full Legal Name</label>
                    <p>{profile.fullName}</p>
                  </div>
                  <div className="profile-field">
                    <label>Gender</label>
                    <p>{profile.gender || 'Female'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Date of Birth</label>
                    <p>{profile.dob || '14 Aug 1994'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Blood Group</label>
                    <p className="blood-group-badge">{profile.bloodGroup || 'O+'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Marital Status</label>
                    <p>{profile.maritalStatus || 'Single'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Nationality</label>
                    <p>{profile.nationality || 'Indian'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="profile-info-section">
                <div className="section-head">
                  <div className="section-head-title">
                    <Phone size={16} />
                    <h3>Contact & Address Details</h3>
                  </div>
                  <button className="section-action-btn" onClick={openEditModal} hidden={!canEdit}>
                    <Edit3 size={12} /> Update
                  </button>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label>Official Work Email</label>
                    <p className="highlight-text">{profile.workEmail}</p>
                  </div>
                  <div className="profile-field">
                    <label>Personal Mobile Number</label>
                    <p>{profile.phone || '+91 98450 67890'}</p>
                  </div>
                  <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                    <label>Personal Email Address</label>
                    <p>{profile.personalEmail || 'priya.sundaram.design@gmail.com'}</p>
                  </div>
                  <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                    <label>Current Residential Address</label>
                    <p>{profile.currentAddress || 'Flat 402, Green Glen Layout, Bellandur, Bangalore 560103'}</p>
                  </div>
                  <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                    <label>Permanent Hometown Address</label>
                    <p>{profile.permanentAddress || '18, Temple Ring Road, Alwarpet, Chennai 600018'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts & Skills */}
            <div className="profile-sections-two-col" style={{ marginTop: 20 }}>
              <div className="profile-info-section">
                <div className="section-head">
                  <div className="section-head-title">
                    <Shield size={16} />
                    <h3>Emergency Contact Details</h3>
                  </div>
                  <button className="section-action-btn" onClick={openEditModal} hidden={!canEdit}>
                    <Edit3 size={12} /> Edit
                  </button>
                </div>

                <div className="emergency-contact-card">
                  <div className="emergency-icon-wrap">
                    <Phone size={20} color="#dc2626" />
                  </div>
                  <div className="emergency-meta">
                    <span className="emergency-rel-tag">{profile.emergencyRelation || 'Mother / Family'}</span>
                    <h4 className="emergency-name">{profile.emergencyContactName || 'Kavitha Sundaram'}</h4>
                    <p className="emergency-phone">{profile.emergencyPhone || '+91 98450 11223'}</p>
                  </div>
                </div>
              </div>

              <div className="profile-info-section">
                <div className="section-head">
                  <div className="section-head-title">
                    <Sparkles size={16} />
                    <h3>Core Competencies & Skills</h3>
                  </div>
                </div>

                <div className="skills-badge-list">
                  {profile.skills?.map((skill, i) => (
                    <span key={i} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 2: EMPLOYMENT & ORGANIZATION ──────── */}
        {activeTab === 'employment' && (
          <div className="profile-tab-pane">
            <div className="profile-info-section">
              <div className="section-head">
                <div className="section-head-title">
                  <Briefcase size={16} />
                  <h3>Organizational Hierarchy & Position</h3>
                </div>
              </div>

              <div className="profile-fields-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="profile-field">
                  <label>Employee Code</label>
                  <p><strong>{profile.id}</strong></p>
                </div>
                <div className="profile-field">
                  <label>Department</label>
                  <p><span className="dept-tag-link">{profile.department}</span></p>
                </div>
                <div className="profile-field">
                  <label>Designation</label>
                  <p>{profile.designation}</p>
                </div>

                <div className="profile-field">
                  <label>Employment Classification</label>
                  <p>{profile.employmentType || 'Full-Time Regular'}</p>
                </div>
                <div className="profile-field">
                  <label>Compensation Band / Grade</label>
                  <p>{profile.grade || 'L4 Senior Specialist'}</p>
                </div>
                <div className="profile-field">
                  <label>Date of Joining</label>
                  <p>{profile.doj || '12 May 2022'}</p>
                </div>

                <div className="profile-field">
                  <label>Probation Confirmation Date</label>
                  <p>{profile.confirmationDate || '12 Nov 2022'}</p>
                </div>
                <div className="profile-field">
                  <label>Reporting Manager</label>
                  <p><strong>{profile.reportingManager}</strong></p>
                </div>
                <div className="profile-field">
                  <label>Work Location / Branch</label>
                  <p>{profile.branch}</p>
                </div>

                <div className="profile-field">
                  <label>Standard Shift Timing</label>
                  <p>{profile.shift || '09:30 AM – 06:30 PM (General)'}</p>
                </div>
                <div className="profile-field">
                  <label>System Permission Level</label>
                  <p><span className="access-level-pill">{profile.role || 'Employee Self-Service'}</span></p>
                </div>
                <div className="profile-field">
                  <label>Self-Service Portal Access</label>
                  <p><span className="status-badge-ok">Enabled</span></p>
                </div>
              </div>
            </div>

            {/* Reporting Structure Card */}
            <div className="profile-info-section" style={{ marginTop: 20 }}>
              <div className="section-head">
                <div className="section-head-title">
                  <Building2 size={16} />
                  <h3>Organizational Reporting Tree</h3>
                </div>
              </div>

              <div className="org-tree-flow">
                <div className="org-node org-node--senior">
                  <div className="org-node-avatar">VM</div>
                  <div>
                    <span className="org-node-role">Direct Reporting Lead</span>
                    <h5 className="org-node-name">Vikram Malhotra</h5>
                    <p className="org-node-sub">VP Technology & Product Engineering</p>
                  </div>
                </div>

                <div className="org-tree-connector" />

                <div className="org-node org-node--current">
                  <div className="org-node-avatar org-node-avatar--current">
                    {profile.avatarInitials || 'PS'}
                  </div>
                  <div>
                    <span className="org-node-role">Current Position</span>
                    <h5 className="org-node-name">{profile.fullName} ({profile.id})</h5>
                    <p className="org-node-sub">{profile.designation} · {profile.department}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 3: BANK & STATUTORY IDENTIFIERS ──────── */}
        {activeTab === 'bank' && (
          <div className="profile-tab-pane">
            <div className="profile-sections-two-col">
              {/* Bank Account Details */}
              <div className="profile-info-section">
                <div className="section-head">
                  <div className="section-head-title">
                    <CreditCard size={16} />
                    <h3>Salary Bank Account Details</h3>
                  </div>
                  <button
                    type="button"
                    className="account-toggle-btn"
                    onClick={() => setShowAccountNum(!showAccountNum)}
                  >
                    {showAccountNum ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showAccountNum ? 'Hide Account No.' : 'Show Account No.'}</span>
                  </button>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label>Bank Name</label>
                    <p><strong>{profile.bankName || 'HDFC Bank Ltd.'}</strong></p>
                  </div>
                  <div className="profile-field">
                    <label>Account Type</label>
                    <p>{profile.accountType || 'Corporate Salary Account'}</p>
                  </div>
                  <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                    <label>Account Number</label>
                    <p className="mono-num">
                      {showAccountNum
                        ? (profile.accountNumber || '50100492819201')
                        : `•••• •••• •••• ${profile.accountNumber ? profile.accountNumber.slice(-4) : '9201'}`
                      }
                    </p>
                  </div>
                  <div className="profile-field">
                    <label>IFSC Code</label>
                    <p className="mono-num">{profile.ifscCode || 'HDFC0001042'}</p>
                  </div>
                  <div className="profile-field">
                    <label>Branch Name</label>
                    <p>{profile.branchName || 'Koramangala 80ft Road'}</p>
                  </div>
                </div>
              </div>

              {/* Statutory Identifiers */}
              <div className="profile-info-section">
                <div className="section-head">
                  <div className="section-head-title">
                    <Shield size={16} />
                    <h3>Statutory Compliance Identifiers</h3>
                  </div>
                </div>

                <div className="profile-fields-grid">
                  <div className="profile-field">
                    <label>Income Tax PAN Card</label>
                    <p className="mono-num"><strong>{profile.panNumber || 'ABCPS1234K'}</strong></p>
                  </div>
                  <div className="profile-field">
                    <label>Tax Regime Selection</label>
                    <p>{profile.taxRegime || 'New Tax Regime (Section 115BAC)'}</p>
                  </div>
                  <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                    <label>Universal Account Number (EPFO / PF UAN)</label>
                    <p className="mono-num">{profile.uanNumber || '100928374615'}</p>
                  </div>
                  <div className="profile-field" style={{ gridColumn: 'span 2' }}>
                    <label>Employees' State Insurance (ESIC IP Number)</label>
                    <p className="mono-num">{profile.esiNumber || '310928374615001'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="compliance-note-box" style={{ marginTop: 20 }}>
              <Lock size={16} />
              <span>
                <strong>Statutory Compliance Guard:</strong> Bank details, PAN, and PF UAN are encrypted and mapped for payroll processing. Any modification to bank accounts requires dual-factor OTP verification and HR payroll approval.
              </span>
            </div>
          </div>
        )}

        {/* ──────── TAB 4: LEAVE QUOTA & POLICY ──────── */}
        {activeTab === 'leave' && (
          <div className="profile-tab-pane">
            <div className="leave-quota-overview">
              <div className="quota-head">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Annual Leave Quota Allocation (CY 2026)</h3>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Accrual period: 01 Jan 2026 – 31 Dec 2026 • Policy: NexaSphere Standard Leave Policy v3.2</p>
                </div>
                <Link to="/leave" className="profile-btn profile-btn--primary">
                  <Calendar size={14} /> Open Leave Portal
                </Link>
              </div>

              <div className="leave-cards-grid">
                {/* Casual Leave */}
                <div className="leave-type-card">
                  <div className="type-badge type-badge--casual">Casual Leave (CL)</div>
                  <div className="type-count-row">
                    <h2>{profile.leaveBalances?.casual?.available ?? 4}</h2>
                    <span className="type-total">/ {profile.leaveBalances?.casual?.total ?? 6} Days</span>
                  </div>
                  <div className="type-progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((profile.leaveBalances?.casual?.available ?? 4) / (profile.leaveBalances?.casual?.total ?? 6)) * 100}%`,
                        background: '#2563eb'
                      }}
                    />
                  </div>
                  <div className="type-footer">
                    <span>Used: {profile.leaveBalances?.casual?.used ?? 2}d</span>
                    <span className="type-status">Available</span>
                  </div>
                </div>

                {/* Sick Leave */}
                <div className="leave-type-card">
                  <div className="type-badge type-badge--sick">Sick / Medical Leave (SL)</div>
                  <div className="type-count-row">
                    <h2>{profile.leaveBalances?.sick?.available ?? 8}</h2>
                    <span className="type-total">/ {profile.leaveBalances?.sick?.total ?? 10} Days</span>
                  </div>
                  <div className="type-progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((profile.leaveBalances?.sick?.available ?? 8) / (profile.leaveBalances?.sick?.total ?? 10)) * 100}%`,
                        background: '#ef4444'
                      }}
                    />
                  </div>
                  <div className="type-footer">
                    <span>Used: {profile.leaveBalances?.sick?.used ?? 2}d</span>
                    <span className="type-status">Medical proof &gt;2d</span>
                  </div>
                </div>

                {/* Earned Leave */}
                <div className="leave-type-card">
                  <div className="type-badge type-badge--earned">Earned / Privilege Leave (EL)</div>
                  <div className="type-count-row">
                    <h2>{profile.leaveBalances?.earned?.available ?? 12}</h2>
                    <span className="type-total">/ {profile.leaveBalances?.earned?.total ?? 15} Days</span>
                  </div>
                  <div className="type-progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((profile.leaveBalances?.earned?.available ?? 12) / (profile.leaveBalances?.earned?.total ?? 15)) * 100}%`,
                        background: '#10b981'
                      }}
                    />
                  </div>
                  <div className="type-footer">
                    <span>Used: {profile.leaveBalances?.earned?.used ?? 3}d</span>
                    <span className="type-status">Encashable / Carryover</span>
                  </div>
                </div>

                {/* Comp Off */}
                <div className="leave-type-card">
                  <div className="type-badge type-badge--compoff">Compensatory Off</div>
                  <div className="type-count-row">
                    <h2>{profile.leaveBalances?.compOff?.available ?? 2}</h2>
                    <span className="type-total">/ {profile.leaveBalances?.compOff?.total ?? 2} Days</span>
                  </div>
                  <div className="type-progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: '100%', background: '#8b5cf6' }}
                    />
                  </div>
                  <div className="type-footer">
                    <span>Used: {profile.leaveBalances?.compOff?.used ?? 0}d</span>
                    <span className="type-status">Valid 60 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 5: OFFICIAL DOCUMENTS ──────── */}
        {activeTab === 'documents' && (
          <div className="profile-tab-pane">
            <div className="profile-info-section">
              <div className="section-head">
                <div className="section-head-title">
                  <FileText size={16} />
                  <h3>Verified Personnel Documents & Proofs</h3>
                </div>
                <button
                  type="button"
                  className="profile-btn profile-btn--primary"
                  onClick={() => setIsDocModalOpen(true)}
                >
                  <FileText size={14} /> Upload New Document
                </button>
              </div>

              <div className="docs-table-wrapper">
                <table className="docs-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Type</th>
                      <th>File Size</th>
                      <th>Upload Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(profile.documents || []).map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div className="doc-cell">
                            <div className="doc-icon-badge">
                              <FileText size={16} />
                            </div>
                            <span className="doc-title">{doc.title}</span>
                          </div>
                        </td>
                        <td><span className="doc-type-pill">{doc.type}</span></td>
                        <td>{doc.size}</td>
                        <td>{doc.date}</td>
                        <td>
                          <span className={`doc-status-badge ${doc.status === 'Verified' ? 'doc-status--verified' : 'doc-status--submitted'}`}>
                            <CheckCircle2 size={12} /> {doc.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="doc-btn-view"
                            onClick={() => alert(`Opening preview for: ${doc.title}`)}
                          >
                            <ExternalLink size={13} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────
          SELF-SERVICE EDIT PROFILE MODAL
         ────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="profile-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {isEmployee ? 'Edit Personal Information' : `Edit Record · ${profile.fullName}`}
                </h3>
                <p className="modal-sub">
                  {isEmployee
                    ? 'Update your personal phone, emergency contacts, and residential addresses.'
                    : 'Administrator editing mode for employee master records.'
                  }
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body-scroll">
                {/* Employee Self-Service Section */}
                <div className="modal-form-group">
                  <h4 className="group-heading">Contact Details</h4>
                  <div className="modal-grid-2">
                    <div className="modal-field">
                      <label>Personal Mobile Number</label>
                      <input
                        type="tel"
                        className="modal-input"
                        value={editFormData.phone || ''}
                        onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                        placeholder="+91 98450 XXXXX"
                        required
                      />
                    </div>
                    <div className="modal-field">
                      <label>Personal Email Address</label>
                      <input
                        type="email"
                        className="modal-input"
                        value={editFormData.personalEmail || ''}
                        onChange={e => setEditFormData({ ...editFormData, personalEmail: e.target.value })}
                        placeholder="personal@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-field" style={{ marginTop: 12 }}>
                    <label>Current Residential Address</label>
                    <textarea
                      className="modal-textarea"
                      rows={2}
                      value={editFormData.currentAddress || ''}
                      onChange={e => setEditFormData({ ...editFormData, currentAddress: e.target.value })}
                      placeholder="Apartment, Street, Locality, City, PIN"
                    />
                  </div>
                </div>

                <div className="modal-form-group" style={{ marginTop: 20 }}>
                  <h4 className="group-heading">Emergency Contact Information</h4>
                  <div className="modal-grid-3">
                    <div className="modal-field">
                      <label>Contact Person Name</label>
                      <input
                        type="text"
                        className="modal-input"
                        value={editFormData.emergencyContactName || ''}
                        onChange={e => setEditFormData({ ...editFormData, emergencyContactName: e.target.value })}
                        placeholder="e.g. Kavitha Sundaram"
                        required
                      />
                    </div>
                    <div className="modal-field">
                      <label>Relationship</label>
                      <input
                        type="text"
                        className="modal-input"
                        value={editFormData.emergencyRelation || ''}
                        onChange={e => setEditFormData({ ...editFormData, emergencyRelation: e.target.value })}
                        placeholder="e.g. Mother, Spouse, Sibling"
                        required
                      />
                    </div>
                    <div className="modal-field">
                      <label>Emergency Phone</label>
                      <input
                        type="tel"
                        className="modal-input"
                        value={editFormData.emergencyPhone || ''}
                        onChange={e => setEditFormData({ ...editFormData, emergencyPhone: e.target.value })}
                        placeholder="+91 98450 XXXXX"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Mode Only Fields */}
                {!isEmployee && (
                  <div className="modal-form-group" style={{ marginTop: 20 }}>
                    <h4 className="group-heading" style={{ color: '#2563eb' }}>
                      👑 Enterprise Admin Fields
                    </h4>
                    <div className="modal-grid-2">
                      <div className="modal-field">
                        <label>Designation</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={editFormData.designation || ''}
                          onChange={e => setEditFormData({ ...editFormData, designation: e.target.value })}
                        />
                      </div>
                      <div className="modal-field">
                        <label>Department</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={editFormData.department || ''}
                          onChange={e => setEditFormData({ ...editFormData, department: e.target.value })}
                        />
                      </div>
                      <div className="modal-field">
                        <label>Reporting Manager</label>
                        <input
                          type="text"
                          className="modal-input"
                          value={editFormData.reportingManager || ''}
                          onChange={e => setEditFormData({ ...editFormData, reportingManager: e.target.value })}
                        />
                      </div>
                      <div className="modal-field">
                        <label>Employment Status</label>
                        <select
                          className="modal-input"
                          value={editFormData.status || 'Active'}
                          onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Probation">Probation</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="profile-btn profile-btn--outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-btn profile-btn--primary">
                  <Save size={14} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────
          UPLOAD DOCUMENT MODAL
         ────────────────────────────────────────────── */}
      {isDocModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsDocModalOpen(false)}>
          <div className="profile-doc-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Upload Personnel Document</h3>
                <p className="modal-sub">Add identity proofs, certifications, or tax declarations.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsDocModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadDocument}>
              <div style={{ padding: 20 }}>
                <div className="modal-field">
                  <label>Document Title / Category *</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={newDocTitle}
                    onChange={e => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Certified Cloud Architect Certificate"
                    required
                  />
                </div>

                <div className="modal-field" style={{ marginTop: 14 }}>
                  <label>Select Document File (PDF, PNG, JPG max 5MB)</label>
                  <input
                    type="file"
                    className="modal-input"
                    onChange={e => setNewDocFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="profile-btn profile-btn--outline"
                  onClick={() => setIsDocModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-btn profile-btn--primary">
                  <Save size={14} /> Upload & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
