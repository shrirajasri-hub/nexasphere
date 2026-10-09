import { useState, useEffect, useRef } from 'react';
import {
  Calendar, Plus, Filter, Download,
  FileText, Send, Users, Mic, MicOff,
  UploadCloud, Paperclip, Trash2, CheckCircle2,
  Clock, User, X, Volume2, Sparkles, Eye,
  PhoneCall, FileCheck2, AlertTriangle, Lock, ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import './LeaveManagement.css';

const ALL_STAFF_MEMBERS = [
  { empId: 'EMP-2041', name: 'Priya Sundaram', dept: 'Design & UX', manager: 'Vikram Malhotra (VP Tech)' },
  { empId: 'EMP00101', name: 'Aarav Sharma', dept: 'Engineering', manager: 'Vikram Malhotra (VP Tech)' },
  { empId: 'EMP00102', name: 'Priya Patel', dept: 'HR', manager: 'Sarah Jenkins (Director HR)' },
  { empId: 'EMP-1082', name: 'Arun Kumar', dept: 'Production', manager: 'Karthik Raja (Plant Head)' },
  { empId: 'EMP-3012', name: 'Meena Ramesh', dept: 'Quality Assurance', manager: 'Senthil Nathan (QA Head)' },
  { empId: 'EMP-2098', name: 'Vignesh M.', dept: 'Maintenance', manager: 'Suresh Babu (Operations)' }
];

const INITIAL_REQUESTS = [
  {
    id: 'LR-2026-104',
    employeeName: 'Priya Sundaram',
    empId: 'EMP-2041',
    department: 'Design & UX',
    leaveType: 'Sick Leave (SL)',
    duration: 'Full Day',
    dates: '14 Oct 2026 - 15 Oct 2026',
    fromDate: '2026-10-14',
    toDate: '2026-10-15',
    days: 2,
    reason: 'Severe viral throat infection and fever, doctor advised 2 days rest.',
    manager: 'Sarah Jenkins (Director of Eng)',
    handoverTo: 'Arun Kumar',
    emergencyPhone: '+91 98401 23456',
    attachmentName: 'Medical_Prescription.pdf',
    attachmentSize: '512 KB',
    status: 'Pending Approval',
    submittedOn: '07 Oct 2026',
    regularised: true
  },
  {
    id: 'LR-2026-092',
    employeeName: 'Priya Sundaram',
    empId: 'EMP-2041',
    department: 'Design & UX',
    leaveType: 'Casual Leave (CL)',
    duration: 'Full Day',
    dates: '26 Sep 2026 - 28 Sep 2026',
    fromDate: '2026-09-26',
    toDate: '2026-09-28',
    days: 3,
    reason: 'Attending family wedding reception in hometown.',
    manager: 'Sarah Jenkins (Director of Eng)',
    handoverTo: 'Arun Kumar',
    emergencyPhone: '+91 98401 23456',
    attachmentName: 'Wedding_Invite.pdf',
    attachmentSize: '310 KB',
    status: 'Approved',
    submittedOn: '20 Sep 2026',
    regularised: true
  },
  {
    id: 'LR-2026-089',
    employeeName: 'Elena Rostova',
    empId: 'EMP-4421',
    department: 'Product & Design',
    leaveType: 'Earned Leave (EL)',
    duration: 'Full Day',
    dates: '12 Oct 2026 - 15 Oct 2026',
    fromDate: '2026-10-12',
    toDate: '2026-10-15',
    days: 4,
    reason: 'Annual family vacation approved during sprint planning.',
    manager: 'Sarah Jenkins',
    handoverTo: 'Marcus Vance',
    emergencyPhone: '+1 (555) 382-9912',
    attachmentName: 'Travel_Itinerary.pdf',
    attachmentSize: '420 KB',
    status: 'Approved',
    submittedOn: '04 Oct 2026',
    regularised: true
  }
];

const INITIAL_BALANCES = [
  { id: 'cl', label: 'Casual Leave (CL)', allocated: 12, used: 4, color: '#2563eb' },
  { id: 'sl', label: 'Sick Leave (SL)', allocated: 10, used: 2, color: '#ef4444' },
  { id: 'el', label: 'Earned Leave (EL)', allocated: 18, used: 6, color: '#10b981' },
  { id: 'mat', label: 'Maternity/Paternity', allocated: 90, used: 0, color: '#8b5cf6' },
];

const PRESET_REASONS = [
  'Viral Fever & Doctor Advised Rest',
  'Family Urgent Commitment',
  'Annual Health Checkup',
  'Personal Work / Relocation',
  'Attending Wedding Ceremony',
  'Dental Procedure Recovery'
];

export default function LeaveManagement() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_auth');
      return saved ? JSON.parse(saved) : { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041', dept: 'Design & UX' };
    } catch {
      return { role: 'employee', name: 'Priya Sundaram', empId: 'EMP-2041', dept: 'Design & UX' };
    }
  });

  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem('nexa_auth');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
        }
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

  const [showApplyForm, setShowApplyForm] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('action') === 'apply';
    }
    return false;
  });

  const [balances, setBalances] = useState(INITIAL_BALANCES);

  // Load from persistent localStorage or seed
  const [submittedRequests, setSubmittedRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('nexa_leave_requests');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REQUESTS;
  });

  const persistRequests = (next) => {
    setSubmittedRequests(next);
    try {
      localStorage.setItem('nexa_leave_requests', JSON.stringify(next));
      window.dispatchEvent(new Event('nexa_leave_updated'));
    } catch (e) {
      console.warn('Failed to persist leave requests', e);
    }
  };

  // Listen to cross-tab or cross-component leave updates
  useEffect(() => {
    const handleLeaveSync = () => {
      try {
        const saved = localStorage.getItem('nexa_leave_requests');
        if (saved) setSubmittedRequests(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('nexa_leave_updated', handleLeaveSync);
    return () => window.removeEventListener('nexa_leave_updated', handleLeaveSync);
  }, []);

  // Manager On-Behalf Emergency Block Modal State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockEmpId, setBlockEmpId] = useState('EMP-2041');
  const [blockLeaveType, setBlockLeaveType] = useState('Sick Leave (SL)');
  const [blockDuration, setBlockDuration] = useState('Full Day');
  const [blockFromDate, setBlockFromDate] = useState('2026-10-16');
  const [blockToDate, setBlockToDate] = useState('2026-10-17');
  const [blockNote, setBlockNote] = useState('Employee called via phone citing emergency outside office premises. Dates reserved pending employee regularisation with medical proof upon return.');

  // Employee Regularisation Modal State
  const [regularisingRequest, setRegularisingRequest] = useState(null);
  const [regReason, setRegReason] = useState('');
  const [regHandover, setRegHandover] = useState('Arun Kumar');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('+91 98450 67890');
  const [regAttachment, setRegAttachment] = useState(null);
  // Form State initialized with logged-in user details
  const [employeeName, setEmployeeName] = useState(currentUser.name || 'Priya Sundaram');
  const [employeeId, setEmployeeId] = useState(currentUser.empId || 'EMP-2041');
  const [department, setDepartment] = useState(currentUser.dept || 'Design & UX');
  const [reportingManager, setReportingManager] = useState('Sarah Jenkins (Director of Eng)');
  const [leaveType, setLeaveType] = useState('Sick Leave (SL)');
  const [durationMode, setDurationMode] = useState('Full Day');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [handoverTo, setHandoverTo] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Voice to Text State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const [voiceNotice, setVoiceNotice] = useState('');
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak your reason clearly into your microphone.');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        if (finalTranscript) {
          setReason(prev => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone access blocked. Please allow mic permission in your browser.');
        } else {
          setVoiceNotice(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Toggle Voice Recognition
  const toggleListening = () => {
    if (!speechSupported) {
      // Simulate voice input fallback so user can test the experience anytime
      setVoiceNotice('Web Speech API not detected in this browser. Simulating voice transcription...');
      setTimeout(() => {
        const sampleSpokenTexts = [
          'Suffering from acute migraine and physician recommended 2 days bed rest.',
          'Need urgent personal leave to attend an urgent family emergency out of town.',
          'High fever and throat infection, consulting physician today.'
        ];
        const randomSpeech = sampleSpokenTexts[Math.floor(Math.random() * sampleSpokenTexts.length)];
        setReason(prev => (prev ? `${prev.trim()} ${randomSpeech}` : randomSpeech));
        setVoiceNotice('Simulated speech-to-text converted successfully!');
        setTimeout(() => setVoiceNotice(''), 3500);
      }, 700);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVoiceNotice('');
    } else {
      try {
        setVoiceNotice('Requesting microphone access...');
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start failed', err);
        // If already started, restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current.start(), 200);
        } catch {
          // fallback
        }
      }
    }
  };

  // Calculate Days
  const calculateDays = () => {
    if (!fromDate || !toDate) return 1;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (isNaN(start) || isNaN(end) || end < start) return 1;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return durationMode.includes('Half') ? 0.5 : diffDays;
  };

  const calculatedDays = calculateDays();

  // File Handling
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        previewUrl: file.type.startsWith('image/') ? reader.result : null
      });
      setFormErrors(prev => ({ ...prev, attachment: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate and Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!employeeName.trim()) errors.employeeName = 'Employee Name is required';
    if (!employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!department.trim()) errors.department = 'Department is required';
    if (!reportingManager.trim()) errors.reportingManager = 'Reporting Manager is required';
    if (!leaveType) errors.leaveType = 'Please select a leave type';
    if (!fromDate) errors.fromDate = 'Start Date is required';
    if (!toDate) errors.toDate = 'End Date is required';
    if (!reason.trim()) errors.reason = 'Please provide a reason (type or use mic)';
    if (!handoverTo.trim()) errors.handoverTo = 'Please assign a work handover colleague';
    if (!emergencyPhone.trim()) errors.emergencyPhone = 'Emergency contact is required';

    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      errors.toDate = 'End date cannot be earlier than start date';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Create New Request
    const newReq = {
      id: `LR-2026-${Math.floor(100 + Math.random() * 900)}`,
      employeeName,
      empId: employeeId,
      department,
      leaveType,
      duration: durationMode,
      dates: fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`,
      days: calculatedDays,
      reason,
      manager: reportingManager,
      handoverTo,
      emergencyPhone,
      fromDate,
      toDate,
      attachmentName: attachment ? attachment.name : null,
      attachmentSize: attachment ? attachment.size : null,
      status: 'Pending Approval',
      submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      regularised: true
    };

    persistRequests([newReq, ...submittedRequests]);

    // Update balance preview
    setBalances(prev => prev.map(b => {
      if (leaveType.toLowerCase().includes(b.id)) {
        return { ...b, used: Math.min(b.allocated, b.used + calculatedDays) };
      }
      return b;
    }));

    // Trigger toast notification
    setToastMessage(`Leave request ${newReq.id} submitted successfully! Handed over to ${handoverTo}.`);
    setTimeout(() => setToastMessage(''), 5000);

    // Reset Form Fields
    setReason('');
    setFromDate('');
    setToDate('');
    setHandoverTo('');
    setEmergencyPhone('');
    setAttachment(null);
    setShowApplyForm(false);
  };

  const handleWithdrawRequest = (reqId) => {
    const target = submittedRequests.find(r => r.id === reqId);
    if (!target) return;
    if (window.confirm(`Are you sure you want to withdraw leave request ${reqId}?`)) {
      persistRequests(submittedRequests.filter(r => r.id !== reqId));
      setBalances(prev => prev.map(b => {
        if (target.leaveType.toLowerCase().includes(b.id)) {
          return { ...b, used: Math.max(0, b.used - target.days) };
        }
        return b;
      }));
      setToastMessage(`Leave request ${reqId} was withdrawn successfully.`);
      setTimeout(() => setToastMessage(''), 4000);
      if (selectedRequest?.id === reqId) setSelectedRequest(null);
    }
  };

  const handleApprove = (reqId) => {
    persistRequests(submittedRequests.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r));
    setToastMessage(`Leave request ${reqId} has been approved.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleReject = (reqId) => {
    const target = submittedRequests.find(r => r.id === reqId);
    persistRequests(submittedRequests.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r));
    if (target) {
      setBalances(prev => prev.map(b => {
        if (target.leaveType.toLowerCase().includes(b.id)) {
          return { ...b, used: Math.max(0, b.used - target.days) };
        }
        return b;
      }));
    }
    setToastMessage(`Leave request ${reqId} has been rejected.`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ─── Manager On-Behalf Emergency Leave Blocking Handler ───
  const handleManagerBlockLeave = (e) => {
    e.preventDefault();
    const staff = ALL_STAFF_MEMBERS.find(s => s.empId === blockEmpId) || ALL_STAFF_MEMBERS[0];
    const start = new Date(blockFromDate);
    const end = new Date(blockToDate);
    const diff = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
    const daysCount = blockDuration.includes('Half') ? 0.5 : (isNaN(diff) ? 1 : diff);

    const newBlockedReq = {
      id: `LR-2026-BLK${Math.floor(100 + Math.random() * 900)}`,
      employeeName: staff.name,
      empId: staff.empId,
      department: staff.dept,
      leaveType: blockLeaveType,
      duration: blockDuration,
      dates: blockFromDate === blockToDate ? blockFromDate : `${blockFromDate} to ${blockToDate}`,
      fromDate: blockFromDate,
      toDate: blockToDate,
      days: daysCount,
      reason: `[Emergency Call Intake]: ${blockNote}`,
      manager: currentUser.name || staff.manager || 'Reporting Manager',
      handoverTo: 'Pending Employee Regularisation',
      emergencyPhone: 'Reported via Phone Call',
      attachmentName: null,
      attachmentSize: null,
      status: 'Dates Blocked (Pending Regularisation)',
      isManagerBlocked: true,
      blockedBy: currentUser.name || 'Reporting Manager',
      blockedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      regularised: false
    };

    persistRequests([newBlockedReq, ...submittedRequests]);
    setShowBlockModal(false);
    setToastMessage(`Emergency leave dates successfully blocked for ${staff.name} (${staff.empId})! The employee will be prompted to regularise upon returning to office.`);
    setTimeout(() => setToastMessage(''), 6000);
  };

  // ─── Employee Regularisation Handlers ───
  const handleOpenRegularise = (req) => {
    setRegularisingRequest(req);
    setRegReason('');
    setRegHandover('Arun Kumar');
    setRegEmergencyPhone('+91 98450 67890');
    setRegAttachment(null);
  };

  const handleRegFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds the 10MB limit.');
        return;
      }
      setRegAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      });
    }
  };

  const toggleRegListening = () => {
    if (!speechSupported) {
      const sample = 'Suffering from severe acute migraine and throat infection. Attended medical clinic and attached prescription.';
      setRegReason(prev => (prev ? `${prev.trim()} ${sample}` : sample));
      setToastMessage('Simulated speech transcription converted successfully!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript + ' ';
            }
            if (finalTranscript) {
              setRegReason(prev => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
            }
          };
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.warn('Speech recognition error:', err);
      }
    }
  };

  const handleSubmitRegularisation = (e) => {
    e.preventDefault();
    if (!regReason.trim()) {
      alert('Please state the reason for your emergency leave.');
      return;
    }
    const updated = submittedRequests.map(r => {
      if (r.id === regularisingRequest.id) {
        return {
          ...r,
          status: 'Approved (Regularised)',
          reason: regReason.trim(),
          handoverTo: regHandover,
          emergencyPhone: regEmergencyPhone,
          attachmentName: regAttachment ? regAttachment.name : (r.attachmentName || null),
          attachmentSize: regAttachment ? regAttachment.size : (r.attachmentSize || null),
          regularised: true,
          regularisedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return r;
    });

    persistRequests(updated);
    setRegularisingRequest(null);
    setToastMessage(`Leave request ${regularisingRequest.id} has been regularised successfully with reason and proof documents!`);
    setTimeout(() => setToastMessage(''), 6000);
  };

  const isEmployee = currentUser?.role === 'employee';

  const myRequests = submittedRequests.filter(req =>
    req.empId === currentUser?.empId ||
    req.employeeName.toLowerCase().includes('priya') ||
    (currentUser?.name && req.employeeName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]))
  );

  const pendingBlockedRequests = myRequests.filter(req =>
    req.status === 'Dates Blocked (Pending Regularisation)' && !req.regularised
  );

  const displayedRequests = isEmployee
    ? myRequests
    : submittedRequests;

  return (
    <div className="leave-page">
      {/* ─── Notification Toast ─── */}
      {toastMessage && (
        <div className="leave-toast">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="toast-close-btn"><X size={14} /></button>
        </div>
      )}

      {/* ─── Page Header ─── */}
      <div className="leave-header">
        <div>
          <h1 className="leave-title">
            {showApplyForm ? 'Apply for Leave' : 'Leave Management System'}
          </h1>
          <p className="leave-sub">
            {showApplyForm
              ? 'Complete the form below to submit a new leave request application'
              : 'Configure leave policies, view real-time balances, and manage workforce requests'
            }
          </p>
        </div>
        <div className="leave-header-actions">
          {showApplyForm ? (
            <button
              type="button"
              className="leave-btn-outline"
              onClick={() => setShowApplyForm(false)}
            >
              <ArrowLeft size={14} /> Back to Leave History
            </button>
          ) : (
            <>
              {!isEmployee && (
                <button
                  type="button"
                  className="leave-btn-block-manager"
                  onClick={() => setShowBlockModal(true)}
                  title="Block leave dates on behalf of an employee who called with an emergency outside office premises"
                >
                  <PhoneCall size={14} /> Block Leave for Employee (Emergency Call)
                </button>
              )}
              <button className="leave-btn-outline"><Download size={14} /> Export Policy</button>
              <button className="leave-btn-primary" onClick={() => setShowApplyForm(true)}>
                <Plus size={15} /> Apply for Leave
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── Emergency Blocked Leave Alert Banner for Employee ─── */}
      {!showApplyForm && isEmployee && pendingBlockedRequests.length > 0 && (
        <div className="leave-blocked-alert-banner">
          <div className="blocked-alert-content">
            <div className="blocked-alert-icon">
              <PhoneCall size={22} color="#b45309" />
            </div>
            <div>
              <div className="blocked-alert-badge">Action Required · Emergency Leave Regularisation</div>
              <h4 className="blocked-alert-title">
                Manager Reserved Dates: {pendingBlockedRequests[0].dates} ({pendingBlockedRequests[0].days} {pendingBlockedRequests[0].days === 1 ? 'Day' : 'Days'}) — {pendingBlockedRequests[0].leaveType}
              </h4>
              <p className="blocked-alert-desc">
                Your reporting manager reserved these emergency dates following your phone call outside office premises. Now that you are in office, please complete your application with your reason (voice/text) and upload supporting proof documents.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-regularise-banner"
            onClick={() => handleOpenRegularise(pendingBlockedRequests[0])}
          >
            <FileCheck2 size={15} /> Regularise Leave & Submit Proof
          </button>
        </div>
      )}

      {/* ─── Enhanced Enterprise Leave Application Form ─── */}
      {showApplyForm && (
        <div className="leave-apply-card">
          <div className="leave-apply-header">
            <div className="leave-apply-header-left">
              <button
                type="button"
                className="btn-back-breadcrumb"
                onClick={() => setShowApplyForm(false)}
                title="Return to Leave Applications & History"
              >
                <ArrowLeft size={13} /> Back to Leave History
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <div className="leave-icon-badge">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="leave-apply-title">New Leave Request Application</h3>
                  <p className="leave-apply-sub">
                    Complete the required fields below. You can <strong>type</strong> your reason or click the <strong>microphone</strong> to speak and convert voice into text.
                  </p>
                </div>
              </div>
            </div>
            <div className="leave-form-req-pill">
              <span className="req-star">*</span> All fields required
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Employee & Manager Information */}
            <div className="form-section-title">
              <User size={14} /> 1. Employee & Approver Information
            </div>
            <div className="leave-form-grid">
              <div className="leave-field">
                <label>Employee Name <span className="req-star">*</span></label>
                <input
                  type="text"
                  className={`leave-input ${formErrors.employeeName ? 'input-error' : ''}`}
                  value={employeeName}
                  onChange={e => setEmployeeName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                />
                {formErrors.employeeName && <span className="err-msg">{formErrors.employeeName}</span>}
              </div>

              <div className="leave-field">
                <label>Employee ID <span className="req-star">*</span></label>
                <input
                  type="text"
                  className={`leave-input ${formErrors.employeeId ? 'input-error' : ''}`}
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-8842"
                />
                {formErrors.employeeId && <span className="err-msg">{formErrors.employeeId}</span>}
              </div>

              <div className="leave-field">
                <label>Department <span className="req-star">*</span></label>
                <select
                  className={`leave-input ${formErrors.department ? 'input-error' : ''}`}
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                >
                  <option value="Engineering">Engineering & Tech</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Human Resources">Human Resources (HR)</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Operations">Operations & Logistics</option>
                </select>
                {formErrors.department && <span className="err-msg">{formErrors.department}</span>}
              </div>

              <div className="leave-field">
                <label>Reporting Manager / Approver <span className="req-star">*</span></label>
                <input
                  type="text"
                  className={`leave-input ${formErrors.reportingManager ? 'input-error' : ''}`}
                  value={reportingManager}
                  onChange={e => setReportingManager(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                />
                {formErrors.reportingManager && <span className="err-msg">{formErrors.reportingManager}</span>}
              </div>
            </div>

            {/* Section 2: Leave Type, Mode & Dates */}
            <div className="form-section-title">
              <Clock size={14} /> 2. Leave Schedule & Duration
            </div>
            <div className="leave-form-grid">
              <div className="leave-field">
                <label>Leave Type <span className="req-star">*</span></label>
                <select
                  className={`leave-input ${formErrors.leaveType ? 'input-error' : ''}`}
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                >
                  <option value="">Select Leave Category</option>
                  <option value="Casual Leave (CL)">Casual Leave (CL) — Available: 8 days</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL) — Available: 8 days</option>
                  <option value="Earned Leave (EL)">Earned Leave (EL) — Available: 12 days</option>
                  <option value="Maternity/Paternity">Maternity / Paternity Leave — 90 days</option>
                  <option value="Compensatory Off">Compensatory Off (Comp-Off)</option>
                  <option value="Bereavement Leave">Bereavement Leave</option>
                  <option value="Leave Without Pay (LWP)">Leave Without Pay (LWP)</option>
                </select>
                {formErrors.leaveType && <span className="err-msg">{formErrors.leaveType}</span>}
              </div>

              <div className="leave-field">
                <label>Duration Mode <span className="req-star">*</span></label>
                <select
                  className="leave-input"
                  value={durationMode}
                  onChange={e => setDurationMode(e.target.value)}
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day (First Half / Morning)">Half Day (First Half: 9:00 AM - 1:00 PM)</option>
                  <option value="Half Day (Second Half / Evening)">Half Day (Second Half: 1:30 PM - 5:30 PM)</option>
                </select>
              </div>

              <div className="leave-field">
                <label>From Date <span className="req-star">*</span></label>
                <input
                  type="date"
                  className={`leave-input ${formErrors.fromDate ? 'input-error' : ''}`}
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                {formErrors.fromDate && <span className="err-msg">{formErrors.fromDate}</span>}
              </div>

              <div className="leave-field">
                <label>To Date <span className="req-star">*</span></label>
                <input
                  type="date"
                  className={`leave-input ${formErrors.toDate ? 'input-error' : ''}`}
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
                {formErrors.toDate && <span className="err-msg">{formErrors.toDate}</span>}
              </div>
            </div>

            {/* Calculated Days Preview Ribbon */}
            {fromDate && toDate && (
              <div className="leave-days-badge">
                <Clock size={14} color="#0284c7" />
                <span>Calculated Total Duration: <strong>{calculatedDays} {calculatedDays === 1 ? 'Working Day' : 'Working Days'}</strong></span>
                {durationMode.includes('Half') && <span className="half-pill">Half-day applied</span>}
              </div>
            )}

            {/* Section 3: Reason for Leave with Voice Dictation (Mic) + Typing */}
            <div className="form-section-title">
              <Sparkles size={14} /> 3. Reason for Leave (Type or Speak via Microphone)
            </div>
            <div className="leave-field leave-field--full">
              <div className="reason-header-bar">
                <label>
                  Reason / Justification <span className="req-star">*</span>
                </label>

                {/* Voice Input Mic Trigger Button */}
                <div className="voice-control-group">
                  <button
                    type="button"
                    className={`mic-btn ${isListening ? 'mic-btn--active' : ''}`}
                    onClick={toggleListening}
                    title={isListening ? 'Click to Stop Recording' : 'Click to Speak via Microphone'}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={15} />
                        <span>Stop Voice Input</span>
                      </>
                    ) : (
                      <>
                        <Mic size={15} />
                        <span>Speak to Type (Mic)</span>
                      </>
                    )}
                  </button>

                  {reason && (
                    <button
                      type="button"
                      className="clear-voice-btn"
                      onClick={() => setReason('')}
                      title="Clear text"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Listening Indicator Wave */}
              {isListening && (
                <div className="listening-indicator">
                  <div className="listening-pulse">
                    <span className="pulse-bar" />
                    <span className="pulse-bar" />
                    <span className="pulse-bar" />
                    <span className="pulse-bar" />
                    <span className="pulse-bar" />
                  </div>
                  <span className="listening-text">
                    Listening to your voice... Speak your leave reason clearly.
                  </span>
                </div>
              )}

              {voiceNotice && !isListening && (
                <div className="voice-notice-banner">
                  <Volume2 size={14} />
                  <span>{voiceNotice}</span>
                </div>
              )}

              <div className="reason-textarea-container">
                <textarea
                  rows={3}
                  className={`leave-textarea ${formErrors.reason ? 'input-error' : ''}`}
                  placeholder="Type your leave reason in detail, or click 'Speak to Type (Mic)' to dictate hands-free..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
              {formErrors.reason && <span className="err-msg">{formErrors.reason}</span>}

              {/* Quick Reason Suggestion Chips */}
              <div className="preset-reasons">
                <span className="preset-label">Quick suggestions:</span>
                {PRESET_REASONS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="preset-chip"
                    onClick={() => setReason(prev => (prev ? `${prev} • ${p}` : p))}
                  >
                    + {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Handover & Emergency Contact */}
            <div className="form-section-title">
              <Users size={14} /> 4. Work Delegation & Emergency Contact
            </div>
            <div className="leave-form-grid">
              <div className="leave-field leave-field--span-2">
                <label>Work Handover / Backup Colleague <span className="req-star">*</span></label>
                <input
                  type="text"
                  className={`leave-input ${formErrors.handoverTo ? 'input-error' : ''}`}
                  value={handoverTo}
                  onChange={e => setHandoverTo(e.target.value)}
                  placeholder="e.g. David Kumar (Lead Frontend Dev)"
                />
                {formErrors.handoverTo && <span className="err-msg">{formErrors.handoverTo}</span>}
              </div>

              <div className="leave-field leave-field--span-2">
                <label>Emergency Contact Number During Leave <span className="req-star">*</span></label>
                <input
                  type="text"
                  className={`leave-input ${formErrors.emergencyPhone ? 'input-error' : ''}`}
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 749-2810"
                />
                {formErrors.emergencyPhone && <span className="err-msg">{formErrors.emergencyPhone}</span>}
              </div>
            </div>

            {/* Section 5: Supporting Documents / File Upload Section */}
            <div className="form-section-title">
              <Paperclip size={14} /> 5. Supporting Documents / File Attachment
            </div>
            <div className="leave-field leave-field--full">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                onChange={handleFileChange}
              />

              {!attachment ? (
                <div
                  className={`file-dropzone ${isDragOver ? 'file-dropzone--drag' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="dropzone-icon">
                    <UploadCloud size={30} color="#0284c7" />
                  </div>
                  <div className="dropzone-content">
                    <div className="dropzone-title">
                      Click to browse or drag & drop supporting files
                    </div>
                    <div className="dropzone-subtitle">
                      Required for Sick Leave exceeding 2 days, medical certificates, or travel tickets (PDF, PNG, JPG, DOCX up to 10MB)
                    </div>
                  </div>
                  <button type="button" className="dropzone-btn">
                    Browse File
                  </button>
                </div>
              ) : (
                <div className="attachment-preview-card">
                  <div className="attachment-left">
                    <div className="attachment-icon">
                      <FileText size={22} color="#0284c7" />
                    </div>
                    <div>
                      <div className="attachment-name">{attachment.name}</div>
                      <div className="attachment-meta">
                        <span>{attachment.size}</span>
                        <span className="dot-sep">•</span>
                        <span className="badge-ready">Ready for upload</span>
                      </div>
                    </div>
                  </div>
                  <div className="attachment-right">
                    {attachment.previewUrl && (
                      <img
                        src={attachment.previewUrl}
                        alt="Preview"
                        className="attachment-thumb"
                      />
                    )}
                    <button
                      type="button"
                      className="attachment-remove-btn"
                      onClick={removeAttachment}
                      title="Remove Attachment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="leave-form-actions">
              <button
                type="button"
                className="leave-btn-outline"
                onClick={() => setShowApplyForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="leave-btn-primary">
                <Send size={15} /> Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Leave Summary Cards & Applications History Queue (Hidden while applying) ─── */}
      {!showApplyForm && (
        <>
          <div className="leave-summary-grid">
            {balances.map(item => {
              const remaining = item.allocated - item.used;
              const percentage = Math.round((item.used / item.allocated) * 100);
              return (
                <div key={item.id} className="leave-stat-card">
                  <div className="leave-stat-card__top">
                    <span className="leave-stat-card__dot" style={{ background: item.color }} />
                    <span className="leave-stat-card__label">{item.label}</span>
                  </div>
                  <div className="leave-stat-card__main">
                    <span className="leave-stat-card__bal">{remaining}</span>
                    <span className="leave-stat-card__sub">/ {item.allocated} days available</span>
                  </div>
                  <div className="leave-stat-card__bar-bg">
                    <div
                      className="leave-stat-card__bar-fill"
                      style={{ width: `${percentage}%`, background: item.color }}
                    />
                  </div>
                  <div className="leave-stat-card__foot">
                    <span>{item.used} Days Used</span>
                    <span>{percentage}% Utilized</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="leave-table-card">
            <div className="leave-table-card__header">
              <div>
                <h3 className="leave-table-card__title">
                  {isEmployee ? 'My Leave Applications & History' : 'Leave Requests & Approvals Queue'}
                </h3>
                <p className="leave-table-card__sub">
                  {isEmployee
                    ? 'Your personal leave submissions, approval status & audit trail'
                    : 'Real-time workflow approval queue across departments'
                  }
                </p>
              </div>
              <div className="leave-table-actions">
                {isEmployee ? (
                  <div className="leave-filter-pill">
                    <Filter size={12} /> My Records ({myRequests.length})
                  </div>
                ) : (
                  <div className="leave-filter-pill">
                    <Filter size={12} /> Total Records ({submittedRequests.length})
                  </div>
                )}
              </div>
            </div>

            <div className="leave-table-responsive">
              <table className="leave-custom-table">
                <thead>
                  <tr>
                    <th>Request ID & Employee</th>
                    <th>Department</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Reason & Handover</th>
                    <th>Attachment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.length === 0 ? (
                    <tr className="leave-empty-row">
                      <td colSpan={9}>
                        <div className="leave-empty-state">
                          <Calendar size={36} />
                          <h4>No Leave Requests Found</h4>
                          <p>
                            {isEmployee
                              ? 'You have no submitted leave applications in this view. Click "Apply for Leave" above to create an entry.'
                              : 'Click "Apply for Leave" above to create your first leave request entry.'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div className="emp-cell">
                            <div className="emp-cell-avatar">
                              {req.employeeName.charAt(0)}
                            </div>
                            <div>
                              <div className="emp-cell-name">{req.employeeName}</div>
                              <div className="emp-cell-id">{req.id} • {req.empId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="dept-tag">{req.department}</span>
                        </td>
                        <td>
                          <span className="leave-tag">{req.leaveType}</span>
                        </td>
                        <td>
                          <div className="duration-cell">
                            <div className="date-range">{req.dates}</div>
                            <div className="mode-sub">{req.duration}</div>
                          </div>
                        </td>
                        <td>
                          <strong>{req.days}d</strong>
                        </td>
                        <td>
                          <div className="reason-cell">
                            <div className="reason-text" title={req.reason}>"{req.reason}"</div>
                            <div className="handover-sub">
                              Handover: <span>{req.handoverTo}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          {req.attachmentName ? (
                            <div
                              className="file-badge"
                              title={req.attachmentName}
                              onClick={() => setSelectedRequest(req)}
                              role="button"
                              tabIndex={0}
                            >
                              <Paperclip size={12} />
                              <span>{req.attachmentName}</span>
                            </div>
                          ) : (
                            <span className="no-file-text">None</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-pill ${
                            req.status === 'Approved' || req.status === 'Approved (Regularised)' ? 'status-approved' :
                            req.status === 'Dates Blocked (Pending Regularisation)' ? 'status-blocked' :
                            req.status === 'Pending Approval' ? 'status-pending' : 'status-rejected'
                          }`}>
                            {req.status === 'Dates Blocked (Pending Regularisation)' ? '⚠️ Blocked (Action Req.)' : req.status}
                          </span>
                        </td>
                        <td>
                          {isEmployee ? (
                            <div className="action-row">
                              {req.status === 'Dates Blocked (Pending Regularisation)' && !req.regularised && (
                                <button
                                  type="button"
                                  className="btn-regularise-table"
                                  onClick={() => handleOpenRegularise(req)}
                                  title="Submit reason and documents to regularise this leave"
                                >
                                  <FileCheck2 size={12} /> Regularise
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn-view-details"
                                onClick={() => setSelectedRequest(req)}
                                title="View full request details"
                              >
                                <Eye size={12} /> Details
                              </button>
                              {req.status === 'Pending Approval' && (
                                <button
                                  type="button"
                                  className="btn-withdraw"
                                  onClick={() => handleWithdrawRequest(req.id)}
                                  title="Withdraw this pending request"
                                >
                                  <Trash2 size={12} /> Withdraw
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="action-row">
                              {req.status === 'Dates Blocked (Pending Regularisation)' && (
                                <span className="manager-blocked-tag" title="Dates were reserved via emergency phone call intake">
                                  <PhoneCall size={11} /> Blocked via Call
                                </span>
                              )}
                              {req.status === 'Pending Approval' ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn-approve"
                                    onClick={() => handleApprove(req.id)}
                                    title="Approve Request"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-reject"
                                    onClick={() => handleReject(req.id)}
                                    title="Reject Request"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-view-details"
                                  onClick={() => setSelectedRequest(req)}
                                  title="View Request Details"
                                >
                                  <Eye size={12} /> Details
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── Manager On-Behalf Emergency Block Modal ─── */}
      {showBlockModal && (
        <div className="leave-modal-backdrop" onClick={() => setShowBlockModal(false)}>
          <div className="leave-block-modal" onClick={e => e.stopPropagation()}>
            <div className="leave-block-header">
              <div className="leave-block-icon-wrap">
                <PhoneCall size={20} color="#b45309" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="leave-block-title">Block Emergency Leave for Employee</h3>
                <p className="leave-block-sub">
                  Record emergency leave on behalf of an employee who phoned in outside office premises.
                </p>
              </div>
              <button className="leave-modal-close" onClick={() => setShowBlockModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="leave-block-notice">
              <ShieldAlert size={16} />
              <span>
                <strong>Office-Premise Offline Guard:</strong> Dates will be blocked immediately in system attendance and team roster. When the employee returns to the office, they must regularise this entry with their reason and medical/proof documents.
              </span>
            </div>

            <form onSubmit={handleManagerBlockLeave} className="leave-block-form">
              <div className="leave-block-grid">
                <div className="leave-field">
                  <label className="leave-label">Select Employee *</label>
                  <select
                    className="leave-input"
                    value={blockEmpId}
                    onChange={e => setBlockEmpId(e.target.value)}
                    required
                  >
                    {ALL_STAFF_MEMBERS.map(staff => (
                      <option key={staff.empId} value={staff.empId}>
                        {staff.name} ({staff.empId}) — {staff.dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="leave-field">
                  <label className="leave-label">Leave Classification *</label>
                  <select
                    className="leave-input"
                    value={blockLeaveType}
                    onChange={e => setBlockLeaveType(e.target.value)}
                    required
                  >
                    <option value="Sick Leave (SL)">Sick Leave (SL) — Emergency / Medical</option>
                    <option value="Casual Leave (CL)">Casual Leave (CL) — Family / Urgent</option>
                    <option value="Unplanned Leave">Unplanned / Special Emergency Leave</option>
                  </select>
                </div>

                <div className="leave-field">
                  <label className="leave-label">From Date *</label>
                  <input
                    type="date"
                    className="leave-input"
                    value={blockFromDate}
                    onChange={e => setBlockFromDate(e.target.value)}
                    required
                  />
                </div>

                <div className="leave-field">
                  <label className="leave-label">To Date *</label>
                  <input
                    type="date"
                    className="leave-input"
                    value={blockToDate}
                    onChange={e => setBlockToDate(e.target.value)}
                    required
                  />
                </div>

                <div className="leave-field">
                  <label className="leave-label">Duration Mode</label>
                  <select
                    className="leave-input"
                    value={blockDuration}
                    onChange={e => setBlockDuration(e.target.value)}
                  >
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day (First Half)">Half Day (First Half)</option>
                    <option value="Half Day (Second Half)">Half Day (Second Half)</option>
                  </select>
                </div>

                <div className="leave-field">
                  <label className="leave-label">Authorized By (Manager)</label>
                  <input
                    type="text"
                    className="leave-input"
                    value={currentUser.name || 'Reporting Manager'}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="leave-field" style={{ marginTop: 14 }}>
                <label className="leave-label">Emergency Phone Call Log / Manager's Notes *</label>
                <textarea
                  className="leave-input leave-textarea"
                  rows={3}
                  value={blockNote}
                  onChange={e => setBlockNote(e.target.value)}
                  placeholder="Record what the employee stated over the emergency phone call..."
                  required
                />
              </div>

              <div className="leave-modal-footer">
                <button
                  type="button"
                  className="dash-btn-ghost"
                  onClick={() => setShowBlockModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="leave-btn-primary" style={{ background: '#d97706' }}>
                  <Lock size={14} /> Block Leave Dates for Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Employee Regularise Leave Modal ─── */}
      {regularisingRequest && (
        <div className="leave-modal-backdrop" onClick={() => setRegularisingRequest(null)}>
          <div className="leave-regularise-modal" onClick={e => e.stopPropagation()}>
            <div className="leave-regularise-header">
              <div className="leave-reg-icon-wrap">
                <FileCheck2 size={20} color="#059669" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="leave-block-title">Regularise Emergency Leave Application</h3>
                <p className="leave-block-sub">
                  Ref ID: <strong>{regularisingRequest.id}</strong> · Blocked by {regularisingRequest.blockedBy || regularisingRequest.manager} on {regularisingRequest.blockedOn || 'phone call'}
                </p>
              </div>
              <button className="leave-modal-close" onClick={() => setRegularisingRequest(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="reg-summary-pill-bar">
              <span><strong>Dates:</strong> {regularisingRequest.dates}</span>
              <span><strong>Duration:</strong> {regularisingRequest.days} {regularisingRequest.days === 1 ? 'Day' : 'Days'} ({regularisingRequest.duration})</span>
              <span><strong>Type:</strong> {regularisingRequest.leaveType}</span>
            </div>

            <form onSubmit={handleSubmitRegularisation} className="leave-reg-form">
              <div className="leave-field">
                <div className="reason-label-row">
                  <label className="leave-label">Formal Reason for Absence *</label>
                  <button
                    type="button"
                    className={`voice-mic-btn ${isListening ? 'voice-mic-btn--active' : ''}`}
                    onClick={toggleRegListening}
                    title="Speak to dictate reason via microphone"
                  >
                    {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                    <span>{isListening ? 'Listening...' : 'Voice Mic'}</span>
                  </button>
                </div>
                <textarea
                  className="leave-input leave-textarea"
                  rows={3}
                  value={regReason}
                  onChange={e => setRegReason(e.target.value)}
                  placeholder="State why you took emergency leave (type or click Voice Mic to speak)..."
                  required
                />
                <div className="preset-reasons" style={{ marginTop: 6 }}>
                  <span className="preset-label">Quick Presets:</span>
                  {PRESET_REASONS.slice(0, 3).map((pr, i) => (
                    <button
                      key={i}
                      type="button"
                      className="preset-chip"
                      onClick={() => setRegReason(prev => (prev ? `${prev} ${pr}` : pr))}
                    >
                      {pr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="leave-grid-2" style={{ marginTop: 14 }}>
                <div className="leave-field">
                  <label className="leave-label">Work Handover Colleague *</label>
                  <input
                    type="text"
                    className="leave-input"
                    value={regHandover}
                    onChange={e => setRegHandover(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    required
                  />
                </div>
                <div className="leave-field">
                  <label className="leave-label">Emergency Phone Contact *</label>
                  <input
                    type="tel"
                    className="leave-input"
                    value={regEmergencyPhone}
                    onChange={e => setRegEmergencyPhone(e.target.value)}
                    placeholder="+91 98450 XXXXX"
                    required
                  />
                </div>
              </div>

              {/* Supporting Documents / Medical Proof Upload */}
              <div className="leave-field" style={{ marginTop: 14 }}>
                <label className="leave-label">Upload Supporting Proof / Medical Document</label>
                <p className="reg-hint-text">
                  Attach medical prescription, doctor certificate, hospital slip, or proof ticket (PDF, PNG, JPG max 10MB).
                </p>
                {regAttachment ? (
                  <div className="reg-attachment-card">
                    <Paperclip size={16} color="#0284c7" />
                    <div className="reg-attachment-meta">
                      <span className="reg-attachment-name">{regAttachment.name}</span>
                      <span className="reg-attachment-size">{regAttachment.size}</span>
                    </div>
                    <button
                      type="button"
                      className="reg-attachment-remove"
                      onClick={() => setRegAttachment(null)}
                      title="Remove attachment"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="reg-file-upload-box">
                    <UploadCloud size={20} color="#64748b" />
                    <div>
                      <label htmlFor="reg-doc-input" className="reg-upload-link">
                        Choose file
                      </label>{' '}
                      <span>or drag and drop here</span>
                    </div>
                    <input
                      id="reg-doc-input"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleRegFileChange}
                    />
                  </div>
                )}
              </div>

              <div className="leave-modal-footer" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="dash-btn-ghost"
                  onClick={() => setRegularisingRequest(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="leave-btn-primary" style={{ background: '#059669' }}>
                  <FileCheck2 size={15} /> Complete & Regularise Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── View Request Details Modal ─── */}
      {selectedRequest && (
        <div className="leave-modal-backdrop" onClick={() => setSelectedRequest(null)}>
          <div className="leave-details-modal" onClick={e => e.stopPropagation()}>
            <div className="leave-details-header">
              <div>
                <span className={`status-pill ${
                  selectedRequest.status === 'Approved' ? 'status-approved' :
                  selectedRequest.status === 'Pending Approval' ? 'status-pending' : 'status-rejected'
                }`}>
                  {selectedRequest.status}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 8, color: '#0f172a' }}>
                  {selectedRequest.leaveType} · {selectedRequest.days} {selectedRequest.days === 1 ? 'Day' : 'Days'}
                </h3>
                <p style={{ fontSize: 12, color: '#64748b' }}>Reference ID: {selectedRequest.id}</p>
              </div>
              <button className="leave-modal-close" onClick={() => setSelectedRequest(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="leave-details-body">
              <div className="leave-details-grid">
                <div>
                  <label className="details-lbl">Employee</label>
                  <p className="details-val">{selectedRequest.employeeName} ({selectedRequest.empId})</p>
                </div>
                <div>
                  <label className="details-lbl">Department</label>
                  <p className="details-val">{selectedRequest.department}</p>
                </div>
                <div>
                  <label className="details-lbl">Dates & Duration</label>
                  <p className="details-val">{selectedRequest.dates} ({selectedRequest.duration})</p>
                </div>
                <div>
                  <label className="details-lbl">Reporting Manager</label>
                  <p className="details-val">{selectedRequest.manager}</p>
                </div>
                <div>
                  <label className="details-lbl">Work Handover Colleague</label>
                  <p className="details-val">{selectedRequest.handoverTo}</p>
                </div>
                <div>
                  <label className="details-lbl">Emergency Contact</label>
                  <p className="details-val">{selectedRequest.emergencyPhone}</p>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <label className="details-lbl">Full Stated Reason</label>
                <div className="details-reason-box">
                  "{selectedRequest.reason}"
                </div>
              </div>

              {selectedRequest.attachmentName && (
                <div style={{ marginTop: 14 }}>
                  <label className="details-lbl">Supporting Document / Proof</label>
                  <div className="file-badge file-badge--lg">
                    <Paperclip size={14} />
                    <span>{selectedRequest.attachmentName} ({selectedRequest.attachmentSize || 'Uploaded'})</span>
                  </div>
                </div>
              )}

              <div className="details-audit-trail">
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span>Submitted on {selectedRequest.submittedOn} · WhatsApp & Email notifications triggered</span>
              </div>
            </div>

            <div className="leave-details-footer">
              <button className="dash-btn-ghost" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
              {isEmployee && selectedRequest.status === 'Pending Approval' && (
                <button
                  type="button"
                  className="btn-withdraw"
                  style={{ padding: '8px 14px', fontSize: 13 }}
                  onClick={() => handleWithdrawRequest(selectedRequest.id)}
                >
                  <Trash2 size={14} /> Withdraw Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
