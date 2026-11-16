// src/utils/employeeStore.js
// Centralized store and data management for Employee Master records

export const INITIAL_EMPLOYEES = [
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
    reportingManager: 'Sarah Jenkins (Director of HR)'
  },
  {
    id: 'EMP-2041',
    firstName: 'Priya',
    lastName: 'Sundaram',
    fullName: 'Priya Sundaram',
    gender: 'Female',
    dob: '1994-08-14',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    designation: 'Senior Product Designer',
    department: 'Design & UX',
    branch: 'Headquarters (Bangalore)',
    doj: '2022-05-12',
    status: 'Active',
    workEmail: 'priya.s@nexasphere.io',
    personalEmail: 'priya.sundaram.design@gmail.com',
    phone: '+91 98450 67890',
    emergencyContactName: 'Kavitha Sundaram (Mother)',
    emergencyPhone: '+91 98450 11223',
    currentAddress: 'Flat 402, Green Glen Layout, Bellandur, Bangalore, Karnataka',
    bankName: 'HDFC Bank Ltd.',
    branchName: 'Koramangala 80ft Road Branch',
    accountNumber: '50100492819201',
    ifscCode: 'HDFC0001042',
    accountType: 'Savings',
    panNumber: 'ABCPS1234K',
    uanNumber: '100928374615',
    esiNumber: '310928374615001',
    role: 'Employee',
    portalAccess: 'Enabled',
    reportingManager: 'Vikram Malhotra (VP Tech)'
  },
  {
    id: 'EMP-1082',
    firstName: 'Arun',
    lastName: 'Kumar',
    fullName: 'Arun Kumar',
    gender: 'Male',
    dob: '1990-03-22',
    bloodGroup: 'A+',
    maritalStatus: 'Married',
    nationality: 'Indian',
    designation: 'Robotics & Automation Lead',
    department: 'Production',
    branch: 'Whitefield Plant (Bangalore)',
    doj: '2021-11-01',
    status: 'Active',
    workEmail: 'arun.k@nexasphere.com',
    personalEmail: 'arun.kumar.eng@gmail.com',
    phone: '+91 98451 22334',
    emergencyContactName: 'Deepa Kumar (Spouse)',
    emergencyPhone: '+91 98451 99001',
    currentAddress: '15, Whitefield Main Road, Bangalore, Karnataka',
    bankName: 'State Bank of India',
    branchName: 'Whitefield Branch',
    accountNumber: '20491827401',
    ifscCode: 'SBIN0004018',
    accountType: 'Savings',
    panNumber: 'AKRPK4829L',
    uanNumber: '100491827364',
    esiNumber: '310491827364001',
    role: 'Employee',
    portalAccess: 'Enabled',
    reportingManager: 'Vikram Malhotra (VP Tech)'
  },
  {
    id: 'EMP-3012',
    firstName: 'Meena',
    lastName: 'Ramesh',
    fullName: 'Meena Ramesh',
    gender: 'Female',
    dob: '1993-09-08',
    bloodGroup: 'AB+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    designation: 'QA Validation Specialist',
    department: 'Quality',
    branch: 'Headquarters (Bangalore)',
    doj: '2023-08-20',
    status: 'Active',
    workEmail: 'meena.r@nexasphere.com',
    personalEmail: 'meena.ramesh.qa@gmail.com',
    phone: '+91 98452 77889',
    emergencyContactName: 'Ramesh Sundaram (Father)',
    emergencyPhone: '+91 98452 11990',
    currentAddress: '88, HSR Layout Sector 2, Bangalore, Karnataka',
    bankName: 'Axis Bank',
    branchName: 'HSR Layout Branch',
    accountNumber: '91201004918273',
    ifscCode: 'UTIB0000812',
    accountType: 'Savings',
    panNumber: 'MNRPA3910P',
    uanNumber: '100391820491',
    esiNumber: '310391820491001',
    role: 'Employee',
    portalAccess: 'Enabled',
    reportingManager: 'Vikram Malhotra (VP Tech)'
  },
  {
    id: 'EMP-2098',
    firstName: 'Vignesh',
    lastName: 'M.',
    fullName: 'Vignesh M.',
    gender: 'Male',
    dob: '1996-02-14',
    bloodGroup: 'O-',
    maritalStatus: 'Single',
    nationality: 'Indian',
    designation: 'Plant Maintenance Engineer',
    department: 'Maintenance',
    branch: 'Whitefield Plant (Bangalore)',
    doj: '2024-03-01',
    status: 'Probation',
    workEmail: 'vignesh.m@nexasphere.com',
    personalEmail: 'vignesh.maint@gmail.com',
    phone: '+91 98453 44556',
    emergencyContactName: 'Murugan S. (Father)',
    emergencyPhone: '+91 98453 88776',
    currentAddress: '12, ITPL Road, Whitefield, Bangalore, Karnataka',
    bankName: 'Kotak Mahindra Bank',
    branchName: 'ITPL Branch',
    accountNumber: '6102948192',
    ifscCode: 'KKBK0000412',
    accountType: 'Savings',
    panNumber: 'VGNPM8291K',
    uanNumber: '100829104918',
    esiNumber: '310829104918001',
    role: 'Employee',
    portalAccess: 'Enabled',
    reportingManager: 'Vikram Malhotra (VP Tech)'
  }
];

export const STORAGE_KEY_EMPLOYEES = 'nexa_employees';

// Helper functions for persistent employee storage
export function getStoredEmployees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse nexa_employees from localStorage', e);
  }
  // Seed only when storage key does not exist or is empty
  try {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
  } catch (e) {
    console.error('Failed to seed nexa_employees', e);
  }
  return INITIAL_EMPLOYEES;
}

export function saveStoredEmployees(employees) {
  try {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
    window.dispatchEvent(new Event('nexa_employees_updated'));
  } catch (e) {
    console.error('Failed to save nexa_employees', e);
  }
}

export function addEmployee(newEmp) {
  const current = getStoredEmployees();
  const next = [newEmp, ...current];
  saveStoredEmployees(next);
  return next;
}

export function updateEmployee(updatedEmp) {
  const current = getStoredEmployees();
  const next = current.map(e => e.id === updatedEmp.id ? { ...e, ...updatedEmp } : e);
  saveStoredEmployees(next);
  return next;
}

export function deleteEmployee(empId) {
  const current = getStoredEmployees();
  const next = current.filter(e => e.id !== empId);
  saveStoredEmployees(next);
  return next;
}
