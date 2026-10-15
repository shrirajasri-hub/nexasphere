// src/utils/projectTaskStore.js
// Centralized store and data management for Projects, Milestones, and Tasks

export const INITIAL_PROJECTS = [
  {
    id: 'PRJ-101',
    code: 'ALA-2026',
    name: 'Automation Line A',
    dept: 'Automation & Robotics',
    lead: 'Priya Sundaram',
    leadEmpId: 'EMP-2041',
    leadAvatar: 'PS',
    team: [
      { name: 'Priya Sundaram', empId: 'EMP-2041', role: 'UI/UX & Frontend Lead', avatar: 'PS' },
      { name: 'Aarav Sharma', empId: 'EMP00101', role: 'PLC Specialist', avatar: 'AS' },
      { name: 'Arun Kumar', empId: 'EMP-1082', role: 'Robotics Engineer', avatar: 'AK' },
      { name: 'Vignesh M.', empId: 'EMP-2098', role: 'Hardware Tech', avatar: 'VM' }
    ],
    startDate: '2026-08-01',
    dueDate: '2026-11-30',
    status: 'Active',
    health: 'On Track',
    progress: 85,
    budgetHours: 450,
    loggedHours: 320,
    description: 'End-to-end automation and SCADA integration for Assembly Line A, incorporating real-time telemetry, operator dashboards, and safety interlocks.',
    milestones: [
      {
        id: 'MS-101',
        code: 'M1',
        title: 'Requirements & Architecture Signoff',
        dueDate: '2026-08-31',
        status: 'Completed',
        completedDate: '2026-08-28',
        deliverable: 'Approved SRS, safety compliance matrix, and network architecture topology.',
      },
      {
        id: 'MS-102',
        code: 'M2',
        title: 'PLC & Sensor Hardware Integration',
        dueDate: '2026-09-30',
        status: 'Completed',
        completedDate: '2026-09-29',
        deliverable: 'Siemens S7-1500 controller benchmark and optical sensor array telemetry verified.',
      },
      {
        id: 'MS-103',
        code: 'M3',
        title: 'Operator Touchscreen UI & Alert State Machine',
        dueDate: '2026-10-25',
        status: 'In Progress',
        deliverable: 'High-contrast industrial operator dashboard with emergency stop telemetry.',
      },
      {
        id: 'MS-104',
        code: 'M4',
        title: 'Line Pilot Run & Factory Acceptance Test (FAT)',
        dueDate: '2026-11-20',
        status: 'Upcoming',
        deliverable: '100-hour continuous dry-run test with zero safety trip violations.',
      }
    ]
  },
  {
    id: 'PRJ-102',
    code: 'VIS-2026',
    name: 'Vision Inspection System',
    dept: 'Quality Assurance',
    lead: 'Arun Kumar',
    leadEmpId: 'EMP-1082',
    leadAvatar: 'AK',
    team: [
      { name: 'Arun Kumar', empId: 'EMP-1082', role: 'Computer Vision Lead', avatar: 'AK' },
      { name: 'Priya Sundaram', empId: 'EMP-2041', role: 'UI Designer', avatar: 'PS' },
      { name: 'Meena Ramesh', empId: 'EMP-3012', role: 'QA Validation Specialist', avatar: 'MR' }
    ],
    startDate: '2026-08-15',
    dueDate: '2026-11-15',
    status: 'Active',
    health: 'At Risk',
    progress: 62,
    budgetHours: 380,
    loggedHours: 240,
    description: 'Automated optical defect classification system utilizing high-speed gigabit cameras and deep learning edge models for surface scratch detection.',
    milestones: [
      {
        id: 'MS-201',
        code: 'M1',
        title: 'Camera Lighting & Optics Rig Setup',
        dueDate: '2026-09-10',
        status: 'Completed',
        completedDate: '2026-09-08',
        deliverable: 'Dome lighting enclosure and telecentric lens calibration completed.',
      },
      {
        id: 'MS-202',
        code: 'M2',
        title: 'Defect Classification Model Training',
        dueDate: '2026-10-10',
        status: 'In Progress',
        deliverable: 'Dataset validation of 5,000 defect images with >98.5% precision target.',
      },
      {
        id: 'MS-203',
        code: 'M3',
        title: 'Ejection Mechanism & PLC Handshake',
        dueDate: '2026-10-31',
        status: 'Upcoming',
        deliverable: 'Pneumatic reject arm trigger within 12 milliseconds of defect flag.',
      },
      {
        id: 'MS-204',
        code: 'M4',
        title: 'Full Quality Audit Signoff',
        dueDate: '2026-11-15',
        status: 'Upcoming',
        deliverable: 'Certified compliance with ISO-9001 surface inspection standards.',
      }
    ]
  },
  {
    id: 'PRJ-103',
    code: 'TLC-2026',
    name: 'Tool Life & Calibration Tracking',
    dept: 'Maintenance & Operations',
    lead: 'Vignesh M.',
    leadEmpId: 'EMP-2098',
    leadAvatar: 'VM',
    team: [
      { name: 'Vignesh M.', empId: 'EMP-2098', role: 'Maintenance Lead', avatar: 'VM' },
      { name: 'Meena Ramesh', empId: 'EMP-3012', role: 'Calibration Tech', avatar: 'MR' },
      { name: 'Priya Sundaram', empId: 'EMP-2041', role: 'Mobile UX Designer', avatar: 'PS' }
    ],
    startDate: '2026-09-01',
    dueDate: '2026-12-15',
    status: 'Active',
    health: 'Delayed',
    progress: 38,
    budgetHours: 320,
    loggedHours: 145,
    description: 'RFID-enabled tooling asset register tracking spindle hours, wear telemetry, automated re-sharpening alerts, and gauge calibration certification.',
    milestones: [
      {
        id: 'MS-301',
        code: 'M1',
        title: 'Tooling Asset Inventory & RFID Tagging',
        dueDate: '2026-09-25',
        status: 'Completed',
        completedDate: '2026-09-27',
        deliverable: '1,450 CNC cutting tools and gauges tagged with industrial UHF RFID chips.',
      },
      {
        id: 'MS-302',
        code: 'M2',
        title: 'Spindle Runtime Tracker & Wear Algorithm',
        dueDate: '2026-10-18',
        status: 'In Progress',
        deliverable: 'Integration with Fanuc CNC controllers for real-time cut-time logging.',
      },
      {
        id: 'MS-303',
        code: 'M3',
        title: 'Automated Calibration Certificate Workflow',
        dueDate: '2026-11-15',
        status: 'Upcoming',
        deliverable: 'Digital NABL calibration certificate generation and PDF expiry notifications.',
      }
    ]
  },
  {
    id: 'PRJ-104',
    code: 'PMD-2026',
    name: 'Production MIS Dashboard',
    dept: 'Production & IT',
    lead: 'Meena Ramesh',
    leadEmpId: 'EMP-3012',
    leadAvatar: 'MR',
    team: [
      { name: 'Meena Ramesh', empId: 'EMP-3012', role: 'Data Analyst & Lead', avatar: 'MR' },
      { name: 'Priya Sundaram', empId: 'EMP-2041', role: 'Dashboard UI Architect', avatar: 'PS' },
      { name: 'Aarav Sharma', empId: 'EMP00101', role: 'Backend Developer', avatar: 'AS' }
    ],
    startDate: '2026-08-10',
    dueDate: '2026-11-10',
    status: 'Active',
    health: 'On Track',
    progress: 74,
    budgetHours: 400,
    loggedHours: 295,
    description: 'Centralized plant-floor management information system aggregating overall equipment efficiency (OEE), hourly shift output, downtime Pareto, and scrap analytics.',
    milestones: [
      {
        id: 'MS-401',
        code: 'M1',
        title: 'Plant Floor Data Pipeline & MQTT Broker',
        dueDate: '2026-08-30',
        status: 'Completed',
        completedDate: '2026-08-29',
        deliverable: 'High-throughput broker ingestion benchmarked at 20,000 tags/second.',
      },
      {
        id: 'MS-402',
        code: 'M2',
        title: 'Executive OEE & Scrap Loss Analytics',
        dueDate: '2026-09-30',
        status: 'Completed',
        completedDate: '2026-10-02',
        deliverable: 'Real-time calculation engine conforming to SEMI E10 standards.',
      },
      {
        id: 'MS-403',
        code: 'M3',
        title: 'Shift Supervisor Mobile Web Portal',
        dueDate: '2026-10-28',
        status: 'In Progress',
        deliverable: 'Responsive web interface for shift handovers and reason-code assignment.',
      },
      {
        id: 'MS-404',
        code: 'M4',
        title: 'ERP SAP Integration & Automated Daily MIS',
        dueDate: '2026-11-10',
        status: 'Upcoming',
        deliverable: 'Automated 6:00 AM executive email digest and SAP PP production order sync.',
      }
    ]
  },
  {
    id: 'PRJ-105',
    code: 'SWI-2026',
    name: 'Smart Warehouse IoT Integration',
    dept: 'Logistics & Supply',
    lead: 'Aarav Sharma',
    leadEmpId: 'EMP00101',
    leadAvatar: 'AS',
    team: [
      { name: 'Aarav Sharma', empId: 'EMP00101', role: 'IoT Systems Architect', avatar: 'AS' },
      { name: 'Vignesh M.', empId: 'EMP-2098', role: 'Beacon Technician', avatar: 'VM' }
    ],
    startDate: '2026-09-15',
    dueDate: '2026-12-30',
    status: 'Planning',
    health: 'On Track',
    progress: 25,
    budgetHours: 280,
    loggedHours: 70,
    description: 'Bluetooth Low Energy (BLE) beacon positioning and AGV automated guided vehicle fleet dispatch optimization inside the finished goods dispatch terminal.',
    milestones: [
      {
        id: 'MS-501',
        code: 'M1',
        title: 'Terminal RF Mapping & Gateway Placement',
        dueDate: '2026-10-05',
        status: 'Completed',
        completedDate: '2026-10-04',
        deliverable: 'Sub-meter accuracy beacon triangulation validated across 12 aisles.',
      },
      {
        id: 'MS-502',
        code: 'M2',
        title: 'AGV Fleet Dispatch Simulator',
        dueDate: '2026-11-05',
        status: 'In Progress',
        deliverable: 'Dynamic path routing with collision avoidance algorithms.',
      },
      {
        id: 'MS-503',
        code: 'M3',
        title: 'Warehouse Management System Handshake',
        dueDate: '2026-12-15',
        status: 'Upcoming',
        deliverable: 'Pick-to-light and automated order pack station barcode integration.',
      }
    ]
  }
];

export const INITIAL_TASKS = [
  {
    id: 'TSK-101',
    title: 'Automation Line A – Operator Touchscreen UI Screens',
    projectId: 'PRJ-101',
    projectName: 'Automation Line A',
    milestoneId: 'MS-103',
    milestoneName: 'M3: Operator Touchscreen UI & Alert System',
    assignee: 'Priya Sundaram',
    assigneeEmpId: 'EMP-2041',
    assigneeAvatar: 'PS',
    priority: 'High',
    status: 'In Progress',
    due: '2026-10-18',
    description: 'Design and implement high-contrast touchscreen displays with large touch targets, real-time cycle timers, and error code visualization for plant operators.',
    progress: 75,
    subtasks: [
      { id: 1, title: 'Draft wireframes for main cycle screen', done: true },
      { id: 2, title: 'Color contrast audit for factory lighting (WCAG AAA)', done: true },
      { id: 3, title: 'Emergency stop confirmation dialog flow', done: true },
      { id: 4, title: 'Connect WebSockets to telemetry mock feed', done: false }
    ],
    notes: [
      { t: '08 Oct 11:30', m: 'Reviewed wireframes with Line Supervisor. Added 3-second hold to reset E-stop.' },
      { t: '12 Oct 16:45', m: 'High-contrast palette approved by Ergonomics committee.' }
    ]
  },
  {
    id: 'TSK-102',
    title: 'PLC Hardware Integration Test Plan & Telemetry Dry-Run',
    projectId: 'PRJ-101',
    projectName: 'Automation Line A',
    milestoneId: 'MS-102',
    milestoneName: 'M2: PLC & Sensor Hardware Integration',
    assignee: 'Aarav Sharma',
    assigneeEmpId: 'EMP00101',
    assigneeAvatar: 'AS',
    priority: 'Medium',
    status: 'Completed',
    due: '2026-09-29',
    description: 'Formulate comprehensive signal handshake test plan between Siemens S7-1500 and safety door interlock sensors.',
    progress: 100,
    subtasks: [
      { id: 1, title: 'Document I/O channel address map', done: true },
      { id: 2, title: 'Verify sensor bounce filtering (50ms)', done: true },
      { id: 3, title: 'Execute emergency halt loop test', done: true }
    ],
    notes: [
      { t: '28 Sep 15:00', m: 'Signal latency measured at 4.2ms, well within the 10ms threshold.' }
    ]
  },
  {
    id: 'TSK-103',
    title: 'Robot Arm End-Effector Payload & Speed Calibration',
    projectId: 'PRJ-101',
    projectName: 'Automation Line A',
    milestoneId: 'MS-103',
    milestoneName: 'M3: Operator Touchscreen UI & Alert System',
    assignee: 'Arun Kumar',
    assigneeEmpId: 'EMP-1082',
    assigneeAvatar: 'AK',
    priority: 'Urgent',
    status: 'In Progress',
    due: '2026-10-22',
    description: 'Calibrate Fanuc 6-axis robot arm trajectory, acceleration profiles, and vacuum suction gripping pressure for glass-filled composite workpieces.',
    progress: 60,
    subtasks: [
      { id: 1, title: 'Load cell calibration with 5kg reference weight', done: true },
      { id: 2, title: 'Teach point trajectory optimization', done: true },
      { id: 3, title: 'Vacuum sensor pressure threshold testing', done: false }
    ],
    notes: [
      { t: '10 Oct 14:15', m: 'Cycle time reduced from 14.2s to 11.8s per transfer operation.' }
    ]
  },
  {
    id: 'TSK-104',
    title: 'Design System v2 Component Library & Theming Tokens',
    projectId: 'PRJ-104',
    projectName: 'Production MIS Dashboard',
    milestoneId: 'MS-403',
    milestoneName: 'M3: Shift Supervisor Mobile Web Portal',
    assignee: 'Priya Sundaram',
    assigneeEmpId: 'EMP-2041',
    assigneeAvatar: 'PS',
    priority: 'Medium',
    status: 'In Progress',
    due: '2026-10-24',
    description: 'Refactor chart components, gauge widgets, and theme CSS variables for the supervisor responsive portal.',
    progress: 50,
    subtasks: [
      { id: 1, title: 'Build reusable MetricStat card with sparklines', done: true },
      { id: 2, title: 'Theme tokens for 6 industrial high-visibility themes', done: true },
      { id: 3, title: 'Test responsive drawer on Rugged Android tablet', done: false }
    ],
    notes: [
      { t: '11 Oct 09:30', m: 'Added Pure White and Crimson themes for varied factory ambient lighting.' }
    ]
  },
  {
    id: 'TSK-105',
    title: 'Vision Inspection – Result Screen Mockups & Defect Heatmap',
    projectId: 'PRJ-102',
    projectName: 'Vision Inspection System',
    milestoneId: 'MS-202',
    milestoneName: 'M2: Defect Classification Model Training',
    assignee: 'Priya Sundaram',
    assigneeEmpId: 'EMP-2041',
    assigneeAvatar: 'PS',
    priority: 'High',
    status: 'In Review',
    due: '2026-10-16',
    description: 'Develop overlay heatmap viewer displaying confidence scores and bounding boxes for micro-cracks identified by vision cameras.',
    progress: 95,
    subtasks: [
      { id: 1, title: 'Canvas overlay for camera bounding boxes', done: true },
      { id: 2, title: 'Zoom and pan inspection controls', done: true },
      { id: 3, title: 'QA signoff on color gradient thresholds', done: true }
    ],
    notes: [
      { t: '14 Oct 17:00', m: 'Submitted to Arun Kumar for QA team validation.' }
    ]
  },
  {
    id: 'TSK-106',
    title: 'GigE Camera Strobe Synchronization Circuitry',
    projectId: 'PRJ-102',
    projectName: 'Vision Inspection System',
    milestoneId: 'MS-201',
    milestoneName: 'M1: Camera Lighting & Optics Rig Setup',
    assignee: 'Arun Kumar',
    assigneeEmpId: 'EMP-1082',
    assigneeAvatar: 'AK',
    priority: 'High',
    status: 'Completed',
    due: '2026-09-08',
    description: 'Fabricate hardware opto-isolated trigger circuit synchronizing 10-microsecond flash illumination with conveyor encoder pulses.',
    progress: 100,
    subtasks: [
      { id: 1, title: 'Optocoupler circuit board soldering', done: true },
      { id: 2, title: 'Oscilloscope pulse jitter validation (<50ns)', done: true },
      { id: 3, title: 'Install into IP65 camera enclosure', done: true }
    ],
    notes: [
      { t: '06 Sep 14:00', m: 'Zero motion blur observed at 1.8 m/s belt speed.' }
    ]
  },
  {
    id: 'TSK-107',
    title: 'Tool Life Tracking – Alert Flow UX & Spindle Warning Modal',
    projectId: 'PRJ-103',
    projectName: 'Tool Life & Calibration Tracking',
    milestoneId: 'MS-302',
    milestoneName: 'M2: Spindle Runtime Tracker & Wear Algorithm',
    assignee: 'Priya Sundaram',
    assigneeEmpId: 'EMP-2041',
    assigneeAvatar: 'PS',
    priority: 'Urgent',
    status: 'In Progress',
    due: '2026-10-19',
    description: 'Create interactive workflow for machine operators when cutting tool wear crosses the 90% threshold, including tooling locker dispense code generation.',
    progress: 40,
    subtasks: [
      { id: 1, title: 'Define 3-tier warning thresholds (80%, 90%, 98%)', done: true },
      { id: 2, title: 'Design QR code tooling dispenser screen', done: false },
      { id: 3, title: 'Integrate with technician mobile notification push', done: false }
    ],
    notes: [
      { t: '09 Oct 12:10', m: 'Vignesh approved the amber-to-red alert transition.' }
    ]
  },
  {
    id: 'TSK-108',
    title: 'Digital Calibration Report Template & PDF Engine',
    projectId: 'PRJ-103',
    projectName: 'Tool Life & Calibration Tracking',
    milestoneId: 'MS-303',
    milestoneName: 'M3: Automated Calibration Certificate Workflow',
    assignee: 'Meena Ramesh',
    assigneeEmpId: 'EMP-3012',
    assigneeAvatar: 'MR',
    priority: 'Medium',
    status: 'To Do',
    due: '2026-11-02',
    description: 'Design standardized NABL-compliant calibration test certificate with digital signoff hashes and QR validation stamp.',
    progress: 0,
    subtasks: [
      { id: 1, title: 'Collate legal certificate wording standards', done: false },
      { id: 2, title: 'Build HTML-to-PDF print template', done: false }
    ],
    notes: []
  },
  {
    id: 'TSK-109',
    title: 'Accessibility Audit (WCAG 2.1) for Plant Operator Terminals',
    projectId: 'PRJ-104',
    projectName: 'Production MIS Dashboard',
    milestoneId: 'MS-402',
    milestoneName: 'M2: Executive OEE & Scrap Loss Analytics',
    assignee: 'Priya Sundaram',
    assigneeEmpId: 'EMP-2041',
    assigneeAvatar: 'PS',
    priority: 'Low',
    status: 'Completed',
    due: '2026-09-28',
    description: 'Audit touch-screen interfaces for gloved-hand usability, screen glare resistance, and key shortcut navigation.',
    progress: 100,
    subtasks: [
      { id: 1, title: 'Touch target minimum 48px square check', done: true },
      { id: 2, title: 'Color-blindness simulation testing (Deuteranopia)', done: true },
      { id: 3, title: 'Report submission to EHS department', done: true }
    ],
    notes: [
      { t: '28 Sep 10:15', m: 'All primary buttons enlarged to 52px for leather safety glove compliance.' }
    ]
  },
  {
    id: 'TSK-110',
    title: 'MQTT Broker Deployment & Plant Network Firewall Rules',
    projectId: 'PRJ-104',
    projectName: 'Production MIS Dashboard',
    milestoneId: 'MS-401',
    milestoneName: 'M1: Plant Floor Data Pipeline & MQTT Broker',
    assignee: 'Aarav Sharma',
    assigneeEmpId: 'EMP00101',
    assigneeAvatar: 'AS',
    priority: 'High',
    status: 'Completed',
    due: '2026-08-28',
    description: 'Configure high-availability clustered EMQX broker with TLS certificates on OT VLAN subnet.',
    progress: 100,
    subtasks: [
      { id: 1, title: 'Install Docker swarm cluster', done: true },
      { id: 2, title: 'Configure client certificate authentication', done: true },
      { id: 3, title: 'Load test at 50,000 msgs/sec for 4 hours', done: true }
    ],
    notes: [
      { t: '27 Aug 16:20', m: 'Zero dropped packets across 4-hour soak test.' }
    ]
  },
  {
    id: 'TSK-111',
    title: 'BLE Beacon Grid Survey & Signal Attenuation Mapping',
    projectId: 'PRJ-105',
    projectName: 'Smart Warehouse IoT Integration',
    milestoneId: 'MS-501',
    milestoneName: 'M1: Terminal RF Mapping & Gateway Placement',
    assignee: 'Vignesh M.',
    assigneeEmpId: 'EMP-2098',
    assigneeAvatar: 'VM',
    priority: 'Medium',
    status: 'Completed',
    due: '2026-10-03',
    description: 'Walk warehouse aisles with spectrum analyzer to map metal rack attenuation and position 36 BLE gateway nodes.',
    progress: 100,
    subtasks: [
      { id: 1, title: 'Site RF signal baseline survey', done: true },
      { id: 2, title: 'Gateway mounting bracket fabrication', done: true },
      { id: 3, title: 'Signal heat map verification in warehouse GIS', done: true }
    ],
    notes: [
      { t: '02 Oct 17:30', m: 'Added 4 repeaters in steel pallet bay for signal redundancy.' }
    ]
  },
  {
    id: 'TSK-112',
    title: 'AGV Collision Avoidance & Path Optimization Simulation',
    projectId: 'PRJ-105',
    projectName: 'Smart Warehouse IoT Integration',
    milestoneId: 'MS-502',
    milestoneName: 'M2: AGV Fleet Dispatch Simulator',
    assignee: 'Aarav Sharma',
    assigneeEmpId: 'EMP00101',
    assigneeAvatar: 'AS',
    priority: 'High',
    status: 'To Do',
    due: '2026-10-30',
    description: 'Develop multi-agent A* pathfinding algorithm with dynamic obstacle replanning for 8 automated guided pallet jacks.',
    progress: 0,
    subtasks: [
      { id: 1, title: 'Grid map digitization of warehouse aisles', done: false },
      { id: 2, title: 'Implement dynamic time-window routing algorithm', done: false },
      { id: 3, title: 'Simulate deadlock conditions with 8 AGVs', done: false }
    ],
    notes: []
  }
];

// Helper functions for persistent storage
export function getStoredProjects() {
  try {
    const raw = localStorage.getItem('nexa_projects');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse nexa_projects from localStorage', e);
  }
  localStorage.setItem('nexa_projects', JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
}

export function saveStoredProjects(projects) {
  try {
    localStorage.setItem('nexa_projects', JSON.stringify(projects));
    window.dispatchEvent(new Event('nexa_projects_updated'));
  } catch (e) {
    console.error('Failed to save nexa_projects', e);
  }
}

export function getStoredTasks() {
  try {
    const raw = localStorage.getItem('nexa_tasks');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse nexa_tasks from localStorage', e);
  }
  localStorage.setItem('nexa_tasks', JSON.stringify(INITIAL_TASKS));
  return INITIAL_TASKS;
}

export function saveStoredTasks(tasks) {
  try {
    localStorage.setItem('nexa_tasks', JSON.stringify(tasks));
    window.dispatchEvent(new Event('nexa_tasks_updated'));
  } catch (e) {
    console.error('Failed to save nexa_tasks', e);
  }
}

// Compute project progress automatically based on its tasks and milestones
export function recalculateProjectMetrics(projectId, projects, tasks) {
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return projects;

  const totalProgress = projectTasks.reduce((acc, t) => acc + (t.progress || 0), 0);
  const avgProgress = Math.round(totalProgress / projectTasks.length);

  return projects.map(p => {
    if (p.id !== projectId) return p;
    return {
      ...p,
      progress: avgProgress,
      health: avgProgress >= 80 ? 'On Track' : avgProgress >= 50 ? 'At Risk' : 'Delayed'
    };
  });
}
