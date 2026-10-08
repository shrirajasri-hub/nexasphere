import { useState } from 'react';
import './SmartLeaveInfographic.css';

/* ─── 7 Steps matching the image precisely ─── */
const INFOGRAPHIC_STEPS = [
  {
    id: 1,
    position: 'bottom',
    title: 'Automated Leave Balance Calculation',
    desc: 'Automatic accruals, carry-forwards & proration without manual calculation.',
    color: '#10b981', // Emerald Green
    lightBg: '#ecfdf5',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="44" r="10" fill="#fecdd3" />
        <path d="M26 50 C26 42 38 42 38 50" fill="#f43f5e" />
        <circle cx="32" cy="42" r="4" fill="#fda4af" />
        <path d="M20 28 L28 20 M36 20 L44 28" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        <rect x="14" y="24" width="10" height="8" rx="2" fill="#d97706" />
        <path d="M32 18 C32 14 36 12 32 10 C28 12 32 14 32 18" fill="#ef4444" />
        <circle cx="32" cy="14" r="3" fill="#f43f5e" />
        <rect x="40" y="22" width="10" height="10" rx="2" fill="#0284c7" />
        <path d="M42 22 L45 18 L48 22" fill="#38bdf8" />
      </svg>
    )
  },
  {
    id: 2,
    position: 'top',
    title: 'Customizable Leave Policies',
    desc: 'Configure custom leave types, accrual rates, and multi-tenant rules.',
    color: '#0284c7', // Cyan / Sky Blue
    lightBg: '#f0f9ff',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="18" y="16" width="28" height="36" rx="3" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
        <rect x="22" y="10" width="20" height="6" rx="1.5" fill="#ef4444" />
        <line x1="24" y1="26" x2="40" y2="26" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="32" x2="36" y2="32" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="32" y2="38" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="42" r="9" fill="#ffffff" stroke="#ef4444" strokeWidth="2.5" />
        <line x1="44" y1="48" x2="50" y2="54" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 3,
    position: 'bottom',
    title: 'Reports & Shift Integration',
    desc: 'Direct synchronization with MIS dashboards, shift schedules & attendance analytics.',
    color: '#2563eb', // Royal Blue
    lightBg: '#eff6ff',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <circle cx="22" cy="24" r="7" fill="#cbd5e1" />
        <path d="M14 40 C14 32 30 32 30 40" fill="#334155" />
        <circle cx="44" cy="24" r="7" fill="#60a5fa" />
        <path d="M36 40 C36 32 52 32 52 40" fill="#1d4ed8" />
        <rect x="24" y="22" width="16" height="12" rx="2" fill="#2563eb" />
        <line x1="28" y1="30" x2="28" y2="26" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="32" y1="30" x2="32" y2="24" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="36" y1="30" x2="36" y2="27" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M22 14 C32 8 40 10 44 14" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
        <path d="M42 12 L46 15 L41 18" fill="#2563eb" />
      </svg>
    )
  },
  {
    id: 4,
    position: 'top',
    title: 'Employee Self-Service Portal',
    desc: 'Empower staff to view balances, request leaves, and track status anytime.',
    color: '#7c3aed', // Purple
    lightBg: '#f5f3ff',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="14" y="20" width="36" height="26" rx="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="3" />
        <path d="M10 46 L54 46 L48 52 L16 52 Z" fill="#64748b" />
        <circle cx="26" cy="30" r="4" fill="#38bdf8" />
        <path d="M21 40 C21 35 31 35 31 40" fill="#0284c7" />
        <circle cx="38" cy="32" r="7" fill="none" stroke="#0ea5e9" strokeWidth="2" />
        <ellipse cx="38" cy="32" rx="3" ry="7" stroke="#0ea5e9" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 5,
    position: 'bottom',
    title: 'Compliance & Audit Logs',
    desc: 'Maintain immutable digital logs for labor statutory compliance.',
    color: '#dc2626', // Crimson Red
    lightBg: '#fef2f2',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="16" y="16" width="32" height="38" rx="4" fill="#facc15" stroke="#334155" strokeWidth="3" />
        <rect x="22" y="12" width="20" height="24" rx="2" fill="#ffffff" stroke="#334155" strokeWidth="2" />
        <rect x="26" y="24" width="12" height="6" rx="1" fill="#dc2626" />
        <text x="27" y="29" fontSize="6" fontWeight="bold" fill="#ffffff">LOG</text>
        <line x1="26" y1="18" x2="38" y2="18" stroke="#dc2626" strokeWidth="2" />
        <line x1="26" y1="21" x2="34" y2="21" stroke="#dc2626" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 6,
    position: 'top',
    title: 'Mobile Access',
    desc: 'Native iOS & Android web app access for managers and employees.',
    color: '#ea580c', // Orange
    lightBg: '#fff7ed',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <rect x="20" y="12" width="24" height="42" rx="4" fill="#ffffff" stroke="#ea580c" strokeWidth="3" />
        <line x1="28" y1="16" x2="36" y2="16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="48" r="2" fill="#ea580c" />
        <circle cx="32" cy="30" r="8" fill="none" stroke="#0ea5e9" strokeWidth="2" />
        <ellipse cx="32" cy="30" rx="3" ry="8" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="27" cy="33" r="3" fill="#10b981" />
        <path d="M25.5 33 L26.5 34 L28.5 32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 7,
    position: 'bottom',
    title: 'Intelligent Alerts & Notifications',
    desc: 'Instant WhatsApp & email notifications for leave requests & approvals.',
    color: '#d97706', // Amber / Gold
    lightBg: '#fffbeb',
    svgIcon: (
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <path d="M32 12 C24 12 20 18 20 28 L16 38 L48 38 L44 28 C44 18 40 12 32 12 Z" fill="#facc15" stroke="#d97706" strokeWidth="3" />
        <path d="M26 42 C26 46 38 46 38 42" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="18" r="8" fill="#ef4444" />
        <text x="42" y="22" fontSize="12" fontWeight="bold" fill="#ffffff">!</text>
      </svg>
    )
  }
];

export default function SmartLeaveInfographic({ onSelectStep }) {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (step) => {
    setActiveStep(step.id);
    if (onSelectStep) onSelectStep(step);
  };

  return (
    <div className="infographic-wrapper">
      {/* Title Header matching the uploaded infographic image */}
      <div className="infographic-header">
        <h2 className="infographic-main-title">
          Key Features of a Smart Leave Management System
        </h2>
        <div className="infographic-title-underline" />
      </div>

      {/* Snake Connected Flow Canvas */}
      <div className="infographic-canvas">
        {/* Continuous Serpentine Snake Path SVG Background */}
        <svg className="snake-path-svg" viewBox="0 0 1100 360" preserveAspectRatio="none">
          <defs>
            <linearGradient id="infographicSnakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="16%" stopColor="#0284c7" />
              <stop offset="33%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="66%" stopColor="#dc2626" />
              <stop offset="83%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Filter for glow */}
            <filter id="pathGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* S-Curve Continuous Connecting Line */}
          <path
            d="
              M 80, 260 
              C 80, 320 200, 320 200, 260
              V 100
              C 200, 40 340, 40 340, 100
              V 260
              C 340, 320 480, 320 480, 260
              V 100
              C 480, 40 620, 40 620, 100
              V 260
              C 620, 320 760, 320 760, 260
              V 100
              C 760, 40 900, 40 900, 100
              V 260
              C 900, 320 1020, 320 1020, 260
            "
            fill="none"
            stroke="url(#infographicSnakeGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#pathGlow)"
          />

          {/* Directional Flow Arrows at curves */}
          <path d="M 125, 310 L 135, 310 L 130, 316 Z" fill="#10b981" />
          <path d="M 270, 50 L 280, 50 L 275, 44 Z" fill="#0284c7" />
          <path d="M 410, 310 L 420, 310 L 415, 316 Z" fill="#2563eb" />
          <path d="M 550, 50 L 560, 50 L 555, 44 Z" fill="#7c3aed" />
          <path d="M 690, 310 L 700, 310 L 695, 316 Z" fill="#dc2626" />
          <path d="M 830, 50 L 840, 50 L 835, 44 Z" fill="#ea580c" />
          <path d="M 960, 310 L 970, 310 L 965, 316 Z" fill="#d97706" />
        </svg>

        {/* 7 Interactive Nodes (Top & Bottom alternating positions) */}
        <div className="infographic-nodes-grid">
          {INFOGRAPHIC_STEPS.map((step) => {
            const isActive = activeStep === step.id;
            const isTop = step.position === 'top';
            return (
              <div
                key={step.id}
                className={`infographic-col ${isTop ? 'infographic-col--top' : 'infographic-col--bottom'}`}
              >
                <div
                  className={`infographic-card ${isActive ? 'infographic-card--active' : ''}`}
                  onClick={() => handleStepClick(step)}
                  style={{
                    '--theme-color': step.color,
                    '--theme-bg': step.lightBg
                  }}
                >
                  <div className="infographic-card__icon-box">
                    {step.svgIcon}
                  </div>
                  <h3 className="infographic-card__title">
                    {step.title}
                  </h3>
                  <div className="infographic-card__hover-desc">
                    {step.desc}
                  </div>
                  <div className="infographic-card__step-num">
                    Step 0{step.id}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
